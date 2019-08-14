console.log("Bag.js has been loaded successfully.")

/*APG.Bag.views = [];*/
APG.Bag.showBagBar = function(){
    let w = APG.Bag.BagBar.w;
    let h = APG.Bag.BagBar.h;
    let x = (WIDTH - w);
    let y = 0;
    var bar = game.add.graphics();
    bar.beginFill('0x'+'#87df00'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);
    APG.Bag.views.push(bar);
    console.log(APG.Bag.BagBar)


    var style = { font: "bold "+APG.WIDTH/40+"px Arial", fill: "#00124f",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    var text = game.add.text(x,y, "背包系统\n", style);
    APG.Bag.views.push(text);

    // text.anchor.set(0.5,0);

    /* 默认最大容量是初始化的1倍 */
    // APG.Bag.capcity = APG.Bag.size;
};
APG.Bag.hiddenBagBar = function(){
    APG.Bag.views.forEach(function(s){
        s.destroy();
    });
};
APG.Bag.destroyBagBar = function() {
    APG.Bag.hiddenBagBar();
    APG.Bag.items.forEach(function(s){
        console.log(s)
        s.imgObj.destroy();
        s.textObj.destroy();
    });
    APG.Bag.capcity = 0;
    APG.Bag.size = 0;
    APG.Bag.items = [];
    APG.Bag.views = [];
};

APG.Bag.addItem = function(sprite, number) {

    var number = number? number: 1;
    let text = game.add.text(0,0, number);
    sprite.kill();
    text.kill();

    console.log(sprite)
    APG.Bag.items.unshift({
        imgObj: sprite,
        textObj: text,
        itemName: sprite[0].keyName, /* 物品名字,用于查找*/
        imgMode: sprite[0].imgMode,
        imgKey: sprite[0].imgKey,    /*  图片名*/
        frameId: sprite[0].frameId? sprite[0].frameId: sprite.frame,  /* 如果是帧动画, 帧的id */
        number: number,    /*  初始数量*/
    });
    APG.Bag.size += number;
};


/**
 * 从背包里把第一个东西拿出去
 * @param x 坐标是相对的
 * @param y
 * @param group 放置的精灵的所属的组
 */
APG.Bag.putItem = function(x, y, group) {
    console.log(APG.Bag.size);
    if(APG.Bag.size){
        let item = APG.Bag.items[0];
        let imgObj = item.imgObj[0];
        let sprite;
        if(item.imgMode == "textbitmap") {
            sprite = APG.Target.addTextBitMap(x, y, imgObj.text, imgObj.bgColor);
        }else{
            sprite = APG.Sprite.addSprite(x,y,imgObj.imgKey, imgObj.frameId, group, imgObj.keyName);
        }
        if(!group){
            var group = APG.Group.getTargetGroup(imgObj.keyName);
            console.log(group)
            if(group){
                group.add(sprite);
            }
        }
        if(0 == --item.number){
            APG.Bag.items[0].imgObj.destroy();
            APG.Bag.items[0].textObj.destroy();
            APG.Bag.items.splice(0,1);
        }

        APG.Bag.size --;
        console.log(sprite)
        return sprite;
    }
};

APG.Bag.getItem = function(spriteList) {
    /* 把东西放到背包里
     * 按照对象的keyName分组
     **/
    if(!spriteList.forEach){
        var spriteList = [spriteList];
    }
    spriteList.forEach(function(sprite){
        /* 确保容量够用 */
        // console.log(APG.Bag.size)
        // console.log(APG.Bag.capcity)
        if(APG.Bag.size < APG.Bag.capcity) {
            var item = APG.Bag.items.find(function(b){
                return b.itemName == sprite[0].keyName;
            });
            /* 如果背包中存在,并且不是 textbitmap*/
            if(item && sprite[0].imgMode != 'textbitmap'){
                item.number ++;
                APG.Bag.size ++;
            }else if(!item || sprite[0].imgMode == 'textbitmap'){
                let s;
                if(sprite[0].imgMode == 'textbitmap'){
                    s = APG.Target.addTextBitMap(0,0,sprite[0].text, sprite[0].bgColor);
                }else{
                    s = APG.Sprite.addSprite(0,0,sprite[0].imgKey,sprite[0].frameId,null,sprite[0].keyName);
                }

                s[0] = JSON.parse(JSON.stringify(sprite[0]));
                APG.Bag.addItem(s,1);
            }

            sprite.destroy();    /* 地面上没有物品了 */
        }
    });
};


/**
 * 把东西丢掉
 */
APG.Bag.dropItem = function(){
    if(APG.Bag.size) {
        let item = APG.Bag.items[0];
        if (--item.number == 0) {
            APG.Bag.items[0].imgObj.destroy();
            APG.Bag.items[0].textObj.destroy();
            APG.Bag.items.splice(0, 1);
        }
        APG.Bag.size--;
    }
};

APG.Bag.getItemNum = function(itemName){
    let item = APG.Bag.items.find(function(b){
        return b.itemName == itemName;
    });
    return item? item.number: 0;
};
APG.Bag.setBagCapacity = function(n){
    APG.Bag.capcity = n;
};
APG.Bag.getBagCapacity = function(){
    return APG.Bag.capcity;
};
APG.Bag.getBagSize = function(){
    return APG.Bag.size;
};
APG.Bag.getBagFirst = function(){
    /* 得到当前背包第一个物品组 */
    if(items.length){
        return APG.Bag.items[0];
    }
};
APG.Bag.goDownItems = function(){
    /* 背包物品组向后（下）移动 */
    if(APG.Bag.items.length){
        APG.Bag.items = APG.Bag.items.concat(APG.Bag.items.splice(0,1));
    }
};
APG.Bag.goUpItems = function() {
    /* 背包物品组向前（上）移动 */
    if(APG.Bag.items.length) {
        APG.Bag.items = APG.Bag.items.splice(APG.Bag.items.length-1,1).concat(APG.Bag.items);
    }
};

APG.Bag.updateBag = function(){
    /* 更新背包中的物品信息, 和数量对应 */

    let w = APG.Bag.BagBar.w;
    let h = APG.Bag.BagBar.h;
    let x = (WIDTH - w);
    let y = 0;

    var items = APG.Bag.items;
    var barX = x + w*0.1;
    var barY = y + h*0.1;
    var barSide = Math.min((APG.Bag.BagBar.h - barY -  APG.Tile.height/2) / (items.length*1.1),
        APG.Bag.BagBar.w /2.5);
    var styleOfNum = {
        font: "bold "+barSide*0.8+"px Arial",
        fill: "#00124f",
        boundsAlignH: "center",
    };


    for(i = 0;i<items.length;i++){
            // game.add.sprite(barX,barY,items[i].imgKey, items[i].frameId);
        var img = items[i].imgObj;
        img.x = barX;
        img.y = barY;
        img.height = barSide;
        img.width = barSide;
        img.revive();
        // APG.Bag.views.push(img);
            // game.add.text(barX+barSide*1.1,barY, items[i].number, styleOfNum);
        var text = items[i].textObj;
        text.setText(items[i].number);
        text.setStyle(styleOfNum);
        text.x = barX + barSide * 1.3;
        text.y = barY;
        text.revive();
        // APG.Bag.views.push(text);

        // console.log (APG.Bag.views)
        barY += barSide*1.1;
    }
};
