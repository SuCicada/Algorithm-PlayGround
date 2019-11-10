var globalConfig = {
    // mode: "CANVAS",
    // scaleMode: "SHOW_ALL", //SHOW_ALL, EXACT_FIT
    WIDTH: 0,   /* 0 默认*/
    HEIGHT: 0,
    MODE: 'CANVAS',  /* 渲染模式, WEBGL AUTO*/
    ScaleMode: "SHOW_ALL", //SHOW_ALL, EXACT_FIT
    FullScreen: false,   /* 初始全屏, 可以使用函数修改*/
    DeveloperModel: 'YourGame',  // Default
    BagSystem: true,    /* 初始背包系统, 可以使用函数修改 */
    Keys:[
        // "cursors", // or "UP","DOWN","RIGHT","LEFT",
        /* 默认带有上下左右 */
		"J",
		"K",
		// "SPACEBAR",
    ],
    BagBar: {  /* 背包系统, 不需要可以不要*/
        w: 0.2,  /* 0<=x<1: 世界边长的比率  x>=1: 像素 */
        h: 1,
    },
    MapArea: {  /* 大小会自动调整 */
        x: 0.1,   /* 0<=x<1: 世界边长的比率  x>=1: 像素 */
        y: 100,
    },
    Assets:{
        music:{
            musicKey: 'mu',
            musicUrl: '../assets/audio/魔法少女小圆 -【Staff Roll 】(Av19711120,P1).Mp3'
        },
        background:{
            imgKey: 'bg',
            imgUrl: 'bg.png',
            scrollX: -100,
            scrollY: 0,
        },
        mapImg:{
            imgKey: 'maza',
            imgUrl: 'maza.png',
        },
        tileMap:{
            tileMapJson: '9-2019-8 NaN_34_09 - 7 x 13 - TileMapJson.json'
        },
        virtualButton: [
            {
                imgKey: "tool1",
                imgUrl: "bnt/pop.png",
                rows:2,
                columns: 1,
            },
            {
                imgKey: "tool2",
                imgUrl: "bnt/push.png",
                rows:2,
                columns: 1,
            },
        ],
        spritesImg: [
            {
                type: "object",
                imgKey: "formula",
                imgMode: "textbitmap",
                // bgColor: 'rgba(143,139,40,0.43)',    /* 默认颜色,对象的属性可以来替换*/
            },{
                type: "object",
                imgKey: "result",
                imgMode: "textbitmap",
                // bgColor: 'rgba(140,114,39,0.43)',    /* 默认颜色,对象的属性可以来替换*/
            },{
                type: "player",
                imgMode: "spritesheet",
                imgKey:  'player',
                imgUrl: 'player.png',
                rows: 1,
                columns: 4,
            },
        ]
    },
    README: {
        text: "栈王在计算机内部又搞事情喽，如果谁能将人类的表达式输入到计算机的世界，他将把栈公主许配给他，并且他也可以获得计算机领域的最高称号-程序员",
        bgColor: '#618809',
        font:{
            size: 60,
            color: 'rgb(0,201,196)',
        }
    }

};