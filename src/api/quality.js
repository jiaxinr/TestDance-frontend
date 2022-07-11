import axios from "axios";
import {QUALITY_MODULE} from "@/api/_prefix";

export async function updateFinalScore(payload) {
    const pid=payload;
    return await (axios.post(`${QUALITY_MODULE}/updateScore/${pid}`,)
        .then(res => res.data));
}