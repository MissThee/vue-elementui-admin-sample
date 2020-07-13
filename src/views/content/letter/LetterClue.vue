<template>
  <div style="width:800px;margin:0 auto; " class="card-style">
    <el-form :model="letClueForm" label-width="80px" size="mini" :disabled="!canEdit">
      <el-form-item label="线索编码" v-if="!isCreate">
        <el-input v-model="letClueForm.id" style="width: 100%" disabled/>
      </el-form-item>
      <el-form-item label="受理时间">
        <el-date-picker v-model="letClueForm.receptionTime" type="date" style="width: 100%;" value-format="yyyy-MM-dd"
                        placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="线索来源">
        <el-select v-model="letClueForm.dicSourceIdList" multiple placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in threadOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="被反映人">
        <div :class="{'trans-animation':enableAnimate}" style="position:relative"
             :style="{height:letClueForm.letDefendantList.length*180+'px'}">
          <transition-group :name="enableAnimate?'defendant-card-animate':''" @after-leave="enableAnimate=false"
                            mode="in-out">
            <el-form label-width="90px" class="card-style inner-card" :class="{'trans-animation':enableAnimate}"
                     :style="{top:index*180+'px'}" :model="item" size="mini"
                     v-for="(item, index) in letClueForm.letDefendantList"
                     v-bind:key="item.nodeId===undefined?item.id:item.nodeId"
                     :disabled="!canEdit">
              <el-form-item label="姓名">
                <el-input v-model="item.name" style="width: 70%"/>
                <el-button type="danger" size="small" plain class="custom-button-in-toolbar"
                           icon="el-icon-circle-plus-outline" style="float:right" @click="deleteDefendant(item, index)">
                  删除此被反映人
                </el-button>
              </el-form-item>
              <el-form-item label="单位与职务">
                <el-input v-model="item.companyName" style="width: 70%"/>
              </el-form-item>
              <el-form-item label="职级">
                <el-select v-model="item.jobRankId" placeholder="请选择" style="width: 70%">
                  <el-option v-for="item in rankOptions" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="干部类型">
                <el-select v-model="item.jobTypeIdList" multiple placeholder="请选择" style="width: 70%">
                  <el-option v-for="item in cadreOptions" :key="item.id" :label="item.name"
                             :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-form>
          </transition-group>
        </div>
        <el-button type="success" size="small" plain v-if="canEdit" class="custom-button-in-toolbar"
                   icon="el-icon-circle-plus-outline" @click="addGroup">添加被反映人
        </el-button>
      </el-form-item>
      <el-form-item label="主要问题">
        <el-input type="textarea" autosize :rows="2" v-model="letClueForm.content" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="违法行为">
        <el-select v-model="letClueForm.dicIllegalBehaviorIdList" multiple placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in unlawfulActOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="涉及领域">
        <el-select v-model="letClueForm.dicAreaInvolvedIdList" multiple placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in involvedFieldOptions" :key="item.id" :label="item.name"
                     :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="附件">
        <file-uploader ref="FileUploader"/>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button v-if="canEdit" type="primary" size="large" style="margin-left: -80px" icon="el-icon-circle-check"
                   @click="submitGroup">提交
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" append-to-body title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="图片预览">
    </el-dialog>
  </div>
</template>

