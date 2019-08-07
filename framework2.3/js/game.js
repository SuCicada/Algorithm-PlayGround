window.onload=function() {
    game.state.add('bootstrap', bootstrap);
    game.state.start('bootstrap');
};


var WIDTH = globalConfig.WIDTH? globalConfig.WIDTH: window.screen.width;
var HEIGHT = globalConfig.HEIGHT? globalConfig.HEIGHT: window.screen.height;

var MODE = globalConfig.MODE? globalConfig.MODE: 'CANVAS';

var BagBar = {
    w: globalConfig.BagBar.w<1? globalConfig.BagBar.w*WIDTH:  globalConfig.BagBar.w,
    h: globalConfig.BagBar.h<1? globalConfig.BagBar.h*HEIGHT: globalConfig.BagBar.h,
};
var Tile = {
    height: 0,
    width: 0,
    scale: 0,
};
var MapArea = {
    x: globalConfig.MapArea.x<1? globalConfig.MapArea.x*WIDTH:  globalConfig.MapArea.x,
    y: globalConfig.MapArea.y<1? globalConfig.MapArea.y*HEIGHT: globalConfig.MapArea.y,
    width : WIDTH * 0.8,
    height: HEIGHT * 0.8,
    rows: 0,   /* 棋盘世界的行列数*/
    columns: 0,
};
MapArea.offsetX = MapArea.x;
MapArea.offsetY = MapArea.y;

var TileMapJson;   /* 用于存贮地图配置 */
var game = new Phaser.Game(WIDTH,HEIGHT,MODE, '');

var RW = {};
RW.Assets = {};   /* 暂存帧贴图 */
RW.Assets.music = {};
RW.Assets.background = {};
RW.Assets.mapImg = null;
RW.players = [{group:null,animations:{}}];
RW.objects = {};

RW.Tilemap = null;
RW.Layer = null;

/* update的检测速度,(收效甚微) */
RW.FPS = 30;
RW.FPSRate = 0;
RW.DeveloperModel = null;
RW.Keys = {};
RW.Keys.move = {
    UP:    'UP',
    DOWN:  'DOWN',
    LEFT:  'LEFT',
    RIGHT: 'RIGHT',
};
RW.UDLRDir = {
    UP:    {x: 0, y:-1},
    DOWN:  {x: 0, y: 1},
    LEFT:  {x:-1, y: 0},
    RIGHT: {x: 1, y: 0},
};

RW.Side = {x:0,y:0};  // 格子边长
RW.TextStyle = null;

RW.ObjectGroups = {};
RW.CharacterGroups = {};

RW.bag = {};
RW.bag.capcity = 0;
RW.bag.size = 0;
RW.bag.items = [];

RW.methods = {};
RW.update = {};
RW.update.listenKey = {};
RW.update.listenKey.keyEventList = [];

RW.update.collideWorldBounds = false;
RW.update.collision = {};
RW.update.collision.block = {};


function autoResizeImg(imgSrc, width, height){
    /* 若未指定width, 则height按比例, 反则同理*/
    return new Promise(function(resolve){
        /*https://segmentfault.com/a/1190000013483149*/
        let img = new Image();
        img.onload = function(){
            let imgRatio = img.naturalWidth / img.naturalHeight;
            // 创建一个画布容器；
            let cvs = document.createElement('canvas');
            // 获取容器中的画板；
            let ctx = cvs.getContext('2d');
            if(!width && !height){
                return;
            }
            cvs.width = width? width: height / imgRatio;
            cvs.height = height? height: width / imgRatio;
            // 将原图等比例绘制到缩放后的画布上；
            ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
            // 将绘制后的图导出成 base64 的格式；
            let b64 = cvs.toDataURL('image/png', 0.9);
            let newImg = new Image();
            newImg.src = b64;
            newImg.onload = function(){
                console.log("newImg: " + newImg.width + " x " + newImg.height);
                resolve(newImg);
            };
            // 使用完后清空该对象，释放内存；
            setTimeout(()=>{
                img = null;
            },1000);
        };
        img.src = imgSrc;
    });
}

var bootstrap = {
    init: function () {
        if (!(globalConfig.ScaleMode == "EXACT_FIT")){
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }
        game.scale.scaleMode = Phaser.ScaleManager[globalConfig.ScaleMode];
        game.scale.refresh();

        if(globalConfig.FullScreen) {
            RW.methods.fullScreen();
        }
    },
    preload: function() {
        game.load.json('mazajson', globalConfig.Assets.tileMap.tileMapJson);
    },
    create: function(){
        game.state.add("preload",preload);
        game.state.start("preload");
    }
};

