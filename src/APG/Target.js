console.log("Target.js has been loaded successfully.")
/* Target.js */

/**
 * Target（元素）：用于在地图表面上层显示的对象，具有定制的属性，可自定义。也是接口的一个分类。
 * 主要用于对 `TextBitMap 文字块对象`的操作。
 * @class APG.Target
 */
APG.Target;

/**
 * 创建一个 TextBitMap
 * @param {integer} x - 相对坐标x。
 * @param {integer} y - 相对坐标y
 * @param {string} text - `TextBitMap`上的文字
 * @param {string} bg - `TextBitMap`的颜色
 * @returns {Phaser.Sprite} TextBitMap
 */
APG.Target.addTextBitMap = function(x,y, text, bg){
    /* 创建一个 TextBitMap */
    let sprite = APG.Sprite.addSprite(x,y);
    sprite[0].imgMode = "textbitmap";
    return APG.Target.loadTextBitMap(sprite,text,bg);
};

/**
 * 得到`TextBitMap`的信息。
 * 如果传入一个非 TextBitMap 精灵, 保证能返回一致的格式。
 * @param {Phaser.Sprite} sprite - 传入的`TextBitMap`对象
 * @returns {{bgColor: (string), text: (string)}}
 */
APG.Target.aboutTextBitMap = function(sprite){
    let s = sprite[0]? sprite[0]: {};
    return {
        text: s.text,
        bgColor: s.bgColor,
    }
};

/**
 * 将一个对象的贴图换做 TextBitMap, 如果未传入对象, 则创建一个。
 * 会先清除之前的绑定文本 以及背景。
 * 参考 https://photonstorm.github.io/phaser-ce/Phaser.Text.html#alignTo
 * @param {Phaser.Sprite} sprite - 传入的要转换的精灵对象
 * @param {string} text - `TextBitMap`上的文字
 * @param {string} bg - `TextBitMap`的颜色
 * @returns {Phaser.Sprite} TextBitMap
 */
APG.Target.loadTextBitMap = function(sprite, text, bgColor) {
    if(sprite){
        var info = APG.Target.aboutTextBitMap(sprite);
    }else{
        var sprite = APG.Sprite.addSprite(0,0);
        var info = {};
    }

    if(info.text && !text){
        var text = info.text;
    }else if(!text){
        var text = "";
    }

    if(info.bgColor && !bgColor){
        var bgColor = info.bgColor;
    }else if(!bgColor){
        var bgColor = "#ffffff";
    }

    let bmd = game.add.bitmapData(APG.Tile.width, APG.Tile.height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,APG.Tile.width, APG.Tile.height);
    bmd.ctx.fillStyle = bgColor;
    bmd.ctx.fill();
    bmd.name = "bgColor";

    let rect = game.add.graphics(0, 0);
    let color = '0x'+bgColor.slice(1);
    color = 0xffffff - parseInt(color);
    rect.lineStyle(APG.Tile.width/20, color, 1);
    rect.drawRect(0,0,APG.Tile.width,APG.Tile.height);
    rect.name = "rect";

    let oldWidth = sprite.width;
    let oldHeight = sprite.height;

    if(!sprite){
        var sprite = game.add.sprite(0,0, bmd);
    }else{
        sprite.loadTexture(bmd);
    }

    let textColor = '#'+color.toString(16);
    let style = { font: "bold "+APG.Tile.width/2+"px Arial",
        fill: textColor,
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: APG.Tile.width * 0.8
    };

    var textObj = game.add.text(0, 0, text,style);
    textObj.name = "text";
    textObj.x = (APG.Tile.width - textObj.width) / 2;
    textObj.y = (APG.Tile.height - textObj.height) / 2;
    /* 删除原来的文本, 加入新的*/
    let crash = [];
    sprite.children.forEach(function(s){
        if(s.name == "text" || s.name == "rect"){
            crash.push(s);
        }
    });
    crash.forEach(function(s){
        s.destroy();
        sprite.removeChild(s);
    });
    crash = null;

    sprite.addChild(rect);
    sprite.addChild(textObj);
    sprite.scale.setTo(1);
    sprite.scale.setTo(oldWidth / sprite.width, oldHeight / sprite.height);
    /* 更新属性 */
    sprite[0].text = text;
    sprite[0].bgColor = bgColor;
    return sprite;
};

/**
 * 对一个组中的 `TextBitMap`对象批量load
 * @param group
 * @param {Array} texts - TextBitMap 文字们
 * @param {Array} bgs - TextBitMap 颜色们
 * @param {integer} [start = 0] - 组中开始编号，从0开始
 * @param {integer} [end = group.children.length] - 组中结束编号，未指定 end 就按最后一个
 */
APG.Target.loadTextBitMapBetween = function(group, texts, bgs, start, end){
    var start = start? start: 0;
    var end = end? end: group.children.length;
    for(let i = start;i<end;i++){
        let text = typeof texts == 'object'? texts[i]: texts;
        let bg = typeof bgs == 'object'? bgs[i]: bgs;
        text = text? text: null;
        bg = bg? bg : null;
        APG.Target.loadTextBitMap(group.children[i], text, bg);
    }
};
