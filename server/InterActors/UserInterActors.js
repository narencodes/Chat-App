/* This file contains common functions related to user */

const UserDB = require('../DB/UserDB');

/**
 * 
 * @param {*} userObj 
 * @returns generated user with ID
 */
let saveUser = userObj => {
	return UserDB.insertOne(userObj)
			.then(user => {
				return user
			})
			.catch(err => {
				return Promise.reject(err);
			})
}

// Pass a query to this function to find a unique user based on that query
/**
 * 
 * @param {*} query 
 * @return { userObj || false } - on finding a user or return false
 */
const getUser = (query, requirement = {}) => {
	return UserDB.findOne(query, requirement)
		.then(user => {
			return (user || false); // return User Object on finding a user else returns false
		})
		.catch(err => {
			return Promise.reject(err);
		})
}

let checkIfUserExists = async ({ user_name, email_id }) => {
	let query = user_name ? 'user_name' : 'email_id';
	let value = user_name || email_id;
	query = [{
		[query]: value // Reg expression to match both lower and uppercases
	}]
	let user = await getUser(query);
	return !!user;
}

const getUserByKeys = (query = [], requirement = {}) => {
	return UserDB.findByKeys(query, requirement)
			.then(user => {
				return user;
			})
			.catch(err => {
				return Promise.reject(err);
			})
}

let getProfile = (user_id, requirements) => {
	let query = [{
		_id: user_id
	}]
	// We don't need password and friends from the database
	requirements = requirements || {
		password: 0,
		friends: 0,
		__v: 0
	}
	return getUser(query, requirements)
			.then(data => data)
			.catch(err => Promise.reject(err));
}

let getUserData = req => {
	let { userId : currentUserId, params : { userId } } = req; 
	let requirements = {
		friends : 1,
		user_name : 1
	}
	return getProfile(userId, requirements)
			.then(data => {
				if (!data) {
					return;
				}
				return {
					user_name : data.user_name,
					is_friend : data.friends.includes(currentUserId)
				};
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
}

/**
 * 
 * @param {*} user_id 
 * @returns Array of user_id that are friends to the particular user
 */

const getFriends = user_id => {
	let query = [
		{
			_id : user_id
		}
	];
	let requirements = { friends : 1, _id : 0 };
	return getUser(query, requirements)
			.then(({ friends }) => {
				return friends;
			})
			.catch(err => {
				console.log(err);
				return Promise.reject();
			})
}

/**
 * 
 * @param {*} query 
 * @param {*} requirement 
 * @return Multiple Users match the query
 */

const fetchUsers = (query, requirement = {}) => {
	return UserDB.findMany(query, requirement)
			.then(data => {
				return data
			})
			.catch(err => {
				return Promise.reject(err);
			})
}

const getUserByIds = (ids = [], requirements) => {
	return UserDB.findById(ids, requirements)
			.then(data => {
				return data
			})
			.catch(err => {
				return Promise.reject(err);
			})
}

/**
 * 
 * @param {*} user_id 
 * @returns Friends basic details
 */

const getFriendsDetails = user_id => {
	return new Promise((resolve, reject) => {
		getFriends(user_id)
			.then(friends => {
				if (!friends.length) {
					return resolve(friends);
				}
				let requirement = {
					_id: 1,
					user_name: 1,
					img_url: 1,
					status: 1,
					last_online: 1
				}
				getUserByIds(friends, requirement)
					.then(data => {
						resolve(data);
					})
			})
			.catch(reject)
	})
}

const updateStatus = (user_id, status, last_online) => {
	let query = [{
		_id : user_id
	}]
	let data = {
		status,
		last_online
	}
	UserDB.updateOne(query, data)
		.catch(err => {
			console.log(err);
		});
}

const deleteUserById = user_id => {
	let query = [ { _id : user_id } ]
	return UserDB.deleteOne(query)
			.then(data => data)
			.catch(err => Promise.reject(err))
}


module.exports = Object.freeze({
	saveUser,
	getUser,
	getProfile,
	checkIfUserExists,
	getFriends,
	getUserData,
	getFriendsDetails,
	getUserByKeys,
	fetchUsers,
	updateStatus,
	deleteUserById
})