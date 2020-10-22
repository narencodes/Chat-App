const bcrypt = require('bcryptjs'); // To encrypted Passwords

const hashPassword = password => {
	return bcrypt.genSalt(10)
			.then(salt => {
				return bcrypt.hashSync(password, salt)
			})
}

const comparePasswordHash = (currentPass, dbPass) => {
	return bcrypt.compareSync(currentPass, dbPass);
}

module.exports = Object.freeze({
	hashPassword,
	comparePasswordHash
})