<template>
	<div class="avatar">
		<img
			class="profile-image"
			:class="{ 'curP' : isClickable }"
			:src="imageURL | imgURL"
			@error="handleImgLoadErr"
			@click="handleImgClick"
		/>
		<em  v-if="showStatus" :class="['status-icon', (user.status || status)]"></em>
	</div>
</template>

<script>
import { dummyImg } from "@/utility/constants";
import { mapGetters } from 'vuex';

export default {
	name : "Avatar",
	props : {
		src : {
			type : String,
			default : ''
		},
		status : {
			type : String,
			default : 'offline',
			validator : (value) => {
				return ['online', 'offline'].includes(value);
			}
		},
		userId : {
			type : String,
			default : ''
		},
		showStatus : {
			type : Boolean,
			default : false
		},
		isClickable : {
			type : Boolean,
			default : false
		},
		onImgClick : {
			type : Function,
			default : () => {}
		}
	},

	data() {
		return {
			imageURL : ''
		}
	},

	computed : {
		...mapGetters('userstore', ['getFriendDetail']),

		user() {
			if (!this.userId) {
				return {}
			}
			let { img_url : imgURL, status } = this.getFriendDetail(this.userId);
			return {
				imgURL,
				status
			} 
		},
	},

	beforeMount() {
		this.setImgURL();
	},

	methods : {
		setImgURL() {
			this.imageURL = this.user.imgURL || this.src || dummyImg;
		},
		
		handleImgLoadErr() {
			this.imageURL = dummyImg;
		},

		handleImgClick(e) {
			this.isClickable && e.stopPropagation() && this.onImgClick();
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) '../../styles/common.less';
.avatar {
	.flex;
	.aiC;
	.posrel;
	& .profile-image {
		width: 45px;
		height: 45px;
		.bR50;
		@media(max-width: 600px) {
			width : 35px;
			height : 35px;
		}
	}
	& .status-icon {
		.posabs;
		width: 12px;
		height: 12px;
		border: 1px solid #8f8f8f;
		.bR50;
		right: 0px;
		bottom: 12px;
		&.online {	
			background-color: #25e800e0;
		}
		&.offline {
			background-color: #f03131;
		}
	}
}
</style>