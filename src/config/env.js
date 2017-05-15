/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
let baseUrl = 'http://192.168.10.82:8080/';
let baseUrl2 = 'http://192.168.10.82:8080/wap/index.html?a=v1/';
const imgBaseUrl = 'http://www.jikeduo.com.cn/upload/';


let routerMode;
if (process.env.NODE_ENV == 'development') {
    // baseUrl = 'http://192.168.10.33:8080/';
    routerMode = 'hash'
} else {
    //baseUrl = '';
    routerMode = 'hash'
}

export {
    baseUrl,
    baseUrl2,
    routerMode,
    imgBaseUrl
}