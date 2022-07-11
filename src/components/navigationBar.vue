<template>
  <div class="nav">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="position: sticky;color: black">
      <el-menu-item index="0"><img :src="require('../assets/TestDance-logo.png')" style="height: 50px"> </el-menu-item>
      <el-menu-item index="1" @click="routeToHome()">首页</el-menu-item>
      <el-menu-item index="2" v-if="this.$store.state.role === 'HIRER'" @click="routeToSquareH">任务广场</el-menu-item>
      <el-menu-item index="2" v-else-if="this.$store.state.role === 'ADMIN'" @click="routeToSquareH">任务广场</el-menu-item>
      <el-menu-item index="2" v-else @click="routeToSquareP">任务广场</el-menu-item>
      <el-menu-item index="3">
        <div v-if="this.$store.state.role === 'HIRER'" @click="routeToManageH()">任务管理</div>
        <div v-else-if="this.$store.state.role === 'WORKER'" @click="routeToManageP()">任务管理</div>
        <div v-else-if="this.$store.state.role === 'ADMIN'" @click="routeToManageAdmin()">任务管理</div>
        <div v-else @click="routeToLogin()">任务管理</div>
      </el-menu-item>
      <el-menu-item index="7" @click="routeToCommunity()">社区服务</el-menu-item>
      <el-menu-item index="4" v-if="this.$store.state.role === 'HIRER'" @click="routeToReleaseTask()">发布任务</el-menu-item>
      <el-menu-item index="5" style="float: right">
        <div v-if="this.$store.getters.isLogin === false" @click="routeToRegis()">注册</div>
        <div v-else @click="logout()">
          <span>退出登陆</span>
        </div>
      </el-menu-item>
      <el-menu-item index="6" style="float: right">
        <div v-if="this.$store.getters.isLogin === false" @click="routeToLogin()">登录</div>
        <div v-else @click="routeToInfo()">
          <span>{{ this.$store.state.uname }}</span>
        </div>
      </el-menu-item>
      <el-menu-item index="8" style="float: right">
        <div v-if="this.$store.getters.isLogin===false" @click="routeToLogin"></div>
        <div v-else @click="routeToMessage()">
          <span><i class="el-icon-message"></i></span>
        </div>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
import {windowsDeleteUserState} from '@/main'
//import {getUser} from "@/api/user";

export default {
  name: "navigationBar",
  methods:{
    handleSelect(key,keyPath){
      console.log(key,keyPath);
    },
    refreshUserInfo() {
      let uid=this.$store.state.uid;
      console.log("uid:"+uid);
      return uid;
    },

    routeToReleaseTask() {
      this.$router.push('/taskRelease');
    },

    logout() {
      windowsDeleteUserState();
      this.$store.commit('deleteUser');
      this.$router.push('/login');
    },

    routeToInfo(){
      let uid=this.refreshUserInfo();
      this.$router.push(`/personInfo/${uid}`);
    },
    routeToHome(){
      this.$router.push(`/`);
    },
    routeToSquareH(){
      this.$router.push(`/squareH`);
    },
    routeToSquareP(){
      this.$router.push(`/squareP`);
    },
    routeToManageH(){
      this.$router.push(`/manageH-side1`);
    },
    routeToManageP(){
      this.$router.push(`/manageP-side1`);
    },
    routeToLogin(){
      this.$router.push(`/login`);
    },
    routeToRegis(){
      this.$router.push(`/register`);
    },
    routeToCommunity(){
      this.$router.push(`/community-side1`);
    },
    routeToManageAdmin() {
      this.$router.push(`/manageAdmin-side1`);
    },
    routeToMessage(){
      let uid=this.refreshUserInfo();
      this.$router.push(`/newMessage/${uid}`);
    },
  },

  data(){
    return{
      activeIndex:'',
    }
  },
}
</script>

<style scoped>
.nav{
  color: #69b1db;
}
.el-menu-item{
  color: black !important;
}
</style>