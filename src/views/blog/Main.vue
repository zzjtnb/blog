<!--  -->
<template>
	<div class="bgcolor-fff lazyloaded section">
		<div class="container">
			<Labels :fatherMethod="getIssueList" @callFather="getIssueList" />
			<main class="site-main">
				<h3 class="section-title">
					<span>
						<i class="fa fa-list-alt"></i>
						<svg class="icon">
							<use xlink:href="#zuixinwenzhang_huaban" />
						</svg>
						<span>最新文章</span>
					</span>
				</h3>
				<el-row :gutter="24" class="row posts-wrapper" style="width: auto;">
					<el-col :xs="24" :lg="12" v-for="(item,index) in IssuesList" :key="index">
						<article class="post post-list">
							<div class="entry-media">
								<div class="placeholder">
									<a>
										<img class="lazyloaded" :src="getMainImage[index]" />
									</a>
								</div>
								<div class="entry-star">
									<a href="javascript:;" title="收藏文章" class="ripro-star">
										<svg class="icon">
											<use xlink:href="#xingxing" />
										</svg>
									</a>
								</div>
								<div class="entry-format">
									<svg class="icon">
										<use xlink:href="#tuku" />
									</svg>
								</div>
							</div>
							<div class="entry-wrapper">
								<header class="entry-header">
									<h2 class="entry-title" @click="goDetails(item.number)">
										<a>{{item.title}}</a>
									</h2>
									<div class="tools">
										<el-button @click="$share('/blog/details/'+item.number)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
										<el-button @click="editBlog(item.number)" style="padding: 3px 0" type="text" icon="el-icon-edit" v-if="token"></el-button>
										<el-button @click="deleteIssue(item.number)" style="padding: 3px 0" type="text" icon="el-icon-delete" v-if="token"></el-button>
									</div>
									<div class="entry-meta">
										<svg class="icon" v-if="item.labels">
											<use xlink:href="#biaoqian" />
										</svg>
										<label v-for="(items,index) in item.labels" :style="{background:`#${items.color}`}" :key="index">{{items.name}}</label>
									</div>
								</header>
								<div class="entry-excerpt u-text-format">
									<p v-html="getMainDes[index]"></p>
								</div>
								<div class="entry-footer">
									<a>
										<svg class="icon">
											<use xlink:href="#shijian" />
										</svg>
										{{getTime[index]}}
									</a>
									<a>
										<span>
											<svg class="icon">
												<use xlink:href="#yanjing" />
											</svg>
											<span>032</span>
										</span>
									</a>
									<a>
										<span>
											<svg class="icon">
												<use xlink:href="#xiaoxi" />
											</svg>
											<span>032</span>
										</span>
									</a>
								</div>
							</div>
						</article>
					</el-col>
				</el-row>
				<div style="text-align: center">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="Query.page" :page-size="Query.pageSize" layout="prev, pager, next" :total="Query.total" v-if="Query.pageNumber*Query.pageSize!=0&&Mobile" :hide-on-single-page="value"></el-pagination>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="Query.page" :page-sizes="[6, 20, 30, 40]" :page-size="Query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Query.total" v-if="Query.pageNumber*Query.pageSize!=0&&!Mobile" :hide-on-single-page="value"></el-pagination>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deleteIssue, searchIssues } from '@/api/issue'
