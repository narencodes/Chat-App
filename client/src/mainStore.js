import Vue from 'vue'
import Vuex from 'vuex'
import { TOKEN_KEY } from "./utility/constants";

Vue.use(Vuex)

let state = {
	authToken : localStorage.getItem(TOKEN_KEY) || '',
	bannerProps : undefined,
	popupConfig : undefined,
	destination : undefined,
	tooltipProps : undefined
}

let mutations = {
	setBannerProps(state, props) {
		state.bannerProps = props;
		setTimeout(() => {
			state.bannerProps = undefined;
		}, 3000);
	},

	setAuthToken(state, tokenValue) {
		state.authToken = tokenValue;
	},

	setPopupConfig(state, config) {
		state.popupConfig = config;
	},
	
	setTooltip(state, props) {
        state.tooltipProps = props;
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
