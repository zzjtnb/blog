<template>
	<div style="min-height: 600px">
		<el-card shadow="never" style="margin-bottom: 20px;max-width: 1090pt;margin: auto;">
			<div slot="header" class="clearfix">
				<span>管理标签</span>
				<el-button style="float: right; padding: 3px 0" type="text" size="medium " icon="el-icon-edit" @click="handleAdd">新增</el-button>
			</div>
			<!--工具条-->
			<!-- <el-col :span="24" class="toolbar">
				<el-button type="primary" round size="mini" @click="handleAllSelect">全选</el-button>
				<el-button type="danger" round size="mini" @click="batDel" :disabled="this.sels.length===0">批量删除</el-button>
				<el-button type="primary" round icon="el-icon-edit" @click="handleAdd">新增</el-button>
			</el-col>-->
			<!--列表-->
			<el-table :data="labelsList" ref="tb" highlight-current-row @selection-change="selsChange" style="width: 100%;">
				<!-- <el-table-column type="selection" width="55"></el-table-column> -->
				<el-table-column prop="name" label="标签名">
					<template slot-scope="scope">
						<el-tag size="medium" :color="`#${scope.row.color}`" effect="dark">{{scope.row.name}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="color" label="颜色"></el-table-column>
				<el-table-column label="操作" width="90%">
					<template slot-scope="scope">
						<!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
						<el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelete(scope.$index, scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--新增界面-->
			<el-dialog title="编辑" width="90%" :visible.sync="addFormVisible" :close-on-click-modal="false" v-if="addFormVisible">
				<el-form :model="addForm" label-width="80px" ref="addForm" :rules="ruleValidate">
					<el-form-item label="标签名" prop="name">
						<el-input v-model="addForm.name"></el-input>
					</el-form-item>
					<el-form-item label="颜色" prop="color">
						<el-input v-model="addForm.color"></el-input>
						<el-color-picker v-model="chooseColor" :predefine="predefineColors"></el-color-picker>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">取消</el-button>
					<el-button type="primary" @click="addLabels">提交</el-button>
				</div>
			</el-dialog>
			<!--编辑界面-->
			<el-dialog title="编辑" width="90%" :visible.sync="editFormVisible" :close-on-click-modal="false" v-if="editFormVisible">
				<el-form :model="editForm" label-width="80px" ref="editForm" :rules="ruleValidate">
					<el-form-item label="标签名" prop="name">
						<el-input v-model="editForm.name"></el-input>
					</el-form-item>
					<el-form-item label="颜色" prop="color">
						<el-input v-model="editForm.color"></el-input>
						<el-color-picker v-model="chooseColor" color-format="hex" :predefine="predefineColors"></el-color-picker>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click="editLabels">提交</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createLabels, deleteLabels, editLabels, getLabels, } from '@/api/labels'
export default {
  data () {
    return {
      //列表选中列
      sels: [],
      //新增界面是否显示
      addFormVisible: false,
      //新增界面数据
      addForm: {
      },
      //编辑界面是否显示
      editFormVisible: false,
      //编辑界面数据
      editForm: {
      },
      chooseColor: '',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
      ruleValidate: {
        name: [
          { required: true, message: '请输入博客标签', trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请输入标签颜色', trigger: 'blur' }
        ],
      },
      labelsList: [],
      labelsIndex: 0,
      labelsName: '',
    }
  },
  watch: {
    'chooseColor' (newVal, oldVal) {
      // console.log(`new:${newVal}, old:${oldVal}`);
      // console.log('new: %s, old: %s', newVal, oldVal)
      // console.log(newVal.length);
      if (newVal.length != 0) {
        this.editForm.color = newVal.replace(/#/, '')
        this.addForm.color = newVal.replace(/#/, '')
      }
    },
    'addForm.collor' (newVal, oldVal) {
      // console.log(`new:${newVal}, old:${oldVal}`);
      // console.log(`new:${newVal}, old:${oldVal}`);
    },
  },
  computed: {
    ...mapGetters([
      'token',
    ]),
  },
  mounted () {
    this.getgetgetgetLabelsList()
  },
  methods: {
    //选中变化
    selsChange: function (sels) {
      this.sels = sels;
    },
    //全选
    handleAllSelect: function () {
      if (this.labelsList) {
        this.labelsList.forEach(row => {
          this.$refs.tb.toggleRowSelection(row);
        });
      }
    },
    //删除
    handleDelete: function (index, row) {
      let msg = "确认删除该记录吗?";
      let status = 0;
      this.$confirm(msg, '提示', {
        type: 'warning',
        center: true,
      }).then(() => {
        deleteLabels(row.name).then((res) => {
          if (res.status == 204) {
            this.$message({
              message: '恭喜你，删除成功',
              type: 'success'
            });
            this.labelsList.splice(index, 1);
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
        })
      }).catch(() => {
      });
    },
    //批量删除
    batDel: function () {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.sels.forEach((item) => {
          this.labelsList.forEach((element, index) => {
            if (item.name == element.name) {
              this.labelsList.splice(index, 1);
            }
          })
        })
      }).catch(() => {
      });
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.labelsName = this.labelsList[index].name
      this.labelsIndex = index
      this.chooseColor = '#' + row.color
      this.editFormVisible = true;
      this.editForm = {
        name: row.name,
        new_name: row.name,
        color: (this.chooseColor).replace(/#/, '')
      }
      this.labelsList[index] = this.editForm
    },
    //提交编辑
    editLabels: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editLabels(this.editForm, this.labelsName).then((res) => {
            if (res.status == 200) {
              this.$message({
                message: '恭喜你，编辑成功',
                type: 'success'
              });
              this.editFormVisible = false;
            } else {
              this.$message({
                message: '编辑失败',
                type: 'error'
              });
              this.$refs['editForm'].resetFields();
            }
          })
        }
      });
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
    },
    //提交新增
    addLabels: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          createLabels(this.addForm).then((res) => {
            if (res.status == 201) {
              this.$message({
                message: '恭喜你，添加成功',
                type: 'success'
              });
              this.labelsList.push(this.addForm)
              this.addFormVisible = false;
            } else {
              this.$message({
                message: '添加失败',
                type: 'error'
              });
              this.$refs['addForm'].resetFields();
            }
          })
        }
      });
    },
    getgetgetgetLabelsList () {
      getLabels().then(response => {
        this.labelsList = response.data;
      });
    },
  }
}
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}
.clearfix:after {
	clear: both;
}
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
/* .el-form-item + .lables > .el-form-item__content {
	margin-left: 80px;
	display: flex;
	align-items: center;
} */
.el-dialog {
	position: absolute;
	top: 50%;
	left: 50%;
	margin: 0 !important;
	transform: translate(-50%, -50%);
	max-height: calc(100% - 30px);
	max-width: calc(100% - 30px);
	display: flex;
	flex-direction: column;
}
.el-dialog > .el-dialog__body {
	overflow: auto;
}
</style>