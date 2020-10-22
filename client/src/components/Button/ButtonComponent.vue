<template>
	<div 
		:class="[ className, { 'disable' : isDisabled, 'curWait' : isLoading }, layoutClass ]"
		@click="handleClick"
	>
		{{ isLoading ? '' : content }}
		<Loading v-if="isLoading" />
	</div>
</template>

<script>
import Loading from "@/components/Loading/LoadingComponent";

export default {
	name : "ButtonComponent",
	props : {
		className : {
			type : String,
			default : 'btn'
		},
		isDisabled : {
			type : Boolean,
			default : false
		},
		content : {
			type : String,
			default : ''
		},
		clickHandler : {
			type : Function,
			default : () => {}
		},
		layoutClass : {
			type : String,
			default : ''
		} ,
		isLoading :  {
			type : Boolean,
			default : false
		}
	},

	components : {
		Loading
	},

	methods : {
		handleClick() {
			!this.isLoading && !this.isDisabled && this.clickHandler();
		}
	}
}
</script>