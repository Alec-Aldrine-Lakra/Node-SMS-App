---------------------------------SMS Based Application Created Using Twilio API--------------------------------------

I have used Node along with Express to create a Web Server. The server hosts an interface where one can type his/her text and send message to me or any of my other two friends. The details of me and my friends have been placed in a NoSQL database (Mongo DB). My application is using Twilio's Programmable SMS API to send sms to me and my friends since our numbers have been verified in my Twilio account.One can simply create his free account in Twilio and buy a number from his/her free balance and make use of my code to do the same.I have also used EJS as my template engine to generate dynamic content. For front-end I have Bootstrap to prepare the overall skeleton. The app only works for outbound sms and not inbound currently.