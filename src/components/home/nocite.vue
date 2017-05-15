<template>
    <div class="custom-notice">
        <div class="custom-notice-inner">
            <div class="custom-notice-scroll"><span class="js-scroll-notice">{{content.content}}</span></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
    
            }
        },
        props: ['content']
    }
</script>

<style lang="scss" scoped>
    .custom-notice {
        padding: 0 10px;
        height: 37px;
        line-height: 37px;
        color: #f90;
        background: #ffc;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        word-break: break-all;
        font-size: 12px;
    } 
    .custom-notice-inner {
        overflow: hidden;
    }
    .custom-notice-scroll {
        width: 20000px;
    }
</style>
