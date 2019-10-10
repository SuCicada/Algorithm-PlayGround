console.log("Methods.js has been loaded successfully.")

/* ==================== methods =====================*/
/* Assets  */
/* music */
playMusic                   = APG.Assets.playMusic
stopMusic                   = APG.Assets.stopMusic
/* 动画 */
setAnimations               = APG.Assets.setAnimations
playerMoveAnimations        = APG.Assets.playerMoveAnimations
getFrame                    = APG.Assets.getFrame

/*  Bag  */
showBagBar                  = APG.Bag.showBagBar
hiddenBagBar                = APG.Bag.hiddenBagBar
destroyBagBar               = APG.Bag.destroyBagBar
addItem                     = APG.Bag.addItem
putItem                     = APG.Bag.putItem
getItem                     = APG.Bag.getItem
dropItem                    = APG.Bag.dropItem
getItemNum                  = APG.Bag.getItemNum
setBagCapacity              = APG.Bag.setBagCapacity
getBagCapacity              = APG.Bag.getBagCapacity
getBagSize                  = APG.Bag.getBagSize
getBagFirst                 = APG.Bag.getBagFirst
goDownItems                 = APG.Bag.goDownItems
goUpItems                   = APG.Bag.goUpItems
updateBag                   = APG.Bag.updateBag

/* Character */
getCharacterSprite          = APG.Character.getCharacterSprite
getCharacterSite            = APG.Character.getCharacterSite
getCharacterDirection       = APG.Character.getCharacterDirection
getCharacterTile            = APG.Character.getCharacterTile
getCharacterSiteAll         = APG.Character.getCharacterSiteAll
setCharacterSite            = APG.Character.setCharacterSite
moveCharacter               = APG.Character.moveCharacter


/* Game*/
getGameWIDTH                = APG.Game.getGameWIDTH
getGameHEIGHT               = APG.Game.getGameHEIGHT
getGameMODE                 = APG.Game.getGameMODE
README                      = APG.Game.README
WIN                         = APG.Game.WIN
LOST                        = APG.Game.LOST
fullScreen                  = APG.Game.fullScreen
exitFullscreen              = APG.Game.exitFullscreen
restartGame                 = APG.Game.restartGame



/* Group */
setGroup                    = APG.Group.setGroup
moveGroupUpTo               = APG.Group.moveGroupUpTo
moveGroupDownTo             = APG.Group.moveGroupDownTo
getTargetGroup              = APG.Group.getTargetGroup
getCharacterGroup           = APG.Group.getCharacterGroup


/* Sprite*/
addSprite                   = APG.Sprite.addSprite
setSpriteSite               = APG.Sprite.setSpriteSite
getSpriteSite               = APG.Sprite.getSpriteSite
getSpriteList               = APG.Sprite.getSpriteList
getSpriteListFromSite       = APG.Sprite.getSpriteListFromSite
destroySprite               = APG.Sprite.destroySprite
siteDecode                  = APG.Sprite.siteDecode
siteCode                    = APG.Sprite.siteCode
setBody                     = APG.Sprite.setBody


/*Target*/
addTextBitMap               = APG.Target.addTextBitMap
aboutTextBitMap             = APG.Target.aboutTextBitMap
loadTextBitMap              = APG.Target.loadTextBitMap
loadTextBitMapBetween       = APG.Target.loadTextBitMapBetween

/* Tile */
getTileId                   = APG.Tile.getTileId
changeTile                  = APG.Tile.changeTile
getTileFromSite             = APG.Tile.getTileFromSite
removeTile                  = APG.Tile.removeTile
removeTileFromSite          = APG.Tile.removeTileFromSite


/* Update*/
stopListenKey               = APG.Update.listenKey.stopListenKey
startListenKey              = APG.Update.listenKey.startListenKey
setMoveKey                  = APG.Update.listenKey.setMoveKey
addKeyEvent                 = APG.Update.listenKey.addKeyEvent
addTouchKey                 = APG.Update.listenKey.addTouchKey
characterMoveEvent          = APG.Update.listenKey.characterMoveEvent
setCollideWorldBounds       = APG.Update.collision.setCollideWorldBounds
blockTileOverlap            = APG.Update.collision.blockTileOverlap
blockGroupOverlap           = APG.Update.collision.blockGroupOverlap
activeGroupOverlap          = APG.Update.collision.activeGroupOverlap
activeTileOverlap           = APG.Update.collision.activeTileOverlap
isCollided                  = APG.Update.collision.isCollided
