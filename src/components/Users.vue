<template>
  <div>
    <a-row>
      <a-col :span="6">
        <a-input-search
          v-model="queryInfo.query"
          placeholder="请输入用户姓名"
          @search="getUserList"
          enterButton
          size="large"
        />
      </a-col>
      <a-col :span="2" class="resetBtn">
        <a-button type="info" size="large" @click=" resetUserList">重置</a-button>
      </a-col>
      <a-col :span="2" class="addUser">
        <a-button type="primary" size="large" @click="showModal">添加用户</a-button>
        <a-modal
          title="添加用户"
          v-model="visible"
          @ok="handleOk"
          @cancel="handleClose"
          okText="确认"
          cancelText="取消"
          width="50%"
        >
          <el-form label-width="70px" :model="addForm" :rules="addFormRules" ref="addFormRef">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </a-modal>
      </a-col>
    </a-row>

    <div class="userTable">
      <el-table :data="userList" highlight-current-row>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showEditModal(scope.row.id)">编辑</el-button>
            <a-modal
              title="编辑用户"
              v-model="visibleEdit"
              @ok="handleEditOk"
              @cancel="handleEditClose"
              okText="确认"
              cancelText="取消"
              width="50%"
            >
              <el-form
                label-width="70px"
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
              >
                <el-form-item label="用户名">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
            </a-modal>
            <el-button type="danger" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
import { async } from 'q'
export default {
	created() {
		this.getUserList()
	},
	data() {
		//验证邮箱的规则
		var checkEmail = (rule, value, callback) => {
			const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
			if (regEmail.test(value)) {
				return callback()
			} else {
				callback('邮箱格式不正确')
			}
		}
		//验证手机的规则
		var checkMobile = (rule, value, callback) => {
			const regMobile = /^1[34578]\d{9}$/
			if (regMobile.test(value)) {
				return callback()
			} else {
				callback('手机号格式不正确')
			}
		}
		return {
			//查询到的用户信息
			editForm: {},
			//添加用户的表单数据
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			//添加表单的验证规则对象
			addFormRules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					},
					{
						min: 3,
						max: 10,
						message: '用户名长度需要在 3 到 10 个字符',
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
						message: '密码长度需要在 6 到 15 个字符',
						trigger: 'blur'
					}
				],
				email: [
					{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					},
					{
						validator: checkEmail,
						trigger: 'blur'
					}
				],
				mobile: [
					{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{
						validator: checkMobile,
						trigger: 'blur'
					}
				]
			},
			editFormRules: {
				email: [
					{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					},
					{
						validator: checkEmail,
						trigger: 'blur'
					}
				],
				mobile: [
					{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{
						validator: checkMobile,
						trigger: 'blur'
					}
				]
			},
			userList: [],
			total: 0,
			visible: false,
			visibleEdit: false,
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 2
			}
		}
	},
	methods: {
		async getUserList() {
			const { data: res } = await this.$http.get('users', {
				params: this.queryInfo
			})
			console.log(res)
			if (res.meta.status == 200) {
				this.userList = res.data.users
				this.total = res.data.total
			} else {
				this.$message.error('获取用户列表失败')
			}
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},
		async userStateChanged(val) {
			console.log(val)
			const { data: res } = await this.$http.put(
				`users/${val.id}/state/${val.mg_state}`
			)
			if (res.meta.status == 200) {
				this.$message.success('更新用户状态成功')
			} else {
				val.mg_state = !val.mg_state
				this.$message.error('更新用户状态失败')
			}
		},
		resetUserList() {
			this.queryInfo.query = ''
			this.getUserList()
		},
		showModal() {
			this.visible = true
		},
		async showEditModal(id) {
			const { data: res } = await this.$http.get('users/' + id)
			if (res.meta.status == 200) {
				this.editForm = res.data
			} else {
				this.$message.error('获取用户信息失败')
			}
			this.visibleEdit = true
		},
		handleOk(e) {
			console.log(e)
			this.$refs.addFormRef.validate(async vaild => {
				console.log(vaild)
				if (vaild) {
					//发起添加用户的请求
					const { data: res } = await this.$http.post(
						'users',
						this.addForm
					)
					if (res.meta.status == 201) {
						this.$message.success('添加用户成功了')
						this.visible = false
            this.getUserList()
            	this.$refs.addFormRef.resetFields()
					} else {
						this.$message.error('添加用户失败了')
					}
				} else {
					return
				}
			})
		},
		handleClose() {
			this.$refs.addFormRef.resetFields()
		},
		handleEditOk(e) {
			this.$refs.editFormRef.validate(async vaild => {
				if (vaild) {
					const { data: res } = await this.$http.put(
						'users/' + this.editForm.id,
						{
							email: this.editForm.email,
							mobile: this.editForm.mobile
						}
					)
					if (res.meta.status == 200) {
						this.visibleEdit = false
						this.getUserList()
						this.$message.success('更新用户信息成功')
					} else {
						return this.$message.error('更新用户信息失败')
					}
				} else {
					return
				}
			})
		},
		handleEditClose() {
			this.$refs.editFormRef.resetFields()
		},
		async deleteUser(id) {
			const result = await this.$confirm(
				'此操作将永久删除该用户, 是否继续?',
				'删除用户',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(async () => {
					console.log(id)
					const { data: res } = await this.$http.delete('users/' + id)
					if (res.meta.status == 200) {
						this.$message.success('删除用户成功')
						this.getUserList()
					} else {
						return this.$message.error('删除用户失败')
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		}
	}
}
</script>
<style lang="less" scoped>
.addUser {
	float: right;
}
.userTable {
	margin: 50px 0 40px 0;
}
.pagination {
	float: right;
}
.resetBtn {
	margin-left: 30px;
}
</style>