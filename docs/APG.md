# 结构对象
* bootstrap
    > 初始引导
* preload
    > 加载配置
* startGame
    > 游戏主引擎
# 方法
* autoResizeImg
    > 用于bootstrap中init的图像大小调整


#全局变量
## 普通变量
+ WIDTH
    > 游戏界面宽度
+ HEIGHT
    > 游戏界面高度
+ MODE
    > 渲染模式
## 对象
* BagBar
    > 背包系统
* Tile
    > 地图中方格
* MapArea
    > 地图区域
* TileMapJson
    > 地图配置Json数据
* game
    > phaser游戏对象
    
    


## APG
### Members
* Assets
   > 游戏资源
   + music
   + background
   + mapImg
* player
    + group
        > 玩家组对象
    + setAnimations
        > 玩家动画
* objects;
* FPS `number`
    > update的检测速度,(收效甚微) 
* FPSRate `number`
    > 用于FPS检测的当前帧,暂存,用户不需要用
* DeveloperModel <br>
    `string`
    > 开发者游戏脚本所处js对象
+ Keys `object`
    > 按键映射
    + move
        > 移动按键
        + UP
            > 'UP'
        + DOWN
            > 'DOWN'
        + LEFT
            > 'LEFT'
        + RIGHT
            > 'RIGHT'
* UDLRDir
    > 方向指示
    + UP
        > {x: 0, y:-1}
    + DOWN
        > {x: 0, y: 1}
    + LEFT
        > {x:-1, y: 0}
    + RIGHT
        > {x:-1, y: 0}

+ Side
    > 格子边长
    + x
    + y

* APG.TextStyle
    > 字体格式

* TargetGroups `object`
    > 对象组映射表
* CharacterGroups `object`
    > 角色组映射表





#### APG.bag
##### Members
* items `array`
    > 物品组列表
+ capacity `number`
    > 最大容量
+ size `number`
    > 当前容量
##### Methods
+ showBagBar <br>
    **!不开放接口**
    > 显示背包
* addItem
    >  /* initialization即初始化时, 设置背包要存的东西
          *  返回已存在于 APG.TargetGroups 中的组
          *  若没有赠送一个对象组
          *  [!] 没有考虑玩家组的
          * frameId: 显示在背包栏的帧
          * itemName: 物品名称, 需要和ObjectGroup中的keyName对应
          * */
* putItem
+ getItem
* dropItem
* getItemNum(itemName)
    > 得到物品的数量
+ setBagCapacity
+ getBagCapacity
+ getBagSize
+ goDownItems
+ goUpItems

#### APG.Assets
##### Methods
+ playMusic
+ stopMusic


#### APG.update
##### Member
+ listenKey
    > 监听按键
    + keyEventList 'array'
        > 监听按键列表
+ collideWorldBounds 'boolen'
    > 地图边界碰撞,是否允许通过地图边界   
+ collision
    > 碰撞
    + block


#### APG.methods   
+ getTargetGroup
+ getCharacterGroup
* setBody
    > 设置对象的物理检测体,传入的参数是比率 s
* moveGroupUpTo
    > 移动 groupUp 对象到 groupDown 对象上面
* moveGroupDownTo
    > 移动 groupDown 对象到 groupUp 对象下面
* setAnimations
* playerMoveAnimations
    > 设置玩家移动动画
* getFrame
    >根据传入的精灵或组,返回此精灵当前的frameId
* loadTextBitMap
    > 将一个对象的贴图换做 TextBitMap, 如果未传入对象, 则创建一个.<br>
          https://photonstorm.github.io/phaser-ce/Phaser.Text.html#alignTo
* getCharacterSprite
* setCharacterSite
    >对玩家组中的第一个精灵设置相对位置,相对于MapArea.传入的坐标是相对坐标
* moveCharacter
    > 同[setCharacterSite]()

* getTileId
    > 得到瓷砖编号
* changeTile
    > 通过改变编号来改变瓷砖
* getTileFromSite
    > 根据相对坐标得到瓷砖对象
* removeTile
* removeTileFromSite

* getCharacterSite
    > 返回角色组的坐标列表,相对坐标,相对于地图Area
* getSpriteSite
    > 得到一个精灵的相对坐标,相对于地图Area
* siteDecode
    > 将相对地址变成绝对地址
* siteCode
    > 将绝对地址变成相对地址
* getCharacterSite
    > 得到单个玩家的相对坐标,相对于地图Area<br>
    默认取得角色组里的第一个角色<br>
    可以传入玩家精灵<br>
* getCharacterTile
    > 得到玩家所处瓷砖
* getCharacterSiteAll
    > (待开发)
    
* setGroup
    > 默认存在0个精灵, 默认key 为spritesheet, index 从1开始
* addSprite
    > 新增一个精良在组中
* setSpriteSite
* getCharacterSprite
    > 传入玩家组,默认返回第一个精灵
* getSpriteListFromSite
    > 从一个组里, 且在这个位置上, 拿精灵, 返回列表<br>
    如果指定了所属组,便从指定组中寻找, 如果没有便从世界开始查找
* destroySprite 

+ README
* WIN
+ fullScreen
+ exitFullscreen



#### APG.update
##### Members
* collideWorldBounds
* listenKey
##### Methods
* bag
* setCollideWorldBounds


#####APG.update.listenKey
##### Members
* keyEventList
##### Methods
+ stopListenKey
+ startListenKey
+ setMoveKey
* addKeyEvent    
* characterMoveEvent


#### APG.update.collision
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
