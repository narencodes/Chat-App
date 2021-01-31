import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeRoutes from './routes/Home/HomeRoutes';
import UserRoutes from './routes/User/UserRoutes';

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: () => import( /* webpackChunkName: "components" */ '@/pages/Home'),
		children : [].concat( HomeRoutes, UserRoutes )
	},
	{
		path : "*",
		beforeEnter : (to, from, next) => {
			next({ name : 'Login' });
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	routes
});

let titleMapping = {
	"Index" : 'Index',
	'Login' : 'Login',
	"Register" : 'Register',
	'UserChats' : 'Chats',
	'Chat' : 'Chats'
}

router.beforeEach((to, from, next) => {
	Vue.prototype.$closePopup();
	let { name } = to;
	document.title = titleMapping[name] || 'Chit Chat';
	next();
})

export default router;
