# How TO Make A Whole Game
## 1. 下载项目 

[download ZIP](https://github.com/SuCicada/Algorithm-PlayGround/archive/master.zip)

or use git on terminal 

```
git clone https://github.com/SuCicada/Algorithm-PlayGround.git
```

## 2. 文件主要结构
    APG
    ├── dist     （集成库）
    │   └── APG.js 
    ├── docs     （文档）
    │   └── ...
    ├── Examples （样例）
    │   └── ...
    ├── lib      （外部库）
    │   └── phaser-2.13.2.min.js
    └── src      （源码）
        ├── APG  （APG引擎）
        │   ├── APG-core.js
        │   ├── Assets.js
        │   ├── Bag.js
        │   ├── Character.js
        │   ├── Game.js
        │   ├── Group.js
        │   ├── Methods.js
        │   ├── Sprite.js
        │   ├── Target.js
        │   ├── Tile.js
        │   └── Update.js
        └── MapEditor （地图编辑器）
            ├── GenerateMapJson.js
            ├── index.html
            └── MapEditor.js

 
---
## 3.地图制作
MapEditor包含文件
* GenerateMapJson.js
* MapEditor.js
* index.html

### 3.1 绘制地图
使用任何工具打开 `index.html`, 或者使用在线编辑器 [APG MapEditor](https://sucicada.github.io/Algorithm-PlayGround/src/MapEditor/index.html)

在打开的画板上绘制.详情参见[地图绘制]()(未完成).

### 3.2 导出地图数据(mapData)(可选)
点击导出按钮,导出文件名形如 xxx - mapdata.json 的地图数据文件.

形如：
```json
{
    “width": 2,    
    "height": 3,
    "map": [
        [[".","1"],[".","1"],[".","1"]],
        [[".","1"],[".","1"],[".","1"]],
        [[".","1"],[".","1"],[".","1"]]
    ],
}
```

### 3.3 创建地图映射表 (blockMap)
创建js, 映射表js的格式参见[blockMap 地图元素映射表](/block-map?id=blocks)

### 3.4 生成地图配置文件 (TileMapJson)
点击生成按钮, 选择 `3.3`中的地图映射表, 会导出文件名形如 xx - MapTile.json 的 tilemap 配置文件. <br>
关于tilemap详情参见[tilemap官方版](http://doc.mapeditor.org/en/stable/reference/json-map-format/), 或者 [tilempa汉化版](https://docs.qq.com/doc/DRWladWVHTmhQdFBr)

### 3.5 附加功能: 导入地图数据
需要在**第一层地**图层上点击导入,选择 `1.2`中导出的地图数据即可.

### 3.6 *程序说明: GenerateMapJson.js
+ 地图生成器, 分为4部分:

| | | 补充|
| :--- | --- | ---|
|generate_tilemap_data|定义tilemap_data 外层框架|
|setMapTilesets| 定义 tileset 层|需要首先完成
|setMapLayerData| 定义 layer 层| `setMapTilesets` 之后即可
|setProperties| 定义 元素自定义属性| 
|setMapObjects| 定义对象层,<br> 组合layer 和object | `setMapTilesets` 之后即可

+ 文件选择器

|||
| --- | ---|
|showWindow| 显示窗口
|getImgInfo| 读取图片大小|
|mapConfigImport|导入映射表js|
---


## 4.制作游戏 

### 4.1 修改游戏配置文件
样例目录下有一个名为 config.js 的文件,里面有自定义的游戏的所有配置,包括渲染模式, 窗口大小, 全屏, 以及所有需要用到的资源文件. <br>
详情参见[config-js-Format](/config-js-Format?id=config-js)

### 4.2 创建 index.html
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

+ 不要忘了js支持库,如果不想使用js库在你的服务器上,或者想保持最新版的APG,可以使用在线库.

    + APG
```html
<script src="https://sucicada.github.io/Algorithm-PlayGround/dist/APG.js"></script>
```

    + PhaserCE
```html
<script src="//cdn.jsdelivr.net/npm/phaser-ce@2.13.2"></script>
```

### 4.3 加入游戏相关资源
游戏相关资源比如,元素贴图,帧动画JSON,背景图片,地图贴图,地图配置文件(详见[3.地图制作](#_3地图制作)),背景音乐等.

### 4.4 开始编写游戏脚本

整个游戏的结构

```js
YourGame = {   
    create:{...},   /* 用来进行一些对象的创建及初始化 */
    update:{...},   /* 游戏主循环*/
};
```

我们使用Demo3*中缀表达式转后缀表达式*来举例说明，其中的地图和资源文件可以直接从`Examples`中获取，咱们接下来只关心怎么写游戏脚本。

#### create 游戏初始
create部分负责，初始`TextBitMap`（文本块），玩家操作（按键绑定），初始碰撞检测以及触发规则，自定义属性变量，初始元素动画

音乐播放

```js
APG.Assets.playMusic('mu');
```

