import Vue from 'vue'
import Vuex from 'vuex'
import { TOKEN_KEY } from "./utility/constants";

Vue.use(Vuex)

let state = {
	authToken : localStorage.getItem(TOKEN_KEY) || '',
	showBanner : false,
	bannerProps : {},
	showPopup : false,
	popupConfig : {},
	destination : undefined
}

let mutations = {
	setBannerProps(state, props) {
		state.bannerProps = props;
		state.showBanner = true;
		setTimeout(() => {
			state.showBanner = false;
		}, 3000);
	},

	setAuthToken(state, tokenValue) {
		state.authToken = tokenValue;
	},

	setPopupConfig(state, config) {
		state.popupConfig = config ? config : {};
		state.showPopup = config;
	},

	setDestination(state, to) {
		state.destination = to;
	},

	clearDestination(state) {
		state.destination = undefined;
	}
}

let getters = {
	isLoggedIn: state => !!state.authToken
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
