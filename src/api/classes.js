/*
 * @Description: 班级管理列表请求接口
 * @Author: mikey.dongqizhen
 * @Date: 2020-04-30 14:24:35
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2020-07-15 15:39:38
 */

import request from "@/utils/request";
import store from "@/store";

/**
 * @description 获取专业列表
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {*} query
 * @returns Promise
 */
export function fetchProfession_List(query) {
    return request({
        url: "/echo-art/profession/getList",
        method: "post"
    });
}

/**
 * @description 获取某个专业下的科目接口
 * @author dongqizhen
 * @date 2020-05-09
 * @export
 * @param {string} [query={
 *     professionId: '' //专业id
 * }]
 * @returns
 */
export function fetchSubject_List(
    query = {
        professionId: "" //专业id
    }
) {
    return request({
        url: "/echo-art/subject/getList",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取目录树
 * @author dongqizhen
 * @date 2020-05-09
 * @export
 * @param {string} [query={
 *     professionId: '', //专业id
 *     subjectId: '' //科目id
 * }]
 * @returns
 */
export function fetchCatalog_List(
    query = {
        professionId: "", //专业id
        subjectId: "" //科目id
    }
) {
    return request({
        url: "/echo-art/catalog/list",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取班级列表
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={
 *     schoolId: '',
 *     keyWord: '',
 *     pageSize: '',
 *     pageNumber: '',
 *     professionId: '',
 *     status: ''
 * }]
 * @returns Promise
 */
export function fetchClasses_List(
    query = {
        schoolId: "",
        keyWord: "",
        pageSize: "100",
        pageNumber: "1",
        professionId: "",
        status: ""
    }
) {
    return request({
        url: "/echo-art/classes/list",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}

/**
 * @description 改变班级展示状态
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={
 *           id: '', //班级Id
 *           showFlag: '' //{Boolen} 是否开启班级展示 ture开启 false不开启
 * }]
 * @returns Promise
 */
export function changeClasses_status(
    query = {
        id: "",
        showFlag: ""
    }
) {
    return request({
        url: "/echo-art/classes/show",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 创建班级
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={
 *     schoolId: '',
 *     classesName: '',
 *     professionId: '',
 *     teacherInChargeId: '', //班主任Id
 *     classesStartTime: '', //班级开始时间
 *     classesEndTime: '', //班级结束时间
 *     templateList: [{ //授课时段
 *         startTime: '', //开始时间
 *         endTime: '' //结束时间
 *     }]
 * }]
 * @returns Promise
 */
export function create_classes(
    query = {
        schoolId: "",
        classesName: "",
        professionId: "",
        teacherInChargeId: "",
        classesStartTime: "",
        classesEndTime: "",
        templateList: [{
            startTime: "",
            endTime: ""
        }]
    }
) {
    return request({
        url: "/echo-art/classes/create",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}

/**
 * @description 根据班级id获取班级详情
 * @author dongqizhen
 * @date 2020-05-07
 * @export
 * @param {string} [query={
 *     id: '',
 * }]
 * @returns Promise
 */
export function fetchClasses_details(
    query = {
        id: "",
        schoolId: "",
        classesName: "",
        professionId: "",
        teacherInChargeId: "",
        classesStartTime: "",
        classesEndTime: "",
        templateList: [{
            startTime: "",
            endTime: ""
        }]
    }
) {
    return request({
        url: "/echo-art/classes/detail",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 编辑班级
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={
 *     id:'', //班级ID
 *     schoolId: '',
 *     classesName: '',
 *     professionId: '',
 *     teacherInChargeId: '', //班主任Id
 *     classesStartTime: '', //班级开始时间
 *     classesEndTime: '', //班级结束时间
 *     templateList: [{ //授课时段
 *         startTime: '', //开始时间
 *         endTime: '' //结束时间
 *     }]
 * }]
 * @returns Promise
 */
export function edit_classes(
    query = {
        id: ""
    }
) {
    return request({
        url: "/echo-art/classes/edit",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 删除班级
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={ id: '' }]
 * @returns Promise
 */
export function delete_classes(query = { id: "" }) {
    return request({
        url: "/echo-art/classes/delete",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取班级下学生管理详情
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={ iclassesId: '',teacherId:'' }]
 * @returns Promise
 */
export function fetchClasses_studentGross(
    query = {
        classesId: "",
        teacherId: ""
    }
) {
    return request({
        url: "/echo-art/statistics/classes/students/gross",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取班级下每个学生详情
 * @author dongqizhen
 * @date 2020-05-06
 * @export
 * @param {string} [query={ classesId: '',studentId:'' }]
 * @returns Promise
 */
export function fetchClasses_everyStudentScore(
    query = {
        studentId: "",
        classesId: ""
    }
) {
    return request({
        url: "/echo-art/statistics/classes/student/score",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取班级下每个学生的课程表
 * @author dongqizhen
 * @date 2020-05-08
 * @export
 * @param {string} [query={
 *     studentId: "",
 *     schoolId: '',
 *     rankValue: '' //第几周数据
 * }]
 * @returns Promise
 */
export function fetchClasses_everyStudentTimeTable(
    query = {
        studentId: "",
        schoolId: "",
        rankValue: ""
    }
) {
    return request({
        url: "/echo-art/schedule/contentForStudent",
        method: "post",
        data: {
            ...query,
            ...store.getters.school
        }
    });
}

/**
 * @description 获取班级下教师管理详情
 * @author lxb
 * @date 2020-05-11
 * @export
 * @param {string} [data={ id: "" }]
 * @returns
 */
export function getTeacherDetail(data = { id: "" }) {
    return request({
        url: "/echo-art/statistics/classes/teachers/gross",
        method: "post",
        data
    });
}

/**
 * @description 获取班级下教师管理班主任下面每个教师的评分
 * @author lxb
 * @date 2020-05-11
 * @export
 * @param {string} [data={ classesId: "",teacherId:"" }]
 * @returns
 */
export function getTeacherScore(data = { classesId: "", teacherId: "" }) {
    return request({
        url: "/echo-art/statistics/classes/teacher/score",
        method: "post",
        data
    });
}

/**
 * @description
 * @author dongqizhen
 * @date 2020-05-08
 * @export
 * @param {string} [query={
 *         classesId: "",
 *         studentId: '',
 *         temporalType: "", //获取的类型: 0: 所有数据 1: 按周 2:按月
 *         rankValue: '' //周数， 例如： 1： 返回第一周的数据
 *
 *     }]
 * @returns Promise
 */
export function fetchClasses_timeTable(
    query = {
        studentId: "",
        classesId: "",
        temporalType: "", //获取的类型: 0: 所有数据 1: 按周 2:按月
        rankValue: "" //周数， 例如： 1： 返回第一周的数据
    }
) {
    //FIXME
    return request({
        // url: "/echo-art/schedule/contentForSchool",
        url: "/echo-art/schedule/contentForSchoolGroupByTimeByClassesId",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 在班级课程表中添加课程
 * @author dongqizhen
 * @date 2020-05-09
 * @export
 * @param {string} [query={
 *         courseId: "", //课程表的课程id
 *         title: "", //课程名称
 *         teacherId: '', //老师的id数据
 *         catalogId: '' //绑定的大纲(目录的Id)
 *
 *     }]
 * @returns Promise
 */
export function createCourse_timeTable(
    query = {
        courseId: "", //课程表的课程id
        title: "", //课程名称
        teacherId: "", //老师的id数据
        catalogId: "" //绑定的大纲(目录的Id)
    }
) {
    return request({
        url: "/echo-art/schedule/course/bindBaseMsg",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 在班级课程表中更新课程
 * @author dongqizhen
 * @date 2020-05-15
 * @export
 * @param {string} [query={
 *         courseId: "", //课程表的课程id
 *         title: "", //课程名称
 *         teacherId: "", //老师的id数据
 *         catalogId: "" //绑定的大纲(目录的Id)
 *     }]
 * @returns
 */
export function updateCourse_timeTable(
    query = {
        courseId: "", //课程表的课程id
        title: "", //课程名称
        teacherId: "", //老师的id数据
        catalogId: "" //绑定的大纲(目录的Id)
    }
) {
    return request({
        url: "/echo-art/schedule/course/updateBaseMsg",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 在班级课程表中删除课程
 * @author dongqizhen
 * @date 2020-05-15
 * @export
 * @param {string} [query={
 *         id: ''
 *     }]
 * @returns
 */
export function deleteCourse_timeTable(
    query = {
        id: ""
    }
) {
    return request({
        url: "/echo-art/schedule/course/deleteCourseMsg",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取课程签到信息
 * @author dongqizhen
 * @date 2020-05-09
 * @export
 * @param {string} [query={
 *         id: "", //课程表的课程id
 *     }]
 * @returns
 */
export function fetchCourse_sign(
    query = {
        id: "" //课程表的课程id
    }
) {
    return request({
        url: "/echo-art/schedule/course/students/sign",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取预习内容
 * @author dongqizhen
 * @date 2020-05-11
 * @export
 * @param {string} [query={
 *         id: "", //课程表的课程id
 *     }]
 * @returns
 */
export function fetchCourse_preview(
    query = {
        id: "" //课程表的课程id
    }
) {
    return request({
        url: "/echo-art/schedule/course/previewAndScore",
        method: "post",
        data: {
            ...query
        }
    });
}
/**
 * @description 获取预习内容学生回答的详情
 * @author dongqizhen
 * @date 2020-05-11
 * @export
 * @param {string} [query={
 *         id: "", //课程表的课程id
 *     }]
 * @returns
 */
export function fetchCourse_previewDetail(
    query = {
        studentId: "",
        courseId: "", //课程表的课程id
        courseType: 1 //1预习2作业
    }
) {
    return request({
        url: "/echo-art/api/answerDetail/answerByStudentReport",
        method: "post",
        data: {
            ...query
        }
    });
}
/**
 * @description 课程类型获取学生评价信息和基本信息
 * @author dongqizhen
 * @date 2020-05-11
 * @export
 * @param {string} [query={
 *         courseId: "", //课程表的课程id
 *         studentId: "", //学生id
 *         courseType: "", //课程类型 预习1 课中2 作业3
 *     }]
 * @returns
 */
export function fetchCourse_studentDetail(
    query = {
        courseType: "",
        studentId: "",
        courseId: ""
    }
) {
    return request({
        url: "/echo-art/api/student/findStudentByCourseIdAndCourseType",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取作业内容
 * @author dongqizhen
 * @date 2020-05-11
 * @export
 * @param {string} [query={
 *         id: "", //课程表的课程id
 *     }]
 * @returns
 */
export function fetchCourse_homeWork(
    query = {
        id: "" //课程表的课程id
    }
) {
    return request({
        url: "/echo-art/schedule/course/homeworkAndScore",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取课中评价
 * @author dongqizhen
 * @date 2020-05-11
 * @export
 * @param {string} [query={
 *         id: "", //课程表的课程id
 *     }]
 * @returns
 */
export function fetchCourse_teachScore(
    query = {
        id: "" //课程表的课程id
    }
) {
    return request({
        url: "/echo-art/statistics/course/students/score",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取教师考核
 * @author dongqizhen
 * @date 2020-05-11
 * @export
 * @param {string} [query={
 *         id: "", //课程表的课程id
 *     }]
 * @returns
 */
export function fetchCourse_teacherCheck(
    query = {
        id: "" //课程表的课程id
    }
) {
    return request({
        url: "/echo-art/statistics/course/teacher/score",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取学生详情
 * @author dongqizhen
 * @date 2020-05-12
 * @export
 * @param {string} [query={
 *         classesId: '', //班级Id
 *         teacherId: "", //当前登录老师的Id
 *         sutdentId: '', //学生Id
 *         type: '1' //类型， 1预习  2课中 3作业
 *     }]
 * @returns Promise
 */
export function fetchCourse_StudentDetails(
    query = {
        classesId: "", //班级Id
        teacherId: "", //当前登录老师的Id
        sutdentId: "", //学生Id
        type: "1" //类型， 1预习  2课中 3作业
    }
) {
    return request({
        url: "/echo-art/statistics/classes/student/detail",
        method: "post",
        data: {
            ...query
        }
    });
}

/**
 * @description 获取备课信息
 * @author dongqizhen
 * @date 2020-07-15
 * @export
 * @param {string} [query={
 *         studentId: '',
 *         courseId: '', // 课程表的课程id
 *         courseType: 1 // 1预习2作业
 *     }]
 * @returns
 */
export function fetchCourse_LessonMsg(
    query = {
        studentId: '',
        courseId: '', // 课程表的课程id
        courseType: 1 // 1预习2作业
    }
) {
    return request({
        url: '/echo-art/schedule/course/getCourseLessonMsg',
        method: 'post',
        data: {
            ...query
        }
    })
}

/**
 * @description 检查备课信息是否存在
 * @author dongqizhen
 * @date 2020-07-15
 * @export
 * @param {*} [query={
 *         id
 *     }]
 * @returns
 */
export function checkCourseExitWork(
    query = {
        id
    }
) {
    return request({
        url: '/echo-art/schedule/course/checkCourseExitWork',
        method: 'post',
        data: {
            ...query
        }
    })
}