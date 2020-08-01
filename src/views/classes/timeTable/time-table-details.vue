<template>
  <div class="time-table-details main-view">
    <div class="base-information">
      <h2>课程基本信息</h2>
      <div v-if="courseInfo" class="information-title">
        <div>
          <div class="time">
            <h3>
              {{ courseInfo.day | parseTime("{y}年{m}月{d}日") }}
              星期{{ courseInfo.day | parseTime("{a}")
              }}<span>{{ courseInfo.startTime }}-{{ courseInfo.endTime }}</span>
            </h3>
            <div>
              <span>{{ courseInfo.title }}</span>

              <div>
                教学大纲：
                <div>
                  <span
                    v-for="(item, i) in courseInfo.catalogName.split('；')"
                    :key="i"
                    >{{ item }}<br
                  /></span>
                </div>
              </div>
            </div>
          </div>

          <div class="teacher">
            <span v-if="!$route.query.from">{{
              !courseInfo.teacherSignStatus || courseInfo.teacherSignStatus == 3
                ? "未签到"
                : courseInfo.teacherSignStatus == 1
                ? "已签到"
                : "迟到"
            }}</span
            >教师：{{ courseInfo.teacherName }}
          </div>
        </div>

        <div class="btn" v-if="!$route.query.from">
          <el-divider direction="vertical" />
          <span @click="editTimeTable">修&nbsp;&nbsp;改</span>
          <span @click="deleteCourse">删&nbsp;&nbsp;除</span>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      lock-scroll
      custom-class="add_time_table"
      @open="open"
    >
      <el-form
        ref="add_time_table"
        :rules="rules"
        :model="query"
        label-position="left"
        label-width="130px"
        style="width: 100%; padding-left: 20px;"
      >
        <el-form-item label="关联教学大纲">
          <el-input :value="courseInfo.professionName" disabled />
          <el-select
            v-model="query.subjectId"
            class="subject"
            popper-class="select_timeTable"
            placeholder="请选择科目"
            @change="subjectChange"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.subjectName"
              :value="item.id"
            />
          </el-select>
          <el-cascader
            :key="isResouceShow"
            v-model="query.catalogId"
            :props="{
              multiple: true,
              value: 'id',
              label: 'catalogName',
              expandTrigger: true,
            }"
            :options="options"
            collapse-tags
            popper-class="select_timeTable"
            @change="cascaderChange"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.catalogName }}</span>
              <!-- <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span> -->
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="title"
          :rules="{
            required: true,
            message: '课程名称必填',
            trigger: 'change',
          }"
        >
          <el-input
            v-model="query.title"
            placeholder="请输入课程名称（2-20字）"
          />
        </el-form-item>
        <el-form-item
          label="教  师"
          class="letter_space"
          prop="teacherId"
          :rules="{
            required: true,
            message: '请选择教师',
            trigger: 'change',
          }"
        >
          <el-select
            v-model="teacher"
            placeholder="请选择教师"
            filterable
            :loading="teacherLoading"
            popper-class="select_timeTable"
            value-key="teacherName"
            @visible-change="teacherVisibleChange"
            @change="teacherChange"
          >
            <el-option
              v-for="(item, i) in teacherList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="{ teacherId: item.id, teacherName: item.teacherName }"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="custom_submit_button"
          @click="onSubmit"
        >
          确&nbsp;&nbsp;定
        </el-button>
      </div>
    </el-dialog>
    <div class="tab">
      <ul class="nav" v-if="!$route.query.from">
        <li
          v-for="(item, index) in tab"
          :key="index"
          :class="{ active: index === tabIndex }"
          @click="tab_handler_click(index)"
          v-html="item"
        />
      </ul>
      <transition-group tag="div" name="fade">
        <div v-if="tabIndex == 0" :key="0" class="sign_in">
          <h3>
            <span>应到：{{ signStatistics.supposedTotal || 0 }} </span>
            <span>已签：{{ signStatistics.signTotal || 0 }} </span>
            <span>未签：{{ signStatistics.absentTotal || 0 }} </span>
            <span>迟到：{{ signStatistics.lateTotal || 0 }}</span>
          </h3>
          <el-row v-if="signList.length">
            <el-col
              v-for="item in signList"
              :key="item.id"
              :span="8"
              @click.native="linkToStudentDetail(item)"
            >
              <div
                class="grid-content bg-purple"
                :class="item.signStatus == 2 && 'later'"
              >
                <el-avatar :src="item.photo" />
                {{ item.name }}
                <span v-if="item.signTime" class="time">
                  {{ item.signTime | parseTime("{h}:{i}") }}（{{
                    item.signStatus == 2
                      ? "迟到"
                      : item.signStatus == 1 && "正常"
                  }}）
                </span>

                <span
                  :class="(!item.signStatus || item.signStatus == 3) && 'later'"
                  >{{
                    !item.signStatus || item.signStatus == 3
                      ? "未签到"
                      : "已签到"
                  }}</span
                >
              </div>
            </el-col>
          </el-row>
          <no-data v-else></no-data>
        </div>
        <!-- 预习 -->
        <div v-else-if="tabIndex == 1" :key="1" class="preview">
          <div v-if="preViewInfo.contentInfo">
            <div class="base common">
              <h3>基本信息</h3>
              <div class="content">
                <span>{{ preViewInfo.contentInfo.content }}</span>
                <div v-if="preViewInfo.contentInfo.audio" class="voice">
                  <img
                    :src="preViewInfo.contentInfo.teacherMsg.teacherPhotoStr"
                    style="border-radius: 50%;"
                  />
                  <span @click="preViewAudioPlay">
                    <audio
                      ref="voice"
                      :src="preViewInfo.contentInfo.audio.url"
                    />
                    <svg-icon v-if="!preViewAudio" icon-class="yuyin" />
                    <i v-else><img src="../../../assets/images/audio.gif" /></i>
                    {{
                      preViewInfo.contentInfo.audio.duration | durationTrans()
                    }}
                  </span>
                </div>
                <div v-if="preViewInfo.contentInfo" class="image__preview">
                  <el-image
                    v-for="(item, i) in preViewInfo.contentInfo.imageList"
                    :key="i"
                    fit="contain"
                    style="width: 192px; height: 144px;"
                    :src="item.url"
                    lazy
                    :preview-src-list="
                      preview_img_list(preViewInfo.contentInfo.imageList)
                    "
                  />
                </div>
              </div>
            </div>
            <div class="data common">
              <h3>预习资料</h3>
              <!-- 视频 -->
              <div v-if="preViewResourceList[1]" class="video commonStyle">
                <div
                  v-for="item in preViewResourceList[1]"
                  :key="item.savePathId"
                  class="item"
                  @click="lookVideo(item)"
                >
                  <el-image
                    style="width: 192px; height: 144px;"
                    :src="item.sourceIcon"
                    fit="contain"
                  />
                  <span>
                    {{ item.duration | durationTrans() }}
                  </span>
                  <i><svg-icon icon-class="videoPlay" /></i>
                </div>
              </div>
              <!-- 音频 -->
              <div v-if="preViewResourceList[2]" class="audio commonStyle">
                <div
                  v-for="(item, i) in preViewResourceList[2]"
                  :key="item.savePathId"
                  class="item"
                  @click="audio_play(item)"
                >
                  <!-- TODO -->
                  <div class="audio">
                    <el-image
                      style="width: 192px; height: 144px;"
                      :src="item.sourceIcon"
                      fit="contain"
                    />
                    <span>
                      {{ item.duration | durationTrans() }}
                    </span>
                  </div>
                  <i><svg-icon icon-class="audioPlay" /></i>
                </div>
              </div>
              <!-- 图片 -->
              <div v-if="preViewResourceList[3]" class="image__preview">
                <div
                  class="commonStyle"
                  style="border-bottom: 2px solid #f0f0f0;"
                >
                  <el-image
                    v-for="item in preViewResourceList[3]"
                    :key="item.savePathId"
                    style="width: 192px; height: 144px;"
                    :src="item.savePathUrl"
                    lazy
                    fit="contain"
                    :preview-src-list="preview_img_list(preViewResourceList[3])"
                  />
                </div>
              </div>
              <!-- 文件 -->
              <div class="commonStyle">
                <ul v-if="preViewResourceList[4]">
                  <li
                    v-for="item in preViewResourceList[4]"
                    :key="item.savePathIds"
                    @click="openPdf(item)"
                  >
                    <el-image
                      style="width: 70px; height: 70px;"
                      :src="item.sourceIcon"
                      fit="contain"
                    />
                    <div>
                      <span class="name">{{ item.resourceName }}</span>
                      <span class="size">{{
                        (item.pdfPageSize / 1024).toFixed(2) + "K"
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="titles common">
              <h3>题目</h3>
              <ul v-if="preViewInfo.contentInfo.questionList.length">
                <li
                  v-for="(item, index) in preViewInfo.contentInfo.questionList"
                  :key="item.id"
                >
                  <div class="name">{{ index + 1 }}、{{ item.stem }}（ ）</div>
                  <div v-if="item.type == 1" class="content">
                    <ul>
                      <li
                        v-for="(option, index) in item.optionList"
                        :key="index"
                      >
                        {{ String.fromCharCode(65 + index) }}.{{ option.item }}
                      </li>
                    </ul>
                  </div>
                  <div v-else class="content content-judge">
                    <ul>
                      <li>
                        <el-radio-group>
                          <el-radio label="1">正确</el-radio>
                          <el-radio label="2">错误</el-radio>
                        </el-radio-group>
                      </li>
                    </ul>
                  </div>
                  <div class="look">
                    <span @click="lookAnalysis(item.analysis)">查看解析</span>
                  </div>
                </li>
              </ul>
              <no-data v-else />
            </div>
            <div class="student-information common" v-if="!$route.query.from">
              <h3>学生信息</h3>
              <el-row class="main" v-if="preViewInfo.studentList.length">
                <el-col
                  v-for="item in preViewInfo.studentList"
                  :key="item.id"
                  :span="8"
                  @click.native="linkToDetail(item)"
                >
                  <div class="grid-content bg-purple-dark">
                    <el-avatar :src="item.photo" />
                    {{ item.name }}
                    <el-rate
                      :value="item.score / 20"
                      disabled
                      show-score
                      text-color="#ff9900"
                      :score-template="score(item)"
                    />
                  </div>
                </el-col>
              </el-row>
              <no-data v-else></no-data>
            </div>
          </div>
          <no-data v-else />
        </div>
        <!-- 课中 -->
        <div v-else-if="tabIndex == 2" :key="2" class="preview">
          <div
            v-if="
              lessonInfo &&
              (lessonInfo.questionList.length || lessonInfo.resourceList.length)
            "
          >
            <div class="data common">
              <h3>课中资料</h3>
              <!-- 视频 -->
              <div v-if="Object.keys(lessonResourceList).length">
                <div v-if="lessonResourceList[1]" class="video commonStyle">
                  <div
                    v-for="item in lessonResourceList[1]"
                    :key="item.savePathId"
                    class="item"
                    @click="lookVideo(item)"
                  >
                    <el-image
                      style="width: 192px; height: 144px;"
                      :src="item.sourceIcon"
                      fit="contain"
                    />
                    <span>
                      {{ item.duration | durationTrans() }}
                    </span>
                    <i><svg-icon icon-class="videoPlay" /></i>
                  </div>
                </div>
                <!-- 音频 -->
                <div v-if="lessonResourceList[2]" class="audio commonStyle">
                  <div
                    v-for="(item, i) in lessonResourceList[2]"
                    :key="item.savePathId"
                    class="item"
                    @click="audio_play(item)"
                  >
                    <!-- TODO -->
                    <div class="audio">
                      <el-image
                        style="width: 192px; height: 144px;"
                        :src="item.sourceIcon"
                        fit="contain"
                      />
                      <span>
                        {{ item.duration | durationTrans() }}
                      </span>
                    </div>
                    <i><svg-icon icon-class="audioPlay" /></i>
                  </div>
                </div>
                <!-- 图片 -->
                <div v-if="lessonResourceList[3]" class="image__preview">
                  <div
                    class="commonStyle"
                    style="border-bottom: 2px solid #f0f0f0;"
                  >
                    <el-image
                      v-for="item in lessonResourceList[3]"
                      :key="item.savePathId"
                      style="width: 192px; height: 144px;"
                      :src="item.savePathUrl"
                      lazy
                      fit="contain"
                      :preview-src-list="
                        preview_img_list(lessonResourceList[3])
                      "
                    />
                  </div>
                </div>
                <!-- 文件 -->
                <div v-if="lessonResourceList[4]" class="commonStyle">
                  <ul>
                    <li
                      v-for="item in lessonResourceList[4]"
                      :key="item.savePathIds"
                      @click="openPdf(item)"
                    >
                      <el-image
                        style="width: 70px; height: 70px;"
                        :src="item.sourceIcon"
                        fit="contain"
                      />
                      <div>
                        <span class="name">{{ item.resourceName }}</span>
                        <span class="size">{{
                          (item.pdfPageSize / 1024).toFixed(2) + "K"
                        }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <no-data v-else></no-data>
            </div>
            <div class="titles common">
              <h3>题目</h3>
              <ul v-if="lessonInfo.questionList.length">
                <li
                  v-for="(item, index) in lessonInfo.questionList"
                  :key="item.id"
                >
                  <div class="name">{{ index + 1 }}、{{ item.stem }}（ ）</div>
                  <div v-if="item.type == 1" class="content">
                    <ul>
                      <li
                        v-for="(option, index) in item.optionList"
                        :key="index"
                      >
                        {{ String.fromCharCode(65 + index) }}.{{ option.item }}
                      </li>
                    </ul>
                  </div>
                  <div v-else class="content content-judge">
                    <ul>
                      <li>
                        <el-radio-group>
                          <el-radio label="1">正确</el-radio>
                          <el-radio label="2">错误</el-radio>
                        </el-radio-group>
                      </li>
                    </ul>
                  </div>
                  <div class="look">
                    <!-- <span class="rightAnswer"
                      >正确答案：
                      {{
                        item.type == 1
                          ? item.answer == 0
                            ? "A"
                            : item.answer == 1
                            ? "B"
                            : item.answer == 2
                            ? "C"
                            : item.answer == 3
                            ? "D"
                            : item.answer == 4
                            ? "E"
                            : "F"
                          : item.answer == 1
                          ? "错误"
                          : "正确"
                      }}</span
                    > -->
                    <span class="analysis" @click="lookAnalysis(item.analysis)"
                      >查看解析</span
                    >
                  </div>
                </li>
              </ul>
              <no-data v-else />
            </div>
          </div>
          <no-data v-else />
        </div>
        <!-- 作业 -->
        <div v-else-if="tabIndex == 3" :key="3" class="preview homework">
          <div v-if="homeWorkInfo.contentInfo">
            <div class="base common">
              <h3>基本信息</h3>
              <div class="content">
                <span>{{ homeWorkInfo.contentInfo.content }}</span>
                <div v-if="homeWorkInfo.contentInfo.audio" class="voice">
                  <img
                    :src="homeWorkInfo.contentInfo.teacherMsg.teacherPhotoStr"
                    style="border-radius: 50%;"
                  />
                  <span @click="homeworkAudioPlay">
                    <audio
                      ref="homeWorkVoice"
                      :src="homeWorkInfo.contentInfo.audio.url"
                    />
                    <svg-icon v-if="!homeWorkAudio" icon-class="yuyin" />
                    <i v-else><img src="../../../assets/images/audio.gif" /></i>
                    {{
                      homeWorkInfo.contentInfo.audio.duration | durationTrans()
                    }}
                  </span>
                </div>
                <div v-if="homeWorkInfo.contentInfo" class="image__preview">
                  <el-image
                    v-for="(item, i) in homeWorkInfo.contentInfo.imageList"
                    :key="i"
                    fit="contain"
                    style="width: 192px; height: 144px;"
                    :src="item.url"
                    lazy
                    :preview-src-list="
                      preview_img_list(homeWorkInfo.contentInfo.imageList)
                    "
                  />
                </div>
              </div>
            </div>
            <div class="data common">
              <h3>作业资料</h3>
              <!-- 视频 -->
              <div v-if="homeworkResourceList[1]" class="video commonStyle">
                <div
                  v-for="item in homeworkResourceList[1]"
                  :key="item.savePathId"
                  class="item"
                  @click="lookVideo(item)"
                >
                  <el-image
                    style="width: 192px; height: 144px;"
                    :src="item.sourceIcon"
                    fit="contain"
                  />
                  <span>
                    {{ item.duration | durationTrans() }}
                  </span>
                  <i><svg-icon icon-class="videoPlay" /></i>
                </div>
              </div>
              <!-- 音频 -->
              <div v-if="homeworkResourceList[2]" class="audio commonStyle">
                <div
                  v-for="(item, i) in homeworkResourceList[2]"
                  :key="item.savePathId"
                  class="item"
                  @click="audio_play(item)"
                >
                  <!-- TODO -->
                  <div class="audio">
                    <el-image
                      style="width: 192px; height: 144px;"
                      :src="item.sourceIcon"
                      fit="contain"
                    />
                    <!-- <img :src="item.sourceIcon" alt="" /> -->
                    <span>
                      {{ item.duration | durationTrans() }}
                    </span>
                  </div>
                  <i><svg-icon icon-class="audioPlay" /></i>
                </div>
              </div>
              <!-- 图片 -->
              <div v-if="homeworkResourceList[3]" class="image__preview">
                <div
                  class="commonStyle"
                  style="border-bottom: 2px solid #f0f0f0;"
                >
                  <el-image
                    v-for="item in homeworkResourceList[3]"
                    :key="item.savePathId"
                    style="width: 192px; height: 144px;"
                    :src="item.savePathUrl"
                    fit="contain"
                    lazy
                    :preview-src-list="
                      preview_img_list(homeworkResourceList[3])
                    "
                  />
                </div>
              </div>
              <!-- 文件 -->
              <div class="commonStyle">
                <ul v-if="homeworkResourceList[4]">
                  <li
                    v-for="item in homeworkResourceList[4]"
                    :key="item.savePathIds"
                    @click="openPdf(item)"
                  >
                    <el-image
                      style="width: 70px; height: 70px;"
                      :src="item.sourceIcon"
                      fit="contain"
                    />
                    <!-- <img :src="item.sourceIcon" /> -->
                    <div>
                      <span class="name">{{ item.resourceName }}</span>
                      <span class="size">{{
                        (item.pdfPageSize / 1024).toFixed(2) + "K"
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-if="homeWorkInfo.contentInfo.questionList"
              class="titles common"
            >
              <h3>题目</h3>
              <ul v-if="homeWorkInfo.contentInfo.questionList.length">
                <li
                  v-for="(item, index) in homeWorkInfo.contentInfo.questionList"
                  :key="item.id"
                >
                  <div class="name">{{ index + 1 }}、{{ item.stem }}（ ）</div>
                  <div v-if="item.type == 1" class="content">
                    <ul>
                      <li
                        v-for="(option, index) in item.optionList"
                        :key="index"
                      >
                        {{ String.fromCharCode(65 + index) }}.{{ option.item }}
                      </li>
                    </ul>
                  </div>
                  <div v-else class="content content-judge">
                    <ul>
                      <li>
                        <el-radio-group>
                          <el-radio label="1">正确</el-radio>
                          <el-radio label="2">错误</el-radio>
                        </el-radio-group>
                      </li>
                    </ul>
                  </div>
                  <div class="look">
                    <span @click="lookAnalysis(item.analysis)">查看解析</span>
                  </div>
                </li>
              </ul>
              <no-data v-else />
            </div>
            <div class="student-information common" v-if="!$route.query.from">
              <h3>学生信息</h3>
              <el-row class="main" v-if="homeWorkInfo.studentList.length">
                <el-col
                  v-for="item in homeWorkInfo.studentList"
                  :key="item.id"
                  :span="8"
                  @click.native="linkToHomeWrokDetail(item)"
                >
                  <div class="grid-content bg-purple-dark">
                    <el-avatar :src="item.photo" />
                    {{ item.name }}
                    <el-rate
                      :value="item.score / 20"
                      disabled
                      show-score
                      text-color="#ff9900"
                      :score-template="score(item)"
                    />
                  </div>
                </el-col>
              </el-row>
              <no-data v-else></no-data>
            </div>
          </div>
          <no-data v-else />
        </div>
        <!-- 课中评价  -->
        <div v-else-if="tabIndex == 4" :key="4" class="evaluation">
          <el-table :data="teacherScoreList" style="width: 100%;">
            <el-table-column prop="" label="姓名" width="150" align="center">
              <template slot-scope="{ row }">
                <el-avatar :src="row.photo" />
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="分值" width="280" align="center">
              <template slot-scope="{ row }">
                <el-rate
                  :value="row.score / 20"
                  disabled
                  show-score
                  text-color="#ff9900"
                  :score-template="score(row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="" label="评价" align="center">
              <template slot-scope="{ row }">
                {{ row.evaluationDes }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 教师考核 -->
        <div v-else-if="tabIndex == 5" :key="5" class="assess">
          <div class="main-info">
            <div class="header">
              <el-avatar :src="teacherScore.teacherScore.photo" />
              {{ teacherScore.teacherScore.name }}
              <el-rate
                :value="teacherScore.teacherScore.score / 20"
                disabled
                show-score
                text-color="#ff9900"
                :score-template="score(teacherScore.teacherScore)"
              />
            </div>
            <div class="record-list">
              <ul v-if="teacherScore.evaluationItemScore.length">
                <li
                  v-for="item in teacherScore.evaluationItemScore"
                  :key="item.id"
                >
                  <h4>
                    {{ item.name }}
                    <el-rate
                      :value="item.score / 20"
                      disabled
                      show-score
                      text-color="#ff9900"
                      :score-template="score(item)"
                    />
                  </h4>
                  <ul>
                    <li v-for="smallItem in item.children" :key="smallItem.id">
                      {{ smallItem.name }}
                      <div>
                        <el-rate
                          :value="smallItem.score / 20"
                          disabled
                          show-score
                          text-color="#ff9900"
                          :score-template="score(smallItem)"
                        />
                        {{ smallItem.evaluationStudentNumber }}人评价
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <no-data v-else />
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <el-dialog
      title="答案解析"
      :visible.sync="dialogAnalysisVisible"
      custom-class="lookAnalysis"
    >
      <el-input v-model="analysis" type="textarea" disabled />
    </el-dialog>
    <video-dialog-vue
      :visible="dialogVideoVisible"
      :sources="videoSources"
      @close="videoClose"
    />

    <audio-dialog-vue
      :visible="dialogAudioVisible"
      :sources="music"
      @close="audioClose"
    />
    <el-dialog
      :visible.sync="dialogPdfVisible"
      :destroy-on-close="true"
      @close="pdfClonse"
    >
      <div class="content-box" style="height: 470px;" ref="pdf">
        <!-- <embed :src="dialogPdfUrl" style="width: 100%;height: 100%;" /> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // FIXME  没有subjectid的时候 报错
  import {
    fetchCourse_sign,
    fetchCourse_preview,
    fetchCourse_homeWork,
    fetchCourse_teachScore,
    fetchCourse_teacherCheck,
    fetchProfession_List,
    fetchSubject_List,
    fetchCatalog_List,
    fetchCourse_LessonMsg,
    updateCourse_timeTable,
    deleteCourse_timeTable,
    checkCourseExitWork,
  } from "@/api/classes";
  import { fetchTeacher_ListByStatus } from "@/api/teacher";

  import videoDialogVue from "../components/videoDialog.vue";
  import audioDialogVue from "../components/audioDialog.vue";

  export default {
    name: "TimeTableDetails",
    components: {
      audioDialogVue,
      videoDialogVue,
    },
    data() {
      return {
        isResouceShow: "",
        analysis: "",
        preViewAudio: false,
        homeWorkAudio: false,
        dialogAnalysisVisible: false,
        dialogAudioVisible: false,
        dialogVisible: false,
        dialogPdfVisible: false,
        dialogVideoVisible: false,
        dialogPdfUrl: "", //pdf url
        teacherLoading: true, // 班主任loading
        teacherList: [], // 班主任列表
        resourceList: [], // 班主任列表
        subjectList: [], // 章节目录
        options: [],
        teacher: {},
        music: {},
        query: {
          subjectId: "",
          courseId: "", // 课程表的课程id
          title: "", // 课程名称
          teacherId: "", // 老师的id数据
          teacherName: "",
          catalogId: "", // 绑定的大纲(目录的Id)
        },
        copyQuery: {},
        form: {
          name: "",
        },
        videoSources: {},
        rules: {},

        tab: [
          "签&nbsp;&nbsp;到",
          "预&nbsp;&nbsp;习",
          "课&nbsp;&nbsp;中",
          "作&nbsp;&nbsp;业",
          "课中评价",
          "教师考核",
        ],
        courseInfo: "", // 课程内容
        signStatistics: "",
        signList: "", // 签到
        preViewInfo: "", // 预习内容
        preViewResourceList: "", // 预习资源列表
        homeWorkInfo: "", // 作业内容
        homeworkResourceList: "", // 作业资源列表
        lessonInfo: "", //课中内容
        lessonResourceList: "", //课中资源列表
        teacherScoreList: "", // 课中评价
        teacherCheck: "",
        tabIndex: 0, // tab active index
      };
    },
    computed: {
      score() {
        return (item) => {
          return String(item.score);
        };
      },
      preview_img_list() {
        return (val) => {
          return _.map(val, (o) => {
            return o.url || o.savePathUrl;
          });
        };
      },
    },
    created() {
      const { from } = this.$route.query;
      if (from == "learnPreview") {
        this.tabIndex = 1;
      } else if (from == "learnHomeWork") {
        this.tabIndex = 3;
      }
      this.getCourse()
        .then(() => {
          fetchSubject_List({ professionId: this.courseInfo.professionId }).then(
            (res) => {
              if (res) {
                this.subjectList = res.data.data.list;
                // console.log(this.subJectList);
              }
            }
          );
        })
        .then(() => {});
      fetchTeacher_ListByStatus().then((res) => {
        this.teacherList = res.data.data;
      });
      this.getPreview();
      this.getHomeWork();
      this.getTeachScore();
      this.getTeacherCheck();
      const { courseId } = this.$route.params;
      //检查课中信息是否存在
      checkCourseExitWork({ id: courseId }).then((res) => {
        if (res.data.data.lessonExistFlag) {
          this.getLesson();
        }
      });
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    methods: {
      tab_handler_click(index) {
        this.$refs.voice && this.$refs.voice.pause();
        this.$refs.homeWorkVoice && this.$refs.homeWorkVoice.pause();
        this.preViewAudio = false;
        this.homeWorkAudio = false;
        this.tabIndex = index;
        switch (index) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
        }
      },
      openPdf(item) {
        // console.log(item);
        this.dialogPdfUrl = item.pdfUrl;
        this.dialogPdfVisible = true;
        this.$nextTick().then(() => {
          //  console.log(this.$refs.pdf);
          let txt = document.createElement("embed"); //创建文本节点
          txt.setAttribute("src", item.pdfUrl);
          txt.setAttribute("style", "width: 100%;height: 100%;");
          //把创建的文本节点追加到元素节点中
          this.$refs.pdf.appendChild(txt);
        });
      },
      pdfClonse() {
        //this.dialogPdfUrl = "";
      },
      preViewAudioPlay() {
        let time = null;
        if (!this.preViewAudio) {
          this.$refs.voice.play();
          this.preViewAudio = true;
          this.$refs.voice.addEventListener(
            "ended",
            () => {
              this.preViewAudio = false;
              time = null;
            },
            false
          );
        } else {
          this.preViewAudio = false;
          this.$refs.voice.pause();
          time = null;
        }
      },
      homeworkAudioPlay() {
        let time = null;
        if (!this.homeWorkAudio) {
          this.$refs.homeWorkVoice.play();
          this.homeWorkAudio = true;
          this.$refs.homeWorkVoice.addEventListener(
            "ended",
            () => {
              this.homeWorkAudio = false;
              time = null;
            },
            false
          );
        } else {
          this.homeWorkAudio = false;
          this.$refs.homeWorkVoice.pause();
          time = null;
        }
      },
      audio_play(val) {
        this.$refs.voice && this.$refs.voice.pause();
        this.$refs.homeWorkVoice && this.$refs.homeWorkVoice.pause();
        this.preViewAudio = false;
        this.homeWorkAudio = false;
        const {
          originName: title,
          savePathUrl: src,
          sourceIcon: pic,
          resourceName: name,
        } = val;
        this.music = {
          title,
          artist: "",
          src,
          pic,
          name,
          // lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
        };
        this.dialogAudioVisible = true;
        // this.$nextTick(() => {
        //   this.$refs.audio.play();
        // });
        // console.log(this.$refs.audio);
      },
      lookVideo(val) {
        //console.log(val);
        this.$refs.voice && this.$refs.voice.pause();
        this.$refs.homeWorkVoice && this.$refs.homeWorkVoice.pause();
        this.preViewAudio = false;
        this.homeWorkAudio = false;
        // this.analysis = val;
        const { savePathUrl: src, resourceName: title } = val;
        this.videoSources = {
          src,
          title,
        };

        this.dialogVideoVisible = true;
      },
      videoClose() {
        // console.log(this.$refs.videoPlayer);
        this.dialogVideoVisible = false;
        // this.$nextTick().then(() => {
        //   this.$refs.videoPlayer.player.pause();
        // });
      },
      audioClose() {
        this.dialogAudioVisible = false;
        // console.log(this.$refs.audio);
        // this.$refs.audio.pause();
        //
        // this.dialogVideoVisible = false;
      },
      linkToHomeWrokDetail({ id }) {
        this.$router.push({
          name: "HomeworkDetails",
          params: { studentId: id },
        });
      },
      linkToStudentDetail({ id }) {
        this.$router.push({
          name: "StudentDetails",
          params: { studentId: id },
        });
      },
      async subjectChange(val) {
        await fetchCatalog_List({
          professionId: this.courseInfo.professionId,
          subjectId: val,
          nullType: 1,
        }).then((res) => {
          ++this.isResouceShow;
          this.options = res.data.data.list;
        });
      },
      onSubmit() {
        console.log(this.query);
        this.$refs["add_time_table"].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            console.log(this.query);
            const val = _.map(this.query.catalogId, (o) => {
              return o[o.length - 1];
            });
            // console.log(val);
            // this.query.catalogId = val;
            updateCourse_timeTable({
              ...this.query,
              catalogId: val,
              ...this.teacher,
            }).then((res) => {
              this.btnLoading = false;
              if (res) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  // center: true,
                  duration: 2 * 1000,
                });
                this.dialogVisible = false;

                this.$nextTick(() => {
                  this.$refs["add_time_table"].clearValidate();
                });
                // console.log(this.rankValue);
                this.getCourse();
              }
            });
          } else {
            return false;
          }
        });
      },
      editTimeTable() {
        this.dialogVisible = true;
      },
      open() {
        this.getCourse();

        this.$nextTick(() => {
          this.$refs["add_time_table"].clearValidate();
        });
      },
      close() {
        this.query = {
          subjectId: "",
          courseId: "", // 课程表的课程id
          title: "", // 课程名称
          teacherId: "", // 老师的id数据
          catalogId: "", // 绑定的大纲(目录的Id)
        };
        this.$nextTick(() => {
          this.$refs["add_time_table"].clearValidate();
        });
      },
      deleteCourse() {
        const { courseId: id, classesId } = this.$route.params;
        this.$confirm("此操作将永久删除此条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteCourse_timeTable({ id }).then((res) => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.$router.push({ name: "TimeTable" });
              }
            });
          })
          .catch(() => {});
      },
      cascaderChange(value) {
        // console.log(this.query);
        // this.query.catalogId = value[2];
      },
      teacherVisibleChange(visible) {
        visible &&
          this.teacherLoading &&
          fetchTeacher_ListByStatus({ deleteFlag: 0 })
            .then((res) => {
              this.teacherList = res.data.data;
            })
            .then(() => {
              this.teacherLoading = false;
            });
      },
      teacherChange(value) {
        console.log(this.teacher);
        // this.temp.teacherInChargeId = value;
      },
      linkToDetail({ id }) {
        this.$router.push({ name: "PreviewDetails", params: { studentId: id } });
      },
      lookAnalysis(val) {
        this.analysis = val;
        this.dialogAnalysisVisible = true;
      },
      async getCourse() {
        const { courseId: id, classesId } = this.$route.params;
        await fetchCourse_sign({ id }).then((res) => {
          if (res) {
            console.log(res);
            const {
              courseInfo,
              signStatistics,
              signList,
              classesInfo: { professionName, professionId },
              courseInfo: {
                subjectId,
                catalogIds,
                catalogFullPath,
                title,
                id,
                teacherId,
                teacherName,
              },
            } = res.data.data;
            this.query = {
              subjectId,
              courseId: id, // 课程表的课程id
              title, // 课程名称
              teacherId, // 老师的id数据

              ...{
                catalogId: catalogFullPath,
              },
            };

            this.teacher = { teacherId, teacherName };
            this.copyQuery = _.cloneDeep(this.query);
            // console.log(this.copyQuery);
            this.courseInfo = { ...courseInfo, professionName, professionId };

            subjectId && this.subjectChange(subjectId).then(() => {});
            this.signStatistics = signStatistics;
            this.signList = signList;
          }
        });
      },
      async getPreview() {
        const { courseId: id, classesId } = this.$route.params;
        await fetchCourse_preview({ id }).then((res) => {
          if (res) {
            //console.log(res);
            const {
              contentInfo,
              contentInfo: { resourceList },
            } = res.data.data;
            this.preViewInfo = res.data.data;
            // this.preContentInfo = contentInfo;

            // this.preViewResourceList = _.mapKeys(
            //   _.groupBy(resourceList, "resourceType"),
            //   o => {
            //     return;
            //   }
            // );

            this.preViewResourceList = _.groupBy(resourceList, "resourceType");
            // console.log(this.preViewResourceList);
          }
        });
      },
      async getLesson() {
        const { courseId: id, classesId } = this.$route.params;
        fetchCourse_LessonMsg({ id }).then((res) => {
          if (res) {
            const {
              // courseInfo,
              // contentInfo,
              resourceList,
            } = res.data.data;

            this.lessonInfo = res.data.data;
            this.lessonResourceList = _.groupBy(resourceList, "resourceType");
            console.log(33, this.lessonResourceList);
          }
        });
      },
      async getHomeWork() {
        const { courseId: id, classesId } = this.$route.params;
        await fetchCourse_homeWork({ id }).then((res) => {
          if (res) {
            this.homeWorkInfo = res.data.data;
            const {
              contentInfo,
              contentInfo: { resourceList },
            } = res.data.data;
            this.homeworkResourceList = _.groupBy(resourceList, "resourceType");
          }
        });
      },
      async getTeachScore() {
        const { courseId: id, classesId } = this.$route.params;
        await fetchCourse_teachScore({ id }).then((res) => {
          if (res) {
            this.teacherScoreList = res.data.data.list;
          }
        });
      },
      async getTeacherCheck() {
        const { courseId: id, classesId } = this.$route.params;
        await fetchCourse_teacherCheck({ id }).then((res) => {
          if (res) {
            //console.log(333, res);
            this.teacherScore = res.data.data;
          }
        });
      },
    },
  };
