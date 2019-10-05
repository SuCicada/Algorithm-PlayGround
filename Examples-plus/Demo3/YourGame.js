var player;
var Fm_Group;
var Fm_List2;
var FM_List2_top = 0;
var FORMULA = "(2-5+1)*6/3";
var ANSWER = eval(FORMULA)
YourGame = {
	/*	游戏初始（文本块） 玩家操作（按键绑定）  碰撞检测  自定义属性变量 元素动画*/
	preload: function(){
		var tool1 = [
			'22222222222',
			'2         2',
			'2   22    2',
			'2   22    2',
			'2         2',
			'2         2',
			'2         2',
			'22222222222',
		]
		var tool2 = [
			'44444444444',
			'4         4',
			'4   44    4',
			'4   44    4',
			'4         4',
			'4         4',
			'4         4',
			'44444444444',
		]
		var size = APG.HEIGHT / 60;
		game.load.imageFromTexture('tool1', tool1, size);
		game.load.imageFromTexture('tool2', tool2, size);
	},
	create: function(){
		var siteX = APG.HEIGHT * 0.2 ;
		var siteY = APG.HEIGHT *0.7
		var bar = APG.HEIGHT * 0.1;
		this.Key;

		buttonTool1 = game.add.button(APG.WIDTH*0.8, siteY, 'tool1');
		buttonTool2 = game.add.button(APG.WIDTH*0.9, siteY, 'tool2');
		game.input.onTap.add(function(){
			var clickX = game.input.activePointer.clientX;
			var clickY = game.input.activePointer.clientY;
			if(APG.Game.isInner(buttonTool1,clickX, clickY)){
				push()
				// APG.DeveloperModel.push.apply(APG.DeveloperModel)
			}else if(APG.Game.isInner(buttonTool2,clickX, clickY)) {
				pop()
				// APG.DeveloperModel.pop.apply(APG.DeveloperModel)
			}
		},this)


		APG.Assets.playMusic('mu')

		Fm_Group = getTargetGroup("formula")
		Fm_List = getSpriteList(Fm_Group)
		console.log(Fm_List)
		//loadTextBitMap(Fm_List[0],"3","#FFC107")
		// Num_Arr = ["3","+","(","2","-","5",")","*","6","/","3"]
		Num_Arr = FORMULA.split('')
		loadTextBitMapBetween (Fm_Group,Num_Arr,"#ffbd00")


		Fm_Group2 = getTargetGroup("result")
		Fm_List2 = getSpriteList(Fm_Group2)
		console.log(Fm_List2)
		Num_Arr = [" "," "," "," "," "," "," "," "," "," "," "]
		loadTextBitMapBetween (Fm_Group2,Num_Arr,"#efeb69")

		this.player = APG.Group.getCharacterGroup('player');
		player = this.player;
		APG.Assets.playerMoveAnimations(this.player,{
			/* 方向(大写,或小写 -> frames 或单个数字*/
			right: 0,
			LEFT: [1],
			down: [2],
			up: 3,
		});


		blockGroupOverlap(this.player, Fm_Group)
		blockTileOverlap(this.player,0)
		addKeyEvent('J',push);
		addKeyEvent('K',pop);
		// addKeyEvent('SPACEBAR',out);
	},
	update: function(){
		site = getCharacterSite(this.player)
		APG.Update.listenKey.characterMoveEvent(this.player, null, drop, [site], null, null, this,this.Key);
		this.Key = '';
		if(site.x == 12 && site.y == 1){
			while(getBagSize()){
				pop();
			}
			switch(check()){
				case 1: WIN("你赢了")
					break
				case 0: LOST("答案错误,点击重来",function(){
					FM_List2_top = 0;
					restartGame();
				})
					break
				case -1: LOST("算式错误,点击重来",function(){
					FM_List2_top = 0;
					restartGame();
				})
					break
			}

		}
	},

}

function check(){
	result = []
	Fm_List2.forEach(function(s){
		info = aboutTextBitMap(s)
		result.push(info.text)
	})
	console.log(result.join(''))
	syntax = ['+','-','*','/']
	num = []
	for(i=0;i<=9;i++){
		num.push(i.toString())
	}
	flag = 1;
	value = 0;
	stack = [];
	for(i=0;i<FM_List2_top;i++){
		// console.log(result[i])
		if(num.indexOf(result[i])!=-1) {
			stack.push(result[i])
		}
		if(syntax.indexOf(result[i])!=-1){
			b = stack.pop()
			a = stack.pop()
			if(a!=undefined && b!=undefined){
				c = eval(a+result[i]+b).toString()
				stack.push(c)
			}else{
				return -1;
			}
		}
	}
	// console.log(stack)
	// console.log(ANSWER)
	if(eval(stack[0]) == ANSWER){
		return 1;
	}else{
		return 0;
	}
}
function drop(site){
	tile = getTileFromSite(site)
	removeTile(tile)
}
function push(){
	site = getCharacterSite(player);
	block = getSpriteListFromSite(site.x,site.y-1,Fm_Group );
	drop({x:site.x,y:site.y-1})
	if(block.length){
		getItem(block)
		text = aboutTextBitMap(block[0]).text;
		console.log(text)
		try {
			if(typeof eval(text) == 'number'){
				pop();
			}
		}catch (e) {

		}
		return true;

	}else{
		return false;
	}

}

function pop(){
	if(getBagSize()){
		site = getSpriteSite(Fm_List2[FM_List2_top])
		// console.log(site)
		block = putItem(site.x,site.y)
		info = aboutTextBitMap(block)
		if(['(',')'].indexOf(info.text)==-1){
			loadTextBitMap(Fm_List2[FM_List2_top],info.text,info.bgColor)
			FM_List2_top++
		}
	}
}
// function out(){
// 	if(push()){
// 		pop();
// 	}
// }