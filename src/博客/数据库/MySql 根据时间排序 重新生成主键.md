---
title: 'MySql 根据时间排序，重新生成主键'
description: '表名:blog 步骤如下: 1. 复制 blog 结构 2. 重置 blogcopy 表，主键递增值截断表清空数据 3. 使用 insert into select 语句，从 blog 表根据时间排序搜索，插入 blogcopy 4. 检查'
date: '2020-09-15 16:12:32'
updated: '2020-12-08 22:22:32'
category: '数据库'
tags:
  - 'MySQL'
cover: 'https://cdn.pixabay.com/photo/2017/07/19/01/41/clouds-2517653_960_720.jpg'
hot: false
sourceId: 189
sourcePath: 'mysqlgjsjpxzxsczj'
---
表名:blog

步骤如下:

1.  复制 blog 结构
2.  重置 blog_copy 表，主键递增值(截断表清空数据)
3.  使用 insert into select 语句，从 blog 表根据时间排序搜索，插入 blog_copy 
4.  检查数据，删除 blog  blog_copy 为 blog 表

例子(记得不要 select 原来的主键 id):

```sql
INSERT INTO blogs_copy(title,path,sort,tags,img,content,hot,pageviews,created,updated) SELECT title,path,sort,tags,img,content,hot,pageviews,created,updated FROM `blogs` ORDER BY created
```
