console.log("Update.js has been loaded successfully.")

/* ================ update ==============================*/
/*
APG.Update.= {};
APG.Update.listenKey = {};
APG.Update.listenKey.keyEventList = [];
*/
APG.Update.listenKey.stopListenKey = function(){
    game.input.keyboard.stop();
};
APG.Update.listenKey.startListenKey = function(){
    game.input.keyboard.start();
};
APG.Update.listenKey.setMoveKey = function(direction, key){
    /*  修改移动按键 */
    var direction = direction.toUpperCase();
    var key = key.toUpperCase();
    APG.Keys.move[direction] = key;
};
APG.Update.listenKey.addKeyEvent = function(key, feedback, context, that=APG.DeveloperModel){
    APG.Update.listenKey.keyEventList.push({
        key: key,
        feedback: feedback,
        context: context,
        that: that,
    });
};
APG.Update.listenKey.characterMoveEvent = function(playerG, role, resolve, resolveContext, reject, rejectContext, that=APG.DeveloperModel) {
    /* resolve: function 移动成功执行函数,执行函数
    *  resolveContext: list resolve函数的参数,列表形式
    * */
    for (var k in APG.Keys.move) {
        if (APG.Keys[APG.Keys.move[k]].justDown) {
            console.log(k+" is justDown.")
            var playerGroup = playerG;
            var player = APG.methods.getCharacterSprite(playerGroup);

            /* 设置方向 */
            player.direction.x = APG.UDLRDir[k].x;
            player.direction.y = APG.UDLRDir[k].y;

            var nowSite = APG.methods.getCharacterSite(player);

            /* 预设新的相对坐标 */
            var newX = nowSite.x + player.direction.x;
            var newY = nowSite.y + player.direction.y;

            {
                //  ====== 检测玩家是否可走 =====
                var canMove = true;
                /* 地图超出 */
                if (APG.Update.collideWorldBounds) {
                    if (newX < 0 || newY < 0 || newX >= MapArea.rows || newY >= MapArea.columns) {
                        canMove = false;
                    }
                }
                /* 检测组碰撞 */
                APG.Update.collision.block.playerGroupList.forEach(
                    function (object) {
                        if (object.group) {
                            object.group.forEach(function (sprite) {
                                var site = APG.methods.siteDecode(newX, newY);
                                if (site.x == sprite.x && site.y == sprite.y) {
                                    canMove = false;
                                    if (object.feedback) {
                                        object.feedback.apply(that, [playerGroup, sprite]);
                                    }
                                }
                            })
                        }
                    });

                /* 检测砖块碰撞 */
                APG.Update.collision.block.playerTileList.forEach(
                    function (object) {
                        var tile = APG.methods.getTileFromSite(newX, newY);
                        if (tile && tile.index == object.tileIndex) {
                            canMove = false;
                            if (object.feedback) {
                                object.feedback.apply(that, [playerGroup, sprite]);
                            }
                        }
                    });

                /* 调用用户自定义规则,根据返回值判断能否走,
                 * 可以覆盖以上规则 (?合适不)
                 * 如果没有返回值, 则canMove不变
                 */
                if (role) {
                    var flag = role.apply(that,[newX, newY]);
                    canMove = flag == undefined ? canMove : flag;
                }

                /* 无论能不能走, 都变化方向动画 */
                APG.methods.setAnimations(playerGroup, k, APG.players[0].animations.move[k], 1);
                if (canMove) {
                    console.log('player move from ' + nowSite.x + ", " + nowSite.y + " to " + newX + ", " + newY);
                    APG.methods.setCharacterSite(playerGroup, newX, newY);
                    if (resolve) {
                        resolve.apply(that, resolveContext);
                    }
                } else {
                    console.log('player can\'t move.');
                    if (reject) {
                        reject.apply(that, rejectContext);
                    }
                }
            }
        }
    }
};

APG.Update.bag = function(){
    /* 更新背包中的物品信息, 和数量对应 */
    for(item of APG.bag.items){
        item.number = item.group.children.length;
        item.text.setText(item.number);
    }
};

/* 边界碰撞,默认不开
* 用于玩家移动检测
*  */
/*APG.Update.collideWorldBounds = false;*/
APG.Update.setCollideWorldBounds = function(f){
    APG.Update.collideWorldBounds = f;
};

/*APG.Update.collision = {};*/
/* 碰撞检测之禁止覆盖 */
APG.Update.collision.block = {
    GroupList: [],        /* 需要检测的团队列表 */
    TileList: [],         /* 需要检测的瓷砖列表 */
    playerGroupList: [],  /* 需要检测的团队列表（对于玩家） */
    playerTileList: [],   /* 需要检测的瓷砖列表（对于玩家） */
};

/* 碰撞检测之覆盖后果 */
APG.Update.collision.active = {
    GroupList: [],        /* 需要检测的团队列表 */
    TileList: [],         /* 需要检测的瓷砖列表 */
    playerGroupList: [],  /* 需要检测的团队列表（对于玩家） */
    playerTileList: [],   /* 需要检测的瓷砖列表（对于玩家） */
};

APG.Update.collision.blockTileOverlap = function(group, tileIndex, feedback, context, that=APG.DeveloperModel){
    if(group == APG.CharacterGroups.player){
        APG.Update.collision.block.playerTileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }else{
        APG.Update.collision.block.TileList.push({
            group: group,
            tileIndex: tileIndex,
            feedback: feedback,
            context: context,
            that: that,
        });
    }
};

APG.Update.collision.blockGroupOverlap = function(group1, group2, feedback, context, that=APG.DeveloperModel) {
    if (group1 == APG.CharacterGroups.player) {
        APG.Update.collision.block.playerGroupList.push({
            group: group2,
            feedback: feedback,
            context: context,
            that: that,
        });
    }else{
        APG.Update.collision.block.GroupList.push({
            group1: group1,
            group2: group2,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }
};

APG.Update.collision.activeGroupOverlap = function(group1, group2, feedback, context, that=APG.DeveloperModel){
    var obj = {
        actor: "",
        feedback: feedback,
        // isCollided: false,
        context: context,
        that: that,
    };
    obj.group1 = group1;
    obj.group2 = group2;
    if (group1 == APG.CharacterGroups.player) {
        obj.actor = "player";
    }
    APG.Update.collision.active.GroupList.push(obj);
};
APG.Update.collision.activeTileOverlap = function(group, tileIndex, feedback, context, that=APG.DeveloperModel){
    if(group == APG.CharacterGroups.player){
        APG.Update.collision.active.TileList.push({
            tileIndex: tileIndex,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }else{
        APG.Update.collision.active.TileList.push({
            group: group,
            tileIndex: tileIndex,
            feedback: feedback,
            // isCollided: false,
            context: context,
            that: that,
        });
    }
};

// =========================
// ========= 施工中 ==========

APG.Update.collision.isCollided = function(group1, group2){

};

