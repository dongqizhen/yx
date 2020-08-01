<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <!-- <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div> -->
    <canvas
      v-show="false"
      :width="nWidth"
      :height="nHeight"
      ref="canvas"
    ></canvas>
  </div>
</template>

<script>
  /**
   * docs:
   * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
   */
  import editorImage from "./components/EditorImage";
  import plugins from "./plugins";
  import toolbar from "./toolbar";
  import load from "./dynamicLoadScript";
  import { getToken } from "@/utils/auth";
  import zh_CN from "./languages/zh_CN";
  import { updateSchool_introduction } from "@/api/school";
  import mimes from "./utils/mimes.js";
  import data2blob from "./utils/data2blob.js";
  import getBase64 from "./utils/getBase64";
  import Deferred from "./utils/deferred";
  import request from "./utils/request";
  // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
  //const tinymceCDN = "https://cdn.jsdelivr.net/npm/tinymce@5.3.1/tinymce.min.js";
  //const tinymceCDN = "@/assets/tinymce/tinymce.min.js";

  export default {
    name: "Tinymce",
    components: { editorImage },
    props: {
      id: {
        type: String,
        default: function () {
          return (
            "vue-tinymce-" +
            +new Date() +
            ((Math.random() * 1000).toFixed(0) + "")
          );
        },
      },
      value: {
        type: String,
        default: "",
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return [];
        },
      },
      menubar: {
        type: String,
        default: "file edit insert view format table",
      },
      plugin: { type: String, default: "" },
      height: {
        type: [Number, String],
        required: false,
        default: 360,
      },
      width: {
        type: [Number, String],
        required: false,
        default: "auto",
      },
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false,
        newImgUrl: [],
        languageTypeList: {
          en: "en",
          zh: "zh_CN",
          es: "es_MX",
          ja: "ja",
        },
        sourceImgUrl: "",
        sourceImg: "",
        createImgUrl: "",
        nWidth: "0",
        nHeight: "0",
        newPlugin: [],
      };
    },
    computed: {
      containerWidth() {
        const width = this.width;
        if (/^[\d]+(\.[\d]+)?$/.test(width)) {
          // matches `100`, `'100'`
          return `${width}px`;
        }
        return width;
      },
    },
    watch: {
      value(val) {
        //console.log(val, this.hasInit, this.hasChange);
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(
            () =>
              window.tinymce &&
              window.tinymce.get(this.tinymceId).setContent(val || "")
          );
        }
      },
    },
    mounted() {
      // this.tinymceId = this.id;

      if (this.plugin != "") {
        let arr = _.split(plugins[0], " ");
        _.remove(arr, (o) => {
          return o == this.plugin;
        });
        this.newPlugin = [_.join(arr, " ")];
      } else {
        this.newPlugin = plugins;
      }
      this.init();
    },
    activated() {
      if (window.tinymce) {
        this.initTinymce();
      }
    },
    deactivated() {
      this.destroyTinymce();
    },
    destroyed() {
      this.destroyTinymce();
    },
    methods: {
      init() {
        //dynamic load tinymce from cdn
        // load(tinymceCDN, err => {
        //   if (err) {
        //     this.$message.error(err.message);
        //     return;
        //   }
        //   tinymce.addI18n("zh", zh_CN);
        //   this.initTinymce();
        // });
        tinymce.addI18n("zh", zh_CN);
        this.initTinymce();
      },
      yourCustomFilter(content) {
        // Implement your custom filtering and return the filtered content
        let str = content.replace(/width: \w+;?/g, "");
        return str;
      },
      initTinymce() {
        const _this = this;

        window.tinymce.init({
          selector: `#${this.tinymceId}`,
          language: "zh",
          //language_url: "./languages/zh_CN.js",
          height: this.height,
          font_formats:
            "宋体=SimSun;微软雅黑=Microsoft Yahei;华文黑体=STHeiti;华文楷体=STKaiti;华文仿宋=华文仿宋;思源黑体=Source Han Sans CN;思源宋体=Source Han Serif SC;华文细黑=STXihei;黑体=SimHei;方正粗圆简体=方正粗圆简体;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;PingFang SC=PingFang SC;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          contextmenu:
            "link image imagetools inserttable | cell row column deletetable | headings",
          content_css: [
            "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
            "//www.tinymce.com/css/codepen.min.css",
          ],

          //skin: "oxide-dark", //皮肤
          //statusbar: false, //底部状态栏
          body_class: "panel-body",
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: this.menubar,
          plugins: [...this.newPlugin],
          quickbars_selection_toolbar:
            "bold italic underline forecolor backcolor | fontselect |fontsizeselect | formatselect | quicklink blockquote",
          quickbars_image_toolbar:
            "alignleft aligncenter alignright quicklink |  imageoptions",
          // external_plugins: {
          //   powerpaste: "/public/tinymce/plugins/powerpaste/plugin.min.js"
          // },
          formats: {
            alignleft: {
              block: "div",
              styles: { display: "flex", justifyContent: "flex-start" },
              classes: "left",
            },
            aligncenter: {
              block: "div",
              styles: {
                display: "flex",
                justifyContent: "center",
              },
              classes: "center",
            },
            alignright: {
              block: "div",
              styles: { display: "flex", justifyContent: "flex-end" },
              classes: "right",
            },
          },
          quickbars_insert_toolbar: "quickimage quicktable media", //"quickimage quicktable | hr pagebreak",

          autosave_restore_when_empty: false, //浏览器崩溃自动保存本地
          end_container_on_empty_block: true,
          powerpaste_word_import: "merge", // 参数可以是propmt, merge, clean，效果自行切换对比
          powerpaste_html_import: "merge", // propmt, merge, clean
          powerpaste_allow_local_images: true,
          paste_data_images: true,
          paste_preprocess: (pluginApi, data) => {
            //console.log(data);
            // Apply custom filtering by mutating data.content
            // For example:
            const content = data.content;

            const newContent = this.yourCustomFilter(content);
            data.content = newContent;
          },
          code_dialog_height: 450,
          code_dialog_width: 1000,
          charmap_append: [],
          // advlist_bullet_styles: "circle",
          // advlist_number_styles: "default",
          imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
          image_advtab: false,
          // image_uploadtab: false,
          default_link_target: "_blank",
          link_title: false,
          media_live_embeds: true,
          //想要哪一个图标提供本地文件选择功能，参数可为media(媒体)、image(图片)、file(文件)
          file_picker_types: "media",
          media_alt_source: false,
          //media_poster: false,
          //media_filter_html: false,
          // file_picker_callback: function(callback, value, meta) {
          //   //当点击meidia图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
          //   console.log(meta);
          //   if (meta.filetype == "media") {
          //     //创建一个隐藏的type=file的文件选择input
          //     let input = document.createElement("input");
          //     input.setAttribute("type", "file");
          //     input.onchange = function() {
          //       let file = this.files[0]; //只选取第一个文件。如果要选取全部，后面注意做修改
          //       console.log(file);

          //       const url = "";
          //       let xhr, formData;
          //       xhr = new XMLHttpRequest();
          //       xhr.open("POST", self.apiUrl);
          //       xhr.withCredentials = self.credentials;
          //       xhr.upload.onprogress = function(e) {
          //         // 进度(e.loaded / e.total * 100)
          //         let percent = (e.loaded / e.total) * 100;
          //         if (percent < 100) {
          //           tinymce.activeEditor.setProgressState(true); //是否显示loading状态：1（显示）0（隐藏）
          //         } else {
          //           tinymce.activeEditor.setProgressState(false);
          //         }
          //       };
          //       xhr.onerror = function() {
          //         //根据自己的需要添加代码
          //         tinymce.activeEditor.setProgressState(false);
          //         return;
          //       };
          //       xhr.onload = function() {
          //         let json;
          //         if (xhr.status < 200 || xhr.status >= 300) {
          //           console.log("HTTP 错误: " + xhr.status);
          //           return;
          //         }
          //         json = JSON.parse(xhr.responseText);
          //         //假设接口返回JSON数据为{status: 0, msg: "上传成功", data: {location: "/localImgs/1546434503854.mp4"}}
          //         if (json.status == 0) {
          //           //接口返回的文件保存地址
          //           let mediaLocation = json.data.location;
          //           //cb()回调函数，将mediaLocation显示在弹框输入框中
          //           callback(mediaLocation, { title: file.name });
          //         } else {
          //           console.log(json.msg);
          //           return;
          //         }
          //       };
          //       formData = new FormData();
          //       //假设接口接收参数为file,值为选中的文件
          //       formData.append("file", file);
          //       //正式使用将下面被注释的内容恢复
          //       xhr.send(formData);
          //     };
          //     //触发点击
          //     input.click();
          //   }
          // },
          media_url_resolver: function (data, resolve) {
            try {
              let videoUri = encodeURI(data.url);
              let embedHtml = `<p><video controls="controls" width="100%" height="auto">
                                                                                                                                                                                                                                                                                      <source src="${videoUri}" type="video/mp4" /></video></p>
                                                                                                                                                                                                                                                                                      <p style="text-align: left;">&nbsp;</p>`;
              resolve({ html: embedHtml });
            } catch (e) {
              resolve({ html: "" });
            }
          },
          save_enablewhendirty: true,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          init_instance_callback: (editor) => {
            if (_this.value) {
              editor.setContent(_this.value);
            }
            _this.hasInit = true;
            editor.on("NodeChange Change KeyUp SetContent", () => {
              if (this.value !== "") {
                this.hasChange = true;
              }

              this.$emit("input", editor.getContent());
            });
          },
          save_onsavecallback: () => {
            let content = window.tinymce.get(this.id).getContent();
            // 匹配并替换 任意html元素中 url 路径

            if (this.newImgUrl.length) {
              content = content.replace(
                /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
                (mactch, capture) => {
                  let current = "";
                  console.log(this.newImgUrl);
                  for (let i = 0; i < this.newImgUrl.length; i++) {
                    console.log(
                      capture.replace(/(&amp;)/gi, "&") ==
                        this.newImgUrl[i].originUrl
                    );
                    if (
                      capture.replace(/(&amp;)/gi, "&") ==
                      this.newImgUrl[i].originUrl
                    ) {
                      current = this.newImgUrl[i].url;
                      break;
                    }
                  }

                  // this.newImgUrl.forEach(item => {
                  //   console.log(
                  //     item.originUrl == capture.replace(/(&amp;)/gi, "&")
                  //   );
                  //   if (capture.replace(/(&amp;)/gi, "&") == item.originUrl) {
                  //     current = item.url;
                  //   }
                  // });
                  current = current ? current : capture;
                  console.log(4, current);
                  return mactch.replace(
                    /src=[\'\"]?([^\'\"]*)[\'\"]?/i,
                    "src=" + current
                  );
                }
              );
            } // 匹配并替换 img中src图片路径

            updateSchool_introduction({
              content,
            }).then((res) => {
              if (res) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  // center: true,
                  duration: 2 * 1000,
                });
                this.newImgUrl = [];
                window.tinymce.get(this.tinymceId).setContent(content);
              }
            });
          },
          setup(editor) {
            editor.on("FullscreenStateChanged", (e) => {
              _this.fullscreen = e.state;
            });
          },
          images_upload_handler(blobInfo, success, failure, progress) {
            // progress(0);

            const url =
              process.env.NODE_ENV !== "production"
                ? "/echo-art/upload/uploadImages"
                : "/echo-art/upload/uploadImages";

            _this.setSourceImg(blobInfo.blob()).then((res) => {
              if (res) {
                request({
                  url,
                  file: data2blob(res, mimes["png"]),
                  filename: "file" + "." + "png",
                }).then((res) => {
                  if (res.data.code == 0) {
                    success(res.data.data.url);
                  } else {
                    failure("Invalid JSON: " + res.data.msg);
                  }
                });
              }
            });
          },
          urlconverter_callback(url, node, on_save, name) {
            //设置白名单
            const assignUrl = [
              "blob:http://localhost",
              "data:image/gif;base64",
              "http://192.168.2.221",
              "http://192.168.2.222",
              "http://192.168.2.223",
              "http://192.168.2.224",
              "https://art.wecho.com.cn",
            ];

            let curl = url;
            let isInnerUrl = false; //默认不是内部链接
            try {
              assignUrl.forEach((item) => {
                if (url.indexOf(item) > -1) {
                  isInnerUrl = true;
                  throw new Error("EndIterate");
                }
              });
            } catch (e) {
              if (e.message != "EndIterate") throw e;
            }

            if (node == "img" && !isInnerUrl) {
              let json;
              getBase64(url).then((base64) => {
                // console.log(tinymce.activeEditor.getContent());
                const url =
                  process.env.NODE_ENV !== "production"
                    ? "/echo-art/upload/uploadImages"
                    : "/echo-art/upload/uploadImages";

                request({
                  url,
                  file: data2blob(base64, mimes["png"]),
                  filename: "file" + "." + "png",
                }).then((res) => {
                  if (res.data.code == 0) {
                    _this.newImgUrl.push({
                      originUrl: curl,
                      url: res.data.data.url,
                    });

                    //return res.data.data.url;
                    //deferred.resolve(res.data.url);
                  } else {
                    failure("Invalid JSON: " + res.data.data.msg);
                  }
                });
              });
            }

            return url;
          },
        });
      },
      async createImg(e) {
        let canvas = this.$refs.canvas,
          ctx = canvas.getContext("2d");
        canvas.width = this.nWidth;
        canvas.height = this.nHeight;
        ctx.clearRect(0, 0, this.nWidth, this.nHeight);
        // if (imgFormat == "png") {
        ctx.fillStyle = "rgba(0,0,0,0)";
        // } else {
        // 如果jpg 为透明区域设置背景，默认白色
        // ctx.fillStyle = "#fff";
        // }
        ctx.fillRect(0, 0, this.nWidth, this.nHeight);
        // console.log(this.nWidth, this.nHeight, this.sourceImg);
        ctx.drawImage(this.sourceImg, 0, 0, this.nWidth, this.nHeight);

        const url = canvas.toDataURL(mimes["png"]);
        this.createImgUrl = url;
        return url;
      },
      // 设置图片源

      async setSourceImg(file) {
        // this.$dispatch("srcFileSet", file.name, file.type, file.size);
        let that = this,
          fr = new FileReader();
        let deferred = new Deferred();
        await (fr.onload = async function (e) {
          that.sourceImgUrl = fr.result;
          //that.startCrop();
          let img = new Image();
          img.src = fr.result;
          img.onload = await async function () {
            that.nWidth = img.naturalWidth;
            that.nHeight = img.naturalHeight;
            that.sourceImg = img;

            await that.createImg().then((res) => {
              deferred.resolve(res);
            });
          };
        });

        fr.readAsDataURL(file);
        return deferred.promise;
      },
      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId);
        if (this.fullscreen) {
          tinymce.execCommand("mceFullScreen");
        }

        if (tinymce) {
          tinymce.destroy();
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value);
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent();
      },
      imageSuccessCBK(arr) {
        const _this = this;
        arr.forEach((v) => {
          window.tinymce
            .get(_this.tinymceId)
            .insertContent(`<img class="wscnph" width="auto" src="${v.url}" >`);
        });
      },
    },
  };
