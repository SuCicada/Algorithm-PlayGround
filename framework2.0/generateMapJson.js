console.log("generateMapJson.js is loaded");
// var mapData = [[
//     ["E","E","E","E"],
//     ["E","E","E","E"],
//     ["E","E","E","E"],
//     ["E","E","E","E"]],[
//
//     [".",7,".",8],
//     [".",".",".",7],
//     [8,7,".",7],
//     [7,7,".",5]],[
//
//     ["A",".",".","."],
//     [".",".",".","."],
//     [".",".",".","."],
//     [".",".",".","."]]];

function generate_tilemap_data(
    mapData,
    giveme_tilemap_data,
    callback,
){
    // map = JSON.parse(JSON.stringify(mapConfig));
    // console.log(mapConfig)
    map = {};
    map.height = mapData[0].length;
    map.width = mapData[0][0].length;

    tilemap_data = {
        height: map.height,
        width: map.width,
        tileheight: 0, //mapConfig.tileheight,
        tilewidth: 0,  //mapConfig.tilewidth,
        infinite: false,
        layers: [
            {
                id: 1,
                data: [],   // wait to fill
                height: map.height,
                width: map.width,
                name: "layer1",
                opacity: 1,         // 不透明度
                type: "tilelayer",
                visible: true,
                x: 0,
                y: 0
            },                     // 就一层地形

        ],
        nextlayerid: 2,
        nextobjectid: 1,
        orientation: "orthogonal",  // 旋转(正常)
        renderorder: "right-down",   // 渲染方向
        tilesets: [],   // 等待填充
        type: "map",
        // version:1.2,
    };

    // tilemap_data.layers[0].data = map.layers.data;

    var pro2 = setMapTilesets(tilemap_data);
    pro2.then(function(){
        console.log(tilemap_data);

        var pro1 = setMapLayerData(mapData, tilemap_data);
        var pro3 = setMapObjects(mapData, tilemap_data);
        Promise.all([pro1,pro3]).then(function () {
            giveme_tilemap_data = tilemap_data;
            console.log(tilemap_data);
            callback();
            return tilemap_data;
        })
    })

}
function setMapObjects(mapData, tilemap_data){

    var promise = new Promise(function(resolve, reject){
        objectData = mapData.slice(1);
        nowLayerId = 2;
        nowObjectId = 1;
        nowCharacterGID = 1;
        nowObjectGID = 1;

        var layers = [];
        var layer = {
            id: '',
            draworder: "toptodown",
            name: "",   // i don't know
            objects: [],
            opacity: 1,
            type: "objectgroup",
            visible: true,
            x: 0,
            y: 0,
        };
        for(objectLevel of objectData){
            // var groups = {};  // 对象组, 按照不同色块的对象分类

            var thislayer = JSON.parse(JSON.stringify(layer));
            thislayer.id = nowLayerId++;
            if(thislayer.id == 2){
                thislayer.name = "Object Layer";
            }else if(thislayer.id == 3){
                thislayer.name = "Character Layer";
            }


            var gidIndexs = {};  /* map_id -> gid*/
            for(var i in objectLevel){
                for(var j in objectLevel[i]){
                    if(objectLevel[i][j] == '.'){
                        continue;
                    }
                    // console.log(tilemap_data);
                    // console.log(tilemap_data.tilesets);
                    var object = {
                        id: '',
                        gid: '',
                        height: tilemap_data.tileheight,
                        width: tilemap_data.tilewidth,
                        name: "",
                        rotation: 0,
                        type: '',
                        visible: true,
                        x: '',
                        y: '',
                        properties: [
                            {
                                gid: '',
                            }]
                    };
                    object.id = nowObjectId++;
                    // var block = blocks.find(function(block){
                    //     return block.map_id && block.map_id.toString() == objectLevel[i][j].toString();
                    // });
                    var block = blocks.find(function(block) {
                        return block.map_id && block.map_id == objectLevel[i][j];
                    });
                        // console.log(blocks);
                    // console.log(block);
                    if(gidIndexs[block.map_id]){
                        object.gid = gidIndexs[block.map_id];
                    }else{
                        if(block.type == 'player'){
                            object.gid = nowCharacterGID++;
                        }else if(block.type == 'object'){
                            // var tile = tilemap_data.tilesets.find(function(t){
                            //     console.log(t.image);
                            //     console.log(block.bg_img);
                            //     return t.image == block.bg_img;
                            // });

                            // object.gid = block.bg_id;
                            object.gid = nowObjectGID++;
                        }
                        gidIndexs[block.map_id] = object.gid;
                    }

                    object.properties[0].gid = block.bg_id;
                    object.properties[0].imgUrl = block.bg_img;
                    object.properties[0].keyName = block.keyName;
                        // object.name = object.id.toString();  // 我真的不知道应该取什么名
                        // object.type = "";
                    object.x = tilemap_data.tilewidth * j;
                    object.y = tilemap_data.tileheight * i;

                        // if(groups[object.gid] == undefined){
                        //     // 这是一个新的组
                        //     thislayer.id = nowLayerId++;
                        //     thislayer.name = thislayer.id.toString();
                        //     groups[object.gid] = thislayer;
                        //     layers.push(thislayer);
                        // }else{
                        //     var thislayer = groups[object.gid];
                        // }
                    thislayer.objects.push(object);
                }
            }
            // layers.push(thislayer);
            tilemap_data.layers.push(thislayer)
        }
        console.log(tilemap_data.layers)
        // tilemap_data.layers = tilemap_data.layers.concat(layers);

        resolve();
    });
    return promise;
}

