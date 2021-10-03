const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
	time: {
		type: Number,
		default: Date.now()
	},
	sender_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required : true
	},
	is_delivered: {
		type: Boolean,
		default: false
	},
	is_read: {
		type: Boolean,
		default: false
	},
	type: { // To define msg type [ text, file,etc.. ]
		type: String,
		default: 'text'
	},
	text: {
		type: String
	},
	file : {
		name : {
			type : String
		},
		url : {
			type : String
		},
		size : {
			type : Number
		},
		type : {
			type : String
		}
	}
})

let Message = mongoose.model('message', messageSchema);

module.exports = Message;