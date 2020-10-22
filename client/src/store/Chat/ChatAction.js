import Vue from 'vue';
import axios from "axios";

let errorHandler = err => {
	if (err && err.code) {
		Vue.prototype.$errorBanner(Vue.prototype.$errorMessage(err.code));
		return;
	}
	Vue.prototype.$noInternet();
}

let chatURL = '/api/chats';

let ChatActions = {
	createNewChat({ commit }, params) {
		return axios.post(`${chatURL}/new`, params)
				.then(({ chat_details }) => {
					commit('addChat', chat_details);
					return chat_details;
				})
				.catch(err => {
					errorHandler(err);
					return Promise.reject(err.code);
				})
	},

	getChats({ state, commit }, params = {}) {
		let { limit, time } = state.chatLoadData;
		params = { limit, ...params }
		time && (params.time = time);
		return axios.get(chatURL, { params })
				.then(data => {
					commit('setChats', data);
				})
				.catch(err => {
					errorHandler(err);
					return Promise.reject(err.code);
				})
	},

	getChatById({ commit }, id) {
		return axios.get(`${chatURL}/${id}`)
				.then(data => {
					commit('setChatDetail', data);
				})
				.catch(err => {
					errorHandler(err);
					return Promise.reject(err);
				})
	},

	getMessages({ state : { messages }, commit }, id) {
		if (!id) {
			return;
		}
		let chatMessage = messages[id];
		let limit = 30;
		let params = {
			limit
		}
		if (chatMessage && chatMessage.lmsg_id) {
			params.lmsg_id = chatMessage.lmsg_id;
		}
		return axios.get(`${chatURL}/${id}/messages`, { params })
				.then(data => {
					commit('setMessages', data);
				})
				.catch(err => {
					errorHandler(err);
					return Promise.reject(err.code);
				})
	},

	sendMessage(store, { chatId, params }) {
		return axios.post(`${chatURL}/${chatId}/messages`, params)
				.catch(err => console.log(err))
	},

	markRead({ commit }, chatId) {
		commit('markRead');
		return axios.post(`${chatURL}/${chatId}/read`)
	},

	sendTyping(store, { chatId, is_typing }) {
		return axios.post(`${chatURL}/${chatId}/typing`, { is_typing });
	},

	upload({ commit }, { chatId, file, temp_id }) {
		return axios.post(`${chatURL}/${chatId}/upload`, { file, temp_id }, {
			onUploadProgress : ({ loaded, total }) => {
				let progress = (loaded / total) * 100;
				commit('updateUploadProgress', { chatId, temp_id, progress });
			}
		});
	}
}

export default ChatActions;