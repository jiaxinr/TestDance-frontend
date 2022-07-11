<template>
  <div>
  <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  <el-container>
    <el-aside>
      <el-row class="tac">
        <el-menu
            default-active="2"
            class="el-menu-vertical"
            style="margin-top: 77px">
          <br>
          <h3 style="position: relative;text-align: center">项目名字</h3><br>
          <div style="text-align: center">
            <el-button round size="mini" type="primary" @click="gotoSquare">切换项目</el-button>
          </div>
          <el-divider></el-divider>
          <el-menu-item index="1" @click="gotoSide1">
            <i class="el-icon-menu"></i>
            <span slot="title">缺陷管理</span>
          </el-menu-item>

          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">文件管理</span>
          </el-menu-item>
        </el-menu>
      </el-row>
    </el-aside>
    <el-main>
      <el-button round @click="gotoRelease" style="float: right;margin: 8px;">
        <i class="el-icon-circle-plus" id="addTask">提交报告</i>
      </el-button>
      todo文件管理
      <div display="inline-block" style="margin-top: 8px;color: #555555">
        共 45 条，当前显示 10 条
      </div>
      <el-pagination
          display="inline-block"
          background
          layout="prev, pager, next"
          :total="43"
      style="float: right; margin-top: 8px">
      </el-pagination>
    </el-main>
  </el-container>
  </div>

</template>

<script>
import navigationBar from "@/components/navigationBar";

export default {
  name: "manageP-side2",

  components:{
    navigationBar
  },

  data(){
    return {
      tableData:[{
        date:'2022-02-02',
        name:'夹心卷',
        curr:10,
        total:28,
        kind:'功能测试',
        status:'已结束',
        detail:<el-button style="float: right; padding: 8px 8px 8px;background-color:#D4E6F1" type="button" >查看详细信息</el-button>
      }]
    }
  },

  methods:{
    gotoRelease(){
      this.$router.push('./taskRelease')
    },
    gotoDetail(){
      this.$router.push('./taskDetailH')//根据id及角色判断
    },
    gotoSquare(){
      this.$router.push('./squareP')
    },
    gotoSide1(){
      this.$router.push('./manageP-side1')
    }
  },

  mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'WORKER' && this.$store.state.role !== 'ADMIN')) {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>