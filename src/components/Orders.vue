<template>
  <div>
    <a-row>
      <a-col :span="6">
        <a-input-search
          v-model="queryInfo.query"
          placeholder="请输入关键字"
          @search="getOrderList"
          enterButton
          size="large"
        />
      </a-col>
      <a-col :span="2" style="margin-left:30px">
        <a-button type="info" size="large" @click="resetOrderList">重置</a-button>
      </a-col>
    </a-row>
    <el-table :data="orderList" highlight-current-row>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_id"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="130px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEditAddressModal">查看地址</el-button>
          <el-button type="success" size="mini" @click="showProgressModal">物流进度</el-button>
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
    <a-modal
      title="编辑地址"
      v-model="visibleAddress"
      @ok="handleOkAddress"
      @cancel="handleCloseAddress"
      okText="确认"
      cancelText="取消"
      width="50%"
    >
      <el-form
        label-width="90px"
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
      >
        <el-form-item label="省市区" prop="provinces">
          <el-cascader
            :options="cityData"
            v-model="addressForm.provinces"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAddress">
          <el-input v-model="addressForm.detailedAddress"></el-input>
        </el-form-item>
      </el-form>
    </a-modal>
    <a-modal
      title="物流进度"
      v-model="visibleProgress"
      okText="确认"
      cancelText="取消"
      width="50%"
      :footer="null"
    >
    <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
    
    </a-modal>
  </div>
</template>
<script>
import cityData from '../assets/citydata.js'
export default {
	data() {
		return {
			orderList: [],
			addressForm: {
				provinces: [],
				detailedAddress: ''
			},
			addressFormRules: {
				provinces: [
					{
						required: true,
						message: '请输入省市区',
						trigger: 'blur'
					}
				],
				detailedAddress: [
					{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}
				]
			},
            cityData,
            progressInfo:[],
			visibleAddress: false,
			visibleProgress: false,
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 8
			},
			total: 0
		}
	},
	methods: {
		async getOrderList() {
			const { data: res } = await this.$http.get('orders', {
				params: this.queryInfo
			})
			if (res.meta.status == 200) {
				console.log(res)
				this.total = res.data.total
				this.orderList = res.data.goods
			} else {
				this.$message.error('获取订单列表失败')
			}
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getOrderList()
		},
		resetOrderList() {},
		showEditAddressModal() {
			this.visibleAddress = true
		},
		handleOkAddress() {},
		handleCloseAddress() {
			this.$refs.addressFormRef.resetFields()
		},
		async showProgressModal() {
			this.visibleProgress = true
            const { data: res } = await this.$http.get('/kuaidi/1106975712662')
            if(res.meta.status==200){
                this.progressInfo=res.data
                console.log(this.progressInfo)

            }else{
                this.$message.error('获取物流信息失败')
            }
		}
	},
	created() {
		this.getOrderList()
	}
}
</script>
<style lang="less" scoped>
</style>