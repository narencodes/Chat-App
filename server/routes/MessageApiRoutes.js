const { getMessages, postMessage } = require("../InterActors/Message/MessageInterActors");

module.exports = {
	path : "messages",
	children : [
		{
			path : "",
			method : "get",
			handler : getMessages
		},
		{
			path : "",
			method : "post",
			handler : postMessage
		}
	]
}