<template>
    <div>
        <header class='head_top'>
            <p style="line-height: 2.133rem;font-size: 0.68rem;  color: #333; text-align: center;">{{groupName}}</p>
        </header>
        <section v-load-more="loaderMore" style="margin-top: 0.3rem">
            <li class="goods-card goods-list small-pic card" v-for="item in restaurantList">
                 <router-link :to="{path:  routerPath+'/productDetail',query:{shopid:shopid,productid:item.productId}}" class="js-goods link clearfix">
                    <span class="photo-block">
                        <img class="goods-photo js-goods-lazy"  v-lazy="getImgPath(item.imageUrl)" style="display: inline;">
                    </span>
                    <span class="info clearfix info-title"> 
                       <span class="goods-title"  v-if="showProductName=='1'">{{item.productName}}</span>
                        <span  class="goods-price display-block min-height-price">
                            <span  v-if="showPrice=='1'">￥{{item.price}}</span>
                        </span> 
                        <span class="goods-price-taobao hide"></span>
                    </span> 
                    <div >
                        <span v-if="showBuyBnt=='1'" class="goods-buy btn1 info-no-title"  @click.stop.prevent="addcart(item.productId)"></span>
                    </div>
                 </router-link>
            </li>
        </section>
        <aside class="return_top" @click="backTop" v-if="showBackStatus">
            <svg class="back_top_svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
            </svg>
        </aside>
        <footer class="loader_more" v-show="preventRepeatReuqest">正在加载更多商品...</footer>
        <div ref="abc" style="background-color: red;"></div>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <p v-show='emptyResult' class="empty_data">没有查询到相关数据</p>
        <!--<p v-show='nomore' class="empty_data">没有更多了</p>-->
    </div>
</template>

<script>
    import {productByGroupId,addNumCart} from 'src/service/getData'
    import {loadMore,getImgPath } from 'src/components/common/mixin'
    import {showBack,animate, trim } from 'src/config/mUtils'
    import {imgBaseUrl} from 'src/config/env'
    import loading from 'src/components/common/loading'
    import {getStore, setStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'
    import { rootPath } from 'src/config/env'
    export default {
        data() {
            return {
                 routerPath:'',
                shopid: '',
                showAlert: false, //弹出框
                alertText: '加入购物车成功！', //弹出框信息
                restaurantList: [], // 搜索返回的结果
                emptyResult: false, // 搜索结果为空时显示
                pageMax: 0, //总页数
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                showBackStatus: false, //显示返回顶部按钮
                showLoading: false, //显示加载动画
                nomore:false,
                groupName:'',//
                showProductName:'',
                showPrice:'',
                showBuyBnt:'',
                addcartpram: {
                    storeId: '',
                    productId: '',
                    num: 1,
                    isFromCartList: false,
                }, //购物车商品数量修改请求参数
                pram: {
                    storeId: '',
                    groupId: '',
                    pagesize: 20,
                    pageidx: 1,
                } //数据请求参数
            }
        },
        created() {
            this.shopid = this.$route.query.shopid;
            this.routerPath=rootPath;
        },
        mixins: [loadMore, getImgPath],
        mounted() {
            let me = this;
            me.pram.groupId =this.$route.query.id;
            me.addcartpram.storeId = me.shopid;
            me.pram.storeId = me.shopid;
            me.initData();
        },
        components: {
            loading,
            alertTip
        },
        methods: {
            async initData() {
                let me = this;
                me.getData();
                //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
                showBack(status => {
                    this.showBackStatus = status;
                });
            },
             getData() {
                let me = this;
                me.productListArr = [];
                me.showLoading = true;
                //获取数据
                productByGroupId(me.pram).then(res => {
                    me.showLoading = false;
                    me.pageMax = res.pageMax;
                    me.showProductName=res.data.show_title;
                    me.showPrice=res.data.price;
                    me.showBuyBnt=res.data.buy_btn;
                    me.groupName=res.data.groupName;
                    if (res.data.productList.length == 0) {
                        me.emptyResult = true;
                    } else {
                        me.emptyResult = false;
                        me.restaurantList = res.data.productList;
                    }
    
                }).catch(function(err) {
                    me.showLoading = false;
                });
            },
            //到达底部加载更多数据
            async loaderMore() {
                let me = this;
                //防止重复请求
                if (me.pram.pageidx < me.pageMax) {
                    if (me.preventRepeatReuqest) {
                        return
                    }
                    me.showLoading = true;
                    me.preventRepeatReuqest = true;
                    //数据的定位加20位
                    me.pram.pageidx = Number(me.pram.pageidx)+1;
                    productByGroupId(me.pram).then(res => {
                        me.showLoading = false;
                        me.restaurantList = [...this.restaurantList, ...res.data.productList];;
                        me.preventRepeatReuqest = false;
                        if (res.data.productList.lenght < 20) {
                            return
                        }
                    }).catch(function(err) {
                        me.showLoading = false;
                        me.preventRepeatReuqest = false;
                    });
                }else{
                    me.nomore=true;
                }
            },
            //返回顶部
            backTop() {
                animate(document.body, {
                    scrollTop: '0'
                }, 400, 'ease-out');
            },
            addcart(id) {
                this.addcartpram.productId = id;
                addNumCart(this.addcartpram).then(res => {
                    if (res.code == "1") { //成功
                        this.showAlert = true;
                    } else {
                        this.showAlert = true;
                        this.alertText = res.msg;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'productGroup';
</style>
