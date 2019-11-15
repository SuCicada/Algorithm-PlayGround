var YourGame = {
    create: function(){
        this.numBlock = getTargetGroup("numBlock")
        this.swapNum = [12,34]
        APG.Assets.playMusic('mu');
        this.player = getCharacterGroup("player")
        loadTextBitMapBetween(this.numBlock, this.swapNum)
        blockTileOverlap(this.player, 0)
        blockGroupOverlap(this.player, this.numBlock)
        addKeyEvent('E',this.opera)
        // addTouchKey('tool',getGameWIDTH()*0.8,getGameHEIGHT()*0.7,this.opera)
        setBagCapacity(1)


        /* 虚拟按键操作*/
        APG.Assets.setVirtualButton('tool1',
            getGameWIDTH()*0.8,
            getGameHEIGHT()*0.7,
            function(){
                    this.opera();//.apply(APG.DeveloperModel)
                });

        // let style = {
        //     font: "bold "+APG.Tile.width/3+"px Arial",
        //     fill: '#111111',
        //     boundsAlignH: "center",
        // };
        // var textObj = game.add.text(0, 0, "a",style);
        // textObj.x = APG.Tile.width*0.1;
        // var blockA = getSpriteList(this.numBlock)[0]
        // blockA.addChild(textObj);
        // getSpriteList(this.numBlock)[1].addChild(game.add.text(APG.Tile.width*0.1,0,"b",style))

        var varA = addTextBitMap(0,1,"a",'#3acd7d')
        var varB = addTextBitMap(1,1,"b",'#3acd7d')
        var varTemp = addTextBitMap(2,1,"temp",'#3acd7d')
        moveGroupDownTo(varA,this.numBlock)
        moveGroupDownTo(varB,this.numBlock)
        moveGroupDownTo(varTemp,this.numBlock)
        this.clearBlock = [];
        this.clearBlock_pre = [];

        this.isBlock = 1  // 记录一下上一次, 省去几次改变
    },
    update: function(){
        characterMoveEvent(this.player)

        var nowIs = this.checkIsBlock()
        var delBnt,setBnt;
        // console.log(nowIs,this.isBlock)
        if(nowIs != this.isBlock) {
            this.isBlock = nowIs
            if (nowIs) {
                delBnt = 'tool2';
                setBnt = 'tool1';
            } else {
                delBnt = 'tool1';
                setBnt = 'tool2';
            }
            APG.Assets.changeVirtualButton(delBnt, setBnt)
        }

    },
    opera: function(){
        site = getCharacterSite(this.player)
        block = getSpriteListFromSite(site.x, site.y+1, this.numBlock)
        console.log(block.length)
        console.log(APG.Bag.getBagSize())
        if(!APG.Bag.getBagSize() && block.length){
            getItem(block)
            // if(site.x < 2){
                var info= aboutTextBitMap(block[0]);
                // 放置虚像, 放置当下的这个时候应该消灭之前那个，因为背包只能有一个快快，
                // 所以地图上只会有一个虚像。
                destroySprite(this.clearBlock.pop())
                this.clearBlock.push(
                    addTextBitMap(site.x, site.y+1, info.text,
                        'rgba(202,190,43,0.6)',
                        '0x3541d4',0.3
                        ));
            // }
        }else if(!block.length && APG.Bag.getBagSize()){
            tile = getTileFromSite(site.x,site.y+1)
            if(getTileId(tile)!=0){
                // if(site.x < 2) {
                    cb = getSpriteListFromSite(site.x, site.y+1, this.clearBlock)[0]
                    destroySprite(cb)
                    // cb = getSpriteListFromSite(site.x, site.y+1, this.numBlock)[0]
                    // destroySprite(cb)
                // }
                putItem(site.x, site.y+1, this.numBlock)
            }
        }
        this.check();
    },
    check: function(){
        var num1 = getSpriteListFromSite(0,2, this.numBlock)
        var num2 = getSpriteListFromSite(1,2, this.numBlock)
            console.log(num1)
            console.log(num2)
        if(num1.length && num2.length &&
            parseInt(aboutTextBitMap(num1[0]).text) == this.swapNum[1] &&
            parseInt(aboutTextBitMap(num2[0]).text) == this.swapNum[0]
        ){
            WIN("再玩一次",function(){restartGame()});
        }
    },
    checkIsBlock: function(){
        var site = APG.Character.getCharacterSite(this.player);
        var sprites = APG.Sprite.getSpriteListFromSite(site.x, site.y+1, this.numBlock);
        return sprites.length
    },

}