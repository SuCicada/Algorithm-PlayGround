var globalConfig = {
    // WIDTH: 16*60,
    // HEIGHT: 9*60,
    // mode: "CANVAS",
    // scaleMode: "SHOW_ALL", //SHOW_ALL, EXACT_FIT
    DeveloperModel: 'YourGame',  // Default
    tilemap:{
        jsonFile: 'map/maza/2019-7-20 10_37_35 - 4 x 4 - TileMap.json'
    },
    mapImg:{
        // 这就代表就一张图
        keyName: 'maza',
        imgUrl: 'map/maza/maza.png',
    },
    sheet:{
        objects: 'map/maza/object.png',
    },
    keys:[
        // "cursors", // or "UP","DOWN","RIGHT","LEFT",
        "A",
        "S",
        "SPACEBAR",
        "S",
        "D"
    ],
    characters: [
        {
            type: "player",
            imgMode: "JSONHash",  // or "image", "spritesheet"
            keyName: 'homu',
            imgUrl: 'sprites/homu.png',
            jsonFile: 'sprites/homu.json', // if imgMode is 'JSONHash'
        }
    ]

};