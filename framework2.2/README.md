
[TOC]

8/4
+ 解决贴图大小问题
+ 更新地图生成器

[1.地图制作](#1)

* js/
    * phaser.js 
* index.html
* game.js
* config.js
* YourGame.js
* README.md
* generateMapJson.js
* mapeditor.html
* mapeditor.js
* audio/
    * 音频
* map/
    * 地图
* sprites
    * 精灵


### 问题
+ 对于tile边长不同的tileset贴图, 和tilemap, 无法使得tile图片缩放到tile大小.
    + (已解决)
---
##### index.html
需要包含:

| js文件 | 描述 |
|---|---|
|phaser.js| phaser官方库 |
|config.js| 游戏配置文件 |
|YourGame.js| 你的游戏代码|   
|game.js| RW游戏框架|

### 注意:
* 请按照 `phaser.js` -> `config.js` -> `YourGame.js` -> `game.js` 的顺序先加载. 即上述表格的顺序.以保证相关资源能    
* 除此之外,html其他部分可以什么也不写.

---

<h2 id="1">1.地图制作</h2>
包含文件

* generateMapJson.js
* mapeditor.html
* mapeditor.js

### 1.1 绘制地图

>使用任何工具打开 `mapeditor.html`, 在打开的画板上绘制.详情参见[地图绘制]()(未完成).

###1.2 导出地图数据
>点击如图导出按钮,导出文件名形如 xxx - mapdata.json 的地图数据文件.
关于文件详情参见[地图数据文件]()(未完成)

### 1.3 创建地图映射表
>创建js, 映射表js的格式参见[映射表js]()(未完成)

    映射表js: 
        1. 分为三部分
        2. 严格按照格式要求
        3. 地形图片要指定,关系到地形的大小自动调整.
           路径为游戏项目下相对路径, 或网络绝对路径.
        4. 地形图片路径也可以后期手动修改

### 1.4 生成地图配置文件 (TileMapJson)

>点击如图生成按钮, 选择 `1.3`中的地图映射表, 会导出文件名形如 xx - MapTile.json 的 tilemap 配置文件. <br>
关于tilemap详情参见[tilemap]()(未完成)

### 1.5 附加功能: 导入地图数据
> 存在bug, 需要在第一层地图层上点击导入,选择 `1.2`中导出的地图数据即可.

### 1.6 程序说明: generateMapJson.js
> 地图生成器, 分为4部分:

| d| d| 补充|
| :--- | --- | ---|
|generate_tilemap_data|定义tilemap_data 外层框架|
|setMapTilesets| 定义 tileset 层|需要首先完成
|setMapLayerData| 定义 layer 层| `setMapTilesets` 之后即可
|setMapObjects| 定义对象层,<br> 组合layer 和object | `setMapTilesets` 之后即可
---

>文件选择器

|||
| --- | ---|
|showWindow| 显示窗口
|getImgInfo| 读取图片大小|
|mapConfigImport|导入映射表js|


## 2.制作游戏 
###2.1 修改配置文件
>样例目录下有一个名为 config.js 的文件,里面有自定义的游戏的所有配置,包括渲染模式, 窗口大小, 全屏, 以及所有需要用到的资源文件. <br>
详情参见[config.js Format]()




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
