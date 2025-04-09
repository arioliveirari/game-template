import { BuildingSpriteBox } from "../Assets/buildingSpriteBox";
import { CoffeMinigameSpriteBox } from "../Assets/coffeMinigameSpriteBox";
import { BusIsoSpriteBox } from "../Assets/busIsoSpriteBox";
import { CubeIsoSpriteBox } from "../Assets/cubeIsoSpriteBox";
import { findObjectIsoSpriteBox } from "../Assets/findObjectIsoSpriteBox";
import { NPCisoSpriteBox } from "../Assets/NpcIsoSpriteBox";
import { PinIsoSpriteBox } from "../Assets/pinIsoSpriteBox";
import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import { TraderIsoSpriteBox } from "../Assets/traderIsoSpriteBox";
import { TrafficLightIsoSpriteBox } from "../Assets/trafficLightIsoSpriteBox";
import { TraderCoffeIsoSpriteBox } from "../Assets/traderCoffeIsoSpriteBox";
import MapManager from "../mapManager";
import RPG from "../rpg";
import { ConfObjectType } from "../types";
import { coffeMinigameDonutSpriteBox } from "../Assets/coffeMinigameDonutSpriteBox";

export default class TileCreator {

    scene: RPG;

    constructor(scene: RPG) {
        this.scene = scene;
    }

    createColumnaTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "STONE";

        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createSemiBloque(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "STONE";

        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createTreeTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "tree",
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        tileObj.self.setAlpha(0.9);
        // tileObj.self.setTint(0x000000);
        tileObj.self.setOrigin(0.42 + 0.03, 0.8 + 0.03);
        // tileObj.self.setAngle(100);
        tileObj.self.setScale(1.8);
        // const tree = this.scene.add.sprite(0, 0, "tree");
        // tree.setOrigin(0.42, 0.75);
        // tileObj.customDepth = tileObj.self.depth + this.scene.distanceBetweenFloors;
        // tileObj.container.add(tree);
        pos++;
        tileObj.type = "TREE";

        this.scene.forest.push(tileObj);
    }

    createBloqueTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        objectKey: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            objectKey.toLowerCase(),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "STONE";

        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createOceanTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        objectKey: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            objectKey,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "OCEAN";
        tileObj.self.setPosition(tileObj.self.x, tileObj.self.y + 25);
        // this.scene.tweens.add({
        //     targets: tileObj.self,
        //     y: '-=35',
        //     duration: 2000,
        //     delay: 100*(c-60) - 100*(b-60),
        //     ease: "Sine.easeInOut",
        //     repeat: -1,
        //     yoyo: true,
        //   })

        // if (this.scene.stateGlobal.oceanAnimOn){

