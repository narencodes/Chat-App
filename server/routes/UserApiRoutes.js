const { getFriendsDetails, deleteCurrentUser, checkIfUserExists, getCurrentUserProfile, getUserData } = require('../InterActors/UserInterActors');
const { authenticateToken } = require('../utils/Authentication');

const userApiBeforeEnter = req => {
	if (/check/.test(req.url)) {
		return;
	}
	return authenticateToken(req);
}

module.exports = {
	path : 'user',
	beforeEnter : userApiBeforeEnter,
	children : [
		{
			path : "",
			method : 'delete',
			handler : deleteCurrentUser
		},
		{
			path : "check",
			method : "get",
			handler : checkIfUserExists
		},
		{
			path : '',
			method : "get",
			handler : getCurrentUserProfile
		},
		{
			path : "friends",
			method : "get",
			handler : getFriendsDetails
		},
		{
			path : ":userId",
			method : 'get',
			handler : getUserData
		}
	]
}