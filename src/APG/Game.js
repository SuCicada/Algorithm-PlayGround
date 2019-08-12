console.log("Game.js has been loaded successfully.")

/* 界面 */
APG.Game.getGameWIDTH = function(){
    return APG.WIDTH;
};
APG.Game.getGameHEIGHT = function(){
    return APG.HEIGHT;
};
APG.Game.getGameMODE = function(){
    return APG.MODE;
};

APG.Game.README = function(config){
    APG.Update.listenKey.stopListenKey();

    let w = WIDTH * 0.8;
    let h = HEIGHT * 0.8;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - h) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+config.bgColor.slice(1), 0.9);
    bar.drawRect(x, y, w, h);

    let style = { font: "bold "+config.font.size+"px Arial",
        fill: config.font.color,
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let style2 = { font: "bold "+config.font.size/2+"px Arial",
        fill: 'rgb(1,1,1)'
    };

    let str = '';
    let columnCount = parseInt(style.wordWrapWidth / config.font.size);
    for(let i=0;i<config.text.length;i++){
        if((i+1) % columnCount == 0){
            str += '\n';
        }
        str += config.text[i];
    }
    config.text = str;
    let text = game.add.text(WIDTH/2, y*1.2, config.text, style);
    text.anchor.set(0.5,0);
    let text2 = game.add.text(x+w-APG.Tile.width/2, y+h-APG.Tile.height/2, "click to continue", style2);
    text2.anchor.set(1,1);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    bar.events.onInputDown.add(function(){
        bar.destroy();
        text.destroy();
        text2.destroy();
        APG.Update.listenKey.startListenKey();
    });
};
APG.Game.WIN = function(str, func, that=APG.DeveloperModel){
    game.input.keyboard.stop();

    let w = WIDTH * 0.5;
    let h = HEIGHT * 0.5;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - w) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+APG.Tile.width+"px Arial", fill: "#0037f1",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let text = game.add.text(WIDTH/2, y*1.2, "You Win\n"+str, style);
    text.anchor.set(0.5,0);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    if(func){
        bar.events.onInputDown.add(func,that);
    }
};
APG.Game.LOST = function(str, func, that=APG.DeveloperModel){
    game.input.keyboard.stop();

    let w = WIDTH * 0.5;
    let h = HEIGHT * 0.5;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - w) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+APG.Tile.width+"px Arial", fill: "#0037f1",
        boundsAlignH: "center",
        wordWrap: true,
        wordWrapWidth: w * 0.8
    };
    let text = game.add.text(WIDTH/2, y*1.2, "You LOST\n"+str, style);
    text.anchor.set(0.5,0);

    bar.inputEnabled = true;
    bar.input.useHandCursor = true;
    if(func){
        bar.events.onInputDown.add(func,that);
    }
};
APG.Game.fullScreen = function(){
    var element = document.documentElement;
    if (element.requestFullscreen) {
        // W3C
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        // msie
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        // firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        // chrome
        element.webkitRequestFullscreen();
    }
};
APG.Game.exitFullscreen = function(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};
APG.Game.restartGame = function(){
    APG.Bag.destroyBagBar();
    APG.Assets.stopMusic();
    APG.Tilemap.destroy();
    APG.Layer.destroy();
    game.state.restart();

    for(m in APG.CharacterGroups) {
        APG.CharacterGroups[m].destroy();
        APG.CharacterGroups[m].removeAll();
    }
    for(m in APG.TargetGroups) {
        APG.TargetGroups[m].removeAll();
        APG.TargetGroups[m].destroy();
    }
};





