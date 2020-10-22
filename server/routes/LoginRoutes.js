const express = require('express');
const router = express.Router();
const { loginUser } = require("../InterActors/LoginInterActors");

let handleLogin = (req, res) => {
	let params = req.body;
	loginUser(params)
		.then(token => {
			res.status(200).send({
				logged_in : true,
				token
			})
		})
		.catch(err => {
			console.log(err);
			res.status(400).send(err);
		})
}	

/**
 * @route GET /api/login
 * @desc To Verify User sign-in to send JSON web token
 * @access Public
 */
router.post('/', handleLogin)

module.exports = router;