# APG——Algorithm PlayGround

[![Gitter](https://badges.gitter.im/Algorithm-PlayGround/community.svg)](https://gitter.im/Algorithm-PlayGround/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![website](https://img.shields.io/badge/%20website-github.io-brightgreen)](https://sucicada.github.io/Algorithm-PlayGround)

[downloads](v)
一个有趣，智能和简单的HTML5游戏框架

简单的开发方式，将你的算法变成游戏

对PhaserCE库的封装开发

70+个函数接口可供使用，通过配置文件智能优化游戏

提供可视化的地图编辑方案


**使用说明: https://sucicada.github.io/Algorithm-PlayGround/#/**

----
2019/8/9 02:07 

整理接口文件,整理文档

## framework 2.3
2019/8/7 

## framework 2.2 
2019/8/4 23:28

<pre>
实现自动瓷砖贴图大小调整  不用手动处理图片 (高级功能, 精品功能, 原创功能)
实现对象的自定义属性 在地图映射表中
加入开场介绍, 支持配置文件自定义
添加音乐播放停止接口
添加按键停止检测
添加 textbitmap 型专用及系列功能数字显示对象, 无需素材图片 (原创)
添加全屏功能, 支持初始自动全屏
完成demo2 双向排序
优化部分接口
优化游戏配置文件, 映射表配置文件结构
重构地图生成器,  按照新配置文件结构
重构game主体引擎, 按照新配置文件结构
重构所有代码, 删除无用注释, 美化代码编写, 添加必要注释
</pre>
### 未处理:
<pre>
接口分类
接口集合整理并简化调用( 单独拿出, 不用绑定于RW下)
代码分成多个文件, 整理代码文件的结构
接口的详细api文档
更新地图使用说明,
添加游戏开发说明
整理程序调用关系

</pre>


<h2>framework 2.0</h2>2019/8/1 17:28
<pre>
实现音乐播放（无法测试，电脑什么声音都不出）
实现背景
实现瓷砖变换
实现人物转向
实现通关留言，并点击执行自定义函数（可以跳转网页）
实现背包系统

调整坐标记录规则，将地图内坐标定义为棋盘格坐标，加入相对绝对坐标转换（关联函数已经重构）
调整地图瓷砖强制为方形，对应修改地图生成器。


demo
完成出口自动变亮
</pre>

---
