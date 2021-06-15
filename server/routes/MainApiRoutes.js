const express = require('express');
const UserApiRoutes = require("./UserApiRoutes");
const RegistrationApiRoutes = require('./RegistrationApiRoutes');
const LoginApiRoutes = require('./LoginApiRoutes');
const ChatApiRoutes = require('./ChatApiRoutes');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const Router = require('./serverRouter');
const { getParser } = require("./routeUtils");

const initializeRoutes = app => {
	/**
	 * Declare Middlewares here
	 */
	app.use(getParser()); // Custom Parser to parse form data and json
	app.use(compression()); // To compress API responses.
	app.use(cors()); // To remove cross-origin error
	
	//Define all the api routes here

	Router.push(app, [
		LoginApiRoutes,
		RegistrationApiRoutes,
		UserApiRoutes,
		ChatApiRoutes
	]);
	
	// Handle production
	// Serve static files from 'public' folder
	let serverPath = path.resolve("./server");
	let expressStaticGzip = require("express-static-gzip");
	app.use("/", expressStaticGzip(serverPath + "/public"));

	// Load index.html for all routes except '/api' routes
	app.get(/.*/, (req, res) => {
		res.sendFile(serverPath + '/public/index.html');
	});
};

module.exports = initializeRoutes;