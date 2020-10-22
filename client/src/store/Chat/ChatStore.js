import Vue from 'vue';
import mainStore from '@/mainStore.js';
import actions from './ChatAction';
import { getFriendDetailFromChat } from "@/utility/chatUtil";
import { checkIfObjectId } from "@/utility/utils";
import { emitMessage } from "@/utility/websocket"; 
import { showNotification } from "@/service/notification";

let notifyUser = (msg, id) => {
	// Dont show the notication if the sender is current user
	let { sender_id, text } = msg;
	if (sender_id === getCurrentUser()._id) {
		return;
	}
	let params = {
		title : getFriendDetail(sender_id).user_name,
		body : text,
		onClick : () => Vue.prototype.$goTo('Chat', { id })
	}
	showNotification(params);
};

let getCurrentUser = () => mainStore.state.userstore.currentUser;

let getFriendDetail = id => mainStore.getters["userstore/getFriendDetail"](id);

let getMessageObj = () => ({
	transcript: {},
	transcriptOrder: [],
	hasMore: false,
	lmsg_id: ''
})

let setFriendsDetails = chat => {
	let newFriend = getFriendDetailFromChat(chat);
	newFriend.status = 'online'; // The user will be online on new status
	mainStore.commit('userstore/setFriendsDetails', [newFriend]);
}

let state = {
	chatIds : [],
	chatSummary: {
		totalChats: 0,
		unreadChats: 0,
	},
	chats : {},
	messages : {},
	isChatLoaded : false,
	chatLoadData : {
		time : '', 
		limit : 20,
		hasMore : false
	},
	selectedChatId : ''
}

