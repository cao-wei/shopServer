<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>    
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <!-- :gutter="20"  搜索与添加 之间的间距 -->
            <el-row :gutter="30">
                <!-- 如果搜索框长长度不够  可以增长:sapn里面的参数 -->
                <el-col :span="10">
                    <!-- 双向绑定-->
                    <!--  v-model="queryInfo.query"  实现搜索功能    // clearable 清空功能-->
                    <!-- @clear="getUserList" 点击清空按钮是  重新获取列表内容 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <!-- @click="getUserList"  注册点击事件   并实现搜索功能 -->
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域  -->
            <el-table :data="userlist" border stripe> 
                <!-- 加上index是列表的索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 定义作用域插槽    // 通过slot-scope接受当前作用域数据scope-->
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                         <!-- 通过scope.row 拿到这一行的数据 -->
                        <el-switch
                        v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                      </el-switch>
                    </template>>
</el-table-column>
<el-table-column label="操作" width="180px">
    <template slot-scope="scope">
        <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
        <!-- 分配角色按钮   // 要想按钮变成圆形  加上 circle  即可-->
            <el-tooltip effect="dark" content="分配角色按钮 " placement="top-start" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
       
    </template>
</el-table-column>
</el-table>
<!-- 实现分页效果区域 -->
<!-- layout="total, sizes, prev, pager, next, jumper"   里面的每一个子组件名都是一个组件内容 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</el-card>
<!-- 添加用户的对话框 -->
<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addClose">
    <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名:" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">   
  <el-button @click="addDialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="addUser">确定 添加</el-button>
