<template>
	<div class='mT20 w100 h100 pB20'>
		<NoChats 
			v-if="!totalChats"
			@start-chat="handleStartChat"
		/>
		<template v-else>
			<div v-if="!isChatLoaded || !isFriendsLoaded">
				<LoadingComponent class="font40" />
			</div>
			<Chats 
				v-else
				@new-chat="handleStartChat"
				:selectedChatId="id"
			/>
		</template>
		<NewChat 
			v-if="showNewChat"
			@close="showNewChat = false"
		/>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { CHAT_ICON } from '@/utility/constants';
import ButtonComponent from "@/components/Button/ButtonComponent";
import LoadingComponent from '@/components/Loading/LoadingComponent';
import Chats from '@/pages/Chat/Chats';
import NewChat from "./components/NewChat";

export default {
	name : 'UserChats',

	props : {
		id : {
			type : [ String, Number ],
			default : ''
		},
		userId : {
			type : [String, Number],
			default : ''
		}
	},

	data() {
		return {
			showNewChat : false,
			joinUserData : undefined
		}
	},

	computed : {
		...mapState({
			currentUser : ({ userstore }) => userstore.currentUser,
			totalChats : ({ chatstore }) => chatstore.chatSummary.totalChats,
			isChatLoaded : ({ chatstore }) => chatstore.isChatLoaded,
			isFriendsLoaded : ({ userstore }) => userstore.isFriendsLoaded
		})
	},

	beforeMount() {
		this.init();
	},

	methods : {
		init() {
			this.userId && this.fetchUserData();
			this.fetchChats();
		},
		
		fetchUserData() {
			if(this.userId === this.currentUser._id) {
				this.goToChats();
				return this.$errorBanner('Invalid Join link');
			}
			this.$store.dispatch('userstore/getUserData', this.userId)
				.then(this.handleJoinChat);
		},
		
		goToChats() {
			this.$goTo('UserChats');
		},
		
		handleJoinChat(userData) {
			if(userData.is_friend) {
				this.$goTo('UserChats');
				return this.$errorBanner('User is already in your friend list')
			}
			let closeHandler = () => {
				this.goToChats();
				this.$closePopup();
			}
			let buttonsList = [
				{
					content : 'No',
					className : 'wbtn mR15',
					clickHandler : closeHandler
				},
				{
					content : 'Yes',
					className : 'rbtn',
					isLoading : false,
					clickHandler : () => {
						buttonsList[1].isLoading = true;						
						this.$store.dispatch('chatstore/createNewChat', this.userId)
							.then(chat => {
								this.$goTo('Chat', { id : chat._id });
							})
							.catch(closeHandler)
					}
				}
			]
			this.$openPopup({
				title : 'Start Chat',
				content : `Do you want to start a chat with ${userData.user_name} and become friends?`,
				buttonsList,
				iconType : 'info',
				closeHandler
			})
		},
		
		fetchChats() {
			if (!this.totalChats) {
				return;
			}
			this.$store.dispatch('chatstore/getChats');
		},
		handleStartChat() {
			this.showNewChat = true;
		}
	},

	components : {
		NewChat,
		Chats,
		LoadingComponent,
		NoChats : {
			name : 'NoChats',
			template : `<div class="no-chat">
							<img
								:src="noChatImg | imgURL" 
							/>
							<p class="text">
								No chats found
							</p>
							<button-component
								v-bind="chatBtnProps"
							>
							</button-component>
						</div>`,
			data() {
				return {
					noChatImg : CHAT_ICON,
					chatBtnProps : {
						content : 'Start Chat',
						clickHandler : this.handleStartChat
					}
				}
			},

			methods : {
				handleStartChat() {
					this.$emit('start-chat');
				}
			},

			components : {
				ButtonComponent
			}
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";

/deep/ .no-chat {
	.flexV;
	.iCenter;
	.p50;
	.taC;
	.w100;
	.h100;
	& img {
		width: 200px;
		height: 200px;
		@media (max-width:400px) {
			width: 100px;
			height: 100px;
		}
	}
	& .text {
		.mT30;
		.mB30;
		.font30;
		@media (max-width:400px) {
			.mT15;
			.font20;
		}
	}
	}
</style>