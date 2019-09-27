<template>
  <div>
    <el-dialog :close-on-click-modal="false" :title="(isUpdate?'修改':'新增')+'单位'" :visible.sync="isShow" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="上级">
          <el-cascader style="width: 100%" :options="unitTree" :props="prop" clearable v-model="form.parentIdForVModel"></el-cascader>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.indexNum"></el-input>
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

  export default {
    name: 'Change',
    props: {
      value: Boolean,
      changeInfo: Object,
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
          parentIdForVModel: [],
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
        if (isUpdate) {
          this.form = rowInfo;
          this.form.parentIdForVModel = rowInfo.parentId;
          this.form.parentId = 0;
        } else {
          this.form = JSON.parse(JSON.stringify(this.formEmpty));
          if (rowInfo !== undefined) {
            this.form.parentIdForVModel = rowInfo.id;
          }
        }
      },
      isOk() {
        if (Array.isArray(this.form.parentIdForVModel)) {
          if (this.form.parentIdForVModel.length === 0) {
            this.form.parentId = 0;
          } else {
            this.form.parentId = this.form.parentIdForVModel[this.form.parentIdForVModel.length - 1];
          }
        } else {
          this.form.parentId = this.form.parentIdForVModel;
        }
        const check = this.$checkNull(this.form);
        if (!check) {
          this.$message.error('请完善信息');
          return;
        }
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
