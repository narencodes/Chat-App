const express = require('express');
const router = express.Router();
const IndividualChatRouter = require("./IndividualChatRoutes");
const { fetchPaginatedChat, createNewChat } = require('../InterActors/ChatInterActors');
const { validateChatID } = require("../Middlewares/ChatMiddlewares");

let errorHandler = (res, err) => {
	res.status(400).send(err);
}

let handleChats = async (req, res) => {
	fetchPaginatedChat(req)
		.then(({ status, data}) => {
			res.status(status).send(data);
		})
		.catch(err => {
			errorHandler(res, err || {
				message: 'Unable to fetch chats'
			});
		})
}

/**
 * @route GET /api/chats
 * @desc To fetch the chats for the particular user
 * @access Private
 */
router.get('/', handleChats);

let handleNewChat = (req, res) => {
	createNewChat(req)
		.then(({ status, data }) => {
			res.status(status).send(data);
		})
		.catch(err => {
			res.status(400).send(err ? err : {
				code : "510",
				message : 'Unable to create chat'
			})
		})
}

/**
 * @route POST /api/chats/new
 * @desc To create a new chat
 * @access Private
 */
router.post('/new', handleNewChat);

// To Handle Message related routes
router.use('/:chatId', validateChatID, IndividualChatRouter);

module.exports = router;