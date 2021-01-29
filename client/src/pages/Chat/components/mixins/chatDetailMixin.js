import { mapGetters } from "vuex";
import { getReadableDate } from "@/utility/timeUtil";

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
			currentUser : 'userstore/getCurrentUser',
			getChatTranscript : 'chatstore/getChatTranscript',
			getChatTranscriptOrder : 'chatstore/getChatTranscriptOrder',
			hasMoreMessages : 'chatstore/hasMoreMessages',
			getMessageById : 'chatstore/getMessageById'
		}),

		chatDetail() {
			return this.getChatDetail(this.chatId);
		},

		receiver() {
			return this.getReceiverDetail(this.chatId);
		},
		
		lastMessage() {
			return this.chatDetail.last_message;
		},
		
		unreadCount() {
			return this.chatDetail.unread_count;
		},
		
		isTyping() {
			return this.chatDetail.isTyping;
		},
		
		totalMessages() {
			return this.chatDetail.total_messages;
		},
		
		transcriptOrder() {
			return this.getChatTranscriptOrder(this.chatId);
		},

		transcript() {
			return this.getChatTranscript(this.chatId);
		},

		hasMore() {
			return this.hasMoreMessages(this.chatId)
		}
	},
	
	methods: {
		markRead() {
			if (this.unreadCount) {
				this.$store.dispatch('chatstore/markRead', this.chatId);
			}
		}
	},
}

export let transcriptMixin = {
	props : {
		msgId : {
			type : [String, Number],
			required : true
		}
	},
	
	computed : {
		message() {
			return this.getMessageById(this.chatId, this.msgId)
		},
		
		isSender() {
			return this.message.sender_id === this.currentUser._id;
		},
		
		type() {
			return this.message.type;
		},
		
		text() {
			return this.message.text;
		},
		
		file() {
			return this.message.file;
		},
		
		isSending() {
			return this.message.isSending;
		},
		
		uploadProgress() {
			return this.message.progress;
		},
		
		readableDate() {
			return getReadableDate(this.message.time, true);
		}
	}
}