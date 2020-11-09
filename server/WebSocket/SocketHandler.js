const socketio = require('socket.io');
const { ServerDispatcher, statusHandler } = require('./ServerDispatcher');

let io;

let init = server => {
	io = socketio(server);
	io.on('connection', handleNewSocketConnection);
}

let handleNewSocketConnection = socket => {
	let { user_id } = socket.handshake.query;
	socket.join(user_id);
	statusHandler(user_id, 'online');
	console.log(`${user_id} connected`);
	socket.on('disconnect', () => {
		if (!socket.adapter.rooms[user_id]) {
			console.log(`${user_id} disconnected`);
			statusHandler(user_id, 'offline');
		}
	})
	socket.on('outgoing', data => ServerDispatcher.handleMessage(user_id, data));
}

/**
 * 
 * @param { String, Array } rooms - rooms to which the data is to be emitted
 * @param { Object } data - data to be emitted
 */
let dispatchMessage = (rooms, data) => {
	// converting rooms to array to loop through
	rooms = Array.isArray(rooms) ? rooms : [ rooms ];
	rooms.forEach(room => {
		io.to(room).emit("incoming", data);
	})
}

module.exports = Object.freeze({
	init,
	dispatchMessage
})