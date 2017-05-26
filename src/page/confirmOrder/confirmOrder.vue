<template>
    <div class="order_detail_page">
        <lazy-render :time="300" style="margin-bottom: 60px;">
             <div v-show="!showLoading">
            <div class="top" style="background:#fff;">
                <span class="store_icon"></span>
                <p>店铺：{{orderInfo.storeName}}</p>
            </div>
            <div class="list_info bg_white">
                <ul>
                    <li class="info_li" v-for="item in orderInfo.productList">
                        <router-link :to="{path:  routerPath+'/productDetail',query:{shopid:shopid,productid:item.productId}}">
                            <div class="info_lidiv">
                                <div class="info_imgdiv">
                                    <img v-lazy="getImgPath(item.imageUrl)" class="info_img">
                                </div>
                                <p class="shop_txt">{{item.productName}}</p>
    
                                <div class="info_price_num">
                                    <p class="info_price">¥{{item.price}}</p>
                                    <p class="info_num">x{{item.productNumber}}</p>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="payment_info bg_white">
                <p>运费<span>¥{{orderInfo.postage}}</span></p>
                <p class="clear_order_goods_format"></p>
                <p>进口税<span>¥{{orderInfo.tax}}</span></p>
                <p class="clear_order_goods_format"></p>
                <p class="yf">实际付款（含运费）<span class="yf_span">¥{{orderInfo.orderAmount}}</span></p>
            </div>
            <div class="ui_list bg_white">
                <a name="buy_way"></a>
                <ul>
                    <li class="ui_list_li b ui_list_li_2" @click="showSendWayFun" style="border-bottom:none;">配送方式
                        <span class="icon-go icon_a"></span>
                        <span class="choose" data-type="express">{{checkpram.buyWarType==0?"快递配送":"到店自提"}}</span>
                    </li>
    
                </ul>
            </div>
            <div class="bg_white" v-show="checkpram.buyWarType==0">
                <div class="assd order_assd2 clearfix" @click="goAddress()" style="width:100%;">
                    <div class="assd_icon assd_icon2">
                        <span class="location_icon">&nbsp;</span>
                    </div>
                    <div v-show="!addressInfo.name" class="assd_info assd_info-top" style="margin-top: 5px;padding-top: 20px;">
                        暂无收货人资料，请添加
                    </div>
                    <div v-show="addressInfo.name" class="assd_info assd_info3">
                        <span class="info_names">收件人:</span>
                        <span class="info_phone info_phones">{{addressInfo.name}}</span>
                        <p class="info_txt">{{addressInfo.address}}</p>
                        <p v-show="orderInfo.productType!=1&&addressInfo.identityNo==''" class="info_txt" style="color:#fe5000;font-size:0.5rem;margin-left: -0.213rem;">（未上传实名身份信息）</p>
                    </div>
                    <div class="assd_right_icon">
                        <span class="icon-go icon_a" style="line-height:60px;"></span>
                    </div>
    
                </div>
                <div class="hint_info_span">根据国家海关要求，购买保税仓及海外直邮商品，必须上传个人实名信息，并且保证与收货人信息的一致</div>
            </div>
            <div class="bg_white" v-show="checkpram.buyWarType==1">
                <div class="assd order_assd2 clearfix" @click.stop="showActivitiesFun" style="width:100%;">
                    <div class="assd_icon assd_icon2" style="padding-top: 10px;">
                        <span class="location_icon">&nbsp;</span>
                    </div>
                    <div class="assd_info assd_info3">
                        <span class="info_names">{{checkpram.name?checkpram.name:'请填写提货人'}}</span>
                        <span class="info_phone info_phones">{{checkpram.mobile}}</span>
                    </div>
                    <div class="assd_right_icon">
                        <span class="icon-go icon_a" style="line-height:45px;"></span>
                    </div>
    
                </div>
                <div class="hint_info_span" style="height:55px;">
                    <p style="font-size: 13px; color: #666;">提货地点</p>
                    <p style="font-size: 13px; color: #666;padding-top: 10px;">加州奥克兰中国城分店,奥兰多分店Lac1b店</p>
                </div>
            </div>
            <transition name="fade">
                <div class="cover" v-if="showSendWay" @click="showSendWayFun"></div>
            </transition>
            <transition name="slid_up">
                <div class="choose_type_Container" v-if="showSendWay">
                    <header>配送方式</header>
                    <ul>
                        <li :class='{choose: checkpram.buyWarType=="0"}' @click="checkpram.buyWarType=0">
                            <span>快递配送</span>
                            <svg class="address_empty_right">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                            </svg>
                        </li>
                        <li :class='{choose: checkpram.buyWarType=="1"}' @click="checkpram.buyWarType=1">
                            <span>到店自提</span>
                            <svg class="address_empty_right">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                            </svg>
                        </li>
                    </ul>
                    <div class="pay_msg6" style="margin-top: 20px;"><div  class="pay_button" @click="chooseSendWay()">确定</div></div>
                </div>
            </transition>
    
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
                            <span class="order_money">¥{{orderInfo.orderAmount}}</span>
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
            <transition name="fade">
                <section class="activities_details" v-if="showActivities">
                    <div class="ui_listh">
                        <ul>
                            <li class="ui_list_li a address_edit_name"><input type="text" placeholder="请填写收货人" maxlength="20" v-model="checkpram.name"></li>
                            <li class="ui_list_li a address_edit_tel"><input type="tel" placeholder="请填写联系电话" maxlength="20" v-model="checkpram.mobile"></li>
                        </ul>
                    </div>
                    <div class="my_address_but">
                        <button @click.stop.prevent="showActivitiesFun">确定</button>
                    </div>
                </section>
            </transition>
            <div class="foot">
                <span class="foot_num">共{{orderInfo.totalNumber}}件</span>
                <span class="foot_prprice">合计：<label>¥{{orderInfo.orderAmount}}</label></span>
                <button class="foot_sub" style="" @click="sureOrder">确认订单</button>
            </div>
            <loading-toast v-if="showLoadingToast" @closeTip="showLoadingToast = false" :loadingText="loadingText"></loading-toast>
            </div>
        </lazy-render>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <div class="cover22" v-if="showCover"  @click.self="closeCover"> 
            <div><img class="ercode" :src="getImgPath(ercode)"></div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import {getImgPath} from 'src/components/common/mixin'
    import {orderCheckDetail,orderConfrim,orderPay} from 'src/service/getData'
    import loading from 'src/components/common/loading'
    import alertTip from 'src/components/common/alertTip'
    import loadingToast from 'src/components/common/loadingToast'
    import {isWeiXin } from 'src/config/mUtils'
    import { rootPath } from 'src/config/env'
    export default {
        data() {
            return {
                routerPath:'',
                shopid: '',
                showLoading: true, //显示加载动画
                orderData: null,
                preventRepeat: false,
                showSendWay: false, //显示物流方式
                showPayWay: false, //显示付款方式
                payType: 0, //付款方式 0-微信 1-支付宝
                alipay: false, //现在支付宝支付
                showActivities: false, //是否显示提货人信息
                showAlert: false, //弹出框
                alertText: null, //弹出框信息
                showLoadingToast:false,//显示loadingToast
                loadingText:'',//loadingTost 提示信息
                checkpram: {
                    storeId: '',
                    cartIds: '',
                    buyWarType: 0,
                    postType: 1,
                    addressId: '',
                    mobile: '',
                    name: '',
                    number: 1,
                    productId: ''
                },
                orderInfo: {}, //订单信息
                addressInfo: {}, //地址信息
                showCover:false,
                ercode:'',//二维码
            }
        },
        created() {
            this.shopid = this.$route.query.shopid;
            this.checkpram.storeId = this.shopid;
            if (this.$route.query.id != undefined && this.$route.query.id != "") {
                this.checkpram.productId = this.$route.query.id;
                this.checkpram.number = this.$route.query.num;
                this.checkpram.postType = 0;
            } else {
                this.checkpram.cartIds = this.cart_id;
            }
            this.routerPath=rootPath;
            if (this.choosedAddress) {
                this.checkpram.addressId=this.choosedAddress.addressId;
            }
        },
        mounted() {
            //alert(this.cart_id);
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
                'cart_id', 'choosedAddress'
            ]),
        },
        methods: {
    
            async initData() {
                let me = this;
                // if(this.cart_id==undefined){
                //     this.showAlert = true;
                //     this.alertText = "参数错误！";
                //     this.showLoading = false;
                //     return;
                // }
                orderCheckDetail(me.checkpram).then(res => {
                    me.showLoading = false;
                    if (res.code == "1") {
                        me.orderInfo = res.data;
                        if(res.addressInfo){
                            me.addressInfo = res.addressInfo;
                        }
                        // if (me.choosedAddress) {
                        //     me.addressInfo = me.choosedAddress;
                        // }
                    } else {
                        me.$router.go(-1);
                    }
    
                });
    
            },
            goAddress() {
                this.preventRepeat = false;
                this.$router.push({
                    path: this.routerPath+'/chooseAddress',
                    query: {
                        shopid: this.shopid,
                        from:"confirm",
                        type:this.orderInfo.productType
                    }
                });
            },
            showSendWayFun() {
                this.showSendWay = !this.showSendWay;
            },
            showPayWayFun() {
                this.showPayWay = !this.showPayWay;
            },
            //确认订单，先检查商品是否跨境，身份证是否上传
            sureOrder() {
                var mproductType = this.orderInfo.productType; //商品类别 1-国内 2-跨境 3-直邮
                var midentityNo = this.addressInfo.identityNo;
                var midentityFront = this.addressInfo.identityFront;
                var midentityBack = this.addressInfo.identityBack;
                if (mproductType == "2" && this.checkpram.buyWarType == 0) {
                    if (midentityNo == "" || midentityNo == undefined) {
                        this.showAlert = true;
                        this.alertText = "跨境商品需要上传身份证号！请前往添加！";
                        return;
                    }
                } else if (mproductType == "3"&& this.checkpram.buyWarType == 0) {
                    if (!(midentityNo != "" && midentityFront != "" && midentityBack != "")) {
                        this.showAlert = true;
                        this.alertText = "直邮商品需要上传身份证号及身份证正反面！请前往添加！";
                        return;
                    }
                }else if(this.checkpram.buyWarType == 1){
                    if(this.checkpram.name==""||this.checkpram.mobile==""){
                        this.showAlert = true;
                        this.alertText = "请填写完整的提货人信息！";
                        return;
                    }
                }
                this.showPayWay = !this.showPayWay;
            },
            //选择物流方式
            chooseSendWay() {
                this.showSendWay = !this.showSendWay;
                //this.checkpram.buyWarType = type;
                this.initData();
            },
    
            choosePayWay(type) {
                this.showPayWay = !this.showPayWay;
                this.payType = type;
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
                if( this.alipay){
                    this.payType = 1;
                }else{
                    this.payType = 0;
                }
            },
            //前往填写提货信息
            goAddGetInfo() {
                this.$router.push({
                    path: '/takeInfo',
                    query: {
                        shopid: this.shopid
                    }
                });
            },
            //控制提货人信息页的显示隐藏
            showActivitiesFun() {
                this.showActivities = !this.showActivities;
            },
            submitPay() {
                let me = this;
                me.showLoadingToast=true;
                me.loadingText="订单正在提交....";
                //me.showLoading = true;
                if (me.checkpram.buyWarType == "0") {
                    me.checkpram.addressId = me.addressInfo.addressId;
                }
                orderConfrim(me.checkpram).then(res => {
                   // me.showLoading = false;
                    me.showPayWay = !this.showPayWay;
                    if (res.code == "1") {
                        
                        let paybo = {
                            orderId: res.orderId,
                            isWeb: true
                        }
                        if (this.payType == 0) {
                            paybo.payType = "weixin";
                        }
                        orderPay(paybo).then(res2 => {
                            me.showLoadingToast=false;
                            if (res2.code == "1") {
                                if(res2.orderPayInfo.isOther=="1"){
                                    me.ercode=res2.orderPayInfo.imagePath;
                                    me.showCover=true;
                                    return;
                                }
                                // me.$router.push({
                                //     path: '/orderDetail',
                                //     query: {
                                //         shopid: me.shopid,
                                //         id: res.orderId
                                //     }
                                // });
                                if (isWeiXin() && this.payType == 0) {
                                    function onBridgeReady() {
                                        WeixinJSBridge.invoke(
                                            'getBrandWCPayRequest', {
                                                "appId": res2.orderPayInfo.appId, //公众号名称，由商户传入     
                                                "timeStamp": res2.orderPayInfo.timeStamp, //时间戳，自1970年以来的秒数     
                                                "nonceStr": res2.orderPayInfo.nonceStr, //随机串     
                                                "package": res2.orderPayInfo.package,
                                                "signType":res2.orderPayInfo.signType, //微信签名方式：     
                                                "paySign": res2.orderPayInfo.paySign //微信签名 
                                            },
                                            function(res3) {
                                                if (res3.err_msg == "get_brand_wcpay_request:ok") {
                                                    me.showAlert = true;
                                                    me.alertText = "订单支付成功！";
                                                    me.$router.push({path: me.routerPath+'/paySuccess',query:{shopid:me.shopid,id:res.orderId}});
                                                }else if(res3.err_msg == "get_brand_wcpay_request:cancel"){
                                                    me.showAlert = true;
                                                    me.alertText = "订单支付取消！";
                                                }else{
                                                    me.showAlert = true;
                                                    me.alertText = "订单支付失败！";
                                                }
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
                                } else if (me.payType == 1) { 
                                    setTimeout(()=>{
                                        window.location.href = res2.orderPayInfo;
                                    },1000)
                                } else {
                                    me.showAlert = true;
                                    me.alertText = "请在微信浏览器中打开";
                                }
                            } else {
                                me.showAlert = true;
                                me.alertText = res2.msg;
                            }
                        });
                       
                    } else {
                        me.showLoadingToast=false;
                        me.showAlert = true;
                        me.alertText = res.msg;
                    }
    
                });
            },
            closeCover(){
                this.showCover=false;
            }
        },
        beforeRouteLeave (to, from, next) {
           if( this.showActivities){
                this.showActivities=!this.showActivities;
                next(false)
            }else{
                next()
            }
        }

    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'confirmOrder';
</style>
