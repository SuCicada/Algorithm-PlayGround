var BLOCKS = {  /* 请不要改变对象名*/
    MapImg:{
        imgUrl: "",   /* 能够导入了,已不需要*/
        imgKey: "maza",
        rows: 2,
        columns: 2,
    },
    Layers: {
        TileLayer: [{
                mapId: "C",    /*地图数据上的编号*/
                tileId: 2,     /*瓷砖贴图上的编号*/
            },{
                mapId: "D",
                tileId: 4,
            },{
                mapId: "E",
                tileId: 1,
            },{
                mapId: "F",
                tileId: 3,
            },],
        TargetLayer:[
            {
                mapId: "3",
                keyName: "chukou",  /* 对象组唯一标识*/  /* 对象名,还是对象图片名?*/
                imgKey: "",         /* 对象贴图名,要和游戏配置文件一致, 未指定或为空则默认与 keyName 一样*/
                                    /* 不同对象组必须有不同keyName, 可以有同一个imgKey */
                type: "object",     /* 可以不写object,默认为object*/
                frameId: 0,         /* 如果是对应一个帧贴图中的一个,标记这个. 从0开始*/
            },
            {
                mapId: "1",
                keyName: "numBlock",
            },
        ],
        CharacterLayer:[
            {
                mapId: "0",
                keyName: "player",
                imgKey:  "player",   /* 规则同上 */
                type: "player",   /* 指定特殊类型
                               若不指定玩家,则默认第一个对象为玩家*/
            }
        ],
    },
    /* 提供添加瓷砖和对象自定义属性的功能*/
    Sprites: [{
        x: 2,
        y: 2,
        z: 1,  /* 从0开始*/
        properties:
            {
                bgColor: 'rgba(169,111,42,0.39)',
                text: '9',
            },
        },
    ]
};
