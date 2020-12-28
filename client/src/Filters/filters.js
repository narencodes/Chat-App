import Vue from "vue";
import { getFormattedTime } from "@/utility/utils";

Vue.filter('imgURL', url => {
	if (url.includes('http') || url.includes('web')) {
		return url;
	}
	return require(`@/assets${url}`)
});

Vue.filter('getFormattedTime', getFormattedTime)