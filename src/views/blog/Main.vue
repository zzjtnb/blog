/* eslint-disable no-tabs */
<template>
	<div style="min-height: 600px" v-loading="loading">
		<el-card shadow="never" style="margin-bottom: 20px">
			<el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
			<!-- <input id="searchData" type="text" placeholder="搜索一下" name="word" @keyup="listenWords" v-model="searchKey" /> -->
			<el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
			<el-button @click="$share()" style="margin-left: 10px" icon="el-icon-share" type="warning" plain circle></el-button>
			<el-button type="primary" icon="el-icon-edit" round plain style="float: right;" @click="goAdd">写博文</el-button>
		</el-card>
		<div v-if="blogs&&blogs.length>0">
			<el-card shadow="hover" v-for="(item,index) in blogs" :key="'p'+index" style="margin-bottom: 20px" v-if="!item.hide">
				<div slot="header">
					<el-row>
						<el-col :span="16">
							<span>
								<a style="text-decoration:none;cursor:pointer" @click="goDetails(item.id)">
									<i class="el-icon-edit-outline"></i>
									&nbsp;&nbsp; {{item.title}}
								</a>
							</span>
						</el-col>
						<el-col :span="8">
							<div style="text-align: right;">
								<el-button @click="$share('/user/blog/details/'+item.id)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
								<el-button @click="editBlog(index)" style="padding: 3px 0" type="text" icon="el-icon-edit" v-if="token"></el-button>
								<el-button @click="deleteBlog(index)" style="padding: 3px 0" type="text" icon="el-icon-delete" v-if="token"></el-button>
							</div>
						</el-col>
					</el-row>
				</div>
				<div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">最近更新 {{item.updateTime}}</div>
				<div style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 10px 0px 0px 0px">{{item.description}}</div>
			</el-card>
			<div style="text-align: center">
				<!-- <el-pagination @current-change="list" background layout="prev, pager, next" :current-page.sync="query.page" :page-size="query.pageSize" :total="total" :hide-on-single-page="HidePageValue" v-if="query.pageNumber*query.pageSize!=0">
				</el-pagination>-->
				<!-- <span class="demonstration">完整功能</span>
        <el-pagination @size-change="handleSizeChange" @current-change="list" :current-page.sync="query.page" :page-sizes="[5, 20, 30, 40]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="query.pageNumber*query.pageSize" v-if="query.pageNumber*query.pageSize!=0">
				</el-pagination>-->
				<el-pagination @size-change="handleSizeChange" @current-change="list" :current-page.sync="query.page" :page-sizes="[5, 20, 30, 40]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="query.pageNumber*query.pageSize" v-if="query.pageNumber*query.pageSize!=0"></el-pagination>
			</div>
		</div>
		<el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-if="!blogs||blogs.length==0">
			<font style="font-size: 30px;color:#dddddd ">
				<b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
			</font>
		</el-card>
	</div>
