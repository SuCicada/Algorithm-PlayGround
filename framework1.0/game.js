var WIDTH = mapConfig.tilewidth * mapConfig.width;
var HEIGHT = mapConfig.tileheight * mapConfig.height;

var MODE = 'CANVAS';
var game = new Phaser.Game(WIDTH,HEIGHT,MODE, '');

var bootstrap = {
    init: function () {
        game.scale.scaleMode = Phaser.ScaleManager["SHOW_ALL"];
        game.scale.refresh();
    },
    preload: function() {
        // game.load.script('map', 'map/maza/map.js');
        game.load.script('generateMapJson', 'generateMapJson.js');
    },
    create: function(){
        game.state.add("preload",preload);
        game.state.start("preload");
    }
};

var preload = {
    preload: function(){
        // tilemap_data = generate_tilemap_data(mapConfig,"layer");

        // ======= 迷宫 =============
        // game.load.image('objects','map/maza/object.png');
        // game.load.image('maza','map/maza/maza.png');
        // this.load.tilemap('mazajson', 'map/maza/maza.json',null,Phaser.Tilemap.TILED_JSON);
        // for(i in globalConfig.mapImg){
        //     game.load.image(i,globalConfig.mapImg[i]);
        // }

        game.load.image(globalConfig.mapImg.keyName, globalConfig.mapImg.imgUrl);

        for(i in globalConfig.sheet){
            game.load.spritesheet(i,globalConfig.sheet[i],mapConfig.tilewidth,mapConfig.tileheight);
        }
        game.load.tilemap('tilemap', globalConfig.tilemap.jsonFile, null, Phaser.Tilemap.TILED_JSON);
        // game.cache.addJSON('mazajson', globalConfig.tilemap.jsonFile);
        // game.load.json('mazajson', globalConfig.tilemap.jsonFile);

        // ========= character =============

        var playerConfig = globalConfig.characters.find(function(i){
            return i.type == 'player';
        });
        RW.player = {};
        RW.player.name = playerConfig.keyName;
        switch(playerConfig.imgMode){
            case 'JSONHash':
                game.load.atlasJSONHash(playerConfig.keyName,
                    playerConfig.imgUrl, playerConfig.jsonFile);
                break;
            case 'image':
                break;
            case 'spritesheet':
                break;
        }
        // this.load.atlasJSONHash('bullet','sprites/bullet.png','sprites/bullet.json');
        // this.load.image('enemy','img/beibei.png');
        // this.load.image('enemy_bullet','img/bullet.png');
        YourGame.preload();
    },
    create: function () {
        game.state.add("startGame",startGame);
        game.state.start("startGame");
    },

};
var RW = {};
RW.DeveloperModel = globalConfig.DeveloperModel;

