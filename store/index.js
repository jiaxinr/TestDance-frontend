import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        uid: 0,
        role: '',
        token: '',
        uname: '',
        avatar_url: '',
        grade: 0
    },

    mutations: {
        setToken(state, token) {
            state.token = token;
        },

        deleteUser(state) {
            state.uid = 0;
            state.role = '';
            state.token = '';
            state.uname = '';
            state.avatar_url = '';
            state.grade = 0;
        },

        setUser(state, payload) {
            state.uid = parseInt(payload.uid);
            state.role = payload.role;
            state.uname = payload.uname;
            state.avatar_url = payload.avatar_url;
            state.grade = payload.grade;
        }
    },

    getters: {
        isLogin(state) {
            return state.token !== '';
        }
    }
})

export default store