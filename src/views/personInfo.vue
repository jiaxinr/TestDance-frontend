<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);width: 90%;text-align: center;position: relative;left: 5%;top:30px;background-color: white;padding: 10px 50px">
      <el-descriptions title="个人信息">
        <el-descriptions-item label="用户名">{{userInfo.uname}}</el-descriptions-item>
        <el-descriptions-item label="角色">{{userInfo.role}}</el-descriptions-item>
        <el-descriptions-item label="手机号码">{{userInfo.phone}}</el-descriptions-item>
        <el-descriptions-item label="等级">{{userInfo.grade}}</el-descriptions-item>
        <el-descriptions-item label="称号">{{userInfo.gradeName}}</el-descriptions-item>
      </el-descriptions>
    </el-container>
    <br><br>


    <el-container>
      <el-aside width="30%">
        <!--    <div class="typing animate" style="position: relative;top: 80px"></div>-->
        <span class="font1">EDIT<br> YOUR <br></span>
        <span class="font1" id="profile">PROFILE</span><br>

        <img src="../assets/img3.png" alt="" style="position:relative;left:-10px;top:18%;width: 450px;display: inline">
      </el-aside>
      <el-main>
        <div
            style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);margin: 8px;background: white;padding: 9px;position: relative;width: 94%;display: inline-block">
          <i class="el-icon-s-custom" style="font-size: large">账号管理：</i>
          <el-divider></el-divider>
          <form>
            <div style="padding: 10px 40px">
              用户头像：
              <el-avatar :size="125" :src="userInfo.avatar"></el-avatar>
              <br><br>
              <v-text-field label="用户名" v-model="userInfo.uname"></v-text-field>
              <v-text-field label="邮箱地址" v-model="userInfo.email"></v-text-field>
              <v-text-field label="手机号码" v-model="userInfo.phone"></v-text-field>
              <h3 style="padding-bottom: 5px; display: inline-block;">职位分类：</h3><i
                style="font-size: 80%">当前：{{ options[userInfo.value].label }}</i><br>
              <el-select v-model="value" placeholder="请选择…">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
              <v-text-field label="工作年限" v-model="userInfo.year"></v-text-field>
              <v-container fluid>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-textarea
                        outlined
                        label="个人优势描述"
                        v-model="userInfo.selfIntro"
                        style="width: 150%"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
              <h3>常用测试设备：</h3>
              <v-row>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="web" color="orange darken-3" :value="1"
                              v-model="this.userInfo.device"
                              hide-details></v-checkbox>
                  <v-checkbox label="IOS" color="orange darken-3" :value=2
                              v-model="this.userInfo.device"
                              hide-details></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="Android" color="orange darken-3" :value="3"
                              v-model="this.userInfo.device"
                              hide-details></v-checkbox>
                  <v-checkbox label="小程序/公众号" color="orange darken-3" :value="4"
                              v-model="this.userInfo.device"
                              hide-details></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="windows" color="orange darken-3" :value="5"
                              v-model="this.userInfo.device"
                              hide-details></v-checkbox>
                  <v-checkbox label="macOS" color="orange darken-3" :value="6"
                              v-model="userInfo.device"
                              hide-details></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="linux" color="orange darken-3" :value="7"
                              v-model="userInfo.device"
                              hide-details></v-checkbox>
                  <v-checkbox label="其他" color="orange darken-3" :value="8"
                              v-model="userInfo.device"
                              hide-details></v-checkbox>
                </v-col>
              </v-row>
              <br>
              <h3>测试类型偏好：</h3>
              <v-row>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="功能测试" color="indigo" value="1"
                              v-model="userInfo.kindPrefer" hide-details></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="安全性测试" color="indigo" value="2"
                              v-model="userInfo.kindPrefer" hide-details></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="兼容性测试" color="indigo" value="3"
                              v-model="userInfo.kindPrefer" hide-details></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox label="性能测试" color="indigo" value="4"
                              v-model="userInfo.kindPrefer" hide-details></v-checkbox>
                </v-col>
              </v-row>
              <br>
              <el-button type="primary" style="position: relative;left: 85%" @click="gotoSubmit">确定修改</el-button>
              <br>
            </div>
          </form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {getUser, updateInfo} from "@/api/user";

