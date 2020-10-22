const Message = require("../../models/MessageModel");

let createNewMessage = ({ text, sender_id, receiver_id, type = "text", file }) => {
	let isFile = type === 'file'
	let messageObj = {
		type,
		sender_id,
		receiver_id,
		time: Date.now()
	}
	messageObj[isFile ? 'file' : 'text'] = isFile ? file : text;
	return new Message(messageObj);
}

module.exports = {
	createNewMessage
}