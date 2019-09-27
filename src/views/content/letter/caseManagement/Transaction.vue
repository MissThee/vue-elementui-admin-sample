<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="案件办理" :visible.sync="caseDealtWith" width="400px">
      <el-form :model="inquires" label-width="100px">
        <el-form-item label="意见">
          <!--<el-input v-model="inquires.name" style="width: 150px;"></el-input>-->
          <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="inquires.name" style="width: 250px;">
          </el-input>
        </el-form-item>
        <el-form-item label="是否要结果件">
          <el-select v-model="inquires.knotPiece" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in optionsSF" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker v-model="inquires.expirationDate" type="date" placeholder="截止日期" style="width: 145px;" :disabled="inquires.knotPiece === 1 ? false : true"></el-date-picker>
        </el-form-item>
        <el-form-item label="案件结单">
          <el-select v-model="inquires.caseStatement" multiple collapse-tags style="width: 250px;" placeholder="请选择">
            <el-option v-for="item in optionsJD" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级预警">
          <el-select v-model="inquires.levelAlert" placeholder="请选择" style="width: 250px;">
            <el-option v-for="item in optionsLevelAlert" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件上传">
          <el-upload
            :action="Global.URL"
            :headers="headers"
            class="upload-demo"
            ref="fileUploader"
            multiple
            auto-upload
            :limit="20"
            :on-exceed="exceedHandler"
            :on-change="changeHandler"
            :file-list="inquires.fileList">
            <el-button type="success" plain class="custom-button-in-toolbar" icon="el-icon-upload">点击上传分办通知书</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="caseDealtWith = false">取 消</el-button>
        <el-button type="primary" @click="isOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from 'src/utils/cookies';
  import Global from 'src/utils/global';

  export default {
    name: 'Transaction',
    props: {
      value: Boolean,
      transactionInfo: Object,
    },
    data() {
      return {
        Global,
        headers: {
          Authorization: getToken(),
        },
        inquires: {},
        optionsLevelAlert: [{
          value: '正常',
          label: '正常',
        }, {
          value: '七天',
          label: '七天',
        }, {
          value: '三天',
          label: '三天',
        }, {
          value: '列期',
          label: '列期',
        }],
        optionsSF: [{
          value: 1,
          label: '是',
        }, {
          value: 2,
          label: '否',
        }],
        optionsJD: [{
          value: 1,
          label: '第一',
        }, {
          value: 2,
          label: '第二',
        }, {
          value: 3,
          label: '第三',
        }, {
          value: 4,
          label: '第四',
        }, {
          value: 5,
          label: '第五',
        }, {
          value: 6,
          label: '第六',
        }, {
          value: 7,
          label: '第七',
        }],
      };
    },
    methods: {
      exceedHandler(files, fileList) {
        this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      changeHandler(files, fileList) {
        fileList.forEach(item => {
          if (item.response !== undefined && item.response.data !== undefined) {
            item.file = item.response.data.file;
          }
        });
        this.letClueForm.letFileList = fileList;
      },
      close() {
        this.$emit('input', false);
      },
      isOk() {
        this.close();
        this.$emit('up-data');
      },
    },
    computed: {
      caseDealtWith: {
        get() {
          return this.value;
        },
        set(flag) {
          if (!flag) {
            this.close();
          }
        },
      },
    },
  };
</script>

<style scoped>

</style>
