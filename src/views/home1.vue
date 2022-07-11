<template>
  <div>
  <navigation-bar></navigation-bar>
    <div class="container">
      <div class="card">
        <h2>North</h2>
        <i class="fas fa-arrow-right"></i>
        <p>a lonely trip.</p>
        <div class="pic"></div>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div class="social">
          <i class="fab fa-facebook-f"></i>
          <i class="fab fa-twitter"></i>
          <i class="fab fa-instagram"></i>
          <i class="fab fa-github"></i>
        </div>
        <button>
        </button>
      </div>
      <div class="card card2">
        <h2>Vauxhall</h2>
        <i class="fas fa-arrow-right"></i>
        <p>a lonely trip.</p>
        <div class="pic"></div>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div class="social">
          <i class="fab fa-facebook-f"></i>
          <i class="fab fa-twitter"></i>
          <i class="fab fa-instagram"></i>
          <i class="fab fa-github"></i>
        </div>
        <button>
        </button>
      </div>
    </div>

    <a href="https://dribbble.com/YancyMin" class="dr-url" target="_blank">
      <img class="dr" src="https://cdn.dribbble.com/assets/logo-footer-hd-a05db77841b4b27c0bf23ec1378e97c988190dfe7d26e32e1faea7269f9e001b.png" alt="">
    </a>
  </div>


</template>

<script>
import navigationBar from "@/components/navigationBar";
// import sideBar from "@/components/sideBar";
// import SideBar from "@/components/sideBar";
export default {
  name: "homePage",
  //components: {SideBar},
  components:{
    navigationBar,
    // sideBar,
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

i {
  opacity: 0;
  font-size: 18px;
  color: #fff;
  will-change: transform;
  -webkit-transform: scale(0.1);
  transform: scale(0.1);
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

h2{
  pointer-events:none;
}

body {
  background-color: #E6E5E1;
  width: 100vw;
  height: 100vh;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

.card {
  position: relative;
  width: 500px;
  height: 200px;
  background-color: #fff;
  overflow: hidden;
  margin-bottom: 4px;

&:before {
   content: "";
   z-index: 99;
   position: absolute;
   top: -10px;
   left: 32px;
   display: block;
   width: 16px;
   height: 16px;
   border-radius: 16px;
   background-color: #E6E5E1;
 }
&:after {
   content: "";
   z-index: 99;
   position: absolute;
   bottom: -10px;
   left: 32px;
   display: block;
   width: 16px;
   height: 16px;
   border-radius: 16px;
   background-color: #E6E5E1;
 }
ul {
  z-index: 99;
  position: absolute;
  left: 39px;
  top: 5px;
  list-style-type: none;
li {
  width: 2px;
  height: 2px;
  border-radius: 2px;
  margin: 6px 0;
  background-color: #E6E5E1;
}
}
h2 {
  z-index: 99;
  font-family: "Poppins", sans-serif;
  position: absolute;
  bottom: 0;
  right: 130px;
  font-size: 60px;
  font-weight: 700;
  color: #fff;
}

.fa-arrow-right {
  z-index: 100;
  position: absolute;
  right: 75px;
  bottom: 25px;
  font-size: 40px;
  cursor: pointer;
}
p {
  z-index: 99;
  position: absolute;
  top: 20px;
  right: 70px;
  color: #333;
  opacity: 0.7;
  font-size: 12px;
  letter-spacing: 1px;
  writing-mode: vertical-lr;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}
.pic {
  z-index: 100;
  width: 400px;
  height: 200px;
  background-image: url("https://images.unsplash.com/photo-1525543907410-b2562b6796d6?ixlib=rb-0.3.5&s=9ff8e5e718a6a40cbd0e1471235912f4&auto=format&fit=crop&w=3452&q=80");
  background-size: 100% 100%;
  filter: grayscale(100%);
}

.social {
  position: absolute;
  left: 60px;
  top: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 180px;
  height: 64px;
  border-radius: 80px;
}

.social i:nth-of-type(1) {
  -webkit-transition-delay: 0.4s;
  transition-delay: 0.4s;
}

.social i:nth-of-type(2) {
  -webkit-transition-delay: 0.3s;
  transition-delay: 0.3s;
}

.social i:nth-of-type(3) {
  -webkit-transition-delay: 0.2s;
  transition-delay: 0.2s;
}

.social i:nth-of-type(4) {
  -webkit-transition-delay: 0.1s;
  transition-delay: 0.1s;
}

&:hover i {
   opacity: 1;
   -webkit-transform: scale(1);
   transform: scale(1);
 }

button {
  position: absolute;
  right: 14px;
  bottom: 14px;
  width: 30px;
  height: 30px;
  background-color: #DA4D1D;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  outline:none;
  transition: all 0.3s ease;
  mix-blend-mode: hard-light;

i {
  font-size: 3rem;
}
}

&:hover button {
   transform: scale(16.5);
 }

&:hover p {
   color: #fff;
 }

&:hover .pic {
   filter: grayscale(0);

 }
}

.card2 {
.pic {
  background-image: url("https://images.unsplash.com/photo-1528785198459-ec50485704c7?ixlib=rb-0.3.5&s=3a2fc3039516555bbb2e9cd2967bd321&auto=format&fit=crop&w=1537&q=80");
}
button {
  background-color: #2b26c3;
}
}
}

.dr {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width:100px;
}

</style>