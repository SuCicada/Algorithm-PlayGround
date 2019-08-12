console.log("Character.js has been loaded successfully.")

/* 角色 */
APG.Character.getCharacterSprite = function(playerG, index=0){
    /* 传入角色组,默认返回第一个精灵
    *  如果传入角色精灵,直接返回
    *  如果传入
    * */
    let player = playerG.children[index];
    if(!player){
        player = playerG;
    }
    return player;
};
APG.Character.getCharacterSite = function(playerObj, index=0){
    /* 得到单个玩家的相对坐标,相对于地图Area
    *  默认取得角色组里的第一个角色
    *  可以传入玩家精灵
    * */
    var player = playerObj.children[index];
    if(!player){
        player = playerObj;
    }
    return APG.Sprite.getSpriteSite(player);
};
APG.Character.getCharacterDirection = function(playerObj) {
    /* 玩家方向, */
    let player = APG.Character.getCharacterSprite(playerObj);
    return player.direction;
};
APG.Character.getCharacterTile = function(player){
    /* 得到玩家所处瓷砖 */
    var site = APG.Character.getCharacterSite(player);
    var tile = APG.Tile.getTileFromSite(site.x, site.y);
    return tile;
};
APG.Character.getCharacterSiteAll = function(character){
    /* 返回角色组的坐标列表,相对坐标,相对于地图Area */
    var site = [];
    APG.CharacterGroups[character].forEach(function(cha){
        site.push(APG.Sprite.getSpriteSite(cha));
    });
    return site;
};
APG.Character.setCharacterSite = function(playerGroup, x, y){
    /* 对玩家组中的第一个精灵设置相对位置,相对于APG.MapArea
    * 传入的坐标是相对坐标*/
    var player = APG.Character.getCharacterSprite(playerGroup);
    var nowSite = APG.Character.getCharacterSite(playerGroup);
    player.oldx = nowSite.x;
    player.oldy = nowSite.y;

    player.relx = x;
    player.rely = y;

    var site = APG.Sprite.siteDecode(x,y);
    player.x = site.x;
    player.y = site.y;
};
APG.Character.moveCharacter = APG.Character.setCharacterSite;
