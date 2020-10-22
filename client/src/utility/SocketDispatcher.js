import store from '@/mainStore.js';

let SocketDispatcher = (function () {

	let handleMessage = (message) => {
		let messageMapping = {
			status : statusDispatcher,
			newchat : newChatDispatcher,
			newmessage : messageDispatcher,
			chatmeta : chatMetaHandler,
			msgmeta : msgMetaHandler,
			typing : typingHandler
		}
		let { $mode, data } = message;
		if (messageMapping[$mode]) {
			messageMapping[$mode](data);
		}
	}

	let newChatDispatcher = data => store.commit('chatstore/addChat', data);
	
	let statusDispatcher = data => {
		data.status === 'online' && markFriendChatAsDelivered(data._id);
		store.commit('userstore/setFriendStatus', data);
	};

	let markFriendChatAsDelivered = id => {
		let chatDetail = store.getters['chatstore/getChatByParticipant'](id);
		chatDetail && chatMetaHandler({ chat_id : chatDetail._id });
	}

	let messageDispatcher = ({ chat_id, message, temp_id }) => {
		store.commit('chatstore/appendMessage', { chatId : chat_id, message, temp_id });
		store.commit('chatstore/sendAcceptance', { chat_id, message });
	};

	let chatMetaHandler = data => store.commit('chatstore/updateChatMeta', data);

	let msgMetaHandler = data => store.commit('chatstore/msgMetaHandler', data);

	let typingHandler = data => store.commit('chatstore/typingHandler', data);

	return Object.freeze({
		handleMessage
	})
})();

export default SocketDispatcher;