import Labels from '../Labels/Labels';
export default {
  data () {
    return {
      value: true,
    }
  },
  created () {
    this.getIssueList();
  },
  mounted () {

  },
  computed: {
    ...mapGetters([
      'token',
      'Mobile',
      'IssuesList',
      'Query'
    ]),
    getMainImage () {
      let arr = [];
      for (let item of this.IssuesList) {
        if (this.$markdown(item.body).match(/\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/)) {
          arr.push(this.$markdown(item.body).match(/\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/)[1]);
        } else {
          arr.push('http://via.placeholder.com/200x200');
        }
      }
      return arr;
    },
    getMainDes () {
      let arr = [];
      for (let item of this.IssuesList) {
        arr.push(this.$markdown(item.body).replace(/<[^>]+>/g, "").substring(0, 200));
      }
      return arr;
    },
    getTime () {
      let arr = [];
      for (let item of this.IssuesList) {
        arr.push(this.$util.utcToLocalTime(item.updated_at));
      }
      return arr;
    }
  },
  methods: {
    editBlog (number) {
      if (!this.token) {
        this.$message({
          message: '请绑定有效的Token',
          type: 'warning'
        })
        return
      }
      this.$router.push('/blog/edit/' + number)
    },
    deleteIssue (number) {
      this.$confirm('是否永久删除该博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          "locked": true,
          "active_lock_reason": "resolved"
        }
        let config = {
          "headers": {
            Accept: 'application/vnd.github.sailor-v-preview+json'
          },
        }
        deleteIssue(data, number, config).then((result) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.$store.dispatch("SetQueryPageSize", val);
      this.$store.dispatch("SetQueryPageNumber", 1);
      this.getIssueList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.$store.dispatch("SetQueryPageNumber", val);
      this.getIssueList()
    },
    getIssueList (datas) {
      if (!datas) {
        var data = {
          q: `repo:zzjtnb/zzjtnb is:unlocked`,
          page: this.Query.pageNumber,
          per_page: this.Query.pageSize,
          sort: 'created',
          order: 'desc',
          direction: 'asc'
        }
        // console.log(datas);
      } else {
        var data = {
          q: `is:unlocked repo:zzjtnb/zzjtnb`,
          page: this.Query.pageNumber,
          per_page: this.Query.pageSize,
          sort: datas.sort,
          order: 'desc',
          direction: 'asc'
        }
      }
      this.$store.dispatch("SearchIssues", data);
    },
    goDetails (id) {
      this.$router.push("/blog/details/" + id)
    },
  },
  components: {
    Labels
  },
}
</script>

<style scoped>
/* 全站文章特色图版封面缩放效果 */

.entry-media a-img {
	max-width: 100%;
	-webkit-transition: all 444ms ease-in-out;
	-moz-transition: all 444ms ease-in-out;
	transition: all 444ms ease-in-out;
	-ms-flex-negative: 0;
	flex-shrink: 0;
}

.entry-media a:hover img,
.entry-media a:hover .entry-media a-img {
	-webkit-transform: scale(1.05);
	-moz-transform: scale(1.05);
	-ms-transform: scale(1.05);
	transform: scale(1.05);
}
/* 显示收藏 */
.post-grid:hover .entry-star,
.post-list:hover .entry-star {
	z-index: 99;
	visibility: visible;
	opacity: 1;
	transition: all 0.2s;
}
/* Hover卡片上移黑色盒子阴影 */
.post-list:hover,
.category-box:hover,
.vip-cell:hover {
	-webkit-box-shadow: 0 34px 20px -24px rgba(136, 161, 206, 0.3);
	box-shadow: 10px 6px 16px -5px rgba(0, 0, 0, 0.3);
	-webkit-transform: translateY(-5px);
	transform: translateY(-5px);
	-ms-transform: translateY(-5px);
}

/**
文章部分
 */
.icos {
	width: 0.7rem;
	height: 1rem;
}
.container {
	min-height: 1px;
	padding-left: 15px;
	padding-right: 15px;
	position: relative;
}
.entry-header .entry-meta {
	align-items: center;
	color: #aaa;
	display: flex;
	flex-wrap: wrap;
	font-size: 11px;
	letter-spacing: 0.2px;
	margin-bottom: 5px;
	text-transform: uppercase;
	text-align: center;
}
.entry-meta svg {
	float: left;
}
.entry-meta label {
	float: left;
	background: #00b1ff;
	color: #606266;
	padding: 0px 4px;
	margin-right: 10px;
	font-size: 12px;
	display: inline-block;
	max-width: 100%;
	border-radius: 6px;
}
.entry-title {
	clear: both;
}

.container {
	margin: 0 auto;
	max-width: 1090pt;
}
.section-title {
	font-size: 18px;
	font-weight: 500;
	letter-spacing: 0.2px;
	margin-bottom: 40px;
	position: relative;
	text-align: left;
	text-transform: uppercase;
}
.section-title:before {
	background-color: #e6e6e6;
	content: "";
	height: 1px;
	left: 0;
	margin-top: -1px;
	position: absolute;
	top: 50%;
	width: 100%;
}
.section-title span {
	background-color: #f6f6f6;
	padding: 4px 15px;
	position: relative;
	letter-spacing: 2px;
	font-weight: 600;
	background: #fff;
	border-radius: 4px;
}
.entry-header .entry-title {
	/* font-weight: normal; */
	margin-bottom: 0.65rem;
	margin-top: 0.65rem;
	font-size: 0.975rem;
	display: inline;
	padding-right: 50px;
}
.tools {
	text-align: right;
	display: inline;
}
/**
文章部分
 */

.posts-wrapper,
.navbar .menu-item-mega > .sub-menu {
	display: flex;
	flex-wrap: wrap;
	margin-left: -15px;
	margin-right: -15px;
}
.post-list {
	display: flex;
	margin-bottom: 30px;
	position: relative;
	padding: 10px;
	background: #ffffff;
	border-radius: 4px;
}
.post-list,
.category-box,
.vip-cell {
	transition: box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), -webkit-box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), -webkit-transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
	transform: translate(0, 0);
}
.entry-media {
	margin-bottom: 10px;
	position: relative;
}
.post-list .entry-media {
	flex-shrink: 0;
	margin-bottom: 0;
	margin-right: 20px;
	width: 220px;
}
.entry-media .placeholder {
	background-color: #ffffff;
	height: 0;
	overflow: hidden;
	padding-bottom: 75%;
	/* border-radius: 4px 4px 0 0; */
}
.entry-media a::before {
	bottom: 0;
	content: "";
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
	opacity: 0.33;
	-webkit-transition: all 1s ease 0s;
	-moz-transition: all 1s ease 0s;
	-o-transition: all 1s ease 0s;
	transition: all 1s ease 0s;
}
img {
	display: block;
	height: auto;
	max-width: 100%;
	vertical-align: middle;
}
.lazyloaded {
	opacity: 1;
	transition: opacity 1s cubic-bezier(0.77, 0, 0.175, 1);
}
.entry-media img {
	margin: 0 auto;
	width: 100%;
	overflow: hidden;
	max-width: 100%;
	height: 165px;
	-webkit-transition: all 444ms ease-in-out;
	-moz-transition: all 444ms ease-in-out;
	transition: all 444ms ease-in-out;
	-ms-flex-negative: 0;
	flex-shrink: 0;
}

