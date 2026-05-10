---
title: 'CSS清除浮动'
description: '在float的父元素添加clearfix html css'
date: '2020-04-10 09:50:16'
updated: ''
category: '前端'
tags:
  - 'CSS'
cover: 'https://images.unsplash.com/photo-1518008931783-51b25ba2ccc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
hot: false
sourceId: 140
sourcePath: 'cssqcfd'
---
### 在float的父元素添加clearfix


html
```html
<div class="ly clearfix">
  <img src="/images/Heroes/picture/pic.jpg" width="71" height="77" />
</div>
```
css
```css
.ly img {
  margin-right: 24px;
  float: right;
}
.clearfix::after,
.clearfix::before {
  content: "";
  display: table;
}
.clearfix::after {
  clear: both;
}
.clearfix {
  zoom: 1;
}
```
