<template>
	<div style="background: #F2F6FC;min-height: 700px">
		<van-nav-bar style="position:fixed;top:0;z-index: 9999; box-shadow: 0px -3px 10px #888888;width: 100%;" title="博客列表" right-text="分享" @click-right="$mobileShare()" />
		<div style="height: 60px;"></div>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-list v-model="isLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="offset" :immediate-check="false" class="content">
				<router-link :to="`/mobile/user/blog/details/${item.id}`" v-for="(item,index) in blogs" :key="'p'+index">
					<van-panel style="margin-bottom: 5px" :title="item.title" :desc="'更新时间 '+item.updateTime">
						<div style="padding: 0px 15px 5px 15px;color: #606266;font-size: 0.9rem">{{item.description}}</div>
					</van-panel>
				</router-link>
			</van-list>
		</van-pull-refresh>
		<div style="height: 100px;"></div>
	</div>
</template>

<script>
import GistApi from "@/api/gist";
export default {
	data() {
		return {
			query: {
				page: 1,
				pageSize: 20,
				pageNumber: 1,
			},
			searchKey: "",
			blogs: [],
			isLoading: false,
			finished: false,
			offset: 15,
		};
	},
	mounted() {
		this.list();
	},
	methods: {
		/**
		 *  下拉刷新方法
		 */
		onRefresh() {
			// 调用请求数据方法
			this.list();
		},
		/**
		 *  上拉加载方法
		 *  页面打开时初始化会调用onLoad方法 如果想去掉初始化调用使用,给List添加属性immediate-check=false
		 */
		onLoad() {
			// 调用请求数据方法
			this.query.page += 1;
			this.list();
		},
		list() {
			this.$toast.loading({
				duration: 0,
				forbidClick: true,
				message: "加载中",
			});

			GistApi.list(this.query)
				.then(response => {
					let result = response.data;
					let pageNumber = this.$util.parseHeaders(response.headers);
					if (pageNumber) {
						this.query.pageNumber = pageNumber;
					}
					if (result.length == 0) {
						return;
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
					// this.query.page++
				})
				// .then(() => this.$toast.clear())

				.then(() => {
					this.$toast.clear();
					this.isLoading = false;
				});
		},
		search() {
			for (let i = 0; i < this.blogs.length; i++) {
				this.blogs[i].hide = this.blogs[i].title.indexOf(this.searchKey) < 0;
			}
		},
		goDetails(id) {
			console.log(id);
			this.$router.push("" + id);
		},
	},
};
</script>
