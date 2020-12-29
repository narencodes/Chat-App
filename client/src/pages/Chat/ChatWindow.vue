<template>
	<div class="message-container">
		<ChatHeader :chatId="chatId" :is600px="$attrs.is600px" />
		<ChatBodyWrapper :chatId="chatId" ref="msgWrapper"/>
		<ChatComposer :chatId="chatId" @scrollToBottom="scrollMsgToBottom" />
	</div>
</template>

<script>
import ChatHeader from "./components/ChatHeader";
import ChatBodyWrapper from '@/pages/Chat/components/ChatBody/ChatBodyWrapper';
import ChatComposer from "./components/ChatComposer";

export default {
	name : 'ChatWindow',

	props : {
		chatId : {
			type : [ String, Number ],
			required : true
		}
	},

	components : {
		ChatHeader,
		ChatBodyWrapper,
		ChatComposer
	},

	methods : {
		scrollMsgToBottom(check = true) {
			this.$refs.msgWrapper && this.$refs.msgWrapper.goToBottom(check);
		}
	},

	beforeDestroy() {
		this.$store.commit('chatstore/setSelectedChatId', '');
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";
 
.message-container {
	.flexV;
	.flexG;
	.posrel;
	.ovrflw-hid;
}
</style>