<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" label-width="60px" class="form" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-ziyuan1 "></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-ziyuan"></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			loginForm: {
				username: '',
				password: ''
			},
			rules: {
				username: [
					{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					},
					{
						min: 3,
						max: 10,
						message: '长度在 3 到 10 个字符',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 15,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur'
					}
				]
			},
			loginFormRef: {
				username: '',
				password: ''
			}
		}
	},
	methods: {
		resetForm(forName) {
			console.log(this)
			this.$refs[forName].resetFields()
		},
		login(forName) {
			this.$refs[forName].validate(async valid => {
				console.log(valid)
				if (valid) {
					const { data: res } = await this.$http.post(
						'login',
						this.loginForm
					)
					console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error('该用户未注册或账号密码错误')
					} else {
						this.$message.success('登录成功')
						//把token保存到sessionStorage中
						window.sessionStorage.setItem('token', res.data.token)
						//通过编程式导航 跳转到主页路由地址
						this.$router.push('/home')
					}
				} else {
					return
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.login_container {
	background-color: #2b4b6b;
	height: 100%;
	position: relative;
}
.login_box {
	width: 450px;
	height: 300px;
	background-color: #fff;
	border-radius: 3px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.avatar_box {
	width: 130px;
	width: 130px;
	border: 1px solid #eee;
	border-radius: 50%;
	padding: 10px;
	box-shadow: 0 0 10px #ddd;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #fff;

	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}
}
.form {
	width: 400px;
	position: absolute;
	left: 50%;
	transform: translate(-50%, 50%);
}
.button {
	display: flex;
	justify-content: flex-end;
}
</style>