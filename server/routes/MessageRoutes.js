const express = require('express');
const router = express.Router();
const { getMessages, postMessage } = require("../InterActors/Message/MessageInterActors");


let handleMessages = (req, res) => {
	getMessages(req)
		.then(({ status, data }) => {
			res.status(status).send(data)
		})
}

/**
 * @route GET /api/chats/:id/messages
 * @desc To create a new chat
 * @access Private
 */
router.get('/', handleMessages);

let handleSendMessage = (req, res) => {
	postMessage(req)
		.then(({ status }) => {
			res.status(status).send();
		})
		.catch(err => {
			err = err || {
				code : 'm400',
				message : 'Something went wrong'
			}
			res.status(400).send(err);
		})
}
/**
 * @route POST /api/chats/:id/messages
 * @desc To send a new message
 * @access Private
 */
router.post('/', handleSendMessage);

module.exports = router;