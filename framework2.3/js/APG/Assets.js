console.log("Assets.js has been loaded successfully.")

/* ==========    Assets ====================  */
/* music */
APG.Assets.playMusic = function(keyName){
    APG.Assets.music[keyName].play('',0,1,true);
    console.log("Play music: "+keyName);
};

APG.Assets.stopMusic = function(keyName){
    /* 如果没有传入名称,则全部停止 */
    let musics = keyName? {keyName:APG.Assets.music[keyName]}: APG.Assets.music;
    for(m in musics){
        APG.Assets.music[m].stop();
        console.log("Stop music: "+keyName);
    }
};

/* 动画 */
APG.Assets.setAnimations = function(obj, name, frames, frameRate=1, loop=false){
    /*
    * 添加动画, 并播放.
    * group: 可以是组,也可以是精灵
    * frames: 从0开始?
    * name: 动作名
    * */
    if(!obj.forEach){
        let s = obj;
        s.animations.add(name,frames);
        s.animations.play(name, frameRate, loop);
    }else{
        let group = obj;
        group.forEach(function(s){
            s.animations.add(name,frames);
            s.animations.play(name, frameRate, loop);
        });
    }
};
APG.Assets.playerMoveAnimations = function(playerG, obj){
    /* 设置玩家移动动画
    * obj:
    *   方向(大写,或小写 -> frames 或单个数字, 比如
    *   {
    *       right: 0,
    *       LEFT: [1],
    *       down: [2],
    *       up: 3,
    *   }
    */
    var move = {};
    for(var i in obj){
        var I = i.toUpperCase()
        move[I] = typeof obj[i] == 'number'?[obj[i]]: obj[i];

        // if(playerG.setAnimations){
        //     playerG.setAnimations.add(I, move[I], 1);
        // }else{
        //     playerG.forEach(function(s){
        //         s.setAnimations.add(I, move[I], 1);
        //     })
        // }
    }
    APG.players[0].setAnimations = {};
    APG.players[0].animations.move = {};
    APG.players[0].animations.move = move;
};
APG.Assets.getFrame = function(obj){
    /* 根据传入的精灵或组,返回此精灵当前的动画的frameId */
    if(obj.setAnimations){
        /* sprite */
        return obj.setAnimations.frame;
    }else{
        /* group or sprite List*/
        var frames = [];
        obj.forEach(function(s){
            frames.push(s.setAnimations.frame);
        });
        return frames;
    }

};




