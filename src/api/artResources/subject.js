import request from "@/utils/request";

/**
 * @description 根据专业获取科目
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {professionId:"专业id"}
 * @returns
 */
export function getSubjectList(data) {
  return request({
    url: "/echo-art/subject/getList",
    method: "post",
    data
  });
}

/**
 * @description 添加和编辑科目
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {subjectName:"目录名称",id:"目录id，更新时必须",professionId:"专业",idrankValue:"排序值"}
 * @returns
 */
export function createOrUpdateSubject(data) {
  return request({
    url: "/echo-art/subject/createOrUpdate",
    method: "post",
    data
  });
}

/**
 * @description 删除科目
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {id:"删除的科目id"}
 * @returns
 */
export function deleteSubject(data) {
  return request({
    url: "/echo-art/subject/delete",
    method: "post",
    data
  });
}
