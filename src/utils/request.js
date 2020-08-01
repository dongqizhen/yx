import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import router from "@/router";

let message = null;

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        config.headers["serveResource"] = "web_school";
        // console.log(store.getters.token)
        if (getToken()) {

            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers["token"] = getToken();
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const { data } = response;

        if (data.code === -2) {
            if (message) {
                message.close();
            }
            message = Message({
                message: data.msg || "Error",
                type: "error",
                //center: true,
                duration: 2 * 1000
            });
            window.clearVuexAlong(true, true);
            removeToken();

            router.push("/login");

            return Promise.reject(new Error(res.message || "Error"));
        } else if (data.code === -1) {
            if (message) {
                message.close();
            }
            message = Message({
                message: data.msg || "Error",
                type: "error",
                //center: true,
                duration: 2 * 1000
            });
            Promise.reject();
            return;
        } else if (data.code === 0) {
            return { data };
        }
    },
    error => {
        console.log("err" + error); // for debug
        Message({
            message: "请求超时，稍后再试",
            type: "error",
            duration: 2 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;