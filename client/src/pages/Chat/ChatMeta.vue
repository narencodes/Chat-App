<template>
	<div class="chat-meta">
		<div class="title">
			Chats <span class="count">({{ totalChats }})</span>
		</div>
		<ButtonComponent 
			v-bind="buttonProps"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import ButtonComponent from "@/components/Button/ButtonComponent";

export default {
	name : 'ChatMeta',

	data() {
		return {
			buttonProps : {
				content : 'New Chat',
				clickHandler : this.handleNewChat
			}
		}
	},

	computed : {
		...mapState({
			totalChats : ({ chatstore }) => chatstore.chatSummary.totalChats
		})
	},

	components : {
		ButtonComponent
	},

	methods : {
		handleNewChat() {
			this.$emit('new-chat');
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) '../../styles/common.less';

.chat-meta {
	.w100;
	.pLR10;
	.mB25;
	.flex;
	.justifySB;
	& .title {
		.font20;
		.lh40;
		font-weight: 600;
	}
	& .count {
		.clrGray;
	}
	@media(max-width: 1000px) {
		.pLR20;
		.mB15;
		.mT15;
	}
}
	
</style>