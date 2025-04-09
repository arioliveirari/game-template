import { generateBuildings, createBase, createSideWalk, createStreets, createGrass, addItems, createMinigame, configMinigamePushFind } from "./mapCreationFunctions";
import { ObjetsConfig } from "./mapTypes";
import RPG from "../rpg";
import EventsCenter from "../services/EventsCenter";
import { missionsType, modalType } from "../Assets/Modals/ModalTypes";
import ConfigMinigames from '../MockData/ConfigMinigames.json'
import ConfigMinigamesPushFind from '../MockData/minigamesPushFind.json'
import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";

export default class Entrepreneurship {
  scene: RPG;
  map: any[];
  size: number = 47;
  minigameMap: any;
  eventCenter = EventsCenter.getInstance();
  frontContainer?: Phaser.GameObjects.Container;
  borderBlocks: [number, number][] = [];
  constructor(scene: RPG) {
    this.scene = scene;
    // const randomYPin = [11, 16, 26, 31, 5, 5, 5, 5]
    // const randomXPin = [5, 5, 5, 5, 18, 23, 28, 33]
    // const randomHPin = [11, 6, 11, 6, 11, 6, 6, 11]
    const randomXPin = [4, 3, 5, 6, 7]
    const randomYPin = [19, 19, 19, 19, 19]
    const randomHPin = [1, 1, 1, 1, 1]

    const objects: ObjetsConfig[] = [
      {
        x: 7,
        y: 5,
        h: 3,
        type: "305",
      },
      {
        x: 5,
        y: 23,
        h: 0,
        type: "304",
      },
      {
        x: 3,
        y: 23,
        h: 0,
        type: "304",
      },
      {
        x: 14,
        y: 27,
        h: 0,
        type: "303",
      },
      {
        x: 14,
        y: 32,
        h: 0,
        type: "303",
      },
      {
        x: 8,
        y: 27,
        h: 0,
        type: "303",
      },
      {
        x: 8,
        y: 32,
        h: 0,
        type: "303",
      },
      // PLANTAS
      {
        x: 8,
        y: 35,
        h: 0,
        type: "300",
      },
      {
        x: 3,
        y: 18,
        h: 0,
        type: "300",
      },
      {
        x: 10,
        y: 18,
        h: 0,
        type: "300",
      },
      {
        x: 14,
        y: 34,
        h: 0,
        type: "300",
      },
      // BARRA CAFE y REFRIGERADOR
      {
        x: 3,
        y: 29,
        h: 0,
        type: "301",
      },
      {
        x: 1,
        y: 34,
        h: 0,
        type: "306",
      },
      {
        x: 1,
        y: 32,
        h: 0,
        type: "306",
      },
      // TACHOS BASURA
      {
        x: 14,
        y: 18,
        h: 0,
        type: "302",
      },
      {
        x: 5,
        y: 18,
        h: 0,
        type: "302",
      },
      // MINIGAME
      {
        x: 2,
        y: 29,
        h: 50,
        type: "333",
      },
      // {
      //   x: 14,
      //   y: 27,
      //   h: 0,
      //   type: "302",
      // }
      // PINS
    ];

    //add a buspost
    objects.push({
      x: 32,
      y: 30,
      h: 50,
      type: "14",
    });

    for (let j = 18; j < 24; j++) {
      // if (j === 15 && i <= 23 && i >= 18) {
      objects.push(
        {
          x: 15,
          y: j,
          h: 0,
          // type: "9",
          type: "1000",
        },
      )
      // builded[j][i] = 137
      // }
    }

    const createPins = () => {
      for (let i = 0; i < randomYPin.length; i++) {
        // const randomNumber = Math.random()
        const randomNumber = 0
        if (randomNumber < 0.5) {
          objects.push(
            {
              x: randomXPin[i],
              y: randomYPin[i],
              h: randomHPin[i] * 50 + 100,
              type: "15",
            },
          )
        }
      }
      if (objects.length === 4) createPins()
    }

    createPins()

    // Forest

    const streetConfig = {
      streetWidth: 3,
      streetHeight: 3,
      xPos: [33],
      yPos: [42],
    };
    

    const sideWalkConfig = {
      xPos: [],
      yPos: [41, 45],
    };

    const buildings2Build: any = []



    let buildings = generateBuildings(this.size, buildings2Build);

    const baseNumber = 159;
    const blockedBaseNumber = 112;

    const overrideCustom = (map: number[][], withParser: boolean = false) => {
      let _mp = [...map];
      const replaced0: any = []


      const removeFromTo = (from: [number, number], to: [number, number]) => {
        for (let i = from[0]; i < to[0]; i++) {
          for (let j = from[1]; j < to[1]; j++) {
            replaced0.push([i, j]);
          }
        }
      }

      // removeFromTo([12, 0], [40, 8])
      // removeFromTo([30, 0], [40, 30])
      // removeFromTo([0, 36], [30, 40])
      removeFromTo([0, 13], [16, 18])
      removeFromTo([15, 24], [21, 40])
      // removeFromTo([0, 0], [1, 40])
      // removeFromTo([0, 0], [40, 1])
      // removeFromTo([39, 0], [40, 40])
      // removeFromTo([0, 39], [40, 40])
      // removeFromTo([7, 0], [40, 5])

      for (let i = 0; i < replaced0.length; i++) {
        const [x, y] = replaced0[i];
        _mp[x][y] = 0;
      }
      // iterate the matrix and get all the items with an 0 near

      const result: [number, number][] = []

      for (let i = 0; i < _mp.length; i++) {
        for (let j = 0; j < _mp[i].length; j++) {
          if (_mp[i][j] === 0) {
            const isNear = (_x: number, _y: number) => {
              return _mp[_x] && _mp[_x][_y] && _mp[_x][_y] !== 0
            }
            if (isNear(i + 1, j) || isNear(i - 1, j) || isNear(i, j + 1) || isNear(i, j - 1)) {
              result.push([i, j])
            }
          }
        }
      }

      for (let i = 0; i < result.length; i++) {
        const [x, y] = result[i];
        _mp[x][y] = 33;
      }

      this.borderBlocks = result

      const buildings2Build: any = []

      // using this.borderBlocks, generate some kind of wall with h 4  and add the bulding format into the buildings2Build array

      const windowCreator = (i: number, x: number, y: number) => {
        return [
          [
            [100]
          ],
          [
            [100]
          ],
          [
            [100]
          ],
          [
            [100]
          ]
        ]
      }

      for (let i = 0; i < this.borderBlocks.length; i++) {
        const [x, y] = this.borderBlocks[i];
        if (_mp[x][y] === 33) {
          buildings2Build.push({
            x: x,
            y: y,
            w: 1,
            z: 1,
            h: 4,
            type: "100",
            replace: windowCreator(i, x, y)
          })
          _mp[x][y] = 100
        }

      } 



      buildings = generateBuildings(this.size, buildings2Build);

      const builded = _mp;

      for (let j = 0; j < builded.length; j++) {
        for (let i = 0; i < builded[j].length; i++) {
          const number = builded[j][i];
          if (number === baseNumber) {
            if (i <= 15 && j <= 15) builded[j][i] = 113
            if (i < 25 && j > 15) builded[j][i] = 114
            if (i >= 24 && j >= 18) builded[j][i] = 112
          }
          if (i > 39 && i <42 && j <= 30) builded[j][i] = 1
          if ((j == 31 || j == 32) && i < 42 ) builded[j][i] = 1
          if (i > 44 && j < 42) builded[j][i] = 1
          if (j >= 36 && i < 42) builded[j][i] = 1
          if (j > 37) builded[j][i] = 100
          if (i < 8 && j > 15) builded[j][i] = 100
        }
      }

      return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");

    }

    let distanceBetweenFloors = 50;
    this.map = [
      {
        nivel: "city",
        player: "pepito",
        musica: "bkg-uno.mp3",
        ballTexture: "123",
        gravity: 9.8,
        distanceBetweenFloors: distanceBetweenFloors,
        tiles: {

          "300": "COFFE-PLANTA-1",
          "298": "COFFE-PLANTA-2",
          "299": "COFFE-PLANTA-3",
          "297": "COFFE-PLANTA-4",
          "301": "COFFE-BAR",
          "302": "COFFE-BASURA",
          "303": "COFFE-PICNICTABLE",
          "304": "COFFE-METEGOL",
          "305": "COFFE-SHELVES",
          "306": "COFFE-REFRIGERATOR",
          "333": "COFFE-MINIGAME",
          "1": "GRASS",
          "1111": "BEACHBLOCK",
          "1112": "BEACHWINDOW1",
          "1113": "BEACHWINDOW2",
          "1114": "BEACHWINDOW3",
          "10": "STREET-A",
          "11": "STREET-B",
          "12": "STREET-C",
          "111": "STREET-E",
          "112": "BLOCKED-SPACE",
          "113": "BLOCKED-SPACEB",
          "114": "BLOCKED-SPACEC",
          "133": "SIDEWALK",
          "134": "SIDEWALK2",
          "100": "BUILDINGBLOCKEMPTY",
          "1000": "BLOCKWAY",
          "101": "BUILDINGBLOCK",
          "135": "STREET-DOBLE-1",
          "136": "STREET-DOBLE-2",
          "137": "STREET-CROSS-1",
          "138": "STREET-CROSS-2",
          "3": "BLOQUE-1",
          "4": "BLOQUERANDOM",
          "5": "COLUMNALARGA",
          "6": "COLUMNACORTA",
          "7": "SEMIBLOQUE",
          "8": "TREE",
          "9": "CUBE",
          "109": "CHICKEN",
          "110": "CAT",

          "13": "ENDPOINT",
          "14": "BUS",
          "15": "PIN",
          "16": "TRAFFIC-LIGHT-A",
          "17": "TRAFFIC-LIGHT-B",
          "18": "BUILDINGBLOCK",
          "20": "BUILDINGWINDOW1",
          "21": "BUILDINGWINDOW2",
          "22": "BUILDINGWINDOW3",
          "23": "BUILDINGWINDOWB1",
          "24": "BUILDINGWINDOWB2",
          "25": "BUILDINGWINDOWB3",
          "26": "BUILDINGDOORLEFTCORNER",
          "27": "BUILDINGDOORRIGHTCORNER",
          "28": "BUILDINGDOORLEFT",
          "29": "BUILDINGDOORRIGHT",
          "31": "BUILDINGTOP1",
          "32": "BUILDINGTOP2",
          "33": "BUILDINGTOP3",
          "34": "BUILDINGTOP4",
          "35": "BUILDINGTOP5",
          "41": "BUILDINGTOP1B",
          "42": "BUILDINGTOP2B",
          "43": "BUILDINGTOP3B",
          "44": "BUILDINGTOP4B",
          "45": "BUILDINGTOP5B",
          "46": "BUILDINGBLOCK2",
          "47": "BUILDINGWINDOWB12",
          "48": "BUILDINGDOORLEFT2",
          "49": "BUILDINGDOORRIGHT2",
          "50": "BUILDINGDOORLEFT3",
          "51": "BUILDINGDOORRIGHT3",
          "52": "BUILDINGWINDOW11",
          "53": "BUILDINGWINDOW12",
          "54": "BUILDINGWINDOW13",
          "55": "BUILDINGWINDOWB11",
          "56": "BUILDINGWINDOWB12",
          "57": "BUILDINGWINDOWB13",
          "58": "BUILDINGBRICK1",
          "59": "BUILDINGBRICK2",
          "159": "BUILDINGBRICK2SOLID",
          "60": "BUILDINGGLASS1",
          "61": "BUILDINGGLASS2",
          "62": "BUILDINGGLASS3",
          PN: "PLAYER-N",
          PS: "PLAYER-S",
          PE: "PLAYER-E",
          PW: "PLAYER-W",
          "DESKT1": "DESKT1",
          "DESKT2": "DESKT2",
        },
      },

      // MAP PLAYER / ITEMS CONFIG
      [createBase(this.size, [11, 28])],
      overrideCustom(createSideWalk(createStreets(createGrass(this.size, false, buildings2Build, baseNumber), streetConfig, false) as number[][], sideWalkConfig, false) as number[][], true),
      ...buildings.map((_buildings, index) => {
        const items = objects.filter(
          (item) => item.h === index * distanceBetweenFloors
        );
        if (items.length) {
          let newBuildings = addItems(_buildings, items);
          return newBuildings.map((row) => row.join(" ")).join("\n");
        } else {
          return _buildings.map((row) => row.join(" ")).join("\n");
        }
      }),
    ];
  }

