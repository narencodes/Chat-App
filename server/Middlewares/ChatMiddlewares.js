const { getChatById } = require("../InterActors/ChatInterActors");
const { checkIfSameId } = require("../utils/CommonUtil");

let validateChatID = (req, res, next) => {
	let { chatId } = req.params;
	let requirements = {
		participants : 1
	}
	getChatById(chatId, requirements)
		.then(chat => validateChatDetails(req, res, chat, next))
		.catch((err) => {
			console.log(err);
			res.status(400).send({
				code : 'c400',
				message : 'Operation failed'
			})
		})
}

let validateChatDetails = (req, res, chat, next) => {
	if (!chat) {
		return res.status(404).send({
			code: 'c404',
			message: 'chat id not found'
		});
	};
	let { userId } = req;
	// Checking if the API caller has access to the chat
	let isCurrentUserParticipant = chat.participants.find(participant => checkIfSameId(participant._id, userId)); // converting objectId to string
	if (!isCurrentUserParticipant) {
		return res.status(403).send({
			code: 'c403',
			message: 'Access denied to the chat'
		})
	}
	req.chatDetail = chat;
	req.chatId = chat._id;
	next();
}

module.exports = {
	validateChatID
}