import request from "@/utils/request";

/**
 * @description 获取资源列表
 * @author lxb
 * @date 2020-06-02
 * @export
 * @param {*} data:{catalogId:"目录Id",professionId:"专业id",subjectId:"目录id",keyword:"查询关键字",pageNumber:"第几页",pageSize:"每页显示数"}
 * @returns
 */
export function getResourceList(data) {
  return request({
    url: "/echo-art/publicResource/list",
    method: "post",
    data
  });
}

/**
 * @description 修改资源状态，是否让老师和学生看到
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{id:"资源Id"}
 * @returns
 */
export function resourceFreeze(data) {
  return request({
    url: "/echo-art/publicResource/changeFreezeFlag",
    method: "post",
    data
  });
}

/**
 * @description 保存资源信息接口(上传或编辑)
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{catalogId:"目录Id",professionId:"专业id",subjectId:"目录id",resourceName:"资源名称",aliSavePathId:"如果是保存到阿里云，填阿里云地址",resourceType:"1.视频2.语音3.图片4.文本文件",id:"资源Id",newId:"编辑是新上传文件的id",userId:"登录的用户",uploadSourceType:"0:系统上传1阿里云回填"}
 * 备注：newId:"编辑的时候必传，如果没有新的非阿里文件上传的话，则newId和id一样；如果有新的非阿里的文件上传的话，newId为新上传的接口返回的id值，这个时候该接口的id为编辑的数据的id"
 * @returns
 */
export function createResource(data) {
  return request({
    url: "/echo-art/publicResource/saveMsg",
    method: "post",
    data
  });
}

/**
 * @description 删除资源
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{id:"资源Id"}
 * @returns
 */
export function deleteResource(data) {
  return request({
    url: "/echo-art/publicResource/delete",
    method: "post",
    data
  });
}

/**
 * @description 获取资源详情
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*}  data:{id:"资源Id"}
 * @returns
 */
export function getResourceDetail(data) {
  return request({
    url: "/echo-art/publicResource/getDetail",
    method: "post",
    data
  });
}
