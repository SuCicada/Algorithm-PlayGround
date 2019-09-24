var BLOCKS = {  /* 请不要改变对象名*/
    MapImg:{
        imgKey: "maza",
        rows: 2,
        columns: 1,
    },
    Layers: {
        TileLayer: [{
                mapId: "0",    /*地图数据上的编号*/
                tileId: 1,     /*瓷砖贴图上的编号*/
            },{
                mapId: "1",
                tileId: 1,
            },{
                mapId: "4",
                tileId: 1,
            },],
		TargetLayer:[
            {
                mapId: "7",
                keyName: "formula",  /* 对象组唯一标识*/  /* 对象名,还是对象图片名?*/
                imgKey: "",         /* 对象贴图名,要和游戏配置文件一致, 未指定或为空则默认与 keyName 一样*/
                                    /* 不同对象组必须有不同keyName, 可以有同一个imgKey */
                type: "object",     /* 可以不写object,默认为object*/
                frameId: 0,         /* 如果是对应一个帧贴图中的一个,标记这个. 从0开始*/
            },
            {
                mapId: "8",
                keyName: "result",
            },
        ],
        CharacterLayer:[
            {
                mapId: "F",
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
