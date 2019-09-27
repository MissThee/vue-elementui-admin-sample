<template>
  <div>
    <el-form :inline="true" ref="elForm">
      <el-form-item label="查询：" style="margin-left: 10px;">
        <el-select size="small" v-model="isFinished" placeholder="请选择" style="width: 100px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" plain class="custom-button-in-toolbar" style="margin-top: 10px;" @click="fetchData">查询
      </el-button>
    </el-form>
    <el-table
      :height="tableHeight"
      :data="tableData"
      border
      stripe
      header-cell-class-name="custom-header-cell"
      style="width: 100%">
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="letClueId"
        min-width="70"
        sortable
        label="线索编码">
      </el-table-column>
      <el-table-column
        prop="title"
        min-width="160"
        sortable
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="stepName"
        align="center"
        min-width="160"
        sortable
        label="步骤">
      </el-table-column>
      <el-table-column
        prop="createDate"
        align="center"
        min-width="100"
        sortable
        label="时间">
      </el-table-column>
      <el-table-column align="center" fixed="right" min-width="80" width="80px" label="操作">
        <template slot-scope="scope">
          <el-button :type="scope.row.isFinished?'success':'primary'" :icon="scope.row.isFinished?'el-icon-view':'el-icon-edit'" size="mini" plain class="custom-button-in-table"
                     @click="edit(scope.row)">{{scope.row.isFinished?'查看':'审批'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--------------问题审批-------------->
    <el-dialog :close-on-click-modal="false"
               :visible.sync="isShowReviewDialog"
               width="750px"
               center>
      <div class="form-title">问题线索处置方案呈批笺</div>
      <table border="2" class="form-layout" style=";border-collapse: collapse;width: 100%;">
        <tr style="height: 75px;">
          <td style="width: 10%">文件<br>标题</td>
          <td class="form-sub-title">{{ this.form.title }}</td>
        </tr>
        <tr v-for="(value,key) in keyPrefix">
          <td><span v-html="value"></span></td>
          <td>
            <div v-if="canEditKeyList.indexOf(key+'Content') === -1" class="form-cell-content">{{form[key+'Content']}}</div>
            <el-input v-else type="textarea"  placeholder="请输入审批内容"  :autosize="{ minRows: 7}" v-model="form[key+'Content']"></el-input>
            <div class="form-cell-bottom">
              <span>{{form[key+'Name']}}</span>
              <span style="float: right;">{{dateFormatter(form[key+'Date'])}}</span>
            </div>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isShowSubmitButton" type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
    <!----------------------分页---------------------->
    <el-pagination
      style="text-align: center;"
      ref="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-size="this.pageSize"
      layout="total, prev, pager, next"
      :total="totalNumber">
    </el-pagination>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import letterClueReviewApi from 'src/api/letter-clue-review-api.js';
  import { showResMsg } from '../../../utils/operation-result-message';

  export default {
    name: 'Review',
    data() {
      return {
        totalNumber: 1,
        pageIndex: 1,
        pageSize: 50,

        options: [{
          value: 0,
          label: '待处理',
        }, {
          value: 1,
          label: '已处理',
        }, {
          value: 2,
          label: '全部',
        }],
        tableHeight: 0,
        isFinished: 0,
        tableData: [],
        isShowReviewDialog: false,
        form: {},
        canEditKeyList: [],
        thisRowId: '',
        keyPrefix: {
          bwld: '本委<br>领导<br>批示',
          fgfsj: '分管<br>副书记<br>意见',
          zgcw: '主管<br>常委<br>意见',
          scs: '审查室<br>意见'
        },
        isShowSubmitButton: false,
      };
    },
    watch: {
      contentHeight(val) {
        this.tableHeight = val - this.$refs.elForm.$el.offsetHeight - this.$refs.pagination.$el.offsetHeight ;
      },
    },
    created() {
      this.$nextTick(() => {
        this.tableHeight = this.contentHeight - this.$refs.elForm.$el.offsetHeight - this.$refs.pagination.$el.offsetHeight;
      });
      this.fetchData();
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.fetchData();
      },

      edit(row) {
        this.isShowSubmitButton = !row.isFinished;
        this.thisRowId = row.id;
        letterClueReviewApi.getLetClueReviewOne({
          id: row.id,
        })
          .then(({ data }) => {
            this.isShowReviewDialog = true;
            this.form = data.data.form;
            this.canEditKeyList = data.data.canEditKeyList;
          });
      },
      submit() {
        for (let key in this.keyPrefix) {
          if (this.keyPrefix.hasOwnProperty(key)) {
            if (this.canEditKeyList[0].startsWith(key)) {
              letterClueReviewApi.updateLetClueReview({
                id: this.thisRowId,
                form: {
                  [key + 'Content']: this.form[key + 'Content'],
                },
              })
                .then(({ data }) => {
                  showResMsg(data);
                  if (data.result) {
                    this.isShowReviewDialog = false;
                    this.fetchData();
                  }
                });
              return;
            }
          }
        }
        showResMsg({ result: false, msg: '提交表单出错' });
      },

      fetchData() {
        letterClueReviewApi.getLetClueReviewList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          isFinished: this.isFinished,
        })
          .then(({ data }) => {
            this.tableData = data.data.formList;
            this.totalNumber = data.data.total;
          });
      },
      dateFormatter(dateValue) {
        if (dateValue === null) {
          return null;
        }
        let date = new Date(dateValue);
        return date.getFullYear() + '年' + date.getMonth() + '月' + date.getDay() + '日';
      }
    },
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
      }),
    },
  };
</script>

<style scoped>
  .form-title {
    font-family: SimSun, serif;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 10px;
  }

  .form-layout {
    font-weight: bold;
    font-family: SimSun, serif;
    font-size: 15px;
  }

  .form-sub-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }


  .form-layout tr td:first-child {
    text-align: center;
  }

  .form-layout tr:first-child {
    text-align: center;
  }

  .form-cell-content {
    overflow: scroll;
    height: 120px;
    padding: 10px;
  }

  .form-cell-bottom {
    padding: 0 10px;
  }

</style>
