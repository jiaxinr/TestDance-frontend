<template>
  <div>
    <navigation-bar></navigation-bar>
    <v-app style="position: relative;height: 2200px; background-image: linear-gradient(120deg, #FFFAF0, #F0FFFF);">
      <form class="projectForm">
        <br>
        <h1 style="text-align: center">创建新任务</h1>
        <v-card flat style="background: #FDF5F5">
          <v-card-text>
            <v-container fluid>
              <v-text-field label="任务名称" :rules="rules1" v-model="TaskInfo.name"></v-text-field>
              <v-container fluid>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-textarea
                        outlined
                        name="input-7-4"
                        label="任务简介"
                        value=""
                        style="width: 150%"
                        v-model="TaskInfo.intro"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
              <v-text-field label="招募人数" :rules="rules2" v-model="TaskInfo.laborNum"></v-text-field>
              <h3>系统类型：</h3>
              <v-radio-group v-model="TaskInfo.TaskType">
              <v-row>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="web" color="orange darken-3" value=0></v-radio>
                  <v-radio label="IOS" color="orange darken-3" value=1></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="Android" color="orange darken-3" value=2></v-radio>
                  <v-radio label="小程序/公众号" color="orange darken-3" value=3></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="windows" color="orange darken-3" value=4></v-radio>
                  <v-radio label="macOS" color="orange darken-3" value=5></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="linux" color="orange darken-3" value=6></v-radio>
                  <v-radio label="其他" color="orange darken-3" value=7></v-radio>
                </v-col>
              </v-row>
              </v-radio-group>

              <br>
              <h3>测试类型：</h3>
              <v-radio-group v-model="TaskInfo.testDevice">
              <v-row>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="功能测试" color="indigo" value=0></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="安全性测试" color="indigo" value=1></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="兼容性测试" color="indigo" value=2></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-radio label="性能测试" color="indigo" value=3></v-radio>
                </v-col>
              </v-row>
              </v-radio-group>
            </v-container>
          </v-card-text>
        </v-card>

        <v-text-field label="待测应用地址（选填）" v-model="TaskInfo.projectAddress"></v-text-field>
        <v-text-field label="积分/等级要求（选填）" v-model="TaskInfo.gradeRequirement"></v-text-field>
        <v-text-field label="报酬" v-model="TaskInfo.reward"></v-text-field>
        <v-text-field label="任务备注" value="" v-model="TaskInfo.testRemark"></v-text-field>
        <h3>上传可执行文件：</h3>
        <el-upload
            v-if="active===0"
            class="upload-demo"
            drag
            action="#"
            :on-success="handleSuccess"
            :before-upload="beforeEXUpload"
            :http-request="uploadEX"
            :file-list="executeFileList"
            v-model="TaskInfo.executeURL"
            multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将可执行文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <h3>上传描述文件：</h3>
        <el-upload
            v-if="active===0"
            class="upload-demo"
            drag
            action="#"
            :on-success="handleSuccess"
            :before-upload="beforeDESUpload"
            :http-request="uploadDES"
            multiple v-model="TaskInfo.executeURL">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将描述文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <br>
        <v-row>
          <h3>结束时间：</h3><br>
          <v-date-picker v-model="picker"></v-date-picker>
        </v-row>
        <el-button type="primary" style="position: relative;left: 85%" @click="gotoReleaseTask">提交</el-button>
      </form>
    </v-app>
  </div>

</template>

<script>
import navigationBar from "@/components/navigationBar";
import {createProject} from "@/api/project";

