<template>
	<div class="chat-body">
		<ChatMeta 
			v-if="is600px || !selectedChatId"
			@new-chat="$emit('new-chat')"
		/>
		<ChatBody 
			:is600px="is600px"
			:selectedChatId="selectedChatId"
		/>
	</div>
</template>

<script>

import { mapGetters } from 'vuex';
import { getCapitalizedText } from "@/utility/utils";
import ChatMeta from "./components/ChatMeta";
import ChatBody from './components/ChatBody';

export default {
	name : 'Chats',

	props : {
		selectedChatId : {
			type : [ String, Number ],
			default : ''
		}
	},

	data() {
		return {
			is600px : document.documentElement.clientWidth >= 600
		}
	},

	computed: {
		...mapGetters('chatstore', ['getReceiverDetail'])
	},

	mounted() {
		this.addResizeListener();
	},

	methods: {
		setSelectedChat(id) {
			if (id) {
				this.$store.commit('chatstore/setSelectedChatId', id);
				this.setReceiverName(id);
			}
		},

		setReceiverName(id) {
			let { user_name : name } = this.getReceiverDetail(id);
			if (name) {
				document.title = getCapitalizedText(name);
			}
		},

		addResizeListener() {
			window.addEventListener('resize', this.handleResize);
		},

		handleResize(e) {
			this.is600px = document.documentElement.clientWidth >= 600;
		},

		removeResizeListener() {
			window.removeEventListener('resize', this.handleResize);
		}
	},

	components : {
		ChatMeta,
		ChatBody
	},

	watch : {
		selectedChatId : {
			immediate : true,
			handler : "setSelectedChat"
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";
.chat-body {
	.w100;
	.h100;
	.posrel;
	.p30;
	.flex;
	.flexC;
	.ovrflw-hid;
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
	@media(max-width: 1000px){
		padding: 0;
	}
}
</style>