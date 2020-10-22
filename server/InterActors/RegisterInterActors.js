const { getUserByKeys, saveUser } =  require("./UserInterActors");
const { hashPassword } = require('../Dependencies/Encrypt');

let registerUser = async ({ user_name, email_id, password }) => {
	let query = [ { user_name }, { email_id } ]
	let user = await getUserByKeys(query);
	if (user) {
		return Promise.reject({
			code : "1",
			message : 'User Exists'
		});
	}
	password = await hashPassword(password); // Hashing the password to save to db
	let userObj = {
		user_name,
		email_id,
		password,
		joined_time : Date.now(),
		last_online : Date.now()
	}
	return saveUser(userObj)
			.catch(err => Promise.reject(err))
}

module.exports = {
	registerUser
};
