/*
 * @Description: 学生评测设置请求接口
 * @Author: lxb
 * @Date: 2020-07-21 10:06:35
 * @Last Modified by: lxb
 * @Last Modified time: 2020-07-21 19:08:06
 */

import request from "@/utils/request";
import store from "@/store";

/**
 * @description 获取评价模板权限的教师列表
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getStuEvaluationTeachers(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/teachers",
        method: "post",
        data: {
            id: store.getters.school.schoolId
        }
    });
}

/**
 * @description 编辑考核老师
 * @author lxb
 * @date 2020-07-21
 * @export
 * @param {*} data
 * @returns Promise
 */
export function updateStuEvaluationTeachers(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/updateTeacher",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}

/**
 * @description 获取学生已经提测的评价列表
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getStuEvaluationList(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/list",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}
/**
 * @description 获得评测模板明细信息
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getEvaluationDetail(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/detail/byId",
        method: "post",
        data
    });
}

/**
 * @description 删除评测列表
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function deleteEvaluation(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/delete",
        method: "post",
        data
    });
}