var preload = {
    init: function (){
        /* 地图配置文件 */
        TileMapJson = game.cache.getJSON('mazajson');

        /* Tile大小, 强制方形 */
        var side = Math.min(MapArea.height / TileMapJson.height,
            MapArea.width  / TileMapJson.width);
        Tile.height = Tile.width = side;
        console.log("Tile side: " + side);

        /* 使用新的除去旧的, 算出需要对对象拉伸的量,
         * 因为对象的大小是根据旧 地图配置中的 tileheight,tilewidth 来算的
         * */
        Tile.scale = Math.min(Tile.width / TileMapJson.tilewidth,
            Tile.height / TileMapJson.tileheight);
        console.log("Tile scale: " + Tile.scale);

        /* 根据实际环境, 更新了瓷砖大小 */
        TileMapJson.tileheight = Tile.height;
        TileMapJson.tilewidth =  Tile.width;

        /* 根据实际环境, 更新了地图区域信息 */
        MapArea.width = Tile.width * TileMapJson.width;
        MapArea.height = Tile.height * TileMapJson.height;
        MapArea.rows = MapArea.width / Tile.width;
        MapArea.columns = MapArea.height / Tile.height;


    },
    preload: function(){
        let Assets = globalConfig.Assets;

        /* 更新地图贴图url */
        let imgSrc = globalConfig.Assets.mapImg.imgUrl;
        let width = Tile.width * (TileMapJson.tilesets[0].tilecount / TileMapJson.tilesets[0].columns);
        let height = Tile.height * TileMapJson.tilesets[0].columns;
        console.log(width,height)
        autoResizeImg(imgSrc, width, height).then(function(newImg) {
            RW.Assets.mapImg = newImg.src;
            TileMapJson.tilesets[0].image = newImg.src;
            TileMapJson.tilesets[0].imageheight = newImg.height;
            TileMapJson.tilesets[0].imagewidth = newImg.width;
            TileMapJson.tilesets[0].tileheight = Tile.height;
            TileMapJson.tilesets[0].tilewidth = Tile.width;

            /* 加载资源必须等到图片处理结束之后 */
            game.load.image(Assets.mapImg.imgKey,     RW.Assets.mapImg);
            game.load.tilemap('Tilemap', null, TileMapJson, Phaser.Tilemap.TILED_JSON);
        console.log(TileMapJson)
        });


        game.load.audio(Assets.music.musicKey,    Assets.music.musicUrl);
        game.load.image(Assets.background.imgKey, Assets.background.imgUrl);



        this.spritesheets = [];
        for(sprite of Assets.spritesImg) {
            switch(sprite.imgMode){
                case 'JSONHash':
                    game.load.atlasJSONHash(sprite.imgKey,sprite.imgUrl, sprite.jsonFile);
                    break;
                case 'image':
                    game.load.image(sprite.imgKey, sprite.imgUrl);
                    break;
                case 'spritesheet':
                    /* 这里需要在之后读取文件大小, 来确定每一帧的大小, 所以只能读图片, 并且入数组 */
                    game.load.image(sprite.imgKey, sprite.imgUrl);
                    this.spritesheets.push(sprite);
                    break;
            }
        }
        RW.Assets.spritesheets = this.spritesheets;
    },
    create: function () {
        game.state.add("startGame",startGame);
        game.state.start("startGame");
    },
};

