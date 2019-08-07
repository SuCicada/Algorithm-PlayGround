console.log("map.js is loaded")


var mapConfig = {
    // height: 4,
    // width: 4,
    tileheight: 25,
    tilewidth:25,

    // layers:{
    //     data: [],
    // },
    // tilesets: [
    //     {
    //         columns:1,
    //         firstgid:1,
    //         image:"maza.png",
    //         imageheight:25*2,
    //         imagewidth:25,
    //         margin:0,
    //         name:"mazatile",
    //         spacing:0,
    //         tilecount:2,
    //         tileheight:25,
    //         tilewidth:25
    //     },
    //     {
    //         columns:2,
    //         firstgid:3,
    //         image: "object.png",
    //         imageheight:25*4,
    //         imagewidth:25*4,
    //         margin:0,
    //         name: "object",
    //         spacing:0,
    //         tilecount:4,
    //         tileheight:25,
    //         tilewidth:25
    //     }
    // ],


};


var blocks = [
    {
        // id: 1,
        map_id: "E",
        bg_img: "map/maza/maza.png",
        bg_id: 1,
        type: "layer",
        rows: 2,
        columns: 1,
    },
    {
        // id: 2,
        map_id: "F",
        bg_img: "map/maza/maza.png",
        bg_id: 2,
        type: "layer",
    },


    {
        // id:3,
        map_id: "8",
        bg_img: "sprites/baoshi.png",
        type: "object",
        keyName: "baoshi",
    },
    {
        // id:4,
        map_id: "7",
        bg_img: "map/maza/object.png",
        bg_id: 4,
        type: "object",
    },
    {
        // id:5,
        map_id: "5",
        bg_img: "map/maza/object.png",
        bg_id: 3,
        keyName: "chukou",
        type: "object",

    },
    // {
    //     // id: 6,
    //     // bg_img: "map/maza/object.png",
    //     map_id: "8",
    //     bg_img: "sprites/xinbiao.png",
    //     keyName: "xinbiao",
    //     type: "object",
    // },
    {
        map_id: "A",
        type: "player"
    }
];