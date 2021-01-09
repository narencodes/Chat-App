import SocketDispatcher from './SocketDispatcher';

let SocketInstance;

export let initializeSocket = user_id => {
	import("socket.io-client")
		.then(socket => {
			let origin = (process.env.NODE_ENV !== 'production') ? "http://localhost:5000" : "/";
			SocketInstance = socket.connect(origin, {
				query: {
					user_id
				}
			});
			addListeners();
		})
}

let addListeners = () => {
	// will send all the message through 'incoming' event
	SocketInstance.on('incoming', SocketDispatcher.handleMessage);
	SocketInstance.on('disconnect', () => console.log('disconnected from server'));
	SocketInstance.on('connect', () => console.log('connected to server'));
}

export let emitMessage = data => {
	SocketInstance.emit('outgoing', data);
}

export let closeSocket = () => {
	SocketInstance.close();
}