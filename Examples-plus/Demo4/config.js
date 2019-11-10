var globalConfig = {
    WIDTH: 0,
    HEIGHT: 0,              /* 世界的宽高度，为0默认屏幕大小*/
    MODE: 'CANVAS',         /* 渲染模式，默认CANVAS，*/
    ScaleMode: "SHOW_ALL",  /* 画面拉伸模式，此为默认*/
    FullScreen: false,      /* 初始全屏, 可以使用函数修改*/
    DeveloperModel: 'YourGame',  /* 游戏脚本的对象名*/
    BagSystem: true,        /* 开启背包系统, 可以使用函数修改 */
    Keys:[
        'E'
    ],             /* 游戏中需要用到的按键 */
    BagBar: {
        w: 0.2,
        h: 1,
    },          /* 背包系统的侧边栏*/
    MapArea: {
        x: 0.2,
        y: 40,
    },         /* 地图区域*/
    Assets: {
        music: {
            musicKey: 'mu',
            musicUrl: '../assets/audio/魔法少女小圆 -【Staff Roll 】(Av19711120,P1).Mp3'
        },
        background: {
            imgKey: "bg",
            imgUrl: "bg.png",
            scrollX: 100,
            scrollY: 0,
        },
        mapImg: {
            imgKey: "maza",
            imgUrl: "maza.png",
        },
        tileMap: {
            tileMapJson: "2019-10-10 12_47_42 - 4 x 4 - TileMapJson.json"
        },
        virtualButton: [
            {
                // imgMode: "spritesheet",   // default
                imgKey: "tool1",
                imgUrl: "bnt/take.png",
                rows:2,
                columns: 1,
            },
            {
                imgKey: "tool2",
                imgUrl: "bnt/put.png",
                rows:2,
                columns: 1,
            },
        ],
        spritesImg: [
            {
                type: 'object',
                imgKey: 'numBlock',
                imgMode: 'textbitmap',
                bgColor: "#cabe2b"
            },
            {
                type: "player",
                imgMode: "spritesheet",
                imgKey: "player",
                imgUrl: "player.png",
                rows: 1,
                columns: 4
            },
            {
                type: "key",
                imgMode: "texture",
                imgKey: 'tool',
                texture:'',
                size: '',
            }
        ]
    },          /* 游戏资源*/
    README: {
        text: "交换两个数字,使用e键拿取放下",
        bgColor: "#d3c757",
        font:{
            color: "#111111"
        }
    },          /* 游戏开始前言*/
};
