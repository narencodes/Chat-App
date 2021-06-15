const ChatDB = require('../../DB/ChatDB');
const { createNewMessage } = require('./MessageSchemaInterActor');
const { getSenderAndReceiver } = require("../ParticipantInterActors");
const { dispatchMessage } = require('../../WebSocket/SocketHandler');
/**
 * 
 * @param {*} req - HTTP request object
 * @returns Array of message to that user
 */
let getMessages = req => {
	let { chatId, query :{ limit = 30, lmsg_id = "" } } = req;
	let dbQuery = {
		query : [
			{
				_id: chatId
			}
		],
		sortParams : { time : -1 },
		limit,
		isNested : true,
		lastValue : { key : "_id", value : lmsg_id },
		nestedArrayKey : 'messages',
		requirements : {
			messages : 1,
			_id : 0
		}
	}
	return ChatDB.getPaginatedList(dbQuery)
			.then(({ data, hasMore }) => {
				return {
					data: {
						chat_id: chatId,
						hasMore,
						messages: data
					}
				}
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
}
let postMessage = req => {
	let { body : { text, temp_id }, chatId, chatDetail : { participants }, userId} = req;
	if (!text) {
		return Promise.resolve({
			status : 403,
			data : {
				code : 'm403',
				message : 'Message cannot be empty'
			}
		})
	}
	let { sender, receiver } = getSenderAndReceiver(participants, userId);
	let message = createNewMessage({ text, sender_id : sender._id, receiver_id : receiver._id });
	return pushNewMessage(chatId, participants, message, temp_id);
}

let pushNewMessage = (chatId, participants, message, temp_id) => {
	let findQuery = {
		_id: chatId,
		"participants._id" : message.receiver_id
	};
	let updateQuery = {
		$set: {
			last_active_time : message.time
		},
		$inc: {
			total_messages: 1,
			"participants.$.unread_count": 1
		},
		$push: {
			messages: {
				$each: [message],
				$position: 0
			}
		}
	}
	return ChatDB.findAndUpdate(findQuery, updateQuery)
				.then(() => {
					let messageObj = {
						chat_id : chatId,
						temp_id,
						message
					};
					notifyNewMessage(participants, messageObj);
					return {
						status: 204
					}
				})
				.catch(err => {
					console.log(err);
					return Promise.reject(err);
				})
}

let notifyNewMessage = (participants, message) => {
	let rooms = participants.map(participant => participant._id);
	let dispatchObj = {
		$mode : 'newmessage',
		data : message
	};
	dispatchMessage(rooms, dispatchObj);
}

module.exports = {
	getMessages,
	postMessage,
	pushNewMessage,
	notifyNewMessage
}