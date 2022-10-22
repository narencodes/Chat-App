import Vue from 'vue';
import store from "@/mainStore";
import actions from "./UserAction";

let state = {
	currentUser : {},
	isProfileLoaded : false,
	friends : {},
	isFriendsLoaded : false
}

let mutations = {
	setUserDetail(state, data) {
		state.currentUser = data;
		store.state.chatstore.chatSummary = {
			totalChats : data.total_chats,
			unreadChats : data.unread_chats
		}
		state.isProfileLoaded = true;
	},
	
	updateCurrentUser(state, data) {
		state.currentUser = { ...state.currentUser, ...data }
	},

	setFriendsDetails(state, data) {
		data.forEach(friend => {
			Vue.set(state.friends, friend._id, friend);
		});
		state.isFriendsLoaded = true;
	},

	setFriendStatus({ friends }, { id, status, last_online }) {
		if (friends[id]) {
			friends[id].last_online = last_online
			friends[id].status = status;
			return;
		}
		Vue.set(friends, id, { status, last_online });
	},

	resetUserStore(state) {
		state.currentUser = {};
		state.isProfileLoaded = false;
		state.friends = {};
		state.isFriendsLoaded = false;
	}
}

let getters = {
	// Pass the id to get a friend detail
	getFriendDetail : state => id => {
		return state.friends[id] || {};
	},

	getCurrentUser : ({ currentUser }) => {
		return currentUser;
	}
}

store.registerModule('userstore', {
	namespaced : true,
	state,
	mutations,
	getters,
	actions
})