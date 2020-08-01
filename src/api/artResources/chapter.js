import request from "@/utils/request";

/**
 * @description 获取目录结构
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {subjectId:"科目id",professionId:"专业id"}
 * @returns
 */
export function getChapterList(data) {
  return request({
    url: "/echo-art/catalog/list",
    method: "post",
    data
  });
}

/**
 * @description 添加或更新目录
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {professionId:"专业id",evaluationDescription:"评价描述",catalogName:"目录名字",subjectId:"科目id",rankValue:"排序值",parentId:"父id"}
 * @returns
 */
export function createOrUpdateChapter(data) {
  return request({
    url: "/echo-art/catalog/createOrUpdate",
    method: "post",
    data
  });
}

/**
 * @description 删除目录
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {id:"目录id"}
 * @returns
 */
export function deleteChapter(data) {
  return request({
    url: "/echo-art/catalog/delete",
    method: "post",
    data
  });
}
