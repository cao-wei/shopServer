import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
// 导入home
import Home from './components/Home.vue'
// 导入welcome
import Welcome from './components/Welcome.vue'
// 导入users 路径
import Users from './components/user/Users.vue'
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
                    { path: '/users', component: Users }
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