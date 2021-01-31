<template>
	<div class="banner">
		<IconComponent v-if="iconType" :type="iconType" :className="isError ? 'error' : ''"></IconComponent>
		<span>{{ content }}</span>			
		</div>
</template>

<script>
import IconComponent from '@/components/Icon/IconComponent';

export default {
	name : "Banner",
	
	components: {
		IconComponent,
	},

	props : {
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
	}
}
</script>