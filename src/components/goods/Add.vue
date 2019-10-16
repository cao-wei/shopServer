<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>    
        </el-breadcrumb>
    <el-card>
            <!-- 警告区域 -->
            <!-- :closable="false"  去掉后面的删除按钮 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
           </el-alert>
           <!-- 步骤条区域 -->
           <!-- :active="0"  默认激活的选中项  定义 activeIndex 将默认选中项改为动态   因为 activeIndex 传过来的是字符串 所以要进行减0 使其变成数组 -->
           <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <!-- tab栏区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <!-- 使用v-model 双向绑定 -->
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                    <!-- 使用v-model 双向绑定 -->
                     <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <!-- 使用v-model 双向绑定 -->
                    <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                     <!-- 使用v-model 双向绑定 -->
                    <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                     <!-- 选择商品分类的级联选择框 -->
                     <!-- options 用来指定数据源   //  props 用来指定配置对象    //  clearable  清空按钮 -->
                    <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 三级联动 -->
                        <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange" clearable></el-cascader>
                    
                    </el-form-item>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <!-- 渲染表单的item项 -->
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <!-- 复选框组 -->
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox> 
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <!-- 图片上传 -->
                    <!-- action 表示图片要上传到的后台API地址  on-preview  指定预览的窗口
                          on-remove 点击叉号时 调用事件处理函数，移除掉图片  :file-list 用来指定文件列表的   
                           list-type  呈现的方式   :on-success 要是图片上传成功 就立即调用这个函数-->
                    <el-upload
  :action="uploadURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture" :headers="headerObj" :on-success="handleSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器组件 -->
                    <!-- v-model="addForm.goods_introduce" 双向绑定  让addForm表单的goods_introduce自动同步到添加表单中 -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <!-- 添加商品按钮 -->
                    <el-button type="primary" class="primary-btn" @click="add">添加商品</el-button>
                </el-tab-pane>
            
            </el-tabs>
          </el-form>
          </el-card>
          <!-- 图片预览 -->
          <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
  
</el-dialog>
    </div>
