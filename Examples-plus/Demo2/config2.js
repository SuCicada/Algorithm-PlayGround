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
            musicUrl: '../assets/audio/魔法少女小圆 -【Staff Roll 】(Av19711120,P1).Mp3'
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
        virtualButton: [
            {
                // imgMode: "spritesheet",   // default
                imgKey: "tool1",
                imgUrl: "../assets/bnt/UP.png",
                rows:2,
                columns: 1,
            },
        ],
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
        text: "这是一位苦行者的轻叹：\n" +
            "时间之河长流，过往之景已逝。吾身年岁久衰，秩序之光渐熄。\n" +
            "来自远方的勇者啊，时间川流可进不可退，面向数字使用E键便可以将其与你面向的左边的数字做交换。\n" +
            "让数字排列重回从左至右从小到大的顺序吧，而且要尽可能少的重复踏入河流，因为它已不堪重负，用你的智慧让一切重回秩序吧\n",
        bgColor: '#615809',
        font:{
            size: 60,
            color: 'rgb(0,201,196)',
        }
    }

};