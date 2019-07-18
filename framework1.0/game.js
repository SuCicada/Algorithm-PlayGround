var rate = 60;
var WIDTH = 16*rate;
var HEIGHT = 9*rate;

var game = new Phaser.Game(WIDTH,HEIGHT,Phaser.CANVAS, 'game');
var blocks = [{
        id: 1,
        bg: 1,
        type: "land",
    },{
        id: 2,
        bg: 2,
        type: "land",
    },{
        id: 3,
    }
];

var bootstrap = {
    init: function () {
        game.scale.scaleMode = Phaser.ScaleManager["SHOW_ALL"];
        game.scale.refresh();
    },
    preload: function() {
        game.load.script('map', 'map/maza/map.js');
    },
    create: function(){
        game.state.add("preload",preload);
        game.state.start("preload");
    }
};

var preload = {
    preload: function(){
        tilemap_data = this.generate_tilemap_data(mapConfig,"layer");

        // ======= 迷宫 =============
        this.load.image('objects','map/maza/object.png');
        this.load.image('maza','map/maza/maza.png');
        // this.load.tilemap('mazajson', 'map/maza/maza.json',null,Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('mazajson', null, tilemap_data, Phaser.Tilemap.TILED_JSON);

        this.load.atlasJSONHash('homu','sprites/homu.png','sprites/homu.json');
        this.load.atlasJSONHash('bullet','sprites/bullet.png','sprites/bullet.json');
        // this.load.image('enemy','img/beibei.png');
        // this.load.image('enemy_bullet','img/bullet.png');
    },
    create: function () {
        game.state.add("startGame",startGame);
        game.state.start("startGame");
    },
    generate_tilemap_data: function(map,layername){
        tilemap_data = {
            height: map.height,
            width: map.width,
            tileheight: map.tileheight,
            tilewidth: map.tilewidth,
            infinite: false,
            layers: [
                {
                    data: [],
                    height: map.height,
                    width: map.width,
                    id: 1,
                    name: layername,
                    opacity: 1,         // 不透明度
                    type: "tilelayer",
                    visible: true,
                    x: 0,
                    y: 0
                }],                     // 就一层地形
            nextlayerid: 2,
            nextobjectid: 1,
            orientation: "orthogonal",  // 旋转(正常)
            renderorder: "right-down",   // 渲染方向
            tilesets: map.tilesets,
            type: "map",
            // version:1.2,
        };

        mapdata = map.layers.data;
        for(let i in mapdata ){
            tilemap_data.layers[0].data.push(mapdata[i][0]);
        }

        return tilemap_data;
    }
};

var startGame = {
    init: function(){
        this.par = 25;  // 格子边长
        this.textStyle= { font: "48px Arial", fill: "#ff0044", align:"center" };
        this.time = {};
        this.time.now = 0; // 现在的时间
        this.time.alive = false; // 时间流逝

        // ==== 按键 ======
        this.cursors = game.input.keyboard.createCursorKeys(); //方向按键
        this.AKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.SKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.DKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

        this.Keys = [
            this.cursors.up,
            this.cursors.down,
            this.cursors.left,
            this.cursors.right,
            this.AKey,
            this.SpaceKey,
            this.SKey,
            this.DKey
        ];

        // ====== 特殊的参数 =====
        this.xinbiaoCount = 3;  // 信标数量
        this.xinbiaoSite = [];
    },
    preload: function(){
        $.each(this.Keys,function(i,value){
            value.click = false;
        });
    },
    create: function(){
        // ===== 地图 =====
        this.map = game.add.tilemap('mazajson');
        this.map.addTilesetImage('mazatile','maza');
        this.map.setCollision(1);
        this.map.setCollision(4);
        this.map.setCollision(5);
        this.map.setCollision(6);
        this.layer = this.map.createLayer("layer");

        // this.layer.debug = true;
        this.layer.resizeWorld();


        // ===== 玩家 ==============
        this.player = game.add.sprite(0, 0, 'homu');
        this.player.anchor.setTo(0,0);
        // this.player.scale.setTo(0.3,0.1);
        this.player.scale.setTo(0.15,0.15);
        this.player.y = this.par*0;
        this.player.x = this.par*0;
        this.player.direction = {x:-1,y:0}; // 人物方向
        // ---- 动画 -----
        this.player.animations.add('up',['up.png'],1);
        this.player.animations.add('left',['left.png'],1);
        this.player.animations.add('down',['down.png'],1);
        this.player.animations.add('right',['right.png'],1);
        this.player.animations.play('left',1);  // 初始向左
        // ---- 物理 -----
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;  // 检测边界
        game.camera.follow(this.player);  // 镜头跟随

        this.map.setTileIndexCallback(1,this.getBaoshi, this);
        this.map.setTileIndexCallback(4,this.export, this);

        // ===== 文字 ==================
        this.text_site = game.add.text(600,400, "你的位置", this.textStyle);
        this.text_time = game.add.text(600,450, "时间", this.textStyle);
        this.text_xinbiao = game.add.text(600,350, "信标", this.textStyle);
        // // ===== 上一次的坐标 =====
        // this.player_last_x = this.player.x;
        // this.player_last_y = this.player.y;

        // ===== 子弹组 ========
        this.group_bullet = game.add.group();
        this.group_bullet.enableBody = true;

    },

};

game.state.add('bootstrap', bootstrap);
game.state.start('bootstrap');


