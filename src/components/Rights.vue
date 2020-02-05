<template>
  <div>
    <div class="rightsTable">
      <el-table :data="rightsList" highlight-current-row>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope='scope'>
            <a-tag color="cyan" v-if="scope.row.level==='0'">一级</a-tag>
            <a-tag color="green" v-else-if="scope.row.level==='1'">二级</a-tag>
            <a-tag color="orange" v-else>三级</a-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status == 200) {
        this.rightsList = res.data
        console.log(this.rightsList)
      } else {
        this.$message.error('获取权限列表失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rightsTable {
	padding: 20px;
}
</style>
