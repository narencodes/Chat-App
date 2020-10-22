import Vue from 'vue';
import {
	addEvent,
	addKeyEvent,
	removeEvent,
	removeKeyEvent
} from "@/utility/documentEvent";

export let clickOut = {
	inserted(el, binding) {
		let callback = binding.value;
		el.clickOutListener = (e) => {
			if (el.contains(e.target)) {
				return;
			}
			callback(e);
		}
		addEvent('mousedown', el.clickOutListener);
	},

	unbind(el) {
		if (el.clickOutListener) {
			removeEvent('mousedown', el.clickOutListener);
			delete el.clickOutListener;
		}
	}
}

export let escape = {
	inserted(el, {
		value: callback
	}) {
		el.escapeListener = callback;
		addKeyEvent('escape', el.escapeListener);
	},

	unbind(el) {
		if (el.escapeListener) {
			removeKeyEvent('escape', el.escapeListener)
			delete el.escapeListener;
		}
	}
}

Vue.directive('click-out', clickOut);
Vue.directive('escape', escape);