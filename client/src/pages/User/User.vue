<template>
	<div class="h100 w100">
		<div class="h100 w100" v-if="!isProfileLoaded">
			<LoadingComponent className="font40"/>
		</div>
		<template v-else>
			<UserHeader />
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

export default {
	name : "User",
	computed : {
		...mapState({
			isProfileLoaded : ({ userstore }) => userstore.isProfileLoaded
		})
	},
	components : {
		UserHeader,
		LoadingComponent
	}
}
</script>