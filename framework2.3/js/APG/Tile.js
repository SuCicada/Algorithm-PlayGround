/* Tile 瓷砖*/
APG.Tile.getTileId = function(tile){
    return tile.index;
};
APG.Tile.changeTile = function(tile, tileId){
    tile.index = tileId;
    APG.Layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};
APG.Tile.getTileFromSite = function(x, y){
    var tile = APG.Tilemap.getTile(x, y);
    return tile;
};
APG.Tile.removeTile = function(tile){
    APG.Tilemap.removeTile(tile.x, tile.y);
};
APG.Tile.removeTileFromSite = function(x, y){
    APG.Tilemap.removeTile(x,y);
};
