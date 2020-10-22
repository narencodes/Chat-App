<template>
	<div class="input-wrapper">
		<div 
			class="input-container"
			@click="handleContainerClick"
		>
			<em 
				class="icon"
				:class="iconClass"
			>
			</em>
			<input 
				:class="{ 'pL25' : hasIcon, 'pR30' : (isPassword && isFocussed) }"
				v-model.trim="inputValue"
				:type="inputType" 
				:ref="name"
				:name="name" 
				:placeholder="(isFocussed && !hasPlaceHolderOnFocus) ? placeHolder : ''"
				:maxlength="maxLength"
				@focus="handleFocus"
				@blur="handleBlur"
				@keydown.enter="onEnter(inputValue)"
				@keydown.escape="onEscape"
				required
			/>
			<label 
				:for="name" 
				class="input-label" 
				:class="{ 'error' : showError, 'info' : showInfo }"
			>
				<span 
					v-if="!isFocussed || hasPlaceHolderOnFocus"
					class='input-placeholder'
					:class="{ 'pL25' : hasIcon }"
				>
					{{ placeHolder }}
				</span>
			</label>
			<em 
				v-if="isPassword && isFocussed"
				class="icon view fa"
				:class="[ isPasswordShown ? 'fa-eye-slash' : 'fa-eye']"
				@mousedown="togglePassword"
			>
			</em>
		</div>
		<div class="input-info">
			<span 
				v-if="showInfo && isFocussed"
				class="clrG floatL taL"
			>
				{{ infoText }}
			</span>
			<span 
				v-else-if="showError"
				class="clrR floatL"
			>
				{{ errorText }}
			</span>
			<span 
				v-if="showCharCount && isFocussed"
				class="clrGray floatR"
				:class="{ 'clrR' : length >= maxLength }"
			>
				{{ length }}/{{ maxLength }}
			</span>
		</div>
	</div>
</template>

<script>
import { getRandomStr } from "@/utility/utils";

export default {
	name : 'InputComponent',
	props : {
		type : { // defines input type
			type : String,
			default : 'text'
		},
		name : { // Input name through which we refer that input
			type : String,
			default : () => getRandomStr() // Generation random string to identify our input
		},
		hasIcon : { // For Icons like search
			type : Boolean,
			default : false
		},
		iconClass : { // Font awesome icon class name
			type : String,
			default : ''
		},
		isLowerCase : {
			type : Boolean,
			default : false
		},
		placeHolder : { // input placeholder text
			type : String,
			required : true
		},
		hasPlaceHolderOnFocus : {
			type : Boolean,
			default : true
		},
		showCharCount : { // Define whether to show input char length
			type : Boolean,
			default : false
		},
		hasFocus : { // Defines whether to set focus on mount
			type : Boolean,
			default : false
		},
		showInfo : {
			type : Boolean,
			default : false
		},
		showError : { // Defines whether to show error
			type : Boolean,
			default : false
		},
		infoText : { // Info to be shown under the input
			type : String,
			default : ""
		},
		errorText : { // Error text to be shown
			type : String,
			default : ""
		},
		maxLength : { // Max char limit
			type : Number
		},
		value : { // Input value to be prefilled
			type : String,
			default : ''
		},
		onInput : { // callback on input
			type : Function,
			default : () => {}
		}, 
		onFocus : { // callback on input focus
			type : Function,
			default : () => {}
		},
		onBlur : { //callback on input blur
			type : Function,
			default : () => {}
		},
		onEnter : { // callback on pressing enter key
			type : Function,
			default : () => {}
		},
		onEscape : { // callback on pressing escape key
			type : Function,
			default : () => {}
		}
	},

	data() {
		return {
			inputType : this.type,
			inputValue : this.value,
			isPassword : this.type === 'password',
			isPasswordShown : false,
			isFocussed : false
		}
	},

	computed : {
		length() {
			return this.inputValue.length;
		},

		el() {
			return this.$refs[this.name];
		}
	},

	watch : {
		inputValue(newVal) {
			this.inputValue = this.isLowerCase ? newVal.toLowerCase() : newVal;
			this.onInput(this.inputValue);
		}
	},

	mounted() {
		this.hasFocus && this.setFocus();
	},

	methods: {
		togglePassword() {
			let isPassword = this.inputType === 'password';
			this.inputType = isPassword ? 'text' : 'password';
			this.isPasswordShown = !this.isPasswordShown;
			let vm = this;
			setTimeout(() => {
				vm.setFocus();
			}, 0)
		},

		handleFocus(event) {
			event.preventDefault();
			this.isFocussed = true;
			this.setFocus();
			this.onFocus();
			// this.el.select();
		},

		handleBlur() {
			this.isFocussed = false;
			this.onBlur();
		},

		setFocus() {
			let input = this.el;
			if (!input) {
				return;
			}
			input.focus();
			this.setSelection();
		},

		setSelection() {
			let caretPos = this.length;
			this.el.setSelectionRange(caretPos, caretPos);
			this.el.scrollLeft = 999999;
		},

		handleContainerClick({ target }) {
			if (target === this.$refs[this.name]) {
				return;
			}
			this.setFocus();
		}
	}
}
</script>