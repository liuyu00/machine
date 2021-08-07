1，git init 初始化仓库

2，git add path|* 将一个或者多个文件添加到仓库
3，git commit -m '描述' 将文件保存到仓库做记录

4, git log 查看提交记录
   git reflog 查看完整提交记录

5，git reset --hard  版本穿梭

  上一个版本 git reset --hard HEAD^           HEAD^^    HEAD~10
  指定版本 git reset --hard <commitId>

6，git status 查看工作区的修改状态
