import Vue from "vue";
import { formatImgURL } from "@/utility/utils";
import { getFormattedTime, getReadableDate } from "@/utility/timeUtil";

Vue.filter('imgURL', formatImgURL);

Vue.filter('getFormattedTime', getFormattedTime);

Vue.filter('getReadableDate', getReadableDate);