import Vue from 'vue';
import store from '@/mainStore';
import { INVALID_TOKEN, USER_DELETED } from '@/configs/errorcode';
import { checkIfObjectId } from '@/utility/utils';
import { removeTokenFromStorage } from "@/configs/token";
import { initializeSocket } from "@/utility/websocket.js";

const loadUserStore = () => Promise.all([import( /* webpackChunkName: "Chats" */ '@/store/User/UserStore'), import( /* webpackChunkName: "Chats" */ '@/store/Chat/ChatStore')])

const verifyToken = (to, next) => {
	// Verify whether the user is login in or not
	return new Promise((resolve, reject) => {
		let isLoggedIn = store.getters.isLoggedIn;
		if (isLoggedIn) {
			store.commit('clearDestination');
			return resolve();
		}
		// If the user is not logged in route him to Login page
		reject();
		store.commit('setDestination', to);
		Vue.prototype.$errorBanner('Please Login to continue!');
		next({ name : 'Login' });
	})
}

const loadResource = (to, from, next) => {
	// Load the user store and check if the user is logged In
	Promise.all([loadUserStore(), verifyToken(to, next)])
		.then(() => {
			fetchProfile(next)
		})
}

const fetchProfile = next => {
	store.dispatch('userstore/getCurrentUserDetails')
		.then(userId => {
			initializeSocket(userId);
			store.dispatch('userstore/getFriendsDetails');
		})
		.catch(errCode => {
			if ([ INVALID_TOKEN, USER_DELETED ].includes(errCode)) {
				handleInvalidToken();
				return next({ name : "Login" });
			}
		});
	next();
}

// If the token is found invalid remove the authentication from local storage and set empty value in the store
const handleInvalidToken = () => {
	store.commit('setAuthToken', '');
	removeTokenFromStorage();
	Vue.prototype.$errorBanner('Invalid Session, please login again');
}

const checkIfChatExists = id => {
	let chat = store.getters['chatstore/getChatDetail'](id);
	return new Promise((resolve, reject) => {
		if (chat) {
			return resolve(true);
		}
		store.dispatch('chatstore/getChatById', id)
			.then(() => resolve(true))
			.catch(() => reject(false));
	})
}

const loadMessages = async (to, from, next) => {
	let { id } = to.params;
	try {
		if (checkIfObjectId(id) && await checkIfChatExists(id)) {
			return next();
		}
		invalidChatHandler(next);
	}
	catch(e) {
		invalidChatHandler(next);
	}
}

const invalidChatHandler = next => {
	Vue.prototype.$errorBanner('Invalid Chat ID');
	return next({ name : 'UserChats' });
}


let UserRoutes = [
	{
		path: '/user',
		name: 'User',
		beforeEnter: loadResource,
		redirect : { name : 'UserChats' },
		component: () => import( /* webpackChunkName: "Chats" */ '@/pages/User/User'),
		children : [
			{
				path : ':userId/join',
				name : 'JoinChat',
				props : true,
				component: () => import( /* webpackChunkName: "Chats" */ '@/pages/User/UserChats'),
			},
			{
				path : 'chats',
				name : 'UserChats',
				props : true,
				component: () => import( /* webpackChunkName: "Chats" */ '@/pages/User/UserChats'),
				children : [
					{
						path : ':id',
						name : 'Chat',
						beforeEnter : loadMessages,
						component: () => import( /* webpackChunkName: "Chats" */ '@/pages/User/UserChats'),
					}
				]
			}
		]
	}
]

export default UserRoutes;