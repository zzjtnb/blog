---
title: 'Vue深度选择器'
description: '父组件的 scoped 样式不能穿透到子组件上。 使用 vueloader 的写法。 有人用去掉 scoped 的方法解决，但这会污染全局样式，不可取。 使用 /deep/ 或者 解决 /deep/'
date: '2020-04-13 11:29:01'
updated: ''
category: '前端'
tags:
  - 'Vue'
cover: 'https://images.unsplash.com/photo-1530743373890-f3c506b0b5b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1406&q=80'
hot: false
sourceId: 144
sourcePath: 'vuesdxzq'
---
父组件的 scoped 样式不能穿透到子组件上。
使用 vue-loader 的写法。

有人用去掉 scoped 的方法解决，但这会污染全局样式，不可取。

使用 /deep/ 或者 >>> 解决

`/deep/`
```css
.child /deep/ span {
*some prop
}
```

`>>>`
```css
.child >>> span {
*some prop
}
```
