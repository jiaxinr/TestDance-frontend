import axios from "axios";
import {USER_MODULE} from "@/api/_prefix";

/**
 * 用户注册 POST /user/register
 * @param payload
 * @returns
 */
export const register = payload => {
    console.log(payload);
    const { uname, password, phone, userRole} = payload;
    return axios.post(`${USER_MODULE}/register`,{
        uname,
        password,
        phone,
        userRole
    }).then(res => {
        console.log("return info here!!"+JSON.stringify(res));
        return res;
    }).catch(err=>{
        console.log("this is the error info:"+err);
        // alert("错了")
        // this.$message({
        //     showClose: true,
        //     message: '注册失败，请检查填写信息是否合规',
        //     type: 'error'
        // });
    });
    // return Promise.resolve({
    //     "code": 1,
    //     "msg": "账号注册成功！",
    //     "data": {
    //         "uname": "小张同学",
    //         "password": null,
    //         "userRole": "ADMIN",
    //         //"createTime": "2021-03-13T01:45:48.246+00:00"
    //     }
    // });
};

/**
 * 用户登录 POST /user/login
 * @param payload
 * @returns
 */
export const login = payload => {
    const {phone, password} = payload;
    return axios.post(`${USER_MODULE}/login`,{phone, password});
};

/**
 * 获取用户信息 GET /user/${uid}
 * @param uid
 * @returns
 */
export async function getUser(uid, token) {
    return await (axios.get(`${USER_MODULE}/info/${uid}`, {
        headers: {
            Authorization: token
        }
    }).then(
        res=>{
            return res.data;
        }
    ));
}

export const updateInfo = payload => {
    console.log("这是返回的数据:"+JSON.stringify(payload));
    const {id,userRole,uname,password,phone,emailAddress,avatorUrl,
        position,workingYears,grade,selfIntro,preferenceList,deviceList} = payload;
    return axios.post(`${USER_MODULE}/update`, {
        id,userRole,uname,password,phone,emailAddress,avatorUrl,
        position,workingYears,grade,selfIntro,preferenceList,deviceList
    }).then(res => {
        return res.data;
    });
}