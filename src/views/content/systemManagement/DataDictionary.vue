<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="reduce-height-element">
      <el-tab-pane :key="item.name" v-for="item in editableTabs" :label="item.title" class="reduce-height-element" :name="item.name"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true" ref="TopForm" class="form-top reduce-height-element" >
      <el-form-item >
        <el-button type="primary" size="small" plain class="custom-button-in-toolbar" v-if="typeConceal" icon="el-icon-circle-plus-outline" @click="addDataFunction">增加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe header-cell-class-name="custom-header-cell" :height="tableAutoHeight" style="width: 100%">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" align="center" sortable label="名称"></el-table-column>
      <el-table-column prop="indexNumber" align="center" sortable label="排序"></el-table-column>
      <el-table-column align="center" v-if="typeConceal" fixed="right" width="140" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain class="custom-button-in-table" icon="el-icon-edit"
                     @click="amend(scope.$index, scope.row)">修改
          </el-button>
          <el-button type="danger" size="mini" plain class="custom-button-in-table" icon="el-icon-delete"
                     @click="dataDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!------------增加修改弹窗----------->
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" width="30%" :visible.sync="addAmendDialog">
      <el-form :model="form" :label-position="labelPosition" label-width="70px">
        <el-form-item label="名称:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="指数:">
          <el-input-number v-model="form.indexNumber" @change="addNumber" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAmendDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAmendConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DataDictionaryApi from 'src/api/data-dictionary-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    mixins: [SimpleAutoHeightTable],
    name: 'DataDictionary',
    data() {
      return {
        labelPosition: 'right',
        form: {
          name: '',
          indexNumber: 1,
          deleteId: '',
          addDeleteChange: '',
          methodKind: '',
        },
        addAmendDialog: false,
        typeConceal: true,
        dialogTitle: '',
        tableData: [],
        activeName: '1',
        tabLabelWatch: '',
        urlData: {
          listUrl: '',
          isDelete: false,
        },
        editableTabs: [{
          title: '干部类型管理',
          name: '1',
        }, {
          title: '涉及领域管理',
          name: '2',
        }, {
          title: '线索来源管理',
          name: '3',
        }, {
          title: '职级管理',
          name: '4',
        }, {
          title: '违法行为管理',
          name: '5',
        },
        //   {
          //   title: '分类类型管理',
          //   name: '6',
          // }
        ],
      };
    },

    created() {

      this.urlData.listUrl = '/dic/jobtype/all';
      this.urlData.addDeleteChange = '/dic/jobtype';
      this.tabLabelWatch = '干部类型管理';
      this.fetchData();
    },
    methods: {
      addNumber(value) {
        this.form.indexNumber = value;
      },
      addAmendConfirm() {
        DataDictionaryApi.addDictionary(this.form)
          .then(({ data }) => {
            showResMsg(data);
            if (data.result) {
              this.addAmendDialog = false;
              this.fetchData();
            }
          });
      },
      fetchData() {
        switch (this.tabLabelWatch) {
          case '干部类型管理':
            this.urlData.listUrl = '/dic/jobtype/all';
            break;
          case '涉及领域管理':
            this.urlData.listUrl = '/dic/areainvolved/all';
            break;
          case '线索来源管理':
            this.urlData.listUrl = '/dic/source/all';
            break;
          case '职级管理':
            this.urlData.listUrl = '/dic/jobrank/all';
            break;
          case '违法行为管理':
            this.urlData.listUrl = '/dic/illegalbehavior/all';
            break;
          case '分类类型管理':
            this.urlData.listUrl = '/dic/resulttype/all';
            break;
        }
        DataDictionaryApi.getDictionary(this.urlData)
          .then(({ data }) => {
            this.tableData = data.data.dicCommonList;
          });
      },
      handleClick(tab) {
        this.tabLabelWatch = tab.label;
        this.fetchData();
        this.typeConceal = tab.label !== '分类类型管理';
      },
      addDataFunction() {
        this.addAmendDialog = true;
        this.form.deleteId = '';
        this.form.name = '';
        this.form.indexNumber = '';
        this.form.methodKind = 'put';
        this.setRequestParam();
      },
      setRequestParam() {
        switch (this.tabLabelWatch) {
          case '干部类型管理':
            this.dialogTitle = '干部类型增加';
            this.form.addDeleteChange = '/dic/jobtype';
            break;
          case '涉及领域管理':
            this.dialogTitle = '涉及领域增加';
            this.form.addDeleteChange = '/dic/areainvolved';
            break;
          case '线索来源管理':
            this.dialogTitle = '线索来源增加';
            this.form.addDeleteChange = '/dic/source';
            break;
          case '职级管理':
            this.dialogTitle = '职级增加';
            this.form.addDeleteChange = '/dic/jobrank';
            break;
          case '违法行为管理':
            this.dialogTitle = '违法行为增加';
            this.form.addDeleteChange = '/dic/illegalbehavior';
            break;
          case '分类类型管理':
            this.dialogTitle = '分类类型增加';
            this.form.addDeleteChange = '/dic/resulttype';
            break;
        }
      },
      amend(index, row) {
        this.form.name = row.name;
        this.form.indexNumber = row.indexNumber;
        this.form.deleteId = row.id;
        this.addAmendDialog = true;
        this.form.methodKind = 'patch';
        this.setRequestParam();
      },
      dataDelete(index, row) {
        this.form.methodKind = 'delete';
        this.form.name = '';
        this.form.indexNumber = '';
        this.form.deleteId = row.id;
        this.setRequestParam();
        this.$confirm('此操作将永久删除该分类类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            DataDictionaryApi.addDictionary(this.form)
              .then(({ data }) => {
                showResMsg(data);
                if (data.result) {
                  this.fetchData();
                }
              });
          });

      },
    },

  };
</script>

<style scoped>

  .el-form--inline .el-form-item {
    margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
  }
</style>
