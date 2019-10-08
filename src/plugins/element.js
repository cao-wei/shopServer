// 按需导入的项目中需要用到的组件
import Vue from 'vue'
// import { Button } from 'element-ui'
// // {}里面的内容是按需导入
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹出框提示组件
// import { Message } from 'element-ui'

// 简化合并代码
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 注册成全局可以的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    //全局挂载
Vue.prototype.$message = Message