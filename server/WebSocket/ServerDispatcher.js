let messageMetaHandler;
let handleChatMeta;
let dispatchMessage;
let getFriends;
let updateStatus
Promise.resolve()
	.then(() => {
		let { changeChatMeta, handleMessageMeta } = require("../InterActors/ChatInterActors");
		getFriends = require('../InterActors/UserInterActors').getFriends;
		updateStatus = require('../InterActors/UserInterActors').updateStatus;
		messageMetaHandler = handleMessageMeta;
		handleChatMeta = changeChatMeta;
		dispatchMessage = require("./SocketHandler").dispatchMessage;
	})
let ServerDispatcher = (function() {

	let handleMessage = (userId, { $mode, data }) => {
		let modeMapping = {
			'msgmeta': messageMetaHandler
		}
		modeMapping[$mode] && modeMapping[$mode]({ ...data, userId });
	}

	return {
		handleMessage
	}
})();

let statusHandler = (user_id, status) => {
	let last_online = Date.now();
	getFriends(user_id)
		.then(friends => {
			if (!friends || !friends.length) {
				return;
			}
			let param = {
				$mode: 'status',
				data: {
					id: user_id,
					status,
					last_online
				}
			}
			dispatchMessage(friends, param);
		})
		.catch(err => {
			console.log(err);
		})
	updateStatus(user_id, status, last_online);
	status === 'online' && handleChatMeta({ isGlobal : true, userId : user_id })
}

module.exports = {
	ServerDispatcher,
	statusHandler
};