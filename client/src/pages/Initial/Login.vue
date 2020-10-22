<template>
	<div class="flex flexC aiC">
		<div class="h100 w100" v-if="signingIn">
			<LoadingComponent />
			<div class="mT25">
				Signing in with google...
			</div>
		</div>
		<template v-else>
			<div class="taC mB20 font30 bold">
				Login
			</div>
			<InputComponent 
				ref="userInput"
				v-bind="userNameProps"
				:showError="showNameError"
			/>
			<InputComponent 
				ref="passInput"
				v-bind="passwordProps"
				:showError="showPassError"
			/>		
			<ButtonComponent
				v-bind="loginBtnProps"
				:isDisabled="disableLogin"
				class="w-200"
			/>
			<GoogleButton 
				:onSignIn="loginUser"
				@signingIn="() => { signingIn = true }"
			/>
			<p class="mT10">
				Don't have an account ? 
				<a @click="goToRegister">
					Register
				</a>
			</p>
		</template>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import InputComponent from "@/components/Input/InputComponent";
import ButtonComponent from "@/components/Button/ButtonComponent";
import { isValidEmail } from "@/utility/utils";
import { INCORRECT_PASSWORD } from "@/configs/errorcode";
import LoadingComponent from '@/components/Loading/LoadingComponent'

export default {
	name : "Login",

	data() {
		return {
			userNameProps : {
				placeHolder : 'Username / Email-id',
				onInput : this.handleNameInput,
				onEnter : this.handleNameEnter,
				hasFocus : true,
				isLowerCase : true,
				errorText : 'User does not exist'
			},
			passwordProps : {
				placeHolder : 'Password',
				type : 'password',
				errorText : 'Incorrect Password',
				onEnter : this.handlePassEnter,
				onInput : this.handlePassInput,

			},
			loginBtnProps : {
				content : 'login',
				className : 'btn mT5',
				isLoading : false,
				clickHandler : this.handleLogin
			},
			userName : '',
			pass : '',
			showNameError : false,
			showPassError : false,
			signingIn : false
		}
	},

	computed : {
		...mapState([ 'destination' ]),

		disableLogin() {
			let vm = this;
			return !(vm.userName && vm.pass) || vm.showNameError;
		}
	},

	beforeMount() {
		this.checkIsUser = this.$debounce(this.checkIsUser, 500);
	},

	methods : {
		goToRegister() {
			this.$goTo('Register');
		},

		handleNameInput(name) {
			this.userName = name;
			if (!name) {
				this.showNameError = false;
				return;
			}
			let isEmail = isValidEmail(name);
			let key = isEmail ? 'email_id' : 'user_name';
			let params = { [key] : name };
			this.checkIsUser(params);
		},

		checkIsUser(params) {
			this.$store.dispatch('authstore/checkUserExists', params)
				.then(isFound => {
					this.showNameError = !isFound; // Show error if the username is not found
				})
		},

		handleNameEnter() {
			this.userName && !this.showNameError && this.$refs.passInput.setFocus(); // Set focus to password input on pressing enter in username input
		},

		handlePassInput(pass) {
			this.pass = pass;
			this.showPassError = false;
		},

		handlePassEnter() {
			!this.disableLogin && this.handleLogin(); // Proceed to login if the user presses enter on password input
		},

		handleLogin() {
			let loginBtn = this.loginBtnProps;
			if (loginBtn.isLoading) {
				return;
			}
			this.showPassError = false;
			loginBtn.isLoading = true;
			let { userName : user_name, pass } = this;
			let is_email = isValidEmail(user_name)
			let params = {
				user_name,
				is_email,
				pass
			}
			this.loginUser(params, loginBtn);
		},

		loginUser(params, btn = {}) {
			this.$store.dispatch('authstore/loginUser', params)
				.then(() => {
					this.destination ? this.$router.push(this.destination) : this.$goTo('UserChats');
				})
				.catch(errCode => {
					if (errCode === INCORRECT_PASSWORD) {
						this.showPassError = true;
					}
					window.gapi.auth2.getAuthInstance().signOut();
				})
				.finally(() => {
					btn.isLoading = false;
					this.signingIn = false;
				})
		}
	},

	components : {
		InputComponent,
		ButtonComponent,
		LoadingComponent,
		GoogleButton : {
			name : 'GoogleButton',

			template : `<div class='mT10 diB' id='googleButton'></div>`,

			props : {
				onSignIn : {
					type : Function,
					default : () => {}
				},
			},

			computed : {
				...mapGetters([ 'isLoggedIn' ])
			},

			mounted() {
				this.renderButton();
			},

			methods : {
				renderButton() {
					if (!window.gapi) {
						return;
					}
					window.gapi.signin2.render('googleButton', {
						'scope': 'profile email',
						'width': 200,
						'height': 40,
						'longtitle': false,
						'theme': 'dark',
						'onsuccess': this.handleGoogleSignIn,
						'onfailure': () => {}
					});
				},

				handleGoogleSignIn(googleUser) {
					if (this.isLoggedIn) {
						return;
					}
					this.$emit('signingIn');
					let profile = googleUser.getBasicProfile();
					let email_id = profile.getEmail();
					let user_name = profile.getName();
					let img_url = profile.getImageUrl();
					let userObj = {
						user_name,
						email_id,
						img_url,
						account_type : 'google'
					}
					this.onSignIn(userObj);
				}
			}
		}
	}
}
</script>