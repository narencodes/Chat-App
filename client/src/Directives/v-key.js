import { addKeyEvent, removeKeyEvent } from "./documentEvent";

const keyMapping = {
    up : 'arrowup',
    down : 'arrowdown',
    left : 'arrowleft',
    right : 'arrowright'
}

// To add and remove keyboard events for the given keys
let handleKeyEvents = (el, keys, callback) => {
    keys.length && keys.forEach(key => {
        key = keyMapping[key] || key;
        callback && (el[`${key}Listener`] = callback);
        callback ? addKeyEvent(key, el[`${key}Listener`]) : removeKeyEvent(key, el[`${key}Listener`]);
    });
}

let key = {
    inserted(el, { value : callback, modifiers }) {
        handleKeyEvents(el, Object.keys(modifiers), callback);
	},

	unbind(el, { modifiers }) {
		handleKeyEvents(el, Object.keys(modifiers));
	}
}

export default key;