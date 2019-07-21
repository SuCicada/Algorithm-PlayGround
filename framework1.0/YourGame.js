YourGame = {
    init: function(){
        // ====== 特殊的参数 =====
        this.xinbiaoCount = 3;  // 信标数量
        this.xinbiaoSite = [];
    },
    preload: function(){

    },
    create: function(){

        // 第一个参数是json中的tileset名, 第二个参数是地图贴图的key
        // 推荐这两个名字取得一样
        // this.map = RW.map;
        // this.map.addTilesetImage('map/maza/maza.png','maza');


        this.walls = RW.ObjectGroups["4"];
        this.baoshis = RW.ObjectGroups["1"];
        this.exports = RW.ObjectGroups["3"];
        this.xinbiaos = RW.ObjectGroups["2"];
        // this.xinbiaos = RW.methods.setGroup();

        this.player = RW.CharacterGroups['player'];
        RW.moveKey.UP = 'UP';  // 测试修改移动按键

        RW.update.collision.blockTileOverlap(this.player, 2);
        RW.update.collision.blockGroupOverlap(this.player, this.walls);
        RW.update.collision.activeGroupOverlap(this.player, this.baoshis, this.getBaoshi, null, this);
        RW.update.collision.activeGroupOverlap(this.player, this.exports, this.export);
        RW.update.listenKey.addKeyEvent('D', this.putXinbiao, null, this);
        // RW.methods.WIN("你好,\n你输了");
    },
    update: function(){
        site = RW.methods.getPlayerSite()[0];
        RW.update.listenKey.playerMove(this.dropDaolu, null, site, null, this);
        // RW.update.collision.GroupToGroup(this.player, this.walls,
        //     function(player, wall){
        //         // console.log(wall.x);
        //         // console.log(wall.y);
        // });
        // game.physics.arcade.(this.player, this.walls,
        //     function(player, wall){
        //         console.log(wall.x);
        //         console.log(wall.y);
        //     }, null, game);
    },
    getBaoshi: function(player, baoshi){
        // 得到宝石
        console.log(baoshi);
        RW.methods.destroySprite(baoshi);
        if(this.xinbiaoSite.length){
            site = RW.methods.getPlayerSite()[0];
            x = this.xinbiaoSite[this.xinbiaoSite.length-1]['x'];
            y = this.xinbiaoSite[this.xinbiaoSite.length-1]['y'];
            RW.methods.playerMove(player, x, y);
            this.dropDaolu(site);
        }
    },
    dropDaolu: function(site){
        // 道路塌陷
        // site = RW.methods.getPlayerSite(false)[0];
        tile = RW.methods.getTilefromSite(site.x, site.y);
        sprite = RW.methods.getSpriteFromSite(this.xinbiaos, site.x, site.y);

        // console.log(site)
        // console.log(sprite)
        if(sprite.length == 0){
            RW.methods.tileChangeTo(tile, 2);
        }
    },
    putXinbiao: function(){
        site = RW.methods.getPlayerSite()[0];
        sprite = RW.methods.getSpriteFromSite(this.xinbiaos, site.x, site.y);


        if(sprite.length){
            sprite.forEach(function(s){
                RW.methods.destroySprite(s);
            });
            this.xinbiaoCount ++;
            index = this.xinbiaoSite.findIndex(function(v){
                return v.x == site.x && v.y == site.y;
            });
            this.xinbiaoSite.splice(index,1);

        }else if(this.xinbiaoCount){
            RW.methods.setSprite('objects', 2, this.xinbiaos, site.x, site.y);
            this.xinbiaoCount --;
            this.xinbiaoSite.push(site);
        }

        // RW.methods.setGroup('objects', 2, site.x, site.y);
    },
    export: function(){
        str = "贡献者:SuCicada";
        RW.methods.WIN(str);
    }
}