---
title: '利用js实现 禁用浏览器后退'
description: ''
date: '2019-10-23 16:50:51'
updated: ''
category: '前端'
tags:
  - 'JavaScript'
cover: 'https://cdn.pixabay.com/photo/2020/06/14/15/45/beach-bar-5298364_960_720.jpg'
hot: false
sourceId: 89
sourcePath: 'lyjssxjyllqht'
---
```js
 <script language="javascript">
    //防止页面后退
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
   });
 </script>
```
