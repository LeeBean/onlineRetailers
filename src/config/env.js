/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
// let baseUrl = 'http://192.168.10.39:8080/';
// let baseUrl2 = 'http://192.168.10.39:8080/wap/index.json?a=v1/';
// const imgBaseUrl = 'http://test.uzengroup.com/upload/';

// let baseUrl = 'http://loaclhost:8080/';
// let baseUrl2 = 'http://loaclhost:8080/wap/index.json?a=v1/';
// const imgBaseUrl = 'http://test.uzengroup.com/upload/';

let baseUrl = '/';
let baseUrl2 = '/wap/index.json?a=v1/';
const imgBaseUrl = 'http://test.uzengroup.com/upload/';

let rootPath = '/wap';
let routerMode;
if (process.env.NODE_ENV == 'development') {
    routerMode = 'hash'
} else {
    routerMode = 'hash'
}

export {
    baseUrl,
    baseUrl2,
    routerMode,
    imgBaseUrl,
    rootPath
}