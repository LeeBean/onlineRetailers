<template>
    <div class="profile_page">
        <lazy-render :time="300">
            <section>
                <div class="my_top">
                    <div class="top_img">
                        <img v-lazy="getImgPath(myInfo.imageURL)">
                    </div>
                    <div class="txt">
                        <p class="txt_t">{{myInfo.nickname?myInfo.nickname:"未知用户"}}</p>
                        <!--<p class="txt_b">已绑定手机号<span> 15090980613</span></p>                                 -->
                    </div>
                </div>
                <div class="icon">
                    <router-link :to='{path: "/order",query:{tab:0,shopid:shopid}}'>
                        <div class="weui-cell weui-cell-access top">
                            <div class="weui-cell-bd">
                                <span style="vertical-align: middle">
                                    <label class="label"></label>
                                    <span>我的订单</span>
                                </span>
                                <span class="right">查看全部订单</span>
                            </div>
                            <div class="weui-cell-ft"></div>
                        </div>
                    </router-link>
                    <div class="icon_div">
                        <ul>
                            <router-link :to='{path: "/order",query:{tab:1,shopid:shopid}}'>
                                <li>
                                    <img src="../../images/icon_daifukuan@2x.png">
                                    <p class="icon_p">待付款</p>
                                </li>
                            </router-link>
                            <router-link :to='{path: "/order",query:{tab:2,shopid:shopid}}'>
                                <li>
                                    <img src="../../images/icon_daifahuo@2x.png">
                                    <p class="icon_p">待发货</p>
                                </li>
                            </router-link>
                            <router-link :to='{path: "/order",query:{tab:3,shopid:shopid}}'>
                                <li>
                                    <img src="../../images/icon_daishouhuo@2x.png">
                                    <p class="icon_p">待收货</p>
                                </li>
                            </router-link>
                            <router-link :to='{path: "/service"}'>
                                <li>
                                    <img src="../../images/icon_tuihuan@2x.png">
                                    <p class="icon_p">售后</p>
                                </li>
                            </router-link>
                        </ul>
                    </div>
                </div>
                <router-link :to='{path: "/chooseAddress",query:{shopid:shopid,from:"me",type:1}}'>
                    <div class="weui-cell weui-textnav top_t">
                        <div class="weui-cell-bd">
                            <span style="vertical-align: middle"> 我的收货地址 </span>
                        </div>
                        <div class="weui-cell-ft"></div>
                    </div>
                </router-link>
            </section> 
        </lazy-render>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <foot-guide :storeId="shopid"></foot-guide>
    </div>
</template>

<script>
    import footGuide from 'src/components/footer/footGuide' 
    import {imgBaseUrl } from 'src/config/env'
    import {userInfo } from 'src/service/getData'
    import {getImgPath } from 'src/components/common/mixin'
    export default {
        data() {
            return {
                imgBaseUrl,
                shopid: '',
                myInfo: {}
            }
        },
        created() {
            this.shopid = this.$route.query.shopid;
        },
       
        mounted() {
            userInfo({}).then(res => {
                if (res.code == "1") {
                    this.myInfo = res.userInfo;
                }
            });
        },
         components: {
            footGuide
        },
        mixins: [getImgPath],
    }
</script>
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'profile';
</style>