.entry-star {
	display: block;
	border-radius: 50%;
	font-size: 15px;
	height: 25px;
	right: 10px;
	line-height: 25px;
	position: absolute;
	text-align: center;
	top: 10px;
	width: 25px;
	opacity: 0;
	visibility: hidden;
	background-color: #ffc107;
}
.ripro-star {
	color: #ffffff;
	border-color: #ffffff;
}
.entry-media a::before {
	bottom: 0;
	content: "";
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
	opacity: 0.33;
	-webkit-transition: all 1s ease 0s;
	-moz-transition: all 1s ease 0s;
	-o-transition: all 1s ease 0s;
	transition: all 1s ease 0s;
}
.entry-format {
	background-color: rgba(0, 0, 0, 0.4);
	border-radius: 50%;
	color: #fff;
	font-size: 15px;
	height: 25px;
	left: 10px;
	line-height: 25px;
	position: absolute;
	text-align: center;
	top: 10px;
	width: 25px;
}
article,
aside,
footer,
header,
nav,
section {
	display: block;
}
.entry-header {
	word-break: break-word;
}
.entry-excerpt {
	font-size: 13px;
	margin-top: 10px;
	color: #aaa;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	white-space: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	margin-bottom: 10px;
}
.entry-footer {
	display: flex;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.2px;
	margin-top: 10px;
	text-transform: uppercase;
}
.entry-footer a {
	position: relative;
	margin-right: 5px;
	color: #aaaaaa;
	padding: 4px 6px;
	border-radius: 4px;
	font-weight: 500;
	background: rgb(246, 246, 246);
	line-height: 1;
}
img {
	display: block;
	height: auto;
	max-width: 100%;
	vertical-align: middle;
}

.post-grid {
	margin-bottom: 30px;
	border: 1px solid #eee;
	border-radius: 4px;
	background-color: #fff;
	transition: box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), -webkit-box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), -webkit-transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
	transform: translate(0, 0);
}

.post-grid:hover {
	box-shadow: 0 34px 20px -24px rgba(136, 161, 206, 0.3);
	transform: translateY(-5px);
	-ms-transform: translateY(-5px);
}

.lazyloaded {
	opacity: 1;
	transition: opacity 1s cubic-bezier(0.77, 0, 0.175, 1);
}
.section {
	padding-bottom: 40px;
	background: url("/images/main/bg-2.png");
}
.bgcolor-fff {
	background-color: #fff;
}
@media (max-width: 767px) {
	.post-list .entry-media {
		width: 120px;
	}
	.entry-footer {
		display: none;
	}
	.entry-media .placeholder {
		padding-bottom: 100%;
	}
}
</style>

<style >
/* @media screen and (max-width: 750px) {
	.el-pagination {
		white-space: inherit;
		padding: 2px 5px;
		color: #303133;
		font-weight: 700;
	}
	.el-pagination .el-pagination__sizes {
		padding: 0 66px !important;
	}
	.el-pagination .btn-prev {
		padding-right: 0 !important;
	}
	.el-pager li {
		min-width: 30px;
	}
} */
</style>