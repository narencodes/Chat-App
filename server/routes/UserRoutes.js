const express = require('express');
const router = express.Router();
const { getFriendsDetails, deleteUserById, checkIfUserExists, getProfile, getUserData } = require('../InterActors/UserInterActors');
const { authenticateToken } = require('../utils/Authentication');
const { genAuthToken } = require("../Dependencies/AuthToken");

let errorHandler = (res, mess) => {
	res.status(400).send(mess);
}

let handleUserCheck = async (req, res) => {
	let { user_name, email_id } = req.query;
	checkIfUserExists({ user_name, email_id })
		.then(user_found => {
			let data = {
				user_found
			}
			res.status(200).send(data);
		})
		.catch(err => {
			console.log(err);
			errorHandler(res, {
				code : 'u404',
				message : 'Unable to check'
			})
		})
}

/**
 * @route GET /api/user/check
 * @desc To check whether the user exists in DB
 * @access Public
 */
router.get('/check', handleUserCheck);

let fetchCurrentUserProfile = async (req, res) => {
	let { userId } = req;
	getProfile(userId)
		.then(userObj => {
			if (!userObj) {
				errorHandler(res, {
					code : "555",
					message : 'User Deleted'
				});
				return;
			}
			let { _id, user_name, email_id } = userObj;
			let token = genAuthToken({
				_id,
				user_name,
				email_id
			});
			res.cookie('auth_token', token);
			res.status(200).send({
				data: userObj
			});
		})
		.catch(err => {
			console.log(err);
			errorHandler(res, {
				message: 'Unable to fetch Profile'
			});
		})
}

/**
 * @route GET /api/user/profile
 * @desc To Send User data to client based on JSON web token
 * @access Private
 */
router.get('/profile', authenticateToken, fetchCurrentUserProfile);

let fetchFriends = (req, res) => {
	let { userId } = req;
	getFriendsDetails(userId)
		.then(friends => {
			res.status(200).send({
				list : 'friends',
				data : friends
			})
		})
		.catch(err => {
			console.log(err);
			errorHandler(res, {
				code : "515",
				message : 'Unable to fetch friends details'
			})
		})

}

/**
 * @route GET /api/user/friends
 * @desc To fetch basic details of friends
 * @access Private
 */
router.get('/friends', authenticateToken, fetchFriends);

let deleteUser = async (req, res) => {
	let { userId } = req;
	deleteUserById(userId)
		.then(() => {
			res.status(200).send({
				data: {
					code: "300",
					message: 'User Deleted'
				}
			});
		})
		.catch((err) => {
			console.log(err);
			errorHandler(res, {
				code: "304",
				message: 'Unable to delete user'
			});
		})
}

/**
 * @route POST /api/user/delete
 * @desc To Delete the User Account
 * @access Private
 */
router.post('/delete', authenticateToken, deleteUser);

let fetchUserData = (req, res) => {
	getUserData(req)
		.then(userObj => {
			if (!userObj) {
				errorHandler(res, {
					code : "u404",
					message : 'User not found'
				});
				return;
			}
			res.send({
				data: userObj
			});
		})
		.catch(() => {
			errorHandler(res, {
				code : 'u500',
				message: 'Unable to fetch Profile'
			});
		})
};

/**
 * @route GET /api/user/:id
 * @desc To Send required User data to client for joining the chat
 * @access Private
 */
router.get('/:userId', authenticateToken, fetchUserData);

module.exports = router;