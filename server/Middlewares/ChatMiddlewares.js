const { getChatById } = require("../InterActors/ChatInterActors");
const { checkIfSameId } = require("../utils/CommonUtil");

let validateChatID = (req) => {
	let { chatId } = req.params;
	let requirements = {
		participants : 1
	}
	return getChatById(chatId, requirements)
			.then(chat => validateChatDetails(req, chat))
			.catch((err) => Promise.reject(err));
}

let validateChatDetails = (req, chat) => {
	if (!chat) {
		return Promise.reject({
			status : 404,
			error : {
				code: 'c404',
				message: 'chat id not found'
			}
		})
	};
	let { userId } = req;
	// Checking if the API caller has access to the chat
	let isCurrentUserParticipant = chat.participants.find(participant => checkIfSameId(participant._id, userId)); // converting objectId to string
	if (!isCurrentUserParticipant) {
		return Promise.reject({
			status : 401,
			error : {
				code: 'c403',
				message: 'Access denied to the chat'	
			}
		});
	}
	req.chatDetail = chat;
	req.chatId = chat._id;
}

module.exports = {
	validateChatID
}