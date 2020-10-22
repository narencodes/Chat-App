const INVALID_TOKEN = "400";
const INCORRECT_PASSWORD = "2";
const USER_NOT_FOUND = "1";
const USER_DELETED = "555";

const errorTexts = {
	'500' : 'User Exists, Please Login with Google',
	'501' : 'User Exists, please login with password',
	'0' : 'Unable to Register, Try again later.',
	'1001' : 'Unable to Login, Try again later',
	'304' : 'Unable to Delete User',
	'c404' : 'Chat not found',
	'505' : 'Already Connected with the user',
	'510' : 'Unable to create Chat'
}

module.exports = {
	INCORRECT_PASSWORD,
	INVALID_TOKEN,
	USER_NOT_FOUND,
	errorTexts,
	USER_DELETED
}