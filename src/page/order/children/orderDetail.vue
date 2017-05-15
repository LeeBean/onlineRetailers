<template>
    <div class="order_detail_page">
        <lazy-render :time="300">
            <div class="white_color">
                <div class="order_ad">
                    <span class="location_icon">&nbsp;</span>
                </div>
                <div>
                    <div style="padding:5px 0;padding-bottom: 10px;">
                        <p class="order_sh d">
                            <span>{{orderData.buyWayType=="0"?"收货人":"提货人"}}</span>
                            <span style="margin-left:20px;">{{orderData.name}}</span>
                            <span style="margin-left:70px;">{{orderData.mobile}}</span>
                        </p>
                        <p class="order_ad d">
                            <span>{{orderData.buyWayType=="0"?"收货地址":"提货地址"}}: </span>
                            <span>{{orderData.address}}</span>
                        </p>
                        <p v-if="orderData.buyWayType==1" class="order_ad d" style="margin-top:5px;margin-left: 40px;">
                            <span style="color:#fb5000;">请截图已保存到店时凭单号到店提货</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="order_info white_color">
                <div class="order_info_top">
                    <span class="store_icon"></span>
                    <p class="order_info_aptxt">{{orderData.storeName}}</p>
                    <label>{{orderData.status|orderStatusDesc}}</label>
                </div>
                <ul class="order_info_one">
                    <li v-for="product in productList">
                        <div class="order_info_one_div">
                            <router-link :to="{path: '/productDetail/'+shopid+'/'+product.productId}" class="thumb" style="color:#333;">
                                <img v-lazy="getImgPath(product.imageUrl)">
                            </router-link>
                            <div>
                                <p class="order_info_one_txt">
                                    <router-link :to="{path: '/productDetail/'+shopid+'/'+product.productId}">
                                        <span class="order_product_name">{{product.productName}}</span>
                                    </router-link>
                                </p>
                            </div>
                            <div class="l_indent_content_shop_right">
                                <p class="l_indent_content_shop_num">¥{{product.price}}</p>
                                <p class="l_indent_content_shop_sl">x{{product.productNumber}}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul class="order_info_two white_color">
                    <li>
                        <div class="l_indent_content_shop_yf">
                            <p class="l_yf_p">运费</p>
                            <p class="l_yf_num">¥ {{orderData.postage}}</p>
                        </div>
                    </li>
                    <li>
                        <div class="l_indent_content_shop_yf">
                            <p class="l_yf_p">进口税</p>
                            <p class="l_yf_num">¥ {{orderData.tax}}</p>
                        </div>
                    </li>
                    <li>
                        <div class="l_indent_content_shop_yf">
                            <p class="l_yf_p_d">实际付款(含运费)</p>
                            <p class="l_yf_num_d">¥ {{orderData.actualAmount}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="order_info_bot white_color">
                <p class="l_indent_content_shop_bh one">订单编号:<span>{{orderData.orderNo}}</span></p>
                <p class="l_indent_content_shop_bh two">创建时间: <span>{{orderData.createTime}}</span></p>
                <p v-if="orderData.payTime" class="l_indent_content_shop_bh two">付款时间: <span>{{orderData.payTime}}</span></p>
                <p v-if="orderData.refundTime" class="l_indent_content_shop_bh two">退款时间: <span>{{orderData.refundTime}}</span></p>
                <p v-if="orderData.cancelTime" class="l_indent_content_shop_bh two">取消时间: <span>{{orderData.cancelTime}}</span></p>
                <p v-if="orderData.sendTime" class="l_indent_content_shop_bh two">发货时间: <span>{{orderData.sendTime}}</span></p>
                <p v-if="orderData.deliveryTime" class="l_indent_content_shop_bh two">确认收货时间: <span>{{orderData.deliveryTime}}</span></p>
                <p v-if="orderData.complateTime" class="l_indent_content_shop_bh two">成交时间: <span>{{orderData.complateTime}}</span></p>
            </div>
            <div v-if="orderData.status!=2" class="order-detail-footer white_color">
                <p v-if="orderData.status==1" @click="ggcancelOrder2(orderData)" class="btn-payment bordercolor2 order-detail-bth-style">取消</p>
                <p v-if="orderData.status==1" @click="ggPayOrder2(orderData)" class="btn-payment  bordercolor1 order-detail-bth-style">付款</p>
                <p v-if="orderData.status==3" @click="ggSureGet2(orderData)" class="btn-payment bordercolor1 order-detail-bth-style">确认收货</p>
                <p v-if="orderData.status==3" @click="ggLogistics2(orderData)" class="btn-payment bordercolor1 order-detail-bth-style">查看物流</p>
                <p v-if="orderData.status==4|orderData.status==5" @click="ggDelOrder2(orderData)" class="btn-payment bordercolor2 order-detail-bth-style">删除</p>
            </div>
            <section class="coverpart" v-if="show">
                <section class="cover-background"></section>
                <section class="cover-content " :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
                    <h2>{{showTxt}}</h2>
                    <div class="sa-botton">
                        <button class="waiting" @click="ggcancelDel2">取消</button>
                        <div style="display:inline-block;">
                            <button class="quitlogin" @click="ggconfirmDel2">{{showconfirmText}}</button>
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
                            <img src="../../../images/icon_guanbi@2x.png" @click="showPayWayFun">
                        </div>
                        <div class="pay_msg pay_msg2">
                            <span class="order_time_msg">请在72小时内完成支付</span>
                            <span class="order_money">¥{{orderData.actualAmount}}</span>
                        </div>
                        <div class="pay_msg pay_msg5" style="display:block;">
                            <img class="pay_icon" src="../../../images/webcatpay.png">
                            <span class="pay_text">微信支付（推荐）</span>
                            <img class="pay_select_icon" v-if="payType==0" @click="surePayway(1)" src="../../../images/icon_dagou@2x.png">
                            <img class="pay_select_icon" v-if="payType!=0" @click="surePayway(0)" src="../../../images/icon_yuan@2x.png">
                        </div>
                        <div class="pay_msg pay_msg2" @click="showAlipay">
                            <span class="order_time_msg" style="color:#999">更多支付方式</span>
                            <span class="order_money" style="color:#999"> <img src="../../../images/arrowdown.png" width="20"></span>
                        </div>
                        <div class="pay_msg pay_msg5" v-show="alipay" style="display:block;">
                            <img class="pay_icon" src="../../../images/zhifubao.png">
                            <span class="pay_text">支付宝支付</span>
                            <img class="pay_select_icon" v-if="payType==1" @click="surePayway(0)" src="../../../images/icon_dagou@2x.png">
                            <img class="pay_select_icon" v-if="payType!=1" @click="surePayway(1)" src="../../../images/icon_yuan@2x.png">
                        </div>
                        <div class="pay_msg6">
                            <div class="pay_button" @click.stop="submitPay2()">确认支付</div>
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
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import {
        getImgPath
    } from 'src/components/common/mixin'
    import {
        orderDetail,
        cancelOrder,
        queryTake,
        deleteOrder,
        orderPay
    } from 'src/service/getData'
    import loading from 'src/components/common/loading'
    import alertTip from 'src/components/common/alertTip'
    import loadingToast from 'src/components/common/loadingToast'
    import {
        isWeiXin
    } from 'src/config/mUtils'
    
    export default {
    
        data() {
            return {
                shopid: '',
                showAlert: false, //弹出提示框
                show: false, //显示确认提示框
                showTxt: '', //确认框提示文字
                showconfirmText: '确定', //确认框确认按钮文
                showLoadingToast:false,//显示loadingToast
                loadingText:'',//loadingTost 提示信息
                porType: 1, //操作类型 1-取消订单 2-删除订单 3-确认收货
                payType: 0, //付款方式 0-微信 1-支付宝
                alipay: false, //现在支付宝支付
                oprOrderId: '', //需要操作的订单号
                showLoading: true, //显示加载动画
                showPayWay: false, //显示付款方式
                orderData: {},
                productList: [],
                pram: {
                    orderId: '',
                    storeId: ''
                }
            }
        },
        created() {
            this.shopid = this.$route.query.shopid;
            this.pram.storeId = this.shopid;
            this.pram.orderId = this.$route.query.id;
            this.oprOrderId = this.$route.query.id;
        },
        mounted() {
            this.initData();
        },
        mixins: [getImgPath],
        components: {
            loading,
            alertTip,
            loadingToast
        },
        computed: {
            ...mapState([
                'orderDetail', 'userInfo'
            ]),
        },
        methods: {
            async initData() {
                let me = this;
                orderDetail(me.pram).then(res => {
                     me.showLoading = false;
                    if (res.code == "1") {
                        me.orderData = res.data;
                        me.productList = res.dataList;
                    }
                });
            },
            oprOrder2() {
                this.show = true;
                this.isEnter = true;
                this.isLeave = false;
            },
            //取消
            ggcancelDel2() {
                clearTimeout(this.timer)
                this.isEnter = false;
                this.isLeave = true;
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.show = false;
                }, 200)
            },
            //确定
            ggconfirmDel2() {
                let me = this;
                if (this.porType == 1) { //取消订单
                    cancelOrder({
                        orderId: this.oprOrderId,
                        storeId: this.shopid
                    }).then(res => {
                        if (res.code == "1") {
                            this.initData();
                        } else {
                            me.showAlert = true;
                            me.alertText = res.msg;
                        }
                    });
                } else if (this.porType == 2) { //删除订单
                    deleteOrder({
                        orderId: this.oprOrderId,
                        storeId: this.shopid
                    }).then(res => {
                        if (res.code == "1") {
                            this.$router.go(-1);
                        } else {
                            me.showAlert = true;
                            me.alertText = res.msg;
                        }
                    });
                } else if (this.porType == 3) { //确认收货
                    queryTake({
                        orderId: this.oprOrderId,
                        storeId: this.shopid
                    }).then(res => {
                        if (res.code == "1") {
                            this.initData();
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
            showPayWayFun() {
                this.showPayWay = !this.showPayWay;
            },
            showAlipay() {
                this.alipay = !this.alipay;
            },
            //选择付款方式
            surePayway(type) {
                if (type == "1") {
                    this.alipay = true;
                }
                this.payType = type;
            },
            ggPayOrder2(order) { //去支付
                this.showPayWay = !this.showPayWay;
            },
            submitPay2() {
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
                                            me.initData();
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
                            //me.initData();
                             me.initData();
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
            },
            ggcancelOrder2(order) { //取消订单
                this.porType = 1;
                this.oprOrderId = order.orderId;
                this.showTxt = "是否确认取消该订单？";
                this.showconfirmText = "确定";
                this.oprOrder2();
    
            },
            ggSureGet2(order) { //确认收货
                this.porType = 3;
                this.oprOrderId = order.orderId;
                this.showTxt = "是否确认该订单收货？";
                this.showconfirmText = "确定";
                this.oprOrder2();
    
            },
            ggDelOrder2(order) { //删除订单
                this.porType = 2;
                this.oprOrderId = order.orderId;
                this.showTxt = "是否确认删除该订单？";
                this.showconfirmText = "删除";
                this.oprOrder2();
            },
            ggLogistics2(order) { //查看物流
                this.$router.push({
                    path: '/logistics',
                    query: {
                        shopid: this.shopid,
                        orderId: order.orderId,
                        orderNo: order.orderNo
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
    
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'orderDetail';
</style>
