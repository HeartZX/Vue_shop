<template>
  <div>
    <div id="main" style="width: 80%;height:500px;"></div>
  </div>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // domy元素已经被渲染完了
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status === 200) {
      // 使用刚指定的配置项和数据显示图表。
      const result = _.merge(res.data, this.options)
      myChart.setOption(result)
    } else {
      this.$message.error('获取折线图失败')
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
