<template>
    <transition enter-active-class="fade-in" leave-active-class="fade-out" appear>
        <span 
            v-if="showTooltip"
            :class="['tip', arrowMapping[tipDirection]]" 
            :style="{ 
                top : `${top}px`, 
                left : `${left}px` 
            }"
        >
            {{ content }}
        </span>
    </transition>
</template>

<script>
export default {
    name : 'Tooltip',
    
    props : {
        el : {
            type : HTMLElement,
            required : true
        },
        content : {
            type : String,
            required : true
        },
        direction : {
            type : String,
            default : "top"
        }
    },
    
    data() {
        return {
            className: '',
            top : 0,
            left : 0,
            tipDirection : this.direction,
            arrowSize : 10, // Tooltip arrow width, height
            arrowMapping : {
                top : 't-bottom',
                left : 't-right',
                bottom : 't-top',
                right : 't-left'
            }
        }
    },
    
    computed : {
        showTooltip() {
            return document.contains(this.el);
        },
        // Targets properties - width, height, top, bottom, left
        targetProps() {
            return this.el.getBoundingClientRect();
        },
        
        elProps() {
            return this.$el.getBoundingClientRect();
        },
        
        topExceeded() {
            return this.top < 0;
        },
        
        leftExceeded() {
            return this.left < 0;
        },
        
        bottomExceeded() {
            return (this.top + this.elProps.height + this.arrowSize) > window.innerHeight;
        },
        
        rightExceeded() {
            return (this.left + this.elProps.width) > window.innerWidth;
        }
    },
    
    mounted () {
        this.calcPosition();
    },
    
    methods: {
        calcPosition() {
            let { top, left } = this.getTopLeftValue();
            this.top = top;
            this.left = left;
            this.checkIfExceedsPosition();
        },
        
        /**
         * To check if the tooltip hides in the DOM
         */
        checkIfExceedsPosition() {
            switch(true) {
                case this.topExceeded : 
                    return this.reAdjust('bottom');
                case this.leftExceeded :
                    return this.reAdjust('right');
                case this.bottomExceeded : 
                    return this.reAdjust('top');
                case this.rightExceeded :
                    return this.reAdjust('left');
            }
        },
        
        reAdjust(direction) {
            this.tipDirection = direction;
            this.calcPosition();
        },
        
        getTopLeftValue() {
            let { top, left, width, height } = this.targetProps;
            let { width : elWidth, height : elHeight } = this.elProps;
            let arrowSize = this.arrowSize;
            let calculationMapping = {
                top : () => ({
                    top : top - elHeight - arrowSize,
                    left : left + width/2 - elWidth/2
                }),
                bottom : () => ({
                    top : top + height + arrowSize,
                    left : left + width/2 - elWidth/2
                }),
                left : () => ({
                    top : (top + height/2) - elHeight/2,
                    left : left - arrowSize - elWidth
                }),
                right : () => ({
                    top : (top + height/2) - (elHeight/2),
                    left : left + width + arrowSize
                })
            }
            return calculationMapping[this.tipDirection]();
        }
    },    
}
</script>

<style lang="less" scoped>
@import (reference) "../../styles/common.less";
.tip {
    .font20;
    .clrW;
    .posfix;
    word-break: break-word;
    .taC;
    border-radius: 8px;
    min-width: 120px;
    letter-spacing: .3px;
    background-color: #2c2c2c;
    max-width: 350px;
    padding: 10px;
    /* box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08); */
    z-index: 1000;
}

[class*="t-"]::before {
    content: "";
    width: 10px;
    height: 10px;
    .posabs;
    background-color: #2c2c2c;
    /* box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.08); */
    z-index: -1;
}

[class*="t-top"]::before {
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
}

.t-topL::before {
    left: 10%;
}

.t-topE::before {
    left: 80%;
}

[class*="t-left"]::before {
    left: -5px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
}

.t-leftT::before {
    top: 10px;
}

.t-leftE::before {
    bottom: 20px;
}

[class*="t-bottom"]::before {
    left : 50%;
    bottom: -5px;
    transform: translateX(-50%) rotate(45deg);
}

.t-bottomL::before {
    left: 10%;
}

.t-bottomE::before {
    left: 80%;
}

[class*="t-right"]::before {
    right: -5px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
}

</style>