var startGame = {
        init: function(){
        // var json = game.cache.getJSON('mazajson')
        // console.log(json)

        RW.par = {};  // 格子边长
        RW.par.x = mapConfig.tilewidth;
        RW.par.y = mapConfig.tileheight;
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

        // this.cursors = game.input.keyboard.createCursorKeys(); //方向按键
        // this.AKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        // this.SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // this.SKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        // this.DKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        // Phaser.Keyboard.UP
        // this.Keys = [
        //     this.cursors.up,
        //     this.cursors.down,
        //     this.cursors.left,
        //     this.cursors.right,
        //     this.AKey,
        //     this.SpaceKey,
        //     this.SKey,
        //     this.DKey
        // ];

            YourGame.init();

    },
    preload: function(){
        // $.each(this.Keys,function(i,value){
        //     value.click = false;
        // });
    },
    create: function(){
        // ===== 地图 =====
        // this.map = game.add.tilemap('tilemap');
        // this.map.addTilesetImage('mazatile','maza');
        // this.map.setCollision(1);
        // this.map.setCollision(4);
        // this.map.setCollision(5);
        // this.map.setCollision(6);
        // this.layer = this.map.createLayer("layer");

        // this.layer.debug = true;
        // this.layer.resizeWorld();

        RW.map = game.add.tilemap('tilemap');

        // 第一个参数是json中的tileset名, 第二个参数是地图贴图的key
        // 推荐这两个名字取得一样
        RW.map.addTilesetImage(globalConfig.mapImg.imgUrl, globalConfig.mapImg.keyName);

        RW.layer = RW.map.createLayer("layer1");
        RW.layer.resizeWorld();

        var img = game.cache.getImage('objects')
        var len = img.width * img.height / (mapConfig.tilewidth * mapConfig.tileheight)

        RW.ObjectGroups = {};
        for(i=1;i<=len;i++){
            var group = game.add.group();
            RW.map.createFromObjects('Object Layer' ,i ,'objects', i-1, true, false, group, Phaser.Sprite, false);
            // if(group.children.length){
                group.enableBody = true;
                RW.ObjectGroups[i] = group;
                game.physics.arcade.enable(RW.ObjectGroups[i]);
                // physicsBodyType = Phaser.Physics.ARCADE;
            // }
        }

        RW.CharacterGroups = {};
        var characterGroup = game.add.group();

        RW.map.createFromObjects('Character Layer' ,1 ,RW.player.name , 0, true, false, characterGroup, Phaser.Sprite, false);
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

        // return;


        // ===== 玩家 ==============
        // this.player = game.add.sprite(0, 0, 'homu');
        // this.player.anchor.setTo(0,0);
        // this.player.scale.setTo(0.3,0.1);
        // this.player.scale.setTo(0.15,0.15);
        // this.player.y = this.par*0;
        // this.player.x = this.par*0;
        // this.player.direction = {x:-1,y:0}; // 人物方向
        // ---- 动画 -----
        // this.player.animations.add('up',['up.png'],1);
        // this.player.animations.add('left',['left.png'],1);
        // this.player.animations.add('down',['down.png'],1);
        // this.player.animations.add('right',['right.png'],1);
        // this.player.animations.play('left',1);  // 初始向左
        // ---- 物理 -----
        // game.physics.arcade.enable(this.player);
        // this.player.body.collideWorldBounds = true;  // 检测边界
        // game.camera.follow(this.player);  // 镜头跟随

        // this.map.setTileIndexCallback(1,this.getBaoshi, this);
        // this.map.setTileIndexCallback(4,this.export, this);

        // ===== 文字 ==================
        // this.text_site = game.add.text(600,400, "你的位置", this.textStyle);
        // this.text_time = game.add.text(600,450, "时间", this.textStyle);
        // this.text_xinbiao = game.add.text(600,350, "信标", this.textStyle);
        // // ===== 上一次的坐标 =====
        // this.player_last_x = this.player.x;
        // this.player_last_y = this.player.y;

        // ===== 子弹组 ========
        // this.group_bullet = game.add.group();
        // this.group_bullet.enableBody = true;
        console.log(RW.Keys.DOWN.isDown);

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
    },
    update: function(){
        // RW.update.listenKey.playerMove();

        // game.physics.arcade.overlap(
        //     RW.CharacterGroups.player,
        //     RW.ObjectGroups["4"],
        //     function(player, wall){
        //         console.log(wall.x);
        //         console.log(wall.y);
        //     }, null, game);

        for(object of RW.update.collision.GroupList){
            group1 = object.group1;
            group2 = object.group2;
            feedback = object.feedback;
            object.isCollided = false;
            context = object.context ;
            that = object.that;
            // console.log(list)
            game.physics.arcade.collide(group1, group2,
            function(sprite1, sprite2){
                // sprite1.x = sprite1.oldx;
                // sprite1.y = sprite1.oldy;
                object.isCollided = true;
                feedback.apply(that, [sprite1, sprite2, context]);
            }, null);  // 检测重叠
        }

        // for(object of RW.update.collision.TileList) {
        //     console.log(object);
        //     RW.map.setTileIndexCallback(object.tileIndex,
        //         object.feedback ? object.feedback : null)
        // }

        RW.update.listenKey.keyEventList.forEach(function(object){
            // console.log(object)
            if(RW.Keys[object.key].justDown){
                // object.feedback(object.context);
                object.feedback.apply(object.that, [object.context]);
            }
        });

        YourGame.update();
    },
    render: function(){
    }
};



RW.methods = {};

// RW.methods.playerMove = function(player, resolve, reject, resolveContext, rejectContext, that=RW.DeveloperModel){
RW.methods.playerMove = function(player, x, y, resolve, reject, resolveContext, rejectContext, that=RW.DeveloperModel){

    // player.x += player.direction.x * RW.par.x;
    // player.y += player.direction.y * RW.par.y;

    canMove = true;

    if(x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT){
        canMove = false;
    }

    RW.update.collision.playerGroupList.forEach(
        function(object){
            object.group.forEach(function(sprite){
                if(x == sprite.x && y == sprite.y){
                    canMove = false;
                    if(object.feedback){
                        object.feedback.apply(that, [player,sprite]);
                    }
                }
            })
        });

    RW.update.collision.playerTileList.forEach(
        function(object){
        var tile = RW.methods.getTilefromSite(x, y);
        if(tile && tile.index == object.tileIndex){
            canMove = false;
            if(object.feedback) {
                object.feedback.apply(that, [player,sprite]);
                // object.feedback(player, tile);
            }
        }
    });

    console.log(canMove)
    if(canMove){
        player.oldx = player.x;
        player.oldy = player.y;

        player.x = x;
        player.y = y;
        console.log('player can move.')
        if(resolve){
            resolve.apply(that,[resolveContext]);
        }
    }else{
        console.log('player can\'t move.')
        if(reject){
            reject.apply(that, [rejectContext]);
        }
    }
};

