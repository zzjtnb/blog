<template>
	<div style="min-height: 600px">
		<el-card shadow="never" style="margin-bottom: 20px">
			<el-form ref="form" :model="form" label-width="80px" :rules="ruleValidate">
				<el-form-item label="标题" prop="title">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="缩略图">
					<el-upload list-type="picture-card" action ref="upload" :on-preview="handlePictureCardPreview" :http-request="UploadImage" :auto-upload="true" :file-list="fileList" multiple>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog>
				</el-form-item>
				<el-form-item label="标签" prop="labels" class="lables">
					<!--列表-->
					<el-table :data="form.labels" ref="tb" highlight-current-row @selection-change="selsChange" style="width: 100%;">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column prop="name" label="标签名">
							<template slot-scope="scope">
								<el-tag size="medium" :color="`#${scope.row.color}`" effect="dark">{{scope.row.name}}{{scope.row.color}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="color" label="颜色"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-button type="primary" round size="mini" @click="handleAllSelect">全选</el-button>
						<el-button type="danger" round size="mini" @click="batDel" :disabled="this.sels.length===0">批量删除</el-button>
						<el-button type="primary" round size="mini" @click="handleAdd">新增</el-button>
						<!-- <el-pagination layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" style="float:right;"></el-pagination> -->
					</el-col>
				</el-form-item>
				<el-form-item label="正文" prop="body">
					<mavon-editor @imgAdd="imgAdd" style="max-height: 500px" ref="md" v-model="form.body" :subfield="false" :toolbars="mavonEditorToolbars" :ishljs="true" :codeStyle="true" codeStyle="agate" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit" :loading="submitButton.loading" :disabled="submitButton.disabled">发表</el-button>
					<el-button @click="$router.push('/user/blog/main')">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!--新增界面-->
		<el-dialog title="编辑" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" ref="addForm">
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
				<el-button type="primary" @click.native="addFormVisible = false">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
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
				<el-button type="primary" @click.native="editFormVisible = false">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createIssue, UploadImageApi } from '@/api/issue'
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
      fileList: [],
      imgsrc: '',
      imageName: '',
      addImage: {
        committer: {
          "name": "zzjtnb",
          "email": "zzjtnb@163.com"
        },
        message: 'Add File',
        content: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      inputVisible: false,
      inputValue: '',
      label: '',
      form: {
        title: "",
        labels: [],
        body: "",
      },
      ruleValidate: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { type: 'string', max: 64, message: '标题长度不大于64字符', trigger: 'change' }
        ],
        labels: [
          { required: true, message: '请输入博客标签', trigger: 'blur' }
        ],
        body: [
          { required: true, message: '请输博客入正文', trigger: 'blur' }
        ],
      },
      submitButton: {
        loading: false,
        disabled: false
      },
      mavonEditorToolbars: {
        bold: true, // 粗体 
        italic: true, // 斜体 
        header: true, // 标题 
        underline: true, // 下划线 
        strikethrough: true, // 中划线 
        mark: true, // 标记 
        superscript: true, // 上角标 
        subscript: true, // 下角标 
        quote: true, // 引用 
        ol: true, // 有序列表 
        ul: true, // 无序列表 
        link: true, // 链接 
        imagelink: true, // 图片链接 
        code: true, // code 
        table: true, // 表格 
        fullscreen: true, // 全屏编辑 
        readmodel: true, // 沉浸式阅读 
        htmlcode: true, // 展示html源码 
        help: true, // 帮助 /* 1.3.5 */ 
        undo: true, // 上一步 
        redo: true, // 下一步 
        trash: true, // 清空 
        // save: true, // 保存（触发events中的save事件） /* 1.4.2 */ 
        // navigation: true, // 导航目录 /* 2.1.8 */ 
        alignleft: true, // 左对齐 
        aligncenter: true, // 居中 
        alignright: true, // 右对齐 /* 2.2.1 */ 
        // subfield: true, // 单双栏模式 
        preview: true, // 预览
      },
    }
  },
  watch: {
    'form.body' (newVal, oldVal) {
      // console.log(`new:${newVal}, old:${oldVal}`);
      // console.log('new: %s, old: %s', newVal, oldVal)
      // console.log(newVal.length);
    },
    'chooseColor' (newVal, oldVal) {
      if (newVal.length != 0) {
        this.editForm.color = newVal.replace(/#/, '')
        this.addForm.color = newVal.replace(/#/, '')
      }
    },
  },
  computed: {
    ...mapGetters([
      'token',
    ]),
  },
  methods: {
    //选中变化
    selsChange: function (sels) {
      this.sels = sels;
    },
    //全选
    handleAllSelect: function () {
      if (this.form.labels) {
        this.form.labels.forEach(row => {
          this.$refs.tb.toggleRowSelection(row);
        });
      }
    },
    //删除
    handleDelete: function (index, row) {
      // console.log(row.name)
      let msg = "确认删除该记录吗?";
      let status = 0;
      this.$confirm(msg, '提示', {
        type: 'warning'
      }).then(() => {
        this.form.labels.splice(index, 1);
      }).catch(() => {
      });
    },
    //批量删除
    batDel: function () {
      // var ids = this.sels.map(item => item.id).toString();
      // var ids = this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.sels.forEach((item) => {
          this.form.labels.forEach((element, index) => {
            if (item.name == element.name) {
              console.log(index);
              this.form.labels.splice(index, 1);
            }
          })
        })
      }).catch(() => {
      });
    },
    //显示新增界面
    handleAdd: function (index, row) {
      this.addFormVisible = true;
      this.addForm = {
        name: '',
        color: (this.chooseColor).replace(/#/, ''),
      }
      this.form.labels.push(this.addForm)
    },
    //提交新增
    addLabels: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          this.addFormVisible = false;
          this.$refs['addForm'].resetFields();
        }
      });
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.chooseColor = '#' + row.color
      this.editFormVisible = true;
      this.editForm = {
        name: row.name,
        color: (this.chooseColor).replace(/#/, ''),
      }
      this.form.labels[index] = this.editForm
      console.log(this.form.labels[index])
    },
    //提交编辑
    editLabels: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // let para = Object.assign({}, this.editForm);
          this.editFormVisible = false;
          this.$refs['editForm'].resetFields();
        }
      });
    },
    // submitUpload () {
    //   this.$refs.upload.submit();
    // },
    UploadImage (param) {
      let file = this.$refs.upload.uploadFiles[0].raw
      this.imageName = file.name
      // 通过DOM取文件数据
      let reader = new FileReader()
      let f = file
      reader.readAsDataURL(f)
      let that = this
      reader.onload = function (e) {
        let binary = e.target.result
        //上传文件
        let data = binary.match(/^data.*base64,(.*)/)[1]
        that.addImage.content = data
        let config = {
          "headers": {
            Accept: 'application/vnd.github.VERSION.base64'
          },
        }
        UploadImageApi(that.addImage, that.imageName, config).then(response => {
          console.log('上传图片成功')
          console.log(response)
          that.imgsrc = response.data.content.download_url
          that.form.body = `![](${that.imgsrc})`
          param.onSuccess()  // 上传成功的图片会显示绿色的对勾
          // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
        }).catch(response => {
          console.log('图片上传失败')
          param.onError()
        })
      }
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    removeLabels (tag) {
      this.form.labels.splice(this.form.labels.indexOf(tag), 1);
    },

    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    addLabels () {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.labels.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    imgAdd (pos, file) {
      this.$refs.md.$img2Url(pos, file.miniurl)
    },
    onSubmit () {
      if (this.token) {
        this.publish()
      }
    },
    publish () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitButton.loading = true
          this.submitButton.disabled = true
          createIssue(this.form).then((res) => {
            let result = res.data
            console.log(res);
            // console.log(JSON.stringify(result))
            if (res.status == '201') {
              this.$message({
                message: '发表成功',
                type: 'success'
              })
            }
            this.$router.push("/blog/details/" + result.number)
          }).then(() => {
            this.submitButton.loading = false
            this.submitButton.disabled = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
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
</style>