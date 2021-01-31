const ChatDB = require("../DB/ChatDB");
const UserDB = require("../DB/UserDB");
const FileDB = require("../DB/FileDB");
const { generateParticipants, getSenderAndReceiver } = require('./ParticipantInterActors');
const { pushNewMessage } = require('./Message/MessageInterActors');
const { getUser } = require("./UserInterActors");
const { getObjectId } = require("../DB/mongoUtil");
const { checkIfSameId } = require("../utils/CommonUtil"); 
const { dispatchMessage } = require('../WebSocket/SocketHandler');
const { createNewMessage } = require("./Message/MessageSchemaInterActor");

let chatRequirements = {
	messages: {
		$slice: ["$messages", 0, 1]
	},
	participants: 1,
	last_active_time: 1,
	created_time: 1,
	total_messages: 1
}

let getChatById = (chatId, requirements) => {
	requirements = requirements || chatRequirements;
	return ChatDB.findById(chatId, requirements)
			.then(chat => chat && chat.length ? chat[0] : null)
			.catch(err => {
				console.log(err);
				return Promise.reject(err);
			})
}

const getChatByParticipants = ( id1, id2 ) => {
	return new Promise((resolve, reject) => {
		let query = [
			{
				participants : [
					{
						_id : id1
					},
					{
						_id : id2
					}
				]
			}
		]
		let requirements = {
			_id : 1
		}
		ChatDB.findInArray(query, requirements)
			.then(chat => {
				let result = chat.length ? chat : null;
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
	})
}

let getFormattedChatObject = (chat, userId) => {
	let { participants, total_messages, _id, created_time, last_active_time, messages } = chat;
	let last_message = messages[0] || {};
	let { unread_count } = participants.find(par => checkIfSameId(par._id, userId)); // getting the unread count of the current user
	// Remove unread counts from the participants array
	participants = participants.map(par => {
		delete par.unread_count;
		return par;
	});
	return {
		_id,
		participants,
		total_messages,
		unread_count,
		last_message,
		created_time,
		last_active_time
	}
}

/**
 * Function to return paginated chats
 * @param {*} req  - HTTP request object
 */
const fetchPaginatedChat = req => {
	let { query : { time = Date.now(), limit }, userId } = req;
	let dBQuery = {
		limit,
		query : {
			"participants._id" : getObjectId(userId),
			"last_active_time": {
				$lt: +time
			}
		},
		requirements : chatRequirements,
		formatQuery : false,
		sortParams: {
			'last_active_time': -1
		}
	};
	return ChatDB.getPaginatedList(dBQuery)
			.then(({ data, hasMore = false }) => {
				let chats = data.map(chat => getFormattedChatObject(chat, userId));
				return {
					status : '200',
					data : {
						list: 'chats',
						data : {
							chats,
							hasMore
						}
					}
				}
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
};

/**
 * 
 * @param {*} req - HTTP Request
 */
let fetchUniqueChat = req => {
	let { chatId, userId } = req;
	return getChatById(chatId)
			.then(chat => {
				chat = getFormattedChatObject(chat, userId);
				return {
					status : 200,
					data : {
						data : chat
					}
				}
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
}

/**
 * 
 * @param {*} req - HTTP Request
 */
let createNewChat = req => { 
	let { userId, body : { receiver_id } } = req;
	if (!receiver_id) {
		return Promise.reject({
			message : 'User id missing'
		})
	}
	let query = [{
		_id: receiver_id
	}];
	return getUser(query)
			.then(user => {
				if (!user) {
					return Promise.reject({
						code: "1",
						message: 'User not found'
					})
				}
				return createChat(userId, receiver_id);
			})
			.catch(err => {
				console.log(err);
				return Promise.reject(err);
			})
}

let createChat = async (currentUserId, receiver_id) => {
	let isChatExists = await getChatByParticipants(currentUserId, receiver_id);
	if (isChatExists) {
		return Promise.resolve({
			status : 403,
			data : {
				code : "505",
				message : 'Chat Already Exists'
			}
		})
	}
	let userIds = [currentUserId, receiver_id];
	let userRequirement = {
		user_name: 1,
		_id: 1,
		img_url: 1,
		friends: 1,
		total_chats: 1
	}
	return UserDB.findById(userIds, userRequirement)
			.then(users => {
				return handleUserChat(users, currentUserId, receiver_id)
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			});
}

let handleUserChat = async (users, currentUserId, receiverId) => {
	let chatObj = {
		participants : generateParticipants(users),
		last_active_time : Date.now(),
		created_time : Date.now()
	}
	return ChatDB.insertOne(chatObj)
			.then(chat => {
				chat = getFormattedChatObject(chat, currentUserId);
				updateUserDetails(users, currentUserId, receiverId);
				notifyNewChat(chat, users);
				return {
					status : 200,
					data : {
						data : {
							created : true,
							chat_details : chat
						}
					}
				};
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
}

// To update the total chats for the user and friends list
let updateUserDetails = (users, currentUserId, receiverId) => {
	users.forEach(user => {
		user.total_chats++;
		let newFriendId = checkIfSameId(user._id, currentUserId) ? receiverId : currentUserId;
		user.friends.push(newFriendId);
		let { friends, total_chats, _id } = user
		let query = [
			{
				_id
			}
		]
		UserDB.updateOne(query, { friends, total_chats });
	})
}

// To notify the participants of the new chat
let notifyNewChat = (chatObj, users) => {
	let rooms = users.map(user => user._id);
	let param = {
		$mode: 'newchat',
		data: chatObj
	}
	dispatchMessage(rooms, param);
}

let handleMessageMeta = async (data) => {
	let { chat_id, is_delivered, is_read, msg_id, userId } = data;
	let params = {
		chat_id,
		msg_id,
		is_read,
		is_delivered
	}
	let chatDetail = await getChatById(chat_id);
	let notifyParams = {
		chatId : chat_id,
		$mode : 'msgmeta',
		userId,
		chatDetail
	}
	notifyMeta(notifyParams, params);
	changeChatMeta({ ...params, chatId : chat_id, userId });
}

let markChatAsRead = req => {
	let { chatId, userId } = req;
	notifyMeta(req, { read : true });
	return changeChatMeta({ chatId, userId, is_read : true })
			.then(() => {
				return {
					status: 204
				}
			})
			.catch(() => {
				return Promise.reject();
			})
}

// To notify the receiver of whether the whole chat is read (or) whether a message is read/delivered
let notifyMeta = ({ chatId, chatDetail : { participants }, userId, $mode = "chatmeta"}, params = {}) => {
	let data = {
		$mode,
		data : {
			chat_id: chatId,
			...params
		}
	}
	let { receiver } = getSenderAndReceiver(participants, userId);
	dispatchMessage(receiver._id, data);
}

let changeChatMeta = ({ isGlobal = false, chatId, userId, is_delivered = false, is_read = false, msg_id = "" }) => {
	// convert is_read value to boolean
	// if is_read is true, then is_delivered will also be true
	is_read = !!is_read;
	is_delivered = isGlobal || is_read || !!is_delivered;	
	let findQuery = {
		"participants._id" : getObjectId(userId)
	}
	let $set = {
		"messages.$[elem].is_delivered" : is_delivered
	}
	if (!isGlobal) {
		findQuery._id = chatId;
		$set["messages.$[elem].is_read"] = is_read;
	}
	is_read && ($set["participants.$.unread_count"] = 0);
	let updateQuery = {
		$set
	}
	// To update the message only if the receiver_id is currentUserId and the message is not marked read already
	let filters = {
		"elem.is_read": false,
		"elem.receiver_id": getObjectId(userId)
	}
	msg_id && (filters['elem._id'] = getObjectId(msg_id));
	let arrayFilters = [ filters ];
	return ChatDB.findAndUpdate(findQuery, updateQuery, arrayFilters, !isGlobal)
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
}


let notifyTyping = req => {
	let { body : { is_typing }, userId, chatId, chatDetail : { participants } } = req;
	let { receiver } = getSenderAndReceiver(participants, userId);
	let data = {
		$mode : 'typing',
		data : {
			chat_id: chatId,
			is_typing
		}
	}
	dispatchMessage(receiver._id, data);
	return Promise.resolve({
		status : 200
	})
}

let genFileURL = (chatId, name) => {
	return `/api/chats/${chatId}/uploads/${name}`;
}

let uploadFile = req => {
	let { chatId, body : { file : { name, buffer, size, type }, temp_id }, chatDetail : { participants }, userId } = req;
	let uniqueFileName = `${Date.now()}_${name}`;
	let fileObj = {
		buffer: Buffer.from(buffer.split(';base64,')[1], "base64"),
		name : uniqueFileName,
		size,
		type
	}
	return FileDB.insertOne(fileObj)
			.then(data => {
				let fileURL = genFileURL(chatId, data._id);
				let file = {
					name,
					url : fileURL,
					size,
					type
				};
				let { sender, receiver } = getSenderAndReceiver(participants, userId);
				let message = createNewMessage({
					file,
					type : 'file',
					sender_id : sender._id,
					receiver_id : receiver._id
				})
				return pushNewMessage(chatId, participants, message, temp_id);
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			});
}

let fetchFile = req => {
	let { params : { fileName } } = req;
	return FileDB.findById(fileName)
			.then(data => {
				if (!data) {
					return {}
				}
				return {
					data : data.length ? data[0].buffer.buffer : {
						code : 'f400',
						message : 'file not found'
					},
					type : data.length ? data[0].type : 'application/json'
				}
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			});
}

module.exports = {
	fetchPaginatedChat,
	fetchUniqueChat,
	createNewChat,
	getChatById,
	markChatAsRead,
	notifyTyping,
	changeChatMeta,
	handleMessageMeta,
	uploadFile,
	fetchFile
}