import SocketDispatcher from './SocketDispatcher';

let SocketInstance;

export let initializeSocket = async (user_id) => {
	let origin = (process.env.NODE_ENV === 'dev') ? "http://localhost:5000" : "/";
	let socketio = await import("socket.io-client");
	SocketInstance = socketio.connect(origin, {
		query: {
			user_id
		}
	});
	addListeners();
}

let addListeners = () => {
	// will send all the message through 'incoming' event
	SocketInstance.on('incoming', SocketDispatcher.handleMessage);
}

export let emitMessage = data => {
	SocketInstance.emit('outgoing', data);
}

export let closeSocket = () => {
	SocketInstance.close();
}