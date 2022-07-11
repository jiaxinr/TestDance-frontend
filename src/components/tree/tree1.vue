<template>
  <div id="container">
  </div>
</template>

<script>
// 引入antv-G6
import G6 from '@antv/g6'
//import MiddleUtil from "@/plugins/MiddleUtil";
import {getReportRoots} from "@/api/tree";
//import {getReportRoots} from "@/api/tree";

// 树图的数据
// import {treedata} from './treeJS1'
// G6的配置项
G6.registerNode(
    'icon-node',
    {
      options: {
        size: [20, 10], // 宽高
        stroke: '#91d5ff', // 变颜色
        fill: '#fff'// 填充色
      },
      // draw是绘制后的附加操作-节点的配置项  图形分组，节点中图形对象的容器
      draw(cfg, group) {
        // 获取节点的配置
        const styles = this.getShapeStyle(cfg)
        // 解构赋值
        const {labelCfg = {}} = cfg

        const w = styles.width
        const h = styles.height
        // 向分组中添加新的图形 图形 配置 rect矩形 xy 代表左上角坐标 w h是宽高
        const keyShape = group.addShape('rect', {
          attrs: {
            ...styles,
            x: -w / 2,
            y: -h / 2
          }
        })

        // 文本文字的配置
        if (cfg.label) {
          group.addShape('text', {
            attrs: {
              ...labelCfg.style,
              text: cfg.label,
              x: 50 - w / 2,
              y: 25 - h / 2
            }
          })
        }
        return keyShape
      },
      // 更新节点后的操作，一般同 afterDraw 配合使用
      update: undefined
    },
    'rect'
)
G6.registerEdge('flow-line', {
  // 绘制后的附加操作
  draw(cfg, group) {
    // 边两端与起始节点和结束节点的交点；
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    // 边的配置
    const {style} = cfg
    const shape = group.addShape('path', {
      attrs: {
        stroke: style.stroke, // 边框的样式
        endArrow: style.endArrow, // 结束箭头
        // 路径
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
          ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
          ['L', endPoint.x, endPoint.y]
        ]
      }
    })
    return shape
  }
})
// 默认的鼠标悬停会加粗,边框颜色改变

export default {
  name: 'proTree',
  methods: {
    G6init() {
      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model');
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: 'cubic-horizontal',
        },
        layout: {
          type: 'dendrogram',
          direction: 'LR', // H / V / LR / RL / TB / BT
          nodeSep: 30,
          rankSep: 100,
        },
      });

      graph.node(function (node) {
        return {
          label: node.id,
          labelCfg: {
            position: node.children && node.children.length > 0 ? 'left' : 'right',
            offset: 5,
          },
        };
      });

      graph.data(this.treedata);
      graph.render();
      graph.fitView();

      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    },
    // getRootList() {
    //   let res=MiddleUtil.$emit('getRootReportList');
    //   console.dir(res);
    //   this.treedata.children=res;
    // },
  },
  async mounted() {
    this.treedata['id']='本项目';
    this.treedata['children']=[];

    const res = await getReportRoots(Number(this.pid), this.$store.state.token);
    res.forEach((item) => this.rootReportList.push(item));
    //console.log("now rootReportList is:"+JSON.stringify(this.rootReportList[0]['reportVO']));
    for(let i=0;i<this.rootReportList.length;i++){
      let tmp={};
      tmp['id']=this.rootReportList[i]['reportVO']['tid'].toString();
      //console.log(JSON.stringify(tmp));
      this.treedata['children'].push(tmp);
      //console.log(this.treedata['children']);
    }
    //this.treedata['children']=this.rootReportList;
    //await this.getRootList();
    this.G6init()
  },
  data(){
    return {
      treedata:{},
      rootReportList:[],
    }
  },
  props:{
    pid:Number,
  }
}
</script>
<style scoped>
#container {
  height: 30%;
  width: 100%;
}
</style>
