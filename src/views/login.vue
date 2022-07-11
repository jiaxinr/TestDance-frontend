<template>
  <div>
    <navigation-bar></navigation-bar>
    <br>
    <img src="../assets/img2.png" alt=" " style="position: absolute;top: 125px;left: 40px;width: 870px">
    <img src="../assets/bottomR.png" style="position: absolute;bottom: 0;right: 0" alt=" ">
    <form class="logform">
      <h1>登录</h1>
      <div class="log">
        <div id="greyid">手机号</div>
        <input type="text" v-model="phone">
      </div>
      <div class="log">
        <div id="greyid">密码</div>
        <input type="password" v-model="password">
      </div>

      <input type="submit" class="logbtn" value="点击登录" @click.prevent="gotoLogin">
      <div class="bottom-text">
        还没有账号？
        <router-link to="/register">点此注册</router-link>
        <br>
        <br>
        或
        <router-link to="/squareP">游客身份浏览</router-link>
      </div>
    </form>


  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {login} from "@/api/user";
import {mapMutations, mapActions} from 'vuex';
import {windowsStoreUserState} from "@/main";


export default {
  name: 'loginPage',
  components: {
    navigationBar
  },
  data: function () {
    return {
      title: "TestDance众包测试平台",
      uname: "",
      phone: "",
      pswd: "",
      formDate: {
        username: '',
        password: ''
      },
      userToken: '',
      ruleInline: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['SET_USER_LOGIN_INFO', 'CHANGE_LOGIN']),
    ...mapActions(['login']),
    handleSubmit() {
      let params = {
        'username': this.formDate.username,
        'password': this.formDate.password
      };
      this.$axios.post("/user/login", params).then(res => {
        console.log(res.data);
        this.userToken = res.data.token;
        this.CHANGE_LOGIN({Authorization: this.userToken});
        this.$router.push('/');
      }).catch(error => {
        console.log(error);
        this.$Message.error("登陆失败，请检查登录信息是否正确。")
      });
    },
    gotoLogin() {
      login({
        phone: this.phone,
        password: this.password
      }).then(res => {
        console.log(res);
        const userData = res.data;

        windowsStoreUserState({
          token: res.headers.token,
          uname: userData.uname,
          uid: userData.id,
          role: userData.userRole,
          avatar_url: userData.avatorUrl,
          grade: userData.grade
        });

        this.$store.commit('setToken', res.headers.token);
        this.$store.commit('setUser', {
          uid: userData.id,
          role: userData.userRole,
          uname: userData.uname,
          avatar_url: userData.avatorUrl,
          grade: userData.grade
        });

        this.$message({
          showClose: true,
          message: '登陆成功！',
          type: 'success'
        });
        if(this.$store.state.role==='HIRER'){
          this.$router.push(`/squareH`);
        }
        else {
          this.$router.push(`/squareP`)
        }
      }).catch(error => {
        console.log(error);
        this.$message({
          showClose: true,
          message: '登陆失败，请检查登录信息是否正确',
          type: 'error'
        });
      })
    }
  },
  // store
}
</script>

<style>
body {
  min-height: 100vh;
  background-image: linear-gradient(120deg, #f2ffff, #d1f6f6)
}

img#logo {
  width: 200px;
}

.logform {
  width: 360px;
  background: white;
  height: 580px;
  padding: 80px 40px;
  border-radius: 10px;
  position: relative;
  left: 70%;
  top: 350px;
  transform: translate(-50%, -50%);
}

.logform h1 {
  text-align: center;
  margin-bottom: 60px;
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
