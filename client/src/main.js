import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from './mainStore';

Vue.config.productionTip = false;
Vue.config.performance = true;
Vue.config.devtools = true;

//Import All less files here and maintain the order of import
import './styles/common.less';
import './styles/animation.less';
import './styles/styles.less';
import './styles/transition.less';
import "./styles/user.less";

//custom filters should be listed here
import './Filters/filters.js'

// custom directives should be listed here
import './Directives/directives.js';

//custom prototypes goes here
import './Prototype/prototype.js'

// To set axios authorization header
import { setAxiosAuthorization } from "./configs/token.js";
setAxiosAuthorization();

// config to change Axios success response and error response
import "./configs/configThirdParty";

// For google API's
import { handleGapiLoad } from "./configs/gapi";
handleGapiLoad();

//For Service Worker
import { init } from "./service/serviceworker";
init();



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
