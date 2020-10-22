import axios from 'axios';

// These are private api calls based on a particular user
let apiURL = '/api/user';
let UserAction = {
	getCurrentUserDetails({ commit }) {
		return axios.get(`${apiURL}/profile`)
				.then(data => {
					commit('setUserDetail', data);
					return data._id; // returing user id
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
	}
}

export default UserAction;