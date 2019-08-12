console.log("GenerateMapJson.js is loaded");

function generate_tilemap_data(mapData, callback){
    map = {};
    map.height = mapData[0].length;
    map.width = mapData[0][0].length;

    var tilemap_data = {
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

    var tilFilePro = showWindow();
    var pro3 = tilFilePro.then(function(imgSize){
        console.log(imgSize)
        return setMapTilesets(tilemap_data,imgSize);
    });

    let pro1and2 = pro3.then(function(){
        var pro1 = setMapLayerData(tilemap_data, mapData);
        var pro2 = setMapObjects(tilemap_data, mapData);
        return Promise.all([pro1,pro2]);
    });


    let pro4 = pro1and2.then(function () {
        return setProperties(tilemap_data);
    });
    pro4.then(function(){
        console.log(tilemap_data)
        /* 移除加入的地图映射集  */
        let mapjs = document.getElementById('mapjs');
        document.body.removeChild(mapjs);
        /* 将生成好的地图配置传入回调函数, 进行文件导出 */
        callback(tilemap_data);
    });
}

/*=======================================*/
/*      地图配置自动装配中   */

function setMapLayerData(tilemap_data, mapData){
    /* 设置layer层
     * 将map的配置, 给 tilemap_data 中的layer 的data*/
    return new Promise(function(resolve, reject){
        var mapdata = Array.prototype.concat.apply([],mapData[0]);

        for(let i of mapdata ){
            var block = BLOCKS.Layers.TileLayer.find(function(block){
                return block.mapId.toString() == i.toString();
            });
            /* 没有砖块的地方定为0 */
            tilemap_data.layers[0].data.push(block ? block.tileId : 0);
        }

        console.log("setMapLayerData has been completed!")
        resolve();
    });
}

function setMapObjects(tilemap_data, mapData){
    /* 设置对象层 */
    return new Promise(function(resolve, reject){
        let objectData = mapData.slice(1);  /* 第二层 */
        let nowLayerId = 2;   /* 1 是地形 */
        let nowObjectId = 1;
        let nowCharacterGID = 1;
        let nowObjectGID = 1;

        // var layers = [];
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

        for(let objectLevel of objectData){
            /* 一共两层, 两次循环*/
            let objectList;
            let thislayer = JSON.parse(JSON.stringify(layer));  /* 深拷贝一份*/
            thislayer.id = nowLayerId++;
            if(thislayer.id == 2){
                thislayer.name = "Object Layer";
                objectList = BLOCKS.Layers.TargetLayer;
            }else if(thislayer.id == 3){
                thislayer.name = "Character Layer";
                objectList = BLOCKS.Layers.CharacterLayer;
            }
            // console.log(thislayer)

            /* 对每一个元素遍历 */
            var gidIndexs = {};  /* map_id -> gid*/
            for(var i in objectLevel){
                for(var j in objectLevel[i]){
                    if(objectLevel[i][j] == '.'){
                        continue;
                    }

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
                                keyName: '',
                                imgKey: '',
                            }]
                    };
                    object.id = nowObjectId++;
                    var block = objectList.find(function(block) {
                        return block && block.mapId == objectLevel[i][j];
                    });
                    if(gidIndexs[block.mapId]){
                        object.gid = gidIndexs[block.mapId];
                    }else{
                        if(thislayer.name == "Character Layer"){
                            object.gid = nowCharacterGID++;
                        }else if(thislayer.name == "Object Layer"){
                            object.gid = nowObjectGID++;
                        }
                        gidIndexs[block.mapId] = object.gid;
                    }

                    // object.properties[0].gid = block.tileId;
                    // object.properties[0].imgUrl = block.bg_img;
                    object.properties[0].keyName = block.keyName;
                    object.properties[0].imgKey = block.imgKey? block.imgKey: block.keyName;
                    object.type = block.type;   /*为了特殊类型,比如 player*/
                    object.x = tilemap_data.tilewidth * j;
                    object.y = tilemap_data.tileheight * i;

                    thislayer.objects.push(object);
                    // console.log(object)
                }
            }
            tilemap_data.layers.push(thislayer);
        }

        console.log("setMapObjects has been completed!")
        resolve();
    });
}

/* ================== 设置自定义属性 ========= */

function setProperties(tilemap_data) {
    /* 目前仅支持对象层和角色层的自定义属性 */
    return new Promise(function (resolve) {
        if(BLOCKS.Sprites){
            BLOCKS.Sprites.forEach(function (sprite) {
                if (sprite.z == 1 || sprite.z == 2) {
                    let obj = tilemap_data.layers[sprite.z].objects.find(function (obj) {
                        // console.log(obj.x,obj.y)
                        // console.log(sprite.x , sprite.y)
                        // console.log(sprite.x * tilemap_data.tilewidth , sprite.y * tilemap_data.tileheight)
                        return obj.x == sprite.x * tilemap_data.tilewidth &&
                            obj.y == sprite.y * tilemap_data.tileheight;
                    });
                    if(obj){
                        obj.properties[0] = Object.assign(obj.properties[0], sprite.properties);
                    }
                }
            });
            console.log("setProperties has been completed!")
        }else{
            console.log("Properties of BLOCKS.Sprites don't exist!")
        }
        resolve();
    });
}

