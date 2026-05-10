---
title: 'js屏蔽手机返回键'
description: ''
date: '2020-02-21 11:01:50'
updated: ''
category: '前端'
tags:
  - 'JavaScript'
cover: 'https://images.unsplash.com/photo-1480775292373-5175d0634811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
hot: false
sourceId: 122
sourcePath: 'jspbsjfhj'
---
```js
       pushHistory();
    window.addEventListener("popstate", function (e) {
         pushHistory();

        var dialog1 = $(document).dialog({
            type: 'confirm',
            closeBtnShow: true,
            overlayClose: true,
            content: '<div><p>恭喜获得客服指导一次，点击添加客服微信</p><p style="font-size:22px;text-align: center;color: red; ">立刻添加微信</p></div>',
            onClickConfirmBtn: function () {
                window.location.href = 'weixin://';
             // layer.closeAll();
            }
        });

    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: "./"
        };
        window.history.pushState(state, "title", "./");
    }
```
