<template>
	<div class="flex flexC aiC">
		<div class="taC mB20 font30 bold">
			Register
		</div>
		<InputComponent 
			ref="userInput"
			v-bind="userNameProps"
			:showError="showNameError"
		/>
		<InputComponent 
			ref="emailInput"
			v-bind="emailProps"
			:showError="showEmailError"
		/>
		<InputComponent 
			ref="passInput1"
			v-bind="password1Props"
			:showError="showPassError"
		/>
		<InputComponent 
			ref="passInput2"
			v-bind="password2Props"
			:showError="isPassMisMatch"
		/>		
		<ButtonComponent
			class="w-200"
			v-bind="regBtnProps"
			:isDisabled="disableRegister"
		/>
		<p class="mT20">
			Already have an account ? 
			<a @click="goToLogin">
				Login
			</a>
		</p>
	</div>
</template>

<script>
import InputComponent from "@/components/Input/InputComponent";
import ButtonComponent from "@/components/Button/ButtonComponent";
import store from "@/store/Authentication/AuthenticationStore";
import { isValidEmail } from "@/utility/utils";

const _minPassLength = 8;

export default {
	name : "Register",

	components : {
		InputComponent,
		ButtonComponent
	},

	data() {
		return {
			userNameProps : {
				placeHolder : 'Username *',
				hasFocus : true,
				infoText : 'Username is available',
				showInfo : false,
				errorText : 'Username is taken',
				isLowerCase : true,
				onInput : this.handleUserInput,
				onEnter : this.handleNameEnter
			},
			emailProps : {
				placeHolder : 'Email *',
				onInput : this.handleEmailInput,
				onEnter : this.handleEmailEnter,
				isLowerCase : true,
				errorText : ''
			},
			password1Props : {
				placeHolder : 'Password *',
				type : 'password',
				errorText : 'Minimum 8 characters',
				onInput : this.handlePass1Input,
				onEnter : this.handlePass1Enter
			},
			password2Props : {
				placeHolder : 'Verify Password *',
				type : 'password',
				errorText : 'Passwords do not match',
				onInput : this.handlePass2Input,
				onEnter : this.handlePass2Enter
			},
			regBtnProps : {
				content : 'Register',
				layoutClass : 'mT10',
				isLoading : false,
				clickHandler : this.handleRegistration
			},
			showNameError : false,
			showEmailError : false,
			showPassError : false,
			isPassMisMatch : false,
			userName : '',
			emailId : '',
			pass1 : '',
			pass2 : ''
		}
	},

	computed : {
		disableRegister() {
			let vm = this;
			return !(vm.userName && vm.emailId && vm.pass1 && vm.pass2) || vm.showNameError || vm.showEmailError || vm.showPassError || vm.isPassMisMatch;
		}
	},

	beforeMount() {
		this.checkIsUser = this.$debounce(this.checkIsUser, 300);
	},

	methods : {
		goToLogin() {
			this.$goTo('Login');
		},

		handleUserInput(name) {
			this.userName = name;
			this.showNameError = false;
			if (!name) {
				this.userNameProps.showInfo = false;
				return;
			}	
			if (name.length < 5) {
				this.showNameError = true;
				this.userNameProps.errorText = 'Mininum 5 characters';
				return;
			}
			let params = { user_name : name };
			let onSuccess = isFound => {
				this.showNameError = isFound;
				this.userNameProps.errorText = isFound ? 'Username already Exists' : '';
				this.userNameProps.showInfo = !isFound;
			}
			this.checkIsUser(params, onSuccess)
		},

		handleEmailInput(email) {
			this.emailId = email;
			this.showEmailError = false;
			if (!email) {
				return;
			}
			if (!isValidEmail(email) || email.length > 255) { // Checking if it is valid email and its length is more than 255
				this.showEmailError = true;
				this.emailProps.errorText = email.length > 255 ? 'Too many chararcters' : 'Invalid email';
				return;
			}
			let params = { email_id : email };
			let onSuccess = isFound => {
				this.showEmailError = isFound;
				this.emailProps.errorText = 'Email Id already exists';
			}
			this.checkIsUser(params, onSuccess);
		},

		checkIsUser(params, onSuccess) {
			store.dispatch('checkUserExists', params)
				.then(onSuccess);
		},

		handlePass1Input(pass) {
			this.pass1 = pass;
			let isMinimumLength = !!pass && (pass.length < _minPassLength);
			this.showPassError = isMinimumLength;
			this.checkPasswordMatch();
		},

		handlePass2Input(pass) {
			this.pass2 = pass
			this.checkPasswordMatch();
		},

		checkPasswordMatch() {
			let  { pass1, pass2 } = this;
			this.isPassMisMatch = (!!pass1 && !!pass2 && (pass1 !== pass2));
		},

		handleNameEnter() {
			this.userName && !this.showNameError && this.nextInput('email')
		},

		handleEmailEnter() {
			this.emailId && !this.showEmailError && this.nextInput('pass1');
		},

		handlePass1Enter() {
			this.emailId && !this.showPassError && this.nextInput('pass2');
		},

		handlePass2Enter() {
			!this.disableRegister && this.handleRegistration();
		},

		nextInput(inputRef) {
			let inputMapping = {
				email : 'emailInput',
				pass1 : 'passInput1',
				pass2 : 'passInput2'
			};
			let input = this.$refs[inputMapping[inputRef]];
			input && input.setFocus && input.setFocus();
		},

		handleRegistration() {
			let registerBtn = this.regBtnProps;
			if (registerBtn.isLoading) {
				return;
			}
			let userObj = {
				user_name : this.userName,
				email_id : this.emailId,
				password : this.pass1
			}
			registerBtn.isLoading = true;
			store.dispatch('createUser', userObj)
				.then(() => {
					this.$successBanner('Account created Successfully');
					this.$goTo('Login');
				})
				.finally(() => {
					registerBtn.isLoading = false;
				})
		}
	}
}
</script>