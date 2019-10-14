// 入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入阿里字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入插件 vue-table-with
import TreeTale from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 为axios设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 设置axios请求拦截器
axios.interceptors.request.use(config => {
        // console.log(config);
        // 为每一请求挂载了一个Authorization的请求头，这样那些有权限的api就可以调用成功了
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须要 return config
        return config

    })
    // 把包挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false
    // 注册成全局可用的组件
Vue.component('tree-table', TreeTale)
new Vue({
    router, //挂载路由
    render: h => h(App)
}).$mount('#app')