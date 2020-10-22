const mongoose = require('mongoose');

let participantSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	img_url: {
		type: String,
		default: ''
	},
	user_name: {
		type: String,
		default: ''
	},
	unread_count: {
		type: Number,
		default: 0
	}
});

let Participant = mongoose.model("participant", participantSchema);

module.exports = Participant