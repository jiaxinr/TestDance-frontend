<template>
<div>
  <div class="header">
    <navigation-bar></navigation-bar>
<!--    <tree1></tree1>-->
<!--    <cluster-spots></cluster-spots>-->
<!--    <fully-connected-graph></fully-connected-graph>-->
<!--    <bar-graph></bar-graph>-->
<!--    <pro-tree3></pro-tree3>-->

    <!--Content before waves-->
    <div class="inner-header flex">
      <img src="../assets/testdance-mini-icon.png">
      <h1>&nbsp;&nbsp;&nbsp;TestDance众测平台</h1>
      <br>

    </div>
    <div class="header2">
      <button class="button" @click="gotoLogin" v-show="!this.$store.getters.isLogin">
        登录
        <div class="button__horizontal"></div>
        <div class="button__vertical"></div>
      </button>
      <button class="button" @click="gotoRegis" v-show="!this.$store.getters.isLogin">
        注册
        <div class="button__horizontal"></div>
        <div class="button__vertical"></div>
      </button>
      <img src="../assets/img1.png" style="width: 500px;float: right">
    </div>

    <!--Waves Container-->
    <div>
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
    <!--Waves end-->

  </div>
  <!--Header ends-->
<br><br>
  <div id="facts" class="facts mt-100 mbr-box mbr-section mbr-section--relative">
    <div class="container">
      <div class="row center">
        <div class="col-md-8 col-md-offset-2"><h2 class="mb-100">Some facts about our website</h2></div>
      </div>
      <div class="row text-center">
        <div class="col-xs-12 col-lg-3 col-md-3">
          <div class="count-item">
            <i class="lnr lnr-mustache"></i>
            <div class="numscroller" data-slno='1' data-min='0' data-max='50' data-delay='10' data-increment="3">{{ this.hirer }}</div>
            <div class="count-name-intro">发包方</div>
          </div>
        </div>
        <div class="col-xs-12  col-lg-3 col-md-3">
          <div class="count-item">
            <i class="lnr lnr-users"></i>
            <div class="numscroller" data-slno='1' data-min='0' data-max='8' data-delay='10' data-increment="2">{{ this.worker }}</div>
            <div class="count-name-intro">众包工人</div>
          </div>
        </div>
        <div class="col-xs-12  col-lg-3 col-md-3">
          <div class="count-item">
            <i class="lnr lnr-rocket"></i>
            <div class="numscroller" data-slno='1' data-min='0' data-max='400' data-delay='10' data-increment="4">{{this.project}}</div>
            <div class="count-name-intro">发布项目</div>
          </div>
        </div>
        <div class="col-xs-12 col-lg-3 col-md-3">
          <div class="count-item">
            <i class="lnr lnr-calendar-full"></i>
            <div class="numscroller" data-slno='1' data-min='0' data-max='3000' data-delay='10' data-increment="9">{{this.participate}}</div>
            <div class="count-name-intro">用户参与项目次数</div>
          </div>
        </div>
      </div>
    </div>
    <br><br>
  </div>
  <footer class="main-footer">
    <svg preserveAspectRatio="none" viewBox="0 0 100 102" height="100" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" class="yellow">
      <path d="M0 0 L50 100 L100 0 Z" fill="#dbf9f9" stroke="#dbf9f9"></path>
    </svg>
    <div class="container" style="color: white;height:200px">
      <div class="row mt-100 mb-50 footer-widgets" style="position:relative;left: 75%">
        <table>
          <tbody>
          <tr>
            <td class="pd">
              <span>联系电话：1234</span>
            </td>
          </tr>
          <tr>
            <td class="pd">
              <span>联系邮箱：1234@smail.nju.edu.cn</span>
            </td>
          </tr>
          <tr>
            <td class="pd">
              <span>联系地址：江苏省南京市鼓楼区</span>
              <br><span>&emsp;&emsp;&emsp;&emsp;&emsp;汉口路22号南京大学鼓楼校区</span>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
      <div style="text-align: center;position:relative;top:50px">TestDance © 2022.版权所有</div>
    </div>
  </footer>
</div>

</template>

<script>
import navigationBar from "@/components/navigationBar";
// import clusterSpots from "@/components/clusterSpots";
import {getSystemData} from "@/api/statistic";
// import tree1 from "@/components/tree/tree1";
// import barGraph from "@/components/barGraph1";
//import fullyConnectedGraph from "@/components/tree/fullyConnectedGraph";

