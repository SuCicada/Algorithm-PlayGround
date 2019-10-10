var YourGame = {
    create: function(){
        this.numBlock = getTargetGroup("numBlock")
        this.swapNum = [12,34]
        loadTextBitMapBetween(this.numBlock, this.swapNum)
        this.player = getCharacterGroup("player")
        blockTileOverlap(this.player, 0)
        blockGroupOverlap(this.player, this.numBlock)
        addKeyEvent('E',this.opera)
        setBagCapacity(1)
    },
    update: function(){
        characterMoveEvent(this.player)
    },
    opera: function(){
        site = getCharacterSite(this.player)
        block = getSpriteListFromSite(site.x, site.y+1, this.numBlock)
        if(block.length){
            getItem(block)
        }else{
            tile = getTileFromSite(site.x,site.y+1)
            if(getTileId(tile)!=0){
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