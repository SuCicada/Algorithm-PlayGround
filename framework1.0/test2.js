
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
    preload: preload,
    create: create
});

//  Dimensions
var previewSize = 10;   // 小视图大小
var spriteWidth = 20;　　// 画板宽
var spriteHeight = 20;　 // 画板长

var spriteWidthMAX = 20;   // 画板最大宽
var spriteHeightMAX = 20;  // 画板最大长


//  UI
var ui;
var paletteArrow;
var coords;
var widthText;
var widthUp;
var widthDown;
var heightText;
var heightUp;
var heightDown;
var previewSizeUp;
var previewSizeDown;
var previewSizeText;
var nextFrameButton;
var prevFrameButton;
var frameText;
var saveIcon;
var saveText;
var rightCol = 532;

//  Drawing Area
var canvas;
var canvasBG;
var canvasGrid;
var canvasSprite;
var canvasZoom = 25;

//  Sprite Preview
var preview;
var previewBG;

//  Keys + Mouse
var keys;
var isDown = false;
var isErase = false;

//  Palette
var ci = 0;
var color = 0;
var palette = 0;
var pmap = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];

//  Data
var frame = 1;
var frameMax = 3;
var frames = [[]];

var data;

function preload(){
    preloadUItexture();
}

function create() {

    //   So we can right-click to erase
    document.body.oncontextmenu = function() { return false; };

    Phaser.Canvas.setUserSelect(game.canvas, 'none');
    Phaser.Canvas.setTouchAction(game.canvas, 'none');

    game.stage.backgroundColor = '#505050';

    game.create.grid('uiGrid', 32 * 16, 32, 32, 32, 'rgba(255,255,255,0.5)', true, function(){
        game.create.grid('drawingGrid', 20 * canvasZoom, 20 * canvasZoom, canvasZoom, canvasZoom, 'rgba(0,191,243,0.8)', true, function(){
            waitCreate();
        });
    });

    var waitCreate = function(){
        createUI();
        createDrawingArea();

        createPreview();
        createEventListeners();

        resetData();
        setColor(2);

        for(i=1;i<frameMax;i++){
            nextFrame();
        }
        for(i=1;i<frameMax;i++){
            prevFrame();
        }
    };
}


function resetFrame(frame){
    var data = frame;

    // console.log(data);
    if(data == undefined || data.toString() == [].toString()){
        data = [];

        for (var y = 0; y < spriteHeight; y++)
        {
            var a = [];

            for (var x = 0; x < spriteWidth; x++)
            {
                a.push('.');
            }

            data.push(a);
        }

    }else{

        if(data[0].length > spriteWidth){      // 多了,要减少
            for (var x = 0; x < spriteHeight; x++){
                data[x] = data[x].slice(0,spriteWidth);
            }
        }else if(data[0].length < spriteWidth){   // 少了,要增加
            var plus  = new Array(spriteWidth - data[0].length);
            plus.fill('.');
            for (var x = 0; x < spriteHeight; x++){
                data[x] = data[x].concat(plus);
            }
        }

        if(data.length > spriteHeight){      // 多了,要减少
            data = data.splice(0, spriteHeight);

        }else if(data.length < spriteHeight){   // 少了,要增加
            var plusline  = new Array(spriteWidth);
            plusline.fill('.');
            var plus = new Array(spriteHeight - data.length);
            plus.fill(plusline);
            console.log(plus);
            data = data.concat(plus);
        }
    }
    console.log(data);
    return data;
}

function resetData() {
    window.data = resetFrame(window.data);
}

function resetDataframes(){
    for(var i = 0;i<frames.length;i++){
        frames[i] = resetFrame(frames[i]);
    }
}

function copyToData(src) {

    data = [];

    for (var y = 0; y < src.length; y++)
    {
        var a = [];

        for (var x = 0; x < src[y].length; x++)
        {
            a.push(src[y][x]);
        }

        data.push(a);
    }

}

