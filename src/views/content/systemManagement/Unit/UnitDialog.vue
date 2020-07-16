<template>
  <div>
    <el-dialog :close-on-click-modal="false" :title="(isUpdate?'修改':'新增')+'单位'" :visible.sync="isShow" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="上级">
          <tree-select v-model="form.parentId" :treeData="unitTree" :props="prop" nodeKey="id"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type"/>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.indexNum"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import UnitApi from 'src/api/unit-api';
  import { showResMsg } from 'src/utils/operation-result-message';

  import TreeSelect from '../../../common/TreeSelect';

  export default {
    name: 'Change',
    components: {
      TreeSelect
    },
    data() {
      return {
        isShow: false,
        isUpdate: {},
        unitTree: {},
        form: {},
        formEmpty: {
          name: '',
          type: '',
          parentId: '',
          indexNum: 1000
        },
        prop: {
          checkStrictly: true,
          value: 'id',
          label: 'name',
        },
      };
    },
    methods: {
      show(isUpdate, rowInfo, treeInfo) {
        this.isShow = true;
        this.isUpdate = isUpdate;
        this.unitTree = treeInfo;
        this.form = JSON.parse(JSON.stringify(this.formEmpty));
        if (isUpdate) {
          this.form = rowInfo;
        } else {
          if (rowInfo !== undefined) {
            this.form.parentId = rowInfo.id;
          }
        }
      },
      isOk() {
        if (this.isUpdate) {
          UnitApi.updateUnit(this.form)
            .then(({ data }) => {
              showResMsg(data);
              if (data.result) {
                this.isShow = false;
                this.$emit('up-data');
              }
            });
        } else {
          UnitApi.addUnit(this.form)
            .then(({ data }) => {
              showResMsg(data);
              if (data.result) {
                this.isShow = false;
                this.$emit('up-data');
              }
            });
        }
      },
    },
  };
</script>

<style scoped>

</style>
