console.log("APG-core.js has been loaded successfully.")

window.onload=function() {
    WIDTH = globalConfig.WIDTH? globalConfig.WIDTH: window.screen.width;
    HEIGHT = globalConfig.HEIGHT? globalConfig.HEIGHT: window.screen.height;
    MODE = globalConfig.MODE? globalConfig.MODE: 'CANVAS';

    APG.WIDTH = WIDTH;
    APG.MODE = MODE;
    APG.HEIGHT = HEIGHT;

    game = new Phaser.Game(WIDTH,HEIGHT,MODE, '');
    game.state.add('bootstrap', bootstrap);
    game.state.start('bootstrap');
};
var game;

var WIDTH;
var HEIGHT;
var MODE;

var TileMapJson;   /* 用于存贮地图配置 */

var APG = {};
APG.WIDTH;
APG.MODE;
APG.HEIGHT;

APG.MapArea = {};

APG.Assets = {};   /* 暂存帧贴图 */
APG.Assets.music = {};
APG.Assets.background = {};
APG.Assets.mapImg = null;
APG.Tile = {};
APG.Tilemap = null;
APG.Layer = null;

/* update的检测速度,(收效甚微) */
APG.FPS = 20;
APG.FPSRate = 0;
APG.DeveloperModel = null;
APG.Keys = {};
APG.Keys.move = {
    UP:    'UP',
    DOWN:  'DOWN',
    LEFT:  'LEFT',
    RIGHT: 'RIGHT',
};
APG.UDLRDir = {
    UP:    {x: 0, y:-1},
    DOWN:  {x: 0, y: 1},
    LEFT:  {x:-1, y: 0},
    RIGHT: {x: 1, y: 0},
};

APG.TargetGroups = {};
APG.CharacterGroups = {};
/* 背包xi*/
APG.Bag = {};
APG.Bag.BagBar = {};
APG.Bag.capcity = 0;
APG.Bag.size = 0;
APG.Bag.items = [];
APG.Bag.views = [];

APG.Methods = {};
APG.Update = {};
APG.Update.listenKey = {};
APG.Update.listenKey.keyEventList = [];

APG.Update.collideWorldBounds = false;
APG.Update.collision = {};
APG.Update.collision.block = {};

APG.Game = {};
APG.Sprite = {};
APG.Group = {};
APG.Target = {};
APG.Character = {};

var bootstrap = {
    init: function () {
        if (!(globalConfig.ScaleMode == "EXACT_FIT")){
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }
        game.scale.scaleMode = Phaser.ScaleManager[globalConfig.ScaleMode];
        game.scale.refresh();
    },
    preload: function() {

        game.load.json('mazajson', globalConfig.Assets.tileMap.tileMapJson);
    },
    create: function(){
        /* 地图配置文件 */
        TileMapJson = game.cache.getJSON('mazajson');
        console.log(TileMapJson)

        /* 背包系统 */
        if(globalConfig.BagSystem && globalConfig.BagBar){
            globalConfig.BagBar.w = globalConfig.BagBar.w? globalConfig.BagBar.w: 0.2;
            globalConfig.BagBar.h = globalConfig.BagBar.h? globalConfig.BagBar.h: 1;
            APG.Bag.BagBar = {
                w: globalConfig.BagBar.w<=1? globalConfig.BagBar.w*WIDTH:  globalConfig.BagBar.w,
                h: globalConfig.BagBar.h<=1? globalConfig.BagBar.h*HEIGHT: globalConfig.BagBar.h,
            };
            APG.Bag.BagBar.x = APG.WIDTH - APG.Bag.BagBar.w;
            APG.Bag.BagBar.y = 0;
        }

        /* 地图区域 */
        APG.MapArea = {
            x: globalConfig.MapArea.x<=1? globalConfig.MapArea.x*WIDTH:  globalConfig.MapArea.x,
            y: globalConfig.MapArea.y<=1? globalConfig.MapArea.y*HEIGHT: globalConfig.MapArea.y,
            // height: HEIGHT * 0.8,
            rows: 0,   /* 棋盘世界的行列数*/
            columns: 0,
        };
        let bagW = globalConfig.BagBar.w<=1? globalConfig.BagBar.w*APG.WIDTH:  globalConfig.BagBar.w;
        APG.MapArea.width = APG.WIDTH - APG.MapArea.x
        APG.MapArea.width -= globalConfig.BagSystem? bagW: 0;
        APG.MapArea.width -=     APG.MapArea.width / TileMapJson.width / 2;
        APG.MapArea.height = APG.HEIGHT - APG.MapArea.y;
        APG.MapArea.offsetX = APG.MapArea.x;
        APG.MapArea.offsetY = APG.MapArea.y;

        console.log(APG.MapArea)
        /* Tile大小, 强制方形 */
        var side = Math.min(APG.MapArea.height / TileMapJson.height,
            APG.MapArea.width  / TileMapJson.width);
        APG.Tile.width = side;
        APG.Tile.height = side;
        console.log("APG.Tile side: " + side);

        /* =================================================
         * 使用新的除去旧的, 算出需要对对象拉伸的量,
         * 因为对象的大小是根据旧 地图配置中的 tileheight,tilewidth 来算的
         * */
        APG.Tile.scale = Math.min(APG.Tile.width / TileMapJson.tilewidth,
            APG.Tile.height / TileMapJson.tileheight);
        console.log("APG.Tile.scale: " + APG.Tile.scale);

        /* =================================================
            更新地图贴图url */
        let imgSrc = globalConfig.Assets.mapImg.imgUrl;
        let width = APG.Tile.width * TileMapJson.tilesets[0].columns;
        let height = APG.Tile.height * (TileMapJson.tilesets[0].tilecount / TileMapJson.tilesets[0].columns);
        console.log(width,height);
        autoResizeImg(imgSrc, width, height).then(function(newImg) {
            APG.Assets.mapImg = newImg.src;
            TileMapJson.tilesets[0].image = newImg.src;
            TileMapJson.tilesets[0].imageheight = newImg.height;
            TileMapJson.tilesets[0].imagewidth = newImg.width;
            TileMapJson.tilesets[0].tileheight = APG.Tile.height;
            TileMapJson.tilesets[0].tilewidth = APG.Tile.width;

            /* 加载资源必须等到图片处理结束之后 */
            game.state.add("preload",preload);
            game.state.start("preload");
        });
    }
};

