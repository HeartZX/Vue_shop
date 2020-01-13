<template>
  <div>
    <a-row>
      <a-col :span="6">
        <!--   <a-input-search
          v-model="queryInfo.query"
          placeholder="请输入商品名称"
          @search="getUserList"
          enterButton
          size="large"
        />-->
        <a-input-search
          placeholder="请输入商品名称"
          v-model="queryInfo.query"
          @search="getGoodsList"
          enterButton
          size="large"
        />
      </a-col>
      <a-col :span="2" class="resetBtn">
        <a-button type="info" size="large" @click="resetGoodsList">重置</a-button>
      </a-col>
      <a-col :span="2" style="float:right">
        <a-button type="primary" size="large" @click="goAddPage">添加商品</a-button>
      </a-col>
    </a-row>
    <el-table :data="goodsList" highlight-current-row style="margin-top:30px">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格（元）" prop="goods_price" width="120px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="150px">
        <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goEditPage(scope.row.goods_id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float:right;margin-top:30px">
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

export default {
	data() {
		return {
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 8
			},
			goodsList: [],
			total: 0
		}
	},
	created() {
		this.getGoodsList()
	},
	methods: {
		async getGoodsList() {
			const { data: res } = await this.$http.get('goods', {
				params: this.queryInfo
			})
			console.log(res)
			if (res.meta.status == 200) {
				this.goodsList = res.data.goods
				this.total = res.data.total
				console.log(this.goodsList)
			} else {
				this.$message.error('获取商品列表失败了')
			}
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getGoodsList()
		},
		resetGoodsList() {
			this.queryInfo.query = ''
			this.getGoodsList()
		},
		async deleteGoods(id) {
			const result = await this.$confirm(
				'此操作将永久删除该商品, 是否继续?',
				'删除用户',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(async () => {
					console.log(id)
					const { data: res } = await this.$http.delete('goods/' + id)
					if (res.meta.status == 200) {
						this.$message.success('删除商品成功')
						this.getGoodsList()
					} else {
						return this.$message.error('删除商品失败')
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		goAddPage() {
			this.$router.push('/goods/add')
		},
		goEditPage(goodsId) {
			console.log(goodsId)
			this.$router.push({path:'/goods/edit',query:{id:goodsId}})
		}
	}
}
</script>
<style lang="less" scoped>
.resetBtn {
	margin-left: 30px;
}
</style>