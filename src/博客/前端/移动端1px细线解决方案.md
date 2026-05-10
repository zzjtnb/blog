---
title: '移动端1px细线解决方案'
description: ':before, :after与transform'
date: '2019-11-13 19:09:33'
updated: ''
category: '前端'
tags:
  - 'CSS'
cover: 'https://images.unsplash.com/photo-1516865674991-9bb4878e3476?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
hot: false
sourceId: 100
sourcePath: 'ydd1pxxxjjfa'
---
:before, :after与transform

```css
.radius-border{
    position: relative;
}
@media screen and (-webkit-min-device-pixel-ratio: 2){
    .radius-border:before{
        content: "";
        pointer-events: none; /* 防止点击触发 */
        box-sizing: border-box;
        position: absolute;
        width: 200%;
        height: 200%;
        left: 0;
        top: 0;
        border-radius: 8px;
        border:1px solid #999;
        -webkit-transform(scale(0.5));
        -webkit-transform-origin: 0 0;
        transform(scale(0.5));
        transform-origin: 0 0;
    }
}
```
