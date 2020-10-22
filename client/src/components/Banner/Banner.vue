<template>
	<div class="banner">
		<em 
			v-if="hasIcon"
			:class="[ bannerIcon, { error : isError } ]"
		>
		</em>
		<span> 
			{{ content }}
		</span>			
		</div>
</template>

<script>

let iconMapping = {
	success : 'fa fa-check',
	error : 'fa fa-exclamation'
};

export default {
	name : "Banner",

	props : {
		hasIcon : {
			type : Boolean,
			default : true
		},
		iconType : {
			type : String,
			default : ''
		},
		content : {
			type : String,
			required : true
		},
		isError : {
			type : Boolean,
			default : false
		}
	},

	data() {
		return {
			bannerIcon : ''
		}
	},

	beforeMount() {
		this.init();
	},

	methods: {
		init() {
			this.setIcon();
		},
		
		setIcon() {
			this.bannerIcon = iconMapping[this.iconType];
		}
	},
}
</script>