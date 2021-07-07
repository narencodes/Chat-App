const { verifyToken } = require("../Dependencies/AuthToken");

let getAuthCookie = req => {
	let cookies = req.headers.cookie || '';
	let auth_cookies = cookies.match(/auth_token=(.*);?/);
	return auth_cookies && auth_cookies[1].replace('%20', " ").replace(";", "");
}

let handleInvalidToken = () => {
	return Promise.reject({
		status : 401,
		error : {
			code: "400",
			message: 'Invalid Token'
		}
	});
}

let authenticateToken = req => {
	let token = req.headers['authorization'] || getAuthCookie(req); // Getting the token from header { format : ChatApp token }
	if (!token) {
		return Promise.reject({
			status : 401,
			error : {
				code: "401",
				message: 'Access denied'
			}
		});
	}
	// To verify whether the token is correct
	return verifyToken(token)
			.then(user => {
				if (!user.id) {
					return handleInvalidToken();
				}
				req.userId = user.id;
			})
			.catch(err => {
				console.log(err);
				return handleInvalidToken();
			})
};

module.exports = {
	authenticateToken
}