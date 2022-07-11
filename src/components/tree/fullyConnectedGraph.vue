<template>
  <div id="container">
  </div>
</template>

<script>
import G6 from '@antv/g6'
import {getRootsRelation} from "@/api/tree";

export default {
  name: 'fullyConnectedGraph',
  data() {
    return {
    }
  },

  props: {
    pid: Number
  },

  methods: {
    async G6init() {
      const res = await getRootsRelation(this.pid);
      const data = {
        nodes: [],
        edges: [],
      };
      const container = document.getElementById('container');
      //console.log("data:"+JSON.stringify(data.nodes))
      //console.log("传回的数据：" + JSON.stringify(res));
      const num = res.leftNodes.length;
      let tmpcnt = 0;
      for (let i in res.leftNodes) {
        if ((data.nodes.find(item => (item.id === res.leftNodes[i].tid.toString()))) === undefined) {
          data.nodes.push({
            id: res.leftNodes[i].tid.toString(),
            x: 200 + 150 * Math.cos(2 * Math.PI * tmpcnt / num),
            y: 100 + 150 * Math.sin(2 * Math.PI * tmpcnt / num),
            label: res.leftNodes[i].tid.toString(),
            style: {
              cursor: 'pointer'
            },
            labelCfg: {
              style: {
                cursor: 'pointer'
              }
            }
          })
          tmpcnt++;
        }
        if ((data.nodes.find(item => (item.id === res.rightNodes[i].tid.toString()))) === undefined) {
          data.nodes.push({
            id: res.rightNodes[i].tid.toString(),
            x: 200 + 150 * Math.cos(2 * Math.PI * tmpcnt / num),
            y: 100 + 150 * Math.sin(2 * Math.PI * tmpcnt / num),
            label: res.rightNodes[i].tid.toString(),
            style: {
              cursor: 'pointer'
            },
            labelCfg: {
              style: {
                cursor: 'pointer'
              }
            }
          })
          tmpcnt++;
        }
        data.edges.push({
          source:res.leftNodes[i].tid.toString(),
          target:res.rightNodes[i].tid.toString(),
          label:((res.simRate[i].toFixed(5))*100).toFixed(2).toString()+'%',
        })
      }


      const width = document.getElementById('container').scrollWidth;
      const height = document.getElementById('container').scrollHeight || 500;
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        // translate the graph to align the canvas's center, support by v3.5.1
        fitCenter: true,
        defaultNode: {
          type: 'circle',
          labelCfg: {
            style: {
              fill: '#1890ff',
              fontSize: 14,
              background: {
                fill: '#ffffff',
                stroke: '#9EC9FF',
                padding: [2, 2, 2, 2],
                radius: 2,
              },
            },
            position: 'bottom',
          },
        },
        fitView: true,
        fitViewPadding: [
          16,
          16,
          16,
          16
        ],
        modes: {
          default: ['drag-canvas', 'drag-node'],
        },
        nodeStateStyles: {
          // style configurations for hover state
          hover: {
            fillOpacity: 0.8,
          },
          // style configurations for selected state
          selected: {
            lineWidth: 5,
          },
        },
      });

      graph.data(data);
      graph.on('node:click', (e) => {
        this.$emit('click-report-node', Number(e['item']['_cfg']['id']));
      });
      graph.render();
      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!this.graph || this.graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          this.graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
      console.log("构造成功")
    }
  },
  mounted() {
    this.G6init()
  }
}
</script>
<style scoped>
#container {
  height: 100%;
  width: 100%;
}
</style>
