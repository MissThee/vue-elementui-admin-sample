<template>
  <div style="width:800px;margin:0 auto; " class="card-style">
    <el-form :model="letClueForm" label-width="80px" size="mini" :disabled="!canEdit">
      <el-form-item label="线索编码" v-if="!isCreate">
        <el-input v-model="letClueForm.id" style="width: 100%" disabled></el-input>
      </el-form-item>
      <el-form-item label="受理时间">
        <el-date-picker v-model="letClueForm.receptionTime" type="date" style="width: 100%;" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="线索来源">
        <el-select v-model="letClueForm.dicSourceIdList" multiple placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in threadOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="被反映人">
        <el-form label-width="90px" class="card-style" :model="item" size="mini" style="margin-top:5px;background-color: #fafafa; " v-for="(item, index) in letClueForm.letDefendantList" v-bind:key="index" :disabled="!canEdit">
          <el-form-item label="姓名">
            <el-input v-model="item.name" style="width: 70%"></el-input>
            <el-button type="danger" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" style="float:right" @click="deleteDefendant(item, index)">删除此反映人</el-button>
          </el-form-item>
          <el-form-item label="单位与职务">
            <el-input v-model="item.companyName" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="职级">
            <el-select v-model="item.jobRankId" placeholder="请选择" style="width: 70%">
              <el-option v-for="item in rankOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="干部类型">
            <el-select v-model="item.jobTypeIdList" multiple placeholder="请选择" style="width: 70%">
              <el-option v-for="item in cadreOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="success" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" @click="addGroup">添加被反映人</el-button>
      </el-form-item>
      <el-form-item label="主要问题">
        <el-input type="textarea" autosize :rows="2" v-model="letClueForm.content" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="违法行为">
        <el-select v-model="letClueForm.dicIllegalBehaviorIdList" multiple placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in unlawfulActOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="涉及领域">
        <el-select v-model="letClueForm.dicAreaInvolvedIdList" multiple placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in involvedFieldOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload
          :action="Global.URL+'/letClue/file'"
          :headers="headers"
          class="upload-demo"
          drag
          ref="fileUploader"
          multiple
          auto-upload
          :limit="20"
          list-type="picture-card"
          :on-exceed="exceedHandler"
          :on-success="onSuccessHandler"
          :file-list="fileListForShow"
        >
          <div slot="default" style="font-size: 15px;line-height: 15px">
            <i class="el-icon-upload"><span style="font-size: 15px;line-height: 15px">上传附件</span></i>
            <br>
            <span style="color: #409eff">拖拽至此<span style="color:gray">或</span>点击上传</span>
          </div>
          <div slot="file" style="position: relative;height: 100%;" slot-scope="{file}">
            <div style="height: 100%;" v-for="fileComponentInfo in [getFileComponentInfo(file)]">
              <div style="background-repeat: no-repeat;background-position: center;height: 100%" :style="{backgroundImage: ('url(\''+fileComponentInfo.icon+'\')'),backgroundSize:(fileComponentInfo.isShowPreview?'cover':'70%')}"></div>
              <!--<img :src="fileComponentInfo.icon" height="90%" :alt="file.name">-->
              <div style="position: absolute;top:0;left:0;height: 100%;width: 100%;">
                <div style="position: absolute;top:0;left:0;height: 100%;width: 100%;background-color: #666666;opacity: 0.65"></div>
                <div style="position: relative;color:#ffffff;font-weight: bold;margin-left: 5px">{{file.name}}</div>
              </div>
              <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" v-if="fileComponentInfo.isShowPreviewButton" @click="handlePictureCardPreview(file.url)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-download" @click="downloadFile(file.url,file.name)"></i>
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
            </div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="large" style="margin-left: -80px" icon="el-icon-circle-check" @click="submitGroup">提交</el-button>
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
  import { getToken } from 'src/utils/cookies';
  import LetterClueApi from 'src/api/letter-clue-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import FileIcon from 'src/assets/img/file-icon/file-icon';
  import axios from 'axios';

  export default {
    name: 'letterClue',
    data() {
      return {
        titleName: '增加',
        headers: {
          Authorization: getToken(),
        },
        Global,
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

    mounted() {
      this.initSelectorData();
      this.letClueForm = JSON.parse(JSON.stringify(this.letClueFormEmpty));
    },
    methods: {
      onSuccessHandler(response, file, fileList) {
        //成功上传后虽然视图已经变更，但组件绑定的file-list参数"fileListForShow"为单向绑定，组件不会将fileListForShow更新，需再次自己实现更新此参数
        this.fileListForShow = fileList;
      },
      handleRemove(file) {
        this.$refs.fileUploader.abort(file); // upload: el-upload的ref值；file:File类型，file文件本身
        this.fileListForShow.splice(this.fileListForShow.indexOf(file), 1);
      },
      handlePictureCardPreview(url) {
        this.dialogVisible = true;
        this.dialogImageUrl = url;
      },

      iniFormDataForEdit(formData) {
        if (formData !== undefined) {
          this.fileListForShow = JSON.parse(JSON.stringify(formData.letClueForm.fileList));
          this.letClueForm = formData.letClueForm;
          this.titleName = formData.canEdit ? '修改' : '查看';
          this.canEdit = formData.canEdit;
          this.isCreate = formData.isCreate;
        }
      },
      exceedHandler(files, fileList) {
        this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      initSelectorData() {

        // 线索来源
        DataDictionaryApi.getDictionary({ listUrl: '/dic/source/all', isDelete: false })
          .then(({ data }) => {
            this.threadOptions = data.data.dicCommonList;
          });
        // 职级
        DataDictionaryApi.getDictionary({ listUrl: '/dic/jobrank/all', isDelete: false })
          .then(({ data }) => {
            this.rankOptions = data.data.dicCommonList;
          });
        // 干部类型
        DataDictionaryApi.getDictionary({ listUrl: '/dic/jobtype/all', isDelete: false })
          .then(({ data }) => {
            this.cadreOptions = data.data.dicCommonList;
          });
        // 涉及领域
        DataDictionaryApi.getDictionary({ listUrl: '/dic/areainvolved/all', isDelete: false })
          .then(({ data }) => {
            this.involvedFieldOptions = data.data.dicCommonList;
          });
        // 违法行为
        DataDictionaryApi.getDictionary({ listUrl: '/dic/illegalbehavior/all', isDelete: false })
          .then(({ data }) => {
            this.unlawfulActOptions = data.data.dicCommonList;
          });
      },
      deleteDefendant(item, index) {
        this.letClueForm.letDefendantList.splice(index, 1);
      },
      addGroup() {
        this.letClueForm.letDefendantList.push({
          name: '',
          companyName: '',
          jobRankId: '',
          jobTypeName: [],
        });
      },
      submitGroup() {
        this.makeFileListForSubmit();//将文件上传控件的文件列表，整理进提交数据
        if (this.isCreate) {
          LetterClueApi.addLetClue(this.letClueForm)
            .then(({ data }) => {
              showResMsg(data);
              this.$emit('finishAddOrUpdate', data.result);
              if (data.result) {
                this.letClueForm = JSON.parse(JSON.stringify(this.letClueFormEmpty));
                this.$refs.fileUploader.clearFiles();
              }
            });
        } else {
          LetterClueApi.updateLetClue(this.letClueForm)
            .then(({ data }) => {
              showResMsg(data);
              this.$emit('finishAddOrUpdate', data.result);
            });
        }
      },
      makeFileListForSubmit() {
        //更新提交数据的文件列表
        this.letClueForm.fileList = JSON.parse(JSON.stringify(this.fileListForShow));
        this.letClueForm.fileList.forEach(e => {
          if (e.file === undefined && e.response !== undefined && e.response.data !== undefined) {
            e.file = e.response.data.file;
          }
        });
      },
      getFileComponentInfo(item) {
        let fileInfo = {
          icon: FileIcon.Other,
          isShowPreview: false,
          isShowPreviewButton: false
        };
        let fileValue = item.file;
        if (fileValue === undefined && item.response !== undefined && item.response.data !== undefined) {
          fileValue = item.response.data.file;
        }
        if (fileValue !== undefined) {
          let fileType = fileValue.substring(fileValue.lastIndexOf('.') + 1);
          switch (fileType.toLowerCase()) {
            case 'xlsx':
            case 'xls':
              fileInfo.icon = FileIcon.Excel;
              break;
            case 'docx':
            case 'doc':
              fileInfo.icon = FileIcon.Word;
              break;
            case 'ppt':
            case 'pptx':
              fileInfo.icon = FileIcon.Ppt;
              break;
            case 'wps':
              fileInfo.icon = FileIcon.Wps;
              break;
            case 'zip':
              fileInfo.icon = FileIcon.Zip;
              break;
            case 'rar':
              fileInfo.icon = FileIcon.Rar;
              break;
            case 'tar':
              fileInfo.icon = FileIcon.Tar;
              break;
            case 'pdf':
              fileInfo.icon = FileIcon.Pdf;
              break;
            case 'txt':
              fileInfo.icon = FileIcon.Txt;
              break;
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
            case 'bmp':
              fileInfo.icon = item.url;
              fileInfo.isShowPreview = true;
              fileInfo.isShowPreviewButton = true;
              break;
            default:
              fileInfo.icon = FileIcon.Other;
              break;
          }
        }
        return fileInfo;
      },

      downloadFile(url, fileName) {
        axios.get(
          url, 						//参数：请求url
          {
            responseType: 'arraybuffer',	//（固定写法，无需修改）
          })
          .then(function (res) {
            const content = res.data;
            const blob = new Blob([content]);
            if ('download' in document.createElement('a')) { // （非IE下载）
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // （释放URL 对象）
              document.body.removeChild(elink);
            } else { // （IE10+下载）
              navigator.msSaveBlob(blob, fileName);
            }
          })
          .catch(function (error) {
            console.log('下载文件出现错误', error);
          });
      },
      clearDialogForm() {
        this.letClueForm = JSON.parse(JSON.stringify(this.letClueFormEmpty));
        this.$refs.fileUploader.clearFiles();
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
