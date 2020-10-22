<template>
	<em 
		:class="[className, 'loader']"
	>
	</em>
</template>

<script>
export default {
	name : "LoadingComponent",
	props : {
		className : {
			type : String,
			default : ''
		}
	}
}
</script>