var startGame = {
    init: function(){
        RW.DeveloperModel = eval(globalConfig.DeveloperModel);   /*回调上下文全局对象，默认YourGame*/

        RW.Side.x = Tile.width;
        RW.Side.y = Tile.height;
        RW.TextStyle = { font: "48px Arial", fill: "#ff0044", align:"center" };

        /*==== 按键 ======*/
        var defaultKays = ['cursors'];
        for(key of globalConfig.Keys.concat(defaultKays)){
            if(key == 'cursors'){
                var k = game.input.keyboard.createCursorKeys();
                for(i in k){
                    RW.Keys[i.toUpperCase()] = k[i];
                }
            }else{
                var k = game.input.keyboard.addKey(Phaser.Keyboard[key]);
                RW.Keys[key] = k;
            }
        }

        /* 你的 init */
        YourGame.init();
    },
    preload: function(){
        /* 这里就放一些补充的材料, 还有你的 */
        /* 重新载入帧动画贴图 */
        let spritesheets = RW.Assets.spritesheets;
        for(i=0;i<spritesheets.length;i++) {
            var ss = spritesheets[i];
            var a = game.cache.getImage(ss.imgKey);
            game.load.spritesheet(ss.imgKey, ss.imgUrl,
                a.width / ss.columns, a.height / ss.rows);
        }

        /* 你的 preload */
        YourGame.preload();
    },
    create: function(){
        let Assets = globalConfig.Assets;
        var bg = game.add.tileSprite(0,0,game.width,game.height,Assets.background.imgKey);
        bg.autoScroll(Assets.background.scrollX,Assets.background.scrollY);
        RW.Assets.background[Assets.background.musicKey] = bg;

        let music = game.add.audio(Assets.music.musicKey);
        // music.play();
        RW.Assets.music[Assets.music.musicKey] = music;

        RW.Tilemap = game.add.tilemap('Tilemap');
        /* 第一个参数是json中的tileset名, 第二个参数是地图贴图的key
        ** 推荐这两个名字取得一样
        */
        RW.Tilemap.addTilesetImage(Assets.mapImg.imgKey, Assets.mapImg.imgKey);
        RW.Layer = RW.Tilemap.createLayer("layer1", MapArea.width, MapArea.height);
        RW.Layer.fixedToCamera = false;
        RW.Layer.position.set(MapArea.x, MapArea.y);
        RW.Layer.resizeWorld();


        /* 开始创建精灵 */
        /* 开始对象层扫描*/
        var objectLayer = TileMapJson.layers.find(function(lay){
            return lay.name == "Object Layer";
        }).objects;
        var indexs = {};
        for(i=0;i<objectLayer.length;i++){
            /* 循环次数是对象层的对象数
            *  每有新gid 执行循环体
            * */
            if(indexs[objectLayer[i].gid]){
                continue;
            }else{
                indexs[objectLayer[i].gid] = true;
            }

            let group = game.add.group();
            let obj = objectLayer[i];
            let objPro = objectLayer[i].properties;
            /* 2.0: 目前都有keyName了*/
            let imgKey = objPro[0].imgKey;
            let imgMode = globalConfig.Assets.spritesImg.find(function(s){
                            return s.imgKey == objPro[0].imgKey;
                        }).imgMode;
            let frameId = objPro[0].frameId? objPro[0].frameId: null;
            RW.Tilemap.createFromObjects('Object Layer' ,obj.gid ,
                imgKey , frameId, true, false, group, Phaser.Sprite, false);
            /* 对 textbitmap 对象的特殊处理 */
            if (imgMode == 'textbitmap') {
                group.forEach(function(s) {
                    let bg = s[0].bgColor;
                    let text = s[0].text;
                    if (bg && text) {
                        RW.methods.loadTextBitMap(s, text, bg);
                    }
                });
            }

            group.enableBody = true;
            group.forEach(function(s){
                s.x *= Tile.scale;
                s.y *= Tile.scale;
                /*相对距离,相对于MapArea, 棋盘坐标*/
                s.relx = s.x / Tile.width;
                s.rely = s.y / Tile.height;

                s.x += MapArea.x;
                s.y += MapArea.y;
                s.scale.setTo(1);
                s.scale.setTo(Tile.width / s.width,
                    Tile.height / s.height);




                console.log(s.x+","+s.y+" -> "+s.relx+","+s.rely);

                /* 将对象的物理检测体缩小,不然可能会在瓷砖边上就碰撞 */
                game.physics.enable(s, Phaser.Physics.ARCADE);
                RW.methods.setBody(s,0.6,0.6,0.2,0.2);

            });
            /* 标识名 */
            let keyName = group.children[0][0].keyName;
            group.name = keyName;
            RW.ObjectGroups[keyName] = group;
            console.log("create successfully: "+keyName);
        }
        console.log("Object Groups has been established successfully.");


        /* 开始角色层扫描*/
        let characterGroup = game.add.group();
        {
            let characterLayer = TileMapJson.layers.find(function(lay){
                return lay.name == "Character Layer";
            }).objects;
            let obj = characterLayer[0];
            let objPro = obj.properties;
            let imgKey = objPro[0].imgKey;

            RW.Tilemap.createFromObjects('Character Layer' ,1 ,
                imgKey , 0, true, false, characterGroup, Phaser.Sprite, false);
            characterGroup.forEach(function(s){
                s.x *= Tile.scale;
                s.y *= Tile.scale;

                s.relx = s.x / Tile.width;
                s.rely = s.y / Tile.height;

                s.oldx = s.relx;
                s.oldy = s.rely;

                s.x += MapArea.x;
                s.y += MapArea.y;
                s.scale.setTo(1);
                s.scale.setTo(Math.min(Tile.width / s.width, Tile.height / s.height));
                /* 设置人物方向 */
                s.direction = {x:0,y:0};
                console.log(s.x+","+s.y+" -> "+s.relx+","+s.rely);

                game.physics.enable(s, Phaser.Physics.ARCADE);
                RW.methods.setBody(s,0.8,0.8,0.1,0.1);

            });

            RW.players.push({group:characterGroup});
            let keyName = characterGroup.children[0][0].keyName;
            characterGroup.name = keyName;
            RW.CharacterGroups[keyName] = characterGroup;
            console.log("create successfully: "+keyName);
        }
        console.log("Character Groups has been established successfully.");




        /* 你的创造 */
        YourGame.create();

        if(globalConfig.README){
            RW.methods.README(globalConfig.README);
        }

        /* 背包系统*/
        if(globalConfig.BagSystem){
            RW.bag.showBagBar();
        }

    },
    update: function(){
        RW.FPSRate++;
        if (RW.FPSRate == (60/RW.FPS)){
            RW.FPSRate = 0;
            this.updateExec();
        }
    },
    updateExec: function(){
        for(let object of RW.update.collision.active.GroupList){
            let group1 = object.group1;
            let group2 = object.group2;
            let feedback = object.feedback;
            object.isCollided = false;
            let context = object.context ;
            let that = object.that;

            game.physics.arcade.collide(group1, group2,
            function(sprite1, sprite2){
                object.isCollided = true;
                if(object.actor == "player"){
                    var parameter = group1;
                }else{
                    var parameter = sprite1;
                }
                feedback.apply(that, [parameter, sprite2, context]);
            }, null);  // 检测重叠
        }

        for(let object of RW.update.collision.active.playerGroupList){
            let player = RW.players[0].group;
            let group2 = object.group;
            let feedback = object.feedback;
            object.isCollided = false;
            let context = object.context ;
            let that = object.that;
            game.physics.arcade.collide(player, group2,
                function(sprite1, sprite2){
                    object.isCollided = true;
                    feedback.apply(that, [player, sprite2, context]);
                }, null);  // 检测重叠
        }

        RW.update.listenKey.keyEventList.forEach(function(object){
            if(RW.Keys[object.key].justDown){
                console.log(object.key + " is justDown.")
                object.feedback.apply(object.that, [object.context]);
            }
        });

        if(globalConfig.BagSystem){
            RW.update.bag();
        }

        /* 你的更新 */
        YourGame.update();
    },
    render: function(){
        // game.debug.spriteBounds(APG.Tilemap);

        // APG.CharacterGroups.player.forEach(function(s){
        //     game.debug.body(s)
        // })
        // APG.TargetGroups.baoshi.forEach(function(s){
        //     game.debug.body(s)
        // })
    }
};

