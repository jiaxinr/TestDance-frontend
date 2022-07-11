<template>
  <div id="container">
  </div>
</template>

<script>
// 引入antv-G6
import G6 from '@antv/g6'
// 树图的数据
import { treedata } from './treeJS2'
// G6的配置项
G6.registerNode(
    'icon-node',
    {
      options: {
        size: [60, 20], // 宽高
        stroke: '#91d5ff', // 变颜色
        fill: '#fff'// 填充色
      },
      // draw是绘制后的附加操作-节点的配置项  图形分组，节点中图形对象的容器
      draw (cfg, group) {
        // 获取节点的配置
        const styles = this.getShapeStyle(cfg)
        // 解构赋值
        const { labelCfg = {} } = cfg

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
  draw (cfg, group) {
    // 边两端与起始节点和结束节点的交点；
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    // 边的配置
    const { style } = cfg
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
const defaultStateStyles = {
  hover: {
    stroke: '#1890ff',
    lineWidth: 2
  }
}

// 默认节点的颜色 边 圆角的配置
const defaultNodeStyle = {
  fill: '#fff',
  stroke: '#ccc',
  radius: 5
}

// 默认边的颜色 末尾箭头
const defaultEdgeStyle = {
  stroke: '#ccc'
}

// 默认布局
// compactBox 紧凑树布局
// 从根节点开始，同一深度的节点在同一层，并且布局时会将节点大小考虑进去。
const defaultLayout = {
  type: 'compactBox', // 布局类型树
  direction: 'TB', // TB 根节点在上，往下布局
  getId: function getId (d) { // 节点 id 的回调函数
    return d.id
  },
  getHeight: function getHeight () { // 节点高度的回调函数
    return 16
  },
  getWidth: function getWidth () { // 节点宽度的回调函数
    return 16
  },
  getVGap: function getVGap () { // 节点纵向间距的回调函数
    return 40
  },
  getHGap: function getHGap () { // 节点横向间距的回调函数
    return 70
  }
}

// 文本配置项
const defaultLabelCfg = {
  style: {
    fill: '#000',
    fontSize: 15
  }
}

export default {
  name: 'proTree2',
  methods: {
    G6init () {
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) return
          graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
      }
      // 获取容器
      const container = document.getElementById('container')
      // 获取容器的宽高
      const width = container.scrollWidth
      const height = container.scrollHeight || 500

      // Graph 是 G6 图表的载体-实例化
      const graph = new G6.TreeGraph({
        container: 'container', // 图的 DOM 容器
        width,
        height,
        linkCenter: true, // 指定边是否连入节点的中心
        //plugins: [menu], // 插件  minimap
        modes: { // 交互模式
          // default 模式中包含点击选中节点行为和拖拽画布行为;
          default: [
            {
              // 这个是可以展开可以收起
              type: 'collapse-expand',
              onChange: function onChange (item, collapsed) {
                const data = item.get('model')
                data.collapsed = collapsed
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        // 默认状态下节点的配置
        defaultNode: {
          type: 'icon-node',
          size: [120, 40],
          style: defaultNodeStyle,
          labelCfg: defaultLabelCfg
        },
        // 默认状态下边的配置，
        defaultEdge: {
          type: 'flow-line',
          style: defaultEdgeStyle
        },
        // 各个状态下节点的样式-，例如 hover、selected，3.1 版本新增。
        nodeStateStyles: defaultStateStyles,

        // 各个状态下边的样式-，例如 hover、selected，3.1 版本新增。
        edgeStateStyles: defaultStateStyles,
        // 布局配置项
        layout: defaultLayout
      })
      graph.data(treedata)

      // 根据提供的数据渲染视图。
      graph.render()
      // 让画布内容适应视口。
      graph.fitView()
      // 改变视口的缩放比例，在当前画布比例下缩放，是相对比例。
      graph.zoom(1)
    }
  },
  mounted () {
    this.G6init()
  }
}
</script>
<style scoped>
#container{
  height: 100%;
  width: 100%;
}
</style>