function cloneData() {

    var clone = [];

    for (var y = 0; y < data.length; y++)
    {
        var a = [];

        for (var x = 0; x < data[y].length; x++)
        {
            var v = data[y][x];
            a.push(v);
        }

        clone.push(a);
    }

    return clone;

}
function preloadUItexture(callback){

    //  Create some icons
    var arrow = [
        '  22  ',
        ' 2222 ',
        '222222',
        '  22  ',
        '  22  '
    ];

    var plus = [
        '2222222',
        '2.....2',
        '2..2..2',
        '2.222.2',
        '2..2..2',
        '2.....2',
        '2222222'
    ];

    var minus = [
        '2222222',
        '2.....2',
        '2.....2',
        '2.222.2',
        '2.....2',
        '2.....2',
        '2222222'
    ];

    var disk = [
        'DDDDDDDDDD',
        'DED1111DED',
        'DED1111DDD',
        'DEDDDDDDED',
        'DEEEEEEEED',
        'DEFFFFFFED',
        'DEFF222FED',
        'DEFF222FED',
        'DEFF222FED',
        'DDDDDDDDDD'
    ];

    var load = [
        '..........',
        '....77....',
        '...7777...',
        '..777777..',
        '.77777777.',
        '....77....',
        '....77....',
        '....77....',
        '....77....',
        '....77....',
        '..........',
    ];

    var download = [
        '..........',
        '....77....',
        '....77....',
        '....77....',
        '....77....',
        '....77....',
        '.77777777.',
        '..777777..',
        '...7777...',
        '....77....',
        '..........',

    ];
    game.load.imageFromTexture('arrow', arrow, 2);
    game.load.imageFromTexture('plus', plus, 3);
    game.load.imageFromTexture('minus', minus, 3);
    game.load.imageFromTexture('save', download, 4);
    game.load.imageFromTexture('load', load, 4);
    game.load.imageFromTexture('generate', disk, 4);

    // ct = function(f){
    //     return new Promise(function(resolve){
    //         f();
    //         resolve();
    //     });
    // };

    // game.create.texture('arrow', arrow, 2, 2, 0, true, function(){});
    // game.create.texture('plus', plus, 3, 3, 0, true ,function(){});
    // game.create.texture('minus', minus, 3, 3, 0, true, function(){});
    // game.create.texture('save', disk, 4, 4, 0, true ,function(){});


    // (async function(){
    //     await ct(function(ov){
    //         game.create.texture('arrow', arrow, 2, 2, 0, true, function(){
    //             ov();
    //         });
    //     });
    //     await ct(function(ov){
    //         game.create.texture('plus', plus, 3, 3, 0, true ,function(){
    //             ov();
    //         });
    //     });
    //     await ct(function(ov){
    //         game.create.texture('minus', minus, 3, 3, 0, true, function(){
    //             ov();
    //         });
    //     });
    //     await ct(function(ov){
    //         game.create.texture('save', disk, 4, 4, 0, true ,function(){
    //             ov();
    //         });
    //     });
    //     await ct(function(ov){
    //         callback();
    //     });
    // })();

}
function createUI() {

    ui = game.make.bitmapData(800, 32);

    drawPalette();

    ui.addToWorld();

    var style = { font: "20px Courier", fill: "#fff", tabs: 80 };

    coords = game.add.text(rightCol, 8, "X: 0\tY: 0", style);

    game.add.text(12, 9, pmap.join("\t"), { font: "14px Courier", fill: "#000", tabs: 32 });
    game.add.text(11, 8, pmap.join("\t"), { font: "14px Courier", fill: "#ffff00", tabs: 32 });

    paletteArrow = game.add.sprite(8, 36, 'arrow');

    //  Change width

    widthText = game.add.text(rightCol, 60, "Width: " + spriteWidth, style);

    widthUp = game.add.sprite(rightCol + 180, 60, 'plus');
    widthUp.name = 'width';
    widthUp.inputEnabled = true;
    widthUp.input.useHandCursor = true;
    widthUp.events.onInputDown.add(increaseSize, this);

    widthDown = game.add.sprite(rightCol + 220, 60, 'minus');
    widthDown.name = 'width';
    widthDown.inputEnabled = true;
    widthDown.input.useHandCursor = true;
    widthDown.events.onInputDown.add(decreaseSize, this);

    //  Change height

    heightText = game.add.text(rightCol, 100, "Height: " + spriteHeight, style);

    heightUp = game.add.sprite(rightCol + 180, 100, 'plus');
    heightUp.name = 'height';
    heightUp.inputEnabled = true;
    heightUp.input.useHandCursor = true;
    heightUp.events.onInputDown.add(increaseSize, this);

    heightDown = game.add.sprite(rightCol + 220, 100, 'minus');
    heightDown.name = 'height';
    heightDown.inputEnabled = true;
    heightDown.input.useHandCursor = true;
    heightDown.events.onInputDown.add(decreaseSize, this);

    //  Change frame

    frameText = game.add.text(rightCol, 160, "Frame: " + frame + " / " + frames.length, style);

    nextFrameButton = game.add.sprite(rightCol + 180, 160, 'plus');
    nextFrameButton.inputEnabled = true;
    nextFrameButton.input.useHandCursor = true;
    nextFrameButton.events.onInputDown.add(nextFrame, this);

    prevFrameButton = game.add.sprite(rightCol + 220, 160, 'minus');
    prevFrameButton.inputEnabled = true;
    prevFrameButton.input.useHandCursor = true;
    prevFrameButton.events.onInputDown.add(prevFrame, this);

    //  Change preview

    previewSizeText = game.add.text(rightCol, 220, "Size: " + previewSize, style);

    previewSizeUp = game.add.sprite(rightCol + 180, 220, 'plus');
    previewSizeUp.inputEnabled = true;
    previewSizeUp.input.useHandCursor = true;
    previewSizeUp.events.onInputDown.add(increasePreviewSize, this);

    previewSizeDown = game.add.sprite(rightCol + 220, 220, 'minus');
    previewSizeDown.inputEnabled = true;
    previewSizeDown.input.useHandCursor = true;
    previewSizeDown.events.onInputDown.add(decreasePreviewSize, this);

    //  Save Icon

    saveText = game.add.text(rightCol, 520, "Saved to console.log", style);
    saveText.alpha = 0;

    saveIcon = game.add.sprite(750, 550, 'save');
    saveIcon.inputEnabled = true;
    saveIcon.input.useHandCursor = true;
    saveIcon.events.onInputDown.add(save, this);

    // Load Icon
    loadIcon = game.add.sprite(700, 550, 'load');
    loadIcon.inputEnabled = true;
    loadIcon.input.useHandCursor = true;
    loadIcon.events.onInputDown.add(load, this);

    // Generate Icon
    loadIcon = game.add.sprite(750, 500, 'generate');
    loadIcon.inputEnabled = true;
    loadIcon.input.useHandCursor = true;
    loadIcon.events.onInputDown.add(generate, this);

}

