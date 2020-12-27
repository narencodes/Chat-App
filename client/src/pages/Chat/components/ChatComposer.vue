<template>
	<div class="composer-cont">
		<div class="attachment">
			<label class="fa fa-picture-o">
				<input 
					type="file" 
					accept="image/*"
					@change="handleFileUpload" 
				/>
			</label>
		</div>
		<div 
			class="composer"
			:class="{ 'focussed' : isFocussed }"
			@click="setComposerFocus"
		>
			<textarea 
				ref="composer"
				v-model="composerValue"
				@input="handleComposerInput"
				placeholder="Type a message"
				@focus="isFocussed = true"
				@blur="isFocussed = false"
				@keydown.enter.prevent="sendMessage"
				@paste="handleComposerInput"
			>
			</textarea>
		</div>
		<div class="send-btn">
			<em 
				class="fa fa-paper-plane"
				:class="{ 'disable' : !composerValue }"
				@click="sendMessage"
			>
			</em>
		</div>
	</div>
</template>

<script>
import { chatDetailMixin } from "./mixins/chatDetailMixin";
import { getRandomStr } from "@/utility/utils";

export default {
	name : "ChatComposer",

	mixins : [ chatDetailMixin ],

	data() {
		return {
			composerValue : '',
			isFocussed : false,
			composerHeight : '',
			isTyping : false,
			typingInterval : '',
			typingCloseTimeout : ''
		}
	},

	beforeMount() {
		this.handleTyping = this.$throttle(this.handleTyping, 2500);
	},

	mounted() {
		this.setComposerFocus();
		this.setComposerHeight();
	},

	methods : {
		setComposerFocus() {
			let composer = this.$refs.composer;
			composer && composer.focus();
		},

		setComposerHeight() {
			this.composerHeight = this.$refs.composer.scrollHeight;
		},

		handleComposerInput() {
			this.handleComposerHeight();
			this.handleTyping();
		},

		handleComposerHeight() {
			let composer  = this.$refs.composer;
			composer.style.height = "1px";
			let scrollHeight = composer.scrollHeight;
			if (scrollHeight > 100) {
				scrollHeight = 100;
			}
			this.composerHeight = scrollHeight;
			composer.style.height = `${scrollHeight}px`;
		},

		handleTyping() {
			if (this.receiver.status !== 'online') {
				return;
			}
			let chatId = this.chatDetail._id;
			!this.isTyping && this.sendTypingStatus(chatId, true);
			this.isTyping = true;	
			this.clearTypingDispatcher();		
			this.typingInterval = setTimeout(() => {
				this.isTyping = false;
				this.typingCloseTimeout = setTimeout(() => {
					if (!this.isTyping) {
						this.sendTypingStatus(chatId, false);
					}
				}, 500)
			}, 3000)
		},

		clearTypingDispatcher() {
			clearTimeout(this.typingInterval);
			clearTimeout(this.typingCloseTimeout);
		},

		sendTypingStatus(chatId, is_typing) {
			this.$store.dispatch('chatstore/sendTyping', { chatId, is_typing });
		},

		sendMessage() {
			if (!this.composerValue) {
				return;
			}
			this.isTyping = false;
			this.clearTypingDispatcher();
			let temp_id = getRandomStr();
			let chatId = this.chatDetail._id;
			let text = this.composerValue;
			let params = {
				text,
				temp_id
			}
			let message = {
				...this.getMessageMeta(),
				text,
				type : 'text',
			}
			this.commitMessage(message, temp_id);
			this.$store.dispatch('chatstore/sendMessage', { chatId, params });
			this.composerValue = "";
			this.scrollToEnd();
		},

		scrollToEnd() {
			// Scroll to bottom if the message was sent by the current user
			this.$nextTick()
				.then(() => {
					this.handleComposerHeight();
					this.$emit('scrollToBottom', false);
				})
		},

		getMessageMeta() {
			return {
				sender_id : this.currentUser._id,
				receiver_id : this.receiver._id,
				time : Date.now(),
				isSending : true
			}
		},

		handleFileUpload(e) {
			let file = e.target.files[0];
			if (!file) {
				return;
			}
			let fileReader = new FileReader();
			fileReader.onload = () => {
				let { name, size, type } = file;
				let fileData = {
					name,
					size,
					type,
					buffer : fileReader.result
				}
				let temp_id = getRandomStr();
				this.$store.dispatch('chatstore/upload', {
					chatId : this.chatDetail._id,
					file : fileData,
					temp_id
				});
				let message = {
					...this.getMessageMeta(),
					temp_id,
					type : 'file',
					progress : 0,
					file : fileData
				}
				this.commitMessage(message, temp_id);
				this.scrollToEnd();
			}
			fileReader.readAsDataURL(file);
		},

		commitMessage(message, temp_id) {
			this.$store.commit('chatstore/appendMessage', { chatId : this.chatDetail._id, message, temp_id });
		}
	},

	watch : {
		composerHeight() {
			this.$emit('scrollToBottom');
		},

		chatId : 'setComposerFocus'
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../styles/common";
.composer-cont {
	.posrel;
	.w100;
	.flex;
	.pTB10;
	bottom: 0;
	max-height: 200px;
	border-top: 1px solid #e3e3e3;
}

.composer {
	.flexG;
	.h100;
	.bgW;
	cursor: text;
	border-radius: 25px;
	padding: 12px 20px;
	border : .5px solid;
	border-color: #071e3d;
	box-shadow: .2px .2px 2px #071e3d;
}

.composer.focussed {
	border-color : #2d6cdf;
	box-shadow: .2px .2px 2px #2d6cdf;
}

.composer textarea {
	resize: none;
	.w100;
	height: 22px;
	.font18;
	letter-spacing: .3px;
	font-family: inherit;
	background-color: inherit;
	.bNone;
	.oNone;
	.ovrflw-auto;
	color: black;
}

.send-btn {
	width: 50px;
	.iCenter;
}

.send-btn em {
	.curP;
	color: #285bb9;
}

.attachment {
	width: 50px;
	height: 50px;
	.iCenter;
	.mL5;
	.posrel;
	& label {
		.font25;
		.curP;
	}
	& input {
		.hide;
		.posabs;
		top : 0;
		left : 0;
		.w100;
		.h100;
	}
}
	
</style>