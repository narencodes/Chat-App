<template>
	<div class="chat-body-header">
		<div 
			v-if="!$attrs.is600px"
			class="iCenter mR20 font20"
		>
			<em 
				@click="goToChatHome"
				class="fa fa-chevron-left curP"
			>
			</em>
		</div>
		<Avatar :userId="receiver._id" :key="receiver._id"/>
		<div class="name-container">
			<span class="user-name">
				{{ receiver.user_name }}
			</span>
			<span class="last-seen">
				{{ isReceiverOnline ? 'online' : lastSeen }}
			</span>
		</div>
	</div>
</template>

<script>
import Avatar from "../Image/Avatar";
import { chatDetailMixin } from "./mixins/chatDetailMixin"; 
import { getFormattedLastSeen } from "@/utility/utils";

export default {
	name : 'ChatHeader',

	mixins : [chatDetailMixin],

	computed : {
		isReceiverOnline() {
			return this.receiver.status === 'online';
		},

		lastSeen() {
			return getFormattedLastSeen(this.receiver.last_online)
		}
	},

	components : {
		Avatar
	},

	methods : {
		goToChatHome() {
			this.$goTo('UserChats');
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";
.chat-body-header {
	.w100;
	.flex;
	.fshrink;
	height: 70px;
	background-color: #efecec;
    color: #071e3d;
	padding : 0px 20px;
	border-bottom: 1px solid #e3e3e3;
}

.name-container {
	margin-left: 15px;
	display: flex;
	flex-grow: 1;
	justify-content: center;
	flex-direction: column;
}

.user-name {
	font-size: 25px;
	text-transform: capitalize;
	.fW600;
}

.last-seen {
	letter-spacing: .5px;
	.font18;
}
</style>