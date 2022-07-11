<template>
  <div class="Echarts">
    <div ref="echarts" style="width: 100%; height:100%;"></div>
  </div>
</template>

<script>
import {getReportTreeById} from "@/api/tree";

export default {
  name: 'proTree3',

  data(){
    return{
      reportList:[],
      reportNodeList:[],
      finalList:[],
    }
  },

  props: {
    tid: Number
  },

  methods: {
    init() {
      // eslint-disable-next-line no-undef
      const treedata=this.handleData();
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
      //console.log("已经在handleData里面了："+JSON.stringify(this.reportList));
      // this.reportNodeList.push({id:this.tid,parentId:null});//idproblem
      //console.log("测试一下"+JSON.stringify(this.reportList));
      const data=this.reportNodeList;

      const idMapping = data.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
      }, {});

      let root;
      data.forEach(el => {
        //当前节点高亮
        if (el.id === this.tid) {
          el['itemStyle'] = {
            color: '#FFD365'
          }
        }
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
      //console.log("old root:"+root);
      root=JSON.parse(root);
      //delete
      this.deleteID(root);
      //root=JSON.stringify(root);
      //console.log("new root:"+root);
      // console.dir(root);
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
      //console.log("分割好之后reportNodeList："+JSON.stringify(this.reportNodeList));
      //console.log("还有是reportList:"+JSON.stringify(this.reportList));

    }
  },
  async mounted() {
    const token = this.$store.state.token;

    const res=await getReportTreeById(this.tid,token);
    // const rptList=res.reportList;
    // console.log("list"+JSON.stringify(rptList));
    const rptNodeList=res.reportNodeList;
    //rptList.forEach(pro=>this.treeTransferAndAdd(pro));
    rptNodeList.forEach(pro=>this.treeNodeTransferAndAdd(pro));
    // console.log("这里是reportList:"+JSON.stringify(this.reportList));
    // console.log("这里是reportNodeList:"+JSON.stringify(this.reportNodeList));
    //this.reportList=this.reportList.concat(this.reportNodeList);
    //console.log("最终的数据："+JSON.stringify(this.reportList));
    //rptList.push(rptNodeList);
    //console.log("最终的数据："+JSON.stringify(rptList));
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
