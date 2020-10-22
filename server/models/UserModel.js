const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
	user_name : {
		type : String,
		required : true,
		min : 5,
		max : 255
	},
	email_id : {
		type : String,
		required : true,
		max : 255
	},
	password : {
		type : String,
		min : 8,
		max : 1024
	},
	joined_time : {
		type : Number,
		default : () => Date.now()
	},
	last_online : {
		type: Number,
		default : () => Date.now()
	},
	img_url : {
		type : String,
		default : ''
	},
	account_type : {
		type : String,
		default : 'email', // Denotes login method like google, fb or email
		required : true
	},
	total_chats : {
		type : Number,
		default : 0
	},
	unread_chats : {
		type : Number,
		default : 0
	},
	status : {
		type : String,
		default : 'offline'
	},
	friends : {
		type : Array,
		default : () => []
	}
}, { minimize : false });

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;