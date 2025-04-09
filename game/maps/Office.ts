import { buidling1, buidling3, buidling30, buidling4, buidling5, buidling6, buidling7, piramide, rotateBuilding } from "./buildings";
import { generateBuildings, createBase, createSideWalk, createStreets, createGrass, addItems, createMinigame, configMinigamePushFind } from "./mapCreationFunctions";
import { ObjetsConfig } from "./mapTypes";
import RPG from "../rpg";
import EventsCenter from "../services/EventsCenter";
import { missionsType } from "../Assets/Modals/ModalTypes";
import ConfigMinigames from '../MockData/ConfigMinigames.json'
import ConfigMinigamesPushFind from '../MockData/minigamesPushFind.json'

export default class Office {
  scene: RPG;
  map: any[];
  size: number = 45;
  minigameMap: any;
  eventCenter = EventsCenter.getInstance();
  borderBlocks: [number, number][] = [];
  constructor(scene: RPG) {
    this.scene = scene;
    // const randomYPin = [11, 16, 26, 31, 5, 5, 5, 5]
    // const randomXPin = [5, 5, 5, 5, 18, 23, 28, 33]
    // const randomHPin = [11, 6, 11, 6, 11, 6, 6, 11]
    const randomXPin = [11, 25, 24, 4, 3]
    const randomYPin = [9, 25, 14, 19, 19]
    const randomHPin = [1, 1, 1, 1, 1]

    const objects: ObjetsConfig[] = [
      {
        x: 23,
        y: 12,
        h: 0,
        type: "DESKT1",
      },

      {
        x: 7,
        y: 5,
        h: 0,
        type: "DESKT1",
      },
      {
        x: 5,
        y: 23,
        h: 0,
        type: "DESKT1",
      },
      {
        x: 8,
        y: 23,
        h: 0,
        type: "DESKT1",
      },
      {
        x: 5,
        y: 30,
        h: 0,
        type: "DESKT1",
      },
      {
        x: 8,
        y: 30,
        h: 0,
        type: "DESKT1",
      },
      {
        x: 8,
        y: 19,
        h: 0,
        type: "DESKT2",
      }

    ];

    
    //add a buspost
    objects.push({
      x: 39,
      y: 30,
      h: 50,
      type: "14",
    });

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
      xPos: [41],
      yPos: [41],
    };

    const sideWalkConfig = {
      xPos: [],
      yPos: [],
    };

    const buildings2Build: any = []



    let buildings = generateBuildings(this.size, buildings2Build);

    const baseNumber = 111;


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

      removeFromTo([12, 0], [40, 8])
      removeFromTo([30, 0], [40, 30])
      removeFromTo([0, 36], [30, 40])
      removeFromTo([0, 13], [16, 18])
      removeFromTo([15, 24], [21, 40])
      removeFromTo([0, 0], [1, 40])
      removeFromTo([0, 0], [40, 1])
      removeFromTo([39, 0], [40, 40])
      removeFromTo([0, 39], [40, 40])


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
            [101]
          ],
          [
            [(i % 5 == 0) ? 61 : 101]
          ],
          [
            [33]
          ],
          [
            [101]
          ]
        ]
      }

      for (let i = 0; i < this.borderBlocks.length; i++) {

        const [x, y] = this.borderBlocks[i];
        if (y >= 38 || x >= 38) {
          // nothing
        } else if (_mp[x][y] === 33) {
          buildings2Build.push({
            x: x,
            y: y,
            w: 1,
            z: 1,
            h: 4,
            type: "101",
            replace: windowCreator(i, x, y)
          })
        }

      }

      
      const builded = _mp;
      
      for (let i = 0; i < builded.length; i++) {
        for (let j = 0; j < builded[i].length; j++) {
          if (i === 38 && j <= 38) {
            builded[i][j] = 1;
          }
          if (j === 38 && i <= 38) {
            builded[i][j] = 1;
          }
          // if (j >= 30 && j <= 37 && i === 37) {
          //   if (j === 34 || j=== 35) builded[i][j] = 100;
          //   else buildings2Build.push({
          //     x: j,
          //     y: i,
          //     w: 1,
          //     z: 1,
          //     h: 4,
          //     type: "101",
          //   })
          // }
          // if (i >= 30 && i <= 37 && j === 37) {
          //   if (i === 34 || i=== 35) builded[i][j] = 100;
          //   else buildings2Build.push({
          //     x: j,
          //     y: i,
          //     w: 1,
          //     z: 1,
          //     h: 4,
          //     type: "101",
          //   })
          // }
        }
      }
      buildings = generateBuildings(this.size, buildings2Build);
      
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
          "1": "GRASS",
          "1111": "BEACHBLOCK",
          "1112": "BEACHWINDOW1",
          "1113": "BEACHWINDOW2",
          "1114": "BEACHWINDOW3",
          "10": "STREET-A",
          "100": "BUILDINGBLOCKEMPTY",
          "101": "BUILDINGBLOCK",
          "11": "STREET-B",
          "12": "STREET-C",
          "111": "STREET-E",
          "133": "SIDEWALK",
          "134": "SIDEWALK2",
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
          "114": "DROPZONE",
          "112": "DELIVERYBOX",

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
      [createBase(this.size, [20, 20])],
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

  addMapFunctionalities() {
    if (this.scene.player) {
      this.scene.player.self.setScale(0.7);
    }
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
