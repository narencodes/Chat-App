<template>
	<div 
		class="flex"
		:class="{
			'last-mess-cont' : isLast
		}"
	>
		<Avatar 
			v-if="isLast" 
			:userId="message.sender_id"
		/>
		<div
			:class="['msg-wrapper', type, { 'sending' : isSending }]"
		>
			<div :class="['msg-holder', { 'floatR' : isSender }]">
				<span class="message" v-if="type === 'text'">
					{{ text }}
				</span>
				<ImgFile v-else-if="type === 'file'" :file="file" :uploadProgress="uploadProgress"></ImgFile>
				<p>
					<span class="msg-info" v-tip:right="readableDate">{{ message.time | getFormattedTime }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { chatDetailMixin, transcriptMixin } from "../mixins/chatDetailMixin";
import Avatar from '@/components/Image/Avatar';
import ImgFile from '@/components/Image/ImgFile';

export default {
    name : 'ChatBodyMessageDisplay',
    
	mixins: [ chatDetailMixin, transcriptMixin ],
	
	props : {
		isLast : {
			type : Boolean,
			default : false
		}
	},
	
	components : {
		Avatar,
		ImgFile
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../../../styles/common.less";

// .msg-cont {
// 	.posrel;
	
// 	.flex;
// 	width: 300px;
// 	margin-left: 55px;
// 	&:hover {
// 		.msg-info {
// 			.flex;
// 		}
// 	}
// }

.msg-wrapper {
	.mB10;
	margin-left: 55px;
	.posrel;
	.w100;
	& .message {
		letter-spacing: .3px;
		.diB;
		line-height: 25px;
		.fshrink;
		padding : 5px 5px;
	}
	&.sending{
		.ovrflw-hid;
		& .msg-holder {
			background-color: #2d6cdfba !important;
		}
	}
	// &:hover {
	// 	.msg-info {
	// 		.diB;
	// 	}
	// }
	@media(max-width: 600px) {
		margin-left: 45px;
	}
}



.sender-cont {
	.msg-info {
		.clrW;
	}
}

.msg-holder {
	.posrel;
	.flexV;
	min-width: 100px;
	width: fit-content;
	max-width: 50%;
	padding: 5px;	
	border-radius: .7em;
	background-color: #cfcfcf;
	@media(max-width: 600px) {
		max-width: 85%;
	}
}

.msg-info {
	.mT5;
	.floatR;
	.fshrink;
	bottom: 5px;
	.clrGray;
	.fshrink;
	font-size: 12px
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
</style>