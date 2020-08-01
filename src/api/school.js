/*
 * @Description: 学校介绍接口
 * @Author: mikey.dongqizhen
 * @Date: 2020-05-27 10:21:56
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2020-05-27 10:59:06
 */

import request from "@/utils/request";
import store from "@/store";

/**
 * @description 获取学校介绍详情
 * @author dongqizhen
 * @date 2020-05-27
 * @export
 * @param {*} query
 * @returns Promise
 */
export function fetchSchool_details(query) {
    return request({
        url: "/echo-art/school/introduction/detail",
        method: "post",
        data: {
            ...query,
            id: store.getters.school.schoolId
        }
    });
}


/**
 * @description 更新或添加学校介绍
 * @author dongqizhen
 * @date 2020-05-27
 * @export
 * @param {string} [query={
 *     content: ''
 * }]
 * @returns Promise
 */
export function updateSchool_introduction(query = {
    content: '',
    photo: '' //学校徽标
}) {
    return request({
        url: "/echo-art/school/introduction/createAndUpdate",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}
