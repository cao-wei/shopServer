<template>
    <div>
        <!-- <h3>权限管理--角色列表</h3> -->
          <!-- 面包屑导航区域 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>    
            </el-breadcrumb>
            <!-- 卡片视图 -->
            
            <el-card>
                <!-- 添角色按钮区域 -->
                <el-row>
                    <el-button type="primary">添加角色</el-button>
                </el-row>
                <!-- 角色列表区域 -->
                    <!-- border 整个盒子的外部边框  stripe 隔行变色 -->
                <el-table :data="rolesList" border stripe>
                    <!-- 展开列   expand-->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                                <!-- 渲染一级权限 -->
                                <el-col :span="5">
                                    <el-tag closable @close="removeRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级和三级权限 -->
                                <el-col :span="19">
                                    <!-- 通过for循环  嵌套渲染二级权限 -->
                                    <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                        <el-col :span="6">
                                            <el-tag type="success" closable @close="removeRolesById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="13">
                                                <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRolesById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                                <!-- <pre>{{scope.row}}</pre> -->
                        </template>
</el-table-column>
<!-- 索引列 -->
<el-table-column type="index"></el-table-column>
<el-table-column label="角色名称" prop="roleName"></el-table-column>
<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
<el-table-column label="操作" width="300px">
    <template slot-scope="scope">
                         <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <!-- 分配角色按钮   // 要想按钮变成圆形  加上 circle  即可-->
                            <!-- <el-tooltip effect="dark" content="分配角色按钮 " placement="top-start" :enterable="false">
                           
                            </el-tooltip> -->
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>    
                             </template>

</el-table-column>
</el-table>
</el-card>
<!-- 分配权限的对话框 -->
<el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
    <!-- show-checkbox  是复选框    node-key="id"  唯一标识    default-expand-all  默认展开所有节点  -->
    <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible=false ">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

</template>

<script>
    export default {
        data() {
            return {
                // 所有角色列表数据
                rolesList: [

                ],
                // 控制分配权限对话框的显示与隐藏
                setRightDialogVisible: false,
                // 所有权限的数据
                rightList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中的节点id值数组
                defKeys: [

                ],
                // 当前即将分配权限的角色id
                roleId: ''
            }
        },
        // 生命周期函数
        created() {
            // 获取所有的权限
            this.getRolesList()
        },
        // 定义
        methods: {
            // 获取所有角色列表
            async getRolesList() {
                const {
                    data: res
                } = await this.$http.get('roles')

                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户信息失败')
                }
                this.rolesList = res.data
                console.log(this.rolesList);

            },
            // 根据id删除对应的权限
            async removeRolesById(role, rightId) {
                // 弹框提示是否确定要删除
                const confirmResult = await this.$confirm('此操作将永久删除该组件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除操作')
                }
                // console.log('确认了删除');
                const {
                    data: res
                } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败！')
                }
                // 删除成功后重新刷新整个页面  同时也会关闭删除操作的页面  所以不建议使用
                // this.getRolesList()

                // 把服务器返回的最新的权限直接赋值给当前权限的children属性
                role.children = res.data //删除之后为角色信息重新赋值权限

            },
            // 展示分配权限的对话框
            async showSetRightDialog(role) {
                // 角色的id
                this.roleId = role.id
                    //获取所有权限的数据
                const {
                    data: res
                } = await this.$http.get('rights/tree')

                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限失败！')
                }
                // 把获取到的数据保存到data中
                this.rightList = res.data
                console.log(this.rightList);
                //递归获取三级节点的id
                this.getleafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },
            // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys 数组中
            getleafKeys(node, arr) {
                // 如果当前node节点不包含children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => this.getleafKeys(item, arr))
            },
            // 监听分配权限对话框的关闭事件
            setRightDialogClosed() {
                this.defKeys = []
            },
            // 点击确认提交按键  为角色分配权限 
            async allotRights() {
                const keys = [
                        // ...  是展开运算符
                        ...this.$refs.treeRef.getCheckedKeys(),
                        ...this.$refs.treeRef.getHalfCheckedKeys()
                    ]
                    // console.log(keys);
                const idstr = keys.join(',')
                const {
                    data: res
                } = await this.$http.post(`roles/${this.roleId}/rights`, {
                    rids: idstr
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败！')
                }
                this.$message.success('分配权限成功！')
                    //  成功之后重新刷新页面
                this.getRolesList()
                    //  关闭对话框
                this.setRightDialogVisible = false

            }

        }
    }
</script>

<style lang='less' scoped>
    .el-tag {
        margin: 10px;
    }
    
    .bdtop {
        /* 角色列表展开项的上边框线 */
        border-top: 1px solid #eee;
    }
    
    .bdbottom {
        /* 角色列表展开项的下边框线 */
        border-bottom: 1px solid #eee;
    }
    
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>