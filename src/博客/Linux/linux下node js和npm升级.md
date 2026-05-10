---
title: 'linux下node.js和npm升级'
description: 'linux下node.js和npm升级 ==== Node Node.js的开发非常活跃, 它的最新稳定版本也频繁变化, 你不时会发现, 一个模块不能在你当前的Node版本上使用, 此时你需要升级Node 幸运的是, 可以用一种非常简单的方'
date: '2018-06-13 12:02:11'
updated: ''
category: 'Linux'
tags:
  - 'Linux'
cover: 'https://cdn.pixabay.com/photo/2016/04/20/19/47/wolf-1341881_960_720.jpg'
hot: false
sourceId: 5
sourcePath: 'linuxxnodejshnpmsj'
---
linux下node.js和npm升级
====

# Node

# Node.js的开发非常活跃, 它的最新稳定版本也频繁变化, 你不时会发现, 一个模块不能在你当前的Node版本上使用, 此时你需要升级Node

# 幸运的是, 可以用一种非常简单的方法来管理你的Node版本, 即使用Node Binary管理模块"n".

## 1. 检查 Node的当前版本, 使用命令

```bash
node -v  

```

## 2. 清除npm cache

```bash
sudo npm cache clean -f   
```

## 3. 安装n模块

```bash
sudo npm install -g n    

```

## 4. 升级到最新版本(该步骤可能需要花费一些时间)

 你可以制定一个受欢迎的版本, 比如

```bash
sudo n 0.8.11   
```

或者你也可以告诉管理器, 安装最新的稳定版本

```bash
sudo n stable  
```

## 5. 查看Node的版本, 检查升级是否成功

```bash
node -v  

```
如果得到的版本信息不正确, 你可能需要重启机器

# NPM

## 1. 检查npm的当前版本, 使用命令

```bash
npm-v  
```

## 2. npm版本更新

```
sudo npm install -g npm
```