export default {
  name: "PersonInfo",
  components: {
    navigationBar
  },
  props: {
    uid: String
  },
  data() {
    return {
      userInfo: {
        avatar: 'https://box.nju.edu.cn/f/cb708a33bd85496d9d17/?dl=1',
        uname: '111',
        role: '',
        pswd: '',
        grade: '',
        gradeName: '',
        phone: '',
        email: '',
        year: 0,
        option: 0,
        selfIntro: '',
        device: [],
        kindPrefer: ['1','2'],
      },
      options: [{
        value: '0', label: '待选择'
      }, {
        value: '1', label: '未知'
      }, {
        value: '2', label: '产品经理'
      }, {
        value: '3', label: '研发人员'
      }, {
        value: '4', label: '测试人员'
      }, {
        value: '5', label: '设计人员'
      }, {
        value: '6', label: '运维人员'
      }, {
        value: '7', label: '市场运营'
      }, {
        value: '8', label: '学校老师'
      }, {
        value: '9', label: '在校学生'
      }, {
        value: '10', label: '自由职业者'
      }, {
        value: '11', label: '其他'
      }],
      value: ''
    }
  },
  async mounted() {
    if (this.$store.getters.isLogin === false) {
      await this.$router.push('/login');
    }
    await this.initial();

  },
  methods: {
    async initial() {
      const token = this.$store.state.token;
      const uid = this.$store.state.uid;
      //console.log("uid:"+uid);
      const res = await getUser(uid, token);
      //console.log("res:"+JSON.stringify(res));
      this.userInfo.uname = res.uname;
      this.userInfo.pswd = res.password;
      this.userInfo.grade = res.grade;
      this.userInfo.role = res.userRole;
      this.userInfo.avatar = res.avatar_url || this.userInfo.avatar;//todo 接下来要支持用户更改头像
      this.userInfo.email = res.emailAddress;
      this.userInfo.phone = res.phone;
      this.userInfo.year = res.workingYears;
      this.userInfo.value = res.position;
      this.userInfo.selfIntro = res.selfIntro;

      this.userInfo.device=res.deviceList;

      console.dir(this.userInfo.device);
      console.dir(this.userInfo.kindPrefer);

      console.log("device:"+this.userInfo.device);

      console.log("preference:"+this.userInfo.kindPrefer);
    },
    gotoSubmit() {
      console.log("点击按钮！");

      updateInfo({
        id: this.$store.state.uid,
        userRole: this.userInfo.role,
        uname: this.userInfo.uname,
        password: this.userInfo.pswd,
        phone: this.userInfo.phone,
        emailAddress: this.userInfo.email,
        avatorUrl: this.userInfo.avatar,
        position: this.value,
        workingYears: parseInt(this.userInfo.year),
        grade: this.userInfo.grade,
        selfIntro: this.userInfo.selfIntro,
        preferenceList: this.userInfo.kindPrefer.map(Number),
        deviceList: this.userInfo.device.map(Number),
      }).then(res => {
        console.log(res);
        alert("修改成功！");
      })
    },
    // cons(item){
    //   console.log(JSON.stringify(item));
    //   console.log(this.userInfo.value());
    // }
    // eslint-disable-next-line no-unused-vars
    // changeItem(item){
    //   this.userInfo.option=item.value;
    // },
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.font1 {
  font-family: 'Permanent Marker', cursive;
  position: relative;
  left: 60px;
  top: 12%;
  font-size: 80px;
  color: #3e3e3e;
}

.font1#profile {
  top: 13%;
  color: #4e54c8;
}

.typing.animate {
  width: 21ch;
  border-right: 0.1em solid black;
  font-family: monospace;
  font-size: 2em;
  animation: type 2.5s steps(20), writer 1s infinite alternate, delete 0.5s steps(5) 2.5s, type2 1s steps(4, end) 3s forwards;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}

.typing.animate::before {
  content: "Welcome to Dance.";
  animation: type2 1s steps(4, end) 3s forwards;
}

@keyframes type {
  from {
    width: 0;
  }
  to {
    width: 21ch;
  }
}

@keyframes type2 {
  from {
    width: 16ch;
    content: "Welcome to Dance. "
  }
  to {
    width: 20ch;
    content: "Welcome to Dance! "
  }
}

@keyframes type3 {
  from {
    width: 20ch;
    content: "Have fun!"
  }
  to {
    width: 42ch;
    content: "Have fun!"
  }
}


@keyframes writer {
  50% {
    border-color: transparent;
  }
}

@keyframes delete {
  from {
    width: 21ch;
  }
  to {
    width: 16ch;
  }
}
</style>