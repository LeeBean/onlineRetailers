<template>
    <div class="order_page">
        <lazy-render :time="300">
            <div class="order_list_ul" v-if="cartList.length!=0">
                <div class="head">
                    <div class="shop_name">
                        <img v-show="checkAll" src='../../images/icon_dagou@2x.png' class="operation_icon" @click="docheckAll(0)">
                        <img v-show="!checkAll" src='../../images/icon_yuan@2x.png' class="operation_icon" @click="docheckAll(1)">
                        <img src="../../images/footer/icon_shop2.png"><span style="display: inline-block; vertical-align: top; margin-left: 10px;">{{shopname}}</span>
                    </div>
                    <div class="shop_operation"  @click="edit">
                        <span class="edit">{{editTex}}</span>
                    </div>
                </div>
                <div class="goods_content" v-load-more="loaderMore" v-for="(item,index) in cartList">
                    <div class="operation_img">
                        <img v-show="item.ischecked" src="../../images/icon_dagou@2x.png" class="operation_icon" @click="docheck(item)">
                        <img v-show="!item.ischecked" src="../../images/icon_yuan@2x.png" class="operation_icon" @click="docheck(item)">
                    </div>
                    <div class="goods_info">
                        <div class="goods_img">
                            <router-link :to="{path: '/productDetail/'+shopid+'/'+item.productId}">
                                <img v-lazy="getImgPath(item.imageUrl)">
                            </router-link>
                        </div>
                        <div class="goods_name_price">
                            <router-link :to="{path: '/productDetail/'+shopid+'/'+item.productId}">
                                <div class="goods_name" style="position: relative;">
                                    <span class="name">{{item.title}}</span>
                                    <span class="taxation">税费：预计<span>{{item.tax*10000*item.quantity*10000/100000000}}</span></span>
                                    <span v-show="editTex=='编辑'" style="font-size: 0.5rem; position: absolute; right: 0.42rem; bottom: 0;">×{{item.quantity}}</span>
                                </div>
                            </router-link>
                            <div class="goods_price">
                                <span class="unit_price">￥{{item.price}}</span>
                                <div class="goods_num" v-show="editTex=='完成'">
                                    <span class="input-number-decrement" @click="subtraction(item);">–</span>
                                    <input class="input-number" v-model="item.quantity" @focus="inputFocus(item)" @blur="inputBlur(item)"></input>
                                    <span class="input-number-increment" @click="add(item);">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<p v-show='nomore' class="empty_data">没有更多了</p>-->
                <aside class="return_top" @click="backTop" v-if="showBackStatus">
                    <svg class="back_top_svg">
            				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
            			</svg>
                </aside>
                <footer class="loader_more" v-show="preventRepeatReuqest">正在加载更多...</footer>
                <div ref="abc" style="background-color: red;"></div>
            </div>
            <div class="nocart_content" v-show="showNodata">
                <p style="text-align: center;"><img src="../../images/gouwuche@2x.png"></p>
                <div class="text">您的购物车还没有商品哦~</div>
                <router-link :to='{path: "/home/"+shopid}' class="btn">去逛逛</router-link>
            </div>
            <div class="footer" v-show="!showNodata">
                 <div class="goods_order_operation">
                    <button class="settlement" @click="goStatementOrDel()">{{bntTex}}</button>
                </div>
                <div class="goods_order_info">
                    <div class="order_goods_cost">
                        <div class="order_money" style="margin-bottom: 3px;">
                            合计:<span>￥<span id="order_money">{{totalPrice}}</span>
                            </span>
                            (含税费:<span id="order_all_meony">{{totalSprice}}</span>)
                        </div>
                        <div class="order_notes">(税费金额以提交订单是应付总额明细为准)</div>
                    </div>
                </div>
                <div class="goods_order_operation">
                    <button class="settlement" @click="goStatementOrDel()">{{bntTex}}</button>
                </div>
            </div>
            <section class="coverpart" v-if="show">
                <section class="cover-background"></section>
                <section class="cover-content " :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
                    <h2>确定删除购物车</h2>
                    <div class="sa-botton">
                        <button class="waiting" @click="ggcancelDel2">取消</button>
                        <div style="display:inline-block;">
                            <button class="quitlogin" @click="ggconfirmDel2">删除</button>
                        </div>
                    </div>
                </section>
            </section>
        </lazy-render>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <!--<foot-guide :storeId="shopid"></foot-guide>-->
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import headTop from 'src/components/header/head'
    import loading from 'src/components/common/loading'
    import {
        loadMore,
        getImgPath
    } from 'src/components/common/mixin'
    import {
        showBack,
        animate
    } from 'src/config/mUtils'
    import {
        cartLists,
        addNumCart,
        deleteCart,
        cartCheck
    } from 'src/service/getData'
    import footGuide from 'src/components/footer/footGuide'
    import alertTip from 'src/components/common/alertTip'
    
    export default {
        data() {
            return {
                shopid: '',
                offset: 0,
                show: false, //显示确认提示框
                showAlert: false, //弹出框
                alertText: null, //弹出框信息
                preventRepeat: false, //防止重复获取
                showLoading: false, //显示加载动画
                cartList: [], //购物车列表
                ischeckdate: [], //获取选项框数据
                checkAll: true, //全选
                totalPrice: 0, //总价格
                totalSprice: 0, //总税费
                tempNum: 1, //某件商品原数量
                bntTex: '结算',
                editTex: '编辑',
                shopname: '',
                showNodata: false, //是否显示购物车空
                showBackStatus: false, //显示返回顶部按钮
                preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
                nomore: false, //没有更多啦
                pram: {
                    id: '',
                    pagesize: 20,
                    pageidx: 1
                }, //数据请求参数
                addcartpram: {
                    storeId: '',
                    productId: '',
                    num: 1,
                    isFromCartList: true,
                }, //购物车商品数量修改请求参数
                confirmpram: {
                    cartIds: '',
                    storeId: ''
                }
            }
        },
        created() {
            this.showLoading = true;
            this.shopid = this.$route.query.shopid;
            this.pram.id = this.shopid;
            this.addcartpram.storeId = this.shopid;
            this.confirmpram.storeId = this.shopid;
        },
        mounted() {
            let me = this;
            cartLists(me.pram).then(res => {
                if (res.cartList.length == 0) {
                    this.showNodata = true;
                    this.showLoading = false;
                    return;
                }
                this.cartList = res.cartList;
                this.shopname = res.storeName;
                this.calculation();
                this.showLoading = false;
                //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
                showBack(status => {
                    this.showBackStatus = status;
                });
            }).catch(function(err) {
                this.showLoading = false;
            });
        },
        mixins: [loadMore, getImgPath],
        components: {
            headTop,
            footGuide,
            loading,
            alertTip
        },
        computed: {
    
        },
        methods: {
            ...mapMutations([
                'SAVE_CART_ID'
            ]),
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
                        me.cartList = [...this.cartList, ...res.cartList];;
                        me.preventRepeatReuqest = false;
                        if (res.cartList < 20) {
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
            //去结算页面或者删除
            goStatementOrDel() {
                let me = this;
                var cartIds = "";
                this.cartList.forEach(item => {
                    if (item.ischecked) {
                        cartIds += item.cartId + ",";
                    }
                });
                this.confirmpram.cartIds = cartIds.substring(0, cartIds.length - 1);
                if (this.bntTex == "结算") {
                    this.showLoading = true;
                    if (this.confirmpram.cartIds != "") {
                        cartCheck(this.confirmpram).then(res => {
                            me.showLoading = false;
                            if (res.code == "1") {
                                this.SAVE_CART_ID(this.confirmpram.cartIds);
                                me.$router.push({
                                    path: '/confirmOrder',
                                    query: {
                                        shopid: me.shopid
                                    }
                                });
                            } else {
                                me.showAlert = true;
                                me.alertText = res.msg;
                            }
    
                        }).catch(function(err) {
                            me.showLoading = false;
                        });
                    } else {
                        me.showLoading = false;
                        me.showAlert = true;
                        me.alertText = "请选择需要结算的商品！";
                    }
                } else { //删除购物车
                    this.show = true;
                    this.isEnter = true;
                    this.isLeave = false;
                }
    
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
                deleteCart({
                    storeId: me.shopid,
                    cartIds: me.confirmpram.cartIds
                }).then(res => {
                    if (res.code == "1") {
                        window.location.reload();
                    } else {
                        me.showAlert = true;
                        me.alertText = res.msg;
                    }

                }).catch(function(err) {
                    me.showLoading = false;
                });
            },
            docheckAll(i) {
                if (i == 0) {
                    this.checkAll = false;
                    this.cartList.forEach(item => {
                        item.ischecked = false;
                    })
                    this.totalPrice = 0;
                    this.totalSprice = 0;
                } else {
                    this.checkAll = true;
                    this.cartList.forEach(item => {
                        item.ischecked = true;
                        //计算总价 和总税费
                        this.totalPrice += (item.price * item.quantity);
                        this.totalSprice += (item.tax * item.quantity);
                    })
                    this.totalPrice = this.totalPrice.toFixed(2);
                    this.totalSprice = this.totalSprice.toFixed(2);
                }
    
            },
            docheck(item) {
                item.ischecked = !item.ischecked;
                this.checkIsAll();
                //计算总价 和总税费
                this.calculation();
            },
            //数量减
            subtraction(item) {
                if (item.quantity > 1) {
                    item.ischecked = true;
                    this.tempNum = item.quantity;
                    //item.quantity -= 1;
                    item.quantity = Number(item.quantity) - 1;
                    this.checkIsAll();
                    this.calculation();
                    //保存数量
                    this.addcartpram.num = item.quantity;
                    this.addcartpram.productId = item.productId;
                    this.doAddNumCart(item);
                }
            },
            //数量加
            add(item) {
                //if (item.quantity < item.stockNumber) { //小于库存
                    if (item.productType == '2' && item.quantity >= 20) { //跨境商品不能超过20个
                        this.showAlert = true;
                        this.alertText = '加入购物车的跨境商品数量最大不可超过20个!'
                        return;
                    }
                    item.ischecked = true;
                    this.tempNum = item.quantity;
    
                    item.quantity = Number(item.quantity) + 1;
                    this.checkIsAll();
                    this.calculation();
                    //保存数量
                    this.addcartpram.num = item.quantity;
                    this.addcartpram.productId = item.productId;
    
                    this.doAddNumCart(item);
                // } else {
                //     this.showAlert = true;
                //     this.alertText = '此商品暂无库存！'
                // }
    
            },
            //检查是否已经全选了
            checkIsAll() {
                //不能使用forEach  因为无法跳出循环
                for (var i = 0; i < this.cartList.length; i++) {
                    if (!this.cartList[i].ischecked) {
                        this.checkAll = false;
                        break;
                    } else {
                        this.checkAll = true;
                    }
                }
            },
            //计算税费和总价
            calculation() {
                this.totalPrice = 0;
                this.totalSprice = 0;
                this.cartList.forEach(item => {
                    if (item.ischecked) {
                        this.totalPrice += (item.price * item.quantity);
                        this.totalSprice += (item.tax * item.quantity);
                    }
                })
                this.totalPrice = this.totalPrice.toFixed(2);
                this.totalSprice = this.totalSprice.toFixed(2);
            },
            //编辑或者完成
            edit() {
                if (this.editTex == "编辑") {
                    this.editTex = "完成";
                    this.bntTex = '删除';
                    //this.totalPrice = 0;
                    //this.totalSprice = 0;
                } else {
                    this.editTex = "编辑";
                    this.bntTex = '结算';
                    this.calculation();
                }
    
            },
            //获取焦点时临时保存该商品的数量
            inputFocus(item) {
                this.tempNum = item.quantity;
            },
            //商品数量框失去焦点
            inputBlur(item) {
                //console.log(this.tempNum);
                ///if (item.quantity < item.stockNumber) { //小于库存
                if (item.productType == '2' && item.quantity > 20) { //跨境商品不能超过20个
                    this.showAlert = true;
                    this.alertText = '加入购物车的跨境商品数量最大不可超过20个!'
                    item.quantity = this.tempNum;
                    return;
                }
                item.ischecked = true;
                this.checkIsAll();
                this.calculation();
                //保存数量
                this.addcartpram.num = item.quantity;
                this.addcartpram.productId = item.productId;
                this.doAddNumCart(item);
                // } else {
                //     item.quantity = this.tempNum;
                //     this.showAlert = true;
                //     this.alertText = '此商品暂无库存！'
                // }
            },
            //添加购物车或者修改购物车商品数量
            doAddNumCart(item) {
                addNumCart(this.addcartpram).then(res => {
                    if (res.code == "1") { //成功
    
                    } else {
                        item.quantity = this.tempNum;
                        this.showAlert = true;
                        this.alertText = res.msg;
                    }
                });
            }
        },
        watch: {
            // 监听全选 
            //  checkAll:function (value){
            //     if(value){
            //          this.cartList.forEach(item => {
            //            item.ischecked=true;
            //         })
            //     }else{
            //          this.cartList.forEach(item => {
            //            item.ischecked=false;
            //         })
            //     }
            // }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @import 'cart';
</style>
