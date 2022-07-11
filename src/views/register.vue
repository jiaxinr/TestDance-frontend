<template>
  <div>
    <navigation-bar></navigation-bar>
    <!--  <img src = 'https://s3.bmp.ovh/imgs/2021/11/d885d1fa11d64e7d.gif' style="margin: 0 auto"/>-->
    <img src="../assets/img2.png" alt=" " style="position: absolute;top: 125px;right: 40px;width: 870px">
    <img src="../assets/bottomL.png" style="position: absolute;bottom: 0;left: 0" alt=" ">
    <form class="logform">
      <h1>注册</h1>
      <div class="log">
        <el-select id="statusRE" v-model="userRole" size="20px" placeholder="身份">
          <el-option
              style="padding-left: 10px"
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="log">
        <div id="greyid">请输入用户名</div>
        <input type="text" v-model="username">
      </div>
      <div class="log">
        <div id="greyid">请输入手机号</div>
        <input type="text" v-model="phone" :rules="rules1">
      </div>
      <div class="log">
        <div id="greyid">请输入密码</div>
        <input type="password" v-model="password">
      </div>
      <input type="submit" class="logbtn" value="点击注册" @click.prevent="handleRegister">
      <div class="bottom-text">
        已注册了账号？
        <router-link to="./login">点此登录</router-link>
      </div>
    </form>

  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {register} from "@/api/user";

export default {
  name: "registerPage",
  components: {
    navigationBar,
  },
  data() {
    return {
      username: "1",
      password: "1",
      phone: "1",
      userRole: "WORKER",
      options: [
        {
          value: 'HIRER',
          label: '发包方'
        },
        {
          value: 'WORKER',
          label: '众包工人'
        },
      ],
      value: '',
      rules1: [
        value => !!value || '不能为空',
      ],
    }
  },
  methods: {
    async handleRegister() {
      await register({
        uname: this.username,
        password: this.password,
        phone: this.phone,
        userRole: this.userRole
      }).then(res => {
        console.log(typeof (res.data.success));
        if (res.data.success === true) {
          window.localStorage.setItem("userId", res.data.id);
          window.localStorage.setItem("userPhone", res.data.phone);
          window.localStorage.setItem("username", res.data.uname);
          window.localStorage.setItem("userRole", res.data.userRole);
          this.username = res.data.uname;
          this.$message({
            showClose: true,
            message: '注册成功！',
            type: 'success'
          });
          this.$router.push(`/login`)
        } else {
          console.log("error is:" + res);
          this.$message({
            showClose: true,
            message: '注册失败，请检查填写信息是否合规',
            type: 'error'
          });
        }
        }).catch( res => {
          console.log(res);
          this.$message({
            showClose: true,
            message: '注册失败，请检查填写信息是否合规并重试',
            type: 'error'
          });
      })
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  font-family: montserrant;
  box-sizing: border-box;
  box-shadow: azure;
}

.logform {
  width: 360px;
  background: white;
  height: 660px;
  padding: 80px 40px;
  border-radius: 10px;
  position: relative;
  left: 30%;
  top: 400px;
  transform: translate(-50%, -50%);
}

.logform h1 {
  text-align: center;
  margin-bottom: 25px;
}

.log {
  border-bottom: 2px solid #adadad;
  position: relative;
  margin: 30px 0;
}

.log input {
  font-size: 17px;
  color: #333;
  border: none;
  width: 100%;
  outline: none;
  background: none;
  padding: 0 5px;
  height: 40px;
}

.logbtn {
  display: block;
  width: 100%;
  height: 50px;
  border: none;
  background: linear-gradient(120deg, #90d0db, #69b1db, #90d0db);
  background-size: 200%;
  color: #fff;
  outline: none;
  cursor: pointer;
  transition: .5s;
}

.logbtn:hover {
  background-position: right;
}

.bottom-text {
  margin-top: 60px;
  text-align: center;
  font-size: 13px;
}

#greyid {
  color: #a9a9a9;
}


</style>