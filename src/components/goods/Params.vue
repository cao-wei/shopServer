<template>
    <div>
        <!-- <h3>商品管理--分类参数</h3> -->
         <!-- 面包屑导航区域 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>    
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
            title="注意： 只允许为第三级分类设置相关参数"
            type="warning" :closable="false" show-icon>
          </el-alert>
          <!-- 选择商品分类区域 -->
          <el-row class="cat_opt">
              <el-col>
                  <span>选择商品分类:</span>
                     <!-- 选择商品分类的级联选择框 -->
                     <!-- options 用来指定数据源   //  props 用来指定配置对象    //  clearable  清空按钮 -->
            <el-cascader :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange" clearable></el-cascader>
        </el-form-item>
              </el-col>
          </el-row>
          <!-- tab页签区域 -->
          <el-tabs type="border-card" class="tabs-tab" v-model="activeName" @tab-click="handleTabClick">
              <!-- 添加动态参数的面板 -->
  <el-tab-pane label="动态参数" name="many">
      <!-- 添加参数的按钮  --> 
      <!-- disabled="isBtnDisabled"    禁用部分 -->
      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
      <!-- 动态参数表格  border 边框  stripe 隔行变色-->
      <el-table :data="manyTableData" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                    {{item}}
                  </el-tag>
                    <!-- 输入的文本框 -->
              <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <!-- 添加的按钮 -->
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>

</el-table-column>
<!-- 索引列 -->
<el-table-column type="index"></el-table-column>
<el-table-column label="参数名称" prop="attr_name"></el-table-column>
<el-table-column label="操作">
    <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
</el-table-column>
</el-table>
</el-tab-pane>
<!-- 添加静态属性的面板 -->
<el-tab-pane label="静态属性" name="only">
    <!-- 添加属性的按钮 -->
    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
    <!-- 静态属性表格  border 边框  stripe 隔行变色-->
    <el-table :data="onlyTableData" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!-- 添加的按钮 -->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                          <el-button size="mini" type="danger" icon="el-icon-delete"@click="removeParams(scope.row.attr_id)">删除</el-button>
                  </template>
        </el-table-column>
    </el-table>
</el-tab-pane>

</el-tabs>
</el-card>
<!-- 添加参数的对话框 -->
<el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
    <!-- 添加参数的对话框 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数的对话框 -->
<el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
    <!-- 修改参数的对话框 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
