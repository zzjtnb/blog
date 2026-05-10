---
title: 'Node中的字符编码'
description: 'Base64/hex Base64与hex都是将二进制数据编码成字符串的编码方式，针对的是二进制字节而非字符串。 因此，要获得某个string的base64编码时，应该先得到string的二进制，再对二进制进行base6编码：'
date: '2020-08-07 18:43:00'
updated: '2021-05-27 20:14:26'
category: 'Node.js'
tags:
  - '编码'
cover: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
hot: false
sourceId: 177
sourcePath: 'nodezdzfbm'
---
# Base64/hex
Base64与hex都是将二进制数据编码成字符串的编码方式，针对的是二进制字节而非字符串。
因此，要获得某个string的base64编码时，应该先得到string的二进制，再对二进制进行base6编码：
```js
// 编码
const str = '哈哈'
let b = Buffer.from(str) // b中存的是哈哈的utf8编码二进制
let base64Code = b.toString('base64') // '5ZOI5ZOI'
// 解码
const code = '5ZOI5ZOI'
let str = Buffer.from('5ZOI5ZOI', 'base64') // '哈哈'
```
