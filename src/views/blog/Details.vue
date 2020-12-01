<!--  -->
<template>
	<div class="container">
		<!-- <Breadcrumb></Breadcrumb> -->
		<article class="article-content">
			<!-- <div v-html="getMainDes"></div> -->
			<!-- <mavon-editor :ishljs="true" codeStyle="monokai-sublime" v-html="blog.content"></mavon-editor> -->
			<mavon-editor :ishljs="true" :codeStyle="true" codeStyle="agate" v-html="blog.content"></mavon-editor>
		</article>
	</div>
</template>

<script>
import { getIssues } from '@/api/issue'
import Breadcrumb from '../../components/Breadcrumb';
export default {
  data () {
    return {
      content: {},
      id: this.$route.params.id,
      blog: {
        id: '',
        title: '',
        content: '',
        description: ''
      },
    }
  },
  created () {
    getIssues(this.id).then((res) => {
      this.content = res.data
      this.blog['content'] = this.$markdown(res.data.body)
    })
  },
  mounted () {

  },
  methods: {

  },
  computed: {
    getMainDes () {
      let a = this.content.body;
      if (typeof a !== 'undefined' && a !== 'null') {//解决marked出现参数为空的问题，实际a有值，但不加这判断就报错
        return this.$markdown(a);
      }
    },
    // getTime () {
    //   return friendlytimejs.FriendlyTime(dayjs(this.content.updated_at).add(8, "hour").format('YYYY-MM-DD HH:mm:ss'), dayjs());
    // }
  },
  components: {
    Breadcrumb
  },
}
</script>

<style scoped>
.container {
	max-width: 1440px;
	margin: 0 auto;
	height: auto !important;
	padding-top: 60px;
}

.article-content {
	border-radius: 4px;
	background-color: #fff;
	word-wrap: break-word;
	/* padding: 20px; */
}
.v-note-wrapper {
	z-index: 0;
}
</style>