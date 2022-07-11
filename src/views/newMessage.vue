<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>新消息提醒</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <h2 style="position: relative;text-align:center;top:25px">新消息通知</h2>
    <el-table
        :data="tableData"
        stripe
        style="width: 80%;margin: auto;top:50px">
      <el-table-column
        prop="nid"
        label="编号"
        width="120">
      </el-table-column>
      <el-table-column
          style="white-space: pre-wrap"
          prop="content"
          label="内容"
          min-width="230">
      </el-table-column>
      <el-table-column
          prop="time"
          label="时间"
          width="210">
      </el-table-column>
      <el-table-column
        prop="delete"
        label="操作"
        width="100">
        <template slot-scope="scope">
        <el-button type="info" @click="doDel(scope.row)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>

</template>

<script>
import navigationBar from "@/components/navigationBar";
import {deleteNotify, getAllNotify} from "@/api/notify";

// document.getElementById("del").addEventListener("click",function (){
//   deleteNotify(nid);
// })


export default {
  name: "newMessage",
  components: {
    navigationBar,
  },
  data() {
    return {
      tableData: [],
    }
  },
  async mounted() {
    if (this.$store.getters.isLogin === false) {
      await this.$router.push('/login');
    }
    const res = await getAllNotify(this.$store.state.uid);
    //console.log("message is:"+res);
    const messageList = res;//todo 这一段还要根据后端传过来的具体数据进行修改
    messageList.forEach(msg => this.msgAdd(msg));
  },
  methods: {
    async msgAdd(msg) {
      let msgTmp=msg.message;
      console.log("msgTmp:"+msgTmp)
      this.tableData.unshift({
        nid: msg.nid,
        content: msgTmp,
        time:(new Date(msg.createTime)).formatting("yy-MM-dd hh:mm:ss"),
      });
    },

    doDel(row){
      const nid=row.nid;
      console.log("nid:"+nid);
      deleteNotify(nid);
      this.$message({
        message: '删除成功',
        type: 'success'
      });
      setTimeout(function (){
        history.go(0);
      },1000);
    }

  }
}
</script>

<style scoped>
el-table {
  white-space: pre;
}
::v-deep .el-table .cell {
  white-space: pre-line;
}
</style>