<template>
    <div class="paySuccess_page">
         <lazy-render :time="300">
            <section v-show="!showLoading">
                <section class="bottomobrd">
                    <section class="s_top">支付成功</section>
                </section>
                <section class="bottomobrd">
                <p class="mjyfk">买家已付款</p>
                <p class="baoguo"><span>您的包裹准备就绪</span><span class="dccx"  @click.stop.prevent="goOrder">订单查询></span></p>
                </section>
                <section class="bottomobrd" style="padding-top:10px;">
                <p class="baoguo" ><span>实付金额</span><span class="bent" style="color:#FE5000;">¥{{orderData.actualAmount}}</span></p>
                <p class="baoguo" ><span>订单号</span><span class="bent" >{{orderData.orderNo}}</span></p>
                </section>
                <section class="bottomobrd" style="padding-top:10px;margin-top:10px;color:#333">
                <p class="baoguo" ><span style="font-size:14px;">收件人信息</span></p>
                <p class="baoguo" ><span>收件人</span><span class="bent" >{{orderData.name}}</span></p>
                    <p class="baoguo" ><span>联系电话</span><span class="bent" >{{orderData.mobile}}</span></p>
                    <p class="baoguo" ><span>收货地址</span><span class="bent" >{{orderData.address}}</span></p>
                </section>
                <section class="my_address_but">
                        <button @click.stop.prevent="goOnbuy">继续购物</button>
                </section>
            </section>
         </lazy-render>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
    </div>
</template>

<script>
import {getImgPath} from 'src/components/common/mixin'
import {orderDetail} from 'src/service/getData'
import loading from 'src/components/common/loading'
import alertTip from 'src/components/common/alertTip'
import { rootPath } from 'src/config/env'

export default {
    data(){
        return{
            shopid:'',
            routerPath:'',
            showLoading: true, //显示加载动画
            showAlert: false, //弹出框
            alertText: null, //弹出框信息
            orderData: {},
            pram: {
                orderId: '',
                storeId: ''
            }
        }
    },
    created(){
        this.shopid = this.$route.query.shopid;
        this.routerPath=rootPath;
        this.pram.storeId = this.shopid;
        this.pram.orderId = this.$route.query.id;
    },
    mounted() {
        this.initData();
    },
     components: {
        loading,
        alertTip
    },
     methods: {
         async initData() {
            let me = this;
            orderDetail(me.pram).then(res => {
                me.showLoading = false;
                if (res.code == "1") {
                    me.orderData = res.data;
                }else{
                    me.showAlert=true;
                    me.alertText=res.msg;
                }
            });
        },
        goOrder(){
             this.$router.push({path:this.routerPath+'/orderDetail',query:{shopid:this.shopid,id:this.pram.orderId}});
        },
        goOnbuy(){
             this.$router.push({path:this.routerPath+'/index',query:{shopid:this.shopid}});
        }
    }
}

</script>

<style lang="scss" scoped>
   //@import 'src/style/mixin';
   @import 'paySuccess';
</style>
