<template>
	<div class="overlay">
		<div 
			class="new-chat"
			v-click-out="handleClose"
			v-escape="handleClose"
		>
			<IconComponent 
				type="close"
				:onClick="handleClose"
			/>
			<ChatInvite 
				@close="handleClose"
				:code="currentUser._id"
				@copy="copyCode"
			/>
			<hr />
			<JoinChat
				:showIdError="showIdError"
				:onJoin="handleChatJoin" 
				@id-change="showIdError = false"
			/>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import ButtonComponent from "../Button/ButtonComponent";
import IconComponent from "../Icon/IconComponent";
import InputComponent from "../Input/InputComponent";
import { isMobileDevice, checkIfObjectId } from "@/utility/utils";
import { USER_NOT_FOUND } from '@/configs/errorcode' 

export default {
	name : "NewChat",

	data() {
		return {
			showIdError : false
		}
	},

	computed: {
		...mapState({
			currentUser : ({ userstore }) => userstore.currentUser
		})
	},

	methods : {
		handleClose() {
			this.$emit('close')
		},

		copyCode() {
			navigator.clipboard.writeText(this.currentUser._id)
				.then(() => {
					this.$successBanner('Copied to clipboard');
					this.$emit('close');
				})
				.catch(() => {
					this.$errorBanner('Unable to copy code');
				})
		},

		handleChatJoin(id, btnContainer) {
			if (id === this.currentUser._id || !checkIfObjectId(id)) { // To check if the id is user id or if the id is not a valid ObjectId
				this.showIdError = true;
				return;
			};
			let params = {
				receiver_id : id
			}
			btnContainer.isLoading = true;
			this.$store.dispatch('chatstore/createNewChat', params)
				.then(chat => {
					this.$goTo('Chat', { id : chat._id });
					this.handleClose();
				})
				.catch(code => {
					if (code === USER_NOT_FOUND) {
						this.showIdError = true;
						return;
					}
					this.handleClose();
				})
				.finally(() => {
					btnContainer.isLoading = false;
				})
		},
	},

	components : {
		IconComponent,
		ChatInvite : {
			name : 'ChatInvite',
			template : `<div class="invite-link">
							Send this code to your friends to connect with You!
							<div 
								class="link"
								@click="$emit('copy')"
							>
								<span>
									{{ code }}
								</span>
								<em class="fa fa-clone"></em>
							</div>
						</div>`,
			props : {
				code : {
					type : String,
					required : true
				}
			}
		},
		JoinChat : {
			name : "JoinChat",
			template : `<div class="mT20 mB20">
							<p class="mB20 font18">To connect with other users enter their User Id </p>
							<div class="flex flexC aiC">
								<input-component
									v-bind="inputProps"
									:showError="showIdError"
								>
								</input-component>
								<button-component 
									class="mT10"
									v-bind="joinBtnProps"
									:isDisabled="isJoinDisabled"
								>
								</button-component>
							</div>
						</div>`,

			props : {
				showIdError : {
					type : Boolean,
					default : false
				},
				onJoin : {
					type : Function,
					default: () => {}
				}
			},

			components : {
				ButtonComponent,
				InputComponent
			},

			data() {
				return {
					joinBtnProps : {
						content : 'Join Chat',
						clickHandler : this.handleJoin,
						isLoading : false
					},
					inputProps : {
						placeHolder : "User ID",
						errorText : 'Invalid user id',
						onInput : this.handleInput,
						hasFocus : !isMobileDevice(),
						onEnter : this.handleJoin
					},
					joinId : ''
				}
			},

			computed : {
				isJoinDisabled() {
					return !this.joinId || this.showIdError
				}
			},

			methods : {
				handleInput(value) {
					this.joinId = value;
					this.$emit('id-change');
				},
				handleJoin() {
					if (this.isJoinDisabled) {
						return;
					}
					this.onJoin(this.joinId, this.joinBtnProps)
				}
			}
		}
	}
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";

	/deep/ .input-wrapper {
		width: 80%;
	}
	/deep/ .new-chat {
		.p50;
		padding-bottom: 0px;
		.taC;
		.center;
		.bgW;
		max-width: 500px;
		z-index: 2;
		& .close {
			.posabs;
			right: 10px;
			top: 10px;
		}
		& .invite-link {
			.mB30;
			.font18;
			& .link {
				cursor: copy;
				.flex;
				.justifySB;
				.aiC;
				.mT20;
				.w100;
				height: 50px;
				background-color: #b5b5b585;
				.pLR20;
				& span {
					.font20;
					font-weight: 600;
					letter-spacing: .2px;
					.elips;
					max-width: 95%;
					.mR15;
					color: #202020f5;
				}
				& em {
					line-height: 27px;
					.font25;
					color: #4a4a4a;
				}
			}
		}
		@media (max-width:500px) {
			.p30;
			width: 300px;
			& .close {
				top: 5px;
				right: 5px;
			}
		}
		@media (max-height:450px) {
			height: 75%;
			overflow: scroll;
		}
	}
</style>