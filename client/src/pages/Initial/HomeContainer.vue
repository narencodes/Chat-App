<template>
	<div class="index-container">
		<router-view />
	</div>
</template>

<script>
export default {
	name : 'HomeContainer'
}
</script>

<style scoped>
	.index-container {
		padding : 25px;
		width: 20%;
		min-width: 300px;
		border : 1px solid #cdd4d3;
		min-height: 300px;
		margin: auto;
		text-align: center;
		box-shadow: .5px .5px 1.5px #a6a6a6;
	}
</style>