/*
 * @Description: 学生管理列表请求接口
 * @Author: mikey.dongqizhen
 * @Date: 2020-04-30 14:24:35
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2020-07-22 10:01:07
 */

import request from "@/utils/request";
import store from "@/store";

/**
 * @description 获取学生列表
 * @author dongqizhen
 * @date 2020-05-07
 * @export
 * @param {string} [query={
 *     schoolId: '',
 *     studentName: '',
 *     deleteFlag: '', //关联关系
 *     userType: '', //用户类型 0 正式用户 1 试听用户
 *     activateFlag: '', //激活状态
 *     classId: '', //班级ID
 *     professionId: '' //专业ID
 * }]
 * @returns Promise
 */
export function fetchStudent_List(
    query = {
        schoolId: "",
        studentName: "",
        deleteFlag: "", //关联关系
        userType: "", //用户类型 0 正式用户 1 试听用户
        activateFlag: "", //激活状态
        classId: "", //班级ID
        professionId: "" //专业ID
    }
) {
    return request({
        url: "/echo-art/api/student/findStudentList",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}

/**
 * @description 新增学生
 * @author dongqizhen
 * @date 2020-05-07
 * @export
 * @param {string} [query={
 *     id: undefined,
 *     studentPhoto: "", //用户头像
 *     className: "", //班级
 *     classId:'',//班级id
 *     studentPhone: "", //电话
 *     studentName: "", //姓名
 *     gender: "", //性别
 *     userType: "1", //用户类型
 *     height: "", //身高
 *     weight: "", //体重
 *     score: "", //文理成绩
 *     middleSchool: "", //高中
 *     graderClass: "", //年级
 *     birthday: "", //出生日期
 *     qqOrWx: "", //QQ/微信
 *     examProvince: "", //省份
 *     guardianTelephone: "", //家长手机
 *     homeAddress: "", //家庭住址
 *     cardId: "", //身份证号
 *     fatherName: "", //父亲姓名
 *     fatherTelephone: "", //父亲手机
 *     motherName: "", //母亲姓名
 *     motherTelephone: "", //母亲手机
 *     middleSchoolTeacher: "", //高中班主任
 *     middleSchoolTeacherTelphone: "", //高中班主任电话
 *     artHistory: "", //艺术经历
 * }]
 * @returns Promise
 */
export function create_student(
    query = {
        id: undefined,
        studentPhoto: "", //用户头像
        className: "", //班级
        classId: "", //班级id
        studentPhone: "", //电话
        studentName: "", //姓名
        gender: "", //性别
        userType: "1", //用户类型
        height: "", //身高
        weight: "", //体重
        score: "", //文理成绩
        middleSchool: "", //高中
        graderClass: "", //年级
        birthday: null, //出生日期
        qqOrWx: "", //QQ/微信
        examProvince: "", //省份
        guardianTelephone: "", //家长手机
        homeAddress: "", //家庭住址
        cardId: "", //身份证号
        fatherName: "", //父亲姓名
        fatherTelephone: "", //父亲手机
        motherName: "", //母亲姓名
        motherTelephone: "", //母亲手机
        middleSchoolTeacher: "", //高中班主任
        middleSchoolTeacherTelphone: "", //高中班主任电话
        artHistory: "" //艺术经历
    }
) {
    return request({
        url: "/echo-art/api/student/createStudent",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}
/**
 * @description 修改学生
 * @author dongqizhen
 * @date 2020-05-07
 * @export
 * @param {string} [query={
 *     id: undefined,
 *     studentPhoto: "", //用户头像
 *     className: "", //班级
 *     classId:'',//班级id
 *     studentPhone: "", //电话
 *     studentName: "", //姓名
 *     gender: "", //性别
 *     userType: "1", //用户类型
 *     height: "", //身高
 *     weight: "", //体重
 *     score: "", //文理成绩
 *     middleSchool: "", //高中
 *     graderClass: "", //年级
 *     birthday: "", //出生日期
 *     qqOrWx: "", //QQ/微信
 *     examProvince: "", //省份
 *     guardianTelephone: "", //家长手机
 *     homeAddress: "", //家庭住址
 *     cardId: "", //身份证号
 *     fatherName: "", //父亲姓名
 *     fatherTelephone: "", //父亲手机
 *     motherName: "", //母亲姓名
 *     motherTelephone: "", //母亲手机
 *     middleSchoolTeacher: "", //高中班主任
 *     middleSchoolTeacherTelphone: "", //高中班主任电话
 *     artHistory: "", //艺术经历
 * }]
 * @returns Promise
 */
export function update_student(
    query = {
        id: undefined,
        studentPhoto: "", //用户头像
        className: "", //班级
        classId: "", //班级id
        studentPhone: "", //电话
        studentName: "", //姓名
        gender: "", //性别
        userType: "1", //用户类型
        height: "", //身高
        weight: "", //体重
        score: "", //文理成绩
        middleSchool: "", //高中
        graderClass: "", //年级
        birthday: null, //出生日期
        qqOrWx: "", //QQ/微信
        examProvince: "", //省份
        guardianTelephone: "", //家长手机
        homeAddress: "", //家庭住址
        cardId: "", //身份证号
        fatherName: "", //父亲姓名
        fatherTelephone: "", //父亲手机
        motherName: "", //母亲姓名
        motherTelephone: "", //母亲手机
        middleSchoolTeacher: "", //高中班主任
        middleSchoolTeacherTelphone: "", //高中班主任电话
        artHistory: "" //艺术经历
    }
) {
    return request({
        url: "/echo-art/api/student/updateStudent",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}

/**
 * @description 删除学生
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} query
 * @returns
 */
export function deleteStudent_list(data) {
    return request({
        url: "/echo-art/api/student/removeStudent",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}
/**
 * @description 學生ID获取学生详情
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} data
 * @returns
 */
export function getStudent_Detail(data) {
    return request({
        url: "/echo-art/api/student/findStudentById",
        method: "post",
        data: {
            ...data
        }
    });
}
/**
 * @description 获得省列表
 * @author dongqizhen
 * @date 2020-04-30
 * @export
 * @param {*} data
 * @returns
 */
export function getArea_list(data) {
    return request({
        url: "/echo-art/area/province",
        method: "post",
        data
    });
}

/**
 * @description 学生管理评测报告，获取已评测的专业
 * @author lxb
 * @date 2020-06-23
 * @export
 * @param {*} data={schoolId:"学校id",studentId:"学生id"}
 * @returns
 */
export function getStudentEvaluation_professionList(data) {
    return request({
        url: "/echo-art/studentEvaluation/professionList",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}

/**
 * @description 获得学生已经提交的评测列表
 * @author lxb
 * @date 2020-07-22
 * @export
 * @param {*} data={studentId:"学生id",pageNumber:"页数",pageSize:"每页数"}
 * @returns
 */
export function getStuEvaluationList(data) {
    return request({
        url: "/echo-art/studentEvaluation/getEvaluationListByStudent",
        method: "post",
        data
    });
}

/**
 * @description 学生管理根据专业获取评测要求
 * @author lxb
 * @date 2020-06-23
 * @export
 * @param {*} data={professionId:"专业id",studentId:"学生id",schoolId:"学校id"}
 * @returns
 */
export function getEvaluation_desc(data) {
    return request({
        url: "/echo-art/studentEvaluation/info/desc",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}

/**
 * @description 学生管理根据专业获取评测要求
 * @author lxb
 * @date 2020-06-23
 * @export
 * @param {*} data={professionId:"专业id",studentId:"学生id",schoolId:"学校id"}
 * @returns
 */
export function getEvaluation_commit(data) {
    return request({
        url: "/echo-art/studentEvaluation/info/answer",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}

/**
 * @description 学生管理根据专业获取评测结果
 * @author lxb
 * @date 2020-06-23
 * @export
 * @param {*} data={professionId:"专业id",studentId:"学生id",schoolId:"学校id"}
 * @returns
 */
export function getEvaluation_result(data) {
    return request({
        url: "/echo-art/studentEvaluation/info/score",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}

/**
 * @description 学生评测设置
 * @author lxb
 * @date 2020-06-23
 * @export
 * @param {*} data={professionId:"专业id",studentId:"学生id",schoolId:"学校id"}
 * @returns
 */
export function createOrUpdateStudentEvaluation_template(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/update",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}
/**
 * @description 获取学生评测设置详情
 * @author lxb
 * @date 2020-06-23
 * @export
 * @param {*} data={professionId:"专业id",studentId:"学生id",schoolId:"学校id"}
 * @returns
 */
export function getStudentEvaluation_templateDetail(data) {
    return request({
        url: "/echo-art/studentEvaluation/template/detail",
        method: "post",
        data: {
            ...data,
            ...store.getters.school
        }
    });
}