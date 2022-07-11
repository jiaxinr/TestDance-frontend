<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import {isWindowStoreValidUserState, windowsGetUserState} from '@/main'
export default {
  name: 'App',
  data:function () {
    return {
      title: "TestDance众包测试平台"
    }
  },
  methods:{
  },

  created() {
    if (isWindowStoreValidUserState()) {
      const userState = windowsGetUserState();
      this.$store.commit('setToken', userState.token);
      this.$store.commit('setUser', {
        uid: userState.uid,
        role: userState.role,
        uname: userState.uname,
        avatar_url: userState.avatar_url,
        grade: userState.grade
      })
    }
  },
}
</script>

<style>
button{
  color: #42b983;
}

.el-button[type="primary"] {
  color: white;
}

.el-breadcrumb {
  margin-left: 1em;
}

.align-center-70 {
  width: 70%;
  margin: auto;
}

</style>