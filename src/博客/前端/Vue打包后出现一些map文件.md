---
title: 'Vue打包后出现一些map文件'
description: '问题： 可能很多人在做vue项目打包，打包之后js中，会自动生成一些map文件，怎么把它去掉不要呢？ 运行 cnpm run build 开始打包后会在项目目录下自动创建dist目录，打包好的文件都在其中 解决办法：去config/inde'
date: '2020-04-07 23:10:03'
updated: ''
category: '前端'
tags:
  - 'Vue'
cover: 'https://images.unsplash.com/photo-1478034460338-249ef2da6c0f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjQzMzEwfQ&auto=format&fit=crop&w=1953&q=80'
hot: false
sourceId: 137
sourcePath: 'vuedbhcxyxmapwj'
---
问题： 可能很多人在做vue项目打包，打包之后js中，会自动生成一些map文件，怎么把它去掉不要呢？
运行 cnpm run build 开始打包后会在项目目录下自动创建dist目录，打包好的文件都在其中
解决办法：去config/index.js中改一个参数：
productionSourceMap:false
把这个改为false。不然在最终打包的文件中会出现一些map文件

map文件的作用：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
