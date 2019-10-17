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
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload

} from 'element-ui'
// 导入时间线组件
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
    //全局挂载
Vue.prototype.$message = Message
    // 全局挂载MessageBox  （删除操作用到的）
Vue.prototype.$confirm = MessageBox.confirm