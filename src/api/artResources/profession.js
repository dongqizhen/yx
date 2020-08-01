import request from "@/utils/request";

/**
 * @description 获取专业列表
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data={}
 * @returns
 */
export function getList(data) {
  return request({
    url: "/echo-art/profession/getList",
    method: "post",
    data
  });
}

/**
 * @description 添加与编辑专业
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {id:"专业的id，编辑时传，非编辑传null或不传"professionName:"专业名称",rankValue:"排序值",evaluationFlag:"暂时不用"}
 * @returns
 */
export function createOrUpdateProfession(data) {
  return request({
    url: "/echo-art/profession/createOrUpdate",
    method: "post",
    data
  });
}

/**
 * @description 删除专业
 * @author lxb
 * @date 2020-05-13
 * @export
 * @param {*} data = {id:"要删除的专业id"}
 * @returns
 */
export function deleteProfession(data) {
  return request({
    url: "/echo-art/profession/delete",
    method: "post",
    data
  });
}
