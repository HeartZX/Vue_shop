<template>
  <div>
	  
    <a-row>
      <a-col>
        <a-button type="primary" size="large" style="float:right" @click="showModal">添加分类</a-button>
      </a-col>
    </a-row>
    <a-modal
      title="添加分类"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleClose"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-form label-width="70px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKey"
            :options="ParentCateList"
            :props="cascaderProps"
            @change="handleChange"
            style="width:100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
    </a-modal>
    <el-table
      :data="cateList"
      style="width: 100%;margin-top: 50px;"
      row-key="cat_id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column prop="cat_level" label="分类等级">
        <template slot-scope="scope">
          <a-tag color="cyan" v-if="scope.row.cat_level===0">一级</a-tag>
          <a-tag color="green" v-else-if="scope.row.cat_level===1">二级</a-tag>
          <a-tag color="orange" v-else>三级</a-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEditModal(scope.row.cat_id)">编辑</el-button>

          <el-button type="danger" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <a-modal
      title="编辑分类"
      v-model="visibleEdit"
      @ok="handleEditOk"
      @cancel="handleEditClose"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-form label-width="70px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
    </a-modal>
  </div>
</template>

<script>
export default {
	data() {
		return {
			cateList: [],
			ParentCateList: [],
			selectedKey: [],
			visibleEdit: false,
			queryInfo: {
				type: 3,
				pagenum: 1,
				pagesize: 8
			},
			total: 0,
			visible: false,
			addForm: {
				cat_name: '',
				cat_pid: 0,
				cat_level: 0
			},
			editForm: {},
			addFormRules: {
				cat_name: [
					{
						required: true,
						message: '请输入分类名',
						trigger: 'blur'
					}
				]
			},
			editFormRules: {
				cat_name: [
					{
						required: true,
						message: '请输入分类名',
						trigger: 'blur'
					}
				]
			},
			cascaderProps: {
				expandTrigger: 'hover',
				value: 'cat_id',
				label: 'cat_name',
				children: 'children',
				checkStrictly: true
			}
		}
	},
	methods: {
		async getCateList() {
			const { data: res } = await this.$http.get('categories', {
				params: this.queryInfo
			})
			if (res.meta.status == 200) {
				console.log(res.data)
				this.cateList = res.data.result
				this.total = res.data.total
			} else {
				this.$message.error('获取分类失败了')
			}
		},
		async getParentCateList() {
			const { data: res } = await this.$http.get('categories', {
				params: { type: 2 }
			})
			if (res.meta.status == 200) {
				console.log(res.data)
				this.ParentCateList = res.data
			} else {
				this.$message.error('获取父级分类失败了')
			}
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getCateList()
		},
		showModal() {
			this.getParentCateList()
			this.visible = true
			console.log(this.selectedKey)
		},
		handleOk() {
			this.$refs.addFormRef.validate(async vaild => {
				if (vaild) {
					const { data: res } = await this.$http.post(
						'categories',
						this.addForm
					)
					console.log(res)
					if (res.meta.status == 201) {
						this.visible = false
						this.$message.success('添加分类信息成功')
					} else {
						return this.$message.error('添加分类信息失败')
					}
				} else {
					return
				}
				this.visible = false
				this.getCateList()
				this.$refs.addFormRef.resetFields()
				this.selectedKey = []
				this.addForm.cat_pid = 0
				this.addForm.cat_level = 0
			})
		},
		handleClose() {
			this.$refs.addFormRef.resetFields()
			this.selectedKey = []
			this.addForm.cat_pid = 0
			this.addForm.cat_level = 0
		},
		handleChange() {
			console.log(this.selectedKey)
			if (this.selectedKey > 0) {
				this.addForm.cat_pid = this.selectedKey[
					this.selectedKey.length - 1
				]
				this.addForm.cat_level = this.selectedKey.length
			} else {
				this.addForm.cat_pid = 0
				this.addForm.cat_level = 0
			}
		},
		async deleteCate(id) {
			const result = await this.$confirm(
				'此操作将永久删除该分类, 是否继续?',
				'删除分类',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(async () => {
					console.log(id)
					const { data: res } = await this.$http.delete(
						'categories/' + id
					)
					if (res.meta.status == 200) {
						this.$message.success('删除分类成功')
						this.getCateList()
					} else {
						return this.$message.error('删除分类失败')
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		async showEditModal(id) {
			const { data: res } = await this.$http.get('categories/' + id)
			if (res.meta.status == 200) {
				this.editForm = res.data
			} else {
				this.$message.error('获取分类信息失败')
			}
			this.visibleEdit = true
		},
		handleEditOk() {
			this.$refs.editFormRef.validate(async vaild => {
				if (vaild) {
					const { data: res } = await this.$http.put(
						'categories/' + this.editForm.cat_id,
						{
							cat_name: this.editForm.cat_name
						}
					)
					if (res.meta.status == 200) {
						this.visibleEdit = false
						this.getCateList()
						this.$message.success('更新分类信息成功')
					} else {
						return this.$message.error('更新分类信息失败')
					}
				} else {
					return
				}
			})
		},
		handleEditClose() {
			this.$refs.editFormRef.resetFields()
		}
	},
	created() {
		this.getCateList()
	}
}
</script>
<style lang="less" scoped>
.pagination {
	float: right;
	margin-top: 30px;
}
</style>