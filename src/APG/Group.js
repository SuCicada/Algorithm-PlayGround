console.log("Group.js has been loaded successfully.")

/* Group */
APG.Group.setGroup = function(){
    /*默认存在0个精灵, 默认key 为spritesheet, index 从1开始*/
    var group = game.add.group();
    group.enableBody = true;
    game.physics.arcade.enable(group);
    return group;
};
APG.Group.moveGroupUpTo = function(groupUp, groupDown){
    /* 移动 groupUp 对象到 groupDown 对象上面*/
    while(groupUp.z<=groupDown.z){
        game.world.moveUp(groupUp);
        console.log(groupUp.z, groupDown.z)
    }
};
APG.Group.moveGroupDownTo = function(groupDown, groupUp){
    /* 移动 groupDown 对象到 groupUp 对象下面*/

    while(groupDown.z >= groupUp.z){
        game.world.moveDown(groupDown);
    }
};
APG.Group.getTargetGroup = function(name){
    return APG.TargetGroups[name];
};
APG.Group.getCharacterGroup = function(name){
    return APG.CharacterGroups[name];
};
