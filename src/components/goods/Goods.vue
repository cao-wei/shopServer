<template>
    <div>
        <!-- <h3>商品管理--商品列表</h3> -->
         <!-- 面包屑导航区域 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>    
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
                <!-- :gutter="20"  两者间的间距 20像素 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 实现搜索功能  -->
                    <!--   clearable  清空按钮 /点击清空按钮后 触发@clear="getGoodsList"事件  重新获取数据 -->
                        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                        </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table 表格区域 -->
            <!-- border 边框 stripe隔行变色 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="90px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        <!-- 时间 -->
                        {{scope.row.add_time | dateFormat}}
                    </template>>
</el-table-column>
<el-table-column label="操作" width="130px">
    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                   </template>
</el-table-column>
</el-table>
<!-- 分页区域-->
<!-- background 背景 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
</el-pagination>

</el-card>
</div>
</template>

<script>
    export default {
        data() {
            return {
                //查询参数对象
                queryInfo: {
                    query: '',
                    // 页数
                    pagenum: 1,
                    // 条数
                    pagesize: 10
                },
                // 定义  商品列表
                goodslist: [],
                //总数居条数  用来实现分页
                total: 0
            }
        },
        // 生命周期函数
        created() {
            // 定义
            this.getGoodsList()

        },
        methods: {
            //根据分页获取对应的商品列表
            async getGoodsList() {
                const {
                    data: res
                } = await this.$http.get('goods', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败！')
                }
                this.$message.success('获取商品列表成功！')
                console.log(res.data);
                // 把res.data.goods 赋值  this.goodslist
                this.goodslist = res.data.goods
                    // 把res.data.total  赋值  this.total
                this.total = res.data.total
            },
            // 定义  分页
            handleSizeChange(newSize) {
                // 把 newSize 赋值给 this.queryInfo.pagesize
                this.queryInfo.pagesize = newSize
                    // 重新获取数据
                this.getGoodsList()
            },
            // 当前的页码值
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            //根据商品的id删除对应的数据
            async removeById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除操作！')
                }
                const {
                    data: res
                } = await this.$http.delete(`goods/${id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除商品失败！')
                }
                this.$message.success('删除商品成功！')
                    // // 重新刷新列表
                this.getGoodsList()
            },
            // 点击添加商品按钮 
            goAddPage() {
                // 通过 $router路由  访问 goods下面的add文件
                this.$router.push('/goods/add')
            }


        }

    }
</script>