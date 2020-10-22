<template>
	<div 
		class="overlay"
		v-escape="closePopup"
	>
		<div 
			class="dialog-popup"
			v-click-out="closePopup"
		>
			<em 
				v-if="hasClose"
				class="close fa fa-times"
				@click="closePopup"
			>
			</em>
			<div>
				<em :class="['icon', icon]"></em>
				<div class="title">
					{{ title }}
				</div>
				<div class="content">
					{{ content }}
				</div>
				<div class="mT40 flex w100">
					<ButtonComponent
						v-for="(button, index) in buttonsList"
						:key="index"
						v-bind="button"
						class="w100"
					/>
				</div>
			</div>	
			<em :class="['bg-icon', icon]"></em>			
		</div>
	</div>
</template>

<script>

import ButtonComponent from "@/components/Button/ButtonComponent";

let iconMapping = {
	delete : 'fa fa-trash'
}

export default {
	name : 'Popup',

	components : {
		ButtonComponent
	},

	props : {
		title : {
			type : String,
			required : true
		},
		content : {
			type : String,
			required : true
		},
		buttonsList : {
			type : Array,
			required : true
		},
		hasClose : {
			type : Boolean,
			default : true
		},
		iconType : {
			type : String,
			required : true
		}
	},

	data() {
		return {
			icon : iconMapping[this.iconType]
		}
	},

	methods : {
		closePopup() {
			this.$closePopup();
		}
	}
}
</script>