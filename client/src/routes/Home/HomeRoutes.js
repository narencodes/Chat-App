import store from '@/mainStore';


let loadDep = (to, from, next) => {
	import( /* webpackChunkName: "Initial" */ "@/store/Authentication/AuthenticationStore")
		.then(() => checkIfLoggedIn(next))
}
let checkIfLoggedIn = next => {
	let isLoggedIn = store.getters.isLoggedIn;
	// If the user is logged in already route him to User home page
	isLoggedIn ? next({ name : 'UserChats' }) : next();
}


export default [
	{
		path : '/',
		beforeEnter : loadDep,
		component: () => import( /* webpackChunkName: "Initial" */ '@/pages/Initial/HomeContainer'),
		children : [
			{
				path : '',
				name: "Index",
				component: () => import( /* webpackChunkName: "Initial" */ '@/pages/Initial/Index'),
			},
			{
				path: '/login',
				name: 'Login',
				component: () => import( /* webpackChunkName: "Initial" */ '@/pages/Initial/Login')
			}, {
				path: "/register",
				name: "Register",
				component: () => import( /* webpackChunkName: "Initial" */ '@/pages/Initial/Register')
			}
		]
	},
]