const express = require('express');
const app = express();
require('./routes/MainApiRoutes')(app); // passing the app to initialize all api routes
const mongoose = require('mongoose');
const { DB_CONNECTION_URL } = require('./utils/keys');

let PORT = process.env.PORT || 5001; // process.env.PORT for production and 5001 for development

let server = app.listen(PORT, () => {
	console.log(`Listening on PORT ${PORT}`)
});

//Connect to DB
mongoose.connect(
    DB_CONNECTION_URL, //Gets the DB connection URL from .env file
    {
        useNewUrlParser : true,
        useUnifiedTopology: true
    },
    () => {
      console.log('connected to DB');
      // Pass the server variable to socket handler to initialise web socket
      require('./WebSocket/SocketHandler').init(server);
    }
)


