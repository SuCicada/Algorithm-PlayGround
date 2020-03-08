console.log("Assets.js has been loaded successfully.")
/* ==========    Assets ====================  */
/**
 * Assets（资源）：游戏需要加载的资源，也是接口的一个分类。
 * @class APG.Assets
 */
APG.Assets;
APG.Assets.virtualButton;

/**
 * 播放音乐
 * @method APG.Assets#playMusic
 * @param {string} keyName - 音乐名
 */
APG.Assets.playMusic = function (keyName) {
    APG.Assets.music[keyName].play('', 0, 1, true);
    console.log("Play music: " + keyName);
};

/**
 * 停止音乐。如果没有传入名称,则全部停止
 * @method APG.Assets#stopMusic
 * @param {string} keyName - 音乐名
 */
APG.Assets.stopMusic = function (keyName) {
    let musics = keyName ? {keyName: APG.Assets.music[keyName]} : APG.Assets.music;
    for (m in musics) {
        APG.Assets.music[m].stop();
        console.log("Stop music: " + keyName);
    }
};

/**
 * 添加动画, 并播放.
 * @method APG.Assets#setAnimations
 * @param {Phaser.Group|Phaser.Sprite} obj - 要设置的对象
 * @param {string} name - 动作名
 * @param {Array} frames - 帧id
 * @param {integer} [frameRate = 1] - 帧动画速度
 * @param {boolean} [loop = false] - 循环否
 */
APG.Assets.setAnimations = function (obj, name, frames, frameRate = 1, loop = false) {
    /*
    * */
    if (typeof frames == "number") {
        frames = [frames]
    }
    if (!obj.forEach) {
        let s = obj;
        if (frames) {
        }
        if (!s.animations.getAnimation(name)) {
            s.animations.add(name, frames);
        }
        s.animations.play(name, frameRate, loop);
    } else {
        let group = obj;
        group.forEach(function (s) {
            if (!s.animations.getAnimation(name)) {
                s.animations.add(name, frames);
            }
            s.animations.play(name, frameRate, loop);
        });
    }
};

/**
 * 设置玩家移动动画
 * @method APG.Assets#playerMoveAnimations
 * @param {Phaser.Group|Phaser.Sprite} playerG - 玩家对象
 * @param {object} obj - 方向(大写,或小写 -> frames 或单个数字，比如
 *   {
 *       right: 0,
 *       LEFT: [1],
 *       d own: [2],
 *       up: 3,
 *   }
 */
APG.Assets.playerMoveAnimations = function (playerG, obj) {
    var move = {};
    for (var i in obj) {
        var I = i.toUpperCase()
        move[I] = typeof obj[i] == 'number' ? [obj[i]] : obj[i];

    }
    if (playerG.animations) {
        playerG.animations.add(I, move[I], 1);
        playerG.Assets.move = move;
    } else {
        playerG.forEach(function (s) {
            s.animations.add(I, move[I], 1);
            s.Assets = {};
            s.Assets.move = move;
        });
        playerG.Assets = {};
        playerG.Assets.move = move;
    }
};

/**
 * 根据传入的精灵或组,返回此精灵当前的动画的frameId
 * @method APG.Assets#getFrame
 * @param {Phaser.Group|Phaser.Sprite} obj - 精灵或组或精灵列表
 * @returns {Array|number} 如果传入组或精灵列表，返回frameId 列表
 */
APG.Assets.getFrame = function (obj) {
    if (obj.animations) {
        /* sprite */
        return obj.animations.frame;
    } else {
        /* group or sprite List*/
        var frames = [];
        obj.forEach(function (s) {
            frames.push(s.animations.frame);
        });
        return frames;
    }

};

/**
 * 用来设置屏幕上虚拟按键的
 * @param name - 按键的名称
 * @param x
 * @param y
 * @param func - 按下之后执行的操作函数, 即回调函数
 */
APG.Assets.setVirtualButton = function (name, x, y, func) {
    // APG.Assets.virtualButton["button"] = button;
    APG.Assets.virtualButton.push({
        "name": name,
        "x": x,
        "y": y,
        "func": func,
        "buttonObj": null, // 会由APG-core进行赋值
    })
};

APG.Assets.deleteVirtualButton = function (name) {
    for (i = 0; i < APG.Assets.virtualButton.length; i++) {
        if (APG.Assets.virtualButton[i].name = name) {
            var obj = APG.Assets.virtualButton[i].buttonObj;
            if (obj) {
                obj.destroy()
            }
            APG.Assets.virtualButton.pop(i)
            break;
        }
    }
}

APG.Assets.changeVirtualButton = function (name, newName) {
    var bnt = APG.Assets.virtualButton.find(function (b) {
        return b.name == name;
    })
    if (bnt && game.cache.checkImageKey(newName)) {
        bnt.name = newName;
        bnt.buttonObj.loadTexture(newName)
    }
}