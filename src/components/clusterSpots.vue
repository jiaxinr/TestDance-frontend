<template>
  <div class="Echarts">
    <div ref="echarts" id="main" style="width: 190%; height:500%;"></div>
  </div>
</template>

<script>
// import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import {countInfo} from "@/api/tree";

export default {
  name: "clusterSpots",
  methods: {
    async init() {
      let echarts = require('echarts');

      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);
      var option;

// See https://github.com/ecomfe/echarts-stat
      echarts.registerTransform(ecStat.transform.clustering);

      const res = await countInfo(this.pid);
      this.rootCount=res.rootCount;
      this.subtreeNodeCountList=res.subtreeNodeCountList;


      const data = [];
      for(let i=0;i<this.rootCount;i++) {
        let tmpx=(Math.random()-0.5)*10;
        let tmpy=(Math.random()-0.5)*10;
        data.push([tmpx,tmpy])
        for(let j=0;j<this.subtreeNodeCountList[i];j++){
          data.push([tmpx+(Math.random()-0.5)*2,tmpy+(Math.random()-0.5)*2])
        }
      }

      var CLUSTER_COUNT = this.rootCount;//需要的数据是：有几个父报告，每个父报告分别对应总共多少子孙（数组表示）
      var DIENSIION_CLUSTER_INDEX = 2;
      var COLOR_ALL = [
        '#854BC1',
        '#e06343',
        '#37a354',
        '#b55dba',
        '#b5bd48',
        '#8378EA',
        '#487187',
        '#96BFFF',
        '#2034ee',
      ];
      var pieces = [];
      for (var i = 0; i < CLUSTER_COUNT; i++) {
        pieces.push({
          value: i,
          label: 'cluster ' + i,
          color: COLOR_ALL[i]
        });
      }
      option = {
        dataset: [
          {
            source: data
          },
          {
            transform: {
              type: 'ecStat:clustering',
              // print: true,
              config: {
                clusterCount: CLUSTER_COUNT,
                outputType: 'single',
                outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
              }
            }
          }
        ],
        tooltip: {
          position: 'top'
        },
        visualMap: {
          type: 'piecewise',
          top: 'middle',
          min: 0,
          max: CLUSTER_COUNT,
          left: 10,
          splitNumber: CLUSTER_COUNT,
          dimension: DIENSIION_CLUSTER_INDEX,
          pieces: pieces
        },
        grid: {
          left: 120
        },
        xAxis: {},
        yAxis: {},
        series: {
          type: 'scatter',
          encode: {tooltip: [0, 1]},
          symbolSize: 15,
          itemStyle: {
            borderColor: '#555'
          },
          datasetIndex: 1
        }
      };

      option && myChart.setOption(option);

    }
  },
  async mounted() {
    await this.init();
  },
  data() {
    return {
      rootCount:0,
      subtreeNodeCountList:[],
    }
  },
  props: {
    pid: Number
  },
}
</script>

<style scoped>
.Echarts {
  width: 100%;
  height: 100%;
}
</style>