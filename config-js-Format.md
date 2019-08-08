所有配置包含在`globalConfig`对象之下,
请不要改变变量名
+ WIDTH
    > 游戏窗口宽度,值为像素. 默认值为0, 宽度为显示器宽度
+ HEIGHT
    > 游戏窗口高度,值为像素. 默认值为0, 高度为显示器高度
* MOD
    > 渲染模式, 可选AUTO, WEBGL, WEBGL_MULTI, CANVAS or HEADLESS, 详情参见 [Phaser - renderer](https://photonstorm.github.io/phaser-ce/Phaser.Game.html#Game) 

* DeveloperModel 
    > 你的游戏脚本所在的对象名,比如 `YourGame`.
* ScaleMode
    > 游戏画面拉伸模式,可用参数:`NO_SCALE`,`EXACT_FIT`,`SHOW_ALL`(默认),`RESIZE`,`USER_SCALE`,<br>
详情参见[Phaser - scaleMode](https://photonstorm.github.io/phaser-ce/Phaser.ScaleManager.html#scaleMode)
+ FullScreen
    > `bool`值, 游戏初始全屏否.可以通过调用接口在游戏脚本中设置.
+ BagSystem
    > `bool`值,是否需要背包系统..可以通过调用接口在游戏脚本中设置.
* Keys
    > 按键绑定, 即游戏中需要用到的按键.目前仅支持键盘按键.<br>
    关于支持按键,以及按键名称参见 [KeyCode](https://photonstorm.github.io/phaser-ce/Phaser.KeyCode.html) <br>
    >>后期会考虑加入触摸按键功能, 以兼容触摸屏设备.
* BagBar
    
    背包系统显示侧栏,不需要可以不要.<br>
    `w`:宽度,0<=w<=1: 世界边长的比率 <br>  w>1: 像素
    
    `h`:高度,0<=h<=1: 世界边长的比率 <br>  h>1: 像素
+ MapArea
    地图区域,大小会自动调整<br>
    `x`:0<=x<=1: 世界边长的比率  x>1: 像素
    
    `y`: 同上
    
    `width`:同上,之后会再次进行自动调整
    
    `height`:同上,之后会再次进行自动调整
+ Assets
    资源文件配置
    + music
        > 背景音乐, 循环播放<br>
        `musicKey`:音乐名<br>
        `musicUrl`:音乐路径<br>
    * backgroun
        > 背景图片,<br>
        `imgKey`:图片名<br>
        `imgUrl`:图片路径<br>
        `scrollX`,`scrollY`用于设置滚动速度以及方向(负数)<br>
    * mapImg
        > 地图瓷砖贴图,目前就支持一张图片, 关于贴图的一部分已在`map.js`中进行过设置.<br>
        `imgKey`:图片名<br>
             `imgUrl`:图片路径<br>
         >>注意! `imgKey` 要和 `map.js`中的一样.
    * tileMap
        > `tileMapJson`: 地图配置文件,json格式, 可以使用 [Tiled](https://www.mapeditor.org)第三方工具生成, 或者使用本框架提供的地图编辑器和地图生成器.详情参见[1.地图制作]().
    * spritesImg `array`
        > 精灵信息,即对象层的贴图配置,lian<br>
        `type:` 目前有 _`player`_ 和 _`object`_ 区别 <br>
        `imgMode:` 贴图类型, 支持 _[spritesheet](https://photonstorm.github.io/phaser-ce/Phaser.Loader.html#spritesheet)_, 
    _[image](https://photonstorm.github.io/phaser-ce/Phaser.Loader.html#image)_,
    _[atlasJSONHash](https://photonstorm.github.io/phaser-ce/Phaser.Loader.html#atlasJSONHash)_ 等,
    更多参见[Phaser - Loader](https://photonstorm.github.io/phaser-ce/Phaser.Loader.html#toc-4)<br> 
    **特殊支持:** [textbitmap](), 文字位图
    <br>
    `imgKey` 贴图唯一标识名 <br>
    `imgUrl` 贴图的url地址 <br>
    `rows` 贴图的元素列数 <br>
    `columns` 贴图的元素行数 <br>
+ README
    
    游戏开始的前言界面

    + `text`: 显示的文字
    + `bgColor`: 文字界面的背景
    ＋ `font`: 
        + `size`:字体大小 
        + `color`字体颜色



```javascript 1.8
```
---
-
-
-
-
-
-
-
--
