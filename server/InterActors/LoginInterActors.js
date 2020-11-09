const { comparePasswordHash } = require("../Dependencies/Encrypt");
const { getUser, saveUser } = require('./UserInterActors');
const { genAuthToken } = require("../Dependencies/AuthToken");
const {OAuth2Client} = require('google-auth-library');
const { GAPI_CLIENT_ID } = require('../utils/keys');

const client = new OAuth2Client(GAPI_CLIENT_ID);

const verifyGoogleUser = token => {
	return new Promise(async (resolve, reject) => {
		try {
			await client.verifyIdToken({
				idToken: token,
				audience: GAPI_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
				// Or, if multiple clients access the backend:
				//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
			});
			resolve();
		}
		catch(e) {
			reject();
		}
	});
}

const loginUser = async ({ user_name, pass : password, is_email, email_id,  account_type = 'email', img_url, token }) => {
	let isGoogle = account_type === 'google';
	if (isGoogle) {
		try {
			await verifyGoogleUser(token);
		}
		catch(e) {
			return Promise.reject({
				code: "g404",
				message: 'Invalid google oAuth token'
			});
		}
	}
	let query_key = (isGoogle || is_email ) ? 'email_id' : 'user_name';
	let query = [{
		[query_key]: isGoogle ? email_id : user_name,
	}];
	let requirements = {
		account_type: 1,
		password: 1,
		user_name: 1,
		email_id: 1
	}
	let user = await getUser(query, requirements);
	switch(true) {
		case user && user.account_type !== account_type:
			return Promise.reject({
				code: user.account_type === 'google' ? 500 : 501,
				message: user.account_type === 'google' ?
					'User Exists, please login with Google' :
					'User Exists, please login with password'
			});
		case !user && isGoogle: 
			return handleNewGoogleUser({ user_name, img_url, account_type, email_id })
		case !user: 
				return Promise.reject({
					message: 'User not found'
				})		
		case user && user.account_type === 'google' : 
			return login(user);
		default : 
			let isCorrectPassword = await comparePasswordHash(password, user.password);
			if (isCorrectPassword) {
				return login(user);
			} else {
				return Promise.reject({
					code: "2",
					message: 'Incorrect Password'
				});
			}
	}
}

let handleNewGoogleUser = ({ user_name, img_url, account_type, email_id }) => {
	let userObj = {
		user_name,
		email_id,
		img_url,
		account_type
	}
	return saveUser(userObj)
		.then(login)
		.catch(err => {
			return Promise.reject({
				code: "1001",
				message: 'Unable to Login'
			})
		});
}

let login = userData => getToken(userData);

let getToken = ({ _id, user_name, email_id }) => {
	let payload = {
		_id,
		user_name,
		email_id
	}
	return genAuthToken(payload);
}

module.exports = {
	loginUser
}