<template functional>
	<em
		:class="[
			'fa', 
			`fa-${props.iconMapping[props.type]}`, 
			props.className, 
			{ 'curP' : !!props.onClick }
		]"
		@click="() => props.onClick && props.onClick()"
		v-tip:[props.tipDirection]="props.tip"
	>
	</em>
</template>

<script>
const iconMapping = {
	close : 'times close',
	success : 'check',
	error : 'exclamation',
	info : 'info',
	image : 'file-image',
	"info-circle" : 'info-circle clr8',
	gamepad : 'gamepad',
	notification : 'bell',
	logout : 'sign-out',
	delete : 'trash',
	dropdown : 'chevron-down clr8',
	selected : 'check',
	add : 'plus',
	calendar : 'calendar clr8',
	"right-arrow" : 'chevron-right',
	"left-arrow" : 'chevron-left'
}

export default {
	name : 'Icon',

	props : {
		type : {
			type : String,
			required : true
		},
		onClick : {
			default : undefined
        },
        className : {
            type : String,
            default : ""
		},
		tip : {
			type : String,
			default : ""
		},
        iconMapping : {
            default : () => iconMapping
		},
		tipDirection : {
			type : String,
			default : 'top'
		}
    }
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";
.close {
	color: #787878;
	.font20;
	.curP;
	.iCenter;
	width: 30px;
	height: 30px;
	.bR50;
	&:hover {
		.clrW;
		background-color: #707070;
		transition: .25s ease-in-out;
	}
	@media (max-width:400px) {
		.font15;
	}
}
</style>