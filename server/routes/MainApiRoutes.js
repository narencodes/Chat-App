const express = require('express');
const UserRoutes = require("./UserRoutes");
const RegistrationRoutes = require('./RegistrationRoutes');
const LoginRoutes = require('./LoginRoutes');
const ChatRoutes = require('./ChatRoutes');
const { authenticateToken } = require('../utils/Authentication');
const { IS_PRODUCTION } = require('../utils/keys');
const path = require('path');
const compression = require('compression');

const initializeRoutes = app => {
    //Initialize body parser to get request body across all apis
    app.use(express.json({ limit : '50mb' }));
	app.use(compression()); // To compress API responses.
    //Define all the api routes here
    /**
     * app.get to declare the routes here.
     * app.use to use the routes declared in other files.
     */
	app.use('/api/user', UserRoutes); // Routes regarding user etc..
	app.use('/api/register', RegistrationRoutes); // Routes regarding user creation
	app.use('/api/login', LoginRoutes); //Routes regarding user login
	app.use('/api/chats', authenticateToken, ChatRoutes); //Routes regarding Chats

	// Handle production
	if (true) {
		// Serve static files from 'public' folder
		let serverPath = path.resolve("./server")
		let expressStaticGzip = require("express-static-gzip");
		app.use("/", expressStaticGzip(serverPath + "/public"));

		// To serve service worker file
		app.get("/sw.js", (req, res) => {
			res.sendFile(`${serverPath}/sw.js`);
		});

		// Load index.html for all routes except '/api' routes
		app.get(/.*/, (req, res) => {
			res.sendFile(serverPath + '/public/index.html');
		});
	}
}

module.exports = function(app) {
    initializeRoutes(app);
}