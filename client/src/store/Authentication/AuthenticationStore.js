import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import store from "@/mainStore.js";
import { setTokenToStorage } from '@/configs/token';

Vue.use(Vuex);

let errorHandler = code => {
	if (code) {
		Vue.prototype.$errorBanner(Vue.prototype.$errorMessage(code));
		return;
	}
	Vue.prototype.$noInternet();
}

// These actions are public and can be used without authentication
let actions = {
	checkUserExists(store, params) {
		return axios.get('/api/user/check', { params })
				.then((data) => {
					return data.user_found;
				})
	},

	createUser(store, userObj) {
		return axios.post(`/api/register`, userObj)
				.catch(({ code }) => {
					errorHandler(code);
					return Promise.reject();
				})
	},

	loginUser(state, params) {
		return axios.post('/api/login', params)
				.then((data) => {
					let authToken = data.token;
					setTokenToStorage(authToken);
					store.commit('setAuthToken', authToken);
				})	
				.catch(({ code })=> {
					errorHandler(code);
					return Promise.reject(code);
				})
	},

	deleteUser() {
		return axios.post('/api/user/delete')
				.catch(({ code }) => {
					errorHandler(code);
					return Promise.reject(code);
				})
	}
}

let AuthenticationStore = {
	state: {},
	mutations: {},
	getters: {},
	actions
}


export default new Vuex.Store({
	debug: true,
	modules: {
		AuthenticationStore
	}
})
