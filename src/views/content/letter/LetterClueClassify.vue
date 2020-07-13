<template>
  <div>
    <el-form :inline="true"  style="box-sizing: border-box;" class="reduce-height-element">
      <el-form-item label="分类：" style="margin-left: 10px;">
        <el-select size="small" v-model="inquires.resultTypeId" placeholder="请选择" clearable style="width: 100px;">
          <el-option v-for="item in resultTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间段：" style="margin-left: 10px;">
        <el-date-picker size="small" v-model="timeQuantum" @change="selectionTime" style="width: 300px;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="主要问题：" style="margin-left: 10px;">
        <el-input size="small" v-model="inquires.content" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="被反映人：" style="margin-left: 10px;">
        <el-input size="small" v-model="inquires.defendantName" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item  style="margin-left: 10px;">
        <el-button type="primary" size="small" plain class="custom-button-in-toolbar"  @click="inquire">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :height="tableAutoHeight" :data="tableData" border stripe header-cell-class-name="custom-header-cell" style="width: 100%">
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{scope.$index+(inquires.pageIndex - 1) * inquires.pageSize + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="id" width="120" sortable align="center" label="线索编码"></el-table-column>
      <el-table-column align="center" prop="receptionTime" width="120" sortable label="受理时间"></el-table-column>
      <el-table-column prop="allLetDefendants" align="center" min-width="240" sortable label="被反映人信息">
        <template slot-scope="scope">
          <table v-if="scope.row.letDefendantList.length>0" style="table-layout: fixed;width: 100%;border-collapse: collapse">
            <tr v-for="letDefendant in scope.row.letDefendantList">
              <td class="is-center" style="border: 1px solid #ddd;width: 30%">
                <div>{{letDefendant.name}}</div>
              </td>
              <td class="is-center" style="border: 1px solid #ddd;width: 70%">
                <div>{{letDefendant.companyName}}</div>
              </td>
            </tr>
          </table>
          <div v-if="scope.row.letDefendantList.length===0" style="color: #ccc">无被反映人</div>
        </template>
      </el-table-column>
      <el-table-column prop="content" align="center" min-width="240" sortable label="反应的主要问题"></el-table-column>
      <el-table-column prop="resultTypeName" width="110" align="center" sortable label="处理类型">
        <template slot-scope="scope">
          <el-tag style="margin-left: 2px" :type="letClueTagColor(scope.row.resultTypeName)" size="mini"> {{ scope.row.resultTypeName === null ? '未分类' : scope.row.resultTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" plain class="custom-button-in-table" icon="el-icon-edit" v-if="letClueIsEditable(scope.row.resultTypeId)"
                     @click="modifyType(scope.$index, scope.row)">分类
          </el-button>
          <el-button type="primary" size="mini" plain class="custom-button-in-table" :icon="letClueIsEditable(scope.row.resultTypeId)?'el-icon-edit':'el-icon-view'"
                     @click="handleExamine(scope.$index, scope.row)">{{letClueIsEditable(scope.row.resultTypeId)? '修改':'查看'}}
          </el-button>
          <el-button type="danger" size="mini" plain class="custom-button-in-table" icon="el-icon-delete" v-if="letClueIsEditable(scope.row.resultTypeId)"
                     @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center;box-sizing: border-box"
      class="reduce-height-element"
      ref="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="inquires.pageIndex"
      :page-size="inquires.pageSize"
      :page-sizes="[10,20,30,40,50,100, 200, 300, 400,500]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber">
    </el-pagination>
    <!----------------------------查看对话框-------------------------------->
    <el-dialog :close-on-click-modal="false" :title="titleName" @closed="letterClueFormDialogClosedHandler()" width="840px" :visible.sync="dialogFormVisible">
      <div v-loading="IsLoading">
        <LetterClue ref="LetterClueForm" @finishAddOrUpdate="fetchDataAfterOperation"></LetterClue>
      </div>
    </el-dialog>
    <!----------------------------改变状态对话框-------------------------------->
    <el-dialog :close-on-click-modal="false"
               title="处理类型修改"
               width="30%"
               :visible.sync="processingTypeDialog">
      <el-form :inline="true" label-width="80px" size="mini">
        <el-form-item label="处理类型">
          <el-select v-model="processingType" clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProcessingType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Img from 'src/assets/img';
  import DataDictionaryApi from 'src/api/data-dictionary-api';
  import LetterClueApi from 'src/api/letter-clue-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import LetterClue from './LetterClue';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    mixins:[SimpleAutoHeightTable],
    name: 'letterClueClassify',
    data() {
      return {
        Img,
        // tagsType: true,
        titleName: '',
        IsLoading: false,

        processingType: '',
        totalNumber: 1,
        rowId: '',
        changeInfo: {},
        dialogFormVisible: false,
        processingTypeDialog: false,
        tableData: [],
        threadOptions: [],
        rankOptions: [],
        cadreOptions: [],
        involvedFieldOptions: [],
        unlawfulActOptions: [],
        typeOptions: [],
        dicIllegalBehavior: [],
        dicAreaInvolved: [],
        jobTypeName: [],
        dicSources: [],
        submitType: true,
        changeType: true,
        resultTypeOptions: [],
        timeQuantum: '',
        inquires: {
          pageIndex: 1,
          pageSize: 50,
        },
      };
    },
    components: {
      LetterClue,
    },
    created() {
      this.fetchData();
      // 线索分类类型
      DataDictionaryApi.getDictionary({ listUrl: '/dic/resulttype/all', isDelete: false })
        .then(({ data }) => {
          this.resultTypeOptions = data.data.dicCommonList;
        });
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
    methods: {
      fetchDataAfterOperation(result) {
        if (result) {//窗口中修改成功则调用
          this.fetchData();
        }
      },
      selectionTime(data) {
        if (data === null) {
          this.inquires.startTime = '';
          this.inquires.endTime = '';
        } else {
          this.inquires.startTime = data[0];
          this.inquires.endTime = data[1];
        }
      },
      inquire() {
        if (this.inquires.resultTypeId === '') {
          this.inquires.resultTypeId = undefined;
        }
        if (this.inquires.content === '') {
          this.inquires.content = undefined;
        }
        if (this.inquires.name === '') {
          this.inquires.name = undefined;
        }
        if (this.inquires.startTime === '') {
          this.inquires.startTime = undefined;
        }
        if (this.inquires.endTime === '') {
          this.inquires.endTime = undefined;
        }
        this.fetchData();
      },
      handleSizeChange(val) {
        this.inquires.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.inquires.pageIndex = val;
        this.fetchData();
      },
      fetchData() {
        LetterClueApi.getLetClueList(this.inquires)
          .then(({ data }) => {
            this.tableData = data.data.list;
            this.totalNumber = data.data.total;
          });
      },
      handleExamine(index, row) {
        LetterClueApi.getLetClueOne({
          id: row.id,
        })
          .then(({ data }) => {
            this.changeInfo = {
              isCreate: false,
              canEdit: this.letClueIsEditable(row.resultTypeId),
              letClueForm: data.data
            };
            this.dialogFormVisible = true;
            this.$nextTick(() => {//子组件加载完后再调用其中方法
              this.$refs.LetterClueForm.iniFormDataForEdit(this.changeInfo,this.canEdit);
            });
          });

      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该信访表单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            LetterClueApi.deleteLetClue({
              id: row.id,
            })
              .then(({ data }) => {
                showResMsg(data);
                if (data.result) {
                  this.fetchData();
                }
              });
          });
      },
      modifyType(index, row) {
        DataDictionaryApi.getDictionary({ listUrl: '/dic/resulttype/all', isDelete: false })
          .then(({ data }) => {
            this.typeOptions = data.data.dicCommonList;
            this.processingTypeDialog = true;
          });
        this.rowId = row.id;
      },
      submitProcessingType() {
        LetterClueApi.updateResultType({
          id: this.rowId,
          resultTypeId: this.processingType,
        })
          .then(({ data }) => {
            showResMsg(data);
            if (data.result) {
              this.processingTypeDialog = false;
              this.fetchData();
            }
          });
      },
      letterClueFormDialogClosedHandler() {
        this.$refs.LetterClueForm.clearDialogForm();
      },
      letClueTagColor(value) {
        switch (value) {
          case '未分类':
          case '':
          case null:
            return 'info';
          case '案管':
            return 'success';
          case '驳回':
            return 'danger';
          default:
            return '';
        }
      },
      letClueIsEditable(resultTypeId) {
        switch (resultTypeId) {
          case 0:
          case 4:
          case null:
            return true;
          default:
            return false;
        }
      }
    },
  };
</script>

<style scoped>
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
</style>
