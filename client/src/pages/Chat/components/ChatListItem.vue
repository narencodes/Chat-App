<template>
	<div 
		class="chat-item"
		:class="{ 'sel' : selectedChatId === chatId }"
		@click="switchChat"
	>
		<Avatar 
			:showStatus="true"
			:userId="receiver._id"
		/>
		<div class="chat-detail-wrapper">
			<div class="chat-detail">
				<div class="name-container">
					<span class="elips fW600">
						{{ receiver.user_name }}
					</span>
				</div>
				<span class="chat-time" v-if="lastMessage.time" v-tip="getReadableDate(lastMessage.time, true)">
					{{ lastMessage.time | getFormattedTime }}
				</span>
			</div>
			<div 
				class="iCenter"
				v-if="lastMessage.type || isTyping"
			>
				<span class="msg-cont" v-if="isTyping">Typing...</span>
				<template v-else>
					<div class="msg-cont">
						<span class="last-message" v-tip.elips="lastMessage.text || lastMessage.file.name">
							<em 
								v-if="isFile"
								class="fa fa-camera mR10"
							>
							</em>{{ !isFile ? lastMessage.text : lastMessage.file.name }}</span>
					</div>
					<template>
						<div 
							v-if="currentUser._id === lastMessage.sender_id"
							class="read-marker"
							:class="{ 'read' : lastMessage.is_read }"
						>
							<em v-if="lastMessage.isSending" class="fa fa-clock-o"></em>
							<template v-else>
								<em class="fa fa-check"></em>
								<em 
									v-if="lastMessage.is_delivered"
									class="fa fa-check double"
								>
								</em>	
							</template>
						</div>
						<span 
							v-else-if="unreadCount"
							class="unread-count"
						>
							{{ unreadCount > 1000 ? '999+' : unreadCount }}
						</span>
					</template>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Avatar from "@/components/Image/Avatar";
import { chatDetailMixin } from "./mixins/chatDetailMixin";
import { getReadableDate } from "@/utility/timeUtil";

export default {
	name : 'ChatItem',

	mixins : [ chatDetailMixin ],

	computed : {
		...mapState('chatstore', ['selectedChatId']),
		
		isFile() {
			return this.lastMessage.type === 'file';
		}
	},

	methods : {
		switchChat() {
			if (this.chatId !== this.selectedChatId) {
				this.$goTo('Chat', { id : this.chatId });
			}
		},
		
		getReadableDate
	},

	components : {
		Avatar
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../styles/common.less";
	.chat-item {
		.w100;
		height: 70px;
		.pLR20;
		.flex;
		.curP;
		border-bottom: 1px solid #e3e3e3;
		&:hover, &.sel {
			background-color: @btnBG;
			color: #fff;
			& em.fa-check, em.fa-clock-o, em.fa-camera {
				color: #fff;
			}
			& .read .fa-check {
				color : #8ae2ffe3;
			}
		}
		&.sel {
			.curDef;
		}
	}
	.chat-detail-wrapper {
		.mL15;
		.taL;
		.flexV;
		.flexG;
		.ovrflw-hid;
		.justifyC;
	}
	.chat-detail {
		.flex;
		.mB5;
		.taC;
		.aiC;
		min-width: 0;
		& .name-container {
			.flex;
			.flexG;
			.font20;
			.textC;
			.ovrflw-hid;
			letter-spacing: .5px;
		}
	}
	.msg-cont {
		.flex;
		.flexG;
		.ovrflw-hid;
		.aiC;
		.last-message {
			.elips;
			.maW100;
		}
	}

	.chat-time {
		.fshrink;
		.mL10;
		.font18;
	}

	.read-marker {
		.mL10;
		.flex;
		.font14;
		min-width: 20px;
		.posrel;
		&.read .fa-check {
			color: #2f89fc;
		}
		& .fa-check {
			color: #979797d4;
		}
		& .double {
			.posabs;
			left: 5px;
		}
	}
	.unread-count {
			.iCenter;
			.clrW;
			.mL5;
			.fshrink;
			min-width: 20px;
			border-radius : 1em;
			background-color : #124b93;
			height: 20px;
			padding: .5em;	
		}
	@media(min-width: 600px) and (max-width: 1000px) {
		.chat-item .chat-detail-wrapper .chat-detail .chat-name {
			.font16;
		}
	}
</style>