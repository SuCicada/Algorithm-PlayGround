// var WIDTH = mapConfig.tilewidth * mapConfig.width;
// var HEIGHT = mapConfig.tileheight * mapConfig.height;
var WIDTH = window.screen.width;
var HEIGHT = window.screen.height;

var MODE = 'CANVAS';

var BagBar = {
    w: WIDTH *0.3,
    h: HEIGHT,
};
// WIDTH += BagBar.w;
var Tile = {
    height: 0,
    width: 0,
    scale: 0,
};
var MapArea = {
    x: 100,
    y: 100,
    width : WIDTH * 0.8,  /* 初始大小, 之后会调整*/
    height: HEIGHT * 0.8,
    rows: 0,   /* 棋盘世界的行列数*/
    columns: 0,
};
MapArea.offsetX = MapArea.x;
MapArea.offsetY = MapArea.y;

var TileMapJson;
var game = new Phaser.Game(WIDTH,HEIGHT,MODE, '');


function fullScreen(){
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
}
function exitFullscreen(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}


var RW = {};

RW.assets = {};
var bootstrap = {
    init: function () {
        game.scale.scaleMode = Phaser.ScaleManager["SHOW_ALL"];
        game.scale.refresh();
    },
    preload: function() {
        // game.load.script('map', 'map/maza/map.js');
        // game.load.script('generateMapJson', 'generateMapJson.js');
        // game.load.script('generateMapJson', 'generateMapJson.js');
        // game.cache.addJSON('mazajson', globalConfig.tilemap.jsonFile);
        game.load.json('mazajson', globalConfig.tilemap.jsonFile);

    },
    create: function(){
        game.state.add("preload",preload);
        game.state.start("preload");
    }
};