  unLockLand() {
    if (this.scene.stateGlobal.businessModule.getState().hasLand) return
    this.scene.isoGroup?.children.getArray().forEach((child) => {
      const childIso = child as unknown as RpgIsoSpriteBox;
      if (childIso.self.type === "TO_BUY") {
        childIso.self.setAlpha(1).clearTint().setTexture("brick2")
      } else if ( childIso.self.type === "BLOCK_WAY") {
        childIso.self.destroy()
      }
    })
    const configToDraw: configMinigamePushFind[] = [
      {
        id: 9999,
        items: [
   
          {
            matrixRow: 19,
            matrixCol: 20,
            objectNumber: 303,
          },
          {
            matrixRow: 19,
            matrixCol: 25,
            objectNumber: 303,
          },
          {
            matrixRow: 13,
            matrixCol: 20,
            objectNumber: 303,
          },
          {
            matrixRow: 13,
            matrixCol: 25,
            objectNumber: 303,
          },
          // PLANTAS
          {
            matrixRow: 13,
            matrixCol: 28,
            objectNumber: 300,
          },
          {
            matrixRow: 19,
            matrixCol: 27,
            objectNumber: 300,
          },
        
          // TACHOS BASURA
          {
            matrixRow: 9,
            matrixCol: 21,
            objectNumber: 302,
          },
        ]
      }
    ]
    this.map.push(createMinigame(this.size, configToDraw))
    this.scene.mapBlueprint = this.map.map((m) =>
      typeof m === "string" ? m : JSON.stringify(m)
    );
    this.scene.spawnTiles(this.scene.mapBlueprint?.length - 1, 1);
    //@ts-ignore
    this.scene.UICamera?.ignore(this.scene.isoGroup);
  }

