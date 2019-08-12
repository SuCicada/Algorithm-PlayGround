var globalConfig = {
    WIDTH: 0,   /* 0 默认*/
    HEIGHT: 0,
    MODE: 'CANVAS',  /* 渲染模式, WEBGL AUTO*/
    ScaleMode: "SHOW_ALL",
    FullScreen: false,   /* 初始全屏, 可以使用函数修改*/
    DeveloperModel: 'YourGame',  // Default
    BagSystem: true,    /* 初始背包系统, 可以使用函数修改 */
    Keys:[
        // "cursors", // or "UP","DOWN","RIGHT","LEFT",
        /* 默认带有上下左右 */
        "D"
    ],
    BagBar: {  /* 背包系统, 不需要可以不要*/
        w: 0.2,  /* 0<=x<=1: 世界边长的比率  x>1: 像素 */
        h: 1,
    },
    MapArea: {  /* 大小会自动调整 */
        x: 0.2,   /* 0<=x<1: 世界边长的比率  x>=1: 像素 */
        y: 100,
        // width: 0.8,  /* 之后会进行自动调整*/
        // height: 0.8  /* 不需要设置*/
    },
    Assets: {
        music: {
            musicKey: 'mu',
            musicUrl: 'audio/魔法少女小圆 -【Staff Roll 】(Av19711120,P1).Mp3'
        },
        background: {
            imgKey: 'bg',
            imgUrl: 'map/bg.png',
            scrollX: 100,
            scrollY: 0,
        },
        mapImg: {
            imgKey: 'maza',
            imgUrl: 'map/maza/maza.png',
        },
        tileMap: {
            tileMapJson: 'map/maza/2019-7-31 17_59_45 - 4 x 4 - TileMapJson.json'
        },
        spritesImg: [
            {
                type: "object",
                imgMode: "spritesheet",
                imgKey: "baoshi",
                imgUrl: "sprites/baoshi.png",
                rows: 2,
                columns: 3,
            },
            {
                type: "object",
                imgMode: "spritesheet",
                imgKey: "xinbiao",
                imgUrl: "sprites/xinbiao.png",
                rows: 1,
                columns: 2,
            },
            {
                type: "object",
                imgMode: "spritesheet",
                imgKey: "chukou",
                imgUrl: "sprites/chukou.png",
                rows: 1,
                columns: 2,
            },
            {
                type: "player",
                imgMode: "spritesheet",  // or "image", "spritesheet"
                imgKey: 'player',
                imgUrl: 'sprites/player.png',
                rows: 1,
                columns: 4,
            },
        ]
    },
    README: {
        text: "拿走所有宝石,放置信标.",
        bgColor: '#615809',
        font:{
            size: 60,
            color: 'rgb(0,201,196)',
        }
    }
};