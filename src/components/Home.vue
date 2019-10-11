<template>
    
    <el-container class="header-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <!-- :width="isCollapse ? '64px' : '200px'"  用三元表达式判断 侧边栏宽度折叠为64像素 否则200像素 -->
          <el-aside :width="isCollapse ? '64px' : '200px'">
              <!-- 收缩/展开 -->
              <div class="toggle-button" v-on:click="toggleCollapse">|||</div>
              <!-- 侧边栏菜单区域 -->
              <!-- 让侧边栏同时只展开一个 是true   false 是同时可以展开多个 :unique-opened="true"   默认是true  -->
              <!-- :collapse="isCollapse"  布尔值 左侧边栏得折叠效果 isCollapse 是动态添加得 -->
              <!-- :collapse-transition="false"  折叠效果动画   false 是没动画 -->
              <!-- :router="true"  为侧边栏开启路由模式 -->
              <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                <!-- 一级菜单 -->
                <!-- :index="item.id + ''"   解决点击一个侧边栏时同时展开多个的问题-->
                <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                    <!-- 一级菜单得模板区域 -->
                  <template slot="title">
                      <!-- 图标 -->
                    <i :class="iconsObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                   </template>
<!-- 二级菜单 -->
<!-- index属性当作跳转得地址   地址就是subItem.path  因为path没有以斜线开头  所有再前面手动加上 '/' -->
<el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
    <template slot="title">
                <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
</el-menu-item>
</el-submenu>

</el-menu>
</el-aside>
<!-- 右侧边栏 -->
<el-main>
    <!-- 路由占位符 -->
    <router-view></router-view>
</el-main>
</el-container>
</el-container>
</template>
<script>
    export default {
        // 定义组件的私有数据
        data() {
            return {
                //左侧菜单数据
                menulist: [],
                // 定义一个字体图标对象
                iconsObj: {
                    '125': 'iconfont icon-users',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                //定义布尔值   是否折叠  false 代表不折叠
                isCollapse: false,
                // 被激活得链接地址
                activePath: ''
            }
        },
        // 定义生命周期函数
        created() {
            // 调用getMenuList 来获取所有的左侧菜单
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')


        },
        methods: {
            // 退出
            logout() {
                // 清空sessionStorage
                window.sessionStorage.clear();
                // 重定向到登录页面
                this.$router.push("/login");
            },
            // 定义函数 获取所有的菜单
            async getMenuList() {
                // 解构赋值
                const {
                    data: res
                } = await this.$http.get('menus')
                    // 判断   如果失败  就显示错误信息
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                    // 成功
                this.menulist = res.data
                console.log(res);
            },
            // 点击按钮，切换菜单得折叠与展开效果
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            // 保存连接得激活状态
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                    // 为activePath 重新赋值
                this.activePath = activePath
            }
        }
    };
</script>
<style lang="less" scoped>
    .header-container {
        height: 100%;
    }
    
    .el-header {
        background-color: #373D41;
        /* flex布局 */
        display: flex;
        /* 左右贴边对其 */
        justify-content: space-between;
        /* 让左边贴边对其 */
        padding-left: 0;
        /* 垂直方向居中对齐 */
        align-items: center;
        color: #fff;
        font-size: 20px;
        >div {
            display: flex;
            /* 垂直方向居中对齐 */
            align-items: center;
            /* 让头部文字向左移动20像素 */
            span {
                margin-left: 20px;
            }
        }
    }
    
    .el-aside {
        background-color: #333744;
        .el-menu {
            /* 让侧边栏边框等于0像素(或溢出隐藏)  不让它突出显示 */
            border-right: 0;
            /* overflow: hidden; */
        }
    }
    
    .el-main {
        background-color: #EAEDF1;
    }
    
    .iconfont {
        /* 让侧边栏的字体图标跟标题之间有10像素的间距 */
        margin-right: 10px;
    }
    
    .toggle-button {
        background-color: #4A5064;
        text-align: center;
        color: #fff;
        line-height: 24px;
        font-size: 10px;
        /* 字间距 */
        letter-spacing: 0.2em;
        /* 鼠标移入时变成小手 */
        /* cursor: pointer; */
        cursor: pointer;
    }
</style>