//================================================================
//================================================================
//================================================================

RW.bag.showBagBar = function(){
    let w = BagBar.w;
    let h = BagBar.h;
    let x = (WIDTH - w);
    let y = 0;

    var bar = game.add.graphics();
    bar.beginFill('0x'+'#87df00'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    var style = { font: "bold "+RW.Side.x/4+"px Arial", fill: "#00124f",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    var text = game.add.text(x,y, "背包系统\n", style);
    // text.anchor.set(0.5,0);
    var items = RW.bag.items;
    var barX = x + w*0.1;
    var barY = y + h*0.2;
    var barSide = Math.min(h / items.length, Tile.height);
    var styleOfNum = {
        font: "bold "+barSide+"px Arial",
        fill: "#00124f",
        boundsAlignH: "center",
    };
    for(i = 0;i<items.length;i++){
        var img = game.add.image(barX,barY,items[i].imgKey, items[i].frameId);
        img.height = barSide;
        img.width = barSide;
        var text = game.add.text(barX+barSide*1.1,barY, items[i].number, styleOfNum);
        items[i].img = img;
        items[i].text = text;  /* 对象 */
        RW.bag.size += parseInt(items[i].number);
        barY += barSide*1.1;
    }
    /* 默认最大容量是初始化的1倍 */
    RW.bag.capcity = RW.bag.size;
};

RW.bag.addItem = function(itemName, imgKey, frameId, number){
    /* initialization即初始化时, 设置背包要存的东西
    *  返回已存在于 APG.TargetGroups 中的组
    *  若没有赠送一个对象组
    *  [!] 没有考虑玩家组的
    * frameId: 显示在背包栏的帧
    * itemName: 物品名称, 需要和ObjectGroup中的keyName对应
    * */
    // console.log(APG.TargetGroups)
    var group = RW.ObjectGroups[itemName];
    if(!group){
        var group = game.add.group();
        RW.ObjectGroups[itemName] = group;
    }else{
        if(!imgKey){
            var imgUrl = RW.ObjectGroups[itemName].children[0][0].imgUrl;
            console.log(RW.ObjectGroups[itemName].children[0][0])
            var imgKey = globalConfig.Assets.sprites.find(function(s){
                return s.imgUrl == imgUrl;
            }).imgKey;
        }
        if(!frameId){
            var frameId = RW.ObjectGroups[itemName].children[0][0].frameId;
        }
    }

    for(i=0;i<number;i++){
        var sprite = RW.methods.setSprite(0,0,imgKey,frameId,group)
        sprite.kill();
    }

    RW.bag.items.push({
        itemName: itemName, /* 物品名字,用于查找*/
        imgKey: imgKey,     /* 图片名*/
        frameId: frameId,  /* 如果是帧动画, 帧的id*/
        number: number,    /* 初始数量*/
        group: group,      /* [?]有没有必要*/
    });
    return group;
};

RW.bag.putItem = function(itemName,x,y){
    /* 从背包里把东西拿出去
    * 坐标是相对的.
    * */
    var item = RW.bag.items.find(function(b){
        return b.itemName == itemName;
    });
    var s = item.group.children[0];
    game.world.add(s);   // 把一个精灵从背包中的组里拿到世界组中
    item.number --;
    RW.bag.size --;
    s.revive();     /*复活精灵*/
    RW.methods.setSpriteSite(s,x,y);
    return s;
};

RW.bag.getItem = function(itemName,spriteList){
    /* 把东西放到背包里
    *  itemName: 指定要放到的背包区
    *  spriteList: 精灵列表,指定拿的东西
    * */
    // item = APG.bar.items.find(function(b){
    //     return b.itemName == itemName;
    // })
    for(sprite of spriteList){
        // var group = sprite.parent;
        var item = RW.bag.items.find(function(b){
            return b.itemName == itemName;
        });
        if(RW.size < RW.bag.capcity){
            item.number ++;
            RW.bag.size ++;
            item.group.add(sprite);
            sprite.kill();    /*进入休眠*/
        }
    }
};
RW.bag.dropItem = function(itemName){
    /* 把东西丢掉 */
    var item = RW.bag.items.find(function(b){
        return b.itemName == itemName;
    });
    if(item.children.length){
        item.children[0].destroy();
        RW.bag.size --;
    }
};
RW.bag.getItemNum = function(itemName){
    return RW.bag.items.find(function(b){
        return b.itemName == itemName;
    }).number;
};
RW.bag.setCapacity = function(n){
    RW.bag.capcity = n;
};
RW.bag.getCapacity = function(){
    return RW.bag.capcity;
};
RW.bag.getSize = function(){
    return RW.bag.size;
};
RW.bag.getFirst = function(){
    /* 得到当前背包第一个物品组 */
    if(items.length){
        return RW.bag.items[0];
    }
};
RW.bag.goDownItems = function(){
    /* 背包物品组向后（下）移动 */
    if(RW.bag.items.length){
        RW.bag.items = RW.bag.items.concat(RW.bag.items.splice(0,1));
    }
};
RW.bag.goUpItems = function() {
    /* 背包物品组向前（上）移动 */
    if(RW.bag.items.length) {
        RW.bag.items = RW.bag.items.splice(RW.bag.items.length-1,1).concat(RW.bag.items);
    }
};


/* ==========    Assets ====================  */
RW.Assets.playMusic = function(keyName){
    RW.Assets.music[keyName].play('',0,1,true);
    console.log("Play music: "+keyName);
};

RW.Assets.stopMusic = function(keyName){
    RW.Assets.music[keyName].stop();
    console.log("Stop music: "+keyName);
};


/* ==================== methods =====================*/
RW.methods.getTargetGroup = function(name){
    return RW.ObjectGroups[name];
};
RW.methods.getCharacterGroup = function(name){
    return RW.CharacterGroups[name];
};
RW.methods.setBody = function(s,ratew,rateh,ratex,ratey){
    /* 设置对象的物理检测体,传入的参数是比率 s*/
    s.body.setSize(
        s.width  / s.scale.x * ratew,
        s.height / s.scale.y * rateh,
        s.width  / s.scale.x * ratex,
        s.height / s.scale.y * ratey);
};
RW.methods.moveGroupUpTo = function(groupUp, groupDown){
    /* 移动 groupUp 对象到 groupDown 对象上面*/
    while(groupUp.z<=groupDown.z){
        game.world.moveUp(groupUp);
        console.log(groupUp.z, groupDown.z)
    }
};
RW.methods.moveGroupDownTo = function(groupDown, groupUp){
    /* 移动 groupDown 对象到 groupUp 对象下面*/
    while(groupDown.z >= groupUp.z){
        game.world.moveDown(groupDown);
    }
};
RW.methods.setAnimations = function(obj, name, frames, frameRate=1, loop=false){
    /*
    * 添加动画, 并播放.
    * group: 可以是组,也可以是精灵
    * frames: 从0开始?
    * name: 动作名
    * */
    if(!obj.forEach){
        let s = obj;
        s.setAnimations.add(name,frames);
        s.setAnimations.play(name, frameRate, loop);
    }else{
        let group = obj;
        group.forEach(function(s){
            s.setAnimations.add(name,frames);
            s.setAnimations.play(name, frameRate, loop);
        });
    }
};
RW.methods.playerMoveAnimations = function(playerG, obj){
    /* 设置玩家移动动画
    * obj:
    *   方向(大写,或小写 -> frames 或单个数字, 比如
    *   {
    *       right: 0,
    *       LEFT: [1],
    *       down: [2],
    *       up: 3,
    *   }
    */
    var move = {};
    for(var i in obj){
        var I = i.toUpperCase()
        move[I] = typeof obj[i] == 'number'?[obj[i]]: obj[i];

        // if(playerG.setAnimations){
        //     playerG.setAnimations.add(I, move[I], 1);
        // }else{
        //     playerG.forEach(function(s){
        //         s.setAnimations.add(I, move[I], 1);
        //     })
        // }
    }
    RW.players[0].setAnimations = {};
    RW.players[0].animations.move = {};
    RW.players[0].animations.move = move;
};
RW.methods.getFrame = function(obj){
    /* 根据传入的精灵或组,返回此精灵当前的动画的frameId */
    if(obj.setAnimations){
        /* sprite */
        return obj.setAnimations.frame;
    }else{
        /* group or sprite List*/
        var frames = [];
        obj.forEach(function(s){
            frames.push(s.setAnimations.frame);
        });
        return frames;
    }
};
RW.methods.loadTextBitMapBetween = function(group, texts, bgs, start, end){
    /* 对一个组中的对象批量load
    *  未指定start 就以 0, 未指定 end 就按最后一个
    * */
    var start = start? start: 0;
    var end = end? end: group.children.length;
    for(let i = start;i<end;i++){
        let text = typeof texts == 'object'? texts[i]: texts;
        let bg = typeof bgs == 'object'? bgs[i]: bgs;
        RW.methods.loadTextBitMap(group.children[i], text, bg);
    }
};
RW.methods.addTextBitMap = function(text, bg){
    /* 创建一个 TextBitMap */
    return RW.methods.loadTextBitMap(null,text,bg);
};
RW.methods.aboutTextBitMap = function(sprite){
    /* 如果传入一个非 TextBitMap精灵, 保证能返回一致的格式 */
    let s = sprite[0]? sprite[0]: {};
    return {
        text: s.text,
        bgColor: s.bgColor,
    }
};
RW.methods.loadTextBitMap = function(sprite, text, bgColor) {
    /* 将一个对象的贴图换做 TextBitMap, 如果未传入对象, 则创建一个
    *  会先清除之前的绑定文本 以及背景```````
    * */
    /*https://photonstorm.github.io/phaser-ce/Phaser.Text.html#alignTo*/
    let info = RW.methods.aboutTextBitMap(sprite);
    if(info.text && !text){
        var text = info.text;
    }
    if(info.bgColor && !bgColor){
        var bgColor = info.bgColor;
    }

    let bmd = game.add.bitmapData(Tile.width, Tile.height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,Tile.width, Tile.height);
    bmd.ctx.fillStyle = bgColor;
    bmd.ctx.fill();

    let oldWidth = sprite.width;
    let oldHeight = sprite.height;

    if(!sprite){
        var sprite = game.add.sprite(0,0, bmd);
    }else{
        sprite.loadTexture(bmd);
    }

    let style = { font: "bold "+Tile.width/2+"px Arial", fill: "#00124f",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: Tile.width * 0.8
    };

    var textObj = game.add.text(0, 0, text,style);
    textObj.name = "text";
    textObj.x = (Tile.width - textObj.width) / 2;
    textObj.y = (Tile.height - textObj.height) / 2;
    /* 删除原来的文本, 加入新的*/
    sprite.removeChild(sprite.children.find(function(s){
        return s.name = "text";
    }));
    sprite.addChild(textObj);
    sprite.scale.setTo(1);
    sprite.scale.setTo(oldWidth / sprite.width, oldHeight / sprite.height);
    /* 更新属性 */
    sprite[0].text = text;
    sprite[0].bgColor = bgColor;
    return sprite;
};
RW.methods.getSpriteList = function(group){
    return group.children;
};
RW.methods.getCharacterSprite = function(name){
    var group = RW.CharacterGroups[name];
    var a = group.getAll();
    return a[0];
};
RW.methods.setCharacterSite = function(playerGroup, x, y){
    /* 对玩家组中的第一个精灵设置相对位置,相对于MapArea
    * 传入的坐标是相对坐标*/
    var player = RW.methods.getPlayerSprite(playerGroup);
    var nowSite = RW.methods.getPlayerSite(playerGroup);
    player.oldx = nowSite.x;
    player.oldy = nowSite.y;

    player.relx = x;
    player.rely = y;

    var site = RW.methods.siteDecode(x,y);
    player.x = site.x;
    player.y = site.y;
};
RW.methods.moveCharacter = RW.methods.setPlaySite;
RW.methods.getTileId = function(tile){
    return tile.index;
};
RW.methods.changeTile = function(tile, index){
    tile.index = index;
    RW.Layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};
RW.methods.getTileFromSite = function(x, y){
    var tile = RW.Tilemap.getTile(x, y);
    return tile;
};
RW.methods.removeTile = function(tile){
    RW.Tilemap.removeTile(tile.x, tile.y);
};
RW.methods.removeTileFromSite = function(x, y){
    RW.Tilemap.removeTile(x,y);
};

RW.methods.getCharacterSite = function(character){
    /* 返回角色组的坐标列表,相对坐标,相对于地图Area */
    var site = [];
    RW.CharacterGroups[character].forEach(function(cha){
        site.push(RW.methods.getSpriteSite(cha));
    });
    return site;
};
RW.methods.getSpriteSite = function(sprite){
    /* 得到一个精灵的相对坐标,相对于地图Area
    * */
    return RW.methods.siteCode(sprite.x,sprite.y);;
};
RW.methods.siteDecode = function(x,y){
    /* 将相对地址变成绝对地址  */
    if(typeof x == "object"){
        var y = x.y;
        var x = x.x;
    }
    return {
        x: x * Tile.width  + MapArea.offsetX,
        y: y * Tile.height + MapArea.offsetY,
    }
};
RW.methods.siteCode = function(x,y){
    /* 将绝对地址变成相对地址  */
    if(typeof x == "object"){
        var y = x.y;
        var x = x.x;
    }

    let site = {
        x: (x - MapArea.offsetX) / Tile.width,
        y: (y - MapArea.offsetY) / Tile.height,
    };
    let about = function(num){
        return (num - Math.floor(num)) < (Math.ceil(num) - num)? Math.floor(num): Math.ceil(num);
    };

    site.x = about(site.x);
    site.y = about(site.y);
    return site;
};
RW.methods.getCharacterSite = function(playerObj, index=0){
    /* 得到单个玩家的相对坐标,相对于地图Area
    *  默认取得角色组里的第一个角色
    *  可以传入玩家精灵
    * */
    var player = playerObj.children[index];
    if(!player){
        player = playerObj;
    }
    return RW.methods.getSpriteSite(player);
};
RW.methods.getCharacterDirection = function(playerObj) {
    /* 玩家方向, */
    let player = RW.methods.getPlayerSprite(playerObj);
    return player.direction;
};
RW.methods.getCharacterTile = function(player){
    /* 得到玩家所处瓷砖 */
    var site = RW.methods.getPlayerSite(player);
    var tile = RW.methods.getTilefromSite(site.x, site.y);
    return tile;
};
RW.methods.getCharacterSiteAll = function(){};

RW.methods.setGroup = function(){
    /*默认存在0个精灵, 默认key 为spritesheet, index 从1开始*/
    var group = game.add.group();
    group.enableBody = true;
    game.physics.arcade.enable(group);
    return group;
};
RW.methods.addSprite = function(x, y, key, index, group){
    /* 新增一个精良在组中
    * key: 对象贴图
    * index: 贴图块id (begin with 1)
    * x,y: 位置
    * */
    var s = game.add.sprite(x, y, key, index-1);
    s.x += MapArea.x;
    s.y += MapArea.y;
    s.scale.setTo(1);
    s.scale.setTo(Math.min(Tile.width / s.width,
        Tile.height / s.height));
    group.add(s);
    return s;
};
RW.methods.setSpriteSite = function(s, x, y){
    /*传入的是相对坐标,需要转换成绝对坐标*/
    var site = RW.methods.siteDecode(x,y);
    s.x = site.x;
    s.y = site.y;
};
RW.methods.getCharacterSprite = function(playerG, index=0){
    /* 传入玩家组,默认返回第一个精灵
    *  如果传入玩家精灵,直接返回
    * */
    let player = playerG.children[index];
    if(!player){
        player = playerG;
    }
    return player;
};
RW.methods.getSpritesFromSite = function(x, y, group=game.world, recursive=false, safe=5){
    /* 从一个组里, 且在这个位置上, 拿精灵, 返回列表
    *  如果指定了所属组,便从指定组中寻找, 如果没有便从世界开始查找
    * group: 可以是group对象, 也可以是数组
    * recursive: 递归查找吗
    * safe: 递归深度,为0则为无限.
    * */

    if(safe > 0){
        var newsafe = safe-1 == 0? -1: safe-1;
    }else if(safe < 0){
        return [];
    }else if(safe == 0){
        var newsafe = safe;
    }
    var sprites = [];
    if(group){
        group.forEach(function(s){
            if(!s.alive){
                return;
            }
            // console.log(s.x,s.y)
            if(s.children.length && recursive){
                var ss = RW.methods.getSpritesFromSite(x,y,s,true,newsafe);
                sprite = sprite.concat(ss);
            }
            var site = RW.methods.getSpriteSite(s);
            if(site.x == x && site.y == y){
                /* or
                *     s.relx == x && s.rely == y
                * */
                sprites.push(s);
            }
        });
    }
    return sprites;
};
RW.methods.destroySprite = function(sprite){
    sprite.destroy();
};

RW.methods.README = function(config){
    RW.update.listenKey.stopListenKey();

    let w = WIDTH * 0.8;
    let h = HEIGHT * 0.8;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - h) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+config.bgColor.slice(1), 0.9);
    bar.drawRect(x, y, w, h);

    let style = { font: "bold "+config.font.size+"px Arial",
        fill: config.font.color,
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let style2 = { font: "bold "+Tile.height/4+"px Arial",
        fill: 'rgb(1,1,1)'
    };
    let text = game.add.text(WIDTH/2, y*1.2, config.text, style);
    text.anchor.set(0.5,0);
    let text2 = game.add.text(x+w-Tile.width/2, y+h-Tile.height/2, "click to continue", style2);
    text2.anchor.set(1,1);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    bar.events.onInputDown.add(function(){
        bar.destroy();
        text.destroy();
        text2.destroy();
        RW.update.listenKey.startListenKey();
    });
};
RW.methods.WIN = function(str,func,that=RW.DeveloperModel){
    game.input.keyboard.stop();

    let w = WIDTH * 0.5;
    let h = HEIGHT * 0.5;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - w) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+RW.Side.x/4+"px Arial", fill: "#0037f1",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let text = game.add.text(WIDTH/2, y*1.2, "You Win\n"+str, style);
    text.anchor.set(0.5,0);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    bar.events.onInputDown.add(func,that);
};
RW.methods.fullScreen = function(){
    var element = document.documentElement;
    if (element.requestFullscreen) {
        // W3C
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        // msie
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        // firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        // chrome
        element.webkitRequestFullscreen();
    }
};
RW.methods.exitFullscreen = function(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};


