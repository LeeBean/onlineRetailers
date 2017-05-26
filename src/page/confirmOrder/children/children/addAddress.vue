<template>
       <div class="rating_page">
        <lazy-render :time="300">
            <section id="scroll_section" class="scroll_container">
                <div class="ui_list address_edit_infos">
                    <ul>
                        <li class="ui_list_li a"><input type="text" placeholder="姓名" v-model="addressData.name" maxlength="20"></li>
                        <li class="ui_list_li a"><input type="tel" placeholder="手机号码" v-model="addressData.mobile" maxlength="20"></li>
                        <li class="ui_list_li a" style="color: #a9a9a9;" @click="choseAdd()">
                            {{Province?Province:'省份'}}、 {{City?City:'城市'}}、{{District?District:'区域'}}
                        </li>
                        <li class="ui_list_li a">
                            <input type="text" placeholder="详细地址，如街道、楼牌号等" class="ipt_assd" v-model="addressData.address" maxlength="100">
                        </li>
                        <li class="ui_list_li a set_default_address" style="border-bottom:none;">
                            <span style="color: #a9a9a9;">设置为默认地址</span>
    
                            <input type="checkbox" v-model="addressData.isDefault" id="checkbox_c1" class="chk_3" /><label for="checkbox_c1"></label>
    
                        </li>
                    </ul>
                </div>
                <div id="order_identity_info" style="margin-top:0.4rem;" v-if="wherefrom=='confirm'&&ptype!='1'">
                    <div class="ui_list">
                        <ul>
                            <li class="ui_list_li b">
                                <input type="text" style="padding: 0 0.7rem;" placeholder="请输入身份证号" v-model="addressData.identityNo" maxlength="30">
                            </li>
                            <!--<li class="hint" style="margin-top: 5px;margin-bottom: 10px;">非必填，购买免税仓发货则必须填写身份证号码</li>-->
                        </ul>
                    </div>
                    <div class="identity_pic_div" v-if="ptype=='3'">
                        <div class="front_div webuploader-container">
                            <div class="webuploader-pick">
                                <img v-if="addressData.identityFront!=''" :src="getImgPath(addressData.identityFront)" width="100%;" class="pic_overflow">
                                <img v-if="addressData.identityFront==''" src="../../../../images/shenfenzheng1@2x.png" width="100%;" class="pic_overflow">
                                <img v-show="addressData.identityFront==''" src="../../../../images/icon@2x.png" width="63px" height="24px" class="pic_upload_but">
                                <p class="pic_upload_text">身份证正面照</p>
                            </div>
                            <div class="opcity">
                                <input type="file" capture="camera" id="identityFront" name="identityFront" @change="uploadAvatar(1)" class="webuploader-element-invisible" multiple="multiple" accept="image/*">
    
                            </div>
                        </div>
                        <div class="back_div webuploader-container">
                            <div class="webuploader-pick">
                                <img v-if="addressData.identityBack!=''" :src="getImgPath(addressData.identityBack)" width="100%;" class="pic_overflow">
                                <img v-if="addressData.identityBack==''" src="../../../..//images/shenfenzheng2@2x.png" width="100%;" class="pic_overflow">
                                <img v-show="addressData.identityBack==''" src="../../../../images/icon@2x.png" width="63px" height="24px" class="pic_upload_but">
                                <p class="pic_upload_text">身份证反面照</p>
                            </div>
                            <div class="opcity">
                                <input type="file" capture="camera" id="identityBack" name="identityBack" @change="uploadAvatar(2)" class="webuploader-element-invisible" multiple="multiple" accept="image/*">
    
                            </div>
                        </div>
                    </div>
                    <div class="info_hint info_hint1" style="padding-top: 10px;" v-if="ptype=='3'||ptype=='2'">
                        <div class="info_hint_left">
                            <img src="../../../../images/wenhao@2x.png">
                            <!--<span class="icon-wen"></span>-->
                        </div>
                        <p class="info_hint_toptxt">为什么需要上传身份证</p>
                        <p class="info_p">根据海关规定，购买跨境商品需实名认证，以确保商品通过海关检查</p>
                        <p class="info_p">本方承诺所传身份证只用于办理跨境商品的清关手续，不作他途使用，其他任何人均无法查看。</p>
                        <p class="info_p red">如果上传身份证照片不清晰，可能会被海关拒绝清关，请您仔细检查。</p>
                    </div>
                </div>
                <div v-if="oprType=='edit'" class="del_div " @click.stop.prevent="deleteAddr">删除地址</div>
            </section>
    
            
    
    
            <section class="coverpart" v-if="show">
                <section class="cover-background"></section>
                <section class="cover-content " :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
                    <!--<div class="sa-icon">
                            <span class="sa-body"></span>
                            <span class="sa-dot"></span>
                        </div>-->
                    <h2>是否确定删除该地址</h2>
                    <div class="sa-botton">
                        <button class="waiting" @click="cancelDel">取消</button>
                        <div style="display:inline-block;">
                            <button class="quitlogin" @click="confirmDel">确定删除</button>
                        </div>
                    </div>
                </section>
            </section>
            <section class="myAddress">
                <section class="showChose" v-show="showChose" @click="closeAdd()">
                </section>
                <section class="address" v-show="showChose">
                    <!--<section class="title">
                        <h4>请选择地址</h4>
                        <span @click="closeAdd()">×</span>
                    </section>-->
                    <section class="title"  style="height:2rem;line-height:2rem;border-bottom:1px #eee solid;overflow: hidden;">
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
            <loading-toast v-if="showLoadingToast" @closeTip="showLoadingToast = false" :loadingText="loadingText"></loading-toast>
            <div @click.stop.prevent="addAddress" class="add_icon_footer">
                <!--<img src="../../../images/add_address.png" height="24" width="24">-->
                <span style="width: 90%;text-align: center; background: #fe5000; color: #fff; font-size: 0.6rem; height: 35px; line-height: 35px; border-radius: 5px;">保存</span>
            </div>
        </lazy-render>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <!--<div class="my_address_but">
            <button @click.stop="addAddress">保存</button>
        </div>-->
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import alertTip from 'src/components/common/alertTip'
    import loadingToast from 'src/components/common/loadingToast'
    import {
        getCityList,
        saveAddress,
        deleteAddress
    } from 'src/service/getData'
    import {
        getImgPath
    } from 'src/components/common/mixin'
    import {
        baseUrl
    } from 'src/config/env'
    import loading from 'src/components/common/loading'
    export default {
        data() {
            return {
                show: false, //显示提示框
                showAlert: false, //弹出框
                alertText: null, //弹出框信息
                preventRepeat: false, //防止重复获取
                showLoading: false, //显示加载动画
                sybaseUrl: '', //服务器地址
                showLoadingToast:false,//显示loadingToast
                loadingText:'',//loadingTost 提示信息
                oprType: '',//操作类型  add 新增 edit 编辑
                wherefrom:'',//从结算过来或者从“我”过来 me-我 confirm-结算
                ptype:'',//商品类型
                showChose: false,
                showProvince: true,
                showCity: false,
                showDistrict: false,
                showCityList: false,
                showDistrictList: false,
                province: '',
                city: '',
                district: '',
                Province: false,
                City: false,
                District: false,
                GetProvinceId: 2,
    
                selected: false,
                info: [{
                    code: 310000,
                    name: '上海'
                }],
                addressData: {
                    addressId: '',
                    name: '',
                    mobile: '',
                    provinceId: '',
                    cityId: '',
                    areaId: '',
                    address: '',
                    zipcode: '',
                    identityNo: '',
                    identityFront: '',
                    identityBack: '',
                    isDefault: false,
                    productType:'0'
                }
            }
        },
        created() {
            getCityList().then(res => {
                this.info = res;
            });
            this.oprType = this.$route.query.oprtype;
            this.wherefrom=this.$route.query.from;
            this.ptype=this.$route.query.ptype;
            this.sybaseUrl = baseUrl;

        },
        mounted() {
            if (this.oprType == "edit") {
               
                if (this.choosedAddress) {
                    this.addressData = this.choosedAddress;
                    //console.log( this.addressData);
                    this.Province = this.choosedAddress.provinceName;
                    this.City = this.choosedAddress.cityName;
                    this.District = this.choosedAddress.areaName;
                    if(this.choosedAddress.isDefault==1){
                        this.addressData.isDefault=true;
                    }else{
                        this.addressData.isDefault=false;
                    }
                    // this.addressData.identityFrontRelative=this.addressData.identityFront;
                    // this.addressData.identityBackRelative=this.addressData.identityBack;
                }
    
            }else if(this.oprType == "add"&&!this.$route.query.hasDefault){
                this.addressData.isDefault=true;
            }
            //console.log(this.choosedAddress)
        },
        mixins: [getImgPath],
        components: {
            alertTip,
            loading,
            loadingToast
        },
        computed: {
            ...mapState([
                'choosedAddress'
            ]),
        },
        methods: {
    
            deleteAddr() {
                this.show = true;
                this.isEnter = true;
                this.isLeave = false;
            },
            //取消删除
            cancelDel() {
                clearTimeout(this.timer)
                this.isEnter = false;
                this.isLeave = true;
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.show = false;
                }, 200)
            },
            //确定删除
            confirmDel() {
                let me = this;
                deleteAddress({
                    addressId: this.addressData.addressId
                }).then(res => {
                    if (res.code == "1") {
                        me.$router.go(-1);
                    } else {
                        me.showAlert = true;
                        me.alertText = res.msg;
                    }
    
                }).catch(function(err) {
    
                });
                clearTimeout(this.timer)
                this.isEnter = false;
                this.isLeave = true;
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.show = false;
                }, 200)
            },
    
            //保存地址信息
            async addAddress() {
                let me = this;
                if (!me.addressData.name) {
                    
                    me.showAlert = true;
                    me.alertText = '请输入姓名'
                    
                    return;
                } else if (!me.addressData.mobile) {
                    me.showAlert = true;
                    me.alertText = '请输入电话号码';
                    return;
                } else if (!me.addressData.provinceId || !me.addressData.cityId || !me.addressData.areaId) {
                    me.showAlert = true;
                    me.alertText = '请选择地址';
                    return;
                } else if (!me.addressData.address) {
                    me.showAlert = true;
                    me.alertText = '请输入详细地址';
                    return;
                }
                if(me.addressData.isDefault){
                    me.addressData.isDefault=1;
                }else{
                    me.addressData.isDefault=0;
                }
                me.addressData.productType=me.ptype;
                me.showLoading = true;
                
                //保存成功返沪上一页，否则弹出提示框
                saveAddress(me.addressData).then(res => {
                    me.showLoading = false;
                    if (res.code == "1") {
                        //me.showAlert = true;
                        //me.alertText = "添加成功";
                        me.$router.go(-1);
                    } else {
                        me.showAlert = true;
                        me.alertText = res.msg;
                    }
                });
    
            },
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
                this.addressData.provinceId = code;
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
                this.addressData.cityId = code;
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
                this.addressData.areaId = code;
                this.district = code;
                this.District = input;
                // 选择当前添加active
                this.showDistrictList.map(a => a.selected = false);
                this.showDistrictList[index].selected = true;
                // 选取市区选项之后关闭弹层
                this.showChose = false;
            },
            districtSelected: function() {
                this.showProvince = false;
                this.showCity = false;
                this.showDistrict = true;
            },
            uploadAvatar: function(tag) {
                let me=this;
                me.showLoadingToast=true;
                me.loadingText="上传中....";
                let input1 = document.getElementById("identityFront");
                let input2 = document.getElementById("identityBack");
                let data = new FormData();
                if (tag == "1") {
                    data.append('file', input1.files[0]);
                } else {
                    data.append('file', input2.files[0]);
                }
    
                try {
                    this.$http.post(baseUrl + 'api/user/webUploadImage.msp', data).then((response) => {
                        me.showLoadingToast=false;
                        let res = response.body;
                        if (res.code == "1") {
                            if (tag == "1") {
                                this.addressData.identityFront = res.userImage;
                                this.addressData.identityFrontRelative = res.userImage;
                            } else {
                                this.addressData.identityBack = res.userImage;
                                this.addressData.identityBackRelative = res.userImage;
                            }
                        }
                        this.showAlert = true;
                        this.alertText = res.msg;
                    }, (response) => {
                        me.showLoadingToast=false;
                        this.showAlert = true;
                        this.alertText = '上传失败';
                    });
                } catch (error) {
                    me.showLoadingToast=false;
                    this.showAlert = true;
                    this.alertText = '上传失败';
                    throw new Error(error);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'addAddress';
</style>
