<template>
	<div class="message-body">
		<ChatBodyNoMessages v-if="!totalMessages" />
		<LoadingComponent 
			v-else-if="!isTranscriptLoaded" 
			className="font30"
		/>
		<ChatBodyMessageContainer 
			v-else 
			ref="msgCont"
			:chatId="chatId" 
		/>
		<div 
			v-if="showScrollToBottom"
			class="goto-bottom" 
			@click="goToBottom(false)"
		>
			<span 
				v-if="unreadCount"
				class="count"
			>
				{{ unreadCount > 9 ? '9+' : unreadCount }}
			</span>
			<em class="fas fa-chevron-down"></em>
		</div>
	</div>
</template>

<script>
import { chatDetailMixin } from "../mixins/chatDetailMixin";
import ChatBodyNoMessages from '@/pages/Chat/components/ChatBody/ChatBodyNoMessages';
import ChatBodyMessageContainer from '@/pages/Chat/components/ChatBody/ChatBodyMessageContainer';
import LoadingComponent from "@/components/Loading/LoadingComponent";


export default {
	name : "MessagesWrapper",

	mixins : [ chatDetailMixin ],

	data() {
		return {
			isTranscriptLoaded : true,
			showScrollToBottom : false
		}
	},

	beforeMount() {
		this.fetchTranscript();
	},

	methods : {
		fetchTranscript() {
			if (!this.totalMessages || this.transcriptOrder.length) {
				this.markRead();
				return;
			}
			this.isTranscriptLoaded = false;
			this.$store.dispatch('chatstore/getMessages', this.chatId)
				.then(this.markRead)
				.finally(() => {
					this.isTranscriptLoaded = true;
				})			
		},

		// Used by parent component
		goToBottom(check) {
			this.$refs.msgCont && this.$refs.msgCont.scrollToBottom(check);
		}
	},

	components : {
		LoadingComponent,
		ChatBodyMessageContainer,
		ChatBodyNoMessages
	},

	watch : {
		chatId : 'fetchTranscript'
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../../styles/common.less";

.message-body {
	.posrel;
	.w100;
	.h100;
	.ovrflw-hid;
}

.goto-bottom {
	.iCenter;
	.posabs;
	.bR50;
	.curP;
	bottom: 15px;
	right: 5px;
	width: 40px;
	height: 40px;
	background-color: #e3e3e3;
	z-index: 1;
	color: #285bb9;
}

.goto-bottom em {
	.font20;
	.posrel;
	top: 2px;
}

.goto-bottom .count {
	width: 25px;
	height: 25px;
	.bR50;
	background-color: #fb0e0ed1;
	.iCenter;
	.clrW;
	.posabs;
	top: -10px;
	right: -5px;
}

</style>