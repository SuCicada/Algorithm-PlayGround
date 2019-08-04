# 结构对象
* bootstrap
* preload
* startGame

# 方法
* fullScreen
* exitFullscreen
* showBagBar


#全局变量
* BagBar
* Tile
* MapArea
* TileMapJson
* game
* [RW]()



## RE
### Members
* RW.assets = {};   /* 暂存帧贴图 */
* RW.player = {};
* RW.objects = {};
* RW.fps = 30;
    >update的检测速度,(收效甚微) 
* RW.fps_rate = 0;
* RW.DeveloperModel
* RW.par
    * RW.par.x
    * RW.par.y
    >格子边长
* RW.textStyle
* RW.Keys
*
*

#### RW.bag
##### Members
* items
##### Methods
* addItem
* putItem
* dropItem
* getItemNum(itemName)
    > 得到物品的数量
    
#### RW.methods   
* setBody
    > 设置对象的物理检测体,传入的参数是比率 s
* moveObjectUpTo
    > 移动 groupUp 对象到 groupDown 对象上面
* moveObjectDownTo
    > 移动 groupDown 对象到 groupUp 对象下面
* animations
* playerMoveAnimations
    > 设置玩家移动动画
* getObjectFrame
    >根据传入的精灵或组,返回此精灵当前的frameId
* loadTextBitMap
    > 将一个对象的贴图换做 TextBitMap, 如果未传入对象, 则创建一个.<br>
          https://photonstorm.github.io/phaser-ce/Phaser.Text.html#alignTo
* getCharacterSprite
* setPlaySite
    >对玩家组中的第一个精灵设置相对位置,相对于MapArea.传入的坐标是相对坐标
* playerMoveTo
    > 同[setPlaySite]()

* getTileIndex
    > 得到瓷砖编号
* tileChangeTo
    > 通过改变编号来改变瓷砖
* getTilefromSite
    > 根据相对坐标得到瓷砖对象
* removeTile
* removeTilefromSite

* getCharacterSite
    > 返回角色组的坐标列表,相对坐标,相对于地图Area
* getSpriteSite
    > 得到一个精灵的相对坐标,相对于地图Area
* siteDecode
    > 将相对地址变成绝对地址
* siteCode
    > 将绝对地址变成相对地址
* getPlayerSite
    > 得到单个玩家的相对坐标,相对于地图Area<br>
    默认取得角色组里的第一个角色<br>
    可以传入玩家精灵<br>
* getPlayerTile
    > 得到玩家所处瓷砖
* getPlayerSiteAll
    > (待开发)
    
* setGroup
    > 默认存在0个精灵, 默认key 为spritesheet, index 从1开始
* setSprite
    > 新增一个精良在组中
* setSpriteSite
* getPlayerSprite
    > 传入玩家组,默认返回第一个精灵
* getSpriteFromSite
    > 从一个组里, 且在这个位置上, 拿精灵, 返回列表<br>
    如果指定了所属组,便从指定组中寻找, 如果没有便从世界开始查找
* destroySprite 
* WIN

#### RW.update
##### Members
* collideWorldBounds
* listenKey
##### Methods
* bag
* setCollideWorldBounds


#####RW.update.listenKey
##### Members
* keyEventList
##### Methods
* addKeyEvent    
* playerMove


#### RW.update.collision
##### Members
* block
    + GroupList
    + TileList
    + playerGroupList
    + playerTileList
+ active
    + GroupList
    + TileList
    + playerGroupList
    + playerTileList
##### Methods
* blockTileOverlap
* blockGroupOverlap
* activeGroupOverlap
* activeTileOverlap
* isCollided
    > (待实现)
