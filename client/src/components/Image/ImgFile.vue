<template>
    <div class="image-wrapper">
        <div v-if="isLoading" class="w100 h100 image-loader img-load">
            <IconComponent type="image" className="center font30 clrGray"></IconComponent>
        </div>
        <img
            v-show="!isLoading"
            class="w100 h100"
            :src="file.buffer || file.url" 
            :alt="file.name"
            @load="isLoading = false"
        />
        <div 
            v-if="uploadProgress && uploadProgress < 100"
            class="image-loader"
            :style="{ display : 'flex', transform : `translateX(${uploadProgress}%)` }"
        >
        </div>
    </div>
</template>

<script>
import IconComponent from '@/components/Icon/IconComponent';

export default {
    name : 'ImgFile',
    
    components: {
        IconComponent,
    },
    
    props : {
        uploadProgress : {
            type : Number,
            default : 0
        },
        file : {
            type : Object,
            required : true
        }
    },
    
    data() {
        return {
            isLoading: true
        }
    },
}
</script>

<style lang="less" scoped>
.image-wrapper {
    width: 100%;
    max-width: 350px;
    min-width : 250px;
    height : 200px;
    border-radius: .7em;
    overflow: hidden;
}
img {
    object-fit: cover;
}

/deep/ .img-load {
    transition: all;
    animation: drop-in infinite;
}
.image-loader {
    background-color: inherit;
}
</style>