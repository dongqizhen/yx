import request from "@/utils/request";

/**
 * @description 检测office资源转换pdf成功与否的接口
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{id:"资源上传后台返回的id"}
 * @returns
 */
export function getPdfAddress(data) {
  return request({
    url: "/echo-art/publicResource/checkTransformStatus",
    method: "post",
    data
  });
}
