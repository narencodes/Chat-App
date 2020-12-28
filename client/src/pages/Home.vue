<template>
	<section class="flex h100">
		<transition name="fade">
			<Banner 
				v-if="bannerProps"
				v-bind="bannerProps"
			/>
		</transition>
		<Popup v-if="popupConfig" v-bind="popupConfig" />
		<Tooltip v-if="tooltipProps" v-bind="tooltipProps" />
		<router-view />
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Banner from "@/components/Banner/Banner";
import Popup from "@/components/Popup/Popup";
import Tooltip from '@/components/Tooltip/Tooltip';

export default {
	name : 'Home',

	data() {
		return {

		}
	},

	computed : {
		...mapState(['bannerProps', 'popupConfig', 'tooltipProps' ])
	},

	components : {
		Banner,
		Popup,
		Tooltip
	}
}
</script>