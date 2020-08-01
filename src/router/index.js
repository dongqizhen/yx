import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import componentsRouter from "./modules/components";
// import chartsRouter from "./modules/charts";
// import tableRouter from "./modules/table";
// import nestedRouter from "./modules/nested";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [{
            path: "/redirect/:path(.*)",
            component: () =>
                import ("@/views/redirect/index")
        }]
    },
    {
        path: "/login",
        component: () =>
            import ("@/views/login/index"),
        hidden: true
    },
    {
        path: "/auth-redirect",
        component: () =>
            import ("@/views/login/auth-redirect"),
        hidden: true
    },
    {
        path: "/404",
        component: () =>
            import ("@/views/error-page/404"),
        hidden: true
    },
    {
        path: "/401",
        component: () =>
            import ("@/views/error-page/401"),
        hidden: true
    },
    {
        path: "/",
        component: Layout,
        redirect: "/index",
        hidden: true,
        meta: {
            // title: "首页",
        },
        children: [{
            path: "/index",
            component: () =>
                import ("@/views/index"),
            name: "Index",

            meta: {
                title: "首页",
                noCache: true,
                breadcrumb: false
            }
        }]
    },
    {
        path: "/classes",
        component: Layout,
        redirect: "/classes/index",
        meta: {
            title: "班级管理",
            noCache: true
        },
        children: [{
                path: "index",
                component: () =>
                    import ("@/views/classes/index"),
                name: "Classes",
                meta: {
                    breadcrumb: false,
                    icon: "classes",
                    active_icon: "classes-active",
                    title: "班级管理",
                    noCache: true
                }
            },
            {
                path: "add-classes",
                component: () =>
                    import ("@/views/classes/children/add-classes"),
                name: "AddClasses",
                props: route => ({ id: route.query.id }),
                hidden: true,
                meta: {
                    title: "添加班级",
                    activeMenu: "/classes/index",
                    noCache: true
                }
            },
            {
                path: "students/:classesId",
                component: () =>
                    import ("@/views/classes/students/index"),
                // name: 'Students',
                hidden: true,
                // name: 'empty',
                redirect: "/classes/students/:classesId/index",
                meta: {
                    title: "学生管理",
                    noCache: true
                },
                children: [{
                        path: "index",
                        component: () =>
                            import ("@/views/classes/students/students"),
                        name: "Students",
                        meta: {
                            title: "学生管理",
                            activeMenu: "/classes/index",
                            breadcrumb: false,
                            noCache: true
                        }
                    },
                    {
                        path: "student-details/:studentId",
                        component: () =>
                            import ("@/views/classes/students/learning/index"),
                        // name: "StudentDetails",
                        hidden: true,
                        redirect: "/classes/students/:classesId/student-details/:studentId/index",
                        meta: {
                            title: "学生详情",
                            noCache: true
                                // breadcrumb: false
                        },
                        children: [{
                                path: "index",
                                component: () =>
                                    import ("@/views/classes/students/student-details"),
                                name: "StudentDetails",
                                meta: {
                                    title: "学生详情",
                                    activeMenu: "/classes/index",
                                    breadcrumb: false,
                                    noCache: true
                                }
                            },
                            {
                                path: "learning-details",
                                component: () =>
                                    import ("@/views/classes/students/learning/learning-details"),
                                name: "LearningDetails",
                                meta: {
                                    title: "学情详情",
                                    activeMenu: "/classes/index",
                                    noCache: true
                                        // breadcrumb: false
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: "teachers/:classesId",
                component: () =>
                    import ("@/views/classes/teachers/index"),
                hidden: true,
                redirect: "/classes/teachers/:classesId/index",
                meta: {
                    title: "教师管理",
                    noCache: true
                },
                children: [{
                        path: "index",
                        component: () =>
                            import ("@/views/classes/teachers/teachers"),
                        name: "Teachers",
                        meta: {
                            title: "教师管理",
                            activeMenu: "/classes/index",
                            breadcrumb: false,
                            noCache: true
                        }
                    },
                    {
                        path: "evaluation-details/:teacherId",
                        component: () =>
                            import ("@/views/classes/teachers/evaluation/evaluation-details"),
                        name: "EvaluationDetails",
                        meta: {
                            activeMenu: "/classes/index",
                            title: "评价详情",
                            noCache: true
                                // breadcrumb: false
                        }
                    }
                ]
            },
            {
                path: "time-table/:classesId",
                component: () =>
                    import ("@/views/classes/timeTable/index"),
                hidden: true,
                meta: {
                    title: "课程表",
                    noCache: true
                },
                redirect: "/classes/time-table/:classesId/index",
                children: [{
                        path: "index",
                        component: () =>
                            import ("@/views/classes/timeTable/time-table"),
                        name: "TimeTable",
                        meta: {
                            title: "课程表",
                            activeMenu: "/classes/index",
                            breadcrumb: false,
                            noCache: true
                        }
                    },
                    {
                        path: "time-table-details/:courseId",
                        component: () =>
                            import ("@/views/classes/timeTable/details/index"),
                        // name: 'TimeTableDetails',
                        hidden: true,
                        redirect: "/classes/time-table/:classesId/time-table-details/:courseId/index",
                        meta: {
                            title: "课程表详情",
                            noCache: true
                        },
                        children: [{
                                path: "index",
                                component: () =>
                                    import ("@/views/classes/timeTable/time-table-details"),
                                name: "TimeTableDetails",
                                meta: {
                                    title: "课程表详情",
                                    activeMenu: "/classes/index",
                                    breadcrumb: false,
                                    noCache: true
                                }
                            },
                            {
                                path: "preview-details/:studentId",
                                component: () =>
                                    import ("@/views/classes/timeTable/details/preview-details"),
                                name: "PreviewDetails",
                                meta: {
                                    activeMenu: "/classes/index",
                                    title: "预习详情",
                                    noCache: true
                                }
                            },
                            {
                                path: "homework-details/:studentId",
                                component: () =>
                                    import ("@/views/classes/timeTable/details/homework-details"),
                                name: "HomeworkDetails",
                                meta: {
                                    activeMenu: "/classes/index",
                                    title: "作业详情",
                                    noCache: true
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "/teacher",
        component: Layout,
        redirect: "/teacher/index",
        // alwaysShow: true,
        meta: {
            title: "教职工管理",
            noCache: true
        },
        children: [{
                path: "index",
                component: () =>
                    import ("@/views/teacher/index"),
                name: "Teacher",
                meta: {
                    icon: "teacher",
                    active_icon: "teacher-active",
                    title: "教职工管理",
                    breadcrumb: false,
                    noCache: true
                }
            },
            {
                path: "add-teacher",
                component: () =>
                    import ("@/views/teacher/children/addTeacher"),
                name: "AddTeacher",
                hidden: true,
                meta: {
                    title: "添加教师",
                    noCache: true,
                    activeMenu: "/teacher/index"
                }
            }
        ]
    },
    {
        path: "/student",
        component: Layout,
        redirect: "/student/index",
        meta: {
            title: "学生管理",
            noCache: true
        },
        children: [{
                path: "index",
                component: () =>
                    import ("@/views/student/index"),
                name: "Student",
                meta: {
                    title: "学生管理",
                    breadcrumb: false,
                    icon: "student",
                    noCache: true,
                    active_icon: "student-active"
                }
            },
            {
                path: "add-student",
                component: () =>
                    import ("@/views/student/children/add-student"),
                name: "AddStudent",
                hidden: true,
                meta: {
                    title: "添加学生",
                    activeMenu: "/student/index",
                    noCache: true
                }
            },
            {
                path: "learn-details",
                redirect: "/classes/students/:classesId/student-details/:studentId/index",
                hidden: true,
                name: "learnDetails",
                meta: {
                    activeMenu: "/student/index",
                    noCache: true,
                    title: "学情报告"
                }
            },
            {
                path: "evaluation-information/:sid",
                component: () =>
                    import ("@/views/student/evaluation"),
                redirect: "/student/evaluation-information/:sid/index",
                hidden: true,
                meta: {
                    noCache: true,
                    title: "评测信息列表"
                },
                children: [{
                        path: "index",
                        component: () =>
                            import ("@/views/student/evaluation/evaluationList"),
                        name: "EvaluationList",
                        meta: {
                            title: "评测信息列表",
                            activeMenu: "/student/index",
                            breadcrumb: false,
                            noCache: true
                        }
                    },
                    {
                        path: "stu-evaluation-details/:id",
                        component: () =>
                            import ("@/views/student/evaluation/evaluationInformation"),
                        name: "EvaluationInformation",
                        meta: {
                            activeMenu: "/student/index",
                            title: "评价详情",
                            noCache: true
                                // breadcrumb: false
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "/company-profile",
        component: Layout,
        redirect: "/company-profile/index",
        children: [{
            path: "index",
            component: () =>
                import ("@/views/company-profile/index"),
            name: "CompanyProfile",
            meta: {
                title: "企业介绍",
                icon: "company",
                noCache: true,
                active_icon: "company-active"
            }
        }]
    },
    {
        path: "/teacher-introduce",
        component: Layout,
        redirect: "/teacher-introduce/index",
        meta: {
            title: "师资介绍",
            noCache: true
        },
        children: [{
                path: "index",
                component: () =>
                    import ("@/views/teacher-introduce/index"),
                name: "TeacherIntroduce",
                meta: {
                    breadcrumb: false,
                    noCache: true,
                    title: "师资介绍",
                    icon: "teacher-introduce",
                    active_icon: "teacher-introduce-active"
                }
            },
            {
                path: "addTeacher",
                component: () =>
                    import ("@/views/teacher-introduce/children/add-teacher"),
                name: "AddTeacherIntroduce",
                hidden: true,
                meta: {
                    title: "添加教师",
                    activeMenu: "/teacher-introduce/index",
                    noCache: true
                }
            }
        ]
    },
    {
        path: "/listening-course",
        component: Layout,
        redirect: "/listening-course/index",
        meta: {
            title: "试听课程",
            noCache: true
        },
        children: [{
                path: "index",
                component: () =>
                    import ("@/views/listening-course"),
                name: "ListeningCourse",
                meta: {
                    breadcrumb: false,
                    title: "试听课程",
                    noCache: true,
                    icon: "listening-course",
                    active_icon: "listening-course-active"
                }
            },
            {
                path: "addCourse",
                component: () =>
                    import ("@/views/listening-course/children/addCourse"),
                name: "AddCourse",
                hidden: true,
                meta: {
                    title: "添加课程",
                    activeMenu: "/listening-course/index",
                    noCache: true
                }
            }
        ]
    },
    {
        path: "/student-evaluation",
        component: Layout,
        redirect: "/student-evaluation/index",
        meta: {
            title: "学生评测设置",
            noCache: true
        },
        children: [{
            path: "index",
            component: () =>
                import ("@/views/student-evaluation"),
            name: "StudentEvaluation",
            meta: {
                breadcrumb: false,
                title: "学生评测设置",
                noCache: true,
                icon: "student-evaluation",
                active_icon: "student-evaluation-active"
            }
        }, {
            path: "releaseEvaluation",
            component: () =>
                import ("@/views/student-evaluation/children/releaseEvaluation"),
            name: "ReleaseEvaluation",
            hidden: true,
            meta: {
                title: "发布测评",
                activeMenu: "/student-evaluation/index",
                noCache: true
            }
        }]
    },
    // {
    //     path: "/teacher-evaluation",
    //     component: Layout,
    //     redirect: "/teacher-evaluation/index",
    //     children: [{
    //         path: "index",
    //         component: () =>
    //             import ("@/views/teacher-evaluation"),
    //         name: "TeacherEvaluation",
    //         meta: {
    //             title: "教师考核设置",
    //             noCache: true,
    //             icon: "teacher-evaluation",
    //             active_icon: "teacher-evaluation-active"
    //         }
    //     }]
    // },
    {
        path: "/resources",
        component: Layout,
        redirect: "/resources/index",
        children: [{
            path: "index",
            component: () =>
                import ("@/views/resources"),
            name: "Resources",
            meta: {
                title: "教学资源",
                noCache: true,
                icon: "resources",
                active_icon: "resources-active"
            }
        }]
    },
    {
        path: "/question",
        component: Layout,
        redirect: "/question/index",
        children: [{
            path: "index",
            component: () =>
                import ("@/views/question"),
            name: "QuestionManage",
            meta: {
                title: "教学题库",
                noCache: true,
                icon: "question",
                active_icon: "question-active"
            }
        }]
    }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    /** when your routing map is too long, you can split it into small modules **/
    // 404 page must be placed at the end !!!
    {
        path: "*",
        redirect: "/404",
        hidden: true
    }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    });

const router = createRouter();

// Detail see:
// https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;