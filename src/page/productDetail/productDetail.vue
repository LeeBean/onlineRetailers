<template>
    <div>
        <lazy-render :time="300">
            <div v-show="!showLoading">
                <nav class="msite_nav">
                    <div class="swiper-container" style="background: #fff;">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="item in headerImageList">
                                <img :src="getImgPath(item.imageUrl)" style="width: 100%;">
                            </div>
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                </nav>
                <div class="info_div">
                    <p class="txt">{{productInfo.productName}}</p>
                    <p class="price">¥{{productInfo.price}}</p>
                    <div class="label">
                        <p class="label_p" v-for="(info,index) in productInfo.infoList" :style="{margin:index==0?'0':'0 0 0 20px'}">
                            <img class="label_img" src="../../images/icon_name@2x.png">{{info.value}}
                        </p>
                    </div>
                </div>
                <div class="list-dp">
                    <div class="weui-cell weui-cell-access" id="showIOSActionSheet">
                        <div class="weui-cell-bd" @click="choseAdd()">
                            <span style="vertical-align: middle" id="peisong_address">配送至：{{Province?Province:'省份'}}、 {{City?City:'城市'}}、{{District?District:'区域'}}</span>
                        </div>
                        <div class="weui-cell-ft"></div>
                    </div>
                    <div class="weui-cell weui-cell-access" v-show="productInfo.productType=='3'">
                        <div class="weui-cell-bd">
                            <span style="vertical-align: middle"><p class="dp">重量：<span id="yunfei"> {{productInfo.totalWeights}}g</span><span style="font-size:0.5rem;color:#999;">{{weightDesc}}</span></p>
                            </span>
                        </div>
                    </div>
                    <div class="weui-cell weui-cell-access">
                        <div class="weui-cell-bd">
                            <span style="vertical-align: middle"><p class="dp">运费：<span id="yunfei"> {{postage}}元</span></p>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="weui-cell weui-cell-access top" style="padding-bottom: 10px;" @click.stop="closeDesc()">
                    <div class="weui-cell-bd">
    
                        <div class="sm">说明：</div>
                        <div class="sm_right">
                            <p v-for="descinfo in productInfo.productIntroList"><span></span>{{descinfo.title}}</p>
                        </div>
                    </div>
                    <div class="weui-cell-ft"></div>
                </div>
                <div class="choose">
                    <div class="left c">
                        <p :class='{cho: descStatus ==0}' @click="descStatusChange(0)">产品介绍</p>
                    </div>
                    <div class="right c">
                        <p :class='{cho: descStatus ==1}' @click="descStatusChange(1)">购买须知</p>
                    </div>
                </div>
                <div v-show="descStatus==0">
                    <div class="dp_img_list" style="display: block;">
                        <p>
                            <!--<img src="http://www.jikeduo.com.cn/upload/images/000/000/001/201607/578f7bc3c6acc.jpg">
                                    <img src="http://www.jikeduo.com.cn/upload/images/000/000/001/201607/578f7bc3d1a63.jpg">-->
                            <img v-for="(img,index) in productInfo.productDesc" v-lazy="getImgPath(img.src)" :key="index">
                        </p>
                    </div>
                </div>
                <div v-show="descStatus==1">
                    <div v-show="!productInfo.purchaseNotes" class="dp_img_list" style="font-size: 0.55rem;padding: 10px;">
                        暂无购买须知！
                    </div>
                    <div v-show="productInfo.purchaseNotes" class="dp_img_list" style="font-size: 0.55rem;padding: 10px;">
                        <img v-for="(img,index) in productInfo.purchaseNotes" v-lazy="getImgPath(img.src)" :key="index">
                    </div>
    
                </div>
                <section class="myAddress">
                    <section class="showChose" v-show="showChose" @click="closeAdd()">
                    </section>
                    <section class="address" v-show="showChose">
                        <!--<section class="title">
                            <h4>请选择地址</h4>
                            <span @click="closeAdd()">×</span>
                        </section>-->
                        <section class="title" style="height:2rem;line-height:2rem;border-bottom:1px #eee solid;overflow: hidden;">
                            <div class="area" @click="provinceSelected()" :class="showProvince?'active':''">{{Province?Province:'省份'}}</div>
                            <div class="area" @click="citySelected()" :class="showCity?'active':''">{{City?City:'城市'}}</div>
                            <div class="area" @click="districtSelected()" :class="showDistrict?'active':''">{{District?District:'区域'}}</div>
                        </section>
                        <ul>
                            <li class="addList" v-for="(v,k) in info" @click="getProvinceId(v.code, v.name, k)" v-show="showProvince" :class="v.selected ? 'active' : ''">{{v.name}}</li>
                            <li class="addList" v-for="(v,k) in showCityList" @click="getCityId(v.code, v.name, k)" v-show="showCity" :class="v.selected ? 'active' : ''">{{v.name}}</li>
                            <li class="addList" v-for="(v,k) in showDistrictList" @click="getDistrictId(v.code, v.name, k)" v-show="showDistrict" :class="v.selected ? 'active' : ''">{{v.name}}</li>
                        </ul>
                    </section>
                </section>
                <transition name="fade">
                    <div class="cover" v-if="showBuy" @click="closeBuy"></div>
                </transition>
                <transition name="slid_up">
                    <div class="choose_type_Container" v-if="showBuy">
                        <div class="gm-task">
                            <div class="price_div">
                                <div class="price_l sf_txt">¥{{productInfo.price}}</div>
                                <div class="sf_close choose" @click="closeBuy">
                                    <img src="../../images/icon_guanbi@2x.png">
                                </div>
                            </div>
                            <div class="list ">
                                <p class="list_p">数量</p>
                                <div class="gw_num" style="margin-top: 13px;">
                                    <span class="input-number-decrement" @click="subtraction();">–</span>
                                    <input class="input-number"v-model="addcartpram.num" ></input>
                                    <span class="input-number-increment" @click="add();">+</span>
                                </div>
                            </div>
                            <div class="weui-cell weui-cell_access list_we" v-show="productInfo.productType=='2'" @click="openSf">
                                <p class="list_p">税费</p>
                                <p class="list_r">¥ {{productInfo.tax*addcartpram.num|sfFixed}}</p>
                                <div class="weui-cell-ft  list_ft"></div>
                            </div>
                            <div class="sf_none" v-show="showsf">
                                <div class="sf_list">
                                    <div class="ruce"></div>
                                    <div class="sf_info">
                                        <p class="in">商品税费根据国家政策规定，本商品适用于跨境综合税，税率为11.9%，实际结算税费请以提交订单的应付总额明细为准.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="btn_div">
                                <button class="btn" @click="doOpr">{{oprText}}</button>
                            </div>
                        </div>
                    </div>
                </transition>
    
                <transition name="fade">
                    <div class="cover" v-if="showDesc" @click="closeDesc"></div>
                </transition>
                <transition name="slid_up">
                    <div class="choose_type_Container" v-if="showDesc">
                        <div class="gm-task" style="padding-bottom: 20px">
                            <div style="position: absolute;right: 10px;top: 5px;" @click="closeDesc">
                                <img src="../../images/icon_guanbi@2x.png" width="17">
                            </div>
                            <p style="padding-left: 10px;line-height: 45px;font-size: 0.6rem;color: #666;  border-bottom: 1px #eee solid;">商品说明</p>
    
                            <div class="sm_right" style="margin-left: 10px;margin-top: 10px;" v-for="descinfo2 in productInfo.productIntroList">
                                <div style="color:#666;font-size:0.55rem"><span></span>{{descinfo2.title}}</div>
                                <div style="color:#666;font-size:0.5rem;margin-left: 10px;">{{descinfo2.introduction}}</div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
    
            <footer class="foot_div">
                <router-link :to='{path:  routerPath+"/index",query:{shopid:shopid}}'>
                    <div class="zy ff" style="background:#fff">
                        <img src="../../images/icon_shouye@2x.png"> 主页
                    </div>
                </router-link>
                <router-link :to='{path:  routerPath+"/cart",query:{shopid:shopid}}'>
                    <div class="gwc ff" style="background:#fff">
                        <p class="addcart-goods-num" v-show="quantity>0">{{quantity}}</p>
                        <img src="../../images/icon_gouwuche@2x.png"> 购物车
                    </div>
                </router-link>
                <button class="jr_gwc bt"  v-show="productInfo.isSoldOut!='1'" @click="addCart" style="border-right: 1px #fff solid;">加入购物车</button>
                <button class="gm bt"  v-show="productInfo.isSoldOut!='1'"  @click="buyNow">立即购买</button>
                <button class="bt" v-show="productInfo.isSoldOut=='1'" style="width: 61%;background: #999;">暂无库存</button>
                
            </footer>
        </lazy-render>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
    </div>