export default {
  name: "taskRelease",
  components: {
    navigationBar
  },

  data() {
    return {
      active: 0,
      TaskInfo:{
        name: '',
        executeURL: '',
        state:0,
        requirementURL: null,
        desc: '',
        startTime: '',
        endTime: '',
        laborNum: 10,
        TaskType: 0,
        testDevice: 0,
        projectAddress:'',
        gradeRequirement:0,
        reward:0,
        intro:'',
        testRemark:null,
        executeFileList: []
      },
      executeFileList: [],

      rules1: [
        value => !!value || '不能为空',
      ],
      rules2: [
        value => !!value || '不能为空',
        value => (value>0&&value<100000&&value%1===0) || '请填写正确的数字'
      ],
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      hasUpEX:false,
      hasUpDES:false,
    }
  },

  methods:{
    gotoReleaseTask(){
      createProject({
        uid:this.$store.state.uid,
        projectName:this.TaskInfo.name,
        state:0,
        testType:parseInt(this.TaskInfo.TaskType),
        testDevice:parseInt(this.TaskInfo.testDevice),
        workerNumLimit:parseInt(this.TaskInfo.laborNum),
        workerNumCurr:0,
        releaseTime: Date.now(),
        startTime: Date.now(),
        endTime: Date.parse(this.picker),
        projectAddress: this.TaskInfo.projectAddress,
        excuteFileUrl:this.TaskInfo.executeURL,
        descriptionFileUrl: this.TaskInfo.requirementURL,
        gradeRequirement: parseInt(this.TaskInfo.gradeRequirement),
        reward: parseInt(this.TaskInfo.reward),
        introduction: this.TaskInfo.intro,
        testRemark: this.TaskInfo.testRemark,
        token: this.$store.state.token,
      }).then(res=>{
        console.log("res"+res);
        this.$message({
          showClose: true,
          message: '创建成功！',
          type: 'success'
        });
        this.$router.push(`/manageH-side1`);
      })

    },
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeEXUpload(file) {
      // const isPNG = file.type === 'image/png'
      const isLt50M = file.size / 1024 / 1024 < 50
      // if (!isPNG) {
      //   this.$message.error('上传头像图片只能是 PNG 格式!')
      // }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      if(this.hasUpEX){
        this.$message.error('最多只能上传一个可执行文件！')
      }
      // return isPNG && isLt2M
      return isLt50M&&!this.hasUpEX;
    },
    beforeDESUpload(file) {
      // const isPNG = file.type === 'image/png'
      const isLt50M = file.size / 1024 / 1024 < 50
      // if (!isPNG) {
      //   this.$message.error('上传头像图片只能是 PNG 格式!')
      // }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      if(this.hasUpDES){
        this.$message.error('最多只能上传一个描述文件！')
      }
      // return isPNG && isLt2M
      return isLt50M&&!this.hasUpDES;
    },
    uploadEX(res) {
      if (res.file) {
        const COS = require('cos-js-sdk-v5')
        // 填写自己腾讯云cos中的key和id (密钥)
        const cos = new COS({
          SecretId: 'AKIDDUVFjwsXw4vVpsd7KHxMUMxHK6bpmSs1', // 身份识别ID
          SecretKey: 'tVrwkHXWEenfGadPu85mhLhmb9E8nCLE' // 身份秘钥
        })
        // 执行上传操作
        cos.putObject({
          Bucket: 'seiii-1304456726', /* 存储桶 */
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => { // 上传进度
            console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          console.log(err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            this.TaskInfo.executeURL = `https:${data.Location}`
            this.hasUpEX=true;
            // else this.hasUpDES=true;
          }
        })
      }
    },
    uploadDES(res) {
      if (res.file) {
        const COS = require('cos-js-sdk-v5')
        // 填写自己腾讯云cos中的key和id (密钥)
        const cos = new COS({
          SecretId: 'AKIDDUVFjwsXw4vVpsd7KHxMUMxHK6bpmSs1', // 身份识别ID
          SecretKey: 'tVrwkHXWEenfGadPu85mhLhmb9E8nCLE' // 身份秘钥
        })
        // 执行上传操作
        cos.putObject({
          Bucket: 'seiii-1304456726', /* 存储桶 */
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => { // 上传进度
            console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          console.log(err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            this.TaskInfo.requirementURL = `https:${data.Location}`
            this.hasUpDES=true;
          }
        })
      }
    }
  },

  mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'HIRER' && this.$store.state.role !== 'ADMIN')) {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
body {
  min-height: 100vh;
  background-image: linear-gradient(120deg, #FFFAF0, #F0FFFF);
}
.projectForm{
  width: 90%;
  background: #FDF5F5;
  padding: 80px 40px;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 1050px;
  transform: translate(-50%,-50%);
}
</style>