import Vue from 'vue';
import axios from "axios";

let errorHandler = code => {
	if (code) {
		Vue.prototype.$errorBanner(Vue.prototype.$errorMessage(code));
		return;
	}
	Vue.prototype.$noInternet();
}

// These are private api calls based on a particular user
let apiURL = '/api/user';
let UserAction = {
	getCurrentUserDetails({ commit }) {
		return axios.get(apiURL)
				.then(data => {
					commit('setUserDetail', data);
					return data.id; // returing user id
				})
				.catch(({ code }) => {
					return Promise.reject(code);
				})
	},

	getFriendsDetails({ commit }) {
		return axios.get(`${apiURL}/friends`)
				.then(data => {
					commit('setFriendsDetails', data);
				})
	},
	
	deleteUser() {
		return axios.delete(apiURL)
				.catch(({ code }) => {
					errorHandler(code);
					return Promise.reject(code);
				})
	},
	
	getUserData(store, userId) {
		return axios.get(`/api/user/${userId}`)
				.catch(({code}) => {
					errorHandler(code);
					return Promise.reject(code);
				})
	}
}

export default UserAction;