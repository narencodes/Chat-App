<template>
	<div class="h100 w100">
		<div class="h100 w100" v-if="!isProfileLoaded">
			<LoadingComponent className="font40"/>
		</div>
		<template v-else>
			<UserHeader v-if="!isMobileDevice || !selectedChatId"/>
			<section class="user-section">
				<router-view />
			</section>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import UserHeader from './UserHeader';
import LoadingComponent from '@/components/Loading/LoadingComponent';
import { isMobileDevice } from '@/utility/utils';

export default {
	name : "User",
	computed : {
		...mapState({
			isProfileLoaded : ({ userstore }) => userstore.isProfileLoaded,
			selectedChatId  : ({ chatstore }) => chatstore.selectedChatId
		}),
		
		isMobileDevice() {
			return isMobileDevice;
		}
	},
	components : {
		UserHeader,
		LoadingComponent
	}
}
</script>