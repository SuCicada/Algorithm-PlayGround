var globalConfig = {
    WIDTH: 0,   /* 0 默认*/
    HEIGHT: 0,
    MODE: 'CANVAS',  /* 渲染模式, WEBGL AUTO*/
    ScaleMode: "SHOW_ALL", //SHOW_ALL, EXACT_FIT
    FullScreen: false,   /* 初始全屏, 可以使用函数修改*/
    DeveloperModel: 'YourGame',  // Default
    BagSystem: false,    /* 初始背包系统, 可以使用函数修改 */
    Keys:[
        // "cursors", // or "UP","DOWN","RIGHT","LEFT",
        /* 默认带有上下左右 */
        "E",
        "W",
        "S",
    ],
    BagBar: {  /* 背包系统, 不需要可以不要*/
        w: 0.2,  /* 0<=x<1: 世界边长的比率  x>=1: 像素 */
        h: 1,
    },
    MapArea: {  /* 大小会自动调整 */
        x: 0.1,   /* 0<=x<1: 世界边长的比率  x>=1: 像素 */
        y: 100,
        // width: 0.8,  /* 之后会再次进行自动调整*/
        // height: 0.8
    },
    Assets:{
        music:{
            musicKey: 'mu',
            musicUrl: 'audio/魔法少女小圆 -【Staff Roll 】(Av19711120,P1).Mp3'
        },
        background:{
            imgKey: 'bg',
            imgUrl: 'map/bg.png',
            scrollX: -100,
            scrollY: 0,
        },
        mapImg:{
            imgKey: 'maza',
            imgUrl: 'map/maza.png',
        },
        tileMap:{
            tileMapJson: 'map/2019-8-2 18_00_10 - 6 x 11 - TileMapJson.json'
        },
        spritesImg: [
            {
                imgKey: "chukou",
                imgMode: "spritesheet",
                imgUrl: "sprites/chukou.png",
                rows: 1,
                columns: 2,
                type: "object",
            },{
                type: "object",
                imgKey: "numBlock",
                imgMode: "textbitmap",
                bgColor: 'rgba(143,139,40,0.43)',    /* 默认颜色,对象的属性可以来替换*/
            },{
                type: "player",
                imgMode: "spritesheet",
                imgKey:  'player',
                imgUrl: 'sprites/player.png',
                rows: 1,
                columns: 4,
            },
        ]
    },
    README: {
        text: "一位苦行者的讯息\n" +
            "时间之河之流,\n" +
            "过往之景之逝,\n" +
            "吾身年岁之衰,\n" +
            "救赎之光何有?",
        bgColor: '#615809',
        font:{
            size: 60,
            color: 'rgb(0,201,196)',
        }
    }

};