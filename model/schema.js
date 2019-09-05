const mongoose = require('mongoose');
const schema = mongoose.Schema({
	name:{
		type: String,
		required:true
	},
	phone:{
		type: String,
		required:true
	}
});

module.exports = mongoose.model('contacts',schema);