<!-- 模板区域 -->
<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域  -->
            <!-- :rules属性绑定 -->
            <!-- 只要能获取 loginFormRef 就可以拿到 这个表单的实例对象 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                    <el-form-item prop="username">
                            <!-- v-model 双向绑定 -->
                      <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user "></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-lock_fill" type="password"></el-input>
                    </el-form-item>
                    <!-- 按钮区域 -->
                    <el-form-item class="btns">
                        <el-button type="success" @click="login">登录</el-button>
                                <!-- 注册点击事件 -->
                        <el-button type="warning" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 这是登录表单的数据绑定对象
                loginForm: {
                    // 数据属性
                    username: 'admin',
                    password: '123456'
                },
                // 这是表单的验证规则对象
                loginFormRules: {
                    // 验证用户名是否合法
                    username: [
                        // trigger: 'blur'  当失去焦点时进行验证
                        {
                            required: true,
                            message: '请输入登录名称',
                            trigger: 'blur'
                        },
                        // 验证长度
                        {
                            min: 3,
                            max: 8,
                            message: '长度在 3 到 8 个字符',
                            trigger: 'blur'
                        }
                    ],
                    // 验证密码是否合法
                    password: [
                        // trigger: 'blur'  当失去焦点时进行验证
                        {
                            required: true,
                            message: '请输入登录密码',
                            trigger: 'blur'
                        },
                        // 验证长度
                        {
                            min: 6,
                            max: 16,
                            message: '长度在 6 到 16 个字符',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            resetLoginForm() {
                // console.log(this);
                //点击重置按钮， 重置登录表单
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    // console.log(valid);
                    if (!valid) return;
                    // 解构赋值
                    const {
                        data: res
                            // 为了post简化操作 使用 await进行优化  await运行于async里面
                    } = await this.$http.post("login", this.loginForm);
                    console.log(res);
                    if (res.meta.status !== 200) return this.$message.error('登录失败');
                    this.$message.success('登录成功');
                    // 把token保存到sessionStorage中
                    window.sessionStorage.setItem("token", res.data.token);
                    // 发起页面的跳转  通过编程式导航跳转到后台主页，路由地址是 /home
                    this.$router.push('/home')


                })
            }
        }
    };
</script>
<!-- lang等于less  代表这个节点中支持less语法格式  -->
<!-- scoped是vue的指令 用来控制组件样式生效的区间 -->
<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        /* 坐标 */
        transform: translate(-50%, -50%);
    }
    
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        /* 背景阴影 */
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        /* top: 50%; */
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
    }
    
    .avatar_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
    
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    
    .btns {
        /* 弹性盒模型 */
        display: flex;
        /* 居尾部对齐 */
        justify-content: flex-end;
    }
</style>