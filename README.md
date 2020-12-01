git关联仓库、拉取代码、提交代码完整流程
1. 本地项目上传到gitlab上指定项目地址
在项目里面打开点击右键 git bash here

//通过命令把这个目录变成git可以管理的仓库：
git init 

//关联到远程库，这里的远程仓库选择Clone with HTTPS的地址。
git remote add origin https://github.com/deepthan/Angular-demo.git

//把文件添加到版本库中，添加到暂存区里面去，不要忘记后面的小数点“.”，意为添加文件夹下的所有文件
git add .

//告诉Git，把文件提交到本地仓库。引号内为提交说明
git commit -m 'creat project'

//拉取文件合并冲突
git pull  https://github.com/deepthan/Angular-demo.git master --allow-unrelated-histories

//出错fatal: refusing to merge unrelated histories
git pull origin master --allow-unrelated-histories

// 本地库的内容推送到远程
git push origin master


注意： 如果推送到远程报错了说明你本地有文件，就先拉在推，再合并冲突并提交到本地，再推送到远程

git pull  https://github.com/deepthan/Angular-demo.git master
// 再处理 本地冲突文件
git commit -m 'creat project'
git push origin master