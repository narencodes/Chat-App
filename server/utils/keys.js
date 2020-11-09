require('dotenv/config'); // To use variables in .env file

let {
	DB_CONNECTION_URL,
	JWT_SECRET_KEY,
	NODE_ENV,
	GAPI_CLIENT_ID
} = process.env;

module.exports = {
	DB_CONNECTION_URL,
	JWT_SECRET_KEY,
	GAPI_CLIENT_ID
}