<template>
	<header class="header">
		<span class="header-title">
			ChitChat
		</span>
		<div 
			class="header-profile"
			@click="toggleProfileOption"
		>
			<Avatar :src="currentUser.img_url" />
			<span class="user-name">
				{{ currentUser.user_name }}
			</span>
			<em
				:class="['fa clrW mL10', showProfileOption ? 'fa-caret-up' : 'fa-caret-down' ]"
			>
			</em>
			<div 
				class="drp-dwn"
				v-if="showProfileOption"
				v-click-out="toggleProfileOption"
			>
				<div 
					class="list"
					@click.prevent="logoutUser"
				>
					<em class='fa fa-sign-out'></em>
					<span class="font20 mL10">
						Logout
					</span>
				</div>
				<div 
					class="list clrR"
					@click.prevent="deleteUser"
				>
					<em class='clrR fa fa-trash'></em>
					<span class="font20 mL10">
						Delete account
					</span>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
import { mapState } from 'vuex';
import { removeTokenFromStorage } from "@/configs/token";
// import AuthenticationStore from "@/store/Authentication/AuthenticationStore";
import Avatar from "@/components/Image/Avatar";
import { closeSocket } from "@/utility/websocket";

export default {
	name : "UserHeader",
	
	components : {
		Avatar,
	},

	data() {
		return {
			showProfileOption : false
		}
	},

	computed : {
		...mapState({
			currentUser : ({ userstore }) => userstore.currentUser			
		})
	},

	methods : {
		toggleProfileOption() {
			this.showProfileOption = !this.showProfileOption;
		},

		deleteUser() {
			let clickHandler = () => {
				buttonsList[1].isLoading = true;
				this.$store.dispatch('userstore/deleteUser')
					.then(() => {
						this.$closePopup();
						this.wipeLocalData()
							.then(() => {
								this.$successBanner('Account Deleted Successfully');
								this.goToLogin();
							})
					})
					.finally(() => {
						buttonsList[1].isLoading = false;
					})
			}
			let buttonsList = [
				{
					content : 'Cancel',
					className : 'wbtn',
					clickHandler : this.$closePopup
				},
				{
					content : 'Delete',
					className : 'rbtn mL15',
					clickHandler,
					isLoading : false
				}
			];
			let config = {
				title : 'Delete Account',
				content : 'Are you sure do you want to delete this account?',
				iconType : 'delete',
				buttonsList
			};
			this.$openPopup(config);
		},

		logoutUser() {
			this.showProfileOption = false;
			this.wipeLocalData()
				.then(() => {
					this.$successBanner('Logged out successfully!!!');
					this.goToLogin();
				})
		},

		wipeLocalData() {
			return new Promise(async (resolve) => {
				closeSocket();
				this.clearToken();
				this.clearStore();
				resolve();
			})
		},

		clearToken() {
			this.$store.commit('setAuthToken', "");
			removeTokenFromStorage();
		},

		clearStore() {
			this.$store.commit('userstore/resetUserStore');
			this.$store.commit('chatstore/resetChatStore');
		},

		goToLogin() {
			this.$goTo('Login');
		}
	}
}
</script>