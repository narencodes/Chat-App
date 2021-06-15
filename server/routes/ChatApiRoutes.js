const { authenticateToken } = require('../utils/Authentication');
const IndividualChatRouter = require("./IndividualChatApiRoutes");
const { fetchPaginatedChat, createNewChat } = require('../InterActors/ChatInterActors');

module.exports = {
	path : 'chats',
	beforeEnter : authenticateToken,
	children : [
		{
			path : "",
			method : 'get',
			handler : fetchPaginatedChat
		},
		{
			path : "new",
			method : "post",
			handler : createNewChat
		},
		IndividualChatRouter
	]
}