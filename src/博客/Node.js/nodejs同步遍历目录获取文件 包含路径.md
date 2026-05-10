---
title: 'nodejs同步遍历目录获取文件(包含路径)'
description: '第一种 第二种'
date: '2020-08-05 10:52:57'
updated: '2021-05-27 20:14:40'
category: 'Node.js'
tags:
  - 'Node.js'
cover: 'https://images.unsplash.com/photo-1498354136128-58f790194fa7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
hot: false
sourceId: 175
sourcePath: 'nodejstbblmlhqwjbhlj'
---
# 第一种
```js
const fs = require('fs')
const path = require('path');

/**
 * 遍历目录里面的所有文件和目录 (同步)
 * @param {String} dir        目录名
 * @param {Function} callback  找到一个文件时的回调
 */
function eachFileSync(dir, callback) {
  fs.readdirSync(dir).forEach((filename) => {
    //获取当前文件的绝对路径
    const fielder = path.join(dir, filename)
    if (fs.statSync(fielder).isDirectory()) {
      eachFileSync(fielder, callback)
    } else {
      callback(filename)
    }
  })
}
/**
 * 列出目录下所有文件和目录 (同步)
 * @param {String} dir
 * @return {Array} Array
 */
function readSync(dir) {
const fileList = []
  eachFileSync(dir, (filename) => {
    fileList.push(filename)
  })
  return fileList;
};

module.exports = {
  readSync
}
```

# 第二种
```js
const fs = require('fs')
const path = require('path');

/**
 * 列出目录下所有文件和目录 (同步)
 *
 * @param {String} dir
 * @return {Array}
 */
function readSync(dir) {
  var files = [];
  eachFileSync(dir, (filename, stats) => {
    files.push(filename);
  });
  return files;
};

/**
 * 遍历目录里面的所有文件和目录 (同步)
 * @param {String} dir        目录名
 * @param {Function} findOne  找到一个文件时的回调
 */
function eachFileSync(dir, findOne) {
  var stats = fs.statSync(dir);
  // 遍历子目录
  if (stats.isDirectory()) {
    var files = fullPath(dir, fs.readdirSync(dir));
    // var files = fs.readdirSync(dir);
    //获取当前文件的绝对路径
    files.forEach((f) => {
      eachFileSync(f, findOne);
    });
  } else {
    findOne(dir, stats);
  }
}
/**
 * 将数组中的文件名转换为完整路径
 *
 * @param {String} dir
 * @param {Array} files
 * @return {Array}
 */
function fullPath(dir, files) {
  return files.map(function (f) {
    return path.join(dir, f);
  });
}
let data = readSync('../../../_posts')
console.log(data);
```