        // skip the first line
        if (c === 60) return;
        if(true){
            // this.scene.tweens.add({
            //     targets: tileObj.self,
            //     y: '-=35',
            //     duration: 1500 * Math.random() + 500,
            //     ease: "Sine.easeInOut",
            //     repeat: -1,
            //     yoyo: true,
            // })
             this.scene.tweens.add({
                targets: tileObj.self,
                y: '-=35',
                delay: 500*(c-60) - 100*(b-60),
                duration: 1500 + 500,
                ease: "Sine.easeInOut",
                repeat: -1,
                // hold: 500,
                loopDelay: 500,
                yoyo: true,
            })
        }
        // this.scene.tweens.add({
        //     targets: tileObj.self,
        //     y: '-=35',
        //     duration: 1500 * Math.random() + 500,
        //     ease:  'Back.easeOut',
        //     repeat: -1,
        //     yoyo: true,
        // })
        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createPinTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new PinIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );

        const npc = new NPCisoSpriteBox(
            game,
            x,
            y,
            height - 125,
            "playerIdle",
            0,
            this.scene.isoGroup,
            matrixPosition,
        );


    }


    createTraderTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new TraderIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            "iconPhysicalMoney",
            this.scene.isoGroup,
            matrixPosition
        );


    }

    
    createTraderCoffeTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new TraderCoffeIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            "coffePin",
            this.scene.isoGroup,
            matrixPosition
        );


    }

    createBusTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new BusIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            "busPin",
            this.scene.isoGroup,
            matrixPosition
        );


    }
    // componente solo para minigames
    createCubeTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new CubeIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition,
            undefined,
            this.scene.distanceBetweenFloors
        );
        
        if (this.scene.stateGlobal.wizzardModule.getState().isActive) {
            this.scene.player?.wizzard?.sprite?.startFollow(tileObj)
        }
        return tileObj;
    }

    createChickenTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string,
        isEndpoint: boolean = false
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new findObjectIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition,
            undefined,
            this.scene.distanceBetweenFloors,
            isEndpoint
        );

        if (this.scene.stateGlobal.wizzardModule.getState().isActive) {
            this.scene.player?.wizzard?.sprite?.startFollow(tileObj)
        }
    }

    createEndpointTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string,
        isEndpoint: boolean = false
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new CubeIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition,
            undefined,
            this.scene.distanceBetweenFloors,
            isEndpoint
        );
    }

    createBuilding(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new BuildingSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
    }

    createTrafficLightTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new TrafficLightIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );

        if(tile === "newCoffeRefrigerator") {
            tileObj.self.setOrigin(0.7)
        }else if (tile === "newPicnicTable") {
            tileObj.self.setOrigin(0.9)
        }

        return tileObj;
    }

    destroyTile(tileObj: RpgIsoSpriteBox) {
        return () => {
            // destroy all tiles in the highlightedTiles array
            if (tileObj.highlightedTiles === undefined) return;
            tileObj.highlightedTiles.forEach((tile: RpgIsoSpriteBox) => {
                if (tile.tileX === tileObj.tileX && tile.tileY === tileObj.tileY)
                    return;
                // @ts-ignore
                tile.destroy();
            });
            // @ts-ignore
            tileObj.destroy();
        };
    }

    highlightTile(tileObj: RpgIsoSpriteBox, tintTexture: number = 0xff0000) {
        // look the position of this tile in the map matrix
        return () => {
            if (tileObj.floor === undefined) return;
            // iterate isoGroup grab all tiles from the same floor

            const floorTiles = this.scene.isoGroup?.children.entries.filter((t) => {
                const tile = t as unknown as RpgIsoSpriteBox;
                return tile.floor === tileObj.floor;
            });
            tileObj.highlightedTiles = [];
            if (floorTiles) {
                floorTiles.forEach((t) => {
                    const tile = t as unknown as RpgIsoSpriteBox;
                    // detect those tiles that are next the position of the main tile
                    if (tileObj.tileX && tileObj.tileY) {
                        if (
                            (tile.tileX === tileObj.tileX - 1 &&
                                tile.tileY === tileObj.tileY) ||
                            (tile.tileX === tileObj.tileX + 1 &&
                                tile.tileY === tileObj.tileY) ||
                            (tile.tileY === tileObj.tileY - 1 &&
                                tile.tileX === tileObj.tileX) ||
                            (tile.tileY === tileObj.tileY + 1 &&
                                tile.tileX === tileObj.tileX) ||
                            (tile.tileX === tileObj.tileX && tile.tileY === tileObj.tileY)
                        ) {
                            if (tileObj.highlightedTiles) tileObj.highlightedTiles.push(tile);
                            tile.self.setTint(tintTexture);
                        }
                    }
                });
            }
            // tileObj.self.setTint(0xff0000);
        };
    }

    noHighlightTile(tileObj: RpgIsoSpriteBox) {
        return () => {
            if (this.scene.player) this.scene.player.clearPossibleMovements();
            tileObj.highlightedTiles = [];
            // clean tint from all tiles
            // @ts-ignore
            this.scene.isoGroup?.children.each((t: RpgIsoSpriteBox) => {
                if (t.type == "STONE") t.self.clearTint();
            });
        };
    }
    createBikeForCity(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        texture: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            texture,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "BIKE";
        tileObj.self.setScale(1.07);
        //if height is 75 tint tile
        tileObj.tileX = b;
        tileObj.tileY = c;
        tileObj.self.on("pointerover", this.highlightTile(tileObj));
        tileObj.self.on("pointerout", this.noHighlightTile(tileObj));
        //tileObj.self.on("pointerdown", this.destroyTile(tileObj)); //TODO: COMENTADO DE MOMENTO

        // log the position of tile every 10 tiles
        return tileObj;
    }
    createBloqueBuildingTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        texture: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            texture,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "STONE";
        tileObj.self.setScale(1.07);
        //if height is 75 tint tile
        tileObj.tileX = b;
        tileObj.tileY = c;
        tileObj.self.on("pointerover", this.highlightTile(tileObj));
        tileObj.self.on("pointerout", this.noHighlightTile(tileObj));
        //tileObj.self.on("pointerdown", this.destroyTile(tileObj)); //TODO: COMENTADO DE MOMENTO

        // log the position of tile every 10 tiles
        return tileObj;
    }

    createBloqueRandomTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        indexMap: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "STONE";

        //if height is 75 tint tile
        tileObj.floor = indexMap;
        tileObj.tileX = b;
        tileObj.tileY = c;
        tileObj.self.on("pointerover", this.highlightTile(tileObj));
        tileObj.self.on("pointerout", this.noHighlightTile(tileObj));
        tileObj.self.on("pointerdown", this.destroyTile(tileObj));

        // log the position of tile every 10 tiles
    }
    createBeachBlockTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;

        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "block2", //"bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "GRASS";
        // tileObj.self.setTint(0x0000ff);
        return tileObj
    }

    createBlockTile(
        b: number,
        c: number,
        t: string,
        that: MapManager,
        conf: ConfObjectType,
        pos: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;

        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            t, //"bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "GRASS";
        // tileObj.self.setTint(0x0000ff);
    }

    createGrassTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;

        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "grassTEST", //"bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "GRASS";
        // tileObj.self.setTint(0x0000ff);
    }

    createStreetTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        texture: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;

        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            texture, //"bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "GRASS";
        // tileObj.self.setTint(0x222222);
    }

    // MINI GAME DONUT
    createCoffeDonutMiniGame(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new coffeMinigameDonutSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            tile,
            this.scene.isoGroup,
            matrixPosition
        );

        tileObj.self.setOrigin(0.68)
        window.test = tileObj
        // tileObj.objectPin?.self.setOrigin(0.35)

        return tileObj;

      }
    // MINI GAME COFFE
    createCoffeMinigame(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new CoffeMinigameSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            tile,
            this.scene.isoGroup,
            matrixPosition
        );

        tileObj.self.setOrigin(0.4)
        tileObj.objectPin?.self.setOrigin(0.6)

        return tileObj;

      }
}