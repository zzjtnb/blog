import SearchApi from '@/api/search'
const issues = {
  // 多个 state 的操作 , 使用 mutations 会来触发会比较好维护 , 那么需要执行多个 mutations 就需要用 action 了
  // 通过 store.state 来获取状态对象，以及通过 store.commit 方法触发状态变更
  state: {
    issuesList: [],
    query: {
      page: 1,
      pageSize: 6,
      pageNumber: 1,
      total: 0,
    },
  },
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    SET_ISSUESLIST: (state, value) => {//这里的state对应着上面这个state
      state.issuesList = value
    },
    SET_QUERY: (state, value) => {
      state.query = value
    },
    SET_QUERYPAGENUMBER: (state, value) => {
      state.query.pageNumber = value
    },
    SET_QUERYPAGESIZE: (state, value) => {
      state.query.pageSize = value
    },
    PUSH_ISSUESLIST: (state, value) => {
      // state.issuesList.push(value)
      state.issuesList = state.issuesList.concat(value)
    }
  },

  /**
    Action 类似于 mutation，不同在于：
      Action 提交的是 mutation，而不是直接变更状态。
      Action 可以包含任意异步操作。
   */
  // dispactch方法调用action,mapAactions方法调用action
  actions: {
    SetIssuesList ({ commit }, value) {
      commit('SET_ISSUESLIST', value)
    },
    PushIssuesList ({ commit }, value) {
      commit('PUSH_ISSUESLIST', value)
    },
    GetQuery ({ commit }, value) {
      commit('SET_QUERY', value)
    },
    SetQueryPageNumber ({ commit }, value) {
      commit('SET_QUERYPAGENUMBER', value)
    },
    SetQueryPageSize ({ commit }, value) {
      commit('SET_QUERYPAGESIZE', value)
    },
    SearchIssues ({ commit }, value) {
      SearchApi.searchIssues(value).then((res) => {
        let data = res.data.items
        commit('SET_ISSUESLIST', data)
        let query = {
          page: this.getters.Query.page,
          pageSize: this.getters.Query.pageSize,
          pageNumber: Math.ceil(res.data.total_count / this.getters.Query.pageSize),//向上取整
          total: res.data.total_count
        }
        commit('SET_QUERY', query)
      })
    }
  }
}

export default issues