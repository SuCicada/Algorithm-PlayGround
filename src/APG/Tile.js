console.log("Tile.js has been loaded successfully.")

/* Tile 瓷砖*/
APG.Tile.getTileId = function(tile){
    return tile? tile.index: 0;
};
APG.Tile.changeTile = function(tile, tileId){
    tile.index = tileId;
    APG.Layer.dirty = true;  // 告诉引擎重新绘制图层
    return false;
};
APG.Tile.getTileFromSite = function(x_or_site, y){
    if(typeof x_or_site == 'object'){
        var x = x_or_site.x;
        var y = x_or_site.y;
    }else{
        x = x_or_site;
    }
    var tile = APG.Tilemap.getTile(x, y);
    return tile;
};
APG.Tile.removeTile = function(tile){
    if(tile){
        APG.Tilemap.removeTile(tile.x, tile.y);
    }
};
APG.Tile.removeTileFromSite = function(x, y){
    APG.Tilemap.removeTile(x,y);
};
