const { loginUser } = require("../InterActors/LoginInterActors");

let handleLogin = req => {
	let params = req.body;
	return loginUser(params)
			.then(token => {
				return {
					data : {
						token,
						logged_in : true
					},
					cookies : {
						auth_token : token
					}
				}
			})
			.catch(err => Promise.reject(err));
	}

module.exports = {
	path : "login",
	handler : handleLogin
}