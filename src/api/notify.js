import axios from "axios";
import {NOTIFY_MODULE} from "@/api/_prefix";

export async function getAllNotify(uid) {
    console.log(uid);
    //console.log("msg:"+JSON.stringify(await axios.get(`${NOTIFY_MODULE}/60`)));
    return (await axios.get(`${NOTIFY_MODULE}/${uid}`)).data
}

export async function deleteNotify(nid) {
    await axios.post(`${NOTIFY_MODULE}/delete/${nid}`);
}