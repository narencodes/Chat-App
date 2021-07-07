const jwt = require('jsonwebtoken'); // Web tokens for authentication
const { JWT_SECRET_KEY } = require('../utils/keys');

let genAuthToken = ({ id, name, email_id }) => {
	const payload = {
		id,
		name,
		email_id
	}
	let token = jwt.sign({ user : payload }, JWT_SECRET_KEY);
	return `ChatApp ${token}`;
}

let verifyToken = token => {
	token = token.split(" ")[1];
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
			if (err) {
				return reject(err);
			}
			return resolve(data.user);
		})
	})
}

module.exports = Object.freeze({
	genAuthToken,
	verifyToken
})