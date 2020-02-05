<template>
  <div class="login_container">
    <div class="login_box">
      <div class="head-info">
			<label class="lbl-1"></label>
			<label class="lbl-2"> </label>
			<label class="lbl-3"> </label>
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
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
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
    resetForm (forName) {
      console.log(this)
      this.$refs[forName].resetFields()
    },
    login (forName) {
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
            // 把token保存到sessionStorage中
            window.sessionStorage.setItem('token', res.data.token)
            // 通过编程式导航 跳转到主页路由地址
            this.$router.push('/home')
          }
        } else {

        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background: url('../assets/bg1.jpg');
  height: 100%;
	position: relative;
}
.login_box {
	width: 450px;
	height: 300px;
	background-color:#2b2b36;
	border-radius: 15px;
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
label.lbl-1 {
    background: #6756ea;
    width: 20px;
    height: 20px;
    display: block;
    float: right;
    border-radius: 50%;
    margin: 16px 10px 0px 0px;
}
label.lbl-2 {
    background: #ea569a;
    width: 20px;
    height: 20px;
    display: block;
    float: right;
    border-radius: 50%;
    margin: 16px 10px 0px 0px;
}
label.lbl-3 {
    background: #f1c85f;
    width: 20px;
    height: 20px;
    display: block;
    float: right;
    border-radius: 50%;
    margin: 16px 10px 0px 0px;
}
.head-info{
  height: 30px;
}
</style>