RW.methods.tileChangeTo = function(tile, index){
    tile.index = index;
    RW.layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};
RW.methods.getTilefromSite = function(x,y){
    tile = RW.map.getTile(x / RW.par.x, y / RW.par.y);
    return tile;
};
RW.methods.getPlayerSite = function(){
    // 得到玩家坐标,
    site = [];
    RW.CharacterGroups.player.forEach(function(player){
        site.push({x:player.x, y:player.y});
    });
    return site;
};

RW.methods.setGroup = function(key, index, x, y){
    // 默认存在0个精灵, 默认key 为spritesheet, index 从1开始
    group = game.add.group();
    group.enableBody = true;

    return group;
};
RW.methods.setSprite = function(key, index, group, x, y){
    sprite = game.add.sprite(x, y, key, index-1);
    group.add(sprite);
    return sprite;
};
RW.methods.getSpriteFromSite = function(group, x, y){
    // 从一个组里, 且在这个位置上, 拿精灵, 返回列表
    var sprite = [];
    group.forEach(function(s){
        // console.log(s)
        if(s.x == x && s.y == y){
            sprite.push(s);
        }
    })
    return sprite;
};
RW.methods.destroySprite = function(sprite){
    console.log(sprite);
    sprite.destroy();
    // group.remove(sprite);
};

RW.methods.WIN = function(str){
    w = WIDTH / 1.5;
    h = HEIGHT / 1.5;
    x = (WIDTH - w) / 2;
    y = (HEIGHT - w) / 2;
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
    text = game.add.text(game.world.centerX, y*1.2, "You Win\n"+str, style);
    text.anchor.set(0.5,0);
    // yourtext = game.add.text(game.world.centerX, y*1.2, str, style);
    // yourtext .anchor.set(0.5,0);


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

RW.update.listenKey.playerMove = function(resolve, reject, resolveContext, rejectContext, that=RW.DeveloperModel){
    for(k in RW.moveKey){
        if(RW.Keys[RW.moveKey[k]].justDown){
            // playerMove(game);
            RW.CharacterGroups.player.forEachAlive(function(player){
                player.direction.x = RW.UDLRDir[k].x;
                player.direction.y = RW.UDLRDir[k].y;

                var x = player.x + player.direction.x * RW.par.x;
                var y = player.y + player.direction.y * RW.par.y;

                RW.methods.playerMove(player, x, y, resolve, reject, resolveContext, rejectContext, that);
            })
        }
    }
};
RW.update.collision = {};
RW.update.collision.GroupList = [];
RW.update.collision.TileList = [];
RW.update.collision.playerGroupList = [];
RW.update.collision.playerTileList = [];
RW.update.collision.blockTileOverlap = function(group, tileIndex, feedback, context, that=RW.DeveloperModel){
    if(group == RW.CharacterGroups.player){
        RW.update.collision.playerTileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }
    // RW.update.collision.TileList.push([group, tileIndex, feedback]);
};
RW.update.collision.blockGroupOverlap = function(group1, group2, feedback, context, that=RW.DeveloperModel) {
    if (group1 == RW.CharacterGroups.player) {
        RW.update.collision.playerGroupList.push({
            group: group2,
            feedback: feedback,
            context: context,
            that: that,
        });
    }
    // RW.update.collision.GroupList.push({
    //     group1: group1,
    //     group2: group2,
    //     feedback: feedback,
    //     isCollided: false,
    //     context: context,
    //     that: that,
    // });
};

RW.update.collision.activeGroupOverlap = function(group1, group2, feedback, context, that=RW.DeveloperModel){
    RW.update.collision.GroupList.push({
        group1: group1,
        group2: group2,
        feedback: feedback,
        isCollided: false,
        context: context,
        that: that,
    });
};
RW.update.collision.activeTileOverlap = function(group, tileIndex, feedback, context, that=RW.DeveloperModel){
    RW.update.collision.TileList.push({
        group: group,
        tileIndex: tileIndex,
        feedback: feedback,
        isCollided: false,
        context: context,
        that: that,
    });
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