var preload = {
    init: function (){
        /* 基础参数 */


        /* 根据实际环境, 更新了瓷砖大小 */
        TileMapJson.tileheight = APG.Tile.height;
        TileMapJson.tilewidth =  APG.Tile.width;

        /* 根据实际环境, 更新了地图区域信息 */
        APG.MapArea.width = APG.Tile.width * TileMapJson.width;
        APG.MapArea.height = APG.Tile.height * TileMapJson.height;
        APG.MapArea.rows = APG.MapArea.width / APG.Tile.width;
        APG.MapArea.columns = APG.MapArea.height / APG.Tile.height;
    },
    preload: function(){
        /* load JavaScript */
        let scripts = document.getElementsByTagName("script");
        console.log(scripts)
        let path;
        for(i=0;i<scripts.length;i++){
            let file = scripts[i].getAttribute("src");
            if(file && file.substring(file.lastIndexOf('/')+1, file.lastIndexOf('.')) == "APG-core"){
                path = file.substring(0, file.lastIndexOf('/')+1);
            }
        }
        console.log("js path: " + path);
        if(path && APG.Assets.scripts){
            APG.Assets.scripts.forEach(function(s){
                game.load.script(s, path + s + ".js");
            });
        }


        /* load Assets */
        let Assets = globalConfig.Assets;
        game.load.image(Assets.mapImg.imgKey,     APG.Assets.mapImg);
        game.load.tilemap('Tilemap', null, TileMapJson, Phaser.Tilemap.TILED_JSON);

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
        APG.Assets.spritesheets = this.spritesheets;
    },
    create: function () {
        game.state.add("startGame",startGame);
        game.state.start("startGame");
    },
};

