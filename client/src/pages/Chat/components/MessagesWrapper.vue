<template>
	<div class="message-body">
		<NoMessage v-if="!chatDetail.total_messages" />
		<LoadingComponent 
			v-else-if="!isTranscriptLoaded" 
			className="font30"
		/>
		<MessageContainer 
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
				v-if="chatDetail.unread_count"
				class="count"
			>
				{{ chatDetail.unread_count > 9 ? '9+' : chatDetail.unread_count }}
			</span>
			<em class="fas fa-chevron-down"></em>
		</div>
	</div>
</template>

<script>
import { chatDetailMixin, transcriptMixin } from "./mixins/chatDetailMixin";
import MessageContainer from "./MessageContainer";
import LoadingComponent from "@/components/Loading/LoadingComponent";

export default {
	name : "MessagesWrapper",

	mixins : [chatDetailMixin, transcriptMixin],

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
			if (!this.chatDetail.total_messages || this.transcriptOrder.length) {
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

		markRead() {
			if (this.chatDetail.unread_count) {
				this.$store.dispatch('chatstore/markRead', this.chatId);
			}
		},

		// Used by parent component
		goToBottom(check) {
			this.$refs.msgCont && this.$refs.msgCont.scrollToBottom(check);
		}
	},

	components : {
		LoadingComponent,
		MessageContainer,
		NoMessage : {
			name : 'NoMessages',
			template : `<div class="iCenter w100 h100">
							<div class="iCenter flexV">
								<em class="fa fa-hand-peace-o fa-4x mB20 clrGray"> </em>
								<span class="font20 fW600">Say 'Hi' to your friend</span>
							</div>
						</div>`
		}
	},

	watch : {
		chatId : 'fetchTranscript'
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../styles/common.less";

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