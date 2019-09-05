const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = require('twilio')(process.env.ID, process.env.TOKEN);
const mongoose = require('mongoose');
const contacts = require('./model/schema');

//database connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (err,db)=>{
  if(err)
    throw err;
  else
    console.log('Connected To MongoDB')
});

//Index Page
app.get('/',(req,res)=>{
    contacts.find({},{_id:0,name:1,phone:1}).then(result=>{
      res.render('index',{names: result, error: null, message: null});
    })
    .catch(err=>{
        res.render('index',{names: null, error: `Database connectivity issue`, message: null});  
    })
})

/*When your Twilio number receives an incoming message, Twilio will send a post HTTP request to a server you control.
This callback mechanism is known as a webhook. When Twilio sends your application a request, 
it expects a response in the TwiML XML format telling it how to respond to the message.
Before Twilio can send your application webhook requests, you'll need to make your application accessible over the Internet.
We use a tool called ngrok, which gives your local development server a publicly accessible URL*/

//reply to incoming messages
app.post('/sms',(req,res)=>{
	 const twiml = new MessagingResponse();
   twiml.message('The Robots are coming! Head for the hills!');
   res.writeHead(200, {'Content-Type': 'text/xml'});
   res.end(twiml.toString());
})

//send sms from the browser
app.post('/*',(req,res)=>{
    const fname = encodeURIComponent(req.body.contacts.trim());
    contacts.find({},{_id:0,name:1,phone:1}).then(result=>{
          for(let i=0; i<result.length; i++)
          {
              if(result[i]['name'] === fname)
              {
                  client.messages
                    .create({
                     body: req.body.text,
                     from: process.env.FROM,
                     to: result[i]['phone']
                   })
                   .then(message =>{
                      res.render('index',{names: result, error : null, message: `Message Sent Successfully`});
                   })
                   .catch(err => {
                      res.render('index',{names: result, error : `Error Could Not Send !`, message: null});  
                   });
                   break;
              }
          }
      })
      .catch(err=>{
          res.render('index',{names: null, error: `Database Connectivity Issue !`, message: null});  
      })
})

//404 page
app.get('*',(req,res)=>{
  res.render('nfound');
})

app.listen(process.env.PORT,()=>{
	console.log(`Server started at port ${process.env.PORT}`);
})

