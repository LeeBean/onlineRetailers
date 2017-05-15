<template>
    <div class="order_page">
        <lazy-render :time="300">
            <header class="head_top">
                <div class="tabber">
                    <span :class='{active: orderStatus =="0"}' @click="orderStatusChange(0)">全部</span>
                    <span :class='{active: orderStatus =="1"}' @click="orderStatusChange(1)">待付款</span>
                    <span :class='{active: orderStatus =="2"}' @click="orderStatusChange(2)">待发货</span>
                    <span :class='{active: orderStatus =="3"}' @click="orderStatusChange(3)">待收货</span>
                    <span :class='{active: orderStatus =="4"}' @click="orderStatusChange(4)">已完成</span>
                    <span :class='{active: orderStatus =="5"}' @click="orderStatusChange(5)">已取消</span>
                </div>
            </header>
    
            <div class="order_list_ul">
                <div v-if="emptyResult" class="empty-list list-finished" style="padding-top: 60px;">
                    <div>
                        <p class="noorder">居然还没有订单</p>
                        <p class="font-size-12">好东西，手慢无</p>
                    </div>
                    <div>
                        <router-link :to="{path: '/home/'+shopid}" class="tag tag-big tag-orange" style="padding:8px 30px;">去逛逛</router-link>
                    </div>
                </div>
                <ul v-load-more="loaderMore" v-if="!emptyResult">
                    <li class="block block-order animated" v-for="item in orderList" :key="item.orderId">
                        <div class="header"><i class="store_icon"></i>
                            <span style="margin:0 10px 0 0;color:#999;font-size: 12px;">{{item.storeName}}</span>
                            <span style="color:#666;font-size:12px;margin-left:-10px;">({{item.orderNo}})</span><span class="orange-color order_status">{{ item.status | orderStatusDesc }}</span></div>
                        <section class="order-content" style="display:block;" v-for="product in item.productList" @click="showDetail(item.orderId,item.storeId)">
                            <div class="block block-list block-border-top-none block-border-bottom-none">
                                <div class="block-item name-card name-card-3col clearfix">
                                    <div style="width:58px;float:left;"> <img v-lazy="getImgPath(product.imageUrl)" style="width: 2.9rem;height: 2.9rem;"> </div>
                                    <div class="detail">
                                        <p style="margin-bottom:6px;font-size: 14px;">{{product.productName}}</p>
                                    </div>
                                    <div class="right-col">
                                        <div class="price font_size_13" style="color: #545454">¥ <span>{{product.price}}</span></div>
                                        <div class="num font_size_12">×<span class="num-txt">{{product.productNumber}}</span></div>
                                        <div class=""> </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div class="bottom" style="width:100%;float:right;">
                            <div class="clearfix" style="float:right"><span class="font_size_11 font_color_black_3">共{{item.totalNumber}}件&nbsp;&nbsp;合计</span><span class="dark_gray font_size_13 font_color_black_2">￥{{item.totalPrice}}</span>&nbsp;&nbsp;&nbsp;<span class="font_size_11 font_color_black_2">(含快递￥{{item.postage}} 税费￥{{item.tax}})</span></div>
                        </div>
                        <div class="clearfix" style="width:100%;float:right;">
                            <p v-if="item.status==1" @click="docancelOrder(item)" class="orange-color js-delete-order font-size-12 btn-payment bordercolor2" style="float:right">取消</p>
                            <p v-if="item.status==1" @click="doPayOrder(item)" class="orange-color js-delete-order font-size-12 btn-payment bordercolor1" style="float:right">付款</p>
                            <p v-if="item.status==3" @click="doSureGet(item)" class="orange-color js-delete-order font-size-12 btn-payment bordercolor1" style="float:right">确认收货</p>
                            <p v-if="item.status==3" @click="goLogistics(item)" class="orange-color js-delete-order font-size-12 btn-payment bordercolor1" style="float:right">查看物流</p>
                            <p v-if="item.status==4|item.status==5" @click="doDelOrder(item)" class="orange-color js-delete-order font-size-12 btn-payment bordercolor2" style="float:right">删除</p>
                        </div>
                    </li>
                </ul>
            </div>
            <!--<div class="right-icon">
                <router-link :to='{path: "/cart",query:{shopid:this.shopid}}'>
                    <img src="../../images/shopping-cart.png">
                </router-link>
            </div>-->
            <p v-show='nomore' class="empty_data">没有更多了</p>
            <aside class="return_top" @click="backTop" v-if="showBackStatus">
                <svg class="back_top_svg">
        				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
        			</svg>
            </aside>
            <footer class="loader_more" v-show="preventRepeatReuqest">正在加载更多商品...</footer>
            <div ref="abc" style="background-color: red;"></div>
    
            <section class="coverpart" v-if="show">
                <section class="cover-background"></section>
                <section class="cover-content " :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
                    <h2>{{showTxt}}</h2>
                    <div class="sa-botton">
                        <button class="waiting" @click="cancelDel">取消</button>
                        <div style="display:inline-block;">
                            <button class="quitlogin" @click="confirmDel">{{showconfirmText}}</button>
                        </div>
                    </div>
                </section>
            </section>
    
            <transition name="fade">
                <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
            </transition>
            <transition name="slid_up">
                <div class="choose_type_Container" v-if="showPayWay">
                    <div class="choose_type_Container" v-if="showPayWay">
                        <div class="pay_msg1">
                            <span>请选择支付方式</span>
                            <img src="../../images/icon_guanbi@2x.png" @click="showPayWayFun">
                        </div>
                        <div class="pay_msg pay_msg2">
                            <span class="order_time_msg">请在72小时内完成支付</span>
                            <span class="order_money">¥{{oprOrder.totalPrice}}</span>
                        </div>
                        <div class="pay_msg pay_msg5" style="display:block;">
                            <img class="pay_icon" src="../../images/webcatpay.png">
                            <span class="pay_text">微信支付（推荐）</span>
                            <img class="pay_select_icon" v-if="payType==0" @click="surePayway(1)" src="../../images/icon_dagou@2x.png">
                            <img class="pay_select_icon" v-if="payType!=0" @click="surePayway(0)" src="../../images/icon_yuan@2x.png">
                        </div>
                        <div class="pay_msg pay_msg2" @click="showAlipay">
                            <span class="order_time_msg" style="color:#999">更多支付方式</span>
                            <span class="order_money" style="color:#999"> <img src="../../images/arrowdown.png" width="20"></span>
                        </div>
                        <div class="pay_msg pay_msg5" v-show="alipay" style="display:block;">
                            <img class="pay_icon" src="../../images/zhifubao.png">
                            <span class="pay_text">支付宝支付</span>
                            <img class="pay_select_icon" v-if="payType==1" @click="surePayway(0)" src="../../images/icon_dagou@2x.png">
                            <img class="pay_select_icon" v-if="payType!=1" @click="surePayway(1)" src="../../images/icon_yuan@2x.png">
                        </div>
                        <div class="pay_msg6">
                            <div class="pay_button" @click.stop="submitPay()">确认支付</div>
                        </div>
                    </div>
                </div>
            </transition>
            <loading-toast v-if="showLoadingToast" @closeTip="showLoadingToast = false" :loadingText="loadingText"></loading-toast>
        </lazy-render>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <!--<div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>-->
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <foot-guide :storeId="shopid"></foot-guide>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import headTop from 'src/components/header/head'
    import loading from 'src/components/common/loading'
    import footGuide from 'src/components/footer/footGuide'
    import alertTip from 'src/components/common/alertTip'
    import loadingToast from 'src/components/common/loadingToast'
    import {
        orderList,
        cancelOrder,
        queryTake,
        deleteOrder,
        orderPay
    } from 'src/service/getData'
    import {
        getImgPath,
        loadMore
    } from 'src/components/common/mixin'
    import {
        showBack,
        animate,
        isWeiXin
    } from 'src/config/mUtils'
    
    export default {
        data() {
            return {
                shopid: '',
                orderList: [], //订单列表
                showAlert: false, //弹出提示框
                show: false, //显示确认提示框
                showTxt: '', //确认框提示文字
                showLoadingToast:false,//显示loadingToast
                loadingText:'',//loadingTost 提示信息
                showconfirmText: '确定', //确认框确认按钮文
                porType: 1, //操作类型 1-取消订单 2-删除订单 3-确认收货
                oprOrderId: '', //需要操作的订单号
                oprOrderStoreId: '', //需要操作的订单号所属店铺ID
                oprOrder: {}, //需要操作的订单
                showPayWay: false, //显示付款方式
                payType: 0, //付款方式 0-微信 1-支付宝
                alipay: false, //现在支付宝支付
                offset: 0,
                preventRepeat: false, //防止重复获取
                showLoading: true, //显示加载动画
                orderStatus: 0,
                pageMax: 0, //总页数
                nomore: false, //没有更多啦
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                showBackStatus: false, //显示返回顶部按钮
                emptyResult: false, // 搜索结果为空时显示
                orderPram: {
                    storeId: '',
                    status: '0',
                    pageidx: '1',
                    pagesize: 20
                } //请求对象
            }
        },
        created() {
            this.shopid = this.$route.query.shopid;
            this.orderStatus = this.$route.query.tab;
            if (!this.orderStatus) {
                this.orderStatus = 0;
            }
            this.orderPram.storeId = this.shopid;
            this.orderPram.status = this.orderStatus;
        },
        mounted() {
            this.getOrderList();
        },
        mixins: [loadMore, getImgPath],
        components: {
            headTop,
            footGuide,
            loading,
            alertTip,
            loadingToast
        },
        computed: {
    
        },
        methods: {
            // ...mapMutations([
            //     'SAVE_ORDER'
            // ]),
            //显示详情页
            showDetail(id,storeId) {
                //this.SAVE_ORDER(item);
                this.preventRepeat = false;
                this.$router.push({
                    path: '/orderDetail',
                    query: {
                        shopid: storeId,
                        id: id
                    }
                });
            },
            //到达底部加载更多数据
            async loaderMore() {
                let me = this;
                //防止重复请求
                if (me.orderPram.pageidx < me.pageMax) {
                    if (me.preventRepeatReuqest) {
                        return
                    }
                    me.showLoading = true;
                    me.preventRepeatReuqest = true;
                    //数据的定位加20位
                    me.orderPram.pageidx += 1;
                    orderList(me.orderPram).then(res => {
                        me.showLoading = false;
                        me.orderList = [...this.orderList, ...res.orderList];;
                        me.preventRepeatReuqest = false;
                        if (res.orderList.length <= me.orderPram.pagesize) {
                            me.nomore = true;
                            return;
    
                        }
                    }).catch(function(err) {
                        me.showLoading = false;
                        me.preventRepeatReuqest = false;
                    });
                }
            },
            getOrderList() {
                let me = this;
                me.showLoading = true;
                orderList(me.orderPram).then(res => {
                    me.showLoading = false;
                    if (res.code == "1") {
                        me.pageMax = res.pageMax;
                        if (res.orderList.length == 0) {
                            me.emptyResult = true;
                        } else {
                            if (res.orderList.length <= me.orderPram.pagesize) {
                                me.nomore = true;
                            }
                            me.emptyResult = false;
                            me.orderList = res.orderList;
                        }
    
                    }
    
                }).catch(function(err) {
                    me.showLoading = false;
                });
                showBack(status => {
                    this.showBackStatus = status;
                });
            },
            //返回顶部
            backTop() {
                animate(document.body, {
                    scrollTop: '0'
                }, 400, 'ease-out');
            },
            //切换tab
            orderStatusChange(id) {
                this.nomore = false;
                this.emptyResult = false;
                this.orderList = [];
                this.orderStatus = id;
                this.orderPram.status = id;
                this.getOrderList();
            },
            doOprOrder() {
                this.show = true;
                this.isEnter = true;
                this.isLeave = false;
            },
            //取消
            cancelDel() {
                clearTimeout(this.timer)
                this.isEnter = false;
                this.isLeave = true;
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.show = false;
                }, 200)
            },
            //确定
            confirmDel() {
                let me = this;
                if (this.porType == 1) { //取消订单
                    cancelOrder({
                        orderId: this.oprOrderId,
                        storeId: this.oprOrderStoreId
                    }).then(res => {
                        if (res.code == "1") {
                            this.getOrderList();
                        } else {
                            me.showAlert = true;
                            me.alertText = res.msg;
                        }
                    });
                } else if (this.porType == 2) { //删除订单
                    deleteOrder({
                        orderId: this.oprOrderId,
                        storeId: this.oprOrderStoreId
                    }).then(res => {
                        if (res.code == "1") {
                            this.getOrderList();
                        } else {
                            me.showAlert = true;
                            me.alertText = res.msg;
                        }
                    });
                } else if (this.porType == 3) { //确认收货
                    queryTake({
                        orderId: this.oprOrderId,
                        storeId: this.oprOrderStoreId
                    }).then(res => {
                        if (res.code == "1") {
                            this.getOrderList();
                        } else {
                            me.showAlert = true;
                            me.alertText = res.msg;
                        }
                    });
                }
                clearTimeout(this.timer)
                this.isEnter = false;
                this.isLeave = true;
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.show = false;
                }, 200)
            },
    
            doPayOrder(order) { //去支付
                this.oprOrder = order;
                this.oprOrderId = order.orderId;
                this.oprOrderStoreId=order.storeId;
                this.showPayWayFun();
            },
            docancelOrder(order) { //取消订单
                this.porType = 1;
                this.oprOrderId = order.orderId;
                this.oprOrderStoreId=order.storeId;
                this.showTxt = "是否确认取消该订单？";
                this.showconfirmText = "确定";
                this.doOprOrder();
    
            },
            doSureGet(order) { //确认收货
                this.porType = 3;
                this.oprOrderId = order.orderId;
                this.oprOrderStoreId=order.storeId;
                this.showTxt = "是否确认该订单收货？";
                this.showconfirmText = "确定";
                this.doOprOrder();
    
            },
            doDelOrder(order) { //删除订单
                this.porType = 2;
                this.oprOrderId = order.orderId;
                this.oprOrderStoreId=order.storeId;
                this.showTxt = "是否确认删除该订单？";
                this.showconfirmText = "删除";
                this.doOprOrder();
            },
            goLogistics(order) { //查看物流
                this.$router.push({
                    path: '/logistics',
                    query: {
                        shopid: order.storeId,
                        orderId: order.orderId
                    }
                });
            },
    
            showPayWayFun() {
                this.showPayWay = !this.showPayWay;
            },
            //选择付款方式
            surePayway(type) {
                if (type == "1") {
                    this.alipay = true;
                }
                this.payType = type;
            },
            showAlipay() {
                this.alipay = !this.alipay;
            },
            submitPay() {
                let me = this;
                me.showLoadingToast=true;
                me.loadingText="订单正在提交....";
                let paybo = {
                    orderId: this.oprOrderId,
                    isWeb: true
                }
                if (this.payType == 0) {
                    paybo.payType = "weixin";
                }
                orderPay(paybo).then(res => {
                    me.showLoadingToast=false;
                    if (res.code == "1") {
                        if (isWeiXin() && this.payType == 0) {
                            function onBridgeReady() {
                                WeixinJSBridge.invoke(
                                    'getBrandWCPayRequest', {
                                        "appId": res.orderPayInfo.appId, //公众号名称，由商户传入     
                                        "timeStamp": res.orderPayInfo.timeStamp, //时间戳，自1970年以来的秒数     
                                        "nonceStr": res.orderPayInfo.nonceStr, //随机串     
                                        "package": res.orderPayInfo.package,
                                        "signType":res.orderPayInfo.signType, //微信签名方式：     
                                        "paySign": res.orderPayInfo.paySign //微信签名 
                                    },
                                    function(res2) {
                                        if (res2.err_msg == "get_brand_wcpay_request:ok") {
                                            me.showAlert = true;
                                            me.alertText = "订单支付成功！";
                                            me.getOrderList();
                                        } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                                    });
                            }
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        } else if (this.payType == 1) {
                            me.getOrderList();
                            window.location.href = res.orderPayInfo;
                        } else {
                            me.showAlert = true;
                            me.alertText = "请在微信浏览器中打开";
                        }
                    } else {
                        me.showAlert = true;
                        me.alertText = res.msg;
                    }
                });
            }
        },
        filters: {
            orderStatusDesc: function(value) {
                switch (value) {
                    case '1':
                        return value = '未支付';
                    case '2':
                        return value = '未发货';
                    case '3':
                        return value = '已发货';
                    case '4':
                        return value = '已完成';
                    case '5':
                        return value = '已取消';
                    case '6':
                        return value = '退款中';
                    case '7':
                        return value = '买家确认收货';
                }
            }
        },
        watch: {
            //切换tab
            // orderStatus:function(value){
    
            // }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'order';
</style>