function createDrawingArea() {
    // 画板区域

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG = game.make.bitmapData(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#3f5c67');

    var x = 10;
    var y = 64;

    canvasBG.addToWorld(x, y);
    canvasSprite = canvas.addToWorld(x + 1, y + 1);
    canvasGrid = game.add.sprite(x + 1, y + 1, 'drawingGrid');
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

}

function resizeCanvas() {

    canvas.resize(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG.resize(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#3f5c67');

    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

}

function createPreview() {
    // 预览小视图
    preview = game.make.bitmapData(spriteWidth * previewSize, spriteHeight * previewSize);
    previewBG = game.make.bitmapData(preview.width + 2, preview.height + 2);

    previewBG.rect(0, 0, previewBG.width, previewBG.height, '#fff');
    previewBG.rect(1, 1, previewBG.width - 2, previewBG.height - 2, '#3f5c67');

    var x = rightCol;
    var y = 250;

    previewBG.addToWorld(x, y);
    preview.addToWorld(x + 1, y + 1);

}

function resizePreview() {

    preview.resize(spriteWidth * previewSize, spriteHeight * previewSize);
    previewBG.resize(preview.width + 2, preview.height + 2);

    previewBG.rect(0, 0, previewBG.width, previewBG.height, '#fff');
    previewBG.rect(1, 1, previewBG.width - 2, previewBG.height - 2, '#3f5c67');

}

function refresh() {

    //  Update both the Canvas and Preview
    canvas.clear();
    preview.clear();

    for (var y = 0; y < spriteHeight; y++)
    {
        for (var x = 0; x < spriteWidth; x++)
        {
            var i = data[y][x];
            if (i !== '.' && i !== ' ')
            {
                color = game.create.palettes[palette][i];
                // console.log(i);
                // console.log(color);
                canvas.rect(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
                preview.rect(x * previewSize, y * previewSize, previewSize, previewSize, color);
            }
        }
    }

}

function createEventListeners() {

    keys = game.input.keyboard.addKeys(
        {
            'erase': Phaser.Keyboard.X,
            'save': Phaser.Keyboard.S,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
            'changePalette': Phaser.Keyboard.P,
            'nextFrame': Phaser.Keyboard.PERIOD,
            'prevFrame': Phaser.Keyboard.COMMA,
            'color0': Phaser.Keyboard.ZERO,
            'color1': Phaser.Keyboard.ONE,
            'color2': Phaser.Keyboard.TWO,
            'color3': Phaser.Keyboard.THREE,
            'color4': Phaser.Keyboard.FOUR,
            'color5': Phaser.Keyboard.FIVE,
            'color6': Phaser.Keyboard.SIX,
            'color7': Phaser.Keyboard.SEVEN,
            'color8': Phaser.Keyboard.EIGHT,
            'color9': Phaser.Keyboard.NINE,
            'color10': Phaser.Keyboard.A,
            'color11': Phaser.Keyboard.B,
            'color12': Phaser.Keyboard.C,
            'color13': Phaser.Keyboard.D,
            'color14': Phaser.Keyboard.E,
            'color15': Phaser.Keyboard.F,
            'showAll': Phaser.Keyboard.SPACEBAR,
        }
    );

    keys.erase.onDown.add(cls, this);
    keys.save.onDown.add(save, this);
    keys.up.onDown.add(shiftUp, this);
    keys.down.onDown.add(shiftDown, this);
    keys.left.onDown.add(shiftLeft, this);
    keys.right.onDown.add(shiftRight, this);
    keys.changePalette.onDown.add(changePalette, this);
    keys.nextFrame.onDown.add(nextFrame, this);
    keys.prevFrame.onDown.add(prevFrame, this);
    keys.showAll.onDown.add(showAll, this);

    for (var i = 0; i < 16; i++)
    {
        keys['color' + i].onDown.add(setColor, this, 0, i);
    }

    game.input.mouse.capture = true;
    game.input.onDown.add(onDown, this);
    game.input.onUp.add(onUp, this);
    game.input.addMoveCallback(paint, this);

}

function cls() {
    data = [];
    resetData();
    refresh();

}

function nextFrame() {

    //  Save current frame
    frames[frame - 1] = cloneData();
    frame = frame % frameMax + 1;

    if (frames[frame - 1])
    {
        copyToData(frames[frame - 1]);
    }
    else
    {
        frames.push(null);
        resetData();
    }

    refresh();

    frameText.text = "Frame: " + frame + " / " + frames.length;

}

function prevFrame() {


    //  Save current frame
    frames[frame - 1] = cloneData();

    frame = Math.ceil((frame - 1 + 2.5) % frameMax);

    // 1 3   2
    // 2 1   3
    // 3 2   1

    //  Load old frame
    copyToData(frames[frame - 1]);

    refresh();

    frameText.text = "Frame: " + frame + " / " + frames.length;

}

function drawPalette() {

    //  Draw the palette to the UI bmd
    ui.clear(0, 0, 32 * 16, 32);

    var x = 0;

    for (var clr in game.create.palettes[palette])
    {
        ui.rect(x, 0, 32, 32, game.create.palettes[palette][clr]);
        x += 32;
    }

    ui.copy('uiGrid');
}

function changePalette() {

    palette++;

    console.log(game.create.palettes)
    if (!game.create.palettes[palette])
    {
        palette = 0;
    }

    drawPalette();
    refresh();

}

function setColor(i, p) {

    if (typeof p !== 'undefined')
    {
        //  It came from a Keyboard Event, in which case the color index is in p, not i.
        i = p;
    }

    if (i < 0)
    {
        i = 15;
    }
    else if (i >= 16)
    {
        i = 0;
    }

    colorIndex = i;
    color = game.create.palettes[palette][pmap[colorIndex]];

    paletteArrow.x = (i * 32) + 8;

}

function nextColor() {

    var i = colorIndex + 1;
    setColor(i);

}

function prevColor() {

    var i = colorIndex - 1;
    setColor(i);

}

function increaseSize(sprite) {

    if (sprite.name === 'width')
    {
        if (spriteWidth === spriteWidthMAX)
        {
            return;
        }

        spriteWidth++;
    }
    else if (sprite.name === 'height')
    {
        if (spriteHeight === spriteHeightMAX)
        {
            return;
        }

        spriteHeight++;
    }

    resetData();
    resetDataframes();
    resizeCanvas();
    resizePreview();
    refresh();

    widthText.text = "Width: " + spriteWidth;
    heightText.text = "Height: " + spriteHeight;

}

function decreaseSize(sprite) {

    if (sprite.name === 'width')
    {
        if (spriteWidth === 4)
        {
            return;
        }

        spriteWidth--;
    }
    else if (sprite.name === 'height')
    {
        if (spriteHeight === 4)
        {
            return;
        }

        spriteHeight--;
    }

    resetData();
    resetDataframes();
    resizeCanvas();
    resizePreview();
    refresh();

    widthText.text = "Width: " + spriteWidth;
    heightText.text = "Height: " + spriteHeight;

}

function increasePreviewSize() {

    if (previewSize === 16)
    {
        return;
    }

    previewSize++;
    previewSizeText.text = "Size: " + previewSize;

    resizePreview();
    refresh();

}

function decreasePreviewSize() {

    if (previewSize === 1)
    {
        return;
    }

    previewSize--;
    previewSizeText.text = "Size: " + previewSize;

    resizePreview();
    refresh();

}


function save() {
    var date = new Date();
    var filename = date.toLocaleDateString().split('/').slice(2,3).concat(
        date.toLocaleDateString().split('/').splice(0,2)).join('-') + " " + (
        date.toLocaleTimeString().split(' ')[1]=='AM' ?
            date.toLocaleTimeString().split(' ')[0] :
            [parseInt(date.toLocaleTimeString().split(' ')[0].split(':')[0]) + 12].concat(
                date.toLocaleTimeString().split(' ')[0].split(':').splice(1,3)).join(':')
    ) + " - mapdata.json";

    //  Save current frame
    frames[frame - 1] = cloneData();

    // Download mapData file
    // console.log(frames);
    // console.log(JSON.stringify(frames));
    dataDownload(JSON.stringify(frames),filename);
    // alert("地图数据导出成功");

    var output = "";

    for (var f = 0; f < frames.length; f++)
    {
        var src = frames[f];

        if (src === null)
        {
            continue;
        }

        output = output.concat("var frame" + f + " = [\n");

        for (var y = 0; y < src.length; y++)
        {
            output = output.concat("\t'");
            output = output.concat(src[y].join(''));

            if (y < src.length - 1)
            {
                output = output.concat("',\n");
            }
            else
            {
                output = output.concat("'\n");
            }
        }

        output = output.concat("];\n");
        output = output.concat("game.create.texture('yourKey', frame" + f + ", " + previewSize + ", " + previewSize + ", " + palette + ");\n");

    }

    console.log(output);

    saveText.alpha = 1;
    game.add.tween(saveText).to( { alpha: 0 }, 2000, "Linear", true);

}

function load(){
    var input = document.createElement('input');
    input.style.display = 'none';
    input.setAttribute("onchange", "fileImport()");
    input.id = "filesInput";
    input.type = 'file';
    document.body.appendChild(input);
    input.click();
}
function fileImport() {
    //获取读取我文件的File对象
    var selectedFile = document.getElementById('filesInput').files[0];
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    console.log("文件名:"+name+"大小:"+size);

    console.log(selectedFile);
    var reader = new FileReader();//这是核心,读取操作就是由它完成.
    reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
    reader.onload = function () {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        console.log(frames);
        console.log(data);
        frames = JSON.parse(reader.result);
        copyToData(frames[0]);
        refresh();
        // for(i = 0;i<frames.length;i++){
        //     // console.log(frames[i]);
        //     for(j = 0;j<frames[i].length;j++){
        //         frames[i][j] = [frames[i][j].join()];
        //     //     console.log(a[i][j]);
        //     }
            console.log(data);
        // }
        document.body.removeChild(document.getElementById('filesInput'));
    };
}

function dataDownload(content, filename) {
    if ('download' in document.createElement('a')) {
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }else{
        eleButton.onclick = function () {
            alert('浏览器不支持');
        };
    }
}

function generate(){
    var input = document.createElement('input');
    input.style.display = 'none';
    input.setAttribute("onchange", "mapConfigImport()");
    input.id = "filesInput";
    input.type = 'file';
    document.body.appendChild(input);
    input.click();
}

function mapConfigImport(){
    //获取读取我文件的File对象
    var selectedFile = document.getElementById('filesInput').files[0];
    console.log(selectedFile);
    var reader = new FileReader();//这是核心,读取操作就是由它完成.
    reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
    reader.onload = function () {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        var str = reader.result;
        // console.log(str);
        document.body.removeChild(document.getElementById('filesInput'));
        var js = document.createElement('script');
        js.text = str;
        document.body.appendChild(js);
        console.log(mapConfig)
    };
}

function shiftLeft() {

    canvas.moveH(-canvasZoom);
    preview.moveH(-previewSize);

    for (var y = 0; y < spriteHeight; y++)
    {
        var r = data[y].shift();
        data[y].push(r);
    }

}

function shiftRight() {

    canvas.moveH(canvasZoom);
    preview.moveH(previewSize);

    for (var y = 0; y < spriteHeight; y++)
    {
        var r = data[y].pop();
        data[y].splice(0, 0, r);
    }

}

function shiftUp() {

    canvas.moveV(-canvasZoom);
    preview.moveV(-previewSize);

    var top = data.shift();
    data.push(top);

}

function shiftDown() {

    canvas.moveV(canvasZoom);
    preview.moveV(previewSize);

    var bottom = data.pop();
    data.splice(0, 0, bottom);

}

function onDown(pointer) {

    if (pointer.y <= 32)
    {
        setColor(game.math.snapToFloor(pointer.x, 32) / 32);
    }
    else
    {
        isDown = true;

        if (pointer.rightButton.isDown)
        {
            isErase = true;
        }
        else
        {
            isErase = false;
        }

        paint(pointer);
    }

}

function onUp() {
    isDown = false;
}

function paint(pointer) {

    //  Get the grid loc from the pointer
    var x = game.math.snapToFloor(pointer.x - canvasSprite.x, canvasZoom) / canvasZoom;
    var y = game.math.snapToFloor(pointer.y - canvasSprite.y, canvasZoom) / canvasZoom;

    if (x < 0 || x >= spriteWidth || y < 0 || y >= spriteHeight)
    {
        return;
    }

    coords.text = "X: " + x + "\tY: " + y;

    if (!isDown)
    {
        return;
    }

    if (isErase)
    {
        data[y][x] = '.';
        canvas.clear(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
        preview.clear(x * previewSize, y * previewSize, previewSize, previewSize, color);
    }
    else
    {
        data[y][x] = pmap[colorIndex];
        canvas.rect(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
        preview.rect(x * previewSize, y * previewSize, previewSize, previewSize, color);
    }

}

function showAll(){

}