</script>
<style>
  .el-dialog__wrapper {
    z-index: 10010 !important;
  }
  .tox-silver-sink {
    z-index: 10000 !important;
  }
</style>
<style scoped lang="scss">
  .tinymce-container {
    position: relative;
    height: 100%;
    line-height: normal;
    >>> .tox-tinymce {
      height: 100% !important;
      .tox-editor-container {
        .tox-editor-header {
          .tox-toolbar-overlord {
            .tox-toolbar {
              &:nth-child(2) {
                .tox-toolbar__group {
                  position: relative;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  > button[title="保存"] {
                    position: absolute;
                    right: 5px;
                    top: 0px;
                    background: rgb(24, 144, 255);
                    border-radius: 6px;
                    color: #fff;
                    width: 100px;

                    cursor: pointer;
                    &.tox-tbtn--disabled {
                      cursor: default;
                      opacity: 0.8;
                      .tox-icon {
                        color: #b3b3b3;
                      }
                    }
                    //top: 4px;
                    > .tox-icon {
                      color: #fff;
                      &::before {
                        content: "保 存";
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                      }
                      svg {
                        display: none;
                        fill: #fff;
                      }
                    }
                    &:hover {
                      color: #fff;
                      opacity: 0.8;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .tox-statusbar {
        .tox-statusbar__text-container {
          .tox-statusbar__branding {
            display: none;
          }
        }
        .tox-statusbar__resize-handle {
          display: none;
        }
      }
    }
    >>> .mce-tinymce {
      height: 100%;
      .mce-container-body {
        height: 100%;
        width: 100%;
        // display: flex;
        // flex-direction: column;
        /deep/ .mce-toolbar.mce-first {
          > .mce-container-body {
            display: flex;
            justify-content: flex-start;
            .mce-container {
              width: auto;
            }
          }
        }
        .mce-last {
          .mce-flow-layout {
            .mce-btn-group {
              width: 100%;
              > div {
                position: relative;
              }
              .mce-btn-has-text.mce-last.mce-widget.mce-btn:not(.mce-listbox) {
                position: absolute;
                right: 5px;
                background: rgb(24, 144, 255);
                border-radius: 6px;
                > button {
                  color: #fff;
                  .mce-i-save {
                    &::before {
                      color: #fff;
                      font-size: 14px;
                    }
                  }
                }
                &:hover {
                  color: #fff;
                }
              }
            }
          }
        }
        .mce-colorbutton {
          > button {
            .mce-preview {
              margin-left: -16px;
            }
          }
        }
        .mce-menubtn {
          &[aria-label="Font Family"],
          &[aria-label="Font Sizes"] {
            border: 1px solid #b3b3b3;
          }
        }

        .mce-top-part {
          display: flex;
        }
        .mce-edit-area {
          height: calc(100% - 103px - 34px);
          iframe {
            height: 100% !important;
          }
        }
        .mce-statusbar {
          //display: none;
          .mce-branding,
          .mce-resizehandle {
            visibility: hidden;
          }
          .mce-path {
            width: 100%;
          }
        }
      }
    }
  }
  .tinymce-container.fullscreen {
    z-index: 10000;
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 5px;
    z-index: 10;
    /*z-index: 2005;*/
  }
  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .editor-upload-btn {
    display: inline-block;
  }
</style>
