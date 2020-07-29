<template>
  <div>
    <el-form-item>
      <el-upload
        :action="Global.HTTP_URL+'/stuff/file'"
        :headers="headers"
        class="upload-demo"
        :class="{'hide-upload-button':!canEdit}"
        drag
        ref="CustomCardFileUploader"
        multiple
        auto-upload
        :limit="20"
        list-type="picture-card"
        :on-exceed="exceedHandler"
        :on-success="onSuccessHandler"
        :file-list="fileListForShow"
      >
        <div slot="default" style="font-size: 15px;line-height: 15px;">
          <i class="el-icon-upload"><span style="font-size: 15px;line-height: 15px">上传附件</span></i>
          <br>
          <span style="color: #409eff">拖拽至此<span style="color:gray">或</span>点击上传</span>
        </div>
        <div slot="file" style="position: relative;height: 100%;" slot-scope="{file}">
          <div style="height: 100%;" v-for="fileComponentInfo in [getFileComponentInfo(file)]">
            <div style="background-repeat: no-repeat;background-position: center;height: 100%"
                 :style="{backgroundImage: ('url(\''+fileComponentInfo.icon+'\')'),backgroundSize:(fileComponentInfo.isShowPreview?'cover':'70%')}"></div>
            <div style="position: absolute;top:0;left:0;height: 100%;width: 100%;">
              <div
                style="position: absolute;top:0;left:0;height: 100%;width: 100%;background-color: #666666;opacity: 0.65"></div>
              <div style="position: relative;color:#ffffff;font-weight: bold;margin-left: 5px">{{file.name}}</div>
            </div>
            <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" v-if="fileComponentInfo.isShowPreviewButton"
                        @click="handlePictureCardPreview(file.url)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-download" @click="downloadFile(file.url,file.name)"></i>
                  </span>
                  <span class="el-upload-list__item-delete" v-if="canEdit" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
          </div>
        </div>
      </el-upload>
    </el-form-item>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" append-to-body title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="图片预览">
    </el-dialog>
  </div>
</template>

<script>
  import Global from 'src/utils/global';
  import {getTokenOrRedirect} from 'src/utils/cookies';
  import FileIcon from 'src/assets/img/file-icon/file-icon';
  import axios from 'axios';

  export default {
    name: 'FileUploader',
    data() {
      return {
        fileListForForm: [],
        fileListForShow: [],
        dialogVisible: false,
        dialogImageUrl: '',
        Global,
        headers: {
          Authorization: getTokenOrRedirect(),
        },
        canEdit: true,
      };
    },
    methods: {
      initFileList(fileList, canEdit) {
        this.fileListForShow = fileList;
        this.canEdit = canEdit === undefined ? true : canEdit;
        this.makeFileListForForm();
      },
      clearFileList() {
        this.$refs.CustomCardFileUploader.clearFiles();
        this.fileListForForm = [];
        this.makeFileListForForm();
      },
      getFileList() {
        return this.fileListForForm;
      },
      //以上为给用户调用的方法
      //一下为本组件内部使用的方法
      onSuccessHandler(response, file, fileList) {
        //成功上传后虽然视图已经变更，但组件绑定的file-list参数"fileList"为单向绑定，组件不会将fileListForShow更新，需自己实现更新此参数
        this.fileListForShow = fileList;
        this.makeFileListForForm();
        this.$emit('on-success', this.fileListForForm);
        this.$emit('on-change', this.fileListForForm);
      },
      handleRemove(file) {
        this.$refs.CustomCardFileUploader.abort(file); // upload: el-upload的ref值；file:File类型，file文件本身
        if (this.fileListForShow.indexOf(file) !== -1)
          this.fileListForShow.splice(this.fileListForShow.indexOf(file), 1);
        this.makeFileListForForm();
      },
      handlePictureCardPreview(url) {
        this.dialogVisible = true;
        this.dialogImageUrl = url;
      },
      exceedHandler(files, fileList) {
        this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },

      makeFileListForForm() {
        //更新提交数据的文件列表
        let fileListForForm = [];
        this.fileListForShow.forEach(e => {
          let f = {};
          if (e.name !== undefined) {
            f.name = e.name;
          }
          if (f.name === undefined && e.response !== undefined && e.response.name !== undefined) {
            f.name = e.response.data.name;
          }
          if (e.file !== undefined) {
            f.file = e.file;
          }
          if (f.file === undefined && e.response !== undefined && e.response.data !== undefined) {
            f.file = e.response.data.file;
          }
          fileListForForm.push(f);
        });
        this.fileListForForm = fileListForForm;
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
            alert('下载文件出现错误:' + error);
          });
      },
    }
  };
</script>

<style scoped>
  a {
    text-decoration: none;
    out-line: none;
    color: #ffffff;
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


  /deep/ .hide-upload-button .el-upload--picture-card {
    display: none;
  }
</style>
