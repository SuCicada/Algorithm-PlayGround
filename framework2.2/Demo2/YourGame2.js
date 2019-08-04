YourGame = {
    init: function(){

    },
    preload: function(){
    },
    create: function(){
/* 通过背包增加的对象组,和通过地图设定的   对象组,都会自动创建并加入 RW.ObjectGroups 中,
*  但是通过地图第三层, 即玩家层,创建的玩家对象组,会加入 RW.CharacterGroups 中
* 两种用法都一样, 只需要从这两个js中的对象拿取相应的组即可
* */
        // RW.Assets.stopMusic('mu')
        this.exports = RW.methods.getObjectGroup("chukou");
        this.numBlocks = RW.methods.getObjectGroup("numBlock");

        let nums = [12,3,45,7,11,425,9];
        RW.methods.loadTextBitMapBetween(this.numBlocks,nums,'rgb(212,142,0)');

        this.player = RW.methods.getCharacterGroup('player');
        RW.methods.moveObjectUpTo(this.player, this.exports);

        RW.methods.playerMoveAnimations(this.player,{
            /* 方向(大写,或小写 -> frames 或单个数字*/
            right: 0,
            LEFT: [1],
            down: [2],
            up: 3,
        });

        RW.update.listenKey.setMoveKey('up','UP');

        RW.update.setCollideWorldBounds(false);

        RW.update.collision.blockGroupOverlap(this.player, this.numBlocks);
        RW.update.collision.activeGroupOverlap(this.player, this.baoshis, this.getBaoshi, null, this);
        RW.update.collision.activeGroupOverlap(this.player, this.exports, this.export);
        RW.update.listenKey.addKeyEvent('E', this.swapBlock, null, this);
    },
    update: function(){
        // var site = RW.methods.getPlayerSite(this.player);
        RW.update.listenKey.playerMove(this.player, this.checkMove, null, null, null, null, this);
        var tile = RW.methods.getPlayerTile(this.player);
        if(!tile || RW.methods.getTileIndex(tile)==3){
            RW.update.listenKey.stopListenKey();
            setTimeout(function(){
                location.reload();
            },100);
        }

        this.checkBlocks();
    },
    checkMove: function(newX,newY){
        /* 无论之前检测是否能通行, 这里都会再次传入坐标执行,
         * 所以记得判断一下前方是什么
         * */
        var tile = RW.methods.getTilefromSite(newX, newY);
        if(!tile){
            return;
        }
        let tileIndex = RW.methods.getTileIndex(tile);
        let nowSite = RW.methods.getPlayerSite(this.player);
        if(tileIndex == 2 && nowSite.x - 1 == newX){
            return false;
        }else if(tileIndex == 4 && nowSite.x + 1 == newX){
            return false;
        }
    },
    checkBlocks: function(){
        let blocks = RW.methods.getSpriteList(this.numBlocks);
        blocks = blocks.sort(function(a,b){
           return RW.methods.getSpriteSite(a).x < RW.methods.getSpriteSite(b);
        });
        let flag = 1;
        for(let i = 0;i<blocks.length-1;i++){
            let num1 = RW.methods.aboutTextBitMap(blocks[i]).text;
            let num2 = RW.methods.aboutTextBitMap(blocks[i+1]).text;
            num1 = parseInt(num1);
            num2 = parseInt(num2);
            if(num1 > num2){
                flag = 0;
            }
        }
        if(flag){
            RW.methods.animations(this.exports, 'light', [1]);
        }else{
            RW.methods.animations(this.exports, 'dark', [0]);
        }
    },
    swapBlock: function(){
        /* 方向*/
        let dir = RW.methods.getPlayerDirection(this.player);
        /* 当前位置 */
        let site = RW.methods.getPlayerSite(this.player);
        /* 前方的块们 */
        let block = RW.methods.getSpritesFromSite(site.x, site.y+dir.y, this.numBlocks);
        /* 前方的左边的块们 */
        let blockLeft = RW.methods.getSpritesFromSite(site.x+dir.y, site.y+dir.y, this.numBlocks);
        let info = RW.methods.aboutTextBitMap(block[0]);

        if(info.text && blockLeft.length){
            let infoLeft = RW.methods.aboutTextBitMap(blockLeft[0]);
            RW.methods.loadTextBitMap(block[0], infoLeft.text);
            RW.methods.loadTextBitMap(blockLeft[0], info.text);
        }

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
    export: function(){
        var site = RW.methods.getPlayerSite(this.player);
        var sprite = RW.methods.getSpritesFromSite(site.x,site.y,this.exports);
        var frame = RW.methods.getObjectFrame(sprite[0]);
        if(frame == 1){
            let str = "贡献者:SuCicada\n" +
                "Click to GitHub";
            RW.methods.WIN(str,function(){
                window.location.href="https://github.com/SuCicada/ResetWorld"
            });
        }
    }
}