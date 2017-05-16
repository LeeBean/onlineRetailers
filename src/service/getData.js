import { baseUrl } from '../config/env'
import { getJSON } from '../config/mUtils'
import * as city from './tempdata/city'

/**
 * 创建临时数据
 */
const setpromise = data => {
    return new Promise((resolve, reject) => {
        resolve(data)
    })
};
/**
 * 获取首页数据
 */
var homeDatas = (shopId) => getJSON('POST', 'wap/home', {
    id: shopId
});
/**
 * 获取内页数据
 */
var pageView = (id) => getJSON('POST', 'wap/pageView', {
    id: id
});
/**
 * 商品分组
 */
var groupView = (id) => getJSON('POST', 'wap/groupView', {
    id: id
});
/**
 * 获取商品列表
 */
var goodsLists = (ob) => getJSON('GET', 'productPageList', ob);
/**
 * 获取商品一级分类
 */
var getCategoryList = () => getJSON('GET', 'productCategoryList');
/**
 * 获取购物车列表
 */
var cartLists = (ob) => getJSON('GET', 'cartList', ob);
/**
 * 添加购物车或者修改购物车商品数量
 */
var addNumCart = (ob) => getJSON('POST', 'wap/addNumCart', ob);
/**
 * 删除购物车
 */
var deleteCart = (ob) => getJSON('POST', 'api/cart/deleteCart', ob);
/**
 * 购物车结算校验
 */
var cartCheck = (ob) => getJSON('POST', 'api/order/checkCart', ob);
/**
 * 购物车结算 立即购买
 */
var orderCheckDetail = (ob) => getJSON('GET', 'orderCheckDetail', ob);
/**
 * 我的地址列表
 */
var addressList = (ob) => getJSON('GET', 'addressList', ob);
/**
 * 保存地址
 */
var saveAddress = (ob) => getJSON('POST', 'api/address/saveAddress', ob);
/**
 * 删除地址
 */
var deleteAddress = (ob) => getJSON('POST', 'api/address/deleteAddress', ob);
/**
 * 订单列表
 */
var orderList = (ob) => getJSON('GET', 'orderList', ob);
/**
 * 订单详情
 */
var orderDetail = (ob) => getJSON('GET', 'orderDetail', ob);
/**
 * 删除订单
 */
var deleteOrder = (ob) => getJSON('POST', 'api/order/deleteOrder', ob);
/**
 * 取消订单
 */
var cancelOrder = (ob) => getJSON('POST', 'api/order/cancelOrder', ob);
/**
 * 确认收货
 */
var queryTake = (ob) => getJSON('POST', 'wap/queryTake', ob);
/**
 * 商品详情
 */
var productDetail = (ob) => getJSON('GET', 'productDetail', ob);
/**
 * 获取用户信息
 */
var userInfo = (ob) => getJSON('GET', 'userInfo', ob);
/**
 * 计算运费
 */
var getPostage = (ob) => getJSON('POST', 'api/product/getPostage', ob);
/**
 * 确认订单
 */
var orderConfrim = (ob) => getJSON('POST', 'api/order/orderConfrim', ob);
/**
 * 确认购买 /立即购买
 */
var checkBuy = (ob) => getJSON('POST', 'wap/checkBuy', ob);
/**
 * 支付接口
 */
var orderPay = (ob) => getJSON('POST', 'api/pay/orderPay', ob);
/**
 * 查看物流
 */
var orderPackageList = (ob) => getJSON('GET', 'orderPackageList', ob);
/**
 * 获取城市列表
 */
var getCityList = () => setpromise(city.city);
// var getCityList = () => getJSON('GET', 'regionList', {
//     lastTime: ''
// });

export {
    homeDatas,
    pageView,
    groupView,
    getCityList,
    getCategoryList,
    goodsLists,
    cartLists,
    addNumCart,
    deleteCart,
    cartCheck,
    orderCheckDetail,
    checkBuy,
    addressList,
    saveAddress,
    deleteAddress,
    orderList,
    orderDetail,
    deleteOrder,
    cancelOrder,
    queryTake,
    productDetail,
    userInfo,
    getPostage,
    orderConfrim,
    orderPay,
    orderPackageList
}