---
title: '使用 Line-Height 垂直居中图片'
description: '使 lineheight 可以实现图片的垂直居中，只需要在包含图片的父元素上设置 lineheight 然后为图片设置 verticalalign: middle。 HTML CSS'
date: '2020-02-25 19:42:00'
updated: ''
category: '前端'
tags:
  - 'CSS'
cover: 'https://images.unsplash.com/photo-1532787799187-93655e51d472?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80'
hot: false
sourceId: 123
sourcePath: 'sylineheightczjztp'
---
使 line-height 可以实现图片的垂直居中，只需要在包含图片的父元素上设置 line-height 然后为图片设置 vertical-align: middle。

# HTML

```html
<div id="parent">
    <img src="image.png" alt="" />
</div>
```

# CSS

```css
#parent { 
    line-height: 200px;
}

#parent img {
    vertical-align: middle;
}
```
