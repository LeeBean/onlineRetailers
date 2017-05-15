<template>
<lazy-render  :time="300">
    <div style="padding-bottom: 80px;">
        <div v-for="item in storeCustomFieldList">
            <shop v-if="item.fieldType=='tpl_shop'" :content="item.content" :storeId="id" :productNumber="productNumber" :storeName="pStoreName" :storeImage="pImage"></shop>
            <serach-form v-if="item.fieldType=='search'"></serach-form>
            <image-ad v-if="item.fieldType=='image_ad'" :content="item.content"></image-ad>
            <image-nav v-if="item.fieldType=='image_nav'" :content="item.content"></image-nav>
            <nocite v-if="item.fieldType=='notice'" :content="item.content"></nocite>
            <rich-text v-if="item.fieldType=='rich_text'" :content="item.content"></rich-text>
            <text-nav v-if="item.fieldType=='text_nav'" :content="item.content"></text-nav>
            <product v-if="item.fieldType=='goods'" :content="item.content"></product>
            <hr v-if="item.fieldType=='line'" style="height:1px;border:none;border-top:1px dashed #999;" />
            <div v-if="item.fieldType=='white'" :style="{height:item.content.height+'px'}" class="white"></div>
        </div>
        <!--<foot-guide></foot-guide>-->
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
    </div>
</lazy-render>
</template>

<script>
    import {mapMutations} from 'vuex'
    import {
        imgBaseUrl
    } from 'src/config/env'
    
    import {
        loadMore
    } from 'src/components/common/mixin'
    import loading from 'src/components/common/loading'
    import imageAd from 'src/components/home/imageAd'
    import imageNav from 'src/components/home/imageNav'
    import textNav from 'src/components/home/textNav'
    import nocite from 'src/components/home/nocite'
    import product from 'src/components/home/product'
    import richText from 'src/components/home/richText'
    import serachForm from 'src/components/home/searchForm'
    import shop from 'src/components/home/shop'
    import {homeDatas} from 'src/service/getData'
    import 'src/plugins/swiper.min.js'
    import 'src/style/swiper.min.css'
    
    export default {
        data() {
            return {
                id:'',
                productNumber: 0, //店铺商品数量
                storeCustomFieldList: [], //首页数据
                showLoading: true //显示加载动画
            }
        },
        async beforeMount() {
    
        },
        mixins: [loadMore],
        mounted() {
            let me=this;
            //me.id= this.$route.params.id;
            me.id= 1;
            me.SAVE_SHOPID( me.id);
            me.showLoading = true;
            //获取首页数据
            homeDatas( me.id).then(res => {
                me.productNumber = res.productNumber;
                me.storeCustomFieldList = res.storeCustomFieldList;
                me.showLoading = false;
            }).catch(function(err) {
                me.showLoading = false;
            })
           
        },
        components: {
            imageAd,
            imageNav,
            textNav,
            nocite,
            product,
            richText,
            serachForm,
            shop,
            loading
        },
        computed: {
            // ...mapState(['shopid']),
        },
        methods: {
             ...mapMutations([
                'SAVE_SHOPID'
            ]),
        },
    
        watch: {
    
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'innerPage';
</style>
