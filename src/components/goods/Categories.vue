<template>
        <div>
                <!-- <h3>商品管理--商品分类</h3> -->
            <!-- 面包屑导航区域 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品分类</el-breadcrumb-item>    
            </el-breadcrumb>
            <!-- 卡片视图区域 -->
            <el-card>
                <el-row>
                    <el-col>
                        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                    </el-col>
                </el-row>
                <!-- 表格 -->
                <!-- :data="catelist"  是数据源 /   :selection-type="false" 等于false  是取消前面的复选框 /  :expand-type="false"  等于 false 是取消前面的展开行图标  / show-index 在前面加上索引列序号  -->
                <!-- index-text="#" 是将tatle上面的序号重置为 # / border 加上边框线  /  show-row-hover="true"  如果要想去掉鼠标移入时的高亮，就加上这一句话-->
                <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
                    <!-- 自定义插槽 -->
                    <!-- 是否有效 -->
                    <template slot="isok" slot-scope="scope">
                        <!-- 小图标 -->
                        <!-- 判断  如果 cat_deleted 等于 false 就显示对勾  否则显示错误× -->
                        <i class="el-icon-success" 
                        v-if="scope.row.cat_deleted === false" style="color: yellowgreen;"></i>
                        <i class="el-icon-error" v-else style="color: red;"></i>
                    </template>
<!-- 排序 -->
<template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
    </template>
<!-- 操作 -->
<template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
    </template>
</tree-table>

<!-- 分页区域 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 6, 9, 12]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>

</el-card>
<!-- 添加分类的对话框 -->
<el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
    <!-- 添加分类的表单 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
            <!-- options 用来指定数据源   //  props 用来指定配置对象 -->
            <el-cascader :options="parentCateList" :props="expandTrigger" v-model="selectedKeys" @change="parentCateChanged" clearable></el-cascader>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
  <el-button @click="addCateDialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="addCate">确 定</el-button>
</span>
</el-dialog>
</div>
</template>
<!-- 行为区域 -->
<script>
    export default {
        data() {
            // 定义  当前所有的数据
            return {
                // 分页  查询条件
                querInfo: {
                    // 3级分类
                    type: 3,
                    // 当前页
                    pagenum: 1,
                    // 显示的页数
                    pagesize: 5
                },
                // 商品分类的数据列表，默认为空
                catelist: [],
                // 总数据条数
                total: 0,
                // 为table指定列的定义
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                }, {
                    label: '是否有效',
                    // 将当前列定义为模板列
                    type: 'template',
                    //  表示当前这一列使用模板名称
                    template: 'isok'
                }, {
                    label: '排序',
                    // 将当前列定义为模板列
                    type: 'template',
                    //  表示当前这一列使用模板名称
                    template: 'order'
                }, {
                    label: '操作',
                    // 将当前列定义为模板列
                    type: 'template',
                    //  表示当前这一列使用模板名称
                    template: 'opt'
                }, ],
                // 控制添加分类对话框的显示与隐藏
                addCateDialogVisible: false,
                // 添加分类的表单数据对象
                addCateForm: {
                    // 将要添加分类的名称
                    cat_name: '',
                    // 父级分类的id
                    cat_id: 0,
                    // 分类的等级，默认要添加的是1级分类
                    cat_level: 0

                },
                // 添加分类表单的验证规则对象
                addCateFormRules: {
                    cat_name: [{
                        required: true,
                        message: '请输入分类的名称',
                        trigger: 'blur'
                    }]
                },
                //父级分类的列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                expandTrigger: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    // expandTrigger: 'hover'   expandTrigger这个不能改变，是自带的
                    expandTrigger: 'hover',
                    // 前面的选择框按钮
                    checkStrictly: 'true'

                },
                // 选中的父级分类的id数组
                selectedKeys: []
            }
        },
        // 生命周期函数
        created() {
            this.getCateList()
        },
        // 定义事件处理函数
        methods: {
            // 获取商品分类数据    发起 http请求
            async getCateList() {
                const {
                    data: res
                } = await this.$http.get('categories', {
                    params: this.querInfo
                })
                if (res.meta.status !== 200) {
                    this.$message.error('获取商品分类失败！')
                }
                // console.log(res.data);
                // this.$message.success('获取商品分类成功！')
                // 把数据列表，赋值给catelist
                this.catelist = res.data.result
                    // 为总数据条数赋值
                this.total = res.data.total

            },
            // 监听pagesize（显示的页数）的改变 分页
            handleSizeChange(newSize) {
                // 为 this.querInfo.pagesize赋值
                this.querInfo.pagesize = newSize
                    // 重新刷新数据
                this.getCateList()
            },
            // 监听pagenum（当前页）的改变  
            handleCurrentChange(newPage) {
                // 为 this.querInfo.pagenum 赋值
                this.querInfo.pagenum = newPage
                    // 重新刷新数据
                this.getCateList()
            },
            // 点击确认按钮，展示出添加分类的对话框
            showAddCateDialog() {
                // 先获取父级分类的数据列表
                this.getParentCateList()
                    // 展示对话框
                this.addCateDialogVisible = true
            },
            //获取父级分类的数据列表
            async getParentCateList() {
                const {
                    data: res
                } = await this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级分类数据失败')
                }
                console.log(res.data);
                this.parentCateList = res.data


            },
            // 选择项发生变化触发这个函数
            parentCateChanged() {
                // console.log(this.selectedKeys);
                // 如果selectedKeys 数组中的length大于0，证明选中的是父级分类
                // 反之 就说明没有选中任何父级分类
                if (this.selectedKeys.length > 0) {
                    // 父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[
                            this.selectedKeys.length - 1
                        ]
                        // 为当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                } else {
                    // 父级分类的id
                    this.addCateForm.cat_pid = 0
                        // 为当前分类的等级赋值
                    this.addCateForm.cat_level = 0
                }
            },
            // 点击 确认 按钮  添加新的分类
            addCate() {
                console.log(this.addCateForm);
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) {
                        return this.message.error('添加新的分类失败')
                    }
                    this.$message.success('添加新的分类成功')
                        // 重新刷新列表
                    this.getCateList()
                        // 关闭对话框
                    this.addCateDialogVisible = false
                })

            },
            // 监听对话框的关闭事件，重置表单数据
            addCateDialogClosed() {
                // 清空表单
                this.$refs.addCateFormRef.resetFields()
                    // 清空数组
                this.selectedKeys = []
                    // 将表单里面的cat_level清空为0
                this.addCateForm.cat_level = 0
                    // 将表单里面的cat_pid清空为0
                this.addCateForm.cat_pid = 0
            }

        }

    }
</script>
<!-- 样式区域 -->
<style lang="less" scoped>
    .treeTable {
        margin-top: 15px;
    }
    
    .el-cascader {
        width: 100%;
    }
</style>