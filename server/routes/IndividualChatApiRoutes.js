const MessageApiRoutes = require("./MessageApiRoutes");
const { markChatAsRead, notifyTyping, fetchUniqueChat, uploadFile, fetchFile } = require('../InterActors/ChatInterActors');
const { validateChatID } = require("../Middlewares/ChatMiddlewares");

module.exports = {
	path : ":chatId",
	beforeEnter : validateChatID,
	children : [
		{
			path : "",
			method : 'get',
			handler : fetchUniqueChat
		},
		{
			path : 'read',
			method : 'post',
			handler : markChatAsRead
		},
		{
			path : "typing",
			method : 'post',
			handler : notifyTyping
		},
		{
			path : "upload",
			method : "post",
			handler : uploadFile
		},
		{
			path : "uploads/:fileName",
			method : "get",
			handler : fetchFile
		},
		MessageApiRoutes
	]
}