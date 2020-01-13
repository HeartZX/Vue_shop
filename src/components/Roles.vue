<template>
  <div>
    <a-row>
      <a-col>
        <a-button type="primary" size="large" class="addRoles" @click="showModal">添加角色</a-button>
        <a-modal
          title="添加角色"
          v-model="visible"
          @ok="handleOk"
          @cancel="handleClose"
          okText="确认"
          cancelText="取消"
          width="50%"
        >
          <el-form label-width="100px" :model="addForm" :rules="addFormRules" ref="addFormRef">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </a-modal>
      </a-col>
    </a-row>

    <el-table :data="rolesList" highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <a-row
            :key="item1.id"
            :class="['borderBottom',index1===0 ? 'borderTop':'','vcenter']"
            v-for="(item1,index1) in scope.row.children"
          >
            <a-col :span="5">
              <a-tag
                color="cyan"
                class="tag"
                closable
                @close="deleteRightById(scope.row,item1.id)"
              >{{item1.authName}}</a-tag>
              <i class="el-icon-caret-right"></i>
            </a-col>
            <a-col :span="19">
              <a-row
                :class="[index2===0?'':'borderTop','vcenter']"
                v-for="(item2,index2) in item1.children"
                :key="item2.id"
              >
                <a-col :span="6">
                  <a-tag
                    color="green"
                    class="tag"
                    closable
                    @close="deleteRightById(scope.row,item2.id)"
                  >{{item2.authName}}</a-tag>

                  <i class="el-icon-caret-right"></i>
                </a-col>
                <a-col :span="18">
                  <a-tag
                    color="orange"
                    closable
                    :key="item3.id"
                    v-for="item3 in item2.children"
                    class="tag"
                    @close="deleteRightById(scope.row,item3.id)"
                  >{{item3.authName}}</a-tag>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEditModal(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="showPermissionsModal(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <a-modal
      title="编辑角色"
      v-model="visibleEdit"
      @ok="handleEditOk"
      @cancel="handleEditClose"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-form label-width="100px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </a-modal>
    <a-modal
      title="编辑角色"
      v-model="visiblePemissions"
      @ok="handlePemissionsOk"
      @cancel="handlePemissionsClose"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKey"
        ref="treeRef"
      ></el-tree>
    </a-modal>
  </div>
</template>

<script>
export default {
	data() {
		return {
			rolesList: [],
			rightList: [],
			//默认节点权限id
			defKey: [],
			roleId: '',
			treeProps: {
				children: 'children',
				label: 'authName'
			},
			visible: false,
			visibleEdit: false,
			visiblePemissions: false,
			addForm: {
				roleName: '',
				roleDesc: ''
			},
			editForm: {},
			addFormRules: {
				roleName: [
					{
						required: true,
						message: '请输入角色名',
						trigger: 'blur'
					}
				]
			},
			editFormRules: {
				roleName: [
					{
						required: true,
						message: '请输入角色名',
						trigger: 'blur'
					}
				]
			}
		}
	},
	created() {
		this.getRolesList()
	},
	methods: {
		async getRolesList() {
			const { data: res } = await this.$http.get('roles')
			if (res.meta.status == 200) {
				this.rolesList = res.data
				console.log(this.rolesList)
			} else {
				this.$message.error('获取角色列表失败')
			}
		},
		async deleteRightById(role, rightId, children) {
			const { data: res } = await this.$http.delete(
				`roles/${role.id}/rights/${rightId}`
			)
			if (res.meta.status == 200) {
				this.$message.success('删除权限成功了')
				/* 	this.getRolesList() */
				role.children = res.data
			} else {
				this.$message.error('删除权限失败了')
			}
		},
		showModal() {
			this.visible = true
		},
		async showEditModal(id) {
			console.log(id)
			this.visibleEdit = true
			const { data: res } = await this.$http.get('roles/' + id)
			if ((res.meta.status = 200)) {
				this.editForm = res.data
			} else {
				this.$message.error('获取角色信息失败')
			}
		},
		async showPermissionsModal(role) {
			this.roleId = role.id
			const { data: res } = await this.$http.get('rights/tree')
			if (res.meta.status == 200) {
				this.rightList = res.data
			} else {
				return this.$message.error('获取权限数据失败了')
			}
			this.getLeafKeys(role, this.defKey)
			this.visiblePemissions = true
		},

		handleClose() {
			this.$refs.addFormRef.resetFields()
		},
		handleEditClose() {
			this.$refs.editFormRef.resetFields()
		},
		handlePemissionsClose() {
			this.defKey = []
		},
		handleOk() {
			this.$refs.addFormRef.validate(async vaild => {
				console.log(vaild)
				if (vaild) {
					//发起添加角色的请求
					const { data: res } = await this.$http.post(
						'roles',
						this.addForm
					)
					if (res.meta.status == 201) {
						this.$message.success('添加角色成功了')
						this.visible = false
						this.getRolesList()
						this.$refs.addFormRef.resetFields()
					} else {
						this.$message.error('添加角色失败了')
					}
				} else {
					return
				}
			})
		},
		handleEditOk() {
			this.$refs.editFormRef.validate(async vaild => {
				if (vaild) {
					const { data: res } = await this.$http.put(
						'roles/' + this.editForm.roleId,
						{
							roleName: this.editForm.roleName,
							roleDesc: this.editForm.roleDesc
						}
					)
					if (res.meta.status == 200) {
						this.getRolesList()
						this.$message.success('更新角色信息成功')
					} else {
						return this.$message.error('更新角色信息失败')
					}
				} else {
					return
				}
				this.visibleEdit = false
			})
		},
		async handlePemissionsOk() {
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
			]
			console.log(keys)
			const idStr = keys.join(',')

			const { data: res } = await this.$http.post(
				`roles/${this.roleId}/rights`,
				{
					rids: idStr
				}
			)
			if (res.meta.status == 200) {
				this.$message.success('分配权限成功')
				this.getRolesList()
			} else {
				this.$message.error('分配权限失败')
			}
			this.visiblePemissions = false
			this.defKey = []
		},
		async deleteRole(id) {
			const result = await this.$confirm(
				'此操作将永久删除该角色, 是否继续?',
				'删除用户',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(async () => {
					console.log(id)
					const { data: res } = await this.$http.delete('roles/' + id)
					if (res.meta.status == 200) {
						this.$message.success('删除角色成功')
						this.getRolesList()
					} else {
						return this.$message.error('删除角色失败')
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		//递归的获取角色下所有三级权限的id 保存到defkeys数组中
		getLeafKeys(node, arr) {
			//当前节点不包含children属性
			if (!node.children) {
				return arr.push(node.id)
			}
			node.children.forEach(item => {
				this.getLeafKeys(item, arr)
			})
		}
	}
}
</script>

<style lang="less" scoped>
.tag {
	margin: 7px;
}
.borderTop {
	border-top: solid 1px #eee;
}
.borderBottom {
	border-bottom: solid 1px #eee;
}
.vcenter {
	display: flex;
	align-items: center;
}
.addRoles {
	float: right;
}
</style>