RW.player = {};
RW.objects = {};
var preload = {
    init: function (){
        TileMapJson = game.cache.getJSON('mazajson');
        // TileMapJson.tileheight = HEIGHT / TileMapJson.height;
        // TileMapJson.tilewidth= WIDTH  / TileMapJson.width;

        /* Tile大小 */
        var side = Math.min(MapArea.height / TileMapJson.height,
            MapArea.width  / TileMapJson.width);
        // Tile.height = MapArea.height / TileMapJson.height;
        // Tile.width  = MapArea.width  / TileMapJson.width;
        Tile.height = Tile.width = side;
        Tile.scale = Math.min(Tile.width / TileMapJson.tilewidth,
            Tile.height / TileMapJson.tileheight);
        console.log(Tile.scale)
        // Tile.scale = parseInt(Tile.scale+0.5);
        // console.log(Tile.scale)

        /* 默认取第一个tilseset 因为这个就认为是地图瓷砖
        *  这里需要调整
        * */
        // TileMapJson.tileheight = TileMapJson.tilesets[0].tileheight; //Tile.height;
        // TileMapJson.tilewidth = TileMapJson.tilesets[0].tilewidth; //Tile.width;

        /* 对显示有影响,偏移*/
        TileMapJson.tileheight = Tile.height;
        TileMapJson.tilewidth =  Tile.width;
        // console.log(TileMapJson)

        TileMapJson.tilesets.forEach(function(tileset){
            // tileset.tileheight = Tile.height;
            // tileset.tilewidth = Tile.width;
            // tileset.imageheight = (tileset.tilecount / tileset.columns) * Tile.width;
            // tileset.imagewidth = tileset.columns * Tile.width;
        })
        // Tile.height = TileMapJson.tileheight;
        // Tile.width  = TileMapJson.tilewidth;
        MapArea.width = Tile.width * TileMapJson.width;
        MapArea.height = Tile.height * TileMapJson.height;
        MapArea.rows = MapArea.width / Tile.width;
        MapArea.columns = MapArea.height / Tile.height;
    },
    preload: function(){

        game.load.image(globalConfig.background.imgKey, globalConfig.background.imgUrl);
        game.load.image(globalConfig.mapImg.imgKey, globalConfig.mapImg.imgUrl);
        game.load.audio(globalConfig.music.musicKey,globalConfig.music.musicUrl);

        game.load.tilemap('tilemap', null, TileMapJson, Phaser.Tilemap.TILED_JSON);
        // game.load.spritesheet('aaa', 'map/maza/object.png',10,10);

        this.spritesheets = [];
        for(sprite of globalConfig.sprites) {

            if(sprite.type == 'player'){
                // playerConfig = sprite;
                RW.player.name = sprite.imgKey;
            }else if(sprite.type == 'object'){
                RW.objects[sprite.imgKey] = sprite;
            }

            switch(sprite.imgMode){
                case 'JSONHash':
                    console.log('JSONHash load')
                    var a = game.load.atlasJSONHash(sprite.imgKey,sprite.imgUrl, sprite.jsonFile);
                    // a.start();
                    break;
                case 'image':
                    break;
                case 'spritesheet':
                    // console.log(promise)
                    // console.log(sprite)
                    game.load.image(sprite.imgKey, sprite.imgUrl)

                    this.spritesheets.push(sprite);
                    break;
            }
        }

        RW.assets.spritesheets = this.spritesheets;
        // for(i=0;i<this.spritesheets.length;i++) {
        //     a = this.spritesheets[i]
        //     ll = game.load.image(a.keyName, a.imgUrl)
        //     ll.start()
        // }
        // game.cache.getImage('baoshi');


        // var promise = null;
        // for(i=0;i<spritesheets.length;i++){
        //     // console.log(spritesheets[i])
        //     var sprite = spritesheets[i];
        //     if(promise == null) {
        //         promise = this.getImgInfo(sprite);
        //     }else if(i == spritesheets.length-1){
        //         promise = promise.then(function () {
        //             game.state.states.preload.mycreate();
        //         });
        //     }else{
        //         promise.then(function () {
        //             // game.load.spritesheet(ss.keyName, ss.imgUrl,
        //             //     width / ss.columns, height / ss.rows);
        //             return game.state.states.preload.getImgInfo(sprite);
        //         });
        //     }
        // }

        // ========= character =============
        // var playerConfig = globalConfig.characters.find(function(i){
        //     return i.type == 'player';
        // });
        // this.load.atlasJSONHash('bullet','sprites/bullet.png','sprites/bullet.json');
        // this.load.image('enemy','img/beibei.png');
        // this.load.image('enemy_bullet','img/bullet.png');
    },
    // getImgInfo: function(ss){
    //     var promise = new Promise(function(resolve, reject){
    //         var img = new Image();
    //         var size = {};
    //         var url = ss.imgUrl;
    //         img.src = url;
    //         // document.body.appendChild(img);
    //         console.log(img)
    //         if(img.complete){
    //             width = img.width;
    //             height = img.height;
    //             game.load.spritesheet(ss.keyName, ss.imgUrl,
    //                 width / ss.columns, height / ss.rows);
    //             resolve();
    //         }else {
    //             img.onload = function () {
    //                 console.log(ss)
    //                 width = img.width;
    //                 height = img.height;
    //                 var sa = game.load.spritesheet(ss.keyName, ss.imgUrl,
    //                     Math.floor(width / ss.columns),
    //                     Math.floor(height / ss.rows));
    //                 // game.cache.addImage(ss.keyName, ss.imgUrl)
    //                 console.log(sa)
    //                 sa.start();
    //                 resolve();
    //             }
    //         }
    //     });
    //     return promise;
    // },
    create: function () {



        game.state.add("preloadPlus",preloadPlus);
        game.state.start("preloadPlus");
    },

};

var preloadPlus = {
    preload: function(){
        spritesheets = RW.assets.spritesheets
        for(i=0;i<spritesheets.length;i++) {
            var ss = spritesheets[i]
            var a = game.cache.getImage(ss.imgKey);
            // console.log(ss)
            // console.log(a.width, a.height)
            // game.cache.removeImage(ss.keyName)
            game.load.spritesheet(ss.imgKey, ss.imgUrl,
                a.width / ss.columns, a.height / ss.rows);
        }

    },
    create: function(){
        game.state.add("startGame",startGame);
        game.state.start("startGame");
    }
};
RW.DeveloperModel = eval(globalConfig.DeveloperModel);  // 回调上下文全局对象，默认YourGame
RW.fps = 30;
RW.fps_rate = 0;

