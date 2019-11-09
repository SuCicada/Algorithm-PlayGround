YourGame = {
    create: function(){
        var siteX = APG.HEIGHT * 0.2 ;
        var siteY = APG.HEIGHT *0.7
        var bar = APG.HEIGHT * 0.1;

        APG.Assets.setVirtualButton('tool1', APG.WIDTH*0.8, siteY, function(){
            this.swapBlock();//.apply(APG.DeveloperModel)
        });



        font1 = WIDTH/(Math.sqrt(25))/5
        let style1 = { font: "bold "+font1+"px Arial",
            fill: '#111111',
            boundsAlignH: "center",
        };
        this.bar1 = game.add.graphics();
        this.bar1Y = APG.Game.getGameHEIGHT()*0.1
        this.bar1X = APG.Game.getGameWIDTH()*0.3

        this.bar1.anchor.set(0.5,0.5);
        this.bar1.beginFill('0x'+"#b87e4d".slice(1),1);
        this.bar1.drawRect(this.bar1X,this.bar1Y,font1*5,font1);
        this.text1 = game.add.text(this.bar1X,this.bar1Y,"", style1);


        /* 代码块 */
        this.forceCodeLineColor = '#b4af08'
        this.CodeColor = '#f1f1ed'
        this.bar2 = game.add.graphics();
        var maxSide = Math.max(APG.WIDTH,APG.HEIGHT)
        var minSide = Math.min(APG.WIDTH,APG.HEIGHT)
        console.log(maxSide,minSide)
        if(maxSide / minSide >= 2.4){
            this.bar2X = APG.Game.getGameWIDTH()*0.7
            this.bar2Y = APG.Game.getGameHEIGHT()*0.2
        }else{
            this.bar2X = APG.Game.getGameWIDTH()*0.3
            this.bar2Y = APG.Game.getGameHEIGHT()*0.7

        }
        font2 = WIDTH/(Math.sqrt(25))/10
        style2 = this.style2 = { font: "bold "+font2+"px Arial",
            fill: this.CodeColor,
            boundsAlignH: "center",
        };
        this.bar2.beginFill('0x'+"#1642b8".slice(1),0.8);
        this.bar2.drawRect(this.bar2X,this.bar2Y,font2*20,font2*10);
        this.code = ["for(i=0;i<8;i++):",
                    "    if(i+1<8 && num[i]>num[i+1]):",
                    "        swap(num,i,i+1)",
                    "for(i=7;i>=0;i--):",
                    "    if(i-1>=0 && num[i-1]>num[i]):",
                    "        swap(num,i-1,i)"]
        this.text2 = []
        for(i=0;i<this.code.length;i++){
             a = game.add.text(this.bar2X,this.bar2Y+font2*i*1.1,this.code[i], style2);
             this.text2.push(a);
        }


        font3 = WIDTH/(Math.sqrt(25))/6
        style3 = { font: "bold "+font3+"px Arial",
            fill: '#b41600',
            boundsAlignH: "center",
        };
        this.bar3 = game.add.graphics();
        this.bar3X = APG.Game.getGameWIDTH()*0.5
        this.bar3Y = APG.Game.getGameHEIGHT()*0.1
        this.bar3.beginFill('0x'+"#57b845".slice(1),0.8);
        this.bar3.drawRect(this.bar3X,this.bar3Y,font3*20,font1*1);
        this.codeline = ""
        this.text3 = game.add.text(this.bar3X,this.bar3Y,this.codeline, style3);





        /* 通过背包增加的对象组,和通过地图设定的   对象组,都会自动创建并加入 APG.TargetGroups 中,
        *  但是通过地图第三层, 即玩家层,创建的玩家对象组,会加入 APG.CharacterGroups 中
        * 两种用法都一样, 只需要从这两个js中的对象拿取相应的组即可
        * */
        // let  bar = game.add.graphics();
        // bar.beginFill('0x'+'#dd8269'.slice(1), 0.9);
        // bar.

        // circle = new Phaser.Rectangle(game.world.centerX, game.world.centerY, 500,300);



        APG.Assets.playMusic('mu');
        this.exports = APG.Group.getTargetGroup("chukou");
        this.numBlocks = APG.Group.getTargetGroup("numBlock");
        this.previousBlocks = [];
        let nums = new Array(7); // = [12,3,45,7,11,425,9];
        this.blockColor = 'rgb(212,142,0)'
        this.oneColor = '#cdcdcd'
        this.twoColor = '#f93be2'
        for(let i=0;i<nums.length;i++){
            nums[i] = Math.round(Math.random()*200);
        }
        APG.Target.loadTextBitMapBetween(this.numBlocks,nums,this.blockColor);

        this.player = APG.Group.getCharacterGroup('player');
        APG.Group.moveGroupUpTo(this.player, this.exports);

        APG.Assets.playerMoveAnimations(this.player,{
            /* 方向(大写,或小写 -> frames 或单个数字*/
            right: 0,
            LEFT: [1],
            down: [2],
            up: 3,
        });

        APG.Update.listenKey.setMoveKey('up','UP');

        APG.Update.collision.setCollideWorldBounds(false);

        APG.Update.collision.blockGroupOverlap(this.player, this.numBlocks);
        APG.Update.collision.activeGroupOverlap(this.player, this.baoshis, this.getBaoshi, null, this);
        APG.Update.collision.activeGroupOverlap(this.player, this.exports, this.export);
        APG.Update.listenKey.addKeyEvent('E', this.swapBlock, null, this);
    },
    update: function(){
        // var site = APG.methods.getCharacterSite(this.player);
        APG.Update.listenKey.characterMoveEvent(this.player, this.checkMove, this.checkCode, null, null, null, this,this.Key);
        this.Key = '';

        var tile = APG.Character.getCharacterTile(this.player);
        if(!tile || APG.Tile.getTileId(tile)==3){
            APG.Update.listenKey.stopListenKey();
            setTimeout(function(){
                APG.Game.restartGame();
            },100);
        }

        this.checkColor();
        this.checkBlocks();
    },
    checkCode: function(){
        let nowSite = APG.Character.getCharacterSite(this.player);
        var n = -1;
        if(nowSite.x>1 && nowSite.x<9){
            var str = "  i: "+(nowSite.x-1);
            if(nowSite.y == 1){
                var str2 = this.code[0].trim()
                n = 0;
            }else if(nowSite.y == 3){
                var str2 = this.code[3].trim()
                n = 3;
            }
        }else{
            var str = "";
            var str2 = "";
        }
        if(n>=0){
            this.setCodeLineColor(n)
        }
        this.text1.setText(str);
        this.text3.setText(str2);
    },
    checkMove: function(newX,newY){
        /* 无论之前检测是否能通行, 这里都会再次传入坐标执行,
         * 所以记得判断一下前方是什么
         * */
        var tile = APG.Tile.getTileFromSite(newX, newY);
        if(!tile || APG.Tile.getTileId(tile)==3){
            return false;
        }
        let tileIndex = APG.Tile.getTileId(tile);
        let nowSite = APG.Character.getCharacterSite(this.player);
        if(tileIndex == 2 && nowSite.x - 1 == newX){
            return false;
        }else if(tileIndex == 4 && nowSite.x + 1 == newX){
            return false;
        }
    },
    checkBlocks: function(){
        /*检查是否排好序*/
        let blocks = APG.Sprite.getSpriteList(this.numBlocks);
        blocks = blocks.sort(function(a,b){
           return APG.Sprite.getSpriteSite(a).x < APG.Sprite.getSpriteSite(b);
        });

        var blockNums = [];
        for(let i = 0;i<blocks.length;i++) {
            blockNums.push(parseInt(aboutTextBitMap(blocks[i]).text))
        }
        // console.log(blockNums)
        blockNums = blockNums.sort(function(a,b){return a-b});
        let flag = 1;
        for(let i = 0;i<blocks.length-1;i++){
            let num1 = APG.Target.aboutTextBitMap(blocks[i]).text;
            let num2 = APG.Target.aboutTextBitMap(blocks[i+1]).text;
            num1 = parseInt(num1);
            num2 = parseInt(num2);
            if(num1 > num2){
                flag = 0;
            }
        }

        var yesColor = '#5ecd63'
        for(let i = 0;i<blocks.length;i++) {
            var info = aboutTextBitMap(blocks[i]).text;
            if(parseInt(info) == blockNums[i]){
                APG.Target.loadTextBitMap(blocks[i], info.text,yesColor);
            }else{
                break;
            }
        }

        for(let i = blocks.length-1;i>=0;i--) {
            var info = aboutTextBitMap(blocks[i]).text;
            if(parseInt(info) == blockNums[i]){
                APG.Target.loadTextBitMap(blocks[i], info.text, yesColor);
            }else{
                break;
            }
        }


        if(flag){
            APG.Assets.setAnimations(this.exports, 'light', [1]);
        }else{
            APG.Assets.setAnimations(this.exports, 'dark', [0]);
        }
    },
    checkColor: function() {
        /* 方向*/
        let dir = APG.Character.getCharacterDirection(this.player);
        /* 当前位置 */
        let site = APG.Character.getCharacterSite(this.player);
        /* 前方的块们 */
        let block = APG.Sprite.getSpriteListFromSite(site.x, site.y+dir.y, this.numBlocks);
        /* 前方的左边的块们 */
        let blockLeft = APG.Sprite.getSpriteListFromSite(site.x+dir.y, site.y+dir.y, this.numBlocks);

        var yes = 0;
        if(block.length){
            let info = APG.Target.aboutTextBitMap(block[0]);
            if(info.text && blockLeft.length){
                if(this.previousBlocks.length==0)
                {
                    let infoLeft = APG.Target.aboutTextBitMap(blockLeft[0]);
                    // console.log(this.previousBlocks)
                    this.previousBlocks = [block[0], blockLeft[0]];
                    APG.Target.loadTextBitMap(block[0], info.text, this.oneColor);
                    APG.Target.loadTextBitMap(blockLeft[0], infoLeft.text, this.twoColor);


                    if(dir.y == 1){
                        this.text3.setText(this.code[1].trim())
                        n = 1
                    }else if(dir.y == -1){
                        this.text3.setText(this.code[4].trim())
                        n = 4
                    }
                    this.setCodeLineColor(n)

                }
                yes = 1;
            }
        }
        if(yes==0){
            this.checkCode();
            if(this.previousBlocks.length){
                APG.Target.loadTextBitMap(this.previousBlocks[0], null, this.blockColor);
                APG.Target.loadTextBitMap(this.previousBlocks[1], null, this.blockColor);
                this.previousBlocks = [];
            }
        }
    },
    swapBlock: function(){
        /* 方向*/
        let dir = APG.Character.getCharacterDirection(this.player);
        /* 当前位置 */
        let site = APG.Character.getCharacterSite(this.player);
        /* 前方的块们 */
        let block = APG.Sprite.getSpriteListFromSite(site.x, site.y+dir.y, this.numBlocks);
        /* 前方的左边的块们 */
        let blockLeft = APG.Sprite.getSpriteListFromSite(site.x+dir.y, site.y+dir.y, this.numBlocks);

        if(block.length){
            let info = APG.Target.aboutTextBitMap(block[0]);
            if(info.text && blockLeft.length){
                let infoLeft = APG.Target.aboutTextBitMap(blockLeft[0]);
                // console.log(block[0][0])
                // console.log(blockLeft[0][0])
                APG.Target.loadTextBitMap(block[0], infoLeft.text,this.twoColor);
                APG.Target.loadTextBitMap(blockLeft[0], info.text, this.oneColor);

                // this.previousBlocks = [];
                this.text3.setText(this.code[2].trim())
                if(dir.y == 1){
                    n = 2
                }else if(dir.y == -1){
                    n = 5
                }
                this.setCodeLineColor(n)
            }
        }
    },
    setCodeLineColor(n){
        this.text2.forEach(function(t){t.setStyle(this.style2)})
        this.style2.fill = this.forceCodeLineColor
        this.text2[n].setStyle(this.style2)
        this.style2.fill = this.CodeColor
    },
    getBaoshi: function(player, baoshi){
        // 得到宝石
        APG.Sprite.destroySprite(baoshi);
        if(this.xinbiaoSite.length){
            var site = APG.Sprite.getCharacterSite(player);
            var x = this.xinbiaoSite[this.xinbiaoSite.length-1]['x'];
            var y = this.xinbiaoSite[this.xinbiaoSite.length-1]['y'];
            APG.methods.moveCharacter(player, x, y);
            this.dropDaolu(site);
        }
    },
    export: function(){
        var site = APG.Character.getCharacterSite(this.player);
        var sprite = APG.Sprite.getSpriteListFromSite(site.x,site.y,this.exports);
        var frame = APG.Assets.getFrame(sprite[0]);
        if(frame == 1){
            let str = "贡献者:SuCicada\n" +
                "Click to GitHub";
            APG.Game.WIN(str,function(){
                window.location.href="https://github.com/SuCicada/ResetWorld"
            });
        }
    }
}