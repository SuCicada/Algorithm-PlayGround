console.log("Sprite.js has been loaded successfully.")

/**
 * Sprite（精灵）：概念取自phaser，指代框架中一个单一的元素对象，可以是角色，也可以是交互对象。也是接口的一个分类。
 * @class APG.Sprite
 */
APG.Sprite;

/**
 * 新增一个精灵在组中。
 * @method APG.Sprite#addSprite
 * @param {integer} x - 相对坐标x
 * @param {integer} y - 相对坐标y
 * @param {string} imgKey - 对象贴图名
 * @param {integer} frame - 贴图块id (begin with 1)
 * @param {Phaser.Group} [group] - 如果传入组，就将精灵加入这个组中
 * @param {string} [keyName = imgKey]- 设置的精灵的名，如果没有就和 `imgKey` 一样
 * @returns {*}
 */
APG.Sprite.addSprite = function (x, y, imgKey, frame, group, keyName) {
    var site = APG.Sprite.siteDecode(x, y);
    var s = game.add.sprite(site.x, site.y, imgKey, frame - 1);
    // s.x += APG.MapArea.x;
    // s.y += APG.MapAre    a.y;
    s.scale.setTo(1);
    s.scale.setTo(Math.min(APG.Tile.width / s.width,
        APG.Tile.height / s.height));
    game.physics.enable(s, Phaser.Physics.ARCADE);
    APG.Sprite.setBody(s, 0.6, 0.6, 0.2, 0.2);
    s[0] = {
        keyName: keyName ? keyName : imgKey,
        imgKey: imgKey,
        frameId: frame
    };
    if (group) {
        group.add(s);
    }
    return s;
};

/**
 * 设置精灵的位置相对坐标。
 * @method APG.Sprite#setSpriteSite
 * @param {Phaser.Sprite} s - 精灵对象
 * @param {integer} x - 相对坐标x
 * @param {integer} y - 相对坐标y
 */
APG.Sprite.setSpriteSite = function (s, x, y) {
    var site = APG.Sprite.siteDecode(x, y);
    s.x = site.x;
    s.y = site.y;
};

/**
 * 得到组中的精灵列表。
 * @param {Phaser.Group} group - 组对象
 * @returns {Array}
 */
APG.Sprite.getSpriteList = function (group) {
    return group.children;
};

/**
 * 从一个组里, 且在这个位置上, 拿精灵, 返回列表。
 * 如果指定了所属组,便从指定组中寻找, 如果没有便从世界开始查找
 * @param {integer} x - 相对坐标x
 * @param {integer} y - 相对坐标y
 * @param [group = game.world] - 寻找的范围，不给则为全部世界，可以是group对象, 也可以是数组
 * @param {boolean} [recursive = false] - 是否递归查找
 * @param {integer} [safe = 5] - 递归深度,为0则为无限.
 * @returns {Array}
 */
APG.Sprite.getSpriteListFromSite = function (x, y, group = game.world, recursive = false, safe = 5) {
    if (safe > 0) {
        var newsafe = safe - 1 == 0 ? -1 : safe - 1;
    } else if (safe < 0) {
        return [];
    } else if (safe == 0) {
        var newsafe = safe;
    }
    var sprites = [];
    if (group) {
        group.forEach(function (s) {
            if (!s.alive) {
                return;
            }
            // console.log(s.x,s.y)
            if (s.children.length && recursive) {
                var ss = APG.Sprite.getSpritesFromSite(x, y, s, true, newsafe);
                sprite = sprite.concat(ss);
            }
            var site = APG.Sprite.getSpriteSite(s);
            if (site.x == x && site.y == y) {
                /* or
                *     s.relx == x && s.rely == y
                * */
                sprites.push(s);
            }
        });
    }
    return sprites;
};

/**
 * 摧毁一个精灵对象。
 * @param {Phaser.Sprite} sprite - 要摧毁的精灵对象
 */
APG.Sprite.destroySprite = function (sprite) {
    if (sprite) {
        sprite.destroy();
    }
};

/**
 * 得到一个精灵的相对于地图Area的相对坐标,。
 * @param {Phaser.Sprite} sprite - 精灵对象
 * @returns {{x: number, y: number}|{x, y}}
 */
APG.Sprite.getSpriteSite = function (sprite) {
    return APG.Sprite.siteCode(sprite.x, sprite.y);
};

/**
 * 将相对地址变成绝对地址
 * @param {integer} x - 相对坐标x
 * @param {integer} y - 相对坐标y
 * @returns {{x: number, y: number}}
 */
APG.Sprite.siteDecode = function (x, y) {
    /* 将相对地址变成绝对地址  */
    if (typeof x == "object") {
        var y = x.y;
        var x = x.x;
    }
    return {
        x: x * APG.Tile.width + APG.MapArea.offsetX,
        y: y * APG.Tile.height + APG.MapArea.offsetY,
    }
};

/**
 * 将绝对地址变成相对地址
 * @param {number} x - 绝对坐标x
 * @param {number} y - 绝对坐标y
 * @returns {{x: integer, y: integer}}
 */
APG.Sprite.siteCode = function (x, y) {
    if (typeof x == "object") {
        var y = x.y;
        var x = x.x;
    }

    let site = {
        x: (x - APG.MapArea.offsetX) / APG.Tile.width,
        y: (y - APG.MapArea.offsetY) / APG.Tile.height,
    };
    let about = function (num) {
        return (num - Math.floor(num)) < (Math.ceil(num) - num) ? Math.floor(num) : Math.ceil(num);
    };

    site.x = about(site.x);
    site.y = about(site.y);
    return site;
};

/**
 * 设置对象的物理检测体
 * @param {Phaser.Sprite|Phaser.Group} s - 对象
 * @param {number} ratew - 宽比例
 * @param {number} rateh - 高比例
 * @param {number} ratex - 相对坐标x比例
 * @param {number} ratey - 相对坐标y比例
 */
APG.Sprite.setBody = function (s, ratew, rateh, ratex, ratey) {
    s.body.setSize(
        s.width / s.scale.x * ratew,
        s.height / s.scale.y * rateh,
        s.width / s.scale.x * ratex,
        s.height / s.scale.y * ratey);
};

