<template>
	<em
		:class="iconClass"
		@click="onClick"
	>
	</em>
</template>

<script>
const iconClassMapping = {
	close : 'close fa fa-times'
}
export default {
	name : 'IconComponent',

	props : {
		type : {
			type : String,
			required : true,
			validator(value) {
				return ['close'].includes(value);
			}
		},
		onClick : {
			type : Function,
			default : () => {}
		}
	},

	data() {
		return {
			iconClass : iconClassMapping[this.type]
		}
	}
}
</script>