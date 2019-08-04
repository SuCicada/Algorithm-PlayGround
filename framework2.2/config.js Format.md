所有配置包含在`globalConfig`对象之下,
请不要改变变量名.s

* MOD
> 渲染模式, 可选AUTO, WEBGL, WEBGL_MULTI, CANVAS or HEADLESS, 详情参见 [Phaser - renderer](https://photonstorm.github.io/phaser-ce/Phaser.Game.html#Game) 

* DeveloperModel 
> 你的游戏所在的对象名,比如 `YourGame`
* scaleMode
> 游戏画面拉伸模式,可用参数:`NO_SCALE`,`EXACT_FIT`,`SHOW_ALL`,`RESIZE`,`USER_SCALE`,<br>
详情参见[Phaser - scaleMode](https://photonstorm.github.io/phaser-ce/Phaser.ScaleManager.html#scaleMode)
* music
> 背景音乐, 循环播放
* background
> 背景图片,`scrollX`和`scrollY`用于设置滚动速度以及方向(负数)
* tilemap
>地图配置文件,json格式, 可以使用 [Tiled](https://www.mapeditor.org)第三方工具生成, 或者使用本框架提供的地图编辑器和地图生成器.详情参见[1.地图制作]().
* mapImg
> 地图瓷砖贴图,目前就支持一张图片, 关于贴图的一部分已在`map.js`中进行过设置.<br>
 >>注意! `imgKey` 要和 `map.js`中的一样.
* keys
> 按键绑定, 即游戏中需要用到的按键.目前仅支持键盘按键.<br>
关于支持按键,以及按键名称参见 [KeyCode](https://photonstorm.github.io/phaser-ce/Phaser.KeyCode.html) <br>
>>后期会考虑加入触摸按键功能, 以兼容触摸屏设备.
* sprites
> 精灵信息,即对象层的贴图配置,<br>
``type:`` 目前有 _`player`_ 和 _`object`_ 区别 <br>
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
