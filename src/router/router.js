import App from '../App'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const innerPage = r => require.ensure([], () => r(require('../page/home/children/innerPage')), 'innerPage')
const search = r => require.ensure([], () => r(require('../page/search/search')), 'search')
const type = r => require.ensure([], () => r(require('../page/type/type')), 'search')
const productSearch = r => require.ensure([], () => r(require('../page/productSearch/productSearch')), 'productSearch')
const cart = r => require.ensure([], () => r(require('../page/cart/cart')), 'cart')
const profile = r => require.ensure([], () => r(require('../page/profile/profile')), 'profile')
const productDetail = r => require.ensure([], () => r(require('../page/productDetail/productDetail')), 'productDetail')
const order = r => require.ensure([], () => r(require('../page/order/order')), 'order')
const orderDetail = r => require.ensure([], () => r(require('../page/order/children/orderDetail')), 'orderDetail')
const logistics = r => require.ensure([], () => r(require('../page/order/children/logistics')), 'logistics')
const confirmOrder = r => require.ensure([], () => r(require('../page/confirmOrder/confirmOrder')), 'confirmOrder')
const chooseAddress = r => require.ensure([], () => r(require('../page/confirmOrder/children/chooseAddress')), 'chooseAddress')
const addAddress = r => require.ensure([], () => r(require('../page/confirmOrder/children/children/addAddress')), 'addAddress')
const service = r => require.ensure([], () => r(require('../page/service/service')), 'service')


export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/home/1'
        },
        //首页城市列表页
        {
            path: '/home/:shopid',
            component: home

        },
        //首页内页
        {
            path: '/innerPage',
            component: innerPage,
        },
        //搜索页
        {
            path: '/search',
            component: search
        },
        //分类页
        {
            path: '/type',
            component: type
        },
        //商品搜索
        {
            path: '/productSearch',
            component: productSearch
        },
        //购物车
        {
            path: '/cart',
            component: cart
        },
        //个人信息页
        {
            path: '/profile',
            component: profile
        },

        //商品详情
        {
            path: '/productDetail/:shopid/:productid',
            component: productDetail
        },
        //订单列表页
        {
            path: '/order',
            component: order,
        },
        //物流信息
        {
            path: '/logistics',
            component: logistics

        },
        //订单详情页
        {
            path: '/orderDetail',
            component: orderDetail,
        },


        //确认订单页
        {
            path: '/confirmOrder',
            component: confirmOrder
        },
        //选择地址
        {
            path: '/chooseAddress',
            component: chooseAddress
        },
        //添加地址
        {
            path: 'addAddress',
            component: addAddress
        },
        //售后
        {
            path: 'service',
            component: service
        }

    ]
}]