<template>
  <div class="Echarts">
    <div ref="echarts" style="width: 100%; height:100%;"></div>
  </div>
</template>

<script>
import {getReportRoots, getReportTreeById} from "@/api/tree";

export default {
  name: 'ProjectTree',

  data(){
    return{
      tid: 1,
      rootReportList: [],
      reportList:[],
      reportNodeList:[],
      finalList:[],
      projectTreeData: {},
    }
  },

  props: {
    pid: Number
  },

  methods: {
    init() {
      // eslint-disable-next-line no-undef
      const treedata=this.projectTreeData
      let echarts = require('echarts');
// 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.echarts);
// 绘制图表
      myChart.setOption({
        title: {
          text: '报告协作 fork 关系图',
          subtext: '( 数字表示报告ID，单击可以查看详情 )'
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [{
          type: 'tree',
          data: [treedata],
          symbolSize: 35,
          layout: 'orthogonal',
          orient: 'TB',
          expandAndCollapse: false,
          top: '20%',
          // height: '200px',
          zoom: 1,
          // edgeShape : 'polyline',
          emphasis: {
            disable: false,
            // focus: 'descendant',
            itemStyle: {
              color: '#2FA4FF',
            }
          },
        }]
      });
      myChart.on('click',  (event) => {
        this.$emit('click-report-node', Number(event.data.name));
      });
    },

    handleData:function(){
      const data=this.reportNodeList;

      const idMapping = data.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
      }, {});

      let root;
      data.forEach(el => {
        // 判断根节点
        if (el.parentId === 0 || el.parentId === null) {
          root = el;
          return;
        }
        // 用映射表找到父元素
        const parentEl = data[idMapping[el.parentId]];
        // 把当前元素添加到父元素的`children`数组中
        parentEl.children = [...(parentEl.children || []), el];
      });
      root=JSON.stringify(root).replace(/id/g,"name");

      root=JSON.parse(root);
      //delete
      this.deleteID(root);

      return root;
    },

    deleteID(obj){
      for(let prop in obj){
        if (prop === 'parentId') delete obj[prop];
        else if(typeof obj[prop]==='object') this.deleteID(obj[prop]);
      }
    },
    treeNodeTransferAndAdd(pro){
      this.reportNodeList.push({
        id:pro.tid,
        parentId: pro.parentTid,
      });
    }
  },
  async mounted() {
    const token = this.$store.state.token;

    this.projectTreeData['name'] = '0';
    this.projectTreeData['children'] = [];

    const rootList = await getReportRoots(this.pid, token);
    rootList.forEach((item) => {
      this.rootReportList.push(item['reportVO']);
    });

    for (const reportVO of this.rootReportList) {
      const rootTid = reportVO['tid'];
      this.tid = rootTid;
      const res= await getReportTreeById(rootTid,token);
      const rptNodeList= res.reportNodeList;
      rptNodeList.forEach(pro=>this.treeNodeTransferAndAdd(pro));
      const subTreeData = this.handleData();
      this.projectTreeData['children'].push(subTreeData);
    }

    this.init();
  },


}
</script>

<style>
.Echarts {
  width: 100%;
  height: 100%;
}
</style>