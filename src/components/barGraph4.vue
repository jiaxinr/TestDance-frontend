<template>
  <div className="Echarts">
    <div id="main4" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import {getReportQualityData} from "@/api/statistic";

export default {
  name: 'barGraph4',
  methods: {
    async init() {
      const d = {
        title: {
          text: '报告有效性得分',
          x:'center'
        },
        tooltip: {},
        xAxis: {
          data: ['0-1分', '1-2分', '2-3分', '3-4分', '>5分']
        },
        yAxis: {},
        series: [{
          name: '报告数',
          type: 'bar',
          data: [1,2,3,4,5]
        }]
      };

      const res=await getReportQualityData();
      d.series[0].data=res.reportAvgScoreList;
      console.log("here is:"+d.series[0].data)
      var echarts = require('echarts');
// 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main4'));
// 绘制图表
      myChart.setOption(d);
    }
  },
  mounted() {
    this.init();
  }

}
</script>

<style>

</style>