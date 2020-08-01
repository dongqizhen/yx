/*
 * @Author: mikey.dongqizhen
 * @Date: 2020-07-06 14:20:32
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2020-07-17 09:32:12
 */

import deferred from './deferred'
import store from '@/store'
import axios from '@/utils/request'

/**
 * @description  文件上传自定义请求接口
 * @author dongqizhen
 * @date 2020-07-06
 * @export
 * @param {*} [arg={}]
 * @returns
 */
export default async function request(arg = {}) {
    let self = {
        method: 'POST', //请求方法
        url: '',
        name: 'file',
        file: '', //文件
        async: true, //异步
        filename: '',
        credentials: true // 跨域
    }

    self = {...self, ...arg }

    const token = store.getters.token;
    let xhr, formData;

    formData = new FormData();
    //假设接口接收参数为file,值为选中的文件
    formData.append(self.name, self.file, self.filename);
    //正式使用将下面被注释的内容恢复
    //xhr.send(formData);
    return await axios.post(self.url, formData).then(res => {
        if (res) {
            return res
        }
    })

    // xhr = new XMLHttpRequest();

    // xhr.withCredentials = self.credentials;

    // xhr.open("POST", self.url, self.async);

    // xhr.setRequestHeader("token", token);
    // xhr.setRequestHeader("serveResource", store.state.settings.serveResource);

    // xhr.upload.onprogress = function(e) {
    //     // 进度(e.loaded / e.total * 100)
    //     let percent = (e.loaded / e.total) * 100;
    //     if (percent < 100) {
    //         //tinymce.activeEditor.setProgressState(true); //是否显示loading状态：1（显示）0（隐藏）
    //     } else {
    //         //tinymce.activeEditor.setProgressState(false);
    //     }
    // };

    // xhr.onerror = function() {
    //     //根据自己的需要添加代码
    //     //tinymce.activeEditor.setProgressState(false);
    //     return;
    // };
    // console.log(deferred)
    // xhr.onload = function() {
    //     if (xhr.status < 200 || xhr.status >= 300) {
    //         console.log("HTTP 错误: " + xhr.status);
    //         return;
    //     }
    //     console.log(JSON.parse(xhr.responseText))
    //     deferred.resolve(JSON.parse(xhr.responseText))
    // };




    //return deferred.promise
}
