# APG (Algorithm PlayGround)

## 更新记录
8/10
+ 虚空碰撞检测
+ 背包系统更新.
+ `APG.Sprite.addSprite`增加`frameId`自定义属性

8/9
+ sprite 动态属性增加 imgMode
+ textbitmap 添加默认空字符串和默认黑色

8/4
+ 解决贴图大小问题
+ 更新地图生成器


## 名词
+ phaser
+ textbitmap
+ MapArea 和 游戏窗体的关系
+ BagSystem
+ tileMap
+ sprite
+ textbitmap
+ spritesheet
+ Layers
    + TileLayer 
    + TargetLayer
    + CharacterLayer
+ mapId
+ tileId

+ Group
+ 

## 要点
+ group名和内部sprite的keyName一样



## 问题记录
+ 对于tile边长不同的tileset贴图, 和tilemap, 无法使得tile图片缩放到tile大小.
    + (已解决)

+ net::ERR_BLOCKED_BY_CLIENT
    + 解决方法: https://www.cnblogs.com/wenzheshen/p/7724065.html<br>
        关闭广告过滤插件    
    + 待解决
+ 地图生成器生成的文件名的 小时显示NAN

+ config.js中的spritesImg 中的imgKey意义不明
+ README界面 换行目前还不支持中文,
    + 已解决

使用hbuilderX 进行运行, hbuilderX内置服务器会在html中加入一些js标签,
APG中为了自动加载APG相关js库文件,会读取html中js标签的src属性, hbuilderX的js标签没有src属性,所以会出错.


windows10 chrome   blockGroupOverlap的砖块碰撞检测部分失效
错误原因: 两个物体的碰撞检测的坐标使用的是绝对坐标以及从相对坐标转换之后的绝对坐标,坐标是浮点数,在精度上可能存在偏差,这和电脑,浏览器,内存等相关, 一个是935.5636363636366 另一个是935.56363636363669 相差很小但是不相等,所以认为没有碰撞.
改正: 碰撞检测的坐标都改用相对棋盘坐标, 减小高精度存在的误差-



### 编辑完成了地图配置文件，游戏配置文件
----
+ phaser-2.13.2.js:81353 Phaser.Loader - json[mazajson]: Unexpected token < in JSON at position 0
	+ 解决：config.js 中tileMapJson中的文件名没有加	.json后缀

+ Uncaught (in promise) DOMException
+ phaser-2.13.2.js:78015 Phaser.Cache.getTilemapData: Key "Tilemap" not found in Cache.
+ Phaser.Tilemap.addTilesetImage: Invalid image key given: "maza"
	+ 原因：autoResizeImg 加载资源，由于异步运行不可控，导致加载完成发生在调用资源之后。

+ 游戏开始README介绍界面，文字没有自动换行
	+ 已经解决
+ 地图大小需要严格调整，因为地图区域空白的部分也计算在内
+ 内存占用较高
+ 导入一存储地图时，鼠标左键没有被释放
+ new_file 44行出错（在生成地图自定义文件时，如果给地图上不存在的元素自定义属性会出错）
	+ 已经解决	

### 开始编写游戏脚本
---
+ Uncaught TypeError: getSpriteList is not a function
	+ mymathod.js在sprite.js加载之前已经被加载
+ 数字块需要添加边以至于以明显分割每一个块

### 背包系统
+ 放置信标始终在左上角
    + APG.Sprite.addSprite 
    + 没有调整为相对坐标
+ 背包中没有物品,图片不消失,再次拿起物品,贴图叠加
    + APG.Bag.dropItem
    + APG.Bag.putItem
    > 没有物品应该将贴图对象消除.
+ 背包拿新的东西,贴图不加载
    + APG.Bag.getItem
+ 宝石动画失效

+ 地图砖块大小计算错误，无法显示 地图
    > + APG.Tile side: NaN
    > + APG.js:161 APG.Tile.scale: NaN
    + 加入背包系统检测,没有背包系统(`APG.BagSystem`)就不计算背包侧栏
    
+ demo2 数字块(`textbitmap`), 文字重叠
    + TileMapJson中的自定义属性和函数定义的属性冲突
    + `APG.Target.loadTextBitMap`函数中覆盖数字时判断 == 号写成了 =
+ `getTileFromSite`参数传入不能传入对象,没加转换
+ 背包物品过多不会缩放
+ 背包是先入先出机制,
-----
-
-
-
-
-
-
-
-
-
