<template>
<lazy-render  :time="300">
    <div style="padding-bottom: 80px;">
        <div v-for="item in storeCustomFieldList">
            <shop v-if="item.fieldType=='tpl_shop'" :content="item.content" :storeId="id" :productNumber="productNumber" :storeName="pStoreName" :storeImage="pImage"></shop>
            <serach-form v-if="item.fieldType=='search'"></serach-form>
            <image-ad v-if="item.fieldType=='image_ad'" :content="item.content" :storeId="shopid"></image-ad>
            <image-nav v-if="item.fieldType=='image_nav'" :content="item.content" :storeId="shopid"></image-nav>
            <nocite v-if="item.fieldType=='notice'" :content="item.content" :storeId="shopid"></nocite>
            <rich-text v-if="item.fieldType=='rich_text'" :content="item.content" :storeId="shopid"></rich-text>
            <text-nav v-if="item.fieldType=='text_nav'" :content="item.content" :storeId="shopid"></text-nav>
            <product v-if="item.fieldType=='goods'" :content="item.content" :storeId="shopid" @openTip="showAlert=true" @errorTip="showErrorAlert" ></product>
            <hr v-if="item.fieldType=='line'" style="height:1px;border:none;border-top:1px dashed #999;" />
            <div v-if="item.fieldType=='white'" :style="{height:item.content.height+'px'}" class="white"></div>
        </div>
         <aside class="return_top" @click="backTop" v-if="showBackStatus">
            <svg class="back_top_svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
            </svg>
        </aside>
        <!--<foot-guide></foot-guide>-->
    </div>
    <transition name="loading">
        <loading v-show="showLoading"></loading>
    </transition>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
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
    import {pageView,groupView} from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import {showBack, animate } from 'src/config/mUtils'
    import 'src/plugins/swiper.min.js'
    import 'src/style/swiper.min.css'
    
    export default {
        data() {
            return {
                id:'',
                showAlert: false, //弹出框
                alertText: '加入购物车成功！', //弹出框信息
                shopid: '',
                productNumber: 0, //店铺商品数量
                pStoreName:'',//店铺名称
                pImage:'',//店铺LOGO
                storeCustomFieldList: [], //首页数据
                showLoading: true, //显示加载动画
                showBackStatus: false, //显示返回顶部按钮
            }
        },
        mixins: [loadMore],
        mounted() {
            let me=this;
            me.id=  me.$route.query.id;
            me.showLoading = true;
            if(me.$route.query.type=='wym'){//微页面
                //获取数据
                pageView( me.id).then(res => {
                    me.productNumber = res.productNumber;
                    me.pStoreName=res.storeName;
                    me.pImage=res.image;
                    me.storeCustomFieldList = res.storeCustomFieldList;
                    me.showLoading = false;
                }).catch(function(err) {
                    me.showLoading = false;
                })
            }else if(me.$route.query.type=='fz'){//商品分类
                //获取数据
                groupView(me.id).then(res => {
                    me.productNumber = res.productNumber;
                    me.storeCustomFieldList = res.storeCustomFieldList;
                    me.showLoading = false;
                }).catch(function(err) {
                    me.showLoading = false;
                })
            }
            //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
            showBack(status => {
                this.showBackStatus = status;
            });
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
            loading,
            alertTip
        },
        computed: {
            // ...mapState(['shopid']),
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
        },
    
        watch: {
    
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'innerPage';
</style>
