---
title: 'Vue中对数值进行保留小数点后两位的处理（两种情况）'
description: 'Html部分: Js部分:'
date: '2018-08-16 16:07:47'
updated: ''
category: '前端'
tags:
  - 'Vue'
cover: 'https://cdn.pixabay.com/photo/2013/05/12/18/55/balance-110850_960_720.jpg'
hot: false
sourceId: 20
sourcePath: 'vuezdszjxblxsdhlwdcllzqk'
---
Html部分:

```html
<div class="text primary-text">
  < span> 合计： < /span>
      < span class="money"> ￥{ { totalMoney | numFilter } } < /span>
</div>
```

Js部分:

```js
// 保留小数点后两位的过滤器, 尾数四舍五入
filters: {
  numFilter(value) {
    // 截取当前数据到小数点后两位
    let realVal = Number(value).toFixed(2)
    // num.toFixed(2)获取的是字符串
    return Number(realVal)
  }
}
```

```js
// 保留小数点后两位的过滤器，尾数不四舍五入
filters: {
  numFilter(value) {
    // 截取当前数据到小数点后三位
    let transformVal = Number(value).toFixed(3)
    let realVal = transformVal.substring(0, transformVal.length - 1)
    // num.toFixed(3)获取的是字符串
    return Number(realVal)
  }
}
```
