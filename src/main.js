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

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        // savedPosition is only available for popstate navigations.
        return savedPosition
    } else {
        const position = {}
            // new navigation.
            // scroll to anchor by returning the selector
        if (to.hash) {
            position.selector = to.hash
        }
        // check if any matched route config has meta that requires scrolling to top
        if (to.matched.some(m => m.meta.scrollToTop)) {
            // cords will be used if no selector is provided,
            // or if the selector didn't match any element.
            position.x = 0
            position.y = 0
        }
        // if the returned position is falsy or an empty object,
        // will retain current scroll position.
        return position
    }
}
const router = new VueRouter({
    routes,
    mode: routerMode,
    //mode: 'history',
    //hashbang: false,
    //history: true,
    //scrollBehavior,
    strict: process.env.NODE_ENV !== 'production'
})


new Vue({
    router,
    store
}).$mount('#app')