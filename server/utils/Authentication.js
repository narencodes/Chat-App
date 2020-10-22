const { verifyToken } = require("../Dependencies/AuthToken");

let getAuthCookie = req => {
	let cookies = req.headers.cookie || '';
	let auth_cookies = cookies.match(/auth_token=(.*);/);
	return auth_cookies && auth_cookies[1].replace('%20', " ");
}

let authenticateToken = (req, res, next) => {
	let token = req.headers['authorization'] || getAuthCookie(req); // Getting the token from header { format : ChatApp token }
	if (!token) {
		res.status(401).send({
			code: "401",
			message: 'Access denied'
		})
		return;
	}
	// To verify whether the token is correct
	verifyToken(token)
		.then(user => {
			if (!user._id) {
				throw Error("Invalid Token");
			}
			req.userId = user._id;			
			next();
		})
		.catch(err => {
			console.log(err);
			res.status(400).send({
				code: "400",
				message: 'Invalid Token'
			})
		})
};

module.exports = {
	authenticateToken
}