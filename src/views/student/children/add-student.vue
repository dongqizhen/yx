<template>
  <div class="add-student main-view">
    <div class="upload-avatar">
      <span class="set-avatar-btn" @click="toggleShow">
        <img v-if="temp.studentPhotoStr" :src="temp.studentPhotoStr" />
      </span>
      <span class="tip">点击添加/修改头像</span>
      <my-upload
        v-model="show"
        field="file"
        :width="300"
        :height="300"
        :url="url"
        :params="params"
        :headers="headers"
        with-credentials
        img-format="png"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
      />
    </div>

    <el-form
      ref="add_or_edit_Form"
      inline
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="100px"
      style="width: 100%;"
    >
      <div class="top">
        <div class="inline">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="temp.studentName" placeholder="请输入学生姓名" />
          </el-form-item>
          <el-form-item label="联系电话" prop="studentPhone">
            <el-input
              v-model="temp.studentPhone"
              :disabled="temp.activateFlag == 1"
              :maxlength="11"
              placeholder="请输入电话/此电话将作为登录账号"
            />
          </el-form-item>
        </div>
        <div class="inline">
          <el-form-item label="用户类型" prop="userType" class="userType">
            <el-radio-group
              v-model="temp.userType"
              :disabled="userTypeDisabled"
            >
              <el-radio :label="0">正式用户</el-radio>
              <el-radio :label="1">试听用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="temp.userType == 0"
            label="班  级"
            prop="className"
            class="classes letter_space"
          >
            <el-select
              v-model="temp.classId"
              filterable
              :popper-append-to-body="false"
              placeholder="请选择班级"
              @change="changeClasses"
            >
              <el-option
                v-for="item in classesList"
                :key="item.id"
                :label="item.classesName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="inline">
          <el-form-item label="性  别" class="letter_space" prop="gender">
            <el-radio-group v-model="temp.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="民  族" class="letter_space height">
            <el-input v-model="temp.nation" placeholder="">
              <!-- <span slot="suffix">cm</span> -->
            </el-input>
          </el-form-item>
        </div>

        <div class="inline">
          <el-form-item label="身  高" class="letter_space height">
            <el-input v-model="temp.height" placeholder="">
              <span slot="suffix">cm</span>
            </el-input>
          </el-form-item>
          <el-form-item label="体  重" class="letter_space weight">
            <el-input v-model="temp.weight" placeholder="">
              <span slot="suffix">kg</span>
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div class="inline">
        <el-form-item label="文理成绩">
          <el-input v-model="temp.score" placeholder="" />
        </el-form-item>
        <el-form-item label="就读高中">
          <el-input v-model="temp.middleSchool" placeholder="" />
        </el-form-item>
      </div>
      <div class="inline">
        <el-form-item label="年  级" class="letter_space">
          <el-input v-model="temp.graderClass" placeholder="" />
        </el-form-item>

        <el-form-item label="出生日期">
          <!-- <el-input placeholder="" v-model="temp.birthday"></el-input> -->
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="选择出生日期"
          />
        </el-form-item>
      </div>
      <div class="inline">
        <el-form-item label="高考省份">
          <el-select
            v-model="temp.examProvinceCode"
            :popper-append-to-body="false"
            placeholder="请选择高考省份"
            @change="handleSelect"
          >
            <el-option
              v-for="item in areaList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="微信/QQ">
          <el-input v-model="temp.qqOrWx" placeholder="" />
        </el-form-item>
      </div>
      <div class="inline">
        <el-form-item label="家长手机" prop="guardianTelephone">
          <el-input
            v-model="temp.guardianTelephone"
            placeholder=""
            :maxlength="11"
          />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="temp.cardId" placeholder="" :maxlength="18" />
        </el-form-item>
      </div>

      <el-form-item label="家庭住址" class="address">
        <el-input v-model="temp.homeAddress" placeholder="" />
      </el-form-item>
      <div class="inline">
        <el-form-item label="父亲姓名">
          <el-input v-model="temp.fatherName" placeholder="父亲姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="fatherTelephone">
          <el-input
            v-model="temp.fatherTelephone"
            placeholder="请输入电话"
            :maxlength="11"
          />
        </el-form-item>
      </div>
      <div class="inline">
        <el-form-item label="母亲姓名">
          <el-input v-model="temp.motherName" placeholder="母亲姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="motherTelephone">
          <el-input
            v-model="temp.motherTelephone"
            placeholder="请输入电话"
            :maxlength="11"
          />
        </el-form-item>
      </div>
      <div class="inline">
        <el-form-item label="高中班主任">
          <el-input
            v-model="temp.middleSchoolTeacher"
            placeholder="班主任姓名"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="middleSchoolTeacherPhone">
          <el-input
            v-model="temp.middleSchoolTeacherPhone"
            placeholder="请输入电话"
            :maxlength="11"
          />
        </el-form-item>
      </div>

      <el-form-item label="艺术经历">
        <el-input
          v-model="temp.artHistory"
          type="textarea"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item>
        <el-button
          class="custom_submit_button"
          :loading="btnLoading"
          @click="onSubmit"
        >
          提&nbsp;&nbsp;交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import myUpload from "vue-image-crop-upload";
  import { fetchClasses_List } from "@/api/classes";
  import { getToken } from "@/utils/auth";
  import { mapGetters } from "vuex";
  import store from "@/store";

  import {
    create_student,
    update_student,
    getStudent_Detail,
    getArea_list,
  } from "@/api/student";

  export default {
    name: "AddStudent",
    components: { myUpload },
    data() {
      return {
        btnLoading: false,
        classNameLoading: true, // 班级加载
        classesList: [], // 班级列表
        areaList: [], // 班级列表
        userTypeDisabled: false,
        temp: {
          // 添加教师验证
          id: undefined,
          studentPhoto: "", // 用户头像id
          studentPhotoStr: "", // 用户头像
          classId: "",
          className: "", // 班级
          studentPhone: "", // 电话
          studentName: "", // 姓名
          gender: 1, // 性别
          userType: 0, // 用户类型
          height: "", // 身高
          weight: "", // 体重
          nation: "", // 民族
          score: "", // 文理成绩
          middleSchool: "", // 高中
          graderClass: "", // 年级
          birthday: null, // 出生日期
          qqOrWx: "", // QQ/微信
          examProvince: "", // 省份
          examProvinceCode: "", // 省份code
          guardianTelephone: "", // 家长手机
          homeAddress: "", // 家庭住址
          cardId: "", // 身份证号
          fatherName: "", // 父亲姓名
          fatherTelephone: "", // 父亲手机
          motherName: "", // 母亲姓名
          motherTelephone: "", // 母亲手机
          middleSchoolTeacher: "", // 高中班主任
          middleSchoolTeacherPhone: "", // 高中班主任电话
          artHistory: "", // 艺术经历
        },
        rules: {
          // 验证教师姓名
          studentName: [
            { required: true, message: "学生姓名必填", trigger: "change" },
            {
              min: 2,
              max: 10,
              message: "学生姓名为2-10个字",
              trigger: "change",
            },
          ],
          // 验证教师电话
          studentPhone: [
            {
              required: true,
              message: "请输入手机号",
              trigger: "change",
            },
            {
              pattern: /^[1][0-9]{10}$/,
              message: "请输入正确的手机号",
              trigger: "change",
            },
          ],
          className: [
            {
              // 班级
              required: true,
              message: "请选择班级",
              trigger: "change",
            },
          ],
          // 验证教师职务类别
          gender: [{ required: true, message: "请选择性别", trigger: "change" }],
          // 用户类型
          userType: [
            { required: true, message: "请选择用户类型", trigger: "change" },
          ],
          guardianTelephone: [
            {
              pattern: /^[1][0-9]{10}$/,
              message: "请输入正确的手机号",
              trigger: "change",
            },
          ],
          fatherTelephone: [
            {
              pattern: /^[1][0-9]{10}$/,
              message: "请输入正确的手机号",
              trigger: "change",
            },
          ],
          motherTelephone: [
            {
              pattern: /^[1][0-9]{10}$/,
              message: "请输入正确的手机号",
              trigger: "change",
            },
          ],
          middleSchoolTeacherPhone: [
            {
              pattern: /^[1][0-9]{10}$/,
              message: "请输入正确的手机号",
              trigger: "change",
            },
          ],
          userType: [{ required: true }],
        },
        show: false, // 图片裁剪框
        params: {},
        headers: {
          serveResource: store.state.settings.serveResource,
          token: getToken(),
          smail: "*_~",
        },
        url:
          process.env.NODE_ENV !== "production"
            ? "/dev-api/echo-art/upload/uploadImages"
            : "/echo-art/upload/uploadImages",
        // the datebase64 url of created image
      };
    },
    computed: {
      ...mapGetters(["school"]),
    },
    created() {
      getArea_list({}).then((res) => {
        console.log("省列表", res);
        this.areaList = res.data.data;
      });
      fetchClasses_List()
        .then((res) => {
          this.classesList = res.data.data.list;
        })
        .then(() => {
          if (this.$route.query.id) {
            getStudent_Detail({ id: this.$route.query.id }).then((res) => {
              console.log(res);
              this.temp = res.data.data;
              if (res.data.data.userType == 0) {
                this.userTypeDisabled = true;
              }
            });
          }
        });
    },
    methods: {
      onSubmit() {
        this.$refs["add_or_edit_Form"].validate((valid) => {
          console.log(this.temp);
          if (valid) {
            this.btnLoading = true;
            if (this.$route.query.id) {
              update_student(this.temp).then((res) => {
                this.btnLoading = false;
                if (res) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                    // center: true,
                    duration: 2 * 1000,
                  });
                }
                this.$router.go(-1);
              });
            } else {
              create_student(this.temp).then((res) => {
                this.btnLoading = false;
                if (res) {
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    // center: true,
                    duration: 2 * 1000,
                  });
                }
                this.$router.go(-1);
              });
            }
          } else {
            return false;
          }
        });
      },
      classNameVisibleChange(visible) {
        // visible &&
        //   this.classNameLoading &&
        //   fetchClasses_List()
        //     .then(res => {
        //       this.classesList = res.data.data.list;
        //     })
        //     .then(() => {
        //       this.classNameLoading = false;
        //     });
      },
      handleSelect(value) {
        // console.log(value);
        const selectOption = this.areaList.find((item) => {
          // 这里的userList就是上面遍历的数据源
          return item.code === value; // 筛选出匹配数据
        });
        this.temp.examProvince = selectOption.name;
      },
      changeClasses(value) {
        console.log(this.classesList);
        const selectOption = this.classesList.find((item) => {
          // 这里的userList就是上面遍历的数据源
          return item.id === value; // 筛选出匹配数据
        });
        this.temp.className = selectOption.classesName;
      },
      toggleShow() {
        this.show = !this.show;
      },
      // 裁剪成功
      cropSuccess(imgDataUrl, field) {
        console.log("-------- crop success --------");
        this.studentPhotoStr = imgDataUrl;
      },
      // 上传成功
      cropUploadSuccess(jsonData, field) {
        console.log("-------- upload success --------");
        console.log(jsonData);
        this.temp.studentPhoto = jsonData.data.urlId;
        this.temp.studentPhotoStr = jsonData.data.url;
      },
      // 上传失败
      cropUploadFail(status, field) {
        console.log("-------- upload fail --------");
        console.log(status);
        console.log("field: " + field);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .add-student {
    padding-top: 30px;
    position: relative;
    .upload-avatar {
      display: flex;
      width: 300px;
      position: absolute;
      flex-direction: column;
      .tip {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        margin-top: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        color: rgba(192, 192, 192, 1);
        line-height: 28px;
      }
      .set-avatar-btn {
        overflow: hidden;
        display: block;
        // margin: 30px auto 10px auto;
        width: 300px;
        height: 300px;
        font-size: 14px;
        line-height: 40px;
        border-radius: 10px;
        text-align: center;
        background: rgba(233, 233, 233, 1);
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .vue-image-crop-upload {
        z-index: 10002;
        background-color: rgba(0, 0, 0, 0.5);
        >>> .vicp-wrap {
          border-radius: 12px;
        }
      }
    }
    >>> .el-form {
      .inline {
        display: flex;
        height: 66.8px;
        .el-form-item {
          margin-right: 70px;
          .el-form-item__error {
            position: absolute !important;
            top: 125%;
          }
        }
      }
      .top {
        padding-left: 370px;
        margin-bottom: 68px;
        margin-top: 26px;
        .sex {
          display: flex;
          > .el-form-item {
            margin-right: 70px;
          }
        }
        .el-form-item {
          margin-bottom: 30px !important;
          .el-form-item__content {
            .el-input {
              width: 250px;
              .el-input__inner {
                border-radius: 20px;
              }
            }
          }
        }
      }
      .el-form-item {
        // width: 100%;
        margin-bottom: 36px;
        display: flex;
        align-items: center;
        position: relative;

        &:not(.is-required) {
          .el-form-item__label {
            &::before {
              display: none;
            }
          }
        }
        &.address {
          .el-input {
            width: 770px !important;
          }
        }
        &.height {
          margin-right: 84px;
        }
        &.weight,
        &.height {
          .el-input {
            width: 138px !important;
            .el-input__suffix {
              padding-right: 10px;
              font-size: 18px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
            }
          }
        }
        &.userType {
          .el-radio {
            &:first-child {
              margin-right: 10px;
            }
          }
        }
        // .el-form-item__label {
        //   font-size: 18px;
        //   font-family: PingFangSC-Semibold, PingFang SC;
        //   font-weight: 600;
        //   color: rgba(80, 90, 100, 1);
        //   &::before {
        //     content: "";
        //     width: 6px;
        //     height: 6px;
        //     position: absolute;
        //     left: 70px;
        //     top: 8px;
        //     background: rgba(255, 112, 112, 1);
        //     // display: block;
        //     border-radius: 6px;
        //   }
        // }
        .el-form-item__content {
          display: flex;
          align-items: center;
          margin-left: 0 !important;
          //height: 36px;
          display: flex;
          align-items: center;
          .el-input {
            width: 300px;
            .el-input__inner {
              border-radius: 20px;
            }
          }
          .el-textarea {
            border-radius: 14px;
            height: 150px;
            width: 770px;
            textarea {
              border-radius: 14px;
              height: 100%;
              resize: none;
            }
            .el-input__count {
              background: transparent !important;
              bottom: 0;
            }
          }
          .el-radio-group {
            display: flex;
          }
          // .el-radio {
          //   display: flex;
          //   align-items: center;
          //   .el-radio__input {
          //     height: 30px;
          //     width: 30px;
          //     border: 1px solid rgba(234, 234, 234, 1);
          //     border-radius: 30px;
          //     background: #fff;
          //     display: flex;
          //     align-items: center;
          //     justify-content: center;
          //     &:not(.is-checked) {
          //       .el-radio__inner {
          //         display: none;
          //       }
          //     }
          //     .el-radio__inner {
          //       width: 18px;
          //       height: 18px;
          //       border-radius: 18px;
          //       background: linear-gradient(
          //         135deg,
          //         rgba(81, 195, 255, 1) 0%,
          //         rgba(42, 148, 255, 1) 100%
          //       );
          //       box-shadow: 0px 0px 4px 0px rgba(94, 181, 255, 0.5);
          //       &::after {
          //         display: none;
          //       }
          //     }
          //   }
          //   &.is-checked {
          //     .el-radio__label {
          //       color: #1890ff;
          //     }
          //   }
          //   .el-radio__label {
          //     font-size: 20px;
          //     font-family: PingFangSC-Regular, PingFang SC;
          //     font-weight: 400;
          //     color: rgba(80, 90, 100, 1);
          //   }
          // }
          .el-form-item__error {
            position: static;
            padding-top: 0;
            margin-left: 12px;
          }
        }
      }
    }
    .submit {
      display: flex;
      width: 110px;
      height: 30px;
      background: linear-gradient(
        135deg,
        rgba(81, 195, 255, 1) 0%,
        rgba(42, 148, 255, 1) 100%
      );
      box-shadow: 0px 6px 10px 0px rgba(94, 181, 255, 0.5);
      border-radius: 20px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      justify-content: center;
      align-items: center;
      //letter-spacing: 9px;
      font-weight: 400;
      cursor: pointer;
      opacity: 1;
      transition: opacity 0.4s;
      color: rgba(255, 255, 255, 1);
      //margin-bottom: 24px;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        background: linear-gradient(
          130deg,
          rgba(28, 147, 255, 1) 0%,
          rgba(0, 122, 234, 1) 100%
        );
      }
    }
  }
</style>
