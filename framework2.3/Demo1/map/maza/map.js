var BLOCKS = {
    MapImg: {
        imgUrl: "",   /* 能够导入了,已不需要*/
        imgKey: "maza",
        rows: 2,
        columns: 1,
    },
    Layers: {
        TileLayer: [
            {
                mapId: "E",
                tileId: 1,
            },
            {
                mapId: "F",
                tileId: 2,
            },
        ],
        TargetLayer: [
            {
                mapId: "8",
                keyName: "baoshi",
                imgKey: '',
                frameId: 0,
            },
            {
                mapId: "5",
                keyName: "chukou",
            },
        ],
        CharacterLayer: [
            {
                mapId: "A",
                keyName: "player",
                imgKey:  "player",
                type: "player"
            }
        ],
    }
};