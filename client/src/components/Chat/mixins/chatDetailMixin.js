import { mapGetters } from "vuex";

export let chatDetailMixin = {
	props: {
		chatId: {
			type: [String, Number],
			required: true
		}
	},

	computed : {
		...mapGetters({
			getChatDetail : 'chatstore/getChatDetail',
			getReceiverDetail : 'chatstore/getReceiverDetail',
			getFriendDetail : 'userstore/getFriendDetail',
			currentUser : 'userstore/getCurrentUser'
		}),

		chatDetail() {
			return this.getChatDetail(this.chatId);
		},

		receiver() {
			return this.getReceiverDetail(this.chatId);
		}
	}
}

export let transcriptMixin = {
	computed : {
		...mapGetters("chatstore", ['getChatTranscript', 'getChatTranscriptOrder', 'getMessageMeta']),

		transcriptOrder() {
			return this.getChatTranscriptOrder(this.chatId);
		},

		transcript() {
			return this.getChatTranscript(this.chatId);
		},

		hasMore() {
			let { hasMore } = this.getMessageMeta(this.chatId);
			return hasMore;
		}
	}
}