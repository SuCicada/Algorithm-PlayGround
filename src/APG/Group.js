console.log("Group.js has been loaded successfully.")

/**
 * Group（组）：概念取自phaser，指代框架中多个的元素对象组合而来的组形式的对象。也是接口的一个分类。
 * @class APG.Group
 */
APG.Group;


/**
 * 创建一个组，
 * 默认存在0个精灵, 默认key 为spritesheet, index 从1开始。
 * @method APG.Group#setGroup
 * @returns {Phaser.Group}
 */
APG.Group.setGroup = function(){
    var group = game.add.group();
    group.enableBody = true;
    game.physics.arcade.enable(group);
    return group;
};

/**
 * 移动 groupUp 对象到 groupDown 对象上面。
 * @method APG.Group#moveGroupUpTo
 * @param {Phaser.Group} groupUp
 * @param {Phaser.Group} groupDown
 */
APG.Group.moveGroupUpTo = function(groupUp, groupDown){
    while(groupUp.z<=groupDown.z){
        game.world.moveUp(groupUp);
        console.log(groupUp.z, groupDown.z)
    }
};
/**
 * 移动 groupDown 对象到 groupUp 对象下面。
 * @method APG.Group#moveGroupDownTo
 * @param {Phaser.Group} groupDown
 * @param {Phaser.Group} groupUp
 */
APG.Group.moveGroupDownTo = function(groupDown, groupUp){
    while(groupDown.z >= groupUp.z){
        game.world.moveDown(groupDown);
    }
};

/**
 * 得到 `target `组对象，`target` 是设置在游戏配置文件中的。
 * @method APG.Group#getTargetGroup
 * @param {string} name - Target组名
 * @returns {Phaser.Group}
 */
APG.Group.getTargetGroup = function(name){
    return APG.TargetGroups[name];
};

/**
 * 得到 `Character` 组对象，`Character` 是设置在游戏配置文件中的。
 * @method APG.Group#getCharacterGroup
 * @param {string} name - Character组名
 * @returns {Phaser.Group}
 */
APG.Group.getCharacterGroup = function(name){
    return APG.CharacterGroups[name];
};
