# 搭建舞台

首先[下载资源]()

创建一个文件夹在你的目录下,作为你的项目目录

### 文件结构

我们来看看这些文件：

+ js
    + APG.js
    + phaser.js
+ Assets
    + bg.png
    + maza.png
    + player.png
    + tileMapJSON.json
    + map.js
    + mapData.json
+ YourGame.js
+ config.js
+ index.html

#### index
index.html文件是将显示游戏的网页。内容很少，我们唯一需要做的就是调用将加载游戏的文件。那些文件是：
     
+ Phaser：最重要的引擎库，它负责游戏的低级部分，如显示图像，再现声音等。
+ config：游戏的全局配置，启动的许多重要参数都在这里，如屏幕大小，启动画面和故事文件的位置。
+ APG：APG集成库，
+ myGame：游戏逻辑脚本，你的游戏的本体在这里
     
```html
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <script src="js/phaser.min.js"></script>
            <script src="js/APG.js"></script>
            <script src="YourGame.js"></script>
            <script src="config.js"></script>
        </head>
        <body>
        </body>
    </html>

```     
     
#### js
将`js`文件夹放在你的项目目录下,`js`目录包含`APG.js`和`phaser.js`两个引擎库

#### Assets
里面的 `mapData.json` 是地形数据，可以使用地图编辑器进行打开编辑，关于地图编辑器详见[地图制作](http://localhost:3000/)

#### config
游戏配置文件，会在下一节说明。

详细说明参见[游戏配置文件](http://localhost:3000/#/config-js-Format)


----
这样我们所需要的库文件和配置文件都齐全了，舞台搭建好了。

那么下一节我们来学习如何写一个游戏。