</template>

<script>
    import { mapState,mapMutations} from 'vuex'
    import loading from 'src/components/common/loading'
    import { getImgPath } from 'src/components/common/mixin'
    import { getCityList, productDetail, addNumCart,orderCheckDetail, checkBuy, getPostage} from 'src/service/getData'
    import {wxShowOptionMenu } from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'
    import 'src/plugins/swiper.min.js'
    import 'src/style/swiper.min.css'
    import { rootPath } from 'src/config/env'
    export default {
        data() {
            return {
                routerPath:'',
                shopid: '',
                productId: '',
                showAlert: false, //弹出框
                alertText: null, //弹出框信息
                productInfo: {},
                headerImageList: [],
                preventRepeat: false, //防止重复获取
                showLoading: true, //显示加载动画
                descStatus: 0,
                showChose: false,
                showProvince: true,
                showCity: false,
                showDistrict: false,
                showCityList: false,
                showDistrictList: false,
                province: 310000,
                city: 310000,
                district: 310112,
                GetProvinceId: 2,
                Province: "上海市",
                City: false,
                District:false,
                selected: false,
                info: [{
                    code: 310000,
                    name: '上海'
                }],
                showBuy: false, //显示数量选择框
                showDesc: false, //显示商品说明
                addcartpram: {
                    storeId: '',
                    productId: '',
                    num: 1,
                    isFromCartList: false,
                }, //购物车商品数量修改请求参数
                oprType: 1, //操作类型 1-添加购物车 2-立即购买
                oprText: '', //操作描述
                quantity: 0, //购物车数量
                postage: 0, //运费
                weightDesc: '',//运费描述
                showsf:false //是否显示税费
    
            }
        },
        created() {
            let me = this;
            getCityList().then(res => {
                this.info = res;
            });
            me.shopid = me.$route.query.shopid;
            me.productId = me.$route.query.productid;
            me.addcartpram.storeId = me.shopid;
            me.addcartpram.productId = me.productId;
            me.routerPath=rootPath;
            wxShowOptionMenu();
        },
        mounted() {
            let me = this;
            productDetail({
                id: me.productId,
                storeId: me.shopid
            }).then(res => {
                this.showLoading = false;
                if (res.code == "1") {
                    me.headerImageList = res.headerImageList;
                    me.productInfo = res.data;
                    getPostage({
                        number: me.addcartpram.num,
                        wholesaleId: me.productId,
                        provinceId: me.province,
                        isWeb: true
                    }).then(res => {
                        if (res.code == "1") {
                            me.postage = res.postage;
                            me.weightDesc = res.weightDesc;
                        }
                    });
                    me.quantity = res.data.cartProductNumbers;
                    setTimeout(() => {
                        new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            loop: true,
                            autoplay: 3000 //可选选项，自动滑动
                        });
                    }, 300);
                } else {
                    this.showAlert = true;
                    this.alertText = res.msg;
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 1000);
                }
            });
        },
        mixins: [getImgPath],
        components: {
            loading,
            alertTip
        },
        methods: {
            choseAdd: function() {
                this.showChose = true;
            },
            closeAdd: function() {
                this.showChose = false;
            },
            _filter(add, name, code) {
                let result = [];
                for (let i = 0; i < add.length; i++) {
                    if (code == add[i].code) {
                        result = add[i][name];
                    }
                }
                return result;
            },
            getProvinceId: function(code, input, index) {
                this.province = code;
                this.Province = input;
                this.showProvince = false;
                this.showCity = true;
                this.showDistrict = false;
                this.showCityList = this._filter(this.info, 'children', this.province);
                // 点击选择当前
                this.info.map(a => a.selected = false);
                this.info[index].selected = true;
            },
            provinceSelected: function() {
                // 清除市级和区级列表
                this.showCityList = false;
                this.showDistrictList = false;
                // 清除市级和区级选项
                this.City = false;
                this.District = false;
                // 选项页面的切换
                this.showProvince = true;
                this.showCity = false;
                this.showDistrict = false;
            },
            getCityId: function(code, input, index) {
                this.city = code;
                this.City = input;
                this.showProvince = false;
                this.showCity = false;
                this.showDistrict = true;
                this.showDistrictList = this._filter(this.showCityList, 'children', this.city);
                // 选择当前添加active
                this.showCityList.map(a => a.selected = false);
                this.showCityList[index].selected = true;
            },
            citySelected: function() {
                this.showProvince = false;
                this.showCity = true;
                this.showDistrict = false;
            },
            getDistrictId: function(code, input, index) {
                this.district = code;
                this.District = input;
                // 选择当前添加active
                this.showDistrictList.map(a => a.selected = false);
                this.showDistrictList[index].selected = true;
                // 选取市区选项之后关闭弹层
                this.showChose = false;
                getPostage({
                    number: this.addcartpram.num,
                    wholesaleId: this.productId,
                    provinceId: this.province,
                    isWeb: true
                }).then(res => {
                    if (res.code == "1") {
                        this.postage = res.postage;
                        this.weightDesc = res.weightDesc;
                    }
                });
            },
            districtSelected: function() {
                this.showProvince = false;
                this.showCity = false;
                this.showDistrict = true;
            },
            addCart: function() {
                this.oprType = 1;
                this.oprText = "加入购物车";
                this.chooseProductNum();
            },
            buyNow: function() {
                this.oprType = 2;
                this.oprText = "立即购买";
                this.chooseProductNum();
            },
            closeBuy() {
                this.showBuy = !this.showBuy;
            },
            closeDesc() {
                this.showDesc = !this.showDesc;
            },
            //选择商品数量
            chooseProductNum() {
                this.showBuy = !this.showBuy;
            },
            //数量加
            add() {
                this.addcartpram.num = Number(this.addcartpram.num) + 1;
            },
            //数量减
            subtraction() {
                if (this.addcartpram.num > 1) {
                    this.addcartpram.num = Number(this.addcartpram.num) - 1;
                }
            },
            descStatusChange(state) {
                this.descStatus = state;
            },
            //加入购物车或者立即购买
            doOpr() {
                let me = this;
                if (this.oprType == "1") { //加入购物车
                    addNumCart(this.addcartpram).then(res => {
                        if (res.code == "1") { //成功
                            this.showAlert = true;
                            this.alertText ="添加购物车成功！";
                            this.quantity = res.cartProductNumbers;
                            this.showBuy = !this.showBuy;
                        } else {
                            this.showAlert = true;
                            this.alertText = res.msg;
                            this.showBuy = !this.showBuy;
                        }
                    });
                } else { //立即购买
                    checkBuy({
                        storeId: me.shopid,
                        productId: me.productId,
                        number: me.addcartpram.num
                    }).then(res => {
                        if (res.code == "1") { //成功
                            me.$router.push({
                                path:  me.routerPath+'/confirmOrder',
                                query: {
                                    shopid: me.shopid,
                                    id: me.productId,
                                    num: me.addcartpram.num
                                }
                            });
                        } else {
                            this.showAlert = true;
                            this.alertText = res.msg;
                            this.showBuy = !this.showBuy;
                        }
                    });
    
                }
    
            },
            openSf(){
                //var mproductType = this.orderInfo.productType; //商品类别 1-国内 2-跨境 3-直邮
                if( this.productInfo.productType=="2"){
                    this.showsf=!this.showsf;
                }
                
            }
    
        },
        filters: {
            sfFixed: function(value) {
                return value.toFixed(2);
            }
        },
        watch: {
    
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'productDetail';
</style>
