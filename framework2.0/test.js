
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

mapImgPath = "map/maza/maza.png";

function preload() {

    game.load.image('ground_1x1', mapImgPath);

}

var map;
var layer1;
var layer2;
var layer3;

var marker;
var currentTile = 0;
var currentLayer;

var cursors;
var showLayersKey;
var layer1Key;
var layer2Key;
var layer3Key;

document.write("<script src='map/maza/map.js'></script>");

var tilewidth;
var tileHeight;
function create() {


    tilewidth = mapConfig.tilewidth;
    tileHeight = mapConfig.tileheight;
    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');
    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer1 = map.create('level1', 40, 30, tilewidth, tileHeight );
    layer1.scrollFactorX = 0.5;
    layer1.scrollFactorY = 0.5;

    //  Resize the world
    layer1.resizeWorld();

    // layer2 = map.create('level1', 40, 30, tilewidth, tileHeight );
    // layer2.scrollFactorX = 0.8;
    // layer2.scrollFactorY = 0.8;
    //
    // layer3 = map.create('level1', 40, 30, tilewidth, tileHeight );
    //
    currentLayer = layer1;

    //  Create our tile selector at the top of the screen
    createTileSelector();

    game.input.addMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    layer1Key = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    // layer2Key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    // layer3Key = game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    showLayersKey.onDown.add(changeLayer, this);
    layer1Key.onDown.add(changeLayer, this);
    // layer2Key.onDown.add(changeLayer, this);
    // layer3Key.onDown.add(changeLayer, this);

    console.log(layer1.index);
    // console.log(layer2.index);
    // console.log(layer3.index);

}

function changeLayer(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.SPACEBAR:
            layer1.alpha = 1;
            layer2.alpha = 1;
            layer3.alpha = 1;
            break;

        case Phaser.Keyboard.ONE:
            currentLayer = layer1;
            layer1.alpha = 1;
            layer2.alpha = 0.2;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.TWO:
            currentLayer = layer2;
            layer1.alpha = 0.2;
            layer2.alpha = 1;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.THREE:
            currentLayer = layer3;
            layer1.alpha = 0.2;
            layer2.alpha = 0.2;
            layer3.alpha = 1;
            break;
    }

}

function pickTile(sprite, pointer) {
    console.log(sprite);
    console.log(pointer);
    currentTile = game.math.snapToFloor(pointer.x, tileHeight) / tileHeight;
    console.log(currentTile);
}

function updateMarker() {
    marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * tileHeight;
    marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * tilewidth;

    if (game.input.mousePointer.isDown)
    {
        map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
        console.log(currentTile);
        console.log(currentLayer);

        //  big filler
        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);

    }

}

function update() {

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

}

function render() {

    game.debug.text('Current Layer: ' + currentLayer.name, 16, 550);
    game.debug.text('1-3 Switch Layers. SPACE = Show All. Cursors = Move Camera', 16, 570);

}

function createTileSelector() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill('#00ff03', 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, tileHeight);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'ground_1x1');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, '#ff1515', 1);
    marker.drawRect(0, 0, tilewidth, tileHeight);

}
