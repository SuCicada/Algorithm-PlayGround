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

    var style = { font: "bold "+APG.Tile.width/4+"px Arial", fill: "#00124f",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    var text = game.add.text(x,y, "背包系统\n", style);
    APG.Bag.views.push(text);

    // text.anchor.set(0.5,0);
    var items = APG.Bag.items;
    var barX = x + w*0.1;
    var barY = y + h*0.2;
    var barSide = Math.min(h / items.length, APG.Tile.height);
    var styleOfNum = {
        font: "bold "+barSide+"px Arial",
        fill: "#00124f",
        boundsAlignH: "center",
    };
    for(i = 0;i<items.length;i++){
        var img = game.add.image(barX,barY,items[i].imgKey, items[i].frameId);
        img.height = barSide;
        img.width = barSide;
        APG.Bag.views.push(img);

        var text = game.add.text(barX+barSide*1.1,barY, items[i].number, styleOfNum);
        items[i].img = img;
        items[i].text = text;  /* 对象 */
        APG.Bag.size += parseInt(items[i].number);
        barY += barSide*1.1;
        APG.Bag.views.push(text);
    }
    /* 默认最大容量是初始化的1倍 */
    APG.Bag.capcity = APG.Bag.size;
};
APG.Bag.hiddenBagBar = function(){
    APG.Bag.views.forEach(function(s){
        s.destroy();
    });
};
APG.Bag.destroyBagBar = function() {
    APG.Bag.hiddenBagBar();
    APG.Bag.capcity = 0;
    APG.Bag.size = 0;
    APG.Bag.items = [];
    APG.Bag.views = [];
};
APG.Bag.addItem = function(itemName, imgKey, frameId, number){
    /* initialization即初始化时, 设置背包要存的东西
    *  返回已存在于 APG.TargetGroups 中的组
    *  若没有赠送一个对象组
    *  [!] 没有考虑玩家组的
    * frameId: 显示在背包栏的帧
    * itemName: 物品名称, getItem需要和ObjectGroup中的keyName对应
    * */
    // console.log(APG.TargetGroups)
    var group = APG.TargetGroups[itemName];
    if(!group){
        var group = game.add.group();
        APG.TargetGroups[itemName] = group;
    }else{
        if(!imgKey){
            var imgUrl = APG.TargetGroups[itemName].children[0][0].imgUrl;
            console.log(APG.TargetGroups[itemName].children[0][0])
            var imgKey = globalConfig.Assets.spritesImg.find(function(s){
                return s.imgUrl == imgUrl;
            }).imgKey;
        }
        if(!frameId){
            var frameId = APG.TargetGroups[itemName].children[0][0].frameId;
        }
    }

    for(i=0;i<number;i++){
        var sprite = APG.methods.addSprite(0,0,imgKey,frameId,group)
        sprite.kill();
    }

    APG.Bag.items.push({
        itemName: itemName, /* 物品名字,用于查找*/
        imgKey: imgKey,     /* 图片名*/
        frameId: frameId,  /* 如果是帧动画, 帧的id*/
        number: number,    /* 初始数量*/
        group: group,      /* [?]有没有必要*/
    });
    return group;
};

APG.Bag.putItem = function(itemName, x, y){
    /* 从背包里把东西拿出去
    * 坐标是相对的.
    * */
    var item = APG.Bag.items.find(function(b){
        return b.itemName == itemName;
    });
    if(item.number && APG.Bag.size){
        var s = item.group.children[0];
        game.world.add(s);   // 把一个精灵从背包中的组里拿到世界组中
        item.number --;
        APG.Bag.size --;
        s.revive();     /*复活精灵*/
        APG.methods.setSpriteSite(s,x,y);
        return s;
    }
};

APG.Bag.getItem = function(itemName, spriteList){
    /* 把东西放到背包里
    *  itemName: 指定要放到的背包区
    *  spriteList: 精灵列表,指定拿的东西
    * */
    // item = APG.bar.items.find(function(b){
    //     return b.itemName == itemName;
    // })
    for(sprite of spriteList){
        // var group = sprite.parent;
        var item = APG.Bag.items.find(function(b){
            return b.itemName == itemName;
        });
        if(APG.Bag.size < APG.Bag.capcity){
            item.number ++;
            APG.Bag.size ++;
            item.group.add(sprite);
            sprite.kill();    /*进入休眠*/
        }
    }
};
APG.Bag.dropItem = function(itemName){
    /* 把东西丢掉 */
    var item = APG.Bag.items.find(function(b){
        return b.itemName == itemName;
    });
    if(item.children.length){
        item.children[0].destroy();
        APG.Bag.size --;
    }
};
APG.Bag.getItemNum = function(itemName){
    return APG.Bag.items.find(function(b){
        return b.itemName == itemName;
    }).number;
};
APG.Bag.setCapacity = function(n){
    APG.Bag.capcity = n;
};
APG.Bag.getCapacity = function(){
    return APG.Bag.capcity;
};
APG.Bag.getSize = function(){
    return APG.Bag.size;
};
APG.Bag.getFirst = function(){
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
APG.Bag.update = APG.update.bag;
