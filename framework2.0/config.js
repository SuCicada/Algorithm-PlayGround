var globalConfig = {
    // WIDTH: 16*60,
    // HEIGHT: 9*60,
    // mode: "CANVAS",
    // scaleMode: "SHOW_ALL", //SHOW_ALL, EXACT_FIT
    DeveloperModel: 'YourGame',  // Default
    music:{
        musicKey: 'mu',
        musicUrl: 'audio/魔法少女小圆 -【Staff Roll 】(Av19711120,P1).Mp3'
    },
    background:{
        imgKey: 'bg',
        imgUrl: 'map/bg.png',
        scrollX: 100,
        scrollY: 0,
    },
    tilemap:{
        jsonFile: 'map/maza/2019-7-31 17_59_45 - 4 x 4 - TileMapJson.json'
    },
    mapImg:{
        // 这就代表就一张图
        imgKey: 'maza',
        imgUrl: 'map/maza/maza.png',
        // rows: 2,
        // columns: 1,
    },
    // sheet:{
    //     objects: 'map/maza/object.png',
    // },
    keys:[
        // "cursors", // or "UP","DOWN","RIGHT","LEFT",
        "A",
        "S",
        "SPACEBAR",
        "S",
        "D"
    ],
    sprites: [
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
            type: "object",
            imgMode: "spritesheet",
            imgKey: "objects",
            imgUrl: "map/maza/object.png",
            rows: 2,
            columns: 2,
            // tileheight: 1,
            // tilewidth: 672,
        },
        {
            type: "player",
            imgMode: "spritesheet",  // or "image", "spritesheet"
            imgKey:  'player',       // 也是人物的名字了,如果只要一个玩家
            imgUrl: 'sprites/player.png',
            rows: 1,
            columns: 4,
            // jsonFile: 'sprites/homu.json', // if imgMode is 'JSONHash'
        },
        // {
        //     type: "player",
        //     imgMode: "JSONHash",  // or "image", "spritesheet"
        //     keyName: 'homu',      // 也是人物的名字了
        //     imgUrl: 'sprites/homu.png',
        //     jsonFile: 'sprites/homu.json', // if imgMode is 'JSONHash'
        // }
    ]

};