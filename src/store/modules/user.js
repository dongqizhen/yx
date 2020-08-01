import {
    login,
    logout,
    getInfo,
    setPassword,
    verifySendCode
} from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
    token: getToken(),
    name: "", //名字
    avatar: "", //头像
    schoolList: [], //学校列表
    school: { //学校信息
        schoolName: '',
        schoolId: ''
    },
    teacherIndex: '0', //教师所在学校的index
    introduction: "",
    roles: []
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_SCHOOL: (state, school) => {
        state.school = school
    },
    SET_TEACHERINDEX: (state, index) => {
        state.teacherIndex = index
    },
    SET_SCHOOLLIST: (state, list) => {
        state.schoolList = list
    }
};

const actions = {
    // user login
    login({
        commit,
        dispatch
    }, userInfo) {
        // console.log(userInfo);
        const { telephone, password, code } = userInfo;
        return new Promise((resolve, reject) => {
            login({
                telephone: telephone,
                password: password ?
                    password : code,
                loginType: password ?
                    1 : 0
            }).then(response => {
                const { data } = response.data;
                //console.log(data);
                if (data.loginFirst == 1) {
                    commit("SET_TOKEN", data.token);
                    setToken(data.token)
                    dispatch('getInfo')
                }

                resolve(data)
            }).catch(error => {
                reject(error);
            });
        });
    },

    setPassword({
        commit,
        state,
        dispatch
    }, info = {
        telephone: '',
        password: ''
    }) {
        return new Promise((resolve, reject) => {
            console.log(info)
            const { telephone, password, userInfo, code } = info

            let flag = false
            if (Object.keys(userInfo).length == 0) {
                //忘记密码
                verifySendCode({
                    telephone,
                    sendCode: code
                }).then(res => {
                    if (res == undefined) {
                        reject()
                    } else {
                        setPassword({
                            telephone,
                            password,
                            code
                        }).then(response => {
                            if (response.data.code == 0) {
                                if (Object.keys(userInfo).length) {
                                    commit("SET_TOKEN", userInfo.token);
                                    setToken(userInfo.token)
                                    dispatch('getInfo')
                                }
                                resolve(response)
                            }
                        })
                    }
                })
            } else {
                setPassword({
                    telephone,
                    password,
                    code
                }).then(response => {
                    if (response.data.code == 0) {
                        if (Object.keys(userInfo).length) {
                            commit("SET_TOKEN", userInfo.token);
                            setToken(userInfo.token)
                            dispatch('getInfo')
                        }
                        resolve(response)
                    }
                })
            }


        })
    },
    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {

            getInfo(state.token).then(response => {

                const { data } = response.data;
                if (!data) {
                    reject("验证失败，请重新登录");
                }
                console.log(22, data)
                const {
                    roles = ["admin"],
                        teacherMemberOtherVos
                } = data;
                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject("getInfo: roles must be a non-null array!");
                }
                commit("SET_SCHOOLLIST", teacherMemberOtherVos)
                const { teacherName: name, teacherPhotoStr: avatar, schoolName, schoolId } = teacherMemberOtherVos[state.teacherIndex]
                commit("SET_SCHOOL", { schoolName, schoolId })
                commit("SET_ROLES", roles);
                commit("SET_NAME", name);
                commit("SET_AVATAR", avatar);
                // commit("SET_INTRODUCTION", introduction);
                resolve({
                    ...data,
                    ... {
                        roles: ["admin"]
                    }
                });
            }).catch(error => {
                reject(error);
            });
        });
    },

    // user logout
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit("SET_TOKEN", "");
                commit("SET_ROLES", []);
                removeToken();
                resetRouter();

                // reset visited views and cached views to fixed
                // https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch("tagsView/delAllViews", null, { root: true });

                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            removeToken();
            resolve();
        });
    },

    // dynamically modify permissions
    changeRoles({
        commit,
        dispatch
    }, role) {
        return new Promise(async resolve => {
            const token = role + "-token";

            commit("SET_TOKEN", token);
            setToken(token);

            const { roles } = await dispatch("getInfo");

            resetRouter();

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch("permission/generateRoutes", roles, { root: true });

            // dynamically add accessible routes
            router.addRoutes(accessRoutes);

            // reset visited views and cached views
            dispatch("tagsView/delAllViews", null, { root: true });

            resolve();
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};