let mutations = {
	addChat(state, data) {
		let { chatIds, chats, messages } = state;
		let chatId = data._id;
		if (chatIds.includes(chatId)) {
			return;
		}
		setFriendsDetails(data);
		chatIds.unshift(chatId);
		Vue.set(messages, chatId, getMessageObj());
		delete data.messages;
		Vue.set(chats, chatId, data);
		state.chatSummary.totalChats += 1;
		state.isChatLoaded = true;
	},

	setChats(state, { chats : data, hasMore }) {
		let { chatIds, chats, chatLoadData, messages } = state;
		data.forEach(chat => {
			let chatId = chat._id;
			chatIds.push(chatId);
			Vue.set(chats, chatId, chat);
			Vue.set(messages, chatId, getMessageObj());
		});
		chatLoadData.hasMore = hasMore;
		chatLoadData.time = data.pop().last_active_time;
		state.isChatLoaded = true;
	},

	setMessages({ messages }, { chat_id, hasMore, messages : msg }) {
		let chatMessage = messages[chat_id] || getMessageObj();
		if (!msg.length) {
			return;
		}
		msg.forEach(message => {
			chatMessage.transcriptOrder.push(message._id);
			chatMessage.transcript[message._id] = message;
		})
		chatMessage.hasMore = hasMore;
		chatMessage.lmsg_id = msg.pop()._id;
		Vue.set(messages, chat_id, chatMessage);
	},

	sendAcceptance({ selectedChatId }, { chat_id, message }) {
		let { _id } = getCurrentUser();
		if (_id !== message.receiver_id) {
			return;
		}
		let isChatOpen = chat_id === selectedChatId;
		let params = {
			is_delivered: true,
			is_read: isChatOpen,
			chat_id,
			msg_id : message._id
		}
		emitMessage({
			$mode : 'msgmeta',
			data : params
		})
	},

	setChatDetail({ chats }, data) {
		Vue.set(chats, data._id, data);
	},

	async appendMessage({ chats, messages }, { chatId, message, temp_id }) {
		let chat = chats[chatId];
		!chat && await this.dispatch('chatstore/getChatById', chatId); // If there is no chat fetch chat on receiving message
		this.commit('chatstore/changeChatDetail', { chatExists : !!chat, chatId, message });
		this.commit('chatstore/reOrderChat', chatId);
		if (!messages[chatId]) {
			return;
		}
		let transcriptOrder = messages[chatId].transcriptOrder;
		if(!transcriptOrder.length && !temp_id) {
			return this.dispatch('chatstore/getMessages', chatId);
		}
		let appendId = message._id || temp_id;
		if (transcriptOrder.includes(appendId)) {
			return;
		}
		let transcript = messages[chatId].transcript;
		if (transcriptOrder.includes(temp_id)) { // remove the temp message details
			let index = transcriptOrder.indexOf(temp_id);
			transcriptOrder.splice(index, 1);
			delete transcript[temp_id];
		}
		messages[chatId].transcriptOrder.unshift(appendId); // last message first
		Vue.set(transcript, appendId, message);
		notifyUser(message, chat._id);
	},

	changeChatDetail({ chats }, { chatExists, chatId, message }) {
		let chat = chats[chatId];
		if (!chat) {
			return;
		}
		chat.last_message = message; // set last message to chat detail
		message._id && chat.total_messages++;
		let { _id } = getCurrentUser();
		if (_id === message.receiver_id) {
			chatExists && chat.unread_count++;
			chat.isTyping = false;
		}
	},

	reOrderChat({ chatIds }, chatId) {
		let index = chatIds.indexOf(chatId);
		// If index is 0 its already on top
		if (!index) {
			return;
		}
		// Remove and replace if the index is more than -1
		index > -1 && chatIds.splice(index, 1);
		chatIds.unshift(chatId);
	},	

	markRead({ chats }, chatId) {
		let chat = chats[chatId];
		if (chat) {
			chat.unread_count = 0;
		}
	},

	updateChatMeta({ messages, chats }, { chat_id, read = false }) {
		let message = messages[chat_id];
		let chat = chats[chat_id];
		if (chat) {
			chat.last_message.is_delivered = true;
			chat.last_message.is_read = chat.last_message.is_read || read;
		}
		if (!message) {
			return;
		}
		for (let msgId of message.transcriptOrder) {
			let msg = message.transcript[msgId];
			if (!msg || msg.is_read || (!read && msg.is_delivered)) {
				break;
			}	
			msg.is_delivered = true;
			msg.is_read = read;
		}
	},

	updateUploadProgress({ messages }, { chatId, temp_id, progress }) {
		let chatMessage = messages[chatId];
		let message = chatMessage.transcript[temp_id];
		message.progress = progress;
	},

	msgMetaHandler({ chats, messages }, { chat_id, msg_id, is_read, is_delivered }) {
		let message = messages[chat_id];
		let chat = chats[chat_id];
		if (chat && chat.last_message._id === msg_id) {
			chat.last_message.is_read = is_read;
			chat.last_message.is_delivered = is_delivered;
		}
		if (message) {
			let targetMsg = message.transcript[msg_id] || {};
			targetMsg.is_read = is_read;
			targetMsg.is_delivered = is_delivered;
		}
	},

	typingHandler({ chats }, { chat_id, is_typing }) {
		let chat = chats[chat_id];
		chat && Vue.set(chat, 'isTyping', is_typing);
	},

	setSelectedChatId(state, id) {
		state.selectedChatId = ( id && checkIfObjectId(id)) ? id : '';
	},

	resetChatStore(state) {
		state.chatIds =  [];
		state.chatSummary = {
			totalChats: 0,
			unreadChats: 0,
		};
		state.chats = {};
		state.messages = {};
		state.isChatLoaded = false;
		state.selectedChatId = "";
		state.chatLoadData = {
			page: 1,
			limit: 20,
			hasMore: false
		};
	}
}

let getters = {
	getChatDetail : ({ chats }) => chatId => {
		return chats[chatId];
	},

	getReceiverDetail : ({ chats }) => chatId => {
		let chat = chats[chatId];
		if (!chat) {
			return '';
		}
		let { _id } = getCurrentUser();
		let { _id : receiverId } = chat.participants.find(par => par._id !== _id);
		return getFriendDetail(receiverId);
	},

	getChatTranscriptOrder : ({ messages }) => chatId => {
		let chat = messages[chatId] || {};
		return chat.transcriptOrder || [];
	},

	getChatByParticipant : ({ chats, chatIds }) => userId => {
		let targetChat;
		for (let id of chatIds) {
			let chat = chats[id];
			let isReceiverMatch = chat.participants.find(par => par._id === userId);
			if (isReceiverMatch) {
				targetChat = chat;
				break;
			}
		}
		return targetChat;
	},

	getChatTranscript : ({ messages }) => chatId => {
		let chat = messages[chatId] || {};
		return chat.transcript || {};
	},

	getMessageMeta : ({ messages }) => chatId => {
		let { hasMore } = messages[chatId] || {};
		return { hasMore }
	}
}

mainStore.registerModule("chatstore", {
	namespaced : true,
	state,
	mutations,
	getters,
	actions
})