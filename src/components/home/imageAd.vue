<template>
    <nav class="msite_nav">
        <div  v-if="content.image_type=='0'" >
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in content.nav_list">
                        <a v-if="item.prefix=='外链'" :href="item.name"><img :src="getImgPath(item.image)" style="width: 100%;"></a>
                        <router-link v-if="item.prefix=='微页面'" :to="{path: '/innerPage',query:{shopid:storeId,id:item.url,type:'wym'}}">
                             <img :src="getImgPath(item.image)" style="width: 100%;">
                        </router-link>
                        <router-link v-if="item.prefix=='商品分组'" :to="{path: '/innerPage',query:{shopid:storeId,id:item.url,type:'fz'}}">
                             <img :src="getImgPath(item.image)" style="width: 100%;">
                        </router-link>
                        <router-link v-if="item.prefix=='商品'" :to="{path: '/productDetail/'+storeId+'/'+item.url}">
                             <img :src="getImgPath(item.image)" style="width: 100%;">
                        </router-link>
                        <router-link v-if="item.prefix=='微页面分类'" :to="{path: '/type',query:{shopid:storeId,channelId:item.url}}">
                             <img :src="getImgPath(item.image)" style="width: 100%;">
                        </router-link>
                    </div>
                </div>
        
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <div v-else>
             <div class="swiper-slide" v-for="item in content.nav_list">
                <a :href="item.url">
                    <img :src="getImgPath(item.image)" style="width: 100%;">
                </a>
            </div>
        </div>
    </nav>
</template>

<script>
    import {getImgPath} from '../common/mixin'
    export default {
        data() {
            return {
            }
        },
        mounted() {
            if(this.content.image_type=="0"){
                new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    loop: true,
                    autoplay: 3000 //可选选项，自动滑动
                });
            } 
        },
        props: ['content','storeId'],
        mixins: [getImgPath]
    }
</script>

<style lang="scss" scoped>
   
 
</style>
