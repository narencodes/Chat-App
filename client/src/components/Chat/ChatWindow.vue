<template>
	<div class="message-container">
		<ChatHeader :chatId="chatId" :is600px="$attrs.is600px" />
		<MessagesWrapper :chatId="chatId" ref="msgWrapper"/>
		<ChatComposer :chatId="chatId" @scrollToBottom="scrollMsgToBottom" />
	</div>
</template>

<script>
import ChatHeader from "./ChatHeader";
import MessagesWrapper from "./MessagesWrapper";
import ChatComposer from "./ChatComposer";

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
		MessagesWrapper,
		ChatComposer
	},

	methods : {
		scrollMsgToBottom(check = true) {
			this.$refs.msgWrapper && this.$refs.msgWrapper.goToBottom(check);
		}
	},

	beforeDestroy() {
		this.$store.commit('chatstore/setSelectedChatId', '');
	},
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";

.message-container {
	.flex;
	.flexG;
	.flexC;
	.posrel;
	.ovrflw-hid;
}
</style>