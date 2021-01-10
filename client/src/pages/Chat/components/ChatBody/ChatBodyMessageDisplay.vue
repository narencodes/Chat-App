<template>
    <!-- <div class="msg-cont">
        <span class="mT15">{{ message.time | getReadableDate(true) }}</span>
    </div> -->
    <div 
        class="msg"
        :class="[type, { 'sending' : isSending }]"
    >
        <span class="message" v-if="type === 'text'">
            {{ text }}
        </span>
        <template v-else-if="type === 'file'" >
            <img 
                :src="file.buffer || file.url" 
                :alt="file.name"
            />
            <div 
                v-if="isSending && uploadProgress < 100"
                class="image-loader"
                :style="{ display : 'flex', transform : `translateX(${uploadProgress}%)` }"
            >
            </div>
        </template>
    </div>
</template>

<script>
import { chatDetailMixin, transcriptMixin } from "../mixins/chatDetailMixin";

export default {
    name : 'ChatBodyMessageDisplay',
    
    mixins: [ chatDetailMixin, transcriptMixin ]
}
</script>

<style lang="less" scoped>
@import (reference) "../../../../styles/common.less";

.msg {
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
			background-color: #2d6cdfba !important;
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
</style>