<template>
  <div>
    <a-alert message="编辑商品" banner />
    <a-steps :current="currentIndex" style="margin-top:30px">
      <a-step title="基本信息" />
      <a-step title="商品参数" />
      <a-step title="商品属性" />
      <a-step title="商品图片" />
      <a-step title="商品内容" />
    </a-steps>
    <el-form label-width="150px" :model="editForm" :rules="editFormRules" ref="editFormRef">
      <el-tabs
        tab-position="left"
        style="margin-top:30px;"
        v-model="currentIndex"
        @tab-click="tabClicked"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)" prop="goods_price">
            <el-input-number v-model="editForm.goods_price" style="width:200px" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="商品重量(kg)" prop="goods_weight">
            <el-input-number v-model="editForm.goods_weight" style="width:200px" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input-number v-model="editForm.goods_number" style="width:200px" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_number">
            <el-cascader
              v-model="editForm.goods_cat"
              :options="cateList"
              :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children'}"
              @change="handleChange"
              :before-leave="beforeTabLeave"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="(item) in manyTableData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index" disabled></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="(item) in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals" style="width:400px" disabled></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="editForm.goods_introduce"></quill-editor>
          <a-button type="primary" size="large" style="margin-top:30px" @click="edit">提交</a-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
	data() {
		return {
			editForm: {},
			currentIndex: 0,
			cateList: [],
			manyTableData: [],
			onlyTableData: [],
			visiblePreview: false,
			PreviewPath: '',
			editFormRules: {
				goods_name: [
					{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}
				],
				goods_price: [
					{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					}
				],
				goods_weight: [
					{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur'
					}
				],
				goods_number: [
					{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur'
					}
				]
            },
            headersObj: {
				Authorization: window.sessionStorage.getItem('token')
			}
		}
	},
	created() {
		this.getGoodInfo(this.$route.query.id)
		this.getCateList()
	},
	methods: {
		async getGoodInfo(id) {
			console.log(id)
			const { data: res } = await this.$http.get('goods/' + id)
			if (res.meta.status == 200) {
				this.editForm = res.data
				console.log(this.editForm)
				console.log(this.editForm.goods_cat)
				this.editForm.goods_cat = this.editForm.goods_cat
					.split(',')
					.map(Number)
			} else {
				this.$message.error('获取商品息失败')
			}
		},
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
			console.log(this.editForm.goods_cat)
			if (this.editForm.goods_cat.length !== 3) {
				this.editForm.goods_cat = []
			}
		},
		async tabClicked() {
			console.log(this.currentIndex)
			if (this.currentIndex === '1') {
				const { data: res } = await this.$http.get(
					`categories/${this.editForm.goods_cat[2]}/attributes`,
					{
						params: {
							sel: 'many'
						}
					}
				)
				if (res.meta.status == 200) {
					res.data.forEach(item => {
						item.attr_vals =
							item.attr_vals.length === 0
								? []
								: item.attr_vals.split(' ')
					})
					this.manyTableData = res.data
				} else {
					this.$message.error('获取动态属性失败了')
				}
			} else if (this.currentIndex === '2') {
				const { data: res } = await this.$http.get(
					`categories/${this.editForm.goods_cat[2]}/attributes`,
					{
						params: {
							sel: 'only'
						}
					}
				)
				if (res.meta.status == 200) {
					this.onlyTableData = res.data
				} else {
					this.$message.error('获取动态属性失败了')
				}
			}
        },
        beforeTabLeave(activeName, oldActiveName) {
			console.log(activeName)
			console.log(oldActiveName)
			if (oldActiveName === '0' && this.editForm.goods_cat.length !== 3) {
				this.$message.error('请填写商品分类')
				return false
			}
		},
		handlePreview(file) {
			this.PreviewPath = file.response.data.url
			this.visiblePreview = true
		},
		handleRemove(file) {
			console.log(file)
			const filePath = file.response.data.tmp_path
			const i = this.editForm.pics.findIndex(x => x.pic === filePath)
			this.editForm.pics.splice(i, 1)
			console.log(this.editForm)
		},
		handleSuccess(response) {
			console.log(response)
			const picInfo = { pic: response.data.tmp_path }
			this.editForm.pics.push(picInfo)
			console.log(this.editForm)
		},
		edit() {
			console.log(this.editForm)
			this.$refs.editFormRef.validate(async vaild => {
				console.log(vaild)
				if (vaild) {
					//lodash cloneDeep(obj)
                    const form = _.cloneDeep(this.editForm)
                    	console.log(form)
					form.goods_cat = form.goods_cat.join(',')
					//处理动态参数
					this.manyTableData.forEach(item => {
						const newInfo = {
							attr_id: item.attr_id,
							attr_value: item.attr_vals.join(' ')
						}
						this.editForm.attrs.push(newInfo)
					})
					//处理静态参数
					this.onlyTableData.forEach(item => {
						const newInfo = {
							attr_id: item.attr_id,
							attr_value: item.attr_vals
						}
						this.editForm.attrs.push(newInfo)
					})
                    form.attrs = this.editForm.attrs
                    		console.log(form)

					//发起请求

					const { data: res } = await this.$http.put('goods/'+form.goods_id, {
                           goods_name:form.goods_name,
                           goods_cat:form.goods_cat,
                           goods_price:form.goods_price,
                           goods_number:form.goods_number,
                           goods_weight:form.goods_weight,
                           goods_introduce:form.goods_introduce,
                           pics:form.pics,
                           attrs:form.attrs
                    })
					if (res.meta.status == 200) {
						this.$message.success('编辑商品成功了')
						this.$router.push('/goods')
					} else {
						this.$message.error('编辑商品失败了')
					}
				} else {
					return this.$message.error('请填写表单的必填项')
				}
			})
		}
	}
}
</script>
<style lang="less" scoped>
</style>