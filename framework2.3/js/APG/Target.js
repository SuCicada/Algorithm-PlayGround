
/* TextBitMap 文字块对象*/
APG.Target.addTextBitMap = function(text, bg){
    /* 创建一个 TextBitMap */
    return APG.methods.loadTextBitMap(null,text,bg);
};
APG.Target.aboutTextBitMap = function(sprite){
    /* 如果传入一个非 TextBitMap精灵, 保证能返回一致的格式 */
    let s = sprite[0]? sprite[0]: {};
    return {
        text: s.text,
        bgColor: s.bgColor,
    }
};
APG.Target.loadTextBitMap = function(sprite, text, bgColor) {
    /* 将一个对象的贴图换做 TextBitMap, 如果未传入对象, 则创建一个
    *  会先清除之前的绑定文本 以及背景```````
    * */
    /*https://photonstorm.github.io/phaser-ce/Phaser.Text.html#alignTo*/
    let info = APG.methods.aboutTextBitMap(sprite);
    if(info.text && !text){
        var text = info.text;
    }
    if(info.bgColor && !bgColor){
        var bgColor = info.bgColor;
    }

    let bmd = game.add.bitmapData(APG.Tile.width, APG.Tile.height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,APG.Tile.width, APG.Tile.height);
    bmd.ctx.fillStyle = bgColor;
    bmd.ctx.fill();

    let oldWidth = sprite.width;
    let oldHeight = sprite.height;

    if(!sprite){
        var sprite = game.add.sprite(0,0, bmd);
    }else{
        sprite.loadTexture(bmd);
    }

    let style = { font: "bold "+APG.Tile.width/2+"px Arial", fill: "#00124f",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: APG.Tile.width * 0.8
    };

    var textObj = game.add.text(0, 0, text,style);
    textObj.name = "text";
    textObj.x = (APG.Tile.width - textObj.width) / 2;
    textObj.y = (APG.Tile.height - textObj.height) / 2;
    /* 删除原来的文本, 加入新的*/
    sprite.removeChild(sprite.children.find(function(s){
        return s.name = "text";
    }));
    sprite.addChild(textObj);
    sprite.scale.setTo(1);
    sprite.scale.setTo(oldWidth / sprite.width, oldHeight / sprite.height);
    /* 更新属性 */
    sprite[0].text = text;
    sprite[0].bgColor = bgColor;
    return sprite;
};
APG.Target.loadTextBitMapBetween = function(group, texts, bgs, start, end){
    /* 对一个组中的对象批量load
    *  未指定start 就以 0, 未指定 end 就按最后一个
    * */
    var start = start? start: 0;
    var end = end? end: group.children.length;
    for(let i = start;i<end;i++){
        let text = typeof texts == 'object'? texts[i]: texts;
        let bg = typeof bgs == 'object'? bgs[i]: bgs;
        APG.methods.loadTextBitMap(group.children[i], text, bg);
    }
};
