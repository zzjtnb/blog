---
title: 'Vite、Vue3开发项目'
description: 'NPM npm查看某个依赖版本 npm添加依赖特定版本 npm升级某个依赖版本 npm升级项目所有依赖版本 项目搭建 创建项目 添加路由 添加vuex 添加typescript 初始化tsconfig.json 在项目根目录添加shim.d'
date: '2020-09-15 11:22:21'
updated: ''
category: '前端'
tags:
  - 'Vite'
  - 'Vue 3'
cover: 'https://cdn.pixabay.com/photo/2020/09/02/01/04/lighthouse-5537038_960_720.jpg'
hot: false
sourceId: 188
sourcePath: 'vitevue3kfxm'
---
# NPM
- npm查看某个依赖版本
```bash
npm info vue-router versions
```
- npm添加依赖特定版本
```bash
npm add vue-router@^4.0.0-beta.7
```
- npm升级某个依赖版本
```bash
npm update -g npm
```
- npm升级项目所有依赖版本
```bash
npm update
```

# 项目搭建
- 创建项目
```bash
npm init vite-app <project-name>
```
- 添加路由
```bash
npm add vue-router@^4.0.0-beta.7
```
- 添加vuex
```bash
npm add vuex@^4.0.0-beta.4
```
- 添加typescript
```bash
npm add typescript -D
```
- 初始化tsconfig.json
```bash
npx tsc --init
```
- 在项目根目录添加shim.d.ts文件
```ts
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
```
- 添加sass
```bash
npm add sass -D
```

- 添加axios
```bash
npm install axios
```
- 添加tailwindcss
```bash
npm install tailwindcss
```
[CDN](https://www.bootcdn.cn)

[谷歌字体](https://fonts.google.com)
[css.gg](https://css.gg)

# Vue 3.0
## Vue3.0官网
[Vue3.0官网](https://v3.vuejs.org/guide/installation.html#cli)
## Vue composition-api 中文
[Vue composition-api](https://composition-api.vuejs.org/zh/api.html)

## Vite 中文文档
[Vite 中文文档](https://vite-design.surge.sh/guide/chinese-doc.html)

## win10查看端口占用
+ 列出所有端口的情况，找到被占用的端口
```bash
netstat -ano
```
+ 输入下面命令找对应的PID
```bash
netstat -aon|findstr "3000"
 #pid:8392
```
+ 输入下面命令查找具体的占用进程
```bash
tasklist|findstr "8292" 
```
+ 如果想结束进程，可以使用(直接在任务管理器找到pid为8392的结束)
```bash
taskkill /f /t /im Code.exe
```
## ubuntu 查看端口占用

### Ubuntu查看端口使用情况，使用netstat命令：
+ 查看已经连接的服务端口（ESTABLISHED）

```bash
netstat -a
```
+ 查看所有的服务端口（LISTEN，ESTABLISHED）
```bash
netstat -ap
```
+ 查看指定端口，可以结合grep命令：
```bash
netstat -ap | grep 8080
```
### 也可以使用lsof命令：
```bash
lsof -i:8888
```
+ 若要关闭使用这个端口的程序，使用kill + 对应的pid
```bash
kill -9 PID号
```
ps：kill就是给某个进程id发送了一个信号。默认发送的信号是SIGTERM，而kill -9发送的信号是SIGKILL，即exit。exit信号不会被系统阻塞，所以kill -9能顺利杀掉进程。