var startGame = {
    init: function(){

        RW.par = {};  // 格子边长
        RW.par.x = Tile.width;
        RW.par.y = Tile.height;
        RW.textStyle= { font: "48px Arial", fill: "#ff0044", align:"center" };
        // this.time = {};
        // this.time.now = 0; // 现在的时间
        // this.time.alive = false; // 时间流逝

        // ==== 按键 ======
        RW.Keys = {};
        var defaultKays = ['cursors'];
        for(key of globalConfig.keys.concat(defaultKays)){
            if(key == 'cursors'){
                var k = game.input.keyboard.createCursorKeys();
                for(i in k){
                    // RW.Keys[i.toUpperCase()] = {
                    //     object: k[i],
                    // }
                    RW.Keys[i.toUpperCase()] = k[i];
                }
            }else{
                var k = game.input.keyboard.addKey(Phaser.Keyboard[key]);
                RW.Keys[key] = k;
            }
        }

        YourGame.init();

    },
    preload: function(){
        YourGame.preload();
    },
    create: function(){
        var bg = game.add.tileSprite(0,0,game.width,game.height,globalConfig.background.imgKey);
        // bg.scale.setTo(0.1);

        bg.autoScroll(globalConfig.background.scrollX,globalConfig.background.scrollY);
        var music = game.add.audio(globalConfig.music.musicKey);
        music.play();

        RW.tilemap = game.add.tilemap('tilemap');

        /* 第一个参数是json中的tileset名, 第二个参数是地图贴图的key
        ** 推荐这两个名字取得一样
        */
        console.log(RW.tilemap)
        console.log(RW.tilemap.layers[0].data)
        RW.tilemap.addTilesetImage(globalConfig.mapImg.imgUrl, globalConfig.mapImg.imgKey,
            // Tile.height,Tile.width,Tile.height,Tile.width
        );

        RW.layer = RW.tilemap.createLayer("layer1", MapArea.width, MapArea.height);
        // Tile.width / TileMapJson.tilewidth
        // Tile.height / TileMapJson.tileheight
        // console.log(RW.layer.width)
        // console.log(RW.layer.height)
        // scale = Math.min(Tile.width / RW.layer.width, Tile.height / RW.layer.height);
        RW.layer.scale.set(Tile.width / TileMapJson.tilewidth, Tile.height / TileMapJson.tileheight);
        // RW.layer.scale.set(Tile.scale);
        RW.layer.fixedToCamera = false;
        RW.layer.position.set(MapArea.x, MapArea.y);
        RW.layer.resizeWorld();


        RW.ObjectGroups = {};
        var objectLayer = TileMapJson.layers.find(function(lay){
            return lay.name == "Object Layer";
        }).objects;
        var indexs = {};
        for(i=0;i<objectLayer.length;i++){
            // console.log(objectLayer[i])
            console.log(objectLayer[i].gid)

            if(indexs[objectLayer[i].gid]){
                continue;
            }else{
                indexs[objectLayer[i].gid] = true;
            }
            var group = game.add.group();
            var obj = objectLayer[i];
            var objPro = objectLayer[i].properties;
            // 配置文件中给图片key或图片url都行,优先key,
            // 没有key就从globalConfig中去找对应的
            /* 2.0: 目前都有keyName了*/
            if(objPro[0].keyName ){
                imgKey = objPro[0].keyName;
            }else{
                imgKey = globalConfig.sprites.find(function(s){
                        return s.imgUrl == objPro[0].imgurl;
                    }).keyName;
            }
            if(objPro[0].gid){
                var frameId = objPro[0].gid-1;
            }else{
                var frameId = null;
            }
            // console.log(game.cache.getImage(imgKey,true))
            // console.log(obj.gid)

            // if(imgKey != 'baoshi')
            //     continue;
            // a = game.add.sprite(100,111,imgKey)

            RW.tilemap.createFromObjects('Object Layer' ,obj.gid ,
                imgKey , frameId, true, false, group, Phaser.Sprite, false);
            // if(group.children.length){
            // break
            group.enableBody = true;
            var keyName;
            group.forEach(function(s){
                // console.log(Tile.scale)

                s.x *= Tile.scale;
                s.y *= Tile.scale;
                // console.log(s.x, s.y)

                // 相对距离,相对于MapArea
                s.relx = s.x;
                s.rely = s.y;

                s.x += MapArea.x;
                s.y += MapArea.y;
                s.scale.setTo(1);
                // console.log(s.width, s.height)
                s.scale.setTo(Tile.width / s.width,
                    Tile.height / s.height);

                // console.log(s.width,s.height)
                // console.log(s.scale.x, s.scale.y)
                // console.log(s.width*0.9/s.scale.x)
                console.log(s.x,s.y)

                /* 将对象的物理检测体缩小,不然可能会在瓷砖边上就碰撞 */
                game.physics.enable(s, Phaser.Physics.ARCADE);
                RW.methods.setBody(s,0.6,0.6,0.2,0.2);
                // s.body.setSize(s.width*0.9/s.scale.x,s.height*0.9/s.scale.y,
                //     s.width/s.scale.x*0.05, s.height/s.scale.y*0.05);
                // s.animations.add('rotation',null,6 ,true)
                // s.animations.play('rotation')
                // console.log(s[0].keyName)
                keyName = s[0].keyName;
                // console.log(keyName)
            });
            // game.physics.arcade.enable(group);
            RW.ObjectGroups[keyName] = group;
                // physicsBodyType = Phaser.Physics.ARCADE;
            // }
        }

        console.log(RW.ObjectGroups)

        RW.CharacterGroups = {};
        var characterGroup = game.add.group();

        RW.tilemap.createFromObjects('Character Layer' ,1 ,RW.player.name , 0, true, false, characterGroup, Phaser.Sprite, false);
        // console.log(characterGroup)
        characterGroup.forEach(function(s){
            // console.log(s[0])

            s.x *= Tile.scale;
            s.y *= Tile.scale;

            s.x += MapArea.x;
            s.y += MapArea.y;
            s.scale.setTo(1);
            s.scale.setTo(Math.min(Tile.width / s.width,
                Tile.height / s.height));

            // console.log(s.width,s.height)
            // console.log(s.scale.x, s.scale.y)
            // console.log(s.width*0.9/s.scale.x)

            game.physics.enable(s, Phaser.Physics.ARCADE);
            RW.methods.setBody(s,0.8,0.8,0.1,0.1);

        });
        RW.CharacterGroups.player = characterGroup;
        RW.CharacterGroups.player.forEach(function(player){
            player.oldx = player.x;
            player.oldy = player.y;
            player.direction = {
                x:0,
                y:0
            };
            game.physics.arcade.enable(player);
            // player.body.collideWorldBounds = true;  // 检测边界
        });



        RW.moveKey = {
            UP: 'UP',
            DOWN: 'DOWN',
            LEFT: 'LEFT',
            RIGHT: 'RIGHT',
        };
        RW.UDLRDir = {
            UP: {x:0,y:-1},
            DOWN:{x:0,y:1},
            LEFT: {x:-1,y:0},
            RIGHT: {x:1,y:0},
        };

        YourGame.create();



        showBagBar();

        // RW.methods.WIN()


    },
    update: function(){
        RW.fps_rate++;
        if (RW.fps_rate == (60/RW.fps)){
            RW.fps_rate = 0;
            this.updateExec();
        }
    },
    updateExec: function(){
        // RW.update.listenKey.playerMove();

        // game.physics.arcade.overlap(
        //     RW.CharacterGroups.player,
        //     RW.ObjectGroups["4"],
        //     function(player, wall){
        //         console.log(wall.x);
        //         console.log(wall.y);
        //     }, null, game);

        for(object of RW.update.collision.active.GroupList){
            group1 = object.group1;
            group2 = object.group2;
            feedback = object.feedback;
            object.isCollided = false;
            context = object.context ;
            that = object.that;

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

        for(object of RW.update.collision.active.playerGroupList){
            group2 = object.group;
            feedback = object.feedback;
            object.isCollided = false;
            context = object.context ;
            that = object.that;
            // console.log(list)
            game.physics.arcade.collide(player, group2,
                function(sprite1, sprite2){
                    // sprite1.x = sprite1.oldx;
                    // sprite1.y = sprite1.oldy;
                    object.isCollided = true;
                    feedback.apply(that, [player, sprite2, context]);
                }, null);  // 检测重叠
        }

        // for(object of RW.update.collision.TileList) {
        //     console.log(object);
        //     RW.tilemap.setTileIndexCallback(object.tileIndex,
        //         object.feedback ? object.feedback : null)
        // }

        RW.update.listenKey.keyEventList.forEach(function(object){
            // console.log(object)
            if(RW.Keys[object.key].justDown){
                // object.feedback(object.context);
                object.feedback.apply(object.that, [object.context]);
            }
        });

        RW.update.bag();

        YourGame.update();

    },
    render: function(){
        // game.debug.spriteBounds(RW.tilemap);

        // RW.CharacterGroups.player.forEach(function(s){
        //     game.debug.body(s)
        // })
        // RW.ObjectGroups.baoshi.forEach(function(s){
        //     game.debug.body(s)
        // })

    }
};

//================================================================
//================================================================
//================================================================

RW.bag = {};
RW.bag.items = [];

// RW.bag.itemGroups = {};
var img;
var num;
function showBagBar(){

    w = BagBar.w;
    h = BagBar.h;
    x = (WIDTH - w);
    y = 0;

    var bar = game.add.graphics();
    bar.beginFill('0x'+'#87df00'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);
    // RW.WINPage = new Phaser.Rectangle(x, y, w, h);
    // game.debug.geom(RW.WINPage,'rgba(233,255,34,0.8)');

    var style = { font: "bold "+RW.par.x/4+"px Arial", fill: "#00124f",
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
        items[i].text = text;
        barY += barSide*1.1;
    }
}

RW.bag.addItem = function(itemName, imgKey,frameId,number){
    /* initialization即初始化时, 设置背包要存的东西
    *  返回已存在于 RW.ObjectGroups 中的组
    *  若没有赠送一个对象组
    *  [!] 没有考虑玩家组的
    * frameId: 显示在背包栏的帧
    * itemName: 物品名称, 需要和ObjectGroup中的keyName对应
    * */
    // console.log(RW.ObjectGroups)
    var group = RW.ObjectGroups[itemName];
    if(!group){
        var group = game.add.group();
        RW.ObjectGroups[itemName] = group;
    }else{
        if(!imgKey){
            var imgUrl = RW.ObjectGroups[itemName].children[0][0].imgUrl;
            console.log(RW.ObjectGroups[itemName].children[0][0])
            var imgKey = globalConfig.sprites.find(function(s){
                return s.imgUrl == imgUrl;
            }).imgKey;
        }
        if(!frameId){
            var frameId = RW.ObjectGroups[itemName].children[0][0].gid;
            if(frameId)
                frameId--;
        }
    }

    for(i=0;i<number;i++){
        var sprite = RW.methods.setSprite(0,0,imgKey,frameId,group)
        // sprite = game.add.sprite(0,0,imgKey,frameId);
        sprite.kill();
        // group.add(sprite);
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
// RW.bag.upadteNumber = function(){
//     for(item of RW.bag.items){
//         item.number = item.group.children.length;
//         item.text.setText(item.number);
//     }
// };

RW.bag.putItem = function(itemName,x,y){
    /* 从背包里把东西拿出去
    * 坐标是相对的.
    * */
    var item = RW.bag.items.find(function(b){
        return b.itemName == itemName;
    });
    // console.log(itemName);
    // console.log(item);
    // console.log(x,y)
    var s = item.group.children[0];
    game.world.add(s);   // 把一个精灵从背包中的组里拿到世界组中
    item.number --;
    s.revive();     /*复活精灵*/
    RW.methods.setSpriteSite(s,x,y);
    return s;
};

RW.bag.getItem = function(itemName,spriteList){
    /* 把东西放到背包里
    *  itemName: 指定要放到的背包区
    *  spriteList: 精灵列表,指定拿的东西
    * */
    // item = RW.bar.items.find(function(b){
    //     return b.itemName == itemName;
    // })
    for(sprite of spriteList){
        // var group = sprite.parent;
        var item = RW.bag.items.find(function(b){
            return b.itemName == itemName;
        });
        item.number ++;
        // item.text.setText(item.number);
        item.group.add(sprite);
        sprite.kill();    /*进入休眠*/
    }
};
RW.bag.dropItem = function(itemName){
    /* 把东西丢掉 */
    var item = RW.bag.items.find(function(b){
        return b.itemName == itemName;
    });
    if(item.children.length){
        item.children[0].destroy();
    }
}
RW.bag.getItemNum = function(itemName){
    return RW.bag.items.find(function(b){
        return b.itemName == itemName;
    }).number;
};


RW.methods = {};
RW.methods.setBody = function(s,ratew,rateh,ratex,ratey){
    /* 设置对象的物理检测体,传入的参数是比率 s*/
    s.body.setSize(
        s.width  / s.scale.x * ratew,
        s.height / s.scale.y * rateh,
        s.width  / s.scale.x * ratex,
        s.height / s.scale.y * ratey);
};
RW.methods.moveObjectUpTo = function(groupUp,groupDown){
    /* 移动 groupUp 对象到 groupDown 对象上面*/
    while(groupUp.z<=groupDown.z){
        game.world.moveUp(groupUp);
        console.log(groupUp.z, groupDown.z)
    }
};
RW.methods.moveObjectDownTo = function(groupDown,groupUp){
    /* 移动 groupDown 对象到 groupUp 对象下面*/
    while(groupDown.z >= groupUp.z){
        game.world.moveDown(groupDown);
    }
};
RW.methods.animations = function(group, name, frames, frameRate=1, loop=false){
    /*
    * 添加动画, 并播放.
    * group: 可以是组,也可以是精灵
    * frames: 从0开始?
    * name: 动作名
    * */
    if(!group.forEach){
        var s = group;
        console.log(s)
        s.animations.add(name,frames);
        s.animations.play(name, frameRate, loop);
    }else{
        group.forEach(function(s){
            s.animations.add(name,frames);
            s.animations.play(name, frameRate, loop);
        })
    }
};
RW.player.Animations = {};
RW.player.Animations.move = {};
RW.methods.PlayerMoveAnimations = function(playerG,obj){
    /* 设置玩家移动动画*/
    var move = {}
    for(var i in obj){
        var I = i.toUpperCase()
        move[I] = typeof obj[i] == 'number'?[obj[i]]: obj[i];

        // if(playerG.animations){
        //     playerG.animations.add(I, move[I], 1);
        // }else{
        //     playerG.forEach(function(s){
        //         s.animations.add(I, move[I], 1);
        //     })
        // }
    }
    // console.log(move)
    RW.player.Animations.move = move;
};
RW.methods.getObjectFrame = function(obj){
    /* 根据传入的精灵或组,返回此精灵当前的frameId */
    if(obj.animations){
        /* sprite */
        return obj.animations.frame;
    }else{
        /* group or sprite List*/
        var frames = [];
        obj.forEach(function(s){
            frames.push(s.animations.frame);
        })
        return frames;
    }
};

RW.methods.getCharacterSprite = function(name){
    var group = RW.CharacterGroups[name];
    var a = group.getAll();
    return a[0];
};
// RW.methods.playerMove = function(player, resolve, reject, resolveContext, rejectContext, that=RW.DeveloperModel){
RW.methods.setPlaySite = function(playerGroup, x, y, resolve, reject, resolveContext, rejectContext, that=RW.DeveloperModel){
    /* 对玩家组中的第一个精灵设置相对位置,相对于MapArea
    * 传入的坐标是相对坐标*/
    // player.x += player.direction.x * RW.par.x;
    // player.y += player.direction.y * RW.par.y;
    var player = RW.methods.getPlayerSprite(playerGroup);
    var nowSite = RW.methods.getPlayerSite(playerGroup);
    player.oldx = nowSite.x;
    player.oldy = nowSite.y;

    player.relx = x;
    player.rely = y;


    console.log(x,y)
    var site = RW.methods.siteDecode(x,y);
    // player.x = x + MapArea.offsetX;
    // player.y = y + MapArea.offsetY;
    console.log(site)
    player.x = site.x;
    player.y = site.y;
};
RW.methods.playerMoveTo = RW.methods.setPlaySite;
RW.methods.getTileIndex = function(tile){
    return tile.index;
};
RW.methods.tileChangeTo = function(tile, index){
    tile.index = index;
    RW.layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};
RW.methods.getTilefromSite = function(x,y){
    // console.log(x,y)
    var tile = RW.tilemap.getTile(x, y);
    return tile;
};
RW.methods.removeTile = function(tile){
    console.log(tile.x,tile.y)
    RW.tilemap.removeTile(tile.x, tile.y);
};
RW.methods.removeTilefromSite = function(x,y){
    // tile = RW.methods.getTilefromSite(site.x, site.y);
    RW.tilemap.removeTile(x,y);
};

RW.methods.getCharacterSite = function(character){
    /* 返回角色组的坐标列表,相对坐标,相对于地图Area*/
    var site = [];
    RW.CharacterGroups[character].forEach(function(cha){
        // site.push({
        //     x: cha.x - MapArea.offsetX,
        //     y: cha.y - MapArea.offsetX
        // });
        site.push(RW.methods.getSpriteSite(cha));
    });
    return site;
};
RW.methods.getSpriteSite = function(sprite){
    /* 得到一个精灵的相对坐标,相对于地图Area
    * */
    // var site = {
    //     x: sprite.x - MapArea.offsetX,
    //     y: sprite.y - MapArea.offsetY
    // };
    // site.x /= Tile.width;
    // site.y /= Tile.height;
    // console.log(sprite.x,sprite.y)
    var site = RW.methods.siteCode(sprite.x,sprite.y);
    // console.log(site)
    return site;
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

    return {
        x: (x - MapArea.offsetX) / Tile.width,
        y: (y - MapArea.offsetY) / Tile.height,
    }
};

RW.methods.getPlayerSite = function(playerGroup, index=0){
    /* 得到单个玩家的相对坐标,相对于地图Area
    *  默认取得角色组里的第一个角色
    *  可以插入玩家精灵
    * */
    var player = playerGroup.children[index];
    if(!player){
        player = playerGroup;
    }
    return RW.methods.getSpriteSite(player);
};
RW.methods.getPlayerTile = function(player){
    /* 得到玩家所处瓷砖 */
    var site = RW.methods.getPlayerSite(player);
    // console.log(site)
    var tile = RW.methods.getTilefromSite(site.x, site.y);
    return tile;
};

RW.methods.getPlayerSiteAll = function(){};

RW.methods.setGroup = function(){
    // 默认存在0个精灵, 默认key 为spritesheet, index 从1开始
    var group = game.add.group();
    group.enableBody = true;
    game.physics.arcade.enable(group);
    return group;
};

RW.methods.setSprite = function(x, y, key, index, group){
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
RW.methods.getPlayerSprite = function(playerG, index=0){
    /* 传入玩家组,默认返回第一个精灵 */
    return playerG.getAll()[index];
};
RW.methods.getSpriteFromSite = function(x, y, group=game.world, recursive=false, safe=5){
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
    var sprite = [];
    if(group){
        group.forEach(function(s){
            if(!s.alive){
                return;
            }
            console.log(s.x,s.y)
            if(s.children.length && recursive){
                var ss = RW.methods.getSpriteFromSite(x,y,s,true,newsafe);
                sprite = sprite.concat(ss);
            }
            var site = RW.methods.getSpriteSite(s);
            if(site.x == x && site.y == y){
                /* or
                *     s.relx == x && s.rely == y
                * */
                sprite.push(s);
            }
        });
    }
    return sprite;
};
RW.methods.destroySprite = function(sprite){
    // console.log(sprite);
    sprite.destroy();
    // group.remove(sprite);
};


RW.methods.WIN = function(str,func,that=RW.DeveloperModel){
    w = WIDTH * 0.5;
    h = HEIGHT * 0.5;
    x = (WIDTH - w) / 2;
    y = (HEIGHT - w) / 2;
    var bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);
    // RW.WINPage = new Phaser.Rectangle(x, y, w, h);
    // game.debug.geom(RW.WINPage,'rgba(233,255,34,0.8)');

    var style = { font: "bold "+RW.par.x/4+"px Arial", fill: "#0037f1",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    text = game.add.text(WIDTH/2, y*1.2, "You Win\n"+str, style);
    text.anchor.set(0.5,0);
    // yourtext = game.add.text(game.world.centerX, y*1.2, str, style);
    // yourtext.anchor.set(0.5,0);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    bar.events.onInputDown.add(func,that);

};


RW.update = {};
RW.update.listenKey = {};
RW.update.listenKey.keyEventList = [];
RW.update.listenKey.addKeyEvent = function(key, feedback, context, that=RW.DeveloperModel){
    RW.update.listenKey.keyEventList.push({
        key: key,
        feedback: feedback,
        context: context,
        that: that,
    });
};
RW.update.listenKey.playerMove = function(role, resolve, resolveContext, reject, rejectContext, that=RW.DeveloperModel){
    /* resolve: function 移动成功执行函数,执行函数
    *  resolveContext: list resolve函数的参数,列表形式
    * */
    for(var k in RW.moveKey){
        if(RW.Keys[RW.moveKey[k]].justDown){
        console.log(k)
            // playerMove(game);RW.methods.setSprite
            var playerGroup = RW.CharacterGroups.player;
            var player = RW.methods.getPlayerSprite(playerGroup);
            // RW.CharacterGroups.player.forEachAlive(function(player){

            player.direction.x = RW.UDLRDir[k].x;
            player.direction.y = RW.UDLRDir[k].y;

            /* 相对位置  */
            // var nowSite = {
            //     x: player.x - MapArea.offsetX,
            //     y: player.y - MapArea.offsetY,
            // };
            var nowSite = RW.methods.getPlayerSite(player);
            console.log(nowSite)

                // var x = player.x + player.direction.x * RW.par.x;
                // var y = player.y + player.direction.y * RW.par.y;
            var x = nowSite.x + player.direction.x;// * RW.par.x;
            var y = nowSite.y + player.direction.y;// * RW.par.y;

            // console.log(x,y)
            // console.log(RW.par)

            // });
            var check = function(){
                //  ====== 检测玩家是否可走 =====
                var canMove = true;
                var result;
                console.log(x, y)
                console.log(MapArea)
                if(RW.update.collideWorldBounds){
                    if(x < 0 || y < 0 || x >= MapArea.rows || y >= MapArea.columns){
                        canMove = false;
                    }
                }
                /* 检测组碰撞 */
                RW.update.collision.block.playerGroupList.forEach(
                    function(object){
                        console.log(object)
                        if(object.group){
                            object.group.forEach(function(sprite){
                                var site = RW.methods.siteDecode(x,y);
                                if(site.x == sprite.x && site.y == sprite.y){
                                    canMove = false;
                                    if(object.feedback){
                                        console.log(object.feedback);
                                        console.log(playerGroup);
                                        object.feedback.apply(that, [playerGroup,sprite]);
                                    }
                                }
                            })
                        }
                    });
                /* 检测砖块碰撞 */
                RW.update.collision.block.playerTileList.forEach(
                    function(object){
                        var tile = RW.methods.getTilefromSite(x, y);
                        if(tile && tile.index == object.tileIndex){
                            canMove = false;
                            if(object.feedback) {
                                object.feedback.apply(that, [playerGroup,sprite]);
                                // object.feedback(player, tile);
                            }
                        }
                    });
                // console.log(canMove)
                /* 调用用户自定义规则,根据返回值判断能否走,
                 * 可以覆盖以上规则 (?合适不)
                 * 如果没有返回值, 则canMove不变
                 */
                // console.log(x,y)
                if(role){
                    var site = RW.methods.siteCode(x,y);
                    var flag = role(site.x, site.y);
                    canMove = flag==undefined? canMove: flag;
                }
                if(canMove){
                    // playerGroup.forEach(function(player){
                    //     player.animations.play(k);
                    // });
                    RW.methods.animations(playerGroup,k,RW.player.Animations.move[k],1);
                    // RW.methods.playerMove(player, x, y, resolve, reject, resolveContext, rejectContext, that);
                    RW.methods.setPlaySite(playerGroup, x, y);
                    console.log('player can move.')
                    if(resolve){
                        resolve.apply(that,resolveContext);
                    }
                }else{
                    console.log('player can\'t move.')
                    if(reject){
                        reject.apply(that, rejectContext);
                    }
                }
            };
            check();
        }
    }
};


RW.update.bag = function(){
    for(item of RW.bag.items){
        item.number = item.group.children.length;
        item.text.setText(item.number);
    }
};

/* 边界碰撞,默认不开
* 用于玩家移动检测
*  */
RW.update.collideWorldBounds = false;
RW.update.setCollideWorldBounds = function(f){
    RW.update.collideWorldBounds = f;
};

RW.update.collision = {};
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

}



// RW.update.collision.GroupToGroup = function(group1, group2, feedback){
//     game.physics.arcade.collide(group1, group2,
//         function(sprite1, sprite2){
//             sprite1.x = sprite1.oldx;
//             sprite1.y = sprite1.oldy;
//             feedback(sprite1, sprite2);
//         }, null);  // 检测重叠
//
// };


game.state.add('bootstrap', bootstrap);
game.state.start('bootstrap');