/* ================ update ==============================*/
/*
APG.update = {};
APG.update.listenKey = {};
APG.update.listenKey.keyEventList = [];
*/
RW.update.listenKey.stopListenKey = function(){
    game.input.keyboard.stop();
};
RW.update.listenKey.startListenKey = function(){
        game.input.keyboard.start();
};
RW.update.listenKey.setMoveKey = function(direction, key){
    /*  修改移动按键 */
    var direction = direction.toUpperCase();
    var key = key.toUpperCase();
    RW.Keys.move[direction] = key;
};
RW.update.listenKey.addKeyEvent = function(key, feedback, context, that=RW.DeveloperModel){
    RW.update.listenKey.keyEventList.push({
        key: key,
        feedback: feedback,
        context: context,
        that: that,
    });
};
RW.update.listenKey.characterMoveEvent = function(playerG, role, resolve, resolveContext, reject, rejectContext, that=RW.DeveloperModel) {
    /* resolve: function 移动成功执行函数,执行函数
    *  resolveContext: list resolve函数的参数,列表形式
    * */
    for (var k in RW.Keys.move) {
        if (RW.Keys[RW.Keys.move[k]].justDown) {
            console.log(k+" is justDown.")
            var playerGroup = playerG;
            var player = RW.methods.getPlayerSprite(playerGroup);

            /* 设置方向 */
            player.direction.x = RW.UDLRDir[k].x;
            player.direction.y = RW.UDLRDir[k].y;

            var nowSite = RW.methods.getPlayerSite(player);

            /* 预设新的相对坐标 */
            var newX = nowSite.x + player.direction.x;
            var newY = nowSite.y + player.direction.y;

            {
                //  ====== 检测玩家是否可走 =====
                var canMove = true;
                /* 地图超出 */
                if (RW.update.collideWorldBounds) {
                    if (newX < 0 || newY < 0 || newX >= MapArea.rows || newY >= MapArea.columns) {
                        canMove = false;
                    }
                }
                /* 检测组碰撞 */
                RW.update.collision.block.playerGroupList.forEach(
                    function (object) {
                        if (object.group) {
                            object.group.forEach(function (sprite) {
                                var site = RW.methods.siteDecode(newX, newY);
                                if (site.x == sprite.x && site.y == sprite.y) {
                                    canMove = false;
                                    if (object.feedback) {
                                        object.feedback.apply(that, [playerGroup, sprite]);
                                    }
                                }
                            })
                        }
                    });

                /* 检测砖块碰撞 */
                RW.update.collision.block.playerTileList.forEach(
                    function (object) {
                        var tile = RW.methods.getTilefromSite(newX, newY);
                        if (tile && tile.index == object.tileIndex) {
                            canMove = false;
                            if (object.feedback) {
                                object.feedback.apply(that, [playerGroup, sprite]);
                            }
                        }
                    });

                /* 调用用户自定义规则,根据返回值判断能否走,
                 * 可以覆盖以上规则 (?合适不)
                 * 如果没有返回值, 则canMove不变
                 */
                if (role) {
                    var flag = role.apply(that,[newX, newY]);
                    canMove = flag == undefined ? canMove : flag;
                }

                /* 无论能不能走, 都变化方向动画 */
                RW.methods.animations(playerGroup, k, RW.players[0].animations.move[k], 1);
                if (canMove) {
                    console.log('player move from ' + nowSite.x + ", " + nowSite.y + " to " + newX + ", " + newY);
                    RW.methods.setPlaySite(playerGroup, newX, newY);
                    if (resolve) {
                        resolve.apply(that, resolveContext);
                    }
                } else {
                    console.log('player can\'t move.');
                    if (reject) {
                        reject.apply(that, rejectContext);
                    }
                }
            }
        }
    }
};

