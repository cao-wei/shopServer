import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
// 导入home
import Home from './components/Home.vue'
// 导入welcome
import Welcome from './components/Welcome.vue'
// 导入users 路径
import Users from './components/user/Users.vue'
// 导入rights 权限列表路径
import Rights from './components/power/Rights.vue'
// 导入roles 权限管理 角色列表
import Roles from './components/power/Roles.vue'
// 导入goods 商品列表
import Goods from './components/goods/Goods.vue'
// 导入Params 分类参数
import Params from './components/goods/Params.vue'
// 导入categories 商品分类
import Categories from './components/goods/Categories.vue'
// 导入Orders 订单管理 列表
import Orders from './components/management--ddgl/Orders.vue'
// 导入全局样式表
import './assets/css/global.css'


Vue.use(Router)

const router = new Router({
        // 定义路由规则
        routes: [
            // 路由重定向
            { path: '/', redirect: '/login' }, // 如果访问的是 / 就通过redirect属性跳转到/login页面
            { path: '/login', component: Login },
            // home页面 再数组中放子路由  welcome
            {
                path: '/home',
                component: Home,
                // 登录成功之后重定向到/welcome
                redirect: '/welcome',
                children: [{ path: '/welcome', component: Welcome },
                    { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/goods', component: Goods },
                    { path: '/params', component: Params },
                    { path: '/categories', component: Categories },
                    { path: '/orders', component: Orders }
                ]
            }


        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to  将要访问的路径
    // from   代表从哪个路径跳转而来
    // next   是一个函数  代表放行
    // next()  放行    next('/login')  强制跳转
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})


// 向外暴露
export default router