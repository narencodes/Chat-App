const express = require('express');
const router = express.Router();
const MessageRouter = require("./MessageRoutes");
const { markChatAsRead, notifyTyping, fetchUniqueChat, uploadFile, fetchFile } = require('../InterActors/ChatInterActors');


/**
 * @route POST /api/chats/:chatId
 * @desc To get the chat detail of a particular chat
 * @access Private
 */
router.get('/', (req, res) => {
	fetchUniqueChat(req)
		.then(({ status, data }) => res.status(status).send(data))
		.catch(() => {
			res.status(400).send({
				message : 'Something went wrong'
			})
		})
})

let handleChatMeta = (req, res) => {
	markChatAsRead(req)
		.then(({ status }) => {
			res.status(status).end();
		})
		.catch(() => {
			res.status(400).send({
				code : 'meta400',
				message : 'Something went wrong'
			})
		})
}
/**
 * @route POST /api/chats/:chatId/read
 * @desc To mark the messages as delivered/read
 * @access Private
 */
router.post('/read', handleChatMeta);


let handleTyping = (req, res) => {
	notifyTyping(req)
		.then(({ status }) => {
			res.status(status).send();
		})
		.catch(() => {
			res.status(400).send({
				code: 't400',
				message: 'Something went wrong'
			})
		})
}

router.post('/typing', handleTyping);

let handleFileUpload = (req, res) => {
	uploadFile(req)
		.then(() => {
			res.status(204).end();
		})
		.catch(() => {
			res.status(400).send({
				code: 'u400',
				message: 'Something went wrong'
			})
		})
}

router.post('/upload', handleFileUpload);

let handleFileFetch = (req, res) => {
	fetchFile(req)
		.then(({ data, type }) => {
			res.setHeader('Content-Type', type);
			res.send(data);
		})
		.catch(() => {
			res.status(400).send({
				code: 'u400',
				message: 'Something went wrong'
			})
		})
}

router.get('/uploads/:fileName', handleFileFetch);

// To Handle Message related routes
router.use('/messages', MessageRouter);

module.exports = router