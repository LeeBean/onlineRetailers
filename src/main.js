import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import VueResource from 'vue-resource'
import LazyRender from 'vue-lazy-render'
// import YDUI from 'vue-ydui';
// import 'vue-ydui/dist/ydui.rem.css';
import { routerMode } from './config/env'
import { getImgPath } from './components/common/mixin'
import './config/rem'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueLazyload, {
    loading: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExUReXk5JUmPxgAAAAcSURBVFjD7cGBAAAAAMOg+VNf4QBVAQAAAAB8BhRQAAEAnyMVAAAAAElFTkSuQmCC'
});
Vue.use(LazyRender)
    // Vue.use(YDUI);
const router = new VueRouter({
    routes,
    mode: routerMode,
    strict: process.env.NODE_ENV !== 'production'
})


new Vue({
    router,
    store
}).$mount('#app')