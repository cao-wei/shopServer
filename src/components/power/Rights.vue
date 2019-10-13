<template>
    <div>
        <!-- <h3>权限列表组件页面</h3> -->
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>    
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
                <!-- border 整个盒子的外部边框  stripe 隔行变色 -->
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限管理" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scoped">
                            <el-tag v-if="scoped.row.level === '0'">一级</el-tag>
                            <el-tag type="success" v-else-if="scoped.row.level === '1'">二级</el-tag>
                            <el-tag type="warning" v-else="scoped.row.level === '2'">三级</el-tag>
                    </template>
</el-table-column>
</el-table>
</el-card>
</div>
</template>

<script>
    export default {
        data() {
            return {
                // 权限列表
                rightsList: [

                ]
            }
        },
        // 生命周期
        created() {
            // 获取所有的权限
            this.getRightsList()
        },
        // 定义
        methods: {
            // 获取权限列表
            async getRightsList() {
                const {
                    data: res
                } = await this.$http.get('rights/list')

                if (res.meta.status !== 200) {
                    return this.$message.error('删除用户失败')
                }
                this.rightsList = res.data
                    // console.log(this.rightsList);

            }
        }
    }
</script>

<style lang="less" scoped>

</style>