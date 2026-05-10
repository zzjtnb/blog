---
title: 'CSS两端对齐'
description: 'html css 使用justifycontent:spacebetween boxpack是css3的新属性，依赖于display:box旧版弹性布局，受boxorient影响，boxpack决定了子标签水平对齐的方式，可选值有start'
date: '2020-04-09 17:33:40'
updated: ''
category: '前端'
tags:
  - 'CSS'
cover: 'https://images.unsplash.com/photo-1505235687559-28b5f54645b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjQzMzEwfQ&auto=format&fit=crop&w=1490&q=80'
hot: false
sourceId: 139
sourcePath: 'csslddq'
---
html
```html
<div class="entry-wrapper">
  <h2 class="entry-title">
    <a>
      CSS两端对齐
    </a>
  </h2>
  <div class="tools">
    <button type="button">
      <span>
        分享
      </span>
    </button>
    <button type="button">
      <span>
        编辑
      </span>
    </button>
    <button type="button">
      <span>
        删除
      </span>
    </button>
  </div>
  <div class="entry-excerpt u-text-format">
    <p>
      CSS两端对齐
    </p>
  </div>
  <div class="entry-footer">
    <a>
      最近更新:2020-04-09 17:33:41
    </a>
  </div>
</div>
```
css
```css
.entry-header {
	display: flex;
	justify-content: space-between;
}
```
使用justify-content:space-between

box-pack是css3的新属性，依赖于display:box(旧版弹性布局)，受box-orient影响，box-pack决定了子标签水平对齐的方式，可选值有start | end | center | justify。使用box-pack:justify来实现两端对齐非常简单，代码量也少。为了向前看齐，把display:flex(新版弹性布局)也一起写进去~

如果是做基于webkit内核的webapp开发和winphone IE10及以上，那么一切都好办~