var startGame = {
    init: function(){
        APG.DeveloperModel = eval(globalConfig.DeveloperModel);   /*回调上下文全局对象，默认YourGame*/
        /*==== 按键 ======*/
        var defaultKays = ['cursors'];
        for(key of globalConfig.Keys.concat(defaultKays)){
            if(key == 'cursors'){
                var k = game.input.keyboard.createCursorKeys();
                for(i in k){
                    APG.Keys[i.toUpperCase()] = k[i];
                }
            }else{
                var k = game.input.keyboard.addKey(Phaser.Keyboard[key]);
                APG.Keys[key] = k;
            }
        }

        /* 你的 init */
        if(APG.DeveloperModel.init){
            APG.DeveloperModel.init.apply(APG.DeveloperModel);
        }
    },
    preload: function(){
        /* 这里就放一些补充的材料, 还有你的 */
        /* 重新载入帧动画贴图 */
        let spritesheets = APG.Assets.spritesheets;
        for(i=0;i<spritesheets.length;i++) {
            var ss = spritesheets[i];
            var a = game.cache.getImage(ss.imgKey);
            game.load.spritesheet(ss.imgKey, ss.imgUrl,
                a.width / ss.columns, a.height / ss.rows);
        }
        APG.Assets.spritesheets = [];

        /* 你的 preload */

        if(APG.DeveloperModel.preload){
            APG.DeveloperModel.preload.apply(APG.DeveloperModel);
        }
    },
    create: function(){
        console.log("startGame  create.")
        let Assets = globalConfig.Assets;
        var bg = game.add.tileSprite(0,0,game.width,game.height,Assets.background.imgKey);
        bg.autoScroll(Assets.background.scrollX,Assets.background.scrollY);
        APG.Assets.background[Assets.background.musicKey] = bg;

        let music = game.add.audio(Assets.music.musicKey);
        // music.play();
        APG.Assets.music[Assets.music.musicKey] = music;

        APG.Tilemap = game.add.tilemap('Tilemap');
        /* 第一个参数是json中的tileset名, 第二个参数是地图贴图的key
        ** 推荐这两个名字取得一样
        */
        APG.Tilemap.addTilesetImage(Assets.mapImg.imgKey, Assets.mapImg.imgKey);
        APG.Layer = APG.Tilemap.createLayer("layer1", APG.MapArea.width, APG.MapArea.height);
        APG.Layer.fixedToCamera = false;
        APG.Layer.position.set(APG.MapArea.x, APG.MapArea.y);
        APG.Layer.resizeWorld();


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
            APG.Tilemap.createFromObjects('Object Layer' ,obj.gid ,
                imgKey , frameId, true, false, group, Phaser.Sprite, false);
            console.log(group)
            /* 对 textbitmap 对象的特殊处理 */
            if (imgMode == 'textbitmap') {
                group.forEach(function(s) {
                    let bg = s[0].bgColor;
                    let text = s[0].text;
                    if (bg && text) {
                        APG.Target.loadTextBitMap(s, text, bg);
                    }
                });
            }

            group.enableBody = true;
            group.forEach(function(s){
                s.x *= APG.Tile.scale;
                s.y *= APG.Tile.scale;
                /*相对距离,相对于APG.MapArea, 棋盘坐标*/
                s.relx = s.x / APG.Tile.width;
                s.rely = s.y / APG.Tile.height;

                s.x += APG.MapArea.x;
                s.y += APG.MapArea.y;
                s.scale.setTo(1);
                s.scale.setTo(APG.Tile.width / s.width,
                    APG.Tile.height / s.height);
                console.log(s.x+","+s.y+" -> "+s.relx+","+s.rely);
                s.anchor.setTo(-(APG.Tile.width - s.width)/2 / s.width,
                    -(APG.Tile.height - s.height)/2 / s.height);
                s[0].imgMode = imgMode;

                /* 将对象的物理检测体缩小,不然可能会在瓷砖边上就碰撞 */
                game.physics.enable(s, Phaser.Physics.ARCADE);
                APG.Sprite.setBody(s,0.6,0.6,0.2,0.2);
            });
            /* 标识名 */
            let keyName = group.children[0][0].keyName;
            group.name = keyName;
            APG.TargetGroups[keyName] = group;
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
            let imgMode = globalConfig.Assets.spritesImg.find(function(s){
                return s.imgKey == objPro[0].imgKey;
            }).imgMode;

            APG.Tilemap.createFromObjects('Character Layer' ,1 ,
                imgKey , 0, true, false, characterGroup, Phaser.Sprite, false);
            characterGroup.forEach(function(s){
                s.x *= APG.Tile.scale;
                s.y *= APG.Tile.scale;

                s.relx = s.x / APG.Tile.width;
                s.rely = s.y / APG.Tile.height;

                s.oldx = s.relx;
                s.oldy = s.rely;

                s.x += APG.MapArea.x;
                s.y += APG.MapArea.y;
                s.scale.setTo(1);
                s.scale.setTo(Math.min(APG.Tile.width / s.width, APG.Tile.height / s.height));
                /* 设置人物方向 */
                s.direction = {x:0,y:0};
                // s.x += (APG.Tile.width - s.width ) / 2;
                // s.y += (APG.Tile.height- s.height) / 2;
                s.anchor.setTo(-(APG.Tile.width - s.width)/2 / s.width,
                    -(APG.Tile.height - s.height)/2 / s.height);
                console.log(s.x+","+s.y+" -> "+s.relx+","+s.rely);

                s[0].imgMode = imgMode;

                game.physics.enable(s, Phaser.Physics.ARCADE);
                APG.Sprite.setBody(s,0.8,0.8,0.1,0.1);
            });
            let keyName = characterGroup.children[0][0].keyName;
            characterGroup.name = keyName;
            APG.CharacterGroups[keyName] = characterGroup;
            console.log("create successfully: "+keyName);
        }
        console.log("Character Groups has been established successfully.");



        /* 背包系统*/
        if(globalConfig.BagSystem){
            APG.Bag.setBagCapacity(10);
            APG.Bag.showBagBar();
        }

        if(globalConfig.FullScreen) {
            APG.Game.fullScreen();
        }

        /* 你的创造 */
        if(APG.DeveloperModel.create){
            APG.DeveloperModel.create.apply(APG.DeveloperModel);
        }

        if(globalConfig.README){
            APG.Game.README(globalConfig.README);
        }
    },
    update: function(){
        APG.FPSRate++;
        if (APG.FPSRate == (60/APG.FPS)){
            APG.FPSRate = 0;
            this.updateExec();
        }
    },
    updateExec: function(){
        for(let object of APG.Update.collision.active.GroupList){
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

        for(let object of APG.Update.collision.active.playerGroupList){
            let player = APG.CharacterGroups.player;  // APG.players[0].group;
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

        APG.Update.listenKey.keyEventList.forEach(function(object){
            if(APG.Keys[object.key].justDown){
                console.log(object.key + " is justDown.")
                object.feedback.apply(object.that, [object.context]);
            }
        });

        if(globalConfig.BagSystem){
            APG.Update.bag();
        }

        /* 你的更新 */
        if(APG.DeveloperModel.update){
            APG.DeveloperModel.update.apply(APG.DeveloperModel);
        }
    },
    render: function(){
    }
};

//================================================================
//================================================================
//================================================================


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
                // setTimeout(function() {
                // },1000);
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



console.log("Assets.js has been loaded successfully.")

/* ==========    Assets ====================  */
/* music */
APG.Assets.playMusic = function(keyName){
    APG.Assets.music[keyName].play('',0,1,true);
    console.log("Play music: "+keyName);
};

APG.Assets.stopMusic = function(keyName){
    /* 如果没有传入名称,则全部停止 */
    let musics = keyName? {keyName:APG.Assets.music[keyName]}: APG.Assets.music;
    for(m in musics){
        APG.Assets.music[m].stop();
        console.log("Stop music: "+keyName);
    }
};

/* 动画 */
APG.Assets.setAnimations = function(obj, name, frames, frameRate=1, loop=false){
    /*
    * 添加动画, 并播放.
    * group: 可以是组,也可以是精灵
    * frames: 从0开始?
    * name: 动作名
    * */
    if(!obj.forEach){
        let s = obj;
        if(frames){
        }
        if(!s.animations.getAnimation(name)){
            s.animations.add(name,frames);
        }
        s.animations.play(name, frameRate, loop);
    }else{
        let group = obj;
        group.forEach(function(s){
            if(!s.animations.getAnimation(name)) {
                s.animations.add(name, frames);
            }
            s.animations.play(name, frameRate, loop);
        });
    }
};
APG.Assets.playerMoveAnimations = function(playerG, obj){
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

    }
    if(playerG.animations){
        playerG.animations.add(I, move[I], 1);
        playerG.Assets.move = move;
    }else{
        playerG.forEach(function(s){
            s.animations.add(I, move[I], 1);
            s.Assets = {};
            s.Assets.move = move;
        });
        playerG.Assets = {};
        playerG.Assets.move = move;
    }
};
APG.Assets.getFrame = function(obj){
    /* 根据传入的精灵或组,返回此精灵当前的动画的frameId */
    if(obj.animations){
        /* sprite */
        return obj.animations.frame;
    }else{
        /* group or sprite List*/
        var frames = [];
        obj.forEach(function(s){
            frames.push(s.animations.frame);
        });
        return frames;
    }

};


console.log("Bag.js has been loaded successfully.")

