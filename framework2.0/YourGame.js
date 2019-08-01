YourGame = {
    init: function(){

    },
    preload: function(){
    },
    create: function(){

        // ====== 特殊的参数 =====
        this.xinbiaoMax = 3;    // 信标总数量
        this.xinbiaoCount = 3;  // 信标数量
        this.xinbiaoSite = [];
        this.wildXinbiao = [];
/* 通过背包增加的对象组,和通过地图设定的对象组,都会自动创建并加入 RW.ObjectGroups 中,
*  但是通过地图第三层, 即玩家层,创建的玩家对象组,会加入 RW.CharacterGroups 中
* 两种用法都一样, 只需要从这两个js中的对象拿取相应的组即可
* */
        RW.bag.addItem('xinbiao','xinbiao',1,this.xinbiaoMax);
        // this.xinbiaos = group;
        RW.bag.addItem('baoshi');  /*数量会自动计算的*/

        this.baoshis = RW.ObjectGroups["baoshi"];
        this.exports = RW.ObjectGroups["chukou"];
        this.xinbiaos = RW.ObjectGroups["xinbiao"];
        // this.xinbiaos = RW.methods.setGroup();

        this.player = RW.CharacterGroups['player'];
        RW.methods.moveObjectUpTo(this.player, this.xinbiaos);
        // console.log(game.world.children)
        // this.player = RW.methods.getCharacterSprite('player')

        RW.methods.animations(this.baoshis, 'rotation', null, 6, true)
        // RW.methods.animations(this.player, 'left', [0]);
        // RW.methods.animations(this.player, 'right', [1]);
        // RW.methods.animations(this.player, 'down', [2]);
        // RW.methods.animations(this.player, 'up', [3]);

        RW.methods.PlayerMoveAnimations(this.player,{
            /* 方向(大写,或小写 -> frames 或单个数字*/
            right: 0,
            LEFT: [1],
            down: [2],
            up: 3,
        });

        RW.moveKey.UP = 'UP';  // 测试修改移动按键

        RW.update.setCollideWorldBounds(false);

        // RW.update.collision.blockTileOverlap(this.player, 2);
        RW.update.collision.blockGroupOverlap(this.player, this.walls);
        RW.update.collision.activeGroupOverlap(this.player, this.baoshis, this.getBaoshi, null, this);
        RW.update.collision.activeGroupOverlap(this.player, this.exports, this.export);
        RW.update.listenKey.addKeyEvent('D', this.putXinbiao, null, this);
        // RW.methods.WIN("你好,\n你输了");
    },
    update: function(){
        var site = RW.methods.getPlayerSite(this.player);
        // console.log(site)
        RW.update.listenKey.playerMove(this.checkMove, this.dropDaolu, [site], null, null, this);
        var tile = RW.methods.getPlayerTile(this.player);
        if(!tile || RW.methods.getTileIndex(tile)==2){
            setTimeout(function(){
                location.reload();
            },100);
        }

        if(RW.bag.getItemNum('xinbiao') == this.xinbiaoMax &&
            RW.bag.getItemNum('baoshi') == 0){
            RW.methods.animations(this.exports, 'light', [1]);
        }else{
            RW.methods.animations(this.exports, 'dark', [0]);
        }

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
    checkMove: function(x,y){
        // var tile = RW.methods.getTilefromSite(x, y);
        // if(tile){
        //     return true;
        // }else{
        //     return false;
        // }
    },
    getBaoshi: function(player, baoshi){
        // 得到宝石
        console.log(this.xinbiaoSite);

        RW.methods.destroySprite(baoshi);
        if(this.xinbiaoSite.length){
            var site = RW.methods.getPlayerSite(player);
            var x = this.xinbiaoSite[this.xinbiaoSite.length-1]['x'];
            var y = this.xinbiaoSite[this.xinbiaoSite.length-1]['y'];
            RW.methods.playerMoveTo(player, x, y);
            this.dropDaolu(site);
        }
    },
    dropDaolu: function(site){
        // 道路塌陷
        // site = RW.methods.getPlayerSite(false)[0];
        console.log(site)
        var sprites = RW.methods.getSpriteFromSite(site.x, site.y, this.wildXinbiao);

        console.log(sprites)
        if(sprites.length == 0){
            /*
            * 当前下面有           ,上面有             -> 将自己变成边缘
            * 当前下面无 (下面是边缘),上面有             -> 消除下面的边缘,将自己变成边缘
            * 当前下面有           ,上面无 || 上面是边缘 -> 只消除自己
            * 当前下面无 (下面是边缘),上面无 || 上面是边缘 -> 消除下面的边缘,消除自己
            * */
            var tile = RW.methods.getTilefromSite(site.x, site.y);
            // console.log(tile.x,tile.y)

            var uptile   = RW.methods.getTilefromSite(site.x, site.y-1);
            var downtile = RW.methods.getTilefromSite(site.x, site.y+1);
            console.log(tile.x,tile.y)
            if(uptile==null || RW.methods.getTileIndex(uptile)==2){
                RW.methods.removeTile(tile);
            }else if(RW.methods.getTileIndex(uptile)==1){
                RW.methods.tileChangeTo(tile, 2);
            }
            if(downtile && RW.methods.getTileIndex(downtile)==2){
                /* 为了以防万一 ,判断一下有没有下方砖块 */
                RW.methods.removeTile(downtile);
            }
        }
    },
    putXinbiao: function(){
        var site = RW.methods.getPlayerSite(this.player);
        /* 放置的信标已经不在背包中的信标组中了 */
        var sprites = RW.methods.getSpriteFromSite(site.x, site.y,this.wildXinbiao);

        // console.log(sprites)
        if(sprites.length){
            RW.bag.getItem('xinbiao',sprites);
            // sprites.forEach(function(s){
                // RW.methods.destroySprite(s);
            // });
            this.xinbiaoCount ++;
            var index = this.xinbiaoSite.findIndex(function(v){
                return v.x == site.x && v.y == site.y;
            });
            this.xinbiaoSite.splice(index,1);
            this.wildXinbiao.splice(index,1);
        }else if(this.xinbiaoCount){
            // console.log(this.xinbiaos)
            // RW.methods.setSprite('objects', 2, this.xinbiaos, site.x, site.y);
            // console.log(site)
            var s = RW.bag.putItem('xinbiao',site.x,site.y);
            RW.methods.moveObjectDownTo(s,this.player); /* 放到玩家之下*/
            this.xinbiaoCount --;
            this.xinbiaoSite.push(site);
            this.wildXinbiao.push(s)
        }

        if(this.wildXinbiao.length){
            for(i = 0;i<this.wildXinbiao.length;i++){
                if(i == this.wildXinbiao.length-1){
                    RW.methods.animations(this.wildXinbiao[i],'light',[0]);
                }else{
                    RW.methods.animations(this.wildXinbiao[i],'dark',[1]);
                }
            }
        }
        // xinbiao = RW.methods.getSpriteFromSite(x,y);
        // console.log(this.wildXinbiao)
        // console.log(this.xinbiaoSite)
        // console.log(this.xinbiaoCount)

        // RW.methods.setGroup('objects', 2, site.x, site.y);
    },
    export: function(){
        var site = RW.methods.getPlayerSite(this.player);
        var sprite = RW.methods.getSpriteFromSite(site.x,site.y,this.exports);
        var frame = RW.methods.getObjectFrame(sprite[0])
        if(frame == 1){
            str = "贡献者:SuCicada";
            RW.methods.WIN(str,function(){
                window.location.href="https://github.com/SuCicada/ResetWorldrr"
            });
        }
    }
}