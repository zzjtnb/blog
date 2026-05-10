---
title: 'Vue记住账号密码'
description: 'html部分 js部分'
date: '2018-09-11 12:12:43'
updated: ''
category: '前端'
tags:
  - 'Vue'
cover: 'https://cdn.pixabay.com/photo/2020/06/16/20/36/balloon-5307204_960_720.jpg'
hot: false
sourceId: 25
sourcePath: 'vuejzzhmm'
---
html部分
```html
<div class="r-input-box">
  <i class="iconfont icon-yonghu"></i>
  <input type="text" placeholder="请输入用户名" v-model="username" />
  <i class="iconfont icon-shanchuguanbicha2" @click="username=''"></i>
</div>
<div class="r-input-box">
  <i class="iconfont icon-iconfontmima"></i>
  <input type="password" placeholder="请输入密码" v-model="password" />
  <i class="iconfont icon-biyan" @click="isSee($event)"></i>
</div>
<div style="color: #c4a8ac;font-size: 0.4rem;width: 71%;display: inline-block;">
  <input type="checkbox" id="checkbox" v-model="checked">记住密码
  <label for="checkbox">{{ checked }}</label>
</div>
<div class="send" @click="doLogin">提交</div>
```
js部分
```js
export default {
  data () {
    return {
      username: '',
      password: '',
      checked: false
    }
  },
  created () {
    let info = localStorage.getItem("info");
    if (info) {
      this.username = JSON.parse(info).name;
      this.password = JSON.parse(info).pwd;
    }
  },
  methods: {
    async doLogin () {
      if (res.code == 0) {
        if (this.checked == true) {
          this.remember()
        }
      }
    },
    remember () {
      localStorage.setItem("info", JSON.stringify({ 
       "name": this.username, "pwd": this.password})
     );
    }
  }
}
```
