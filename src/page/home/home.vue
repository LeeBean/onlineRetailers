<template>
    <div style="padding-bottom: 80px;">
        <lazy-render :time="300">
            <div v-for="item in storeCustomFieldList">
                <shop v-if="item.fieldType=='tpl_shop'" :content="item.content" :storeId="shopid" :productNumber="productNumber" :storeName="pStoreName" :storeImage="pImage"></shop>
                <serach-form v-if="item.fieldType=='search'" :storeId="shopid"></serach-form>
                <image-ad v-if="item.fieldType=='image_ad'" :content="item.content" :storeId="shopid"></image-ad>
                <image-nav v-if="item.fieldType=='image_nav'" :content="item.content"></image-nav>
                <nocite v-if="item.fieldType=='notice'" :content="item.content"></nocite>
                <rich-text v-if="item.fieldType=='rich_text'" :content="item.content"></rich-text>
                <text-nav v-if="item.fieldType=='text_nav'" :content="item.content"></text-nav>
                <product v-if="item.fieldType=='goods'" :content="item.content" :storeId="shopid"></product>
                <hr v-if="item.fieldType=='line'" style="height:1px;border:none;border-top:1px dashed #999;" />
                <div v-if="item.fieldType=='white'" :style="{height:item.content.height+'px'}" class="white"></div>
            </div>
            <aside class="return_top" @click="backTop" v-if="showBackStatus">
                <svg class="back_top_svg">
        				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
        			</svg>
            </aside>
        </lazy-render>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <foot-guide :storeId="shopid"></foot-guide>
    </div>
</template>
<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import {
        imgBaseUrl
    } from 'src/config/env'
    import {
        loadMore
    } from 'src/components/common/mixin'
    import loading from 'src/components/common/loading'
    import footGuide from 'src/components/footer/footGuide'
    import imageAd from 'src/components/home/imageAd'
    import imageNav from 'src/components/home/imageNav'
    import textNav from 'src/components/home/textNav'
    import nocite from 'src/components/home/nocite'
    import product from 'src/components/home/product'
    import richText from 'src/components/home/richText'
    import serachForm from 'src/components/home/searchForm'
    import shop from 'src/components/home/shop'
    
    import {
        homeDatas
    } from 'src/service/getData'
    import {
        showBack,
        animate
    } from 'src/config/mUtils'
    import 'src/plugins/swiper.min.js'
    import 'src/style/swiper.min.css'
    
    export default {
        data() {
            return {
                shopid: '',
                productNumber: 0, //店铺商品数量
                pStoreName:'',//商品名称
                pImage:'',//店铺LOGO
                storeCustomFieldList: [], //首页数据
                showLoading: true, //显示加载动画
                showBackStatus: false, //显示返回顶部按钮
            }
        },
        mixins: [loadMore],
        mounted() {
            let me = this;
            me.shopid = me.$route.params.shopid;
            me.SAVE_SHOPID(me.shopid);
            me.showLoading = true;
            //获取首页数据
            homeDatas(me.shopid).then(res => {
                me.productNumber = res.productNumber;
                me.pStoreName=res.storeName;
                me.pImage=res.image;
                me.storeCustomFieldList = res.storeCustomFieldList;
                me.showLoading = false;
            }).catch(function(err) {
                me.showLoading = false;
            })
            //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
            showBack(status => {
                this.showBackStatus = status;
            });
        },
        components: {
            footGuide,
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
        methods: {
            ...mapMutations([
                'SAVE_SHOPID'
            ]),
            //返回顶部
            backTop() {
                animate(document.body, {
                    scrollTop: '0'
                }, 400, 'ease-out');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'home';
</style>
