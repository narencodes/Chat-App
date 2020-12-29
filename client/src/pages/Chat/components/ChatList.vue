<template>
	<div 
		class="chat-list"
		@scroll="handleScroll"
	>
		<ChatListItem
			v-for="id in chatIds"
			:key="id"
			:chatId="id"
		/>
		<div 
			v-if="lazyLoad"
			class="posrel mT30 mB30 iCenter"
		>
			<LoadingComponent className="font20" />
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import ChatListItem from '@/pages/Chat/components/ChatListItem';
import LoadingComponent from "@/components/Loading/LoadingComponent";

export default {
	name : 'ChatList',

	data() {
		return {
			lazyLoad : false
		}
	},

	components : {
		ChatListItem,
		LoadingComponent
	},
	
	computed : {
		...mapState('chatstore', ['chatIds', 'chatLoadData'])
	},

	methods : {
		handleScroll({ target }) {
			let { scrollTop, scrollHeight, clientHeight } = target;
			let isEnd = (scrollHeight - (scrollTop + clientHeight)) <= 0;
			isEnd && this.loadMoreChats();
		},

		loadMoreChats() {
			if (this.lazyLoad || !this.chatLoadData.hasMore) {
				return;
			}
			this.lazyLoad = true;
			this.$store.dispatch('chatstore/getChats')
				.finally(() => {
					this.lazyLoad = false;
				})
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../styles/common";
.chat-list {
	width: 30%;
	.ovrflw-auto;
	.fshrink;
	scroll-behavior: smooth;
	border: 0.5px solid #d1d1d1;
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
	@media(max-width: 1000px) {
		width: 40%;
		box-shadow: none;
	}
	@media(max-width: 600px) {
		.w100;
		.maW100;
		box-shadow: none;
	}
}
</style>