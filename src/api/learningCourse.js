/*
 * @Description: 试听课程请求接口
 * @Author: lxb
 * @Date: 2020-05-26 14:24:35
 * @Last Modified by: lxb
 * @Last Modified time: 2020-05-26 19:08:06
 */

import request from "@/utils/request";
import store from "@/store";

/**
 * @description 获取视频上传后台给的地址
 * @author lxb
 * @date 2020-05-26
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getUploadAddress(data) {
  return request({
    url: "/echo-art/vod/getUploadAddress",
    method: "post",
    data
  });
}

/**
 * @description 文件太大超时，刷新上传视频凭证
 * @author lxb
 * @date 2020-05-26
 * @export
 * @param {*} data
 * @returns Promise
 */
export function refreshUploadAddress(data) {
  return request({
    url: "/echo-art/vod/refreshUploadVideo",
    method: "post",
    data
  });
}

/**
 * @description 根据视频id获取视频的url
 * @author lxb
 * @date 2020-05-26
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getVideoAddress(data) {
  return request({
    url: "/echo-art/vod/getPlayObj",
    method: "post",
    data
  });
}

/**
 * @description 获取精品课程
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function getCourseList(data) {
  return request({
    url: "/echo-art/highQualityCourse/getList",
    method: "post",
    data: { ...data, ...store.getters.school }
  });
}

/**
 * @description 试听课程添加或编辑
 * @author lxb
 * @date 2020-05-27
 * @export
 * @param {*} data
 * @returns Promise
 */
export function addOrUpdateCourse(data) {
  return request({
    url: "/echo-art/highQualityCourse/createOrUpdate",
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
export function deleteCourse(data) {
  return request({
    url: "/echo-art/highQualityCourse/delete",
    method: "post",
    data
  });
}