<script>
  import Global from 'src/utils/global';
  import DataDictionaryApi from 'src/api/data-dictionary-api';
  import {getTokenOrRedirect} from 'src/utils/cookies';
  import LetterClueApi from 'src/api/letter-clue-api';
  import {showResMsg} from 'src/utils/operation-result-message';
  import FileIcon from 'src/assets/img/file-icon/file-icon';
  import axios from 'axios';
  import FileUploader from 'src/views/common/FileUploader';

  export default {
    name: 'letterClue',
    components: {FileUploader},
    data() {
      return {
        titleName: '增加',
        enableAnimate: false,
        dicSource: [],
        dicIllegal: [],
        dicArea: [],
        jobTypeName: [],
        isCreate: true,
        canEdit: true,
        letClueForm: {},
        letClueFormEmpty: {
          receptionTime: null,
          content: null,
          dicSourceIdList: [],
          letDefendantList: [
            // {
            //   name:null,
            //   companyName:null,
            //   postName:null,
            //   jobRankId:null,
            //   jobTypeIdList:null,
            // }
          ],
          dicIllegalBehaviorIdList: [],
          dicAreaInvolvedIdList: [],
          fileList: [
            // { file: null, name: null }
          ],
        },
        threadOptions: [],
        rankOptions: [],
        involvedFieldOptions: [],
        cadreOptions: [],
        unlawfulActOptions: [],
        fileListForShow: [],
        dialogVisible: false,
        dialogImageUrl: '',
      };
    },

    created() {
      this.initSelectorData();
      this.letClueForm = JSON.parse(JSON.stringify(this.letClueFormEmpty));
    },
    methods: {
      iniFormDataForEdit(formData) {
        if (formData !== undefined) {
          this.fileListForShow = JSON.parse(JSON.stringify(formData.letClueForm.fileList));
          this.letClueForm = formData.letClueForm;
          this.$refs.FileUploader.initFileList(formData.letClueForm.fileList, formData.canEdit);
          this.titleName = formData.canEdit ? '修改' : '查看';
          this.canEdit = formData.canEdit;
          this.isCreate = formData.isCreate;
        }
      },
      initSelectorData() {
        // 线索来源
        DataDictionaryApi.getDictionary({listUrl: '/dic/source/all', isDelete: false})
          .then(({data}) => {
            this.threadOptions = data.data.dicCommonList;
          });
        // 职级
        DataDictionaryApi.getDictionary({listUrl: '/dic/jobrank/all', isDelete: false})
          .then(({data}) => {
            this.rankOptions = data.data.dicCommonList;
          });
        // 干部类型
        DataDictionaryApi.getDictionary({listUrl: '/dic/jobtype/all', isDelete: false})
          .then(({data}) => {
            this.cadreOptions = data.data.dicCommonList;
          });
        // 涉及领域
        DataDictionaryApi.getDictionary({listUrl: '/dic/areainvolved/all', isDelete: false})
          .then(({data}) => {
            this.involvedFieldOptions = data.data.dicCommonList;
          });
        // 违法行为
        DataDictionaryApi.getDictionary({listUrl: '/dic/illegalbehavior/all', isDelete: false})
          .then(({data}) => {
            this.unlawfulActOptions = data.data.dicCommonList;
          });
      },
      deleteDefendant(item, index) {
        this.enableAnimate = true;
        if (index >= 0)
          this.letClueForm.letDefendantList.splice(index, 1);
      },
      addGroup() {
        this.enableAnimate = true;
        this.letClueForm.letDefendantList.push({
          nodeId: new Date().getTime(),
          name: '',
          companyName: '',
          jobRankId: '',
          jobTypeName: [],
        });
      },
      submitGroup() {
        this.letClueForm.fileList = this.$refs.FileUploader.getFileList();
        if (this.isCreate) {
          LetterClueApi.addLetClue(this.letClueForm)
            .then(({data}) => {
              showResMsg(data);
              this.$emit('finishAddOrUpdate', data.result);
              if (data.result) {
                this.clearDialogForm();
              }
            });
        } else {
          LetterClueApi.updateLetClue(this.letClueForm)
            .then(({data}) => {
              showResMsg(data);
              this.$emit('finishAddOrUpdate', data.result);
            });
        }
      },
      clearDialogForm() {
        this.letClueForm = JSON.parse(JSON.stringify(this.letClueFormEmpty));
        this.$refs.FileUploader.clearFileList();
      }
    },


  };
</script>

<style scoped>
  a {
    text-decoration: none;
    out-line: none;
    color: #ffffff;
  }

  /*自定义类似卡片的样式*/
  .card-style {
    border: 1px solid #dddddd;
    border-radius: 3px;
    box-shadow: #cccccc 1px 1px 2px;
    padding: 5px;
  }

  /deep/ .el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  /deep/ .el-upload-list__item {
    transition: none !important;
  }
</style>
<style scoped>
  .defendant-card-animate-leave-active {
    animation: animate2 0.4s;
  }

  .defendant-card-animate-enter-active {
    animation: animate2 0.4s reverse;
  }

  .trans-animation {
    transition: all 0.4s;
  }

  @keyframes animate1 {
    0% {
      opacity: 0;
      transform: translateY(-170px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @keyframes animate2 {
    0% {
      opacity: 1;
      transform: translateX(0px);
    }
    100% {
      opacity: 0;
      transform: translateX(100px);
    }
  }
</style>
