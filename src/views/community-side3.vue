<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>社区服务 | 系统概览</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="ctn" style="display: inline-block">
      <a href="./community-side1" class="button b-green"><i class="el-icon-medal-1"></i> 为你推荐</a>
    </div>
    <div class="ctn" style="display: inline-block">
      <a href="./community-side2" class="button b-green"><i class="el-icon-s-opportunity"></i> 潜力协作</a>
    </div>
    <div class="ctn" style="display: inline-block">
      <a href="./community-side3" class="button b-green"><i class="el-icon-s-marketing"></i> 系统概览</a>
    </div>
    <br><br><br>

    <div class="graphBox">
    <bar-graph1 class="graph" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px"></bar-graph1>
    <bar-graph2 class="graph" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px"></bar-graph2>
    <br>
    <bar-graph3 class="graph" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px"></bar-graph3>
    <bar-graph4 class="graph" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px"></bar-graph4>
  </div>
  </div>
</template>

<script>
export default {
  name: "community-side3"
}
</script>

<style scoped>
body, .button:after {
  background: #e4fbfb;
}

.ctn {
  position: relative;
  top: 30px;
}

.b-green, .b-green:before {
  background: rgba(73, 155, 234, 1);
  background: -moz-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: -webkit-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: -o-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: -ms-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#499bea', endColorstr='#1abc9c', GradientType=1);
}
.graphBox{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.graph{
  flex: 50%
}

.button {
  display: inline-block;
  position: relative;
  border-radius: 3px;
  text-decoration: none;
  padding: .5em;
  margin: .5em;
  font-size: 2em;
  font-weight: bold;
  transition: all .5s;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Permanent Marker', cursive;
}

.button:hover {
  text-shadow: 0px 0px 0px rgba(255, 255, 255, .75);
}

.button:hover:after {
  left: 100%;
  top: 100%;
  bottom: 100%;
  right: 100%;
}

.button:before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  border-radius: 5px;
  transition: all .5s;
}

.button:after {
  content: '';
  display: block;
  position: absolute;
  left: 2px;
  top: 2px;
  bottom: 2px;
  right: 2px;
  z-index: -1;
  border-radius: 5px;
  transition: all .5s;
}

/*ROTATE*/
.rot-360-noscoop:hover {
  filter: hue-rotate(360deg);
  transform: rotate(360deg);
}

.rot-135:hover {
  filter: hue-rotate(135deg);
}

.rot-90:hover {
  filter: hue-rotate(90deg);
}
</style>