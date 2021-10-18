const mongoose = require('mongoose');

let ChatSchema = new mongoose.Schema({
	created_time : { // Chat created time
		type : Number,
		default : () => Date.now()
	},
	participants : { // Participants of the chat
		type : Array,
		default : () => []
	},
	last_active_time : {
		type : Number,
		default : Date.now()
	},
	messages : { // Message related to this particular chat
		type : Array,
		default : () => []
	}

}, { minimize : false });

let ChatModel = mongoose.model("chats", ChatSchema);

module.exports = ChatModel;