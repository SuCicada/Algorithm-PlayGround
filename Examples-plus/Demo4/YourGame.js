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

        var varA = addTextBitMap(0,3,"a",'#111111')
        var varB = addTextBitMap(1,3,"b",'#111111')
        var varTemp = addTextBitMap(2,3,"temp",'#111111')
        moveGroupDownTo(varA,this.numBlock)
        moveGroupDownTo(varB,this.numBlock)
        moveGroupDownTo(varTemp,this.numBlock)
    },
    update: function(){
        characterMoveEvent(this.player)
    },
    opera: function(){
        site = getCharacterSite(this.player)
        block = getSpriteListFromSite(site.x, site.y+1, this.numBlock)
        console.log(site)
        if(block.length){
            getItem(block)
            if(site.x < 2){
                var bg = aboutTextBitMap(block[0]).bgColor;
                this.clearBlock = addTextBitMap(site.x, site.y+1, "?",bg)
            }
        }else{
            tile = getTileFromSite(site.x,site.y+1)
            if(getTileId(tile)!=0){
                if(site.x < 2) {
                    destroySprite(this.clearBlock)
                }
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
    }

}