---
title: 'SourceTree 3.0.17跳过注册'
description: '个人版本的跳过注册方式已经无效，需要下载企业版本下载地址：https://www.sourcetreeapp.com/enterprise首次点击msi进行安装 （当前最新版SourcetreeEnterpriseSetup3.0.17.m'
date: '2019-05-08 01:16:37'
updated: '2022-10-16 09:54:19'
category: 'Git'
tags:
  - 'SourceTree'
cover: 'https://cdn.pixabay.com/photo/2020/07/26/20/46/mountains-5440720_960_720.jpg'
hot: false
sourceId: 62
sourcePath: 'sourcetree3017tgzc'
---
个人版本的跳过注册方式已经无效，需要下载企业版本下载地址：https://www.sourcetreeapp.com/enterprise首次点击msi进行安装 （当前最新版SourcetreeEnterpriseSetup_3.0.17.msi）
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/SourceTree%20Setup.png)
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/Sourcetree%20Accept.png)
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/SourceTree%20Choose.png)
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/SourceTree%20Install.png)
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/SourceTree%20Fnish.png)
然后找到在 `%programfiles(x86)%\Atlassian\Sourcetree` 目录下找到SourceTree.exe 运行后会出现注册界面
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/SourceTree%20Regis.png)
关掉sourcetree 打开`%LocalAppData%\Atlassian\SourceTree`新建文件：
# accounts.json
内容代码：
```json
[ {  
	"$id": "1",
	  "$type": "SourceTree.Api.Host.Identity.Model.IdentityAccount, SourceTree.Api.Host.Identity",
	  "Authenticate": true,
	  "HostInstance": {   
		"$id": "2",
		   "$type": "SourceTree.Host.Atlassianaccount.AtlassianAccountInstance, SourceTree.Host.AtlassianAccount",
		   "Host": {    
			"$id": "3",
			    "$type": "SourceTree.Host.Atlassianaccount.AtlassianAccountHost, SourceTree.Host.AtlassianAccount",
			    "Id": "atlassian account"   
		},
		   "BaseUrl": "https://id.atlassian.com/"  
	},
	  "Credentials": {   
		"$id": "4",
		   "$type": "SourceTree.Model.BasicAuthCredentials, SourceTree.Api.Account",
		   "Username": "",
		   "Email": null  
	},
	  "IsDefault": false 
}]
```

如图：
![](https://raw.githubusercontent.com/zzjtnb/static/master/images/zzjtnb/SourceTree%20Accounts.png)
然后在运行`%programfiles(x86)%\Atlassian\Sourcetree\SourceTree.exe`即可



Mac使用sourcetree跳过注册
打开sourcetree
关闭sourcetree
命令终端输入
`defaults write com.torusknot.SourceTreeNotMAS completedWelcomeWizardVersion 3
`
打开sourcetree即可跳过登录
