<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-top" ref="elForm">
        <el-button type="primary" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" @click="caseManagerAdd">增加</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table :data="tableData" border header-cell-class-name="custom-header-cell" :height="tableHeight" stripe style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column label="三级预警" prop="levelAlert" align="center"min-width="100">
          <template slot-scope="scope">
            <div :style="scope.row.levelAlert === '正常' ? circleColorNormal :
            scope.row.levelAlert === '三天' ? circleColorThree : scope.row.levelAlert === '七天' ? circleColorSeven : circleColorColumnPeriod"></div>
          </template>
        </el-table-column>
        <el-table-column prop="receptionTime" align="center" min-width="150" label="受理时间" sortable></el-table-column>
        <el-table-column prop="id" align="center" min-width="150" label="线索编码" sortable></el-table-column>
        <el-table-column prop="isEnable" align="center" min-width="80" label="状态" sortable>
          <template slot-scope="scope">
            <el-tag style="margin-left: 2px" :type="scope.row.isEnable ?'primary':'danger'" size="mini"> {{ scope.row.isEnable === true ? '可用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" min-width="220" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain class="custom-button-in-table" icon="el-icon-document"
                       @click="transaction(scope.$index, scope.row)">办理
            </el-button>
            <el-button type="primary" size="mini" plain class="custom-button-in-table" icon="el-icon-edit"
                       @click="modification(scope.$index, scope.row)">修改
            </el-button>
            <el-button type="danger" size="mini" plain class="custom-button-in-table" icon="el-icon-warning"
                       @click="reject(scope.$index, scope.row)">驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!----------------------------增加对话框-------------------------------->
    <el-dialog :close-on-click-modal="false"
      :title="titleName"
      width="60%"
      :visible.sync="dialogFormVisible">
      <div v-loading="IsLoading">
        <LetterClue :change-info="letClueForm"></LetterClue>
      </div>
    </el-dialog>
    <!----------------------------案件办理对话框---------------------------->
    <Transaction v-model="showTransaction" :change-info="transactionInfo" @up-data="fetchData"></Transaction>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import LetterClue from 'src/views/content/letter/LetterClue';
  import Transaction from './Transaction';
  import { showResMsg } from 'src/utils/operation-result-message';

  export default {
    name: 'Index',
    data() {
      return {
        letClueForm: {
          data: {},
          type: '',
        },
        circleColorNormal: {
          background: 'green',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          margin: 'auto',
        },
        circleColorThree: {
          background: 'yellow',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          margin: 'auto',
        },
        circleColorSeven: {
          background: 'blue',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          margin: 'auto',
        },
        circleColorColumnPeriod: {
          background: 'red',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          margin: 'auto',
        },
        transactionInfo: {},
        titleName: '',
        IsLoading: false,
        tableHeight: 0,
        dialogFormVisible: false,
        showTransaction: false,
        tableData: [{
          receptionTime: '2019-9-10 08:15',
          id: '2019910815',
          isEnable: '',
          levelAlert: '正常',
        }, {
          receptionTime: '2019-9-10 08:16',
          id: '2019910816',
          isEnable: '1',
          levelAlert: '七天',
        }, {
          receptionTime: '2019-9-10 08:17',
          id: '2019910817',
          isEnable: '1',
          levelAlert: '三天',
        }, {
          receptionTime: '2019-9-10 08:18',
          id: '2019910818',
          isEnable: '',
          levelAlert: '列期',
        }],
      };
    },
    watch: {
      contentHeight(val) {
        this.tableHeight = val - 50;
      },
    },
    created() {
      this.$nextTick(() => {
        this.tableHeight = this.contentHeight - 50;
      });
    },
    components: {
      LetterClue,
      Transaction,
    },
    methods: {
      fetchData() {
      },
      caseManagerAdd() {
        this.dialogFormVisible = true;
      },
      transaction() {
        this.showTransaction = true;
        this.transactionInfo = {};
      },
      modification(index, row) {
        // this.letClueForm.data = data.data;
        this.letClueForm.data = row;
        this.dialogFormVisible = true;
        this.letClueForm.type = '案件管理修改';
        // if (row.resultTypeId === 0) {
        //   this.letClueForm.type = '信访表单修改';
        // } else {
        //   this.letClueForm.type = '信访表单查看';
        // }
      },
      reject() {
        // const id = node.data.id;
        this.$confirm('此操作会将此安管信息驳回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // PermissionApi.deletePermission(id).then(({ data }) => {
          //   showResMsg(data);
          //   this.fetchData();
          // });
        });
      },
    },
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
      }),
    },
  };
</script>

<style scoped>

</style>
