YourGame = {
    create: function(){
        var siteX = APG.HEIGHT * 0.2 ;
        var siteY = APG.HEIGHT *0.7
        var bar = APG.HEIGHT * 0.1;

        APG.Assets.setVirtualButton('tool1', APG.WIDTH*0.8, siteY, function(){
            APG.DeveloperModel.putXinbiao();//.apply(APG.DeveloperModel)
        });


        // APG.Game.fullScreen();

        // ====== 特殊的参数 =====
        this.xinbiaoMax = 1;    // 信标总数量
        this.xinbiaoCount = 1;  // 信标数量
        this.xinbiaoSite = [];
        this.wildXinbiao = [];
/* 通过背包增加的对象组,和通过地图设定的对象组,都会自动创建并加入 APG.TargetGroups 中,
*  但是通过地图第三层, 即玩家层,创建的玩家对象组,会加入 APG.CharacterGroups 中
* 两种用法都一样, 只需要从这两个js中的对象拿取相应的组即可
* */
        APG.Assets.playMusic('mu');
        let xinbiao = APG.Sprite.addSprite(0,0,'xinbiao',2,null,'xinbiao');
        APG.Bag.addItem(xinbiao,this.xinbiaoMax);
        // APG.Bag.addItem('xinbiao','xinbiao',1,this.xinbiaoMax);
        // this.xinbiaos = group;
        // APG.bag.addItem('baoshi');  /*数量会自动计算的*/

        this.exports = APG.Group.getTargetGroup("chukou");
        this.baoshis = APG.Group.getTargetGroup("baoshi");
        // this.xinbiaos = APG.Group.getTargetGroup("xinbiao");

        this.player = APG.Group.getCharacterGroup('player');
        // APG.Group.moveGroupUpTo(this.player, this.xinbiaos);

        APG.Assets.setAnimations(this.baoshis, 'rotation', null, 6, true);
        // APG.methods.setAnimations(this.player, 'left', [0]);
        // APG.methods.setAnimations(this.player, 'right', [1]);
        // APG.methods.setAnimations(this.player, 'down', [2]);
        // APG.methods.setAnimations(this.player, 'up', [3]);

        APG.Assets.playerMoveAnimations(this.player,{
            /* 方向(大写,或小写 -> frames 或单个数字*/
            right: 0,
            LEFT: [1],
            down: [2],
            up: 3,
        });

        APG.Update.listenKey.setMoveKey('up','UP');

        APG.Update.collision.setCollideWorldBounds(false);

        // APG.update.collision.blockTileOverlap(this.player, 2);
        APG.Update.collision.blockGroupOverlap(this.player, this.walls);
        APG.Update.collision.activeGroupOverlap(this.player, this.baoshis, this.getBaoshi, null, this);
        APG.Update.collision.activeGroupOverlap(this.player, this.exports, this.export);
        APG.Update.listenKey.addKeyEvent('D', this.putXinbiao, null, this);
    },
    update: function(){
        var site = APG.Character.getCharacterSite(this.player);
        // console.log(site)
        APG.Update.listenKey.characterMoveEvent(this.player, this.check, this.dropDaolu, [site], null, null, this);
        // this.Key = '';

        var tile = APG.Character.getCharacterTile(this.player);
        if(!tile || APG.Tile.getTileId(tile)==2){
            setTimeout(function(){
                APG.Game.restartGame();
            },100);
        }

        if(APG.Bag.getItemNum('xinbiao') == this.xinbiaoMax &&
            APG.Sprite.getSpriteList(this.baoshis) == 0){
            APG.Assets.setAnimations(this.exports, 'light', [1]);
        }else{
            APG.Assets.setAnimations(this.exports, 'dark', [0]);
        }
    },
    check: function(x,y){
        var tile = APG.Tile.getTileFromSite(x,y);
        if(!tile || APG.Tile.getTileId(tile)==2){
            return false;
        }
        return true;
    },
    getBaoshi: function(player, baoshi){
        // 得到宝石
        console.log(this.xinbiaoSite);

        APG.Sprite.destroySprite(baoshi);
        if(this.xinbiaoSite.length){
            var site = APG.Character.getCharacterSite(player);
            var x = this.xinbiaoSite[this.xinbiaoSite.length-1]['x'];
            var y = this.xinbiaoSite[this.xinbiaoSite.length-1]['y'];
            APG.Character.moveCharacter(player, x, y);
            this.dropDaolu(site);
        }
    },
    dropDaolu: function(site){
        // 道路塌陷
        // site = APG.methods.getCharacterSite(false)[0];
        console.log(site)
        var sprites = APG.Sprite.getSpriteListFromSite(site.x, site.y, this.wildXinbiao);

        console.log(sprites)
        if(sprites.length == 0){
            /*
            * 当前下面有           ,上面有             -> 将自己变成边缘
            * 当前下面无 (下面是边缘),上面有             -> 消除下面的边缘,将自己变成边缘
            * 当前下面有           ,上面无 || 上面是边缘 -> 只消除自己
            * 当前下面无 (下面是边缘),上面无 || 上面是边缘 -> 消除下面的边缘,消除自己
            * */
            var tile = APG.Tile.getTileFromSite(site.x, site.y);
            // console.log(tile.x,tile.y)

            var uptile   = APG.Tile.getTileFromSite(site.x, site.y-1);
            var downtile = APG.Tile.getTileFromSite(site.x, site.y+1);
            console.log(tile.x,tile.y)
            if(uptile==null || APG.Tile.getTileId(uptile)==2){
                APG.Tile.removeTile(tile);
            }else if(APG.Tile.getTileId(uptile)==1){
                APG.Tile.changeTile(tile, 2);
            }
            if(downtile && APG.Tile.getTileId(downtile)==2){
                /* 为了以防万一 ,判断一下有没有下方砖块 */
                APG.Tile.removeTile(downtile);
            }
        }
    },
    putXinbiao: function(){
        var site = APG.Character.getCharacterSite(this.player);
        /* 放置的信标已经不在背包中的信标组中了 */
        var sprites = APG.Sprite.getSpriteListFromSite(site.x, site.y, this.wildXinbiao);

        console.log(site)
        if(sprites.length){
            APG.Bag.getItem(sprites);
            this.xinbiaoCount ++;
            var index = this.xinbiaoSite.findIndex(function(v){
                return v.x == site.x && v.y == site.y;
            });
            this.xinbiaoSite.splice(index,1);
            this.wildXinbiao.splice(index,1);

        }else if(this.xinbiaoCount){
            var s = APG.Bag.putItem(site.x,site.y);
            console.log(s)
            APG.Group.moveGroupDownTo(s,this.player); /* 放到玩家之下*/
            this.xinbiaoCount --;
            this.xinbiaoSite.push(site);
            this.wildXinbiao.push(s)
        }

        if(this.wildXinbiao.length){
            for(i = 0;i<this.wildXinbiao.length;i++){
                if(i == this.wildXinbiao.length-1){
                    APG.Assets.setAnimations(this.wildXinbiao[i],'light',[0]);
                }else{
                    APG.Assets.setAnimations(this.wildXinbiao[i],'dark',[1]);
                }
            }
        }
    },
    export: function(){
        var site = APG.Character.getCharacterSite(this.player);
        var sprite = APG.Sprite.getSpriteListFromSite(site.x,site.y,this.exports);
        var frame = APG.Assets.getFrame(sprite[0])
        if(frame == 1){
            str = "贡献者:SuCicada";
            href = ''
            list = window.location.href.split('/');
            if(list[list.length-1] == 'part2.html'){
                href ="https://github.com/SuCicada/Algorithm-PlayGround"
            }else{
                str += "\n点击前往更大更广阔的世界吧.";
                href = '../Demo1-2'
            }
            APG.Game.WIN(str,function(){
                window.location.href = href;
            });
        }
    }
}
