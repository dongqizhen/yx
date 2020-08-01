/*
 * @Description: 师资介绍请求接口
 * @Author: lxb
 * @Date: 2020-05-27 10:06:35
 * @Last Modified by: lxb
 * @Last Modified time: 2020-05-27 19:08:06
 */

import request from "@/utils/request";
import store from "@/store";

/**
 * @description 获取学校的教师列表
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getTeacherList(data) {
  return request({
    url: "/echo-art/faculty/getList",
    method: "post",
    data: { ...data, ...store.getters.school }
  });
}

/**
 * @description 师资介绍添加或编辑老师
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function addOrUpdateTeacher(data) {
  return request({
    url: "/echo-art/faculty/createOrUpdate",
    method: "post",
    data: { ...data, ...store.getters.school }
  });
}

/**
 * @description 师资介绍删除老师
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function deleteTeacher(data) {
  return request({
    url: "/echo-art/faculty/delete",
    method: "post",
    data
  });
}