export default {
  name: "homePage2",
  components:{
    navigationBar,
    // tree1,
    // clusterSpots,
    // barGraph,
    //fullyConnectedGraph,
  },
  data(){
    return{
      hirer:0,
      worker:0,
      project:0,
      participate:0,
    }
  },
  methods:{
    gotoLogin() {
      this.$router.push('/login')
    },
    gotoRegis(){
      this.$router.push('/register')
    }
  },
  async mounted() {
    const res=await getSystemData();
    this.hirer=res.hirerNum;
    this.worker=res.workerNum;
    this.project=res.projectNum;
    this.participate=res.participateNum;
  }

}
</script>

<style lang="scss" scoped>
@import url(//fonts.googleapis.com/css?family=Lato:300:400);
@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css);
@import url(https://cdn.linearicons.com/free/1.0.0/icon-font.min.css);
@import url(https://fonts.googleapis.com/css?family=Lato:400,900,300);
@import url(https://fonts.googleapis.com/css?family=Cantarell:400,700);

body {
  margin:0;
}

h1 {
  font-family: 'Lato', sans-serif;
  font-weight:300;
  letter-spacing: 2px;
  font-size:48px;
}
p {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
  font-size:14px;
  color: #333333;
}

.header {
  position:relative;
  text-align:center;
  background: linear-gradient(60deg, #4e54c8, #6dd5ed);
  color:white;
}
.logo {
  width:50px;
  fill:white;
  padding-right:15px;
  display:inline-block;
  vertical-align: middle;
}

.inner-header {
  height:30vh;
  width:100%;
  margin: 0;
  padding: 0;
}

.header2{
  height: 30vh;
}
.flex { /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.waves {
  position:relative;
  width: 100%;
  height:75vh;
  margin-bottom:-7px; /*Fix for safari gap*/
  min-height:100px;
  max-height:150px;
}

.content {
  position:relative;
  height:20vh;
  text-align:center;
  background-color: white;
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px,0,0);
  }
  100% {
    transform: translate3d(85px,0,0);
  }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height:40px;
    min-height:40px;
  }
  .content {
    height:30vh;
  }
  h1 {
    font-size:24px;
  }
}
.button {

  --offset: 10px;
  --border-size: 2px;

  //display: block;
  position: relative;
  padding: 1.5em 3em;
  appearance: none;
  border: 0;
  background: transparent;
  color: white;
  text-transform: uppercase;
  letter-spacing: .25em;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 0;
  box-shadow: inset 0 0 0 var(--border-size) currentcolor;
  transition: background .8s ease;
  display: inline-block;
  margin:0 25px;
  top: 100px;
  left: 250px;

&:hover {
   background: rgba(100, 0, 0, .03);
 }

&__horizontal,
&__vertical {
   position: absolute;
   top: var(--horizontal-offset, 0);
   right: var(--vertical-offset, 0);
   bottom: var(--horizontal-offset, 0);
   left: var(--vertical-offset, 0);
   transition: transform .8s ease;
   will-change: transform;

&::before {
   content: '';
   position: absolute;
   border: inherit;
 }
}

&__horizontal {
   --vertical-offset: calc(var(--offset) * -1);
   border-top: var(--border-size) solid currentcolor;
   border-bottom: var(--border-size) solid currentcolor;

&::before {
   top: calc(var(--vertical-offset) - var(--border-size));
   bottom: calc(var(--vertical-offset) - var(--border-size));
   left: calc(var(--vertical-offset) * -1);
   right: calc(var(--vertical-offset) * -1);
 }
}

&:hover &__horizontal {
           transform: scaleX(0);
         }

&__vertical {
   --horizontal-offset: calc(var(--offset) * -1);
   border-left: var(--border-size) solid currentcolor;
   border-right: var(--border-size) solid currentcolor;

&::before {
   top: calc(var(--horizontal-offset) * -1);
   bottom: calc(var(--horizontal-offset) * -1);
   left: calc(var(--horizontal-offset) - var(--border-size));
   right: calc(var(--horizontal-offset) - var(--border-size));
 }
}

&:hover &__vertical {transform: scaleY(0);}
}

#facts .bottom-separator {
  border-color: #f7f7f7 transparent transparent transparent;
}
#facts h2{
  text-transform: uppercase;
  letter-spacing: 10px;
  color: #000;
  font-size: 25px;
  font-weight: 400;
}
.count-item i{
  font-size: 110px;
  color: #fff;
}
.numscroller{
  font-size: 45px;
  color: #000;
  margin-top: -125px;
}

footer.main-footer{
  background-color: #000;
  z-index: 0;
}

footer p {
  color: #777;
}

footer a {
  color: #fff;
  font-family: "Cantarell", "Times New Roman", sans-serif;
}

footer a:hover {
  color: #000;
  text-decoration: none;
}

</style>