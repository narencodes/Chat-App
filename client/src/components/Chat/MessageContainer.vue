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
		<template v-for="(transcript, index) in formattedTranscript">
			<div
				:key="index"
				:class="`${transcript.isSender ? 'sender' : 'rec'}-cont`"
			>
				<div 
					v-for="message in transcript.list"
					:key="message._id"
					class="flex"
					:class="{ 
						'flexE flexC' : transcript.isSender, 
						'last-mess-cont' : !transcript.isSender && message.isLast && !(transcript.isLast && chatDetail.isTyping)
					}"
				>
					<Avatar 
						v-if="!transcript.isSender && message.isLast && !(transcript.isLast && chatDetail.isTyping)" 
						:userId="receiver._id"
					/>
					<div 
						class="msg"
						:class="[message.type, { 'sending' : message.isSending }]"
					>
						<span class="message" v-if="message.type === 'text'">
							{{ message.text }}
						</span>
						<template v-else-if="message.type === 'file'" >
							<img 
								:src="message.file.buffer || message.file.url" 
								:alt="message.file.name"
							/>
							<div 
								v-if="message.isSending && message.progress < 100"
								class="image-loader"
								:style="{ display : 'flex', transform : `translateX(${message.progress}%)` }"
							>
							</div>
						</template>
					</div>
				</div>
			</div>
		</template>
		<Typing v-if="chatDetail.isTyping" :id="receiver._id"/>
	</div>
</template>

<script>
import { chatDetailMixin, transcriptMixin } from "./mixins/chatDetailMixin";
import LoadingComponent from "../Loading/LoadingComponent"
import Avatar from "../Image/Avatar";

export default {
	name : 'MessageContainer',

	mixins : [chatDetailMixin, transcriptMixin],

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

		'chatDetail.isTyping' : function() {
			this.$nextTick(() => {
				this.scrollToBottom(true, true);
			});
		},

		'chatDetail.last_message' : function() {
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
			this.$store.dispatch('chatstore/getMessages', this.chatDetail._id)
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
		},

		markRead() {
			if (this.chatDetail.unread_count) {
				this.$store.commit('chatstore/markRead', this.chatDetail._id);
			}
		},
	},

	components : {
		Avatar,
		LoadingComponent,
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
@import (reference) "../../styles/common.less";

.mess-cont {
	.flex;
	.flexC;
	.posabs;
	.w100;
	.maH100;
	padding: 15px 15px 0 15px;
	overflow: scroll;
	bottom: 0;
}

.rec-cont {
	.flex;
	.flexC;
	.flexG;
}

.sender-cont {
	.flex;
	.flexC;
	.mB10;
	.mR30;
}

.sender-cont .msg.text {
	background-color: #2d6cdf;
	.clrW;
}

/deep/ .msg {
	.iCenter;
	.posrel;
	margin-left: 55px;
	.mB10;
	border-radius: .7em;
	line-height: 25px;
	max-width: 50%;
	margin-left: 55px;
	letter-spacing: .3px;
	& img {
		width: 350px;
		height : 200px;
		border-radius: .7em;
		object-fit: cover;
	}
	&.text {
		padding: 10px 15px;	
		background-color: #cfcfcf;
	}
	&.sending{
		.ovrflw-hid;
		&.text {
			background-color: #2d6cdfba;
		}
	}
	@media(max-width: 600px) {
		margin-left: 45px;
	}
}

.image-loader {
	.posabs;
	border-radius: .7em;
	top : 0;
	left : 0;
	.w100;
	.h100;
	background-color: #4b4b4b;
	opacity: 0.5;
	transition: .5s;
}

/deep/ .message {
	.posrel;
	.font18;
    word-break: break-word;
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