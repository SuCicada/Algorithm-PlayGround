console.log("Game.js has been loaded successfully.")

/* 界面 */

/**
 * Game（游戏属性）：游戏全局控制，界面，大小，全屏，重启游戏等操作。
 * @class APG.Game
 */
APG.Game;

/**
 * 得到游戏宽。
 * @method APG.Game#getGameWIDTH
 * @returns {*|number|Window.screen.width}
 */
APG.Game.getGameWIDTH = function(){
    return APG.WIDTH;
};

/**
 * 得到游戏高。
 * @method APG.Game#getGameHEIGHT
 * @returns {*|number|Window.screen.height}
 */
APG.Game.getGameHEIGHT = function(){
    return APG.HEIGHT;
};

/**
 * 得到游戏渲染模式。
 * @method APG.Game#getGameMODE
 * @returns {*|string}
 */
APG.Game.getGameMODE = function(){
    return APG.MODE;
};

/**
 * 显示游戏开始界面，根据配置文件中配置自动显示。
 * @method APG.Game#README
 */
APG.Game.README = function(){
    let config = globalConfig.README;
    config.font.size = WIDTH/(Math.sqrt(config.text.length/2))/5


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
    let index = 1;
    for(let i=0;i<config.text.length;i++){
        if(config.text[i]=='\n'){
            index = 1;
        }
        if((index) % (columnCount+1) == 0){
            str += '\n';
        }
        str += config.text[i];
        index++;
    }

    config.text = str;
    let text = game.add.text(WIDTH/2, y*1.2, config.text, style);
    text.anchor.set(0.5,0);
    let text2 = game.add.text(x+w-APG.Tile.width/2, y+h-APG.Tile.height/2, "click to continue", style2);
    text2.anchor.set(1,1);

    bar.inputEnabled = true;
    // bar.input.useHandCursor = true;
    bar.events.onInputDown.add(function(){
        // console.log(1111)
        bar.destroy();
        text.destroy();
        text2.destroy();
        APG.Update.listenKey.startListenKey();
    });
};

/**
 * 显示胜利界面
 * @method APG.Game#WIN
 * @param {string} str - 自定义显示的文字
 * @param {function} func - 点击界面后执行的函数
 * @param {{}} [that = APG.DeveloperModel] - 回调上下文
 */
APG.Game.WIN = function(str, func, that=APG.DeveloperModel){
    game.input.keyboard.stop();

    let w = WIDTH * 0.8;
    let h = HEIGHT * 0.8;
    let x = (WIDTH - w) / 2;
    let y = (HEIGHT - h) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+globalConfig.README.font.size+"px Arial", fill: "#0037f1",
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

/**
 * 显示失败界面
 * @method APG.Game#LOST
 * @param {string} str - 自定义显示的文字
 * @param {function} func - 点击界面后执行的函数
 * @param {{}} [that = APG.DeveloperModel] - 回调上下文
 */
APG.Game.LOST = function(str, func, that=APG.DeveloperModel){
    game.input.keyboard.stop();

    let w = APG.WIDTH * 0.8;
    let h = APG.HEIGHT * 0.8;
    let x = (APG.WIDTH - w) / 2;
    let y = (APG.HEIGHT - h) / 2;
    let  bar = game.add.graphics();
    bar.beginFill('0x'+'#dfc9c8'.slice(1), 0.8);
    bar.drawRect(x, y, w, h);

    let  style = { font: "bold "+globalConfig.README.font.size+"px Arial", fill: "#0037f1",
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

/**
 * 游戏全屏
 * @method APG.Game#fullScreen
 */
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

/**
 * 游戏退出全屏
 * @method APG.Game#exitFullscreen
 */
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

/**
 * 游戏重启，无需重新加载资源
 * @method APG.Game#restartGame
 */
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


APG.Game.fireKeyEvent = function(el, evtType, keyCode){
    var doc = el.ownerDocument;
    var win = doc.defaultView || doc.parentWindow,
        evtObj;
    if(doc.createEvent){
        if(win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get : function() { return this.keyCodeVal; }
            });
            Object.defineProperty(evtObj, 'which', {
                get : function() { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    }
    else if(doc.createEventObject){
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

APG.Game.isInner =function(sprite, x,y){
    s = {}
    s.x = sprite.x
    s.y = sprite.y
    s.width = sprite.width
    s.height = sprite.height
    if(isvertical){
        s.x = APG.HEIGHT-sprite.y-sprite.height;
        s.y = sprite.x
    }
    console.log(s)
    console.log(x,y)

    if(x>=s.x && x<=s.x+s.width &&
        y>=s.y && y<=s.y+s.height){
        return true;
    }
    return false;
}


