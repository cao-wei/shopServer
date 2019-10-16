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
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles  导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
    // 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
    // 通过钩子函数  注册一个全局过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
        //  年
    const y = dt.getFullYear()
        // 月  月是从0开始的  所以需要加1  让它变成字符串  同时不足2位时  用0 来填补 
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        // 日  让它变成字符串  同时不足2位时  用0 来填补 
    const d = (dt.getDate() + '').padStart(2, '0')
        //  时  让它变成字符串  同时不足2位时  用0 来填补 
    const hh = (dt.getHours() + '').padStart(2, '0')
        //  分  让它变成字符串  同时不足2位时  用0 来填补 
    const mm = (dt.getMinutes() + '').padStart(2, '0')
        //  秒  让它变成字符串  同时不足2位时  用0 来填补 
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router, //挂载路由
    render: h => h(App)
}).$mount('#app')