  addMapFunctionalities() {

    if (this.scene.player) {
      this.scene.player.self.setScale(0.7);
    }
    const firstPos = this.scene.isoGroup?.children.entries[0] as unknown as RpgIsoSpriteBox;
    this.frontContainer = this.scene.add.container(firstPos.self.x, firstPos.self.y).setDepth(999999)
    let candado1 = this.scene.add.image(0, 220, "iconLock").setOrigin(0.5).setScale(0.8).setAlpha(0.75).setInteractive().setVisible(false);
    candado1.on("pointerdown", () => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.OPEN_MODAL,
        { modalType: modalType.BUYROOMCOFFE, lock: candado1 }
      );
    });
    candado1.on("pointerover", () => {
      candado1.setAlpha(1)
    });
    candado1.on("pointerout", () => {
      candado1.setAlpha(0.75)
    });
    let candado2 = this.scene.add.image(-340, 820, "iconLock").setOrigin(0.5).setScale(0.8).setAlpha(0.75).setInteractive();
    candado2.on("pointerdown", () => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.OPEN_MODAL,
        { modalType: modalType.BUYROOMCOFFE, lock: candado2 }
      );
    });
    candado2.on("pointerover", () => {
      candado2.setAlpha(1)
    });
    candado2.on("pointerout", () => {
      candado2.setAlpha(0.75)
    });
    let candado3 = this.scene.add.image(160, 1220, "iconLock").setOrigin(0.5).setScale(0.8).setAlpha(0.75).setInteractive().setVisible(false);
    candado3.on("pointerdown", () => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.OPEN_MODAL,
        { modalType: modalType.BUYROOMCOFFE, lock: candado3 }
      );
    })
    candado3.on("pointerover", () => {
      candado3.setAlpha(1)
    });
    candado3.on("pointerout", () => {
      candado3.setAlpha(0.75)
    });
    this.scene.tweens.add({
      targets: [candado1],
      y: '+=10',
      duration: 1000,
      yoyo: true,
      repeat: -1,
    })
    this.scene.tweens.add({
      targets: [candado2],
      y: '+=10',
      duration: 777,
      yoyo: true,
      repeat: -1,
    })
    this.scene.tweens.add({
      targets: [candado3],
      y: '+=10',
      duration: 1111,
      yoyo: true,
      repeat: -1,
    })
    this.frontContainer.add([candado1, candado2, candado3])
    this.scene.UICamera?.ignore(this.frontContainer);
    // let backgroundRoom = this.scene.add.image(300, 300, "HabitacionFinalMai").setOrigin(0.5);

  }

  drawMinigame(mission: missionsType) {
    if (mission.configMinigameId && !mission.draw) {
      const configMinigame = ConfigMinigames.ConfigMinigames.find((configMinigame) => configMinigame.id === mission.configMinigameId)
      let configToDraw: configMinigamePushFind[] = []
      configMinigame?.itemsId.forEach((id) => {
        const newConfig = ConfigMinigamesPushFind.ConfigMinigamesPushFind.find((configMinigame) => configMinigame.id === id)
        if (newConfig) configToDraw.push(newConfig)
      })
      // const configPushFind = ConfigMinigamesPushFind.ConfigMinigamesPushFind.find((minigame: configMinigamePushFind) => configMinigame?.itemsId.includes(minigame.id))


      if (configToDraw.length > 0) {
        this.map.push(createMinigame(this.size, configToDraw))
      }
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.DRAW_MINIGAME, mission.id)
    }
  }
}
