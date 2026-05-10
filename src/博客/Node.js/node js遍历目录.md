---
title: 'node.js遍历目录'
description: '同步遍历 异步遍历'
date: '2020-08-02 22:24:12'
updated: '2021-05-27 20:14:47'
category: 'Node.js'
tags:
  - 'Node.js'
cover: 'https://images.unsplash.com/photo-1499088513455-78ed88b7a5b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1271&q=80'
hot: false
sourceId: 174
sourcePath: 'nodejsblml'
---
# 同步遍历
```js
const fs = require('fs');
const path=require('path');
function travel(dir,callback){
    fs.readdirSync(dir).forEach((file)=>{
        var pathname=path.join(dir,file)
        if(fs.statSync(pathname).isDirectory()){
            travel(pathname,callback)
        }else{
            callback(pathname)
        }
    })
}
travel('F:/HTML/Node/test',function(pathname){
    console.log(pathname)
})
```
# 异步遍历
```js
const fs = require('fs');
const path=require('path');
function travel(dir,callback){
    fs.readdir(dir,(err,files)=>{
        if(err){
            console.log(err)
        }else{
            files.forEach((file)=>{
                var pathname=path.join(dir,file)
                fs.stat(pathname,(err,stats)=>{
                    if(err){
                        console.log(err)
                    }else if(stats.isDirectory()){
                        travel(pathname,callback)
                    }else{
                        callback(pathname)
                    }
                })
            })
        }
    })
}
travel('F:/HTML/Node/test',function(pathname){
    console.log(pathname)
})
```
