<template>
  <div class="login-container">
    <div class="login-content">
      <div class="content">
        <div
          class="back"
          v-if="forgetPwd || isNewUser"
          @click="
            () => {
              forgetPwd = false;
              isNewUser = false;
            }
          "
        >
          <span class="svg-back"><svg-icon icon-class="loginBack"/></span>
          返回
        </div>
        <div class="logo">
          <img src="../../assets/images/logo.png" alt="logo的位置" />
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div v-if="forgetPwd || isNewUser" class="findPwd">
            {{ forgetPwd ? "找回密码" : "设置密码" }}
          </div>
          <!-- 手机号 -->
          <el-form-item prop="telephone" v-if="!isNewUser">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input
              ref="telephone"
              v-model="loginForm.telephone"
              placeholder="请输入手机号"
              name="telephone"
              type="text"
              tabindex="1"
              autocomplete="on"
              maxlength="11"
            />
          </el-form-item>
          <!-- 密码登录----密码 -->
          <el-form-item
            v-if="!codeLogin && !forgetPwd"
            prop="password"
            class="formCode"
          >
            <span class="svg-container">
              <svg-icon icon-class="newPwd" />
            </span>
            <el-input
              ref="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              name="password"
              type="password"
              tabindex="4"
              autocomplete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item
            v-if="!isNewUser && (forgetPwd || codeLogin)"
            prop="code"
            class="formCode"
          >
            <span class="svg-container">
              <svg-icon icon-class="code" />
            </span>
            <el-input
              ref="code"
              v-model="loginForm.code"
              class="code"
              placeholder="请输入验证码"
              name="code"
              type="text"
              tabindex="2"
              autocomplete="on"
              @keyup.enter.native="handleLogin"
            >
              <i slot="suffix">
                <span @click="getCode">{{ codeMsg }}</span>
              </i>
            </el-input>
          </el-form-item>
          <!-- 忘记密码 -->
          <el-form-item v-if="forgetPwd" prop="password" class="newPassword">
            <span class="svg-container">
              <svg-icon icon-class="newPwd" />
            </span>
            <el-input
              ref="newPassword"
              v-model="loginForm.password"
              placeholder="请输入6-10位新密码"
              name="password"
              type="password"
              tabindex="3"
              autocomplete="on"
              maxlength="10"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <!-- 设置密码 -->
          <el-form-item v-if="isNewUser" prop="password" class="setPwd">
            <span class="svg-container">
              <svg-icon icon-class="newPwd" />
            </span>
            <el-input
              ref="setPwd"
              v-model="loginForm.password"
              placeholder="请设置6-10位密码"
              name="password"
              type="password"
              tabindex="1"
              autocomplete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <!-- <el-form-item v-if="isNewUser">
            <span class="svg-container">
              <svg-icon icon-class="newPwd" />
            </span>
            <el-input
              ref="newPassword"
              v-model="loginForm.password"
              placeholder="请输入6-10位新密码"
              name="password"
              type="text"
              tabindex="3"
              autocomplete="on"
              maxlength="10"
            />
          </el-form-item> -->
          <div v-if="!(forgetPwd || isNewUser)" class="pwdLogin">
            <span @click="codeLogin = !codeLogin">
              {{ codeLogin ? "密码登录" : "验证码登录" }}
            </span>
            <span @click="forgetPwd = true">忘记密码?</span>
          </div>

          <el-button
            :loading="loading"
            type="primary"
            @click.native.prevent="handleLogin"
          >
            {{ forgetPwd ? "确定" : "登录" }}
          </el-button>
        </el-form>
      </div>
      <div class="banner">
        <!-- <img
          src="../../assets/images/login-show.png"
          style="object-fit: cover"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
  import { validUsername, validPhone } from "@/utils/validate";
  import request from "@/utils/request";
  import SocialSign from "./components/SocialSignin";
  const validatePhone = (rule, value, callback) => {
    if (value) {
      //console.log(validPhone);
      if (!validPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    } else {
      callback(new Error("请输入手机号"));
    }
  };
  const validateCode = (rule, value, callback) => {
    if (value.length != 4) {
      callback(new Error("验证码为4位数字"));
    } else {
      callback();
    }
  };
  const validatePassword = (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error("密码不少于6位"));
    } else if (value.length > 10) {
      callback(new Error("密码不能超过10位"));
    } else {
      callback();
    }
  };
  export default {
    name: "Login",
    components: { SocialSign },
    data() {
      return {
        codeLogin: true, // 默认验证码登录
        forgetPwd: false,
        setPwd: false, //设置密码
        loginForm: {
          telephone: "",
          code: "",
          password: ""
        },
        loginRules: {
          telephone: [
            { required: true, trigger: "blur", validator: validatePhone }
          ],
          code: [{ trigger: "blur", validator: validateCode }],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 6,
              max: 10,
              trigger: ["blur", "change"],
              message: "长度为6-10个字符"
            }
          ]
        },
        passwordType: "password",
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined,
        otherQuery: {},
        isNewUser: false,
        timer: null,
        errorTxt: "",
        countdown: 60,
        codeDisabled: true,
        codeMsg: "获取验证码",
        userInfo: {}
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query;
          if (query) {
            this.redirect = query.redirect;
            this.otherQuery = this.getOtherQuery(query);
          }
        },
        immediate: true
      },
      codeLogin() {
        this.$refs.loginForm.resetFields();
      },
      forgetPwd() {
        this.$refs.loginForm.resetFields();
      }
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      getCode() {
        if (!this.loginForm.telephone) {
          return;
        } else {
          if (!validPhone(this.loginForm.telephone)) {
            return;
          }
        }
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= 60) {
              this.countdown--;
              if (this.countdown !== 0) {
                this.codeDisabled = true;
                this.codeMsg = "重新发送(" + this.countdown + ")";
              } else {
                clearInterval(this.timer);
                this.codeMsg = "重新发送";
                this.countdown = 60;
                this.timer = null;
                this.codeDisabled = false;
              }
            }
          }, 1000);
          // 请求接口
          request({
            url: "/echo-art/api/member/sendMemberCode",
            method: "post",
            data: {
              telephone: this.loginForm.telephone
            }
          }).then(res => {
            console.log("checkcode");
            console.log(res);
          });
        }
      },
      checkCapslock(e) {
        const { key } = e;
        this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
      },
      showPwd() {
        if (this.passwordType === "password") {
          this.passwordType = "";
        } else {
          this.passwordType = "password";
        }
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;

            if (this.isNewUser || this.forgetPwd) {
              this.$store
                .dispatch("user/setPassword", {
                  ...this.loginForm,
                  userInfo: this.userInfo
                })
                .then(res => {
                  this.loading = false;
                  if (this.forgetPwd && res.data.code == 0) {
                    this.$message.success("密码设置成功");
                    this.forgetPwd = false;

                    return;
                  }
                  this.$router.push({
                    path: this.redirect || "/",
                    query: this.otherQuery
                  });
                })
                .catch(() => {
                  this.loading = false;
                });
              return;
            }
            this.$store
              .dispatch("user/login", this.loginForm)
              .then(res => {
                // console.log(333, res);
                this.userInfo = res;
                if (res.loginFirst) {
                  this.$router.push({
                    path: this.redirect || "/",
                    query: this.otherQuery
                  });
                } else {
                  this.isNewUser = true;
                }

                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
      }
      // afterQRScan() {
      //   if (e.key === 'x-admin-oauth-code') {
      //     const code = getQueryObject(e.newValue)
      //     const codeMap = {
      //       wechat: 'code',
      //       tencent: 'code'
      //     }
      //     const type = codeMap[this.auth_type]
      //     const codeName = code[type]
      //     if (codeName) {
      //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //         this.$router.push({ path: this.redirect || '/' })
      //       })
      //     } else {
      //       alert('第三方登录失败')
      //     }
      //   }
      // }
    }
  };
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        // padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      rgba(78, 170, 255, 1) 0%,
      rgba(41, 81, 255, 1) 100%
    );
    .login-content {
      width: 70%;
      height: 70%;
      display: flex;
      max-height: 788px;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 4px 34px 0px rgba(0, 80, 218, 0.79);
      border-radius: 16px;
      overflow: hidden;
      .content {
        width: 38%;
        height: 100%;
        min-width: 308px;
        padding: 0 4.8%;
        background-color: #fff;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        position: relative;
        .back {
          color: #0050da;
          font-size: 18px;
          font-weight: bold;
          color: rgba(42, 148, 255, 1);
          height: 25px;
          line-height: 25px;
          margin-top: 22px;
          position: absolute;
          left: 6px;
          cursor: pointer;
        }
        .logo {
          width: 54%;
          // height: 14.8%;
          margin: 20.68% auto;
          margin-bottom: 10.8%;
          img {
            width: 100%;
          }
        }
        .findPwd {
          font-size: 16px;
          color: rgba(42, 148, 255, 1);
          line-height: 22px;
          margin-bottom: 8px;
        }
        /deep/ .el-form-item {
          height: 44px;
          background: rgba(247, 247, 247, 1);
          border-radius: 29px;
          margin-bottom: 26px;
          padding: 3px 4px;
          .el-form-item__content {
            display: flex;
            align-items: center;
            height: 100%;
            .el-input {
              height: 100%;
              input {
                color: #333;
                caret-color: #333;
                &:-webkit-autofill {
                  color: #333;
                  box-shadow: 0 0 0px 1000px #f7f7f7 inset !important;
                  -webkit-text-fill-color: #333 !important;
                }
              }
              .el-input__inner {
                height: 100%;
                padding-left: 0;
              }
            }
          }
          &.setPwd {
            margin-bottom: 100px;
          }
        }
        .formCode {
          margin-bottom: 16px;
          /deep/ .el-input__inner {
            padding-right: 0;
          }
        }
        .newPassword {
          margin-top: 26px;
          margin-bottom: 48px;
        }

        /deep/ .el-input__suffix {
          cursor: pointer;
          right: 0;
          .el-input__suffix-inner {
            display: flex;
            align-items: center;
            height: 100%;
            background: rgba(38, 140, 255, 1);
            border-radius: 29px;
            padding: 0 10px;
            i {
              font-style: normal;
              span {
                color: #fff;
                font-size: 14px;
              }
            }
            transition: opacity 0.4s;
            &:hover {
              opacity: 0.8;
            }
          }
        }
        .pwdLogin {
          display: flex;
          justify-content: space-between;
          color: rgba(42, 148, 255, 1);
          line-height: 20px;
          margin-bottom: 34px;
          font-size: 14px;
          > span {
            cursor: pointer;
          }
        }
        .el-button {
          width: 100%;
          height: 44px;
          background: linear-gradient(
            135deg,
            rgba(78, 170, 255, 1) 0%,
            rgba(41, 81, 255, 1) 100%
          );
          box-shadow: 0px 6px 10px 0px rgba(55, 142, 255, 0.56);
          border-radius: 29px;
          font-size: 18px;
          color: #fff;
          margin-bottom: 25%;
          transition: opacity 0.4s;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .banner {
        width: 62%;
        height: 100%;
        overflow: hidden;
        background: url("../../assets/images/login-show.png") no-repeat center /
          cover;
        img {
          width: 100%;
        }
      }
    }

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      width: 15%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      .svg-icon {
        width: 20px;
        height: 20px;
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
