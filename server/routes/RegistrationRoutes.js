const express = require('express');
const router = express.Router();
const { registerUser } = require('../InterActors/RegisterInterActors');

let handleRegistration = async (req, res) => {
	let params = req.body;
	registerUser(params)
		.then(() => {
			res.status(200).send({
				created : true
			})
		})
		.catch(err => {
			console.log(err);
			let errObj = err.message ? err : {
				code: "0",
				message: 'Unable to create user'
			}
			res.status(400).send(errObj);
		})
}

/**
 * @route GET /api/register
 * @desc To create a account for user
 * @access Public
 */
router.post('/', handleRegistration);

module.exports = router;