/*APG.Bag.views = [];*/
APG.Bag.showBagBar = function(){
    let w = APG.Bag.BagBar.w;
    let h = APG.Bag.BagBar.h;
    let x = (WIDTH - w);
    let y = 0;
    var bar = game.add.graphics();
    bar.beginFill('0x'+'#87df00'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);
    APG.Bag.views.push(bar);
    console.log(APG.Bag.BagBar)


    var style = { font: "bold "+APG.WIDTH/40+"px Arial", fill: "#00124f",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    var text = game.add.text(x,y, "背包系统\n", style);
    APG.Bag.views.push(text);

    // text.anchor.set(0.5,0);

    /* 默认最大容量是初始化的1倍 */
    // APG.Bag.capcity = APG.Bag.size;
};
APG.Bag.hiddenBagBar = function(){
    APG.Bag.views.forEach(function(s){
        s.destroy();
    });
};
APG.Bag.destroyBagBar = function() {
    APG.Bag.hiddenBagBar();
    APG.Bag.items.forEach(function(s){
        console.log(s)
        s.imgObj.destroy();
        s.textObj.destroy();
    });
    APG.Bag.capcity = 0;
    APG.Bag.size = 0;
    APG.Bag.items = [];
    APG.Bag.views = [];
};

APG.Bag.addItem = function(sprite, number) {

    var number = number? number: 1;
    let text = game.add.text(0,0, number);
    sprite.kill();
    text.kill();

    console.log(sprite)
    APG.Bag.items.unshift({
        imgObj: sprite,
        textObj: text,
        itemName: sprite[0].keyName, /* 物品名字,用于查找*/
        imgMode: sprite[0].imgMode,
        imgKey: sprite[0].imgKey,    /*  图片名*/
        frameId: sprite[0].frameId? sprite[0].frameId: sprite.frame,  /* 如果是帧动画, 帧的id */
        number: number,    /*  初始数量*/
    });
    APG.Bag.size += number;
};


/**
 * 从背包里把第一个东西拿出去
 * @param x 坐标是相对的
 * @param y
 * @param group 放置的精灵的所属的组
 */
APG.Bag.putItem = function(x, y, group) {
    console.log(APG.Bag.size);
    if(APG.Bag.size){
        let item = APG.Bag.items[0];
        let imgObj = item.imgObj[0];
        let sprite;
        if(item.imgMode == "textbitmap") {
            sprite = APG.Target.addTextBitMap(x, y, imgObj.text, imgObj.bgColor);
        }else{
            sprite = APG.Sprite.addSprite(x,y,imgObj.imgKey, imgObj.frameId, group, imgObj.keyName);
        }
        if(!group){
            var group = APG.Group.getTargetGroup(imgObj.keyName);
            console.log(group)
            if(group){
                group.add(sprite);
            }
        }
        if(0 == --item.number){
            APG.Bag.items[0].imgObj.destroy();
            APG.Bag.items[0].textObj.destroy();
            APG.Bag.items.splice(0,1);
        }

        APG.Bag.size --;
        console.log(sprite)
        return sprite;
    }
};

APG.Bag.getItem = function(spriteList) {
    /* 把东西放到背包里
     * 按照对象的keyName分组
     **/
    if(!spriteList.forEach){
        var spriteList = [spriteList];
    }
    spriteList.forEach(function(sprite){
        /* 确保容量够用 */
        // console.log(APG.Bag.size)
        // console.log(APG.Bag.capcity)
        if(APG.Bag.size < APG.Bag.capcity) {
            var item = APG.Bag.items.find(function(b){
                return b.itemName == sprite[0].keyName;
            });
            /* 如果背包中存在,并且不是 textbitmap*/
            if(item && sprite[0].imgMode != 'textbitmap'){
                item.number ++;
                APG.Bag.size ++;
            }else if(!item || sprite[0].imgMode == 'textbitmap'){
                let s;
                if(sprite[0].imgMode == 'textbitmap'){
                    s = APG.Target.addTextBitMap(0,0,sprite[0].text, sprite[0].bgColor);
                }else{
                    s = APG.Sprite.addSprite(0,0,sprite[0].imgKey,sprite[0].frameId,null,sprite[0].keyName);
                }

                s[0] = JSON.parse(JSON.stringify(sprite[0]));
                APG.Bag.addItem(s,1);
            }

            sprite.destroy();    /* 地面上没有物品了 */
        }
    });
};


/**
 * 把东西丢掉
 */
APG.Bag.dropItem = function(){
    if(APG.Bag.size) {
        let item = APG.Bag.items[0];
        if (--item.number == 0) {
            APG.Bag.items[0].imgObj.destroy();
            APG.Bag.items[0].textObj.destroy();
            APG.Bag.items.splice(0, 1);
        }
        APG.Bag.size--;
    }
};

APG.Bag.getItemNum = function(itemName){
    let item = APG.Bag.items.find(function(b){
        return b.itemName == itemName;
    });
    return item? item.number: 0;
};
APG.Bag.setBagCapacity = function(n){
    APG.Bag.capcity = n;
};
APG.Bag.getBagCapacity = function(){
    return APG.Bag.capcity;
};
APG.Bag.getBagSize = function(){
    return APG.Bag.size;
};
APG.Bag.getBagFirst = function(){
    /* 得到当前背包第一个物品组 */
    if(items.length){
        return APG.Bag.items[0];
    }
};
APG.Bag.goDownItems = function(){
    /* 背包物品组向后（下）移动 */
    if(APG.Bag.items.length){
        APG.Bag.items = APG.Bag.items.concat(APG.Bag.items.splice(0,1));
    }
};
APG.Bag.goUpItems = function() {
    /* 背包物品组向前（上）移动 */
    if(APG.Bag.items.length) {
        APG.Bag.items = APG.Bag.items.splice(APG.Bag.items.length-1,1).concat(APG.Bag.items);
    }
};

APG.Bag.updateBag = function(){
    /* 更新背包中的物品信息, 和数量对应 */

    let w = APG.Bag.BagBar.w;
    let h = APG.Bag.BagBar.h;
    let x = (WIDTH - w);
    let y = 0;

    var items = APG.Bag.items;
    var barX = x + w*0.1;
    var barY = y + h*0.1;
    var barSide = Math.min((APG.Bag.BagBar.h - barY -  APG.Tile.height/2) / (items.length*1.1),
        APG.Bag.BagBar.w /2.5);
    var styleOfNum = {
        font: "bold "+barSide*0.8+"px Arial",
        fill: "#00124f",
        boundsAlignH: "center",
    };


    for(i = 0;i<items.length;i++){
        // game.add.sprite(barX,barY,items[i].imgKey, items[i].frameId);
        var img = items[i].imgObj;
        img.x = barX;
        img.y = barY;
        img.height = barSide;
        img.width = barSide;
        img.revive();
        // APG.Bag.views.push(img);
        // game.add.text(barX+barSide*1.1,barY, items[i].number, styleOfNum);
        var text = items[i].textObj;
        text.setText(items[i].number);
        text.setStyle(styleOfNum);
        text.x = barX + barSide * 1.3;
        text.y = barY;
        text.revive();
        // APG.Bag.views.push(text);

        // console.log (APG.Bag.views)
        barY += barSide*1.1;
    }
};
console.log("Character.js has been loaded successfully.")

/* 角色 */
APG.Character.getCharacterSprite = function(playerG, index=0){
    /* 传入角色组,默认返回第一个精灵
    *  如果传入角色精灵,直接返回
    *  如果传入
    * */
    let player = playerG.children[index];
    if(!player){
        player = playerG;
    }
    return player;
};
APG.Character.getCharacterSite = function(playerObj, index=0){
    /* 得到单个玩家的相对坐标,相对于地图Area
    *  默认取得角色组里的第一个角色
    *  可以传入玩家精灵
    * */
    var player = playerObj.children[index];
    if(!player){
        player = playerObj;
    }
    return APG.Sprite.getSpriteSite(player);
};
APG.Character.getCharacterDirection = function(playerObj) {
    /* 玩家方向, */
    let player = APG.Character.getCharacterSprite(playerObj);
    return player.direction;
};
APG.Character.getCharacterTile = function(player){
    /* 得到玩家所处瓷砖 */
    var site = APG.Character.getCharacterSite(player);
    var tile = APG.Tile.getTileFromSite(site.x, site.y);
    return tile;
};
APG.Character.getCharacterSiteAll = function(character){
    /* 返回角色组的坐标列表,相对坐标,相对于地图Area */
    var site = [];
    APG.CharacterGroups[character].forEach(function(cha){
        site.push(APG.Sprite.getSpriteSite(cha));
    });
    return site;
};
APG.Character.setCharacterSite = function(playerGroup, x, y){
    /* 对玩家组中的第一个精灵设置相对位置,相对于APG.MapArea
    * 传入的坐标是相对坐标*/
    var player = APG.Character.getCharacterSprite(playerGroup);
    var nowSite = APG.Character.getCharacterSite(playerGroup);
    player.oldx = nowSite.x;
    player.oldy = nowSite.y;

    player.relx = x;
    player.rely = y;

    var site = APG.Sprite.siteDecode(x,y);
    player.x = site.x;
    player.y = site.y;
};
APG.Character.moveCharacter = APG.Character.setCharacterSite;


console.log("Game.js has been loaded successfully.")

/* 界面 */
APG.Game.getGameWIDTH = function(){
    return APG.WIDTH;
};
APG.Game.getGameHEIGHT = function(){
    return APG.HEIGHT;
};
APG.Game.getGameMODE = function(){
    return APG.MODE;
};

APG.Game.README = function(config){
    APG.Update.listenKey.stopListenKey();

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
    let style2 = { font: "bold "+config.font.size/2+"px Arial",
        fill: 'rgb(1,1,1)'
    };

    let str = '';
    let columnCount = parseInt(style.wordWrapWidth / config.font.size);
    for(let i=0;i<config.text.length;i++){
        if((i+1) % columnCount == 0){
            str += '\n';
        }
        str += config.text[i];
    }
    config.text = str;
    let text = game.add.text(WIDTH/2, y*1.2, config.text, style);
    text.anchor.set(0.5,0);
    let text2 = game.add.text(x+w-APG.Tile.width/2, y+h-APG.Tile.height/2, "click to continue", style2);
    text2.anchor.set(1,1);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    bar.events.onInputDown.add(function(){
        bar.destroy();
        text.destroy();
        text2.destroy();
        APG.Update.listenKey.startListenKey();
    });
};
APG.Game.WIN = function(str, func, that=APG.DeveloperModel){
    game.input.keyboard.stop();

    let w = WIDTH * 0.5;
    let h = HEIGHT * 0.5;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - w) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+APG.Tile.width+"px Arial", fill: "#0037f1",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let text = game.add.text(WIDTH/2, y*1.2, "You Win\n"+str, style);
    text.anchor.set(0.5,0);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    if(func){
        bar.events.onInputDown.add(func,that);
    }
};
APG.Game.LOST = function(str, func, that=APG.DeveloperModel){
    game.input.keyboard.stop();

    let w = WIDTH * 0.5;
    let h = HEIGHT * 0.5;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - w) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+APG.Tile.width+"px Arial", fill: "#0037f1",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let text = game.add.text(WIDTH/2, y*1.2, "You LOST\n"+str, style);
    text.anchor.set(0.5,0);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    if(func){
        bar.events.onInputDown.add(func,that);
    }
};
APG.Game.fullScreen = function(){
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
APG.Game.exitFullscreen = function(){
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
APG.Game.restartGame = function(){
    APG.Bag.destroyBagBar();
    APG.Assets.stopMusic();
    APG.Tilemap.destroy();
    APG.Layer.destroy();
    game.state.restart();

    for(m in APG.CharacterGroups) {
        APG.CharacterGroups[m].destroy();
        APG.CharacterGroups[m].removeAll();
    }
    for(m in APG.TargetGroups) {
        APG.TargetGroups[m].removeAll();
        APG.TargetGroups[m].destroy();
    }
};

console.log("Group.js has been loaded successfully.")

/* Group */
APG.Group.setGroup = function(){
    /*默认存在0个精灵, 默认key 为spritesheet, index 从1开始*/
    var group = game.add.group();
    group.enableBody = true;
    game.physics.arcade.enable(group);
    return group;
};
APG.Group.moveGroupUpTo = function(groupUp, groupDown){
    /* 移动 groupUp 对象到 groupDown 对象上面*/
    while(groupUp.z<=groupDown.z){
        game.world.moveUp(groupUp);
        console.log(groupUp.z, groupDown.z)
    }
};
APG.Group.moveGroupDownTo = function(groupDown, groupUp){
    /* 移动 groupDown 对象到 groupUp 对象下面*/

    while(groupDown.z >= groupUp.z){
        game.world.moveDown(groupDown);
    }
};
APG.Group.getTargetGroup = function(name){
    return APG.TargetGroups[name];
};
APG.Group.getCharacterGroup = function(name){
    return APG.CharacterGroups[name];
};
console.log("Sprite.js has been loaded successfully.")

/* 精灵 */
APG.Sprite.addSprite = function(x, y, imgKey, frame, group, keyName){
    /* 新增一个精良在组中
    * imgKey: 对象贴图
    * frame: 贴图块id (begin with 1)
    * x,y: 相对位置
    * */
    var site = APG.Sprite.siteDecode(x,y);
    var s = game.add.sprite(site.x, site.y, imgKey, frame-1);
    // s.x += APG.MapArea.x;
    // s.y += APG.MapAre    a.y;
    s.scale.setTo(1);
    s.scale.setTo(Math.min(APG.Tile.width / s.width,
        APG.Tile.height / s.height));
    game.physics.enable(s, Phaser.Physics.ARCADE);
    APG.Sprite.setBody(s,0.6,0.6,0.2,0.2);
    s[0] = {
        keyName: keyName? keyName: imgKey,
        imgKey: imgKey,
        frameId: frame
    };
    if(group){
        group.add(s);
    }
    return s;
};
APG.Sprite.setSpriteSite = function(s, x, y){
    /*传入的是相对坐标,需要转换成绝对坐标*/
    var site = APG.Sprite.siteDecode(x,y);
    s.x = site.x;
    s.y = site.y;
};
APG.Sprite.getSpriteList = function(group){
    // group.getC
    return group.children;
};
APG.Sprite.getSpriteListFromSite = function(x, y, group=game.world, recursive=false, safe=5){
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
                var ss = APG.Sprite.getSpritesFromSite(x,y,s,true,newsafe);
                sprite = sprite.concat(ss);
            }
            var site = APG.Sprite.getSpriteSite(s);
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
APG.Sprite.destroySprite = function(sprite){
    sprite.destroy();
};
APG.Sprite.getSpriteSite = function(sprite){
    /* 得到一个精灵的相对坐标,相对于地图Area
    * */
    return APG.Sprite.siteCode(sprite.x,sprite.y);
};
APG.Sprite.siteDecode = function(x, y){
    /* 将相对地址变成绝对地址  */
    if(typeof x == "object"){
        var y = x.y;
        var x = x.x;
    }
    return {
        x: x * APG.Tile.width  + APG.MapArea.offsetX,
        y: y * APG.Tile.height + APG.MapArea.offsetY,
    }
};
APG.Sprite.siteCode = function(x, y){
    /* 将绝对地址变成相对地址  */
    if(typeof x == "object"){
        var y = x.y;
        var x = x.x;
    }

    let site = {
        x: (x - APG.MapArea.offsetX) / APG.Tile.width,
        y: (y - APG.MapArea.offsetY) / APG.Tile.height,
    };
    let about = function(num){
        return (num - Math.floor(num)) < (Math.ceil(num) - num)? Math.floor(num): Math.ceil(num);
    };

    site.x = about(site.x);
    site.y = about(site.y);
    return site;
};
/* 物理 */
APG.Sprite.setBody = function(s, ratew, rateh, ratex, ratey){
    /* 设置对象的物理检测体,传入的参数是比率 s*/
    s.body.setSize(
        s.width  / s.scale.x * ratew,
        s.height / s.scale.y * rateh,
        s.width  / s.scale.x * ratex,
        s.height / s.scale.y * ratey);
};

console.log("Target.js has been loaded successfully.")

/* Target.js */
/* TextBitMap 文字块对象*/
APG.Target.addTextBitMap = function(x,y, text, bg){
    /* 创建一个 TextBitMap */
    let sprite = APG.Sprite.addSprite(x,y);
    sprite[0].imgMode = "textbitmap";
    return APG.Target.loadTextBitMap(sprite,text,bg);
};
APG.Target.aboutTextBitMap = function(sprite){
    /* 如果传入一个非 TextBitMap精灵, 保证能返回一致的格式 */
    let s = sprite[0]? sprite[0]: {};
    return {
        text: s.text,
        bgColor: s.bgColor,
    }
};
APG.Target.loadTextBitMap = function(sprite, text, bgColor) {
    /* 将一个对象的贴图换做 TextBitMap, 如果未传入对象, 则创建一个
    *  会先清除之前的绑定文本 以及背景```````
    * */
    /*https://photonstorm.github.io/phaser-ce/Phaser.Text.html#alignTo*/

    if(sprite){
        var info = APG.Target.aboutTextBitMap(sprite);
    }else{
        var sprite = APG.Sprite.addSprite(0,0);
        var info = {};
    }

    if(info.text && !text){
        var text = info.text;
    }else if(!text){
        var text = "";
    }

    if(info.bgColor && !bgColor){
        var bgColor = info.bgColor;
    }else if(!bgColor){
        var bgColor = "#ffffff";
    }

    let bmd = game.add.bitmapData(APG.Tile.width, APG.Tile.height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,APG.Tile.width, APG.Tile.height);
    bmd.ctx.fillStyle = bgColor;
    bmd.ctx.fill();
    bmd.name = "bgColor";

    let rect = game.add.graphics(0, 0);
    let color = '0x'+bgColor.slice(1);
    color = 0xffffff - parseInt(color);
    rect.lineStyle(APG.Tile.width/20, color, 1);
    rect.drawRect(0,0,APG.Tile.width,APG.Tile.height);
    rect.name = "rect";

    let oldWidth = sprite.width;
    let oldHeight = sprite.height;

    if(!sprite){
        var sprite = game.add.sprite(0,0, bmd);
    }else{
        sprite.loadTexture(bmd);
    }

    let textColor = '#'+color.toString(16);
    let style = { font: "bold "+APG.Tile.width/2+"px Arial",
        fill: textColor,
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: APG.Tile.width * 0.8
    };

    var textObj = game.add.text(0, 0, text,style);
    textObj.name = "text";
    textObj.x = (APG.Tile.width - textObj.width) / 2;
    textObj.y = (APG.Tile.height - textObj.height) / 2;
    /* 删除原来的文本, 加入新的*/
    let crash = [];
    sprite.children.forEach(function(s){
        if(s.name == "text" || s.name == "rect"){
            crash.push(s);
        }
    });
    crash.forEach(function(s){
        s.destroy();
        sprite.removeChild(s);
    });
    crash = null;

    sprite.addChild(rect);
    sprite.addChild(textObj);
    sprite.scale.setTo(1);
    sprite.scale.setTo(oldWidth / sprite.width, oldHeight / sprite.height);
    /* 更新属性 */
    sprite[0].text = text;
    sprite[0].bgColor = bgColor;
    return sprite;
};
APG.Target.loadTextBitMapBetween = function(group, texts, bgs, start, end){
    /* 对一个组中的对象批量load
    *  未指定start 就以 0, 未指定 end 就按最后一个
    * */
    var start = start? start: 0;
    var end = end? end: group.children.length;
    for(let i = start;i<end;i++){
        let text = typeof texts == 'object'? texts[i]: texts;
        let bg = typeof bgs == 'object'? bgs[i]: bgs;
        text = text? text: null;
        bg = bg? bg : null;
        APG.Target.loadTextBitMap(group.children[i], text, bg);
    }
};
console.log("Tile.js has been loaded successfully.")

/* Tile 瓷砖*/
APG.Tile.getTileId = function(tile){
    return tile? tile.index: 0;
};
APG.Tile.changeTile = function(tile, tileId){
    tile.index = tileId;
    APG.Layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};
APG.Tile.getTileFromSite = function(x_or_site, y){
    if(typeof x_or_site == 'object'){
        var x = x_or_site.x;
        var y = x_or_site.y;
    }else{
        x = x_or_site;
    }
    var tile = APG.Tilemap.getTile(x, y);
    return tile;
};
APG.Tile.removeTile = function(tile){
    if(tile){
        APG.Tilemap.removeTile(tile.x, tile.y);
    }
};
APG.Tile.removeTileFromSite = function(x, y){
    APG.Tilemap.removeTile(x,y);
};
console.log("Update.js has been loaded successfully.")

/* ================ update ==============================*/
/*
APG.Update.= {};
APG.Update.listenKey = {};
APG.Update.listenKey.keyEventList = [];
*/
APG.Update.listenKey.stopListenKey = function(){
    game.input.keyboard.stop();
};
APG.Update.listenKey.startListenKey = function(){
    game.input.keyboard.start();
};
APG.Update.listenKey.setMoveKey = function(direction, key){
    /*  修改移动按键 */
    var direction = direction.toUpperCase();
    var key = key.toUpperCase();
    APG.Keys.move[direction] = key;
};
APG.Update.listenKey.addKeyEvent = function(key, feedback, context, that=APG.DeveloperModel){
    APG.Update.listenKey.keyEventList.push({
        key: key,
        feedback: feedback,
        context: context,
        that: that,
    });
};
APG.Update.listenKey.characterMoveEvent = function(playerG, role, resolve, resolveContext, reject, rejectContext, that=APG.DeveloperModel) {
    /* resolve: function 移动成功执行函数,执行函数
    *  resolveContext: list resolve函数的参数,列表形式
    * */
    for (var k in APG.Keys.move) {
        if (APG.Keys[APG.Keys.move[k]].justDown) {
            console.log(k+" is justDown.")
            var playerGroup = playerG;
            var player = APG.Character.getCharacterSprite(playerGroup);

            /* 设置方向 */
            player.direction.x = APG.UDLRDir[k].x;
            player.direction.y = APG.UDLRDir[k].y;

            var nowSite = APG.Character.getCharacterSite(player);

            /* 预设新的相对坐标 */
            var newX = nowSite.x + player.direction.x;
            var newY = nowSite.y + player.direction.y;
            let newSite = {x:newX, y:newY};
            {
                //  ====== 检测玩家是否可走 =====
                var canMove = true;
                /* 地图超出 */
                if (APG.Update.collideWorldBounds) {
                    if (newX < 0 || newY < 0 || newX >= APG.MapArea.rows || newY >= APG.MapArea.columns) {
                        canMove = false;
                    }
                }
                /* 检测组碰撞 */
                APG.Update.collision.block.playerGroupList.forEach(
                    function (object) {
                        if (object.group) {
                            object.group.forEach(function (sprite) {
                                let site = APG.Sprite.getSpriteSite(sprite);
                                if (site.x == newSite.x && site.y == newSite.y) {
                                    canMove = false;
                                    if (object.feedback) {
                                        object.feedback.apply(that, [playerGroup, sprite]);
                                    }
                                }
                            })
                        }
                    });

                /* 检测砖块碰撞 */
                APG.Update.collision.block.playerTileList.forEach(
                    function (object) {
                        var tile = APG.Tile.getTileFromSite(newX, newY);
                        if ((tile && tile.index == object.tileIndex) ||
                            (!tile && object.tileIndex == 0)) {
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
                APG.Assets.setAnimations(playerGroup, k,playerGroup.Assets.move[k], 1);
                if (canMove) {
                    console.log('player move from ' + nowSite.x + ", " + nowSite.y + " to " + newX + ", " + newY);
                    APG.Character.setCharacterSite(playerGroup, newX, newY);
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

APG.Update.bag = APG.Bag.updateBag;

/* 边界碰撞,默认不开
* 用于玩家移动检测
*  */
/*APG.Update.collideWorldBounds = false;*/
APG.Update.collision.setCollideWorldBounds = function(f){
    APG.Update.collideWorldBounds = f;
};

/*APG.Update.collision = {};*/
/* 碰撞检测之禁止覆盖 */
APG.Update.collision.block = {
    GroupList: [],        /* 需要检测的团队列表 */
    TileList: [],         /* 需要检测的瓷砖列表 */
    playerGroupList: [],  /* 需要检测的团队列表（对于玩家） */
    playerTileList: [],   /* 需要检测的瓷砖列表（对于玩家） */
};

/* 碰撞检测之覆盖后果 */
APG.Update.collision.active = {
    GroupList: [],        /* 需要检测的团队列表 */
    TileList: [],         /* 需要检测的瓷砖列表 */
    playerGroupList: [],  /* 需要检测的团队列表（对于玩家） */
    playerTileList: [],   /* 需要检测的瓷砖列表（对于玩家） */
};

APG.Update.collision.blockTileOverlap = function(group, tileIndex, feedback, context, that=APG.DeveloperModel){
    if(group == APG.CharacterGroups.player){
        APG.Update.collision.block.playerTileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }else{
        APG.Update.collision.block.TileList.push({
            group: group,
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }
};

APG.Update.collision.blockGroupOverlap = function(group1, group2, feedback, context, that=APG.DeveloperModel) {
    if (group1 == APG.CharacterGroups.player) {
        APG.Update.collision.block.playerGroupList.push({
            group: group2,
            feedback: feedback,
            context: context,
            that: that,
        });
    }else{
        APG.Update.collision.block.GroupList.push({
            group1: group1,
            group2: group2,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }
};

APG.Update.collision.activeGroupOverlap = function(group1, group2, feedback, context, that=APG.DeveloperModel){
    var obj = {
        actor: "",
        feedback: feedback,
        // isCollided: false,
        context: context,
        that: that,
    };
    obj.group1 = group1;
    obj.group2 = group2;
    if (group1 == APG.CharacterGroups.player) {
        obj.actor = "player";
    }
    APG.Update.collision.active.GroupList.push(obj);
};
APG.Update.collision.activeTileOverlap = function(group, tileIndex, feedback, context, that=APG.DeveloperModel){
    if(group == APG.CharacterGroups.player){
        APG.Update.collision.active.TileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }else{
        APG.Update.collision.active.TileList.push({
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

APG.Update.collision.isCollided = function(group1, group2){

};

console.log("Methods.js has been loaded successfully.")

/* ==================== methods =====================*/
/* Assets  */
/* music */
playMusic                   = APG.Assets.playMusic
stopMusic                   = APG.Assets.stopMusic
/* 动画 */
setAnimations               = APG.Assets.setAnimations
playerMoveAnimations        = APG.Assets.playerMoveAnimations
getFrame                    = APG.Assets.getFrame

/*  Bag  */
showBagBar                  = APG.Bag.showBagBar
hiddenBagBar                = APG.Bag.hiddenBagBar
destroyBagBar               = APG.Bag.destroyBagBar
addItem                     = APG.Bag.addItem
putItem                     = APG.Bag.putItem
getItem                     = APG.Bag.getItem
dropItem                    = APG.Bag.dropItem
getItemNum                  = APG.Bag.getItemNum
setBagCapacity              = APG.Bag.setBagCapacity
getBagCapacity              = APG.Bag.getBagCapacity
getBagSize                  = APG.Bag.getBagSize
getBagFirst                 = APG.Bag.getBagFirst
goDownItems                 = APG.Bag.goDownItems
goUpItems                   = APG.Bag.goUpItems
updateBag                   = APG.Bag.updateBag

/* Character */
getCharacterSprite          = APG.Character.getCharacterSprite
getCharacterSite            = APG.Character.getCharacterSite
getCharacterDirection       = APG.Character.getCharacterDirection
getCharacterTile            = APG.Character.getCharacterTile
getCharacterSiteAll         = APG.Character.getCharacterSiteAll
setCharacterSite            = APG.Character.setCharacterSite
moveCharacter               = APG.Character.moveCharacter


/* Game*/
getGameWIDTH                = APG.Game.getGameWIDTH
getGameHEIGHT               = APG.Game.getGameHEIGHT
getGameMODE                 = APG.Game.getGameMODE
README                      = APG.Game.README
WIN                         = APG.Game.WIN
LOST                        = APG.Game.LOST
fullScreen                  = APG.Game.fullScreen
exitFullscreen              = APG.Game.exitFullscreen
restartGame                 = APG.Game.restartGame



/* Group */
setGroup                    = APG.Group.setGroup
moveGroupUpTo               = APG.Group.moveGroupUpTo
moveGroupDownTo             = APG.Group.moveGroupDownTo
getTargetGroup              = APG.Group.getTargetGroup
getCharacterGroup           = APG.Group.getCharacterGroup


/* Sprite*/
addSprite                   = APG.Sprite.addSprite
setSpriteSite               = APG.Sprite.setSpriteSite
getSpriteSite               = APG.Sprite.getSpriteSite
getSpriteList               = APG.Sprite.getSpriteList
getSpriteListFromSite       = APG.Sprite.getSpriteListFromSite
destroySprite               = APG.Sprite.destroySprite
siteDecode                  = APG.Sprite.siteDecode
siteCode                    = APG.Sprite.siteCode
setBody                     = APG.Sprite.setBody


/*Target*/
addTextBitMap               = APG.Target.addTextBitMap
aboutTextBitMap             = APG.Target.aboutTextBitMap
loadTextBitMap              = APG.Target.loadTextBitMap
loadTextBitMapBetween       = APG.Target.loadTextBitMapBetween

/* Tile */
getTileId                   = APG.Tile.getTileId
changeTile                  = APG.Tile.changeTile
getTileFromSite             = APG.Tile.getTileFromSite
removeTile                  = APG.Tile.removeTile
removeTileFromSite          = APG.Tile.removeTileFromSite


/* Update*/
stopListenKey               = APG.Update.listenKey.stopListenKey
startListenKey              = APG.Update.listenKey.startListenKey
setMoveKey                  = APG.Update.listenKey.setMoveKey
addKeyEvent                 = APG.Update.listenKey.addKeyEvent
characterMoveEvent          = APG.Update.listenKey.characterMoveEvent
setCollideWorldBounds       = APG.Update.collision.setCollideWorldBounds
blockTileOverlap            = APG.Update.collision.blockTileOverlap
blockGroupOverlap           = APG.Update.collision.blockGroupOverlap
activeGroupOverlap          = APG.Update.collision.activeGroupOverlap
activeTileOverlap           = APG.Update.collision.activeTileOverlap
isCollided                  = APG.Update.collision.isCollided






