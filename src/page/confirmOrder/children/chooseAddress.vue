<template>
    <div class="rating_page">
        <lazy-render :time="300">
            <section id="scroll_section" class="scroll_container">
                <section class="list_cotainer">
                    <div class="my_address_info_box" v-for="(item,index) in myaddressList">
                        <div class="address_content" @click.prevent.stop="chooseAddress(item, index)">
                            <div class="address_list_name">{{item.name}}</div>
                            <div class="address_list_tel">{{item.mobile}}</div>
                            <div class="clear_content">
                                <div class="address_default_div">
                                    <button v-show="item.isDefault==1">默认</button>
                                    <p v-show="item.isDefault!=1" style="width: 31px; height: 17px;"></p>
                                </div>
                                <div class="address_details">{{item.fullAddress}}</div>
                            </div>
                        </div>
                        <div class="address_edit_icon" @click="goEditAddress(item, index)">
                            <div>
                                <img src="../../../images/icon_bianji@2x.png" width="14px" height="17px" style=" position: absolute;top: 50%; transform: translateY(-50%);left: 30%;">
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <div @click="goAddAddress" class="add_icon_footer">
                <!--<img src="../../../images/add_address.png" height="24" width="24">-->
                <span style="width: 90%;text-align: center; background: #fb5000; color: #fff; font-size: 0.6rem; height: 35px; line-height: 35px; border-radius: 5px;">添加收件人</span>
            </div>
        </lazy-render>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
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
        addressList
    } from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import loading from 'src/components/common/loading'
    
    export default {
        data() {
            return {
                shopid: '',
                from: '',//从结算过来或者从“我”过来
                productType:'',
                showLoading: true, //显示加载动画
                myaddressList: [], //地址列表
                showAlert: false,
                alertText: null,
                isHaveDefult:false,
            }
        },
        created() {
            this.shopid = this.$route.query.shopid;
            this.from = this.$route.query.from;
            this.productType=this.$route.query.type;
            this.initData();
        },
        components: {
            alertTip,
            loading
        },
        props: [],
        computed: {
    
            ...mapState([
                'addressIndex', 'newAddress'
            ]),
    
        },
        methods: {
            ...mapMutations([
                'CHOOSE_ADDRESS'
            ]),
            //初始化信息
            async initData() {
                addressList({
                    pageidx: 1,
                    pagesize: 100
                }).then(res => {
                    if (res.code == "1") {
                        this.myaddressList = res.dataList;
                        if (this.myaddressList.length == 0) {
                            this.showAlert = true;
                            this.alertText = "暂无收货人地址，请前往添加";
                            setTimeout(() => {
                                this.$router.push({
                                    path: '/addAddress',
                                    query: {
                                        shopid: this.shopid
                                    }
                                });
                            }, 1000)
                        }else{
                             //不能使用forEach  因为无法跳出循环
                            for (var i = 0; i < res.dataList.length; i++) {
                                if (res.dataList[i].isDefault==1) {
                                    this.isHaveDefult=true;
                                    break;
                                }
                            }
                        }

                    } else {
                        this.showAlert = true;
                        this.alertText = res.msg;
                    }
                    this.showLoading = false;
                }).catch(function(err) {
    
                });
            },
    
            //选择地址
            chooseAddress(address, index) {
                this.CHOOSE_ADDRESS({
                    address,
                    index
                });
                if (this.from != "me") {
                    this.$router.go(-1);
                }
            },
            //前往地址编辑
            goEditAddress(address, index) {
                this.CHOOSE_ADDRESS({
                    address,
                    index
                });
                this.$router.push({
                    path: '/addAddress',
                    query: {
                        oprtype: 'edit',
                        from: this.from,
                        ptype:this.productType
                    }
                });
            },
            //前往地址添加
            goAddAddress() {
    
                this.$router.push({
                    path: '/addAddress',
                    query: {
                        oprtype: 'add',
                        from: this.from,
                        ptype:this.productType,
                        hasDefault:this.isHaveDefult
                    }
                });
            }
        },
        watch: {
            // userInfo: function (value) {
            //     if (value && value.user_id) {
            //         this.initData();
            //     }
            // },
            // newAddress: function (value) {
            //     this.initData();
            // },
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'chooseAddress';
</style>