</template>
<script>
import {mapGetters} from "vuex";
import GistApi from "@/api/gist";
export default {
	data() {
		return {
			query: {
				page: 1,
				pageSize: 5,
				pageNumber: 1,
			},
			loading: false,
			searchKey: "",
			HidePageValue: false,
			blogs: [],
			BlogData: [],
			allBlogs: [],
			total: 0,
			pageNumber: 0,
		};
	},
	computed: {
		...mapGetters(["token"]),
	},
	created() {
		this.query.page = this.getContextData("page") || 1;
		this.query.pageSize = this.getContextData("pageSize") || 5;
		if (!this.getContextData("BlogData")) {
			this.allList();
		}
	},
	mounted() {
		this.list();
	},
	methods: {
		allList() {
			this.BlogData = [];
			this.loading = true;
			let allQuery = {page: 1, pageSize: 500};
			GistApi.allList(allQuery)
				.then(response => {
					let result = response.data;
					for (let i = 0; i < result.length; i++) {
						for (let key in result[i].files) {
							let data = {};
							data["title"] = key;
							data["url"] = result[i].files[key];
							data["description"] = result[i]["description"];
							data["id"] = result[i]["id"];
							data["createTime"] = this.$util.utcToLocal(result[i]["created_at"]);
							data["updateTime"] = this.$util.utcToLocal(result[i]["updated_at"]);
							data["hide"] = false;
							this.BlogData.push(data);
							this.setContextData("BlogData", this.BlogData);
							break;
						}
					}
				})
				.then(() => (this.loading = false));
		},
		search() {
			this.blogs = this.getContextData("BlogData");
			for (let i = 0; i < this.blogs.length; i++) {
				this.blogs[i].hide = this.blogs[i].title.toUpperCase().indexOf(this.searchKey.toUpperCase()) < 0;
			}
			this.query.pageSize = 1;
			this.query.pageNumber = 0;
		},
		handleSizeChange(val) {
			this.query.page = 1;
			this.query.pageSize = val;
			// this.total = this.query.pageNumber * this.query.pageSize
			console.log(`每页 ${val} 条`);
			this.list();
		},
		list() {
			this.blogs = [];
			this.loading = true;
			this.setContextData("page", this.query.page);
			this.setContextData("pageSize", this.query.pageSize);
			GistApi.list(this.query)
				.then(response => {
					let result = response.data;
					this.pageNumber = this.$util.parseHeaders(response.headers);
					console.log(" this.pageNumber=" + this.pageNumber);
					if (this.pageNumber) {
						this.query.pageNumber = this.pageNumber;
					}
					for (let i = 0; i < result.length; i++) {
						for (let key in result[i].files) {
							let data = {};
							data["title"] = key;
							data["url"] = result[i].files[key];
							data["description"] = result[i]["description"];
							data["id"] = result[i]["id"];
							data["createTime"] = this.$util.utcToLocal(result[i]["created_at"]);
							data["updateTime"] = this.$util.utcToLocal(result[i]["updated_at"]);
							data["hide"] = false;
							this.blogs.push(data);
							break;
						}
					}
				})
				.then(() => (this.loading = false));
		},
		editBlog(index) {
			if (!this.token) {
				this.$message({
					message: "请绑定有效的Token",
					type: "warning",
				});
				return;
			}
			this.$router.push("/user/blog/edit/" + this.blogs[index].id);
		},
		deleteBlog(index) {
			this.$confirm("是否永久删除该博客?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				let blog = this.blogs[index];
				GistApi.delete(blog.id).then(result => {
					this.$message({
						message: "删除成功",
						type: "success",
					});
					this.blogs.splice(index, 1);
				});
			});
		},
		goAdd() {
			if (!this.token) {
				this.$message({
					message: "请绑定有效的Token",
					type: "warning",
				});
				return;
			}
			this.$router.push("/user/blog/add");
		},
		goDetails(id) {
			this.$router.push("/user/blog/details/" + id);
		},
		// 给sessionStorage存值
		setContextData: function(key, value) {
			if (typeof value === "string") {
				sessionStorage.setItem(key, value);
			} else {
				sessionStorage.setItem(key, JSON.stringify(value));
			}
		},
		// 从sessionStorage取值
		getContextData: function(key) {
			const str = sessionStorage.getItem(key);
			if (typeof str === "string") {
				try {
					return JSON.parse(str);
				} catch (e) {
					return str;
				}
			}
		},
		// 回车搜索
		listenWords: function(event) {
			console.log("listen keyup");
			var that = this;
			var searchInput = document.getElementById("searchData");
			event = window.event || event;
			if (event.keyCode == 13) {
				// enter
				event.preventDefault();
				that.search();
			}
			if (event.keyCode == 8) {
				// backspace
				console.log(searchInput.value.length);
				if (searchInput.value.length == 0) {
					searchInput.blur();
					searchInput.focus();
				}
			}
		},
	},
};
</script>
