<template>
  <div>
    <a-modal
      :title="'添加'+titleText"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleClose"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </a-modal>
    <a-modal
      :title="'编辑'+titleText"
      v-model="visibleEdit"
      @ok="handleEditOk"
      @cancel="handleEditClose"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-form label-width="80px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </a-modal>
    <a-alert message="注意：只允许为第三级分类设置相关参数" banner />
    <a-row style="margin:20px">
      <a-col>
        <span style="font-size:15px;margin-right:10px">选择商品分类:</span>
        <el-cascader
          :props="cascaderProps"
          :options="cateList"
          clearable
          v-model="selectedKey"
          @change="handleChange"
        ></el-cascader>
      </a-col>
    </a-row>

    <el-tabs v-model="activeName" @tab-click="handleTabsClick" style="margin-left:20px">
      <el-tab-pane label="动态参数" name="many">
        <a-button type="primary" :disabled="isBtnDisabled" @click="showAddModal()">添加参数</a-button>
        <el-table :data="manyTableData">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                @close="handleClose(index,scope.row)"
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
              >{{item}}</el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
                :style="{ width: '78px' }"
                v-model="scope.row.inputValue"
              />
              <el-tag v-else class="button-new-tag" @click="showInput(scope.row)">添加标签</el-tag>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="动态参数" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showEditModal(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <a-button type="primary" :disabled="isBtnDisabled" @click="showAddModal()">添加属性</a-button>
        <el-table :data="onlyTableData">
             <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                @close="handleClose(index,scope.row)"
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
              >{{item}}</el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
                :style="{ width: '78px' }"
                v-model="scope.row.inputValue"
              />
              <el-tag v-else class="button-new-tag" @click="showInput(scope.row)">添加标签</el-tag>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showEditModal(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
	data() {
		return {
			cateList: [],
			manyTableData: [],
			onlyTableData: [],
			visible: false,
			visibleEdit: false,
			inputVisible: false,
			inputValue: '',
			selectedKey: [],
			activeName: 'many',
			cascaderProps: {
				expandTrigger: 'hover',
				value: 'cat_id',
				label: 'cat_name',
				children: 'children'
			},
			addForm: {},
			editForm: {},
			addFormRules: {
				attr_name: [
					{
						required: true,
						message: '请输入参数名',
						trigger: 'blur'
					}
				]
			},
			editFormRules: {
				attr_name: [
					{
						required: true,
						message: '请输入参数名',
						trigger: 'blur'
					}
				]
			}
		}
	},
	computed: {
		isBtnDisabled() {
			if (this.selectedKey.length === 3) {
				return false
			} else {
				return true
			}
		},
		cateId() {
			if (this.selectedKey.length === 3) {
				return this.selectedKey[2]
			} else {
				return null
			}
		},
		titleText() {
			if (this.activeName === 'many') {
				return '动态参数'
			} else {
				return '静态属性'
			}
		}
	},

	created() {
		this.getCateList()
	},
	methods: {
		async getCateList() {
			const { data: res } = await this.$http.get('categories')
			if (res.meta.status == 200) {
				console.log(res.data)
				this.cateList = res.data
				console.log(this.cateList)
			} else {
				this.$message.error('获取分类失败了')
			}
		},

		handleChange() {
			this.getParamsData()
			console.log(this.selectedKey)
			console.log(this.cateId)
		},
		handleTabsClick() {
			this.getParamsData()
		},
		async getParamsData() {
              if(this.selectedKey.length !==3){
				 this.selectedKey=[]
				 this.manyTableData=[]
				 this.onlyTableData=[]
			  }

			const { data: res } = await this.$http.get(
				`categories/${this.cateId}/attributes`,
				{
					params: {
						sel: this.activeName
					}
				}
			)
			console.log(res)
			res.data.forEach(item => {
				item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
				item.inputVisible = false
				item.inputValue = ''
			})
			if (res.meta.status == 200) {
				console.log(res.data)
				if (this.activeName === 'many') {
					this.manyTableData = res.data
				} else {
					this.onlyTableData = res.data
				}
			} else {
				this.$message.error('获取参数失败了')
			}
		},
		showAddModal() {
			this.visible = true
		},
		handleOk() {
			this.$refs.addFormRef.validate(async vaild => {
				if (vaild) {
					const { data: res } = await this.$http.post(
						`categories/${this.cateId}/attributes`,
						{
							attr_name: this.addForm.attr_name,
							attr_sel: this.activeName
						}
					)
					if (res.meta.status == 201) {
						this.getParamsData()
						this.$message.success('添加参数信息成功')
						this.addForm = {}
					} else {
						return this.$message.error('添加参数信息失败')
					}
					this.visible = false
				} else {
					return
				}
			})
		},
		handleClose() {
			this.$refs.addFormRef.resetFields()
		},
		async showEditModal(id) {
			const { data: res } = await this.$http.get(
				`categories/${this.cateId}/attributes/${id}`,
				{
					params: {
						attr_sel: this.activeName
					}
				}
			)
			if (res.meta.status == 200) {
				this.editForm = res.data
			} else {
				this.$message.error('获取参数信息失败')
			}
			this.visibleEdit = true
		},
		handleEditOk() {
			this.$refs.editFormRef.validate(async vaild => {
				if (vaild) {
					const { data: res } = await this.$http.put(
						`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
						{
							attr_name: this.editForm.attr_name,
							attr_sel: this.activeName
						}
					)
					if (res.meta.status == 200) {
						this.getParamsData()
						this.$message.success('编辑参数信息成功')
					} else {
						return this.$message.error('编辑参数信息失败')
					}
					this.visibleEdit = false
				} else {
					return
				}
			})
		},
		handleEditClose() {
			this.$refs.editFormRef.resetFields()
		},
		async deleteParams(id) {
			const result = await this.$confirm(
				'此操作将永久删除该参数, 是否继续?',
				'删除参数',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(async () => {
					console.log(id)
					const { data: res } = await this.$http.delete(
						`categories/${this.cateId}/attributes/${id}`
					)
					if (res.meta.status == 200) {
						this.$message.success('删除参数成功')
						this.getParamsData()
					} else {
						return this.$message.error('删除参数失败')
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},

		async handleInputConfirm(row) {
			if (row.inputValue.trim().length === 0) {
				row.inputVisible = false
				row.inputValue = ''
			} else {
				row.attr_vals.push(row.inputValue.trim())
				row.inputVisible = false
				row.inputValue = ''
				const { data: res } = await this.$http.put(
				`categories/${this.cateId}/attributes/${row.attr_id}`,
				{
					attr_name: row.attr_name,
					attr_sel: row.attr_sel,
					attr_vals: row.attr_vals.join(' ')
				}
			)
			if (res.meta.status == 200) {
				this.$message.success('修改参数成功了')
			} else {
				this.$message.error('修改参数失败了')
			}
			}
		},
		showInput(row) {
			row.inputVisible = true
			//$nextTick 方法作用 就是当页面被重新渲染后 才会指定回调函数中的代码
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus()
			})
		},
		async handleClose(index, row) {
			row.attr_vals.splice(index, 1)
			const { data: res } = await this.$http.put(
				`categories/${this.cateId}/attributes/${row.attr_id}`,
				{
					attr_name: row.attr_name,
					attr_sel: row.attr_sel,
					attr_vals: row.attr_vals.join(' ')
				}
			)
			if (res.meta.status == 200) {
				this.$message.success('修改参数成功了')
			} else {
				this.$message.error('修改参数失败了')
			}
		}
	}
}
</script>
<style lang="less" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>