function setMapTilesets(tilemap_data, tileSize) {
    /* 设置tileSet 瓷砖集, 暂定只有一个, 因为只有一张地图 */
    return new Promise(function(resolve){
        let nowgid = 1;
        let tilewidth;
        let tileheight;
        let tilsets = [];
        /*目前只有一张瓷砖地图*/
        let img = Object.assign(BLOCKS.MapImg, tileSize);

        let one = {
            columns: img.columns,
            firstgid: nowgid,
            image: img.imgUrl,  /* 需要等待游戏运行 从config.js 中读 */
            imageheight: img.height,
            imagewidth: img.width,
            margin: 0,
            name: img.imgKey,
            spacing: 0,
            tilecount:  img.rows *　img.columns,  /*先默认贴图是矩形*/
            tileheight: img.height / img.rows,
            tilewidth: img.width / img.columns,
        };
        nowgid += one.tilecount;  /* 为了多张tileset循环先留下 */
        tilewidth = one.tilewidth;
        tileheight = one.tileheight;
        tilsets.push(one);

        tilemap_data.tilesets = tilsets;
        let side = Math.min(tilewidth,tileheight);
        /* 强制变成方形 */
        tilemap_data.tilewidth = tilemap_data.tileheight = side;

        console.log("setMapTilesets has been completed!")
        resolve();
    });
}


/*=======================================*/
/*      读取 地图瓷砖素材图片文件  和 瓷砖映射表js文件  */

function showWindow(){
    //定义让模态窗口显示或隐藏的函数
    return new Promise(function(resolve){
        var overdiv = document.getElementById('over');
        if(!overdiv){
            overdiv = document.createElement('div');

            overdiv.setAttribute('id','over');
            // overdiv.style.display = 'block';
            overdiv.innerHTML = '<div id="content">\n' +
                '        <h3>选择文件</h3>\n\n' +
                '        瓷砖贴图: <input type="file" onchange="" id="tileImgFile">\n' +
                '        <br>\n' +
                '        映射表集: <input type="file" onchange="" id="blocksFile">\n' +
                '        <br>\n' +
                '        <button type="button" name="button" id="sure">确认</button>\n' +
                '        <button type="button" name="button" id="close">关闭</button>\n' +
                '    </div>';
            overdiv.style.cssText += ' width: 100%;\n' +
                '            height: 100%;\n' +
                '            position: absolute;\n';
            overdiv.style.backgroundColor = 'rgba(145,152, 159, 0.5)';

            let div = overdiv.getElementsByTagName('div')[0];
            div.style.cssText += ' width: 400px;\n' +
                '            height: 200px;\n' +
                '            margin: 0 auto;\n' +
                '            margin-top: 200px;\n' +
                '            text-align: center;\n' +
                '            padding: 1px;\n' +
                '            position: relative;\n' +
                '            border-radius: 10px;';
            div.style.backgroundColor = 'rgba(234,244,255,0.8)';

            document.body.insertBefore(overdiv, document.body.firstElementChild);
            // document.body.appendChild(overdiv);

        }

        let showOrHidden = function() {
            // 获取到模态窗口
            var over = document.querySelector('#over');
            over.style.display = over.style.display == 'none' ? 'block' : 'none';
        };
        overdiv.style.display = 'block';

        // 获取页面中关闭模态的标签
        var a = document.querySelector('#close');
        a.onclick = showOrHidden;
        // 获取over标签
        var over = document.querySelector('#over');
        over.onclick = showOrHidden;
        // 获取到content标签
        var content = document.querySelector('#content');
        // 添加点击事件函数，在函数中清除冒泡机制
        content.onclick = function (ev) {
            var e = event || ev;
            e.stopPropagation();
        };

        /* 点击确认按钮  */
        document.querySelector("#sure").onclick = function(){
            var tileImgFile = document.getElementById('tileImgFile').files[0];
            var imgSize = {};
            var pro1 = getImgInfo(tileImgFile, imgSize);

            var blocksFile = document.getElementById('blocksFile').files[0];
            var pro2 = mapConfigImport(blocksFile);
            Promise.all([pro1,pro2]).then(function () {
                showOrHidden();   /* 关闭窗口 */
                resolve(imgSize); /* 将图片大小传出 */
            })
        }
    });
}

function getImgInfo(tileImgFile, imgSize){
    /* 读取图片大小 */
    return new Promise(function(resolve){
        var fileReader = new FileReader();
        fileReader.readAsDataURL(tileImgFile);
        fileReader.onload = function(e) {
            let base64 = this.result;
            let img = new Image();
            img.src = base64;
            img.onload = function () {
                imgSize.width = img.naturalWidth;
                imgSize.height = img.naturalHeight;
                resolve(imgSize);
            }
        }
    });
}

function mapConfigImport(blocksFile) {
    /* 加载js文件, 创建script标签, id为mapjs */
    return new Promise(function(resolve){
        var reader = new FileReader();//这是核心,读取操作就是由它完成.
        reader.readAsText(blocksFile);//读取文件的内容,也可以读取文件的URL
        reader.onload = function () {
            var str = reader.result;
            var mapjs = document.createElement('script');
            mapjs.setAttribute('id','mapjs');
            mapjs.text = str;
            document.body.appendChild(mapjs);
            resolve();
        }
    });
}




