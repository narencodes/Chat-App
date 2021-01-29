<template>
    <div class="image-wrapper">
        <div v-if="isLoading" class="h100 image-loader">
            <em class="fa fa-file-image center font30 clrGray"></em>
        </div>
        <img
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
export default {
    name : 'ImgFile',
    
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
            isLoading: !this.file.buffer
        }
    },
}
</script>

<style lang="less" scoped>
.image-wrapper {
    width: 350px;
    height : 200px;
    border-radius: .7em;
    overflow: hidden;
}
img {
    object-fit: cover;
}
.image-loader {
    background-color: inherit;
}
</style>