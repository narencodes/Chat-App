require('dotenv/config'); // To use variables in .env file

let {
	DB_CONNECTION_URL,
	JWT_SECRET_KEY,
	NODE_ENV
} = process.env;

module.exports = {
	DB_CONNECTION_URL,
	JWT_SECRET_KEY,
	IS_PRODUCTION : NODE_ENV === 'production'
}