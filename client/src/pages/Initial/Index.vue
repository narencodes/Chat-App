<template>
	<div class="home flexV h100">
		<div class="img-container">
			<img :src='imgSrc | imgURL'>
		</div>
		<div class="btn-container">
			<ButtonComponent 
				v-bind="loginButton"
			/>
			<ButtonComponent 
				v-bind="registerButton"
			/>
		</div>
	</div>
</template>

<script>
import { FLAG_PATH } from '@/utility/constants';
import ButtonComponent from "@/components/Button/ButtonComponent";

export default {
	name: 'Index',
	
	data() {
		return {
			imgSrc : FLAG_PATH,
			loginButton : {
				content : 'Login',
				clickHandler : () => { this.$goTo('Login') }
			},
			registerButton : {
				content : 'Register',
				className : 'wbtn mL20',
				clickHandler : () => { this.$goTo('Register'); }
			}
		}
	},

	components : {
		ButtonComponent
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";
.home .img-container {
	.flex;
	.w100;
	height: 50%;
}

.home .img-container img {
	width: 30%;
	.mgA;
}

.home .btn-container {
	.mgA;
	.mT25;
	.taC;
	.flex;
}
</style>
