const UserApiRoutes = require("./UserApiRoutes");
const RegistrationApiRoutes = require('./RegistrationApiRoutes');
const LoginApiRoutes = require('./LoginApiRoutes');
const ChatApiRoutes = require('./ChatApiRoutes');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const Router = require("@naren_codes/server-router");
const { getParser } = require("@naren_codes/request-parser");

const initializeRoutes = app => {
	/**
	 * Declare Middlewares here
	 */
	app.use(getParser()); // Custom Parser to parse form data and json
	app.use(compression()); // To compress API responses.
	app.use(cors()); // To remove cross-origin error
	
	//Define all the api routes here
	new Router(app, {
		routes : [
			LoginApiRoutes,
			RegistrationApiRoutes,
			UserApiRoutes,
			ChatApiRoutes
		],
		// For static based compressions and serving index.html on all routes
		static : {
			path : path.resolve("./server/public")
		}
	});
};

module.exports = initializeRoutes;