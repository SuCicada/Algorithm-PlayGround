/* 精灵 */
APG.Sprite.addSprite = function(x, y, key, index, group){
    /* 新增一个精良在组中
    * key: 对象贴图
    * index: 贴图块id (begin with 1)
    * x,y: 位置
    * */
    var s = game.add.sprite(x, y, key, index-1);
    s.x += MapArea.x;
    s.y += MapArea.y;
    s.scale.setTo(1);
    s.scale.setTo(Math.min(APG.Tile.width / s.width,
        APG.Tile.height / s.height));
    group.add(s);
    return s;
};
APG.Sprite.setSpriteSite = function(s, x, y){
    /*传入的是相对坐标,需要转换成绝对坐标*/
    var site = APG.methods.siteDecode(x,y);
    s.x = site.x;
    s.y = site.y;
};
APG.Sprite.getSpriteList = function(group){
    // group.getC
    return group.children;
};
APG.Sprite.getSpriteListFromSite = function(x, y, group=game.world, recursive=false, safe=5){
    /* 从一个组里, 且在这个位置上, 拿精灵, 返回列表
    *  如果指定了所属组,便从指定组中寻找, 如果没有便从世界开始查找
    * group: 可以是group对象, 也可以是数组
    * recursive: 递归查找吗
    * safe: 递归深度,为0则为无限.
    * */

    if(safe > 0){
        var newsafe = safe-1 == 0? -1: safe-1;
    }else if(safe < 0){
        return [];
    }else if(safe == 0){
        var newsafe = safe;
    }
    var sprites = [];
    if(group){
        group.forEach(function(s){
            if(!s.alive){
                return;
            }
            // console.log(s.x,s.y)
            if(s.children.length && recursive){
                var ss = APG.methods.getSpritesFromSite(x,y,s,true,newsafe);
                sprite = sprite.concat(ss);
            }
            var site = APG.methods.getSpriteSite(s);
            if(site.x == x && site.y == y){
                /* or
                *     s.relx == x && s.rely == y
                * */
                sprites.push(s);
            }
        });
    }
    return sprites;
};
APG.Sprite.destroySprite = function(sprite){
    sprite.destroy();
};
APG.Sprite.getSpriteSite = function(sprite){
    /* 得到一个精灵的相对坐标,相对于地图Area
    * */
    return APG.methods.siteCode(sprite.x,sprite.y);;
};
APG.Sprite.siteDecode = function(x, y){
    /* 将相对地址变成绝对地址  */
    if(typeof x == "object"){
        var y = x.y;
        var x = x.x;
    }
    return {
        x: x * APG.Tile.width  + MapArea.offsetX,
        y: y * APG.Tile.height + MapArea.offsetY,
    }
};
APG.Sprite.siteCode = function(x, y){
    /* 将绝对地址变成相对地址  */
    if(typeof x == "object"){
        var y = x.y;
        var x = x.x;
    }

    let site = {
        x: (x - MapArea.offsetX) / APG.Tile.width,
        y: (y - MapArea.offsetY) / APG.Tile.height,
    };
    let about = function(num){
        return (num - Math.floor(num)) < (Math.ceil(num) - num)? Math.floor(num): Math.ceil(num);
    };

    site.x = about(site.x);
    site.y = about(site.y);
    return site;
};
/* 物理 */
APG.Sprite.setBody = function(s, ratew, rateh, ratex, ratey){
    /* 设置对象的物理检测体,传入的参数是比率 s*/
    s.body.setSize(
        s.width  / s.scale.x * ratew,
        s.height / s.scale.y * rateh,
        s.width  / s.scale.x * ratex,
        s.height / s.scale.y * ratey);
};
