import Vue from "vue";
import { getFormattedTime, getReadableDate } from "@/utility/timeUtil";

Vue.filter('imgURL', url => {
	if (url.includes('http') || url.includes('web')) {
		return url;
	}
	return require(`@/assets${url}`)
});

Vue.filter('getFormattedTime', getFormattedTime);

Vue.filter('getReadableDate', getReadableDate);