/*
 * @Description:教职工管理列表请求接口
 * @Author: mikey.dongqizhen
 * @Date: 2020-04-29 15:33:22
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2020-06-23 14:34:56
 */

import request from "@/utils/request";
import store from "@/store";
/**
 * @description 教职工管理列表
 * @author dongqizhen
 * @date 2020-04-29
 * @export
 * @param {*} query //请求body
 * @returns
 */

/**
 * @description 获取教师列表
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} query
 * @returns
 */
export function fetchTeacher_List(query) {
    return request({
        url: "/echo-art/api/teacher/findTeacherList",
        method: "post",
        data: {...query, ...store.getters.school }
    });
}

/**
 * @description 根据关联信息获取教师列表
 * @author dongqizhen
 * @date 2020-05-20
 * @export
 * @param {string} [query={
 *     schoolId: ''
 * }]
 * @returns Promise
 */
export function fetchTeacher_ListByStatus(
    query = {
        schoolId: ""
    }
) {
    return request({
        url: "/echo-art/api/teacher/findTeacherContentBySchool",
        method: "post",
        data: {
            ...query,
            deleteFlag: 0,
            ...store.getters.school
        }
    });
}

/**
 * @description 删除教师
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} query
 * @returns
 */
export function deleteTheacher_list(data) {
    return request({
        url: "/echo-art/api/teacher/removeTeacher",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}

/**
 * @description 添加教师
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} teacherName
 * @param {*} teacherPhoto
 * @param {*} telephone
 * @param {number}  fullTimeFlag //是否全职
 * @param {number} teacherLeaderFlag //是否教务
 * @returns Promise
 */
export function addTheacher_list(data) {
    return request({
        url: "/echo-art/api/teacher/createTeacher",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}
/**
 * @description 修改教师
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} teacherName
 * @param {*} teacherPhoto
 * @param {*} telephone
 * @param {number}  fullTimeFlag //是否全职
 * @param {number} teacherLeaderFlag //是否教务
 * @returns Promise
 */
export function updateTheacher_list(data) {
    return request({
        url: "/echo-art/api/teacher/updateTeacher",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}
/**
 * @description 教师ID获取详情
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} id
 * @returns Promise
 */
export function getTheacher_Detail(data) {
    return request({
        url: "/echo-art/api/teacher/findTeacherById",
        method: "post",
        data: {
            ...data
        }
    });
}

/**
 * @description 获取教师考核模板
 * @author dongqizhen
 * @date 2020-05-21
 * @export
 * @param {string} [data={
 *     professionId: '313'
 * }]
 * @returns
 */
export function getTheacher_TeacherStandardTemplate(
    data = {
        professionId: ""
    }
) {
    return request({
        url: "/echo-art/api/teacherStandardTemplate/findTeacherStandardTemplateList",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
            //schoolId: 1
        }
    });
}

/**
 * @description 添加教师考核模板
 * @author dongqizhen
 * @date 2020-05-21
 * @export
 * @param {string} [data={
 *     professionId: '313'
 * }]
 * @returns
 */
export function updateTheacher_TeacherStandardTemplate(
    data = {
        professionId: ""
    }
) {
    return request({
        url: "/echo-art/api/teacherStandardTemplate/updateTeacherStandardTemplate",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}