RW.update.bag = function(){
    /* 更新背包中的物品信息, 和数量对应 */
    for(item of RW.bag.items){
        item.number = item.group.children.length;
        item.text.setText(item.number);
    }
};

/* 边界碰撞,默认不开
* 用于玩家移动检测
*  */
/*APG.update.collideWorldBounds = false;*/
RW.update.setCollideWorldBounds = function(f){
    RW.update.collideWorldBounds = f;
};

/*APG.update.collision = {};*/
/* 碰撞检测之禁止覆盖 */
RW.update.collision.block = {
    GroupList: [],        /* 需要检测的团队列表 */
    TileList: [],         /* 需要检测的瓷砖列表 */
    playerGroupList: [],  /* 需要检测的团队列表（对于玩家） */
    playerTileList: [],   /* 需要检测的瓷砖列表（对于玩家） */
};

/* 碰撞检测之覆盖后果 */
RW.update.collision.active = {
    GroupList: [],        /* 需要检测的团队列表 */
    TileList: [],         /* 需要检测的瓷砖列表 */
    playerGroupList: [],  /* 需要检测的团队列表（对于玩家） */
    playerTileList: [],   /* 需要检测的瓷砖列表（对于玩家） */
};

RW.update.collision.blockTileOverlap = function(group, tileIndex, feedback, context, that=RW.DeveloperModel){
    if(group == RW.CharacterGroups.player){
        RW.update.collision.block.playerTileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }else{
        RW.update.collision.block.TileList.push({
            group: group,
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }
};

RW.update.collision.blockGroupOverlap = function(group1, group2, feedback, context, that=RW.DeveloperModel) {
    if (group1 == RW.CharacterGroups.player) {
        RW.update.collision.block.playerGroupList.push({
            group: group2,
            feedback: feedback,
            context: context,
            that: that,
        });
    }else{
        RW.update.collision.block.GroupList.push({
            group1: group1,
            group2: group2,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }
};

RW.update.collision.activeGroupOverlap = function(group1, group2, feedback, context, that=RW.DeveloperModel){
    var obj = {
        actor: "",
        feedback: feedback,
        // isCollided: false,
        context: context,
        that: that,
    };
    obj.group1 = group1;
    obj.group2 = group2;
    if (group1 == RW.CharacterGroups.player) {
        obj.actor = "player";
    }
    RW.update.collision.active.GroupList.push(obj);
};
RW.update.collision.activeTileOverlap = function(group, tileIndex, feedback, context, that=RW.DeveloperModel){
    if(group == RW.CharacterGroups.player){
        RW.update.collision.active.TileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }else{
        RW.update.collision.active.TileList.push({
            group: group,
            tileIndex: tileIndex,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }
};

// =========================
// ========= 施工中 ==========

RW.update.collision.isCollided = function(group1, group2){

};




