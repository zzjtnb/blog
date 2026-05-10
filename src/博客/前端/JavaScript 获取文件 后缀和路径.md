---
title: 'JavaScript 获取文件、后缀和路径'
description: 'JavaScript 获取文件、后缀和路径'
date: '2021-11-01 04:16:31'
updated: ''
category: '前端'
tags:
  - 'JavaScript'
cover: 'https://cdn.pixabay.com/photo/2021/08/27/12/18/forest-6578551_960_720.jpg'
hot: false
sourceId: 263
sourcePath: 'javascripthqwjhzhlj'
---
# JavaScript 获取文件、后缀和路径

```js
//获取文件名前面的路径
getPath = (path) => path.substring(0, path.lastIndexOf('/') + 1);

// 获取路径加文件名
getPathName = (path) => path.substring(0, path.lastIndexOf('.'));

//只获取文件名
getName = (path) => path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));

//获取文件名+后缀
getNameSuffix = (path) => path.substr(path.lastIndexOf('/') + 1);

// 只获取后缀名
getSuffix = (path) => path.substring(path.lastIndexOf('.') + 1);

// 获取 .后缀名
getDotSuffix = (path) => path.substring(path.lastIndexOf('.'));

let path = 'F:/Office/GitHub/DCS_World_Debugger/test/utrils.json';

console.log(getPath(path));
//F:/Office/GitHub/DCS_World_Debugger/test/
console.log(getPathName(path));
//F:/Office/GitHub/DCS_World_Debugger/test/utrils
console.log(getName(path));
//utrils
console.log(getNameSuffix(path));
//utrils.json
console.log(getSuffix(path));
//json
console.log(getDotSuffix(path));
//.json
```
