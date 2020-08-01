import request from "@/utils/request";

//登录接口
export function login(data) {
    return request({
        url: "/echo-art/api/member/teacherLogin",
        method: "post",
        data
    });
}

//校验验证码

export function verifySendCode(data = {
    telephone: '',
    sendCode: ''
}) {
    return request({
        url: "/echo-art/api/member/verifySend",
        method: "post",
        data
    });
}

//设置密码
export function setPassword(data = {
    telephone: '',
    password: ''
}) {
    return request({
        url: "/echo-art/api/member/setMemberPassword",
        method: "post",
        data
    });
}


//根据token获取用户信息
export function getInfo(token) {
    return request({
        url: "/echo-art/api/teacher/findTeacherByToken",
        method: "post"
            //params: { token }
    });
}

export function logout() {
    return request({
        url: "/echo-art/api/member/memberQuitLogin",
        method: "post"
    });
}