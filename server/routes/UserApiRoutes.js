const {
	getFriendsDetails,
	deleteCurrentUser,
	checkIfUserExists,
	getCurrentUserProfile,
	getUserData,
	updateProfilePhoto,
	fetchProfilePhoto
} = require('../InterActors/UserInterActors');

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
			path : "upload",
			method : "post",
			handler : updateProfilePhoto
		},
		{
			path : "pic/:picId",
			method : "get",
			handler : fetchProfilePhoto
		},
		{
			path : ":userId",
			method : 'get',
			handler : getUserData
		}
	]
}