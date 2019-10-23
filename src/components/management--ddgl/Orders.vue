<template>
    <div>
        <!-- <h3>订单管理--订单列表</h3> -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item> 
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
        <el-row>
        <el-col :span='8'>
         <!--  搜索框 -->
         <el-input placeholder='请输入内容'>
        <el-button slot='append' icon='el-icon-search'></el-button>
         </el-input>
        </el-col>
        <el-col :span='4'>
         </el-col>
         </el-row>
         <!-- 订单列表数据 -->
         <!-- 用户列表区域  -->
        <el-table :data="orderlist" border stripe> 
                <!-- 加上index是列表的索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="400px"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else="scope.row.pay_status === '0'">未付款</el-tag>
                    </template>
</el-table-column>
<el-table-column label="是否发货" prop="is_send" width="105px">
    <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_send === '1'">是</el-tag>
                <el-tag type="danger" v-else="scope.row.is_send === '0'">否</el-tag>
            </template>
</el-table-column>
<el-table-column label="下单时间" prop="create_time" width="240px">
    <!-- 调用钩子函数   格式化时间操作 -->
    <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
</el-table-column>
<el-table-column label="操作" width="150px">
    <!-- <template slot-scope="scope"> -->
    <template>
        <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
        <!-- 查看物流进度按钮 -->
        <el-button type="success" icon="el-icon-location-information" size="mini" @click="showProgressBox"></el-button>
    </template>
</el-table-column>
</el-table>
<!-- 分页区域 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 6, 9, 12]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</el-card>
<!-- 修改地址的对话框 -->
<el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
            <!-- options 用来指定数据源     //  clearable  清空按钮 -->
            <el-cascader :options="cityData" v-model="addressForm.address1" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2" clearable>
            <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 展示物流进度的对话框 -->
<el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
    <!-- item 时间线 -->
    <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
            {{activity.context}}
        </el-timeline-item>
    </el-timeline>
</el-dialog>
</div>
</template>

<script>
    //  导入省市区/县的文件
    import cityData from './citydata'
    export default {
        data() {
            return {
                // 查询对象
                queryInfo: {
                    query: '',
                    // 当前页码
                    pagenum: 1,
                    // 每页显示条数
                    pagesize: 10
                },
                total: 0, //总数据条数
                // 订单列表
                orderlist: [],
                //隐藏修改地址的对话框
                addressVisible: false,
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1: [{
                        required: true,
                        message: '请选择省市区/县',
                        trigger: 'blur',
                    }],
                    address2: [{
                        required: true,
                        message: '请添写详细地址',
                        trigger: 'blur',
                    }]
                },
                //省市区/县
                cityData: cityData,
                //物流进度
                progressVisible: false,
                //物流信息
                progressInfo: []
            }
        },
        // 生命周期
        created() {
            this.getOrderList()
        },
        // 定义  事件处理函数
        methods: {
            async getOrderList() {
                const {
                    data: res
                } = await this.$http.get('orders', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取订单列表失败！')
                }
                console.log(res);
                this.total = res.data.total
                this.orderlist = res.data.goods

            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            //页码值
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            // 展示修改地址的对话框
            showBox() {
                //展示修改地址的对话框
                this.addressVisible = true
            },
            //监听  只要 addressDialogClosed 关闭了 就清空 addressFormRef  
            addressDialogClosed() {
                // 通过 resetFields 清空表单
                this.$refs.addressFormRef.resetFields()
            },
            // 定义 点击物流进度事件的按钮时  展示出对应的对话框
            async showProgressBox() {
                const {
                    data: res
                } = await this.$http.get('/kuaidi/804909574412544580')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取物流信息失败！')
                }
                this.$message.success('获取物流信息成功！')
                this.progressInfo = res.data
                    // 点击按钮时  展现出对话框
                this.progressVisible = true
                console.log(this.progressInfo);

            }
        }
    }
</script>
<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
    /* 导入物流进度时间线的 css样式 */
    
    @import '../../plugins/timeline/timeline.css';
    @import '../../plugins/timeline-item/timeline-item.css';
</style>