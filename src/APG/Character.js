console.log("Character.js has been loaded successfully.")

/**
 *  角色
 * @class APG.Character
 */

APG.Character;

/**
 * 得到角色精灵对象
 * @method APG.Character#getCharacterSprite
 * @param {Phaser.Group} playerG - 角色组对象
 * @param {integer} [index = 0] index - 要选取的角色所在的角色组中的下标
 * @returns {APG.Sprite}
 */
APG.Character.getCharacterSprite = function (playerG, index = 0) {
    /* 传入角色组,默认返回第一个精灵
    *  如果传入角色精灵,直接返回
    *  如果传入
    * */
    let player = playerG.children[index];
    if (!player) {
        player = playerG;
    }
    return player;
};


/**
 * 得到单个玩家的相对坐标,相对于地图Area
 *  默认取得角色组里的第一个角色
 *  可以传入玩家精灵
 * @method APG.Character#getCharacterSite
 * @param {Phaser.Group|Phaser.Sprite} playerObj - 角色组对象 or 角色精灵对象
 * @param {integer} [index = 0] index - 要选取的角色所在的角色组中的下标
 * @returns {{x: number, y: number}|{x, y}}
 */
APG.Character.getCharacterSite = function (playerObj, index = 0) {
    var player = playerObj.children[index];
    if (!player) {
        player = playerObj;
    }
    return APG.Sprite.getSpriteSite(player);
};


/**
 * 得到玩家方向, 1 代表坐标轴正向, -1 代表轴负方向
 * @method APG.Character#getCharacterDirection
 * @param {Phaser.Group|Phaser.Sprite} playerObj - 角色组对象 or 角色精灵对象
 * @param {integer} [index = 0] index - 要选取的角色所在的角色组中的下标
 * @returns {{x:integer, y:integer}}
 */
APG.Character.getCharacterDirection = function (playerObj, index = 0) {
    let player = APG.Character.getCharacterSprite(playerObj, index);
    return player.direction;
};

/**
 * 得到玩家所处瓷砖
 * @method APG.Character#getCharacterTile
 * @param {Phaser.Group|Phaser.Sprite} playerObj - 角色组对象 or 角色精灵对象
 * @param {integer} [index = 0] index - 要选取的角色所在的角色组中的下标
 * @returns {APG.Tile}
 */
APG.Character.getCharacterTile = function (player, index = 0) {
    var site = APG.Character.getCharacterSite(player, index);
    var tile = APG.Tile.getTileFromSite(site.x, site.y);
    return tile;
};

/**
 * 返回角色组的坐标列表({x:number, y:number}),相对坐标,相对于地图Area
 * @method APG.Character#getCharacterSiteAll
 * @param {string} character - 角色组名
 * @return {Array}
 */
APG.Character.getCharacterSiteAll = function (character) {
    var site = [];
    APG.CharacterGroups[character].forEach(function (cha) {
        site.push(APG.Sprite.getSpriteSite(cha));
    });
    return site;
};

/**
 * 对玩家组中的第一个精灵设置相对位置,相对于APG.MapArea
 * 传入的坐标是相对坐标
 * @method APG.Character#setCharacterSite
 * @param {APG.Group} playerGroup - 角色组
 * @param {number} x - x
 * @param {number} y - y
 */
APG.Character.setCharacterSite = function (playerGroup, x, y) {
    var player = APG.Character.getCharacterSprite(playerGroup);
    var nowSite = APG.Character.getCharacterSite(playerGroup);
    player.oldx = nowSite.x;
    player.oldy = nowSite.y;

    player.relx = x;
    player.rely = y;

    var site = APG.Sprite.siteDecode(x, y);
    player.x = site.x;
    player.y = site.y;
};

/**
 * 参见 {APG.Character.setCharacterSite}
 * @method APG.Character#moveCharacter
 * @type {APG.Character.setCharacterSite}
 */
APG.Character.moveCharacter = APG.Character.setCharacterSite;