function setMapLayerData(mapData, tilemap_data){
    // 将map的配置, 给 tilemap_data 中的layer 的data

    var promise = new Promise(function(resolve, reject){
        // 以下只是测试用
        var mapdata = Array.prototype.concat.apply([],mapData[0]);

        for(let i of mapdata ){
            var block = blocks.find(function(block){
                return block.map_id && block.map_id == i;
            });
            tilemap_data.layers[0].data.push(block ? block.bg_id : 0);
        }
        resolve();
    });
    return promise;
}

function setMapTilesets(tilemap_data){
    var promise = new Promise(function(resolve, reject) {
        var imgs = {};
        var promise;
        tilsets = [];
        for (var i in blocks) {
            // console.log(blocks[i].type)
            // console.log(blocks[i].type != 'layer')
            if(blocks[i].type == "layer"){
                /* 只管是地图的 */
                if(blocks[i].bg_img != undefined){
                    var img_url = blocks[i].bg_img;
                    if (i == 0) {
                        promise = getImgInfo(img_url, imgs, blocks[i]);
                    } else {
                        promise = promise.then(function () {
                            // console.log(imgs);
                            return getImgInfo(img_url, imgs, blocks[i]);
                        });
                    }
                }
            }
            // console.log(blocks[i].bg_img);
            // 最后一个部分
            if (i == blocks.length - 1) {
                promise.then(function () {
                    // console.log(JSON.stringify(imgs))
                    // console.log(Object.keys(imgs))
                    setTilesets(imgs);
                    console.log(tilsets);
                    tilemap_data.tilesets = tilsets;
                    resolve();
                });
            }
        }
        // var promises = img_urls.map(function (img_url) {
        //     return getImgInfo(img_url, imgs);
        // });
        //
        // Promise.all(promises)
        //     .then(function(imgs){
        //         console.log(imgs);
        //         setTilesets(imgs);
        //     });
        var setTilesets = function (imgs) {
            nowgid = 1;
            var tilewidth;
            var tileHeight;
            for (img in imgs) {
                // console.log(img);
                // imgs 的键就是 图片的url, 值就是图片的大小
                var one = {
                    // columns: imgs[img].width / mapConfig.tilewidth,
                    columns: imgs[img].columns,
                    firstgid: nowgid,
                    image: img,
                    imageheight: imgs[img].height,
                    imagewidth: imgs[img].width,
                    margin: 0,
                    name: img,    // 不会取名
                    spacing: 0,
                    tilecount:  imgs[img].rows *　imgs[img].columns,  /*先默认贴图是矩形*/
                    //(imgs[img].width * imgs[img].height) /
                        //(mapConfig.tilewidth * mapConfig.tileheight),
                    tileheight: imgs[img].height / imgs[img].rows,
                    tilewidth: imgs[img].width / imgs[img].columns,
                    // tileheight: mapConfig.tileheight,
                    // tilewidth: mapConfig.tilewidth
                };
                tilewidth = one.tilewidth;
                tileheight = one.tileheight;
                nowgid += one.tilecount;
                tilsets.push(one);
            }
            var side = Math.min(tilewidth,tileheight);
            // tilemap_data.tilewidth = tilewidth;
            // tilemap_data.tileheight = tileheight;
            tilemap_data.tilewidth = tilemap_data.tileheight = side;
        };
    });
    return promise;
}

    function getImgInfo(url, imgs, block){
    // https://blog.csdn.net/lck8989/article/details/80354784
    var promise = new Promise(function(resolve, reject){
        var img = new Image();
        var size = {};
        img.src = url;
        // document.body.appendChild(img);
        if(img.complete || imgs[url] != undefined){
            resolve(imgs);

        }else {
            // console.log(img.src);
            img.onload = function () {
                size.width = img.width;
                size.height = img.height;
                size.rows = block.rows;     /* 记录行列数 */
                size.columns = block.columns;
                imgs[url] = size;
                resolve(imgs);
            }
        }
    });
    return promise;
}

