import request from "@/utils/request";

/**
 * @description 获取题目管理的试题列表
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{catalogId:"目录Id",type:"试题类型--1选择题2判断题",freezeFlag:"冻结状态--0正常1冻结,不传为所有状态",keyWord:"题干查询关键字",pageNumber:"第几页",pageSize:"每页显示数",createTimeSort:"排序--1倒序0或null正序"}
 * @returns
 */
export function getQuestionList(data) {
  return request({
    url: "/echo-art/question/list",
    method: "post",
    data
  });
}

/**
 * @description 试题冻结，是否让老师和学生看到
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{id:"试题Id",freeze:"冻结状态--0正常1冻结"}
 * @returns
 */
export function questionFreeze(data) {
  return request({
    url: "/echo-art/question/freeze",
    method: "post",
    data
  });
}

/**
 * @description 添加试题
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{catalogId:"目录Id",type:"试题类型--1选择题2判断题",stem:"题干",optionList:"选项"--选择题必填[{sequenceNumber:"下标 从0开始"，item:"选项描述 类型: object"}],answer:"正确答案--判读题，0正确1错误；选择题：0A、1B、3C",analysis:"解析"}
 * @returns
 */
export function createQuestion(data) {
  return request({
    url: "/echo-art/question/create",
    method: "post",
    data
  });
}

/**
 * @description 编辑试题
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{catalogId:"目录Id",type:"试题类型--1选择题、2判断题",stem:"题干",optionList:"选项"--选择题必填[{sequenceNumber:"下标 从0开始"，item:"选项描述 类型: object"}],answer:"正确答案--判读题，0正确、1错误；选择题：0A、1B、2C",analysis:"解析",id:"试题id"}
 * @returns
 */
export function editQuestion(data) {
  return request({
    url: "/echo-art/question/edit",
    method: "post",
    data
  });
}

/**
 * @description 获取试题的详情
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{id:"试题Id"}
 * @returns
 */
export function getQuestionDetail(data) {
  return request({
    url: "/echo-art/question/detail",
    method: "post",
    data
  });
}

/**
 * @description 删除试题
 * @author lxb
 * @date 2020-06-03
 * @export
 * @param {*} data:{id:"试题Id"}
 * @returns
 */
export function deleteQuestion(data) {
  return request({
    url: "/echo-art/question/delete",
    method: "post",
    data
  });
}
