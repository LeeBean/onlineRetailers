<template>
    <div>
        <form class="search_form">
            <button type="submit" class="custom-search-button"></button>
            <input type="search" name="search" placeholder="商品搜索：请输入商品关键字" class="search_input" v-model="searchValue" @blur="checkInput">
        </form>
        <section v-load-more="loaderMore" v-if="restaurantList.length!=0">
            <ul class="js-goods-list sc-goods-list clearfix list size-3">
                <li class="goods-card goods-list big-pic card" v-for="item in restaurantList" :key="item.productId">
                    <router-link :to="{path: '/productDetail/'+shopid+'/'+item.productId}" class="js-goods link clearfix">
                        <div class="photo-block">
                            <img class="goods-photo js-goods-lazy" v-lazy="getImgPath(item.imageUrl)" style="display:block;">
                        </div>
                        <div class="info">
                            <p class="goods-title">{{item.productName}}</p>
                            <p class="goods-price">
                                <em>￥{{item.price}}</em>
                            </p>
                            <div class="goods-buy btn1"></div>
                            <!--<div class="js-goods-buy buy-response"></div>-->
                        </div>
                    </router-link>
                </li>
            </ul>
        </section>
        <aside class="return_top" @click="backTop" v-if="showBackStatus">
            <svg class="back_top_svg">
    				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
    			</svg>
        </aside>
        <section class="search_history" v-if="searchHistory.length&&showHistory">
            <h4 class="title_restaurant">搜索历史</h4>
            <ul>
                <li v-for="(item, index) in searchHistory" :key="index" class="history_list">
                    <span class="history_text ellipsis" @click="searchTarget(item)">{{item}}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete_icon" @click="deleteHistory(index)">
                            <line x1="8" y1="8" x2="18" y2="18" style="stroke:#999;stroke-width:3" />
                            <line x1="18" y1="8" x2="8" y2="18" style="stroke:#999;stroke-width:3" />
                        </svg>
                </li>
            </ul>
            <footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>
        </section>
        <footer class="loader_more" v-show="preventRepeatReuqest">正在加载更多商品...</footer>
        <div ref="abc" style="background-color: red;"></div>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
    </div>
</template>

<script>
    import {
        goodsLists
    } from '../../service/getData'
    import {
        loadMore,
        getImgPath
    } from 'src/components/common/mixin'
    import {
        showBack,
        animate,
        trim
    } from 'src/config/mUtils'
    import {
        imgBaseUrl
    } from '../../config/env'
    import loading from 'src/components/common/loading'
    import {
        getStore,
        setStore
    } from '../../config/mUtils'
    export default {
        data() {
            return {
                restaurantList: [], // 搜索返回的结果
                searchHistory: [], // 搜索历史记录
                showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
                shopid: '',
                searchValue: '', // 搜索内容
                imgBaseUrl, // 图片域名地址
                emptyResult: false, // 搜索结果为空时显示
                pageMax: 0, //总页数
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                showBackStatus: false, //显示返回顶部按钮
                showLoading: false, //显示加载动画
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
            this.shopid = this.$route.query.shopid;
        },
        mixins: [loadMore, getImgPath],
        mounted() {
            let me = this;
            me.pram.storeId = me.shopid;
            //获取搜索历史记录
            if (getStore('searchHistory')) {
                this.searchHistory = JSON.parse(getStore('searchHistory'));
            }
            //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
            showBack(status => {
                this.showBackStatus = status;
            });
        },
        components: {
            loading
        },
        methods: {
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
                        me.restaurantList = [...this.restaurantList, ...res.goods];;
                        me.preventRepeatReuqest = false;
                        if (res.goods.lenght < 20) {
                            return
                        }
                    }).catch(function(err) {
                        me.showLoading = false;
                        me.preventRepeatReuqest = false;
                    });
                }
            },
            //点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
            async searchTarget(historyValue) {
                if (historyValue) {
                    this.searchValue = historyValue;
                    this.pram.keyword = this.searchValue;
                } else if (!this.searchValue) {
                    return
                }
                //隐藏历史记录
                this.showHistory = false;
                //获取搜索结果
                this.getData();
                /**
                 * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
                 * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
                 */
                let history = getStore('searchHistory');
                if (history) {
                    let checkrepeat = false;
                    this.searchHistory = JSON.parse(history);
                    this.searchHistory.forEach(item => {
                        if (item == this.searchValue) {
                            checkrepeat = true;
                        }
                    })
                    if (!checkrepeat) {
                        if (this.searchValue != "" && trim(this.searchValue) != "") {
                            this.searchHistory.push(this.searchValue)
                        }
                    }
                } else {
                    if (this.searchValue != "" && trim(this.searchValue) != "") {
                        this.searchHistory.push(this.searchValue)
                    }
                }
                setStore('searchHistory', this.searchHistory)
            },
            //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
            checkInput() {
                if (this.searchValue === '') {
                    this.showHistory = true; //显示历史记录
                    this.restaurantList = []; //清空搜索结果
                    this.emptyResult = false; //隐藏搜索为空提示
                } else {
                    this.pram.keyword = this.searchValue;
                    this.searchTarget();
                }
            },
            //点击删除按钮，删除当前历史记录
            deleteHistory(index) {
                this.searchHistory.splice(index, 1);
                setStore('searchHistory', this.searchHistory);
            },
            //清除所有历史记录
            clearAllHistory() {
                this.searchHistory = [];
                setStore('searchHistory', this.searchHistory);
            },
            //返回顶部
            backTop() {
                animate(document.body, {
                    scrollTop: '0'
                }, 400, 'ease-out');
            },
            getData() {
                let me = this;
                me.restaurantList = [];
                me.showLoading = true;
                //获取数据
                goodsLists(me.pram).then(res => {
                    me.showLoading = false;
                    me.pageMax = res.pageMax;
                    if (res.goods == "") {
                        me.emptyResult = true;
                    } else {
                        me.emptyResult = false;
                        me.restaurantList = res.goods;
                    }
    
                }).catch(function(err) {
                    me.showLoading = false;
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    @import 'search';
</style>
