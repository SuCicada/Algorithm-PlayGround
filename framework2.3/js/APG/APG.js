console.log("APG.js has been loaded successfully.")

window.onload=function() {
    WIDTH = globalConfig.WIDTH? globalConfig.WIDTH: window.screen.width;
    HEIGHT = globalConfig.HEIGHT? globalConfig.HEIGHT: window.screen.height;
    MODE = globalConfig.MODE? globalConfig.MODE: 'CANVAS';

    game = new Phaser.Game(WIDTH,HEIGHT,MODE, '');
    game.state.add('bootstrap', bootstrap);
    game.state.start('bootstrap');
};
var game;

var WIDTH;
var HEIGHT;
var MODE;

// var BagBar = {};
// var MapArea = {};
var TileMapJson;   /* 用于存贮地图配置 */

var APG = {};
APG.WIDTH = WIDTH;
APG.MODE = MODE;
APG.HEIGHT = HEIGHT;

APG.MapArea = {};

APG.Assets = {};   /* 暂存帧贴图 */
APG.Assets.music = {};
APG.Assets.background = {};
APG.Assets.mapImg = null;
APG.Assets.scripts = [
    'Assets',
    'Bag',
    'Character',
    'Game',
    'Group',
    'Methods',
    'Sprite',
    'Target',
    'Tile',
    'Update',
];

// APG.players = [{group:null,animations:{}}];
// APG.objects = {};

APG.Tile = {};
APG.Tilemap = null;
APG.Layer = null;

/* update的检测速度,(收效甚微) */
APG.FPS = 30;
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

// APG.Side = {x:0,y:0};  // 格子边长
// APG.TextStyle = null;

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
        // var scriptObjs = document.scripts;
        // var currentPath = scriptObjs[scriptObjs.length - 1].src.substring(0, scriptObjs[scriptObjs.length - 1].src.lastIndexOf("/") + 1);
        // console.log(currentPath)

        let scripts = document.getElementsByTagName("script");
        let path;
        for(i=0;i<scripts.length;i++){
            let file = scripts[i].getAttribute("src");
            if(file && file.substring(file.lastIndexOf('/'), file.lastIndexOf('.') == "APG")){
                path = file.substring(0, file.lastIndexOf('/')+1);
            }
        }
        game.load.json('mazajson', globalConfig.Assets.tileMap.tileMapJson);
        APG.Assets.scripts.forEach(function(s){
            game.load.script(s, path + s + ".js");
        });
    },
    create: function(){
        game.state.add("preload",preload);
        game.state.start("preload");
    }
};

var preload = {
    init: function (){
        /* 基础参数 */
        if(globalConfig.BagSystem && globalConfig.BagBar){
            globalConfig.BagBar.w = 0? 0.2: globalConfig.BagBar.w;
            globalConfig.BagBar.h = 0? 1: globalConfig.BagBar.h;
            APG.Bag.BagBar = {
                w: globalConfig.BagBar.w<=1? globalConfig.BagBar.w*WIDTH:  globalConfig.BagBar.w,
                h: globalConfig.BagBar.h<=1? globalConfig.BagBar.h*HEIGHT: globalConfig.BagBar.h,
            };
        }

        // APG.Tile = {
        //     height: 0,
        //     width: 0,
        //     scale: 0,
        // };
        APG.MapArea = {
            x: globalConfig.MapArea.x<=1? globalConfig.MapArea.x*WIDTH:  globalConfig.MapArea.x,
            y: globalConfig.MapArea.y<=1? globalConfig.MapArea.y*HEIGHT: globalConfig.MapArea.y,
            width : WIDTH * 0.8,
            height: HEIGHT * 0.8,
            rows: 0,   /* 棋盘世界的行列数*/
            columns: 0,
        };
        APG.MapArea.offsetX = APG.MapArea.x;
        APG.MapArea.offsetY = APG.MapArea.y;



        /* 地图配置文件 */
        TileMapJson = game.cache.getJSON('mazajson');

        /* Tile大小, 强制方形 */
        var side = Math.min(APG.MapArea.height / TileMapJson.height,
            APG.MapArea.width  / TileMapJson.width);
        APG.Tile.width = side;
        APG.Tile.height = side;
        console.log("APG.Tile side: " + side);

        /* 使用新的除去旧的, 算出需要对对象拉伸的量,
         * 因为对象的大小是根据旧 地图配置中的 tileheight,tilewidth 来算的
         * */
        APG.Tile.scale = Math.min(APG.Tile.width / TileMapJson.tilewidth,
            APG.Tile.height / TileMapJson.tileheight);
        console.log("APG.Tile.scale: " + APG.Tile.scale);

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
        let Assets = globalConfig.Assets;

        /* 更新地图贴图url */
        let imgSrc = globalConfig.Assets.mapImg.imgUrl;
        let width = APG.Tile.width * TileMapJson.tilesets[0].columns;
        let height = APG.Tile.height * (TileMapJson.tilesets[0].tilecount / TileMapJson.tilesets[0].columns);
        console.log(width,height)
        autoResizeImg(imgSrc, width, height).then(function(newImg) {
            APG.Assets.mapImg = newImg.src;
            TileMapJson.tilesets[0].image = newImg.src;
            TileMapJson.tilesets[0].imageheight = newImg.height;
            TileMapJson.tilesets[0].imagewidth = newImg.width;
            TileMapJson.tilesets[0].tileheight = APG.Tile.height;
            TileMapJson.tilesets[0].tilewidth = APG.Tile.width;

            /* 加载资源必须等到图片处理结束之后 */
            game.load.image(Assets.mapImg.imgKey,     APG.Assets.mapImg);
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

        // APG.Side.x = APG.Tile.width;
        // APG.Side.y = APG.Tile.height;
        // APG.TextStyle = { font: "48px Arial", fill: "#ff0044", align:"center" };

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
                console.log(s.x+","+s.y+" -> "+s.relx+","+s.rely);

                game.physics.enable(s, Phaser.Physics.ARCADE);
                APG.Sprite.setBody(s,0.8,0.8,0.1,0.1);

            });

            // APG.players.push({group:characterGroup});
            let keyName = characterGroup.children[0][0].keyName;
            characterGroup.name = keyName;
            APG.CharacterGroups[keyName] = characterGroup;
            console.log("create successfully: "+keyName);
        }
        console.log("Character Groups has been established successfully.");


        /* 你的创造 */
        if(APG.DeveloperModel.create){
            APG.DeveloperModel.create.apply(APG.DeveloperModel);
        }


        /* 背包系统*/
        if(globalConfig.BagSystem){
            APG.Bag.showBagBar();
        }

        if(globalConfig.README){
            APG.Game.README(globalConfig.README);
        }

        if(globalConfig.FullScreen) {
            APG.Game.fullScreen();
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