# blockMap 地图元素映射表
本配置文件用于地图配置文件生成阶段.

关于地图配置文件如何生成,以及地图编辑器的使用详见[Quick-start 3.地图制作](Quick-start#3.地图制作)

整个文件格式结构如下：
```js
var BLOCKS = {
    MapImg: {...},
    Layers: {
        TileLayer: [...],
        TargetLayer: [...],
        CharacterLayer: [...],
    }
};
```

## BLOCKS 
本对象名以及内部所有键名不能改动, 否则就找不见你的地图元素了.

+ MapImg
    + `imgKey`
        > 图片名, 需要与游戏配置文件中的地图贴图名称一致
    + `rows`: 贴图的元素块行数
    +　`columns`: 贴图的元素块列数
    + [注意]
        >`imgUrl`不需要, 因为图片信息会通过地图编辑器选择导入, 具体路径以游戏配置文件为准
+ Layers
    > 分为三层,地形层, 可交互元素层,角色层.<br>
    + TileLayer `array`
        > 地形层,第一层,可包含多个js对象
        + `mapId`: 对应于地图数据(mapData)中每个元素块的编号.(0-F)
        + `tileId`: 贴图中元素块的id. (从1开始)
        + \[注意\]: `mapId` 和`tileId`的区别
    + TargetLayer `array`
        > 可交互元素层,第二层,可包含多个js对象
        + `mapId`: (必须)同上
        + `keyName`:(必须) 元素名,对应于游戏配置中`keyName',也是游戏中[Group]()的识别名
        + `imgKey`: 图片名,对应于游戏配置中同名属性.<br>
        如果图片类型为 [TextBitMap](),则不需要定义.
        + `frameId`: 如果图片是[spritesheet](), 本属性的值就是`spritesheet`(帧动画贴图)图片中的帧id. 默认为第一个.
    + CharacterLayer
        > 角色层,又名人物层,第三层,玩家对象就处于本层.可包含多个js对象
        + `mapId`: 同上
        + `keyName`: 同上
        + `imgKey`: 同上
        + `type`: 人物类型,需指定玩家为`player`.若不指定玩家,则默认本层第一个对象(先从左向右,再从上到下)为玩家<br>
    > 后期会加入队友等角色.       
    
+ Sprites
    > 提供对象自定义属性的功能<br>
    [注意]如果某元素的类型为[TextBitMap](),则需要在这里定义`TextBitMap`的属性
    + `x`: 元素的x轴坐标, 可从地图编辑器右上角获得, 从0开始
    + `y`: 元素的y轴坐标, 可从地图编辑器右上角获得, 从0开始
    + 'z`: 元素所处的层数,从1开始.<br>
        > 目前仅支持第二第三层.后期考虑实现第一层.
        + `properties`: 类型`object`
            > 键值对存储即可.以下说明的是[TextBitMap]()所必须的参数
            + `bgColor`: TextBitMap 颜色
            + `text`: TextBitMap 显示的文字

        
        
        
        
        
        
        
        