import Vue from 'vue';
import tooltip from "./v-tip";
import key from "./v-key";
import clickOut from "./v-click-out";

// To handle both v-click-out and v-key in same directive mainly to close the component

let getEscapeModifier = ({ value }) => ({
    value,
    modifiers : { escape : true }
})

let exit = {
    inserted(el, bindings) {
        clickOut.inserted(el, bindings);
        key.inserted(el, getEscapeModifier(bindings));
    },
    
    unbind(el, bindings) {
        clickOut.unbind(el, bindings);
        key.unbind(el, getEscapeModifier(bindings));
    }
}

let copy = {
    inserted(el, { value }) {
        el.copyListener = () => Vue.prototype.$copyText(value);
        el.addEventListener('click', el.copyListener);
    },
    
    unbind(el) {
        el.removeEventListener('click', el.copyListener);
    }
}

Vue.directive('click-out', clickOut);
Vue.directive('tip', tooltip);
Vue.directive('key', key);
Vue.directive('exit', exit);
Vue.directive('copy', copy);