</span>
</el-dialog>
<!-- 修改用户的对话框 -->
<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名:">
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱:" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色的对话框 -->
<el-dialog title="分配权限" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClose">
    <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色:
            <!--通过 v-model  双向绑定 -->
            <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
            </el-select>
        </p>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
    export default {
        // 当前所有的数据
        data() {
            // 验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                    // 验证邮箱的正则表达式
                    const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    if (regEmail.test(value)) {
                        //合法的邮箱
                        return cb()
                    }
                    cb(new Error('请输入合法的邮箱'))
                }
                // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                var regMobile = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }
            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1, //当前的页数
                    pagesize: 2 //一页显示多少条
                },
                userlist: [], //所有用户列表
                total: 0, //总数据条数
                addDialogVisible: false, //控制添加用户对话框的显示与隐藏
                // 添加用户表单数据
                addForm: {
                    username: '', //验证用户名
                    password: '', //验证密码
                    email: '', //邮箱验证
                    mobile: '' //手机号验证
                },
                // 添加表单数据验证规则对象
                addFormRules: {
                    //用户名
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 10,
                        message: '请输入3~10位的用户名',
                        trigger: 'blur'
                    }],
                    //密码
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 16,
                        message: '请输入6~16位的密码',
                        trigger: 'blur'
                    }],
                    //邮箱
                    email: [{
                        required: true,
                        message: '请输入邮箱名',
                        trigger: 'blur'
                    }, {
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    // 手机号
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                // 查询到的用户信息对象
                editForm: {

                },
                // 修改表单的验证规则对象
                editFormRules: {
                    email: [{
                        required: true,
                        message: '请输入用户邮箱',
                        trigger: 'blur'
                    }, {
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                // 控制分配角色对话框的显示与隐藏
                setRoleDialogVisible: false,
                // 定义 需要被分配角色的用户信息
                userInfo: {},
                // 所有角色的数据列表
                rolesList: [],
                // 定义 已选中的角色id值
                selectedRoleId: ''
            }


        },
        // 生命周期函数
        created() {
            // 调用getUserList  发起 axios函数this.$http.get('users', {params: this.queryInfo})
            this.getUserList()
        },
        // 定义事件处理函数
        methods: {
            async getUserList() {
                const {
                    data: res
                } = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败！')
                }
                // 赋值
                this.userlist = res.data.users
                this.total = res.data.total
                console.log(res);
            },
            // 定义分页区域处理函数
            handleSizeChange(newSize) { // 监听pagesize改变的事件
                // console.log(newSize);
                this.queryInfo.pagesize = newSize
                    // newSize 发生变化了   就重新调用getUserList方法 发起请求
                this.getUserList()

            },
            handleCurrentChange(newPage) { // 监听 页码值 改变的事件
                // console.log(newPage);
                this.queryInfo.pagenum = newPage
                    // newPage 发生变化了   就重新调用getUserList方法 发起请求  实现点击左右按钮 进行页面的跳转
                this.getUserList()
            },
            // 监听Switch开关状态的改变  //刷新后状态不会自动改变
            async userStateChanged(userinfo) {
                // console.log(userinfo);
                const {
                    data: res
                } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200) {
                    // 取反
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            },
            // 监听添加用户框的关闭事件
            addClose() {
                // 当关闭了添加输入框后将里面的内容重置
                this.$refs.addFormRef.resetFields()
            },
            // 监听确认添加按钮 //点击按钮，添加新用户
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    console.log(valid);
                    if (!valid) return
                        //可以发起添加用户的网络请求
                    const {
                        data: res
                    } = await this.$http.post('users', this.addForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加用户失败')
                    }
                    this.$message.success('添加用户成功')
                        // 添加用户成功之后 关闭输入框
                    this.addDialogVisible = false
                        // 重新刷新用户列表的数据
                    this.getUserList()
                })
            },
            // 展示编辑用户的对话框
            async showEditDialog(id) {
                // console.log(id);

                const {
                    data: res
                } = await this.$http.get('users/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败')
                }
                // this.$message.success('查询用户信息成功')
                // 查询用户成功之后 关闭输入框
                // this.addDialogVisible = false
                // 重新刷新用户列表的数据
                // this.getUserList()
                // 重新赋值
                this.editForm = res.data
                    // 点击修改按钮时 展示修改的对话框
                this.editDialogVisible = true
            },
            // 监听修改用户对话框的关闭事件,当点击修改时，点击了关闭了输入框，当再次点击修改时，还原了输入框内的内容
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
            editUserInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    // console.log(valid);
                    if (!valid) return
                        // 发起修改用户信息的请求
                    const {
                        data: res
                    } = await this.$http.put('users/' + this.editForm.id, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    })
                    if (res.meta.status !== 200) {
                        // 取反
                        // userinfo.mg_state = !userinfo.mg_state
                        return this.$message.error('修改用户信息失败')
                    }
                    // 修改用户信息成功之后 关闭对话框
                    this.editDialogVisible = false
                        // 重新刷新用户列表的数据
                    this.getUserList()
                        // 提示用户成功
                    this.$message.success('修改用户信息成功')
                })
            },
            // 根据id删除对应的用户信息
            async removeUserById(id) {
                // console.log(id);
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                            // catch(err => err) 解决点击取消时的错误信息   
                    }).catch(err => err)
                    // 如果用户确认删除，则返回值为字符串  confirm   取消返回 cancel
                    // console.log(confirmResult);
                    // 如果 confirmResult 不等于 confirm
                if (confirmResult !== 'confirm') {
                    // 就退出  并提示
                    return this.$message.info('取消了删除操作！')
                }
                // console.log('确认了删除');
                const {
                    data: res
                } = await this.$http.delete('users/' + id)

                if (res.meta.status !== 200) {
                    return this.$message.error('删除用户失败')
                }

                this.$message.success('删除操作成功')
                    // 操作成功之后重新刷新用户列表的数据
                this.getUserList()
            },
            // 展示分配角色的对话框
            async setRole(userInfo) {
                this.userInfo = userInfo
                    // 在展示对话框之前，获取所有角色的列表
                const {
                    data: res
                } = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取分配权限失败！')
                }
                this.$message.success('获取分配权限成功！')

                //    把角色列表保存到页面的数据中 
                this.rolesList = res.data
                this.setRoleDialogVisible = true
            },
            // 点击 确认 按钮   分配角色
            async saveRoleInfo() {
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择要分配的角色')
                }
                const {
                    data: res
                } = await this.$http.put(`users/${this.userInfo.id}/role`, {
                    rid: this.selectedRoleId
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新分配角色失败！')
                }
                this.$message.success('更新分配角色成功！')
                    // 重新刷新用户列表
                this.getUserList()
                    // 成功之后关闭对话框
                this.setRoleDialogVisible = false
            },
            // 监听分配角色对话框的关闭事件
            setRoleDialogClose() {
                // 当点击确认提交之后，将对话框清空
                this.selectedRoleId = ''
                this.userInfo = {}
            }



        }
    }
</script>

<style lang="less" scoped>

</style>