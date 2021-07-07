<template>
	<div 
		class="overlay"
	>
		<div 
			class="dialog-popup"
			v-exit="closePopup"
		>
			<IconComponent type="close" :onClick="closePopup"></IconComponent>
			<div>
				<IconComponent :type="iconType" className="icon"></IconComponent>
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
			<IconComponent :type="iconType" className="bg-icon"></IconComponent>			
		</div>
	</div>
</template>

<script>

import ButtonComponent from "@/components/Button/ButtonComponent";
import IconComponent from '@/components/Icon/IconComponent';

export default {
	name : 'Popup',

	components : {
		ButtonComponent,
		IconComponent
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
		},
		closeHandler : {
			type : Function,
			default : () => {}
		}
	},

	methods : {
		closePopup() {
			this.$closePopup();
			this.closeHandler();
		}
	}
}
</script>