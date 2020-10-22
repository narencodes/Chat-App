const Participant = require('../models/ParticipantModel');
const { checkIfSameId } = require("../utils/CommonUtil"); 

const generateParticipants = users => {
	return users.map(user => {
				let { user_name, _id, img_url } = user;
				return new Participant({
					user_name,
					_id,
					img_url
				});
			});
}

let getSenderAndReceiver = (participants, userId) => {
	let sender = {},
		receiver = {};
	participants.forEach(participant => {
		if (checkIfSameId(participant._id, userId)) {
			sender = participant;
		} else {
			receiver = participant;
		}
	});
	return {
		sender,
		receiver
	}
}

module.exports = {
	generateParticipants,
	getSenderAndReceiver
}

