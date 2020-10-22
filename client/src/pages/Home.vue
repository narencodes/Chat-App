<template>
	<section class="flex h100">
		<transition name="fade">
			<Banner 
				v-if="showBanner"
				v-bind="bannerProps"
			/>
		</transition>
		<Popup
			v-if="showPopup"
			v-bind="popupConfig"
		/>
		<router-view />
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Banner from "@/components/Banner/Banner";
const Popup = () => import(/* webpackChunkName: "Popup" */ "@/components/Popup/Popup")

export default {
	name : 'Home',

	data() {
		return {

		}
	},

	computed : {
		...mapState([ 'showBanner', 'bannerProps', 'showPopup', 'popupConfig' ])
	},

	components : {
		Banner,
		Popup
	}
}
</script>