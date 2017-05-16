<template>
    <div>
        <lazy-render :time="300">
            <form class="search_form">
                <button type="submit" class="custom-search-button"></button>
                <router-link :to='{path: "/productSearch",query:{shopid:shopid}}' style="width:100%;">
                    <input type="search" name="search" placeholder="请输入商品关键字" class="search_input" readonly="true" style="width:100%;">
                </router-link>
                <!--<input type="submit" name="submit" class="search_submit" @click.prevent="searchTarget('')" value="搜索">-->
            </form>
            <section>
                <div class="cho_list">
                    <ul>
                        <li v-for="(item,index) in channelList" :key="index" @click="changeTab(index,item.categoryId)">
                            <span class="" :class="{cho_list_span: item.categoryId == classIndex}">{{item.name}}</span>
                        </li>
                    </ul>
                </div>
            </section>
            <section v-load-more="loaderMore" v-if="productListArr.length!=0">
    
                <div class="double">
                    <div class="items" v-for="item in productListArr" :key="item.productId">
                        <router-link :to="{path: '/productDetail/'+shopid+'/'+item.productId}">
                            <div class="placeholder">
                                <img v-lazy="getImgPath(item.imageUrl)">
                                <p class="mc">{{item.productName}}</p>
                                <p class="price">￥{{item.price}}</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </section>
            <p v-show='nomore' class="empty_data">没有更多了</p>
            <aside class="return_top" @click="backTop" v-if="showBackStatus">
                <svg class="back_top_svg">
        				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
        			</svg>
            </aside>
            <footer class="loader_more" v-show="preventRepeatReuqest">正在加载更多商品...</footer>
            <div ref="abc" style="background-color: red;"></div>
            <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
        </lazy-render>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <foot-guide :storeId="shopid"></foot-guide>
    </div>
</template>

<script>
    import {mapState } from 'vuex'
    import {loadMore,getImgPath } from 'src/components/common/mixin'
    import { showBack, animate } from 'src/config/mUtils'
    import loading from 'src/components/common/loading'
    import footGuide from '../../components/footer/footGuide'
    import {getCategoryList,goodsLists} from 'src/service/getData'
    import {imgBaseUrl} from '../../config/env'
    import {wxShowOptionMenu } from 'src/config/mUtils'
    
    export default {
        data() {
            return {
                shopid: '',
                searchValue: '', // 搜索内容
                channelList: [], //频道列表
                classIndex: 0,
                imgBaseUrl, // 图片域名地址
                emptyResult: false, // 搜索结果为空时显示
                pageMax: 0, //总页数
                productListArr: [], // 商品列表数据
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                showBackStatus: false, //显示返回顶部按钮
                showLoading: true, //显示加载动画
                nomore: false, //没有更多啦
                pram: {
                    storeId: '',
                    categId: '',
                    pagesize: 20,
                    pageidx: 1,
                    keyword: '',
                    status: ''
                } //数据请求参数
            }
        },
        created() {

            //this.showLoading = true;
            this.shopid = this.$route.query.shopid;
            if(this.$route.query.channelId){
                this.classIndex=this.$route.query.channelId;
                this.pram.categId=this.$route.query.channelId;
            }
           wxShowOptionMenu();
        },
        mixins: [loadMore, getImgPath],
        mounted() {
            let me = this;
            getCategoryList().then(res => {
                this.channelList = res.categoryList;
                if (res.categoryList) {
                    me.pram.storeId = me.shopid;
                    if(!this.$route.query.channelId){
                        me.classIndex= res.categoryList[0].categoryId;
                        me.pram.categId = res.categoryList[0].categoryId;
                    }
                    me.initData();
                    me.showLoading = false;
                }
    
            }).catch(function(err) {
                me.showLoading = false;
            });
        },
        components: {
            footGuide,
            loading
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
                    me.pram.pageidx += 1;
                    goodsLists(me.pram).then(res => {
                        me.showLoading = false;
                        me.productListArr = [...this.productListArr, ...res.goods];;
                        me.preventRepeatReuqest = false;
                        if (res.goods.length < 20) {
                            return
                        }
                    }).catch(function(err) {
                        me.showLoading = false;
                        me.preventRepeatReuqest = false;
                    });
                } else {
                    this.nomore = true;
                }
            },
            //返回顶部
            backTop() {
                animate(document.body, {
                    scrollTop: '0'
                }, 400, 'ease-out');
            },
    
            changeTab(index, channelId) {
                this.classIndex = channelId;
                this.channelId = channelId;
                this.pram.categId = channelId;
                this.nomore = false;
                this.getData();
            },
            getData() {
                let me = this;
                me.productListArr = [];
                me.showLoading = true;
                //获取数据
                goodsLists(me.pram).then(res => {
                    me.showLoading = false;
                    me.pageMax = res.goods.pageMax;
                    if (res.goods.length == 0) {
                        me.emptyResult = true;
                    } else {
                        me.emptyResult = false;
                        me.productListArr = res.goods;
                    }
    
                }).catch(function(err) {
                    me.showLoading = false;
                });
            },
            searchTarget() {
                if (this.searchValue != "") {
                    this.pram.keyword = this.searchValue;
                    this.getData();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'type';
</style>
