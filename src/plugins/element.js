// 按需导入的项目中需要用到的组件
import Vue from 'vue'
// import { Button } from 'element-ui'
// // {}里面的内容是按需导入
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹出框提示组件
// import { Message } from 'element-ui'
// {}里面的内容是按需导入
// 简化合并代码
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox

} from 'element-ui'
// 注册成全局的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
    //全局挂载
Vue.prototype.$message = Message
    // 全局挂载MessageBox  （删除操作用到的）
Vue.prototype.$confirm = MessageBox.confirm