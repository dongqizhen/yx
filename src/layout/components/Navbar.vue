<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile' && false">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <div class="avatar-container right-menu-item">
        <div class="avatar-wrapper">
          <div class="name">
            <span>{{ name }}，欢迎您！</span>
            <span class="school" v-if="schoolList.length <= 1">
              {{ school.schoolName }}
            </span>
            <el-dropdown
              trigger="hover"
              @command="dropClick"
              :tabindex="2"
              v-if="schoolList.length > 1"
            >
              <span class="school">
                {{ school.schoolName }}
                <svg-icon icon-class="drow_arrow" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, i) in schoolList"
                  :key="item.id"
                  :command="i"
                >
                  <span>{{ item.schoolName }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <img :src="avatar" class="user-avatar" />
          <!-- <i class="el-icon-caret-bottom"> </i> -->
        </div>
        <i></i>
        <div class="refresh" @click="refresh">
          <svg-icon icon-class="refresh" />
        </div>

        <div class="logout" @click="logout">
          <svg-icon icon-class="logout" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import Breadcrumb from "@/components/Breadcrumb";
  import Hamburger from "@/components/Hamburger";
  import ErrorLog from "@/components/ErrorLog";
  import Screenfull from "@/components/Screenfull";
  import SizeSelect from "@/components/SizeSelect";
  import Search from "@/components/HeaderSearch";

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      Search
    },
    computed: {
      ...mapGetters([
        "sidebar",
        "avatar",
        "device",
        "name",
        "school",
        "schoolList"
      ])
    },
    methods: {
      ...mapMutations({
        SET_SCHOOL: "user/SET_SCHOOL",
        SET_NAME: "user/SET_NAME",
        SET_AVATAR: "user/SET_AVATAR"
      }),
      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      dropClick(index) {
        console.log(index);
        const {
          schoolName,
          schoolId,
          teacherName,
          teacherPhotoStr
        } = this.schoolList[index];
        this.SET_SCHOOL({
          schoolName,
          schoolId
        });
        this.SET_AVATAR(teacherPhotoStr);
        this.SET_NAME(teacherName);
        this.$router.replace("/");
      },
      //页面刷新
      refresh() {
        location.reload();
      },
      //退出
      async logout() {
        await this.$store.dispatch("user/logout").then(() => {
          clearVuexAlong();
        });
        this.$router.push(`/login`); //?redirect=${this.$route.fullPath}
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";

  .navbar {
    height: $navBarHeight;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: $navBarHeight;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      // line-height: $navBarHeight;
      width: auto;
      &:focus {
        outline: none;
      }
      .avatar-container {
        display: flex !important;
        align-items: center;
        flex-direction: row;
        .avatar-wrapper {
          margin-top: 0 !important;
          display: flex;
          align-items: center;
          height: 100%;
          .name {
            display: flex;
            // height: 100%;
            flex-direction: column;
            justify-content: flex-end;
            // display: initial;
            align-items: flex-end;
            margin-right: 11px;
            span {
              cursor: pointer;
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              display: block;
              line-height: initial;
              color: rgba(80, 90, 100, 1);
              &:first-child {
                font-size: 10px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(80, 90, 100, 1);
              }
            }
            .school {
              // line-height: 0 !important;
            }
            >>> .el-dropdown .school {
              cursor: pointer;
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              display: block;
              line-height: initial;
              color: rgba(80, 90, 100, 1);
            }
          }
          img {
            height: 36px !important;
            width: 36px !important;
            border-radius: 36px !important;
          }
        }
        > i {
          display: flex;
          width: 1px;
          height: 36px;
          background: #f0f0f0;
          margin: 0 30px;
        }
        .logout,
        .refresh {
          width: 28px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .svg-icon {
            width: 28px;
            height: 28px;
          }
        }
        .logout {
          margin-left: 22px;
        }
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        padding-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