</script>
<style>
  .select_timeTable {
    z-index: 10012 !important;
  }
</style>
<style lang="scss" scoped>
  .fade-enter-active {
    transition: opacity 0.5s;
  }
  .fade-leave-active {
    transition: opacity 0s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .base-information {
    width: 100%;
    margin-bottom: 38px;
    > h2 {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(80, 90, 100, 1);
      margin: 0;
      height: 25px;
      line-height: 25px;
      margin-bottom: 7px;
    }
    .information-title {
      min-height: 100px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 12px 0px rgba(202, 202, 202, 0.5);
      border-radius: 12px;
      //width: 700px;
      padding: 12px 16px;
      margin-bottom: 20px;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      > div {
        display: flex;
      }
      .time {
        display: flex;
        flex-direction: column;
        width: 530px;
        margin-right: 20px;
        > h3 {
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          line-height: 25px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          span {
            display: flex;
            // width: 80px;
            height: 20px;
            align-items: center;
            justify-content: center;
            margin-left: 66px;
          }
        }
        > div {
          display: flex;
          font-size: 14px;
          flex-direction: column;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(168, 176, 185, 1);
          line-height: 20px;
          > span {
            &:nth-child(2) {
              //margin: 0 65px;
            }
          }
          > div {
            display: flex;
          }
        }
      }
      .teacher {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(168, 176, 185, 1);
        line-height: 20px;
        display: flex;
        align-items: center;
        > span {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
          width: 50px;
          height: 20px;
          background: linear-gradient(
            127deg,
            rgba(255, 207, 120, 1) 0%,
            rgba(255, 144, 77, 1) 100%
          );
          border-radius: 10px;
          margin-right: 9px;
        }
      }
      .btn {
        align-items: center;
        .el-divider {
          height: 70px;
        }
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 28px;
          cursor: pointer;
          background: linear-gradient(
            130deg,
            rgba(90, 176, 255, 1) 0%,
            rgba(0, 132, 255, 1) 100%
          );
          box-shadow: 0px 4px 10px 0px rgba(94, 195, 255, 0.71);
          border-radius: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          transition: opacity 0.3s;

          &:nth-child(2) {
            margin-left: 83px;
          }
          &:last-child {
            background: rgba(250, 110, 110, 1);
            box-shadow: 0px 6px 10px 0px rgba(255, 163, 163, 0.5);
            margin-left: 34px;
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

  .tab {
    display: flex;
    flex-direction: column;
    > ul.nav {
      display: flex;
      padding: 0;
      margin-bottom: 12px;
      li {
        width: 140px;
        height: 36px;
        margin-right: 12px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(80, 90, 100, 1);
        border: 1px solid rgba(211, 211, 211, 1);
        transition: background 0.5s;
        &.active {
          background: rgba(42, 148, 255, 1);
          border: 1px solid rgba(42, 148, 255, 1);
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    > div {
      position: relative;
    }
    .sign_in {
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;
      padding: 15px 0;

      padding-bottom: 0;
      h3 {
        width: 100%;
        height: 36px;
        background: linear-gradient(
          135deg,
          rgba(90, 176, 255, 1) 0%,
          rgba(0, 132, 255, 1) 100%
        );
        padding: 0 49px;

        display: flex;
        align-items: center;
        position: relative;
        &::before {
          content: "";
          width: 15px;
          display: flex;
          height: 36px;
          position: absolute;
          background-image: url("../../../assets/images/blue.png");
          background-size: 15px 36px;
          right: -15px;
        }
        > span {
          font-size: 16px;
          margin-right: 49px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }

      >>> .el-row {
        padding: 0 24px;
        padding-top: 25px;
        .el-col {
          margin-bottom: 20px;
          height: 50px;
          .grid-content {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(75, 75, 75, 1);
            .el-avatar {
              margin-right: 9px;
            }
            &.bg-purple {
              height: 100%;
              cursor: pointer;
              &:hover {
                background: rgba(237, 237, 237, 1);
                border-radius: 6px;
                //opacity: 0.29;
                height: 50px;
              }
            }
            &.later {
              .time {
                color: rgba(255, 112, 112, 1);
              }
            }
            .time {
              min-width: 104px;
            }
            > span {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(168, 176, 185, 1);
              margin-left: 20px;
              &:last-child {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                width: 50px;
                height: 20px;
                background: linear-gradient(
                  135deg,
                  rgba(118, 189, 255, 1) 0%,
                  rgba(0, 102, 255, 1) 100%
                );
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 20px;
                margin-left: 13px;
                &.later {
                  background: linear-gradient(
                    127deg,
                    rgba(255, 112, 112, 1) 0%,
                    rgba(255, 52, 52, 1) 100%
                  );
                }
              }
            }
          }
        }
      }
    }
    .preview {
      .common {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        margin-bottom: 20px;

        padding: 0 20px;
        > h3 {
          height: 40px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
      }
      .base {
        .content {
          padding: 15px 0;
          padding-bottom: 0.1px;
          > span {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(80, 90, 100, 1);
            line-height: 22px;
            // margin-bottom: 20px;
          }
          .voice {
            margin-top: 20px;
            display: flex;
            align-items: center;
            > span:not(.el-avatar) {
              display: flex;
              align-items: center;
              width: 315px;
              height: 36px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              background: rgba(29, 170, 253, 1);
              border-radius: 35px;
              position: relative;
              cursor: pointer;
              // padding-left: 30px;
              i {
                margin-left: 12px;
                margin-right: 6px;
                // margin-top: 2px;
                display: flex;
                img {
                  height: 16px;
                }
              }
              &::before {
                content: "";
                width: 0;
                height: 0;
                border-width: 7px 14px 7px 0;
                border-style: solid;
                border-color: transparent #1daafd transparent transparent; /*透明 灰 透明 透明 */
                // margin: 40px auto;
                position: absolute;
                left: -7px;
              }
              .svg-icon {
                margin-left: 11px;
                margin-right: 6px;
              }
            }
            > img {
              height: 60px;
              width: 60px;
              margin-right: 15px;
            }
          }
          .image__preview {
            margin-top: 20px;
          }
          .el-image {
            width: 192px;
            height: 144px;
            background: #f7f7f7;
            border-radius: 8px;
            margin-right: 20px;
            margin-bottom: 20px;
          }
        }
      }
      .data {
        .commonStyle {
          padding-top: 20px;
          border-bottom: 2px solid #f0f0f0;
          display: flex;
          flex-wrap: wrap;
          &:last-child {
            padding-bottom: 0;
            border-bottom: none;
          }
          .item {
            position: relative;
            cursor: pointer;
            width: 192px;
            height: 144px;
            margin-bottom: 20px;
            margin-right: 20px;
            .aplayer {
              margin: 0;
              width: 100%;
              height: 100%;
              box-shadow: none;

              // >>> .aplayer-body {
              //   width: 100%;
              //   height: 100%;
              //   .aplayer-pic {
              //     width: 100%;
              //     height: 100%;
              //     .aplayer-button {
              //       opacity: 0;
              //     }
              //   }
              //   .aplayer-info {
              //     display: none;
              //   }
              // }
            }
          }
          &.video {
            .item {
              width: 192px;
              height: 144px;
              position: relative;
              overflow: hidden;
              border-radius: 8px;
              > span {
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(61, 61, 61, 1);
                opacity: 0.66;
                height: 20px;
                width: 100%;
                position: absolute;
                bottom: 0;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
            }
          }
          .audio {
            padding-bottom: 0;
            width: 192px;
            height: 144px;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            img {
              width: 100%;
              // height: 100%;
            }
            > span {
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(61, 61, 61, 1);
              opacity: 0.66;
              height: 20px;
              width: 100%;
              position: absolute;
              bottom: 0;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }
            >>> .item {
              .aplayer {
                .aplayer-body {
                  height: 144px;
                  .aplayer-pic {
                    width: 192px;
                    height: 144px;
                    border-radius: 8px;
                    .aplayer-play {
                      height: 70px;
                      width: 70px;
                      margin: 0 -35px -35px 0;
                      opacity: 1;
                      background: #fff;
                      > button {
                        // display: none;

                        position: static;
                        height: 70px;
                        width: 70px;
                        background: url("../../../assets/images/audio.png");
                        opacity: 1;
                        > svg {
                          display: none;
                        }
                      }
                    }
                  }
                  .aplayer-info {
                    height: 100%;
                    .aplayer-controller {
                      height: 50px;
                      display: flex;
                      align-items: flex-end;
                      padding-bottom: 10px;
                      .aplayer-bar-wrap {
                        .aplayer-bar {
                          height: 5px;
                          border-radius: 5px;
                          // overflow: hidden;
                          .aplayer-loaded {
                            height: 5px;
                            border-radius: 5px;
                          }
                          .aplayer-played {
                            height: 5px;
                            border-radius: 5px;
                            .aplayer-thumb {
                              margin-top: -4px;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                .aplayer-list {
                  height: auto !important;
                  > ol {
                    height: auto !important;
                    li {
                      height: 50px;
                      line-height: 50px;
                      .aplayer-list-cur {
                        top: 14px;
                      }
                      &.aplayer-list-light {
                      }
                    }
                  }
                }
              }
            }
          }
          i {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 70px;
            height: 70px;
            margin-left: -35px;
            margin-top: -35px;
            pointer-events: none;
          }
          .svg-icon {
            width: 100%;
            height: 100%;
          }
        }
        .el-image {
          width: 192px;
          height: 144px;
          background: #f7f7f7;
          border-radius: 8px;
          margin-right: 20px;
          margin-bottom: 20px;
        }
        ul {
          display: flex;
          flex-direction: column;
          //padding-bottom: 20px;
          li {
            display: flex;
            margin-bottom: 35px;
            cursor: pointer;
            &:last-child {
              margin-bottom: 0;
            }
            .svg-icon {
              width: 70px;
              height: 70px;
              margin-right: 20px;
            }
            img {
              width: 70px;
              height: 70px;
              margin-right: 20px;
              border-radius: 8px;
            }
            > div {
              display: flex;
              flex-direction: column;
              .name {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(75, 75, 75, 1);
                line-height: 20px;
                margin-bottom: 9px;
                margin-top: 11px;
              }
              .size {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(168, 176, 185, 1);
                line-height: 22px;
              }
            }
          }
        }
      }
      .titles {
        ul {
          display: flex;
          flex-direction: column;
          padding: 15px 0;
          padding-top: 0;
          li {
            display: flex;
            flex-direction: column;
            padding-bottom: 20px;
            border-bottom: #f0f0f0 solid 1px;
            &:last-child {
              border-bottom: 0;
            }
            .name {
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(75, 75, 75, 1);
              line-height: 30px;
              margin-bottom: 20px;
              margin-top: 25px;
            }
            .content {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(75, 75, 75, 1);
              line-height: 40px;
              // display: flex;
              padding-left: 10px;
              ul {
                li {
                  border-bottom: none;
                }
              }
              &.content-judge {
                ul {
                  li {
                    .el-radio-group {
                      display: flex;
                    }
                  }
                }
              }
            }
            .look {
              display: flex;
              justify-content: flex-end;
            }
            .look > span {
              width: 100px;
              height: 28px;
              background: linear-gradient(
                135deg,
                rgba(148, 241, 239, 1) 0%,
                rgba(0, 199, 247, 1) 100%
              );
              box-shadow: 0px 8px 10px 0px rgba(191, 248, 242, 0.71);
              border-radius: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              cursor: pointer;
              transition: background 0.3s;
              &:hover {
                background: linear-gradient(
                  135deg,
                  rgba(178, 246, 244, 1) 0%,
                  rgba(72, 218, 253, 1) 100%
                );
              }
              &:active {
                background: linear-gradient(
                  135deg,
                  rgba(105, 223, 220, 1) 0%,
                  rgba(0, 165, 204, 1) 100%
                );
              }
            }
          }
        }
      }
    }
    .student-information {
      > .main {
        display: flex;
        padding-top: 24px;
        flex-wrap: wrap;
        .el-col {
          margin-bottom: 20px;
          height: 50px;
          .bg-purple-dark {
            height: 100%;
            padding-left: 15px;
            &:hover {
              background: rgba(237, 237, 237, 1);
              border-radius: 6px;
              //opacity: 0.29;
              height: 50px;
            }
          }
        }
        .grid-content {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(75, 75, 75, 1);
          .el-avatar {
            margin-right: 9px;
          }
          .el-rate {
            margin-left: 9px;
            >>> .el-rate__item {
              .el-rate__icon {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
    .evaluation {
      >>> .el-table {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        overflow: visible;
        &::before {
          display: none;
        }
        .el-table__header-wrapper {
          margin-bottom: 10px;
          overflow: visible;
          table {
            padding-top: 12px;
            thead {
              position: relative;
              &::before {
                content: "";
                width: 15px;
                display: flex;
                height: 36px;
                position: absolute;
                background-image: url("../../../assets/images/blue.png");
                background-size: 15px 36px;
                right: -15px;
              }
            }
          }
          tr {
            background: transparent;
            background: linear-gradient(
              135deg,
              rgba(90, 176, 255, 1) 0%,
              rgba(0, 132, 255, 1) 100%
            );
            th {
              border-bottom: 0;
              background: transparent;
              padding: 0;
              .cell {
                height: 36px;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
            }
          }
        }
        .el-table__body-wrapper {
          .el-table__row {
            td {
              border-bottom: 0;
              padding: 15px 0;
              &:first-child {
                .cell {
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: rgba(75, 75, 75, 1);
                  display: flex;
                  align-items: center;
                  padding-left: 24px;
                  .el-avatar {
                    margin-right: 9px;
                  }
                }
              }
              &:last-child {
                padding-right: 24px;
                .cell {
                  font-size: 16px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(80, 90, 100, 1);
                  line-height: 27px;
                  display: flex;
                  justify-content: flex-start;
                  text-align: left;
                }
              }
            }
          }
          &:hover {
            tr > td {
              background: none;
            }
          }
        }
      }
    }
    .assess {
      .main-info {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        // padding: 0 16px;
        //  height: 240px;
        padding: 15px 0;
        display: flex;
        flex-direction: column;
        padding-bottom: 0;
        > .header {
          display: flex;
          align-items: center;
          height: 36px;
          padding: 0 25px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          background: linear-gradient(
            135deg,
            rgba(90, 176, 255, 1) 0%,
            rgba(0, 132, 255, 1) 100%
          );
          position: relative;
          &::before {
            content: "";
            width: 15px;
            display: flex;
            height: 36px;
            position: absolute;
            background-image: url("../../../assets/images/blue.png");
            background-size: 15px 36px;
            right: -15px;
            top: 0;
          }
          span {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            margin-right: 24px;
          }
          >>> .el-avatar {
            height: 50px;
            width: 50px;
            margin-right: 9px;
          }
        }
        .record-list {
          display: flex;
          // flex: 1;
          justify-content: space-between;
          // align-items: center;
          padding: 6px 25px 15px;
          //padding-top: 6px;
          flex-direction: column;
          > ul {
            > li {
              padding-top: 19px;
              padding-bottom: 10px;
              border-bottom: #e8e8e8 1px solid;
              &:last-child {
                border: 0;
              }
              > h4 {
                font-size: 18px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: rgba(80, 90, 100, 1);
                line-height: 25px;
                display: flex;
                align-items: center;
                margin-bottom: 14px;
                .el-rate {
                  margin-left: 16px;
                }
              }
              > ul {
                > li {
                  font-size: 16px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(168, 176, 185, 1);
                  line-height: 22px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 10px;

                  > div {
                    display: flex;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(42, 148, 255, 1);
                    line-height: 22px;
                    .el-rate {
                      margin-right: 35px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  >>> .el-dialog__wrapper {
    .add_time_table {
      //width: 1000px;

      .el-dialog__body {
        padding-bottom: 0;
        .el-form {
          .el-form-item {
            width: 100%;
            //margin-bottom: 40px;
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
            .el-form-item__content {
              display: flex;
              align-items: center;
              margin-left: 0 !important;
              height: 36px;
              display: flex;
              align-items: center;
              .el-input {
                width: 500px;
                .el-input__inner {
                  border-radius: 20px;
                }
                &.is-disabled {
                  width: 120px;
                  margin-right: 10px;
                }
              }

              .el-cascader {
                .el-input {
                  width: 240px;
                }
                .el-cascader__tags .el-tag > span {
                  flex: auto;
                }
              }

              .el-select.subject {
                width: 120px;
                margin-right: 10px;
                .el-input {
                  width: 100%;
                }
              }

              .el-form-item__error {
                // position: static;
                padding-top: 0;
                margin-left: 12px;
                top: 120%;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  >>> .el-dialog__wrapper {
    .lookAnalysis {
      width: 680px;
      height: 400px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(136, 136, 136, 0.5);
      border-radius: 14px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-textarea {
          width: 100%;
          .el-textarea__inner {
            height: 280px;
            outline: none;
            resize: none;
            color: #666;
          }
        }
      }
    }
  }
</style>
