import Vue from "vue";

Vue.filter('imgURL', url => {
	if (url.includes('http') || url.includes('web')) {
		return url;
	}
	return require(`@/assets${url}`)
})