</el-dialog>
</div>
</template>
<!-- 行为区域 -->
<script>
    export default {
        data() {
            return {
                // 定义商品分类列表
                catelist: [],
                //级联选择器的配置对象
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    // expandTrigger: 'hover'   expandTrigger这个不能改变，是自带的
                    expandTrigger: 'hover'
                },
                // 级联选择框双向绑定到的数组
                selectedCateKeys: [],
                // 被激活的页签的名称
                activeName: 'many', // 默认被选中   如果想更换默认被选中的  就换name 里面的名字 second / first
                // 定义  动态参数数据
                manyTableData: [],
                // 定义  静态参数数据
                onlyTableData: [],
                // 控制添加对话框的显示与隐藏
                addDialogVisible: false,
                // 添加参数的表单数据对象
                addForm: {
                    // 定义  要添加的参数名称
                    attr_name: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }]
                },
                // 控制修改对话框的显示与隐藏
                editDialogVisible: false,
                // 修改的表单数据对象
                editForm: {},
                // 修改表单的验证规则对象
                editFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入修改参数名称',
                        trigger: 'blur'
                    }]
                }
                // //  控制按钮与文本框的切换显示
                // inputVisible: false,
                // // 文本框中输入的内容
                // inputValue: ''

            }

        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取所有的商品分类列表
            async getCateList() {
                const {
                    data: res
                } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败')
                }
                // this.$message.success('获取商品分类成功')
                this.catelist = res.data
                console.log(this.catelist);

            },
            // 级联选择框选中项变化，会触发这个函数
            handleChange() {
                // console.log(this.selectedCateKeys);
                //证明选中的不是三级分类
                //   -----------------
                this.getParamsData() // 调用

            },
            // tab页签点击事件的处理函数
            handleTabClick() {
                console.log(this.activeName);
                this.getParamsData() // 调用
            },
            // 获取参数的列表数据    封装  getParamsData()
            async getParamsData() {
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                        //清空数据
                    this.manyTableData = []
                        // 清空数据
                    this.onlyTableData = []
                    return
                }
                // 证明选中的是三级分类
                console.log(this.selectedCateKeys);
                // 根据所选分类的id，和当前所处的面板，获取对应的参数
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                }
                res.data.forEach(item => {
                    //  拿到项 attr_vals  用 split 进行分割
                    //  item.attr_vals.split(' ') 他的返回值是一个数组   需要给 item.attr_vals 重新赋值
                    //利用三元表达式进行判断  如果item.attr_vals 不为空  直接 进行split分隔  否则为空 返回的就是false  就用数组
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        // console.log(item.attr_vals);
                        // 控制文本框的显示与隐藏
                    item.inputVisible = false
                        // 文本框中输入的值
                    item.inputValue = ''
                })
                console.log(res.data);


                // 判断是动态的数据还是静态的数据
                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            },
            //监听添加对话框的关闭事件
            addDialogClosed() {
                // 关闭对话框之后清空里面的内容
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加参数
            addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName
                        })
                        // console.log(res.meta);

                    if (res.meta.status !== 201) {
                        return this.$message.error('添加参数失败！')
                    }
                    this.$message.success('添加参数成功！')
                        // 成功之后关闭对话框
                    this.addDialogVisible = false
                        // 重新刷新列表
                    this.getParamsData()
                })
            },
            // 点击编辑按钮，展示修改对话框
            async showEditDialog(attr_id) {
                //查询当前参数的信息
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
                    params: {
                        attr_sel: this.activeName
                    }
                })
                console.log(res.meta);

                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数信息失败！')
                }
                // 重新赋值
                this.editForm = res.data


                this.editDialogVisible = true
            },
            //重置修改的表单
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            //点击按钮，修改参数信息
            editParams() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改参数失败')


                    }
                    this.$message.success('修改参数成功')
                        // 重新刷新列表
                    this.getParamsData()
                    this.editDialogVisible = false
                })
            },
            // 点击删除按钮 根据id 删除对应的参数信息
            async removeParams(attr_id) {
                const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch(err => err)
                    //如果 confirmResult 不等于 confirm  就是用户取消了删除操作
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除操作成功！')
                }
                //  删除的业务逻辑

                const {
                    data: res
                } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除参数失败')
                }
                this.$message.success('删除参数成功')
                    // 重新刷新页面
                this.getParamsData()

            },
            // 文本框失去了焦点 或者 摁下了 enter键 都会触发
            async handleInputConfirm(row) {
                // console.log('yes');
                // trim去除字符串两端的空格   判断长度是否等于0 
                if (row.inputValue.trim().length === 0) {
                    // 如果值等于0了  就是不合法的  就重置为空
                    row.inputValue = ''
                        //当row.inputVisible = false 时  就隐藏文本输入框
                    row.inputVisible = false
                    return
                }
                // 如果没有return，则证明输入的内容需要做后续处理
                row.attr_vals.push(row.inputValue.trim()) // 为了防止前后有空格 加上 trim()
                    //将row.inputValue 重置为空字符串
                row.inputValue = ''
                row.inputVisible = false //隐藏文本输入框
                    // 将对attr_vals的操作 保存到数据库
                this.saveAttrVals(row)



            },
            // 封装 将对attr_vals的操作 保存到数据库
            async saveAttrVals(row) {
                // 发起请求，保存在input输入框内添加的操作
                const {
                    data: res
                } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('修改参数项失败！')
                }
                this.$message.success('修改参数项成功！')
            },
            // 点击按钮，展示文本输入框
            showInput(row) {
                row.inputVisible = true
                    // 让文本框自动获得焦点
                    // $nextTick方法的作用就是： 当页面上的元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的参数可选项
            handleClose(i, row) {
                row.attr_vals.splice(i, 1)
                    // 调用 封装的 将对attr_vals的操作 保存到数据库
                this.saveAttrVals(row)
            }
        },
        // 计算属性
        computed: {
            //如果按钮需要被禁用，则会返回true  否则返回false
            isBtnDisabled() {
                // 如果selectedCateKeys 长度不等于3  
                if (this.selectedCateKeys.length !== 3) {
                    // 就禁用按钮
                    return true
                }
                // 否则就开启
                return false
            },
            // 计算   当前选中的三级分类的id
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            // 定义 动态计算标题的文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>
<!-- 样式节点 -->
<style lang="less" scoped>
    .cat_opt,
    .tabs-tab {
        margin-top: 10px;
    }
    
    .el-tag {
        margin: 10px;
    }
    
    .input-new-tag {
        width: 130px;
    }
</style>