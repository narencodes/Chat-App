import { addEvent, removeEvent } from './documentEvent';

// Action to call when clicking outside the binded element
let clickOut = {
    inserted(el, { value: callback }) {
        el.clickOutListener = ev => {
            if (el.contains(ev.target)) {
                return;
            }
            callback(ev);
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

export default clickOut;