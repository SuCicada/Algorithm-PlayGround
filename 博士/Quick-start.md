# Quick Start
## 1. 下载项目 

[download ZIP](https://github.com/SuCicada/Algorithm-PlayGround/archive/master.zip)

or use git on terminal 

`git clone https://github.com/SuCicada/Algorithm-PlayGround.git`

## 2. 项目结构
* js\
    * phaser-2.13.2.js
        > PhaserCE 官方库
    + APG.js
        > APG 集成库
    + APG\
        > APG 完整库
        + APG.js
        + Assets.js
        + Bag.js
        + Character.js
        + Game.js
        + Group.js
        + Methods.js
        + Sprite.js
        + Target.js
        + Tile.js
        + Update.js
+ MapEditor\
    > 地图编辑生成器
    + GenerateMapJson.js
    + MapEditor.js
    + index.html
+ Examples\
    > 样例
    + Demo1\
        * audio/
            > 音频
        * map/
            > 地图
        * sprites
            > 贴图
        * index.html
        * config.js
            > 游戏配置文件
        * YourGame.js
            > 游戏脚本
+ README.md
+ config-js-Format.md
    > 游戏配置文件格式说明
+ block-map.md
    > 地图元素映射表
+ Quick-start.md
    > 快速开始一个游戏
+ APG.md
    > APG API 文档    
    
---
## 3.地图制作
MapEditor包含文件
* GenerateMapJson.js
* MapEditor.js
* index.html

### 3.1 绘制地图

使用任何工具打开 `mapeditor.html`, 在打开的画板上绘制.详情参见[地图绘制]()(未完成).

### 3.2 导出地图数据(mapData)(可选)
点击导出按钮,导出文件名形如 xxx - mapdata.json 的地图数据文件.
关于文件详情参见[地图数据文件]()(未完成)

### 3.3 创建地图映射表 (blockMap)
创建js, 映射表js的格式参见[blockMap 地图元素映射表](block-map.md)

### 3.4 生成地图配置文件 (TileMapJson)
点击生成按钮, 选择 `3.3`中的地图映射表, 会导出文件名形如 xx - MapTile.json 的 tilemap 配置文件. <br>
关于tilemap详情参见[tilemap官方版](http://doc.mapeditor.org/en/stable/reference/json-map-format/#json-object), 或者 [tilemap汉化版](https://docs.qq.com/doc/DRWladWVHTmhQdFBr)

### 3.5 附加功能: 导入地图数据
 存在bug, 需要在第一层地图层上点击导入,选择 `1.2`中导出的地图数据即可.

### 3.6 程序说明: GenerateMapJson.js
+ 地图生成器, 分为4部分:

| | | 补充|
| :--- | --- | ---|
|generate_tilemap_data|定义tilemap_data 外层框架|
|setMapTilesets| 定义 tileset 层|需要首先完成
|setMapLayerData| 定义 layer 层| `setMapTilesets` 之后即可
|setProperties| 定义 元素自定义属性| 
|setMapObjects| 定义对象层,<br> 组合layer 和object | `setMapTilesets` 之后即可
---

+ 文件选择器

|||
| --- | ---|
|showWindow| 显示窗口
|getImgInfo| 读取图片大小|
|mapConfigImport|导入映射表js|
---


## 4.制作游戏 
### 4.1 创建 index.html
需要引入以下 JavaScript 文件:

| js文件 | 描述 |
|---|---|
|phaser.js| phaser官方库 |
|config.js| 游戏配置文件 |
|YourGame.js| 你的游戏代码|   
|APG.js| APG游戏引擎|

#### 注意:
+ 四个js文件的引用顺序可以随意.
+ 除此之外,html其他部分可以什么也不写.

### 4.2 修改游戏配置文件
样例目录下有一个名为 config.js 的文件,里面有自定义的游戏的所有配置,包括渲染模式, 窗口大小, 全屏, 以及所有需要用到的资源文件. <br>
详情参见[config-js-Format](config-js-Format.md)

### 4.3 






---
-
-
-
-
-
-
-
-
-
-
-
-
-

