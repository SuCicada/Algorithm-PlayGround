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
/* 通过背包增加的对象组,和通过地图设定的对象组,都会自动创建并加入 APG.TargetGroups 中,
*  但是通过地图第三层, 即玩家层,创建的玩家对象组,会加入 APG.CharacterGroups 中
* 两种用法都一样, 只需要从这两个js中的对象拿取相应的组即可
* */
        APG.Assets.playMusic('mu');
        APG.bag.addItem('xinbiao','xinbiao',1,this.xinbiaoMax);
        // this.xinbiaos = group;
        // APG.bag.addItem('baoshi');  /*数量会自动计算的*/

        this.exports = APG.methods.getTargetGroup("chukou");
        this.baoshis = APG.methods.getTargetGroup("baoshi");
        this.xinbiaos = APG.methods.getTargetGroup("xinbiao");

        this.player = APG.methods.getCharacterGroup('player');
        APG.methods.moveGroupUpTo(this.player, this.xinbiaos);

        APG.methods.setAnimations(this.baoshis, 'rotation', null, 6, true)
        // APG.methods.setAnimations(this.player, 'left', [0]);
        // APG.methods.setAnimations(this.player, 'right', [1]);
        // APG.methods.setAnimations(this.player, 'down', [2]);
        // APG.methods.setAnimations(this.player, 'up', [3]);

        APG.methods.playerMoveAnimations(this.player,{
            /* 方向(大写,或小写 -> frames 或单个数字*/
            right: 0,
            LEFT: [1],
            down: [2],
            up: 3,
        });

        APG.update.listenKey.setMoveKey('up','UP');

        APG.update.setCollideWorldBounds(false);

        // APG.update.collision.blockTileOverlap(this.player, 2);
        APG.update.collision.blockGroupOverlap(this.player, this.walls);
        APG.update.collision.activeGroupOverlap(this.player, this.baoshis, this.getBaoshi, null, this);
        APG.update.collision.activeGroupOverlap(this.player, this.exports, this.export);
        APG.update.listenKey.addKeyEvent('D', this.putXinbiao, null, this);
        // APG.methods.WIN("你好,\n你输了");
    },
    update: function(){
        var site = APG.methods.getCharacterSite(this.player);
        // console.log(site)
        APG.update.listenKey.characterMoveEvent(this.player, this.checkMove, this.dropDaolu, [site], null, null, this);
        var tile = APG.methods.getCharacterTile(this.player);
        if(!tile || APG.methods.getTileId(tile)==2){
            setTimeout(function(){
                // location.reload();
                APG.methods.restartGame();
            },100);
        }

        if(APG.bag.getItemNum('xinbiao') == this.xinbiaoMax &&
            APG.methods.getSpriteList('baoshi') == 0){
            APG.methods.setAnimations(this.exports, 'light', [1]);
        }else{
            APG.methods.setAnimations(this.exports, 'dark', [0]);
        }

        // APG.update.collision.GroupToGroup(this.player, this.walls,
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
        // var tile = APG.methods.getTileFromSite(x, y);
        // if(tile){
        //     return true;
        // }else{
        //     return false;
        // }
    },
    getBaoshi: function(player, baoshi){
        // 得到宝石
        console.log(this.xinbiaoSite);

        APG.methods.destroySprite(baoshi);
        if(this.xinbiaoSite.length){
            var site = APG.methods.getCharacterSite(player);
            var x = this.xinbiaoSite[this.xinbiaoSite.length-1]['x'];
            var y = this.xinbiaoSite[this.xinbiaoSite.length-1]['y'];
            APG.methods.moveCharacter(player, x, y);
            this.dropDaolu(site);
        }
    },
    dropDaolu: function(site){
        // 道路塌陷
        // site = APG.methods.getCharacterSite(false)[0];
        console.log(site)
        var sprites = APG.methods.getSpriteListFromSite(site.x, site.y, this.wildXinbiao);

        console.log(sprites)
        if(sprites.length == 0){
            /*
            * 当前下面有           ,上面有             -> 将自己变成边缘
            * 当前下面无 (下面是边缘),上面有             -> 消除下面的边缘,将自己变成边缘
            * 当前下面有           ,上面无 || 上面是边缘 -> 只消除自己
            * 当前下面无 (下面是边缘),上面无 || 上面是边缘 -> 消除下面的边缘,消除自己
            * */
            var tile = APG.methods.getTileFromSite(site.x, site.y);
            // console.log(tile.x,tile.y)

            var uptile   = APG.methods.getTileFromSite(site.x, site.y-1);
            var downtile = APG.methods.getTileFromSite(site.x, site.y+1);
            console.log(tile.x,tile.y)
            if(uptile==null || APG.methods.getTileId(uptile)==2){
                APG.methods.removeTile(tile);
            }else if(APG.methods.getTileId(uptile)==1){
                APG.methods.changeTile(tile, 2);
            }
            if(downtile && APG.methods.getTileId(downtile)==2){
                /* 为了以防万一 ,判断一下有没有下方砖块 */
                APG.methods.removeTile(downtile);
            }
        }
    },
    putXinbiao: function(){
        var site = APG.methods.getCharacterSite(this.player);
        /* 放置的信标已经不在背包中的信标组中了 */
        var sprites = APG.methods.getSpriteListFromSite(site.x, site.y,this.wildXinbiao);

        if(sprites.length){
            APG.bag.getItem('xinbiao',sprites);
            // sprites.forEach(function(s){
                // APG.methods.destroySprite(s);
            // });
            console.log()
            this.xinbiaoCount ++;
            var index = this.xinbiaoSite.findIndex(function(v){
                return v.x == site.x && v.y == site.y;
            });
            this.xinbiaoSite.splice(index,1);
            this.wildXinbiao.splice(index,1);

        }else if(this.xinbiaoCount){
            var s = APG.bag.putItem('xinbiao',site.x,site.y);
            APG.methods.moveGroupDownTo(s,this.player); /* 放到玩家之下*/
            this.xinbiaoCount --;
            this.xinbiaoSite.push(site);
            this.wildXinbiao.push(s)
        }

        if(this.wildXinbiao.length){
            for(i = 0;i<this.wildXinbiao.length;i++){
                if(i == this.wildXinbiao.length-1){
                    APG.methods.setAnimations(this.wildXinbiao[i],'light',[0]);
                }else{
                    APG.methods.setAnimations(this.wildXinbiao[i],'dark',[1]);
                }
            }
        }
        // xinbiao = APG.methods.getSpriteListFromSite(x,y);
        // console.log(this.wildXinbiao)
        // console.log(this.xinbiaoSite)
        // console.log(this.xinbiaoCount)

        // APG.methods.setGroup('objects', 2, site.x, site.y);
    },
    export: function(){
        var site = APG.methods.getCharacterSite(this.player);
        var sprite = APG.methods.getSpriteListFromSite(site.x,site.y,this.exports);
        var frame = APG.methods.getFrame(sprite[0])
        if(frame == 1){
            str = "贡献者:SuCicada";
            APG.methods.WIN(str,function(){
                window.location.href="https://github.com/SuCicada/ResetWorldrr"
            });
        }
    }
}