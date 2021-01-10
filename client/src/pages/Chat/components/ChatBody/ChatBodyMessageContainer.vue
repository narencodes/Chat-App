<template>
	<div 
		class="mess-cont"
		ref="msgCont"
		@scroll="handleScroll"
	>
		<div 
			v-if="isMessageLoading"
			class="posrel mT50 mB50"
		>
			<LoadingComponent className="font25" />
		</div>
		<template v-for="transcript in formattedTranscript">
			<div
				:key="transcript.list[0]._id"
				:class="`${transcript.isSender ? 'sender' : 'rec'}-cont`"
			>
				<div 
					v-for="message in transcript.list"
					:key="message._id || message.temp_id"
					class="flex"
					:class="{ 
						'flexE flexV' : transcript.isSender, 
						'last-mess-cont' : !transcript.isSender && message.isLast && !(transcript.isLast && isTyping)
					}"
				>
					<Avatar 
						v-if="!transcript.isSender && message.isLast && !(transcript.isLast && isTyping)" 
						:userId="receiver._id"
					/>
					<ChatBodyMessageDisplay :chatId="chatId" :msgId="message.temp_id || message._id"/>
				</div>
			</div>
		</template>
		<Typing v-if="isTyping" :id="receiver._id"/>
	</div>
</template>

<script>
import { chatDetailMixin } from "../mixins/chatDetailMixin";
import LoadingComponent from "@/components/Loading/LoadingComponent"
import Avatar from "@/components/Image/Avatar";
import ChatBodyMessageDisplay from '@/pages/Chat/components/ChatBody/ChatBodyMessageDisplay';

export default {
	name : 'MessageContainer',

	mixins : [ chatDetailMixin ],

	data() {
		return {
			showScrollToBottom : false,
			isMessageLoading : false
		}
	},

	computed : {
		formattedTranscript() {
			let transcriptList = [];
			let formattedObj = {};
			if (!this.transcriptOrder.length) {
				return [];
			} 
			this.transcriptOrder.forEach(msgId => {
				let msg = Object.assign({}, this.transcript[msgId]);
				let isSender = msg.sender_id === this.currentUser._id;
				let type = isSender ? 'sender' : 'receiver';
				if (formattedObj.type !== type) {
					if(formattedObj.type) {
						formattedObj.list[formattedObj.list.length - 1].isLast = true;
						transcriptList.unshift(formattedObj)
					};
					formattedObj = {};
					formattedObj.type = type;
					formattedObj.isSender = isSender;
					formattedObj.list = [];
				}
				// we get lastest message first from server
				// Insert first to show recent message at last 
				formattedObj.list.unshift(msg);
			});
			if(formattedObj.type) {
				formattedObj.list[formattedObj.list.length - 1].isLast = true;
				transcriptList.unshift(formattedObj)
			};
			transcriptList[transcriptList.length - 1].isLast = true;
			return transcriptList;
		}
	},

	mounted() {
		this.scrollToBottom(false);
	},

	watch : {
		chatId : function() {
			this.$nextTick(() => {
				this.scrollToBottom(false, true);
			})
		},

		'$parent.showScrollToBottom' : function(newVal) {
			!newVal && this.markRead();
		},

		'isTyping' : function() {
			this.$nextTick(() => {
				this.scrollToBottom(true, true);
			});
		},

		'lastMessage' : function() {
			this.$nextTick(() => {
				this.scrollToBottom(true, true);
			});
		}
	},

	methods: {
		scrollToBottom(check = true, revert = false) {
			if (check && this.$parent.showScrollToBottom) {
				return;
			}
			let msgCont = this.$refs.msgCont;
			if (msgCont) {
				revert && (msgCont.style.scrollBehavior = '');
				msgCont.scrollTop = msgCont.scrollHeight + msgCont.clientHeight;
				msgCont.style.scrollBehavior = 'smooth';
			}
			this.markRead();
		},

		handleScroll({ target }) {
			let scrollTop = target.scrollTop;
			this.$parent.showScrollToBottom = (target.scrollHeight - (scrollTop + target.clientHeight)) > 100;
			if (scrollTop <= 0) {
				this.loadMoreMessages();
			}
		},

		loadMoreMessages() {
			if (!this.hasMore || this.isMessageLoading) {
				return;
			}
			let msgCont = this.$refs.msgCont;
			let scrollTo = msgCont.scrollHeight;
			this.isMessageLoading = true;
			this.$store.dispatch('chatstore/getMessages', this.chatId)
				.then(() => {
					this.$nextTick(() => {
						msgCont.style.scrollBehavior = '';
						msgCont.scrollTop = msgCont.scrollHeight - scrollTo - 200;
						msgCont.style.scrollBehavior = 'smooth';
					});
				})
				.finally(() => {
					this.isMessageLoading = false;
				})
		}
	},

	components : {
		Avatar,
		LoadingComponent,
		ChatBodyMessageDisplay,
		Typing : {
			name : 'Typing',
			template : `<div class="rec-cont">
							<div class="flex last-mess-cont">
								<avatar :userId="id"></avatar>
								<transition name="typing">
									<div class="msg">
										<div class="iCenter justifySB mL10 mR10">
											<em class="typing-dots"></em>
										</div>
									</div>
								</transition>
							</div>
						</div>`,
			props : {
				id : {
					type : String,
					required : true
				}
			},

			components : {
				Avatar
			}
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../../styles/common.less";

.mess-cont {
	.flexV;
	.posabs;
	.w100;
	.maH100;
	padding: 15px 15px 0 15px;
	overflow: scroll;
	bottom: 0;
}

.rec-cont {
	.flexV;
	.flexG;
}

.sender-cont {
	.flexV;
	.mB10;
	.mR30;
}

/deep/ .sender-cont .msg.text {
	background-color: #2d6cdf;
	.clrW;
}

/deep/ .last-mess-cont {
	.mB10;
}

/deep/ .last-mess-cont .msg {
	margin: 0px;
	.mL10;
}

/deep/ .last-mess-cont .msg:not(.file)::after {
	content: '';
	.posabs;
	left: -5px;
	.tY-50;
	top: 50%;
	width: 0;
	height: 0;
	border: 12px solid transparent;
	border-right-color: #cfcfcf;
	border-left: 0;
	
}

/deep/ .typing-enter-to {
	// transition: all ease-in-out;
	animation: slide-in .15s;	
}

/deep/ .typing-leave-active, .typing-leave-to /* .fade-leave-active in <2.1.8 */ {
   animation: slide-in .3s reverse;
}

/deep/ .typing-dots, /deep/ .typing-dots::after, /deep/ .typing-dots::before {
	width : 8.5px;
	height : 8.5px;
	.bR50;
	.posabs;
	background-color: #303538bd;	
	animation: flow 0.5s linear infinite alternate;
	animation-delay: 0.4s;
}

/deep/ .typing-dots::after {
	content: '';	
	left: 11px;
	animation: flow 0.5s linear infinite alternate;
	animation-delay: 0.6s;
}

/deep/ .typing-dots::before {
	content: '';
	left: -11px;
	animation: flow 0.5s linear infinite alternate;
}

</style>