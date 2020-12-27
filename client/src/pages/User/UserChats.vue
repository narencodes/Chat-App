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
import { chatIcon } from '@/utility/constants';
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
		}
	},

	data() {
		return {
			showNewChat : false
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
		this.fetchChats();
	},

	methods : {
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
					noChatImg : chatIcon,
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