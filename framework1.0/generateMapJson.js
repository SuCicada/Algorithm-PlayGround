console.log("generateMapJson.js is loaded");
var mapData = [[
    ["E","E","E","E"],
    ["E","E","E","E"],
    ["E","E","E","E"],
    ["E","E","E","E"]],[

    [".",7,".",8],
    [".",".",".",7],
    [8,7,".",7],
    [7,7,".",5]],[

    ["A",".",".","."],
    [".",".",".","."],
    [".",".",".","."],
    [".",".",".","."]]];

function generate_tilemap_data(
    layername="layer"
){
    map = mapConfig;
    tilemap_data = {
        height: map.height,
        width: map.width,
        tileheight: map.tileheight,
        tilewidth: map.tilewidth,
        infinite: false,
        layers: [
            {
                id: 1,
                data: [],   // wait to fill
                height: map.height,
                width: map.width,
                name: layername,
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

    setMapLayerData(map, tilemap_data);
    setMapTilesets(tilemap_data);
    setMapObjects(tilemap_data);

    console.log(tilemap_data);
    return tilemap_data;
}
function setMapObjects(tilemap_data){
    layers = []; // for objects
    objectData = mapData.slice(1,2);
    nowLayerId = 2;
    nowObjectId = 1;
    for(objectLevel of objectData){
        var groups = {};  // 对象组, 按照不同色块的对象分类
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
            y: 0
        };
        for(var i in objectLevel){
            for(var j in objectLevel[i]){
                if(objectLevel[i][j] == '.'){
                    continue;
                }
                var object = {
                    id: '',
                    gid: '',
                    height: mapConfig.tileheight,
                    width: mapConfig.tilewidth,
                    name: "",
                    rotation: 0,
                    type: '',
                    visible: true,
                    x: '',
                    y: '',
                };
                object.id = nowObjectId++;
                object.gid = blocks.find(function(block){
// console.log(objectLevel[i][j])
//                     console.log(block)

                    return block.map_id && block.map_id.toString() == objectLevel[i][j].toString();

                }).bg_id;
                object.name = object.id.toString();  // 我真的不知道应该取什么名
                object.type = "";
                object.x = mapConfig.tilewidth * j;
                object.y = mapConfig.tileheight * i;

                if(groups[object.gid] == undefined){
                    // 这是一个新的组
                    var thislayer = JSON.parse(JSON.stringify(layer));
                    thislayer.id = nowLayerId++;
                    thislayer.name = thislayer.id.toString();
                    groups[object.gid] = thislayer;
                    layers.push(thislayer);
                }else{
                    var thislayer = groups[object.gid];
                }
                thislayer.objects.push(object);
            }
        }
        console.log(layers)
        tilemap_data.layers = tilemap_data.layers.concat(layers);
    }
}

function setMapLayerData(map, tilemap_data){
    // 将map的配置, 给 tilemap_data 中的layer 的data

    // 以下只是测试用
    var mapdata = Array.prototype.concat.apply([],mapData[0]);

    for(let i of mapdata ){

        var block = blocks.find(function(block){
            return block.map_id == i;
        });
        tilemap_data.layers[0].data.push(block.bg_id);
    }
}

function setMapTilesets(tilemap_data){
    var imgs = {};
    var promise;
    var i;
    for(var i in blocks){
        var img_url = blocks[i].bg_img;
        if(i == 0){
            promise = getImgInfo(img_url, imgs);
        }else{
            promise = promise.then(function(){
                // console.log(imgs);
                return getImgInfo(img_url, imgs);
            });
        }
        // 最后一个部分
        if(i==blocks.length-1) {
            promise.then(function () {
                // console.log(JSON.stringify(imgs))
                // console.log(Object.keys(imgs))
                setTilesets(imgs);
        console.log(tilsets);
                tilemap_data.tilesets = tilsets;
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
    tilsets = [];
    var setTilesets = function(imgs){
        console.log(imgs);
        nowgid = 1;
        for(img in imgs){
            console.log(img);
            // imgs 的键就是 图片的url, 值就是图片的大小
            var one = {
                columns: imgs[img].width / mapConfig.tilewidth,
                firstgid: nowgid,
                image: img,
                imageheight: imgs[img].height,
                imagewidth: imgs[img].width,
                margin:0,
                name: img,    // 不会取名
                spacing:0,
                tilecount: (imgs[img].width * imgs[img].height) /
                    (mapConfig.tilewidth * mapConfig.tileheight),  // 先默认贴图是矩形
                tileheight: mapConfig.tileheight,
                tilewidth: mapConfig.tilewidth
            };
            nowgid += one.tilecount;
            tilsets.push(one);
        }
    };
}

function getImgInfo(url, imgs){
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
                imgs[url] = size;
                resolve(imgs);
            }
        }
    });
    return promise;
}

