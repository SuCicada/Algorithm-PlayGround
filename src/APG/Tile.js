console.log("Tile.js has been loaded successfully.")

/* Tile 瓷砖*/
APG.Tile

/**
 * 得到瓷砖id
 * @method APG.Tile#getTileId
 * @param {APG.Tile} tile - 瓷砖对象
 * @returns {number}
 */
APG.Tile.getTileId = function (tile) {
    return tile ? tile.index : 0;
};

/**
 * 改变瓷砖类型, 会将瓷砖变成传入的id所对应的瓷砖类型
 * @method APG.Tile#changeTile
 * @param {APG.Tile} tile - 瓷砖对象
 * @param {number} tileId - 新的瓷砖id
 * @returns {boolean}
 */
APG.Tile.changeTile = function (tile, tileId) {
    tile.index = tileId;
    APG.Layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};

/**
 * 从给定位置得到瓷砖对象, 可传入x和y, 也可传入 {x:number, y:number} 位置对象
 * @method APG.Tile#getTileFromSite
 * @param {number|{x:number, y:number}} x_or_site - x或者site对象
 * @param {number} y - y
 * @returns {APG.Tile}
 */
APG.Tile.getTileFromSite = function (x_or_site, y) {
    if (typeof x_or_site == 'object') {
        var x = x_or_site.x;
        var y = x_or_site.y;
    } else {
        x = x_or_site;
    }
    var tile = APG.Tilemap.getTile(x, y);
    return tile;
};

/**
 * 通过给定瓷砖对象来移除瓷砖
 * @method APG.Tile#removeTile
 * @param {APG.Tile} tile - 瓷砖精灵对象
 */
APG.Tile.removeTile = function (tile) {
    if (tile) {
        APG.Tilemap.removeTile(tile.x, tile.y);
    }
};

/**
 * 通过给定位置来移除瓷砖
 * @method APG.Tile#removeTileFromSite
 * @param {number} x - x
 * @param {number} y - y
 */
APG.Tile.removeTileFromSite = function (x, y) {
    APG.Tilexmap.removeTile(x, y);
};
