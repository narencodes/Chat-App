import Vue from "vue";
import Router from '../router';
import store from '../mainStore';
import { errorTexts } from "../configs/errorcode"; 

// Shortcut to navigate between pages
Vue.prototype.$goTo = (routeName, params) => {
	if (!routeName) {
		return;
	}
	let route = { name : routeName }
	if (params) {
		route.params = params;
	}
	Router.push(route);
};

Vue.prototype.$showBanner = props => {
	if (!props.content) {
		return;
	}
	store.commit('setBannerProps', props);
}

Vue.prototype.$successBanner = content => {
	let props = {
		iconType : 'success',
		content
	};
	Vue.prototype.$showBanner(props);
}

Vue.prototype.$errorBanner = content => {
	let props = {
		iconType: 'error',
		content,
		isError : true
	};
	Vue.prototype.$showBanner(props);
}

Vue.prototype.$noInternet = () => {
	let isOnline = navigator.onLine;
	let content = isOnline ? 'Unable to connect to server' : 'No Internet';
	Vue.prototype.$errorBanner(content);
}

Vue.prototype.$openPopup = config => {
	store.commit('setPopupConfig', config);
}

Vue.prototype.$closePopup = () => {
	store.commit('setPopupConfig', false);
}

Vue.prototype.$debounce = (func, delay) => {
	let inDebounce;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(context, args), delay)
	}
};

Vue.prototype.$throttle = (func, limit) => {
	let inThrottle;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit)
		}
	}
};

Vue.prototype.$errorMessage = code => {
	let errorMessage = errorTexts[code];
	return errorMessage;
}