</template>
<script>
    // 下划线就是接受的名称 提倡在导入lodash时命名为下划线  用下划线来接受 （类似与 $）
    import _ from 'lodash'
    export default {
        data() {
            return {
                // 实现数据联动  就让他们同时都使用这个数据项 activeIndex 
                activeIndex: '0',
                // 定义  添加商品的表单数据对象
                addForm: {
                    // 商品名称
                    goods_name: '',
                    //商品价格
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    //商品所属的分类数组
                    goods_cat: [],
                    // 图片的数组
                    pics: [],
                    //商品的详情描述
                    goods_introduce: '',
                    attrs: []
                },
                addFormRules: {
                    //校验商品名称规则
                    goods_name: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }],
                    //校验商品价格
                    goods_price: [{
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }],
                    goods_weight: [{
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur',
                    }],
                    goods_number: [{
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur',
                    }],
                    goods_cat: [{
                        required: true,
                        message: '请选择商品分类',
                        trigger: 'blur',
                    }]
                },
                //商品分类列表
                catelist: [],
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    // expandTrigger: 'hover'   expandTrigger这个不能改变，是自带的
                    expandTrigger: 'hover'
                },
                //定义 动态参数列表数据
                manyTableData: [],
                // 定义 静态属性列表数据
                onlyTableData: [],
                //上传图片的URL地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                // 图片上传组件的header请求头对象
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 预览图片事件
                previewPath: '',
                // 显示与隐藏对话框
                previewVisible: false
            }
        },
        // 生命周期函数
        created() {
            // 定义
            this.getCateList()
        },
        // 定义
        methods: {
            // 获取所有商品分类数据
            async getCateList() {
                const {
                    data: res
                } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品数据失败！')
                }
                // this.$message.success('获取商品数据成功！')
                //将数据保存到 catelist中 
                this.catelist = res.data
                    // 重新刷新列表
                    // this.getCateList()
                console.log(this.catelist);

            },
            //级联选择器选中项变化，会触发这个函数
            handleChange() {
                console.log(this.addForm.goods_cat);
                // 如果当前级联选择器选中的长度不等于3  就清空数组
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
            },
            // 阻止标签页的切换
            beforeTabLeave(activeName, oldActiveName) {
                // console.log('即将离开的标签名是' + oldActiveName);
                // console.log('即将进入的标签名是' + activeName);
                // return false
                //如果 oldActiveName即将离开的 等等与0 并且 addForm.goods_cat商品分类的长度 不等于3 就阻止标签页的切换，并提示用户错误的信息
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类！')
                    return false
                }
            },
            async tabClicked() {
                // console.log(this.activeIndex);
                //证明访问的是动态参数面板
                if (this.activeIndex === '1') {
                    // console.log('动态参数面板');
                    const {
                        data: res
                    } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'many'
                        }

                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取动态参数列表失败！')
                    }
                    this.$message.success('获取动态参数列表成功！')
                    console.log(res.data);
                    res.data.forEach(item => {
                            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        })
                        // 把 res.data 赋值给 this.manyTableData 供外界使用
                    this.manyTableData = res.data

                }

            },
            // 定义事件处理函数   处理图片预览效果
            handlePreview(file) {
                console.log(file);
                this.previewPath = file.response.data.url

                this.previewVisible = true
            },
            // 定义  事件处理函数  处理移除图片的操作
            handleRemove(file) {
                // console.log(file);
                // 1.获取将要删除的图片的临时路径
                const filePath = file.response.data.tmp_path
                    // 2. 从pics数组中 找到这个图片对应的索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                    // 3. 调用数组的 splice 方法，把图片信息对象从pics数组中移除
                this.addForm.pics.splice(i, 1)
                console.log(this.addForm);

            },
            // 监听图片上传成功的事件
            handleSuccess(response) {
                console.log(response);
                // 1. 拼接得到一个图片信息对象
                const picInfo = {
                        pic: response.data.tmp_path
                    }
                    //2. 将图片信息对象 push到pics数组中
                this.addForm.pics.push(picInfo)
                console.log(this.addForm);

            },
            //点击添加商品按钮 触发对应的事件
            add() {
                // console.log(this.addForm);
                // 只要调用 validate 就会进行验证
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请添写必要的表单项')
                    }
                    // 深拷贝
                    const form = _.cloneDeep(this.addForm)
                        // 如果没有return 就走添加的程序  执行添加的业务逻辑  // 需要深拷贝 lodash cloneDeep(obj)
                    form.goods_cat = form.goods_cat.join(',')
                        // 处理动态参数
                    this.manyTableData.forEach(item => {
                            const newInfo = {
                                attr_id: item.attr_id,
                                attr_value: item.attr_vals.join(' ')
                            }
                            this.addForm.attrs.push(newInfo)
                        })
                        //处理静态属性
                    this.onlyTableData.forEach(item => {
                            const newInfo = {
                                attr_id: item.attr_id,
                                attr_value: item.attr_vals
                            }
                            this.addForm.attrs.push(newInfo)
                        })
                        // 把 this.addForm.attrs 赋值 form.attrs
                    form.attrs = this.addForm.attrs
                    console.log(form);
                    //发起请求添加商品
                    //商品的名称必须时唯一的
                    const {
                        data: res
                    } = await this.$http.post('goods', form)
                    if (res.meta.status !== 201) {
                        return this.$message.error('创建商品失败！')
                    }
                    this.$message.success('创建商品成功！')
                        //添加成功之后 要通过 编程式导航 跳转到/goods商品列表页 
                    this.$router.push('/goods')
                })

            }
        },
        // 计算属性
        computed: {
            // 定义一个计算属性
            cateId() {
                // 如果商品分类长度 等于3  就证明包含了3级商品
                if (this.addForm.goods_cat.length === 3) {
                    // 就把商品分类索引为2 的返回出去
                    return this.addForm.goods_cat[2]
                }
                // 如果不等于3  就证明没有三级分类 退出  返回一个空
                return null
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-checkbox {
        margin-right: 10px!important;
    }
    
    .previewImg {
        width: 100%;
    }
    
    .primary-btn {
        margin-top: 15px;
    }
</style>