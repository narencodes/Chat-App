const { registerUser } = require('../InterActors/RegisterInterActors');

let handleRegistration = async (req, res) => {
	let params = req.body;
	return registerUser(params)
		.then(() => {
			return {
				data : {
					created : true
				}
			};
		})
		.catch(err => {
			console.log(err);
			let errObj = err.message ? err : {
				code: "0",
				message: 'Unable to create user'
			}
			return Promise.reject({
				status : 400,
				error : errObj
			});
		})
}

module.exports = {
	path : 'register',
	handler : handleRegistration
};