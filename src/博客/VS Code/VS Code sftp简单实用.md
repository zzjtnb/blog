---
title: 'VS Code sftp简单实用'
description: 'FTP模式配置'
date: '2021-04-25 06:32:11'
updated: ''
category: 'VS Code'
tags:
  - 'SFTP'
cover: 'https://cdn.pixabay.com/photo/2021/05/22/03/39/lotus-6272501_960_720.jpg'
hot: false
sourceId: 231
sourcePath: 'vscodesftpjdsy'
---
# FTP模式配置
```json
{
  "name": "测试",
  "host": "0.0.0.0",
  "protocol": "ftp",
  "port": 21,
  "secure": false,
  "username": "test",
  "password": "test",
  "remotePath": "/",
  "uploadOnSave": true,
  "ignore": [
    ".vscode",
    ".git"
  ]
}
```
