import {
  buidling1,
  buidling3,
  buidling30,
  buidling4,
  buidling5,
  buidling6,
  buidling7,
  piramide,
  rotateBuilding,
} from "./buildings";
import {
  generateBuildings,
  createBase,
  createSideWalk,
  createStreets,
  createGrass,
  addItems,
  createMinigame,
  configMinigamePushFind,
} from "./mapCreationFunctions";
import { ObjetsConfig } from "./mapTypes";
import RPG from "../rpg";
import EventsCenter from "../services/EventsCenter";
import { missionsType } from "../Assets/Modals/ModalTypes";
import ConfigMinigames from '../MockData/ConfigMinigames.json'
import ConfigMinigamesPushFind from '../MockData/minigamesPushFind.json'

export default class Beach {
  scene: RPG;
  map: any[];
  size: number = 90;
  minigameMap: any;
  eventCenter = EventsCenter.getInstance();
  constructor(scene: RPG) {
    this.scene = scene;
    // const randomYPin = [11, 16, 26, 31, 5, 5, 5, 5]
    // const randomXPin = [5, 5, 5, 5, 18, 23, 28, 33]
    // const randomHPin = [11, 6, 11, 6, 11, 6, 6, 11]
    const randomYPin = [11, 31, 32, 26, 16, 41, 52];
    const randomXPin = [9, 25, 17, 10, 7, 11, 11];
    const randomHPin = [1, 1, 1, 1, 1, 1, 1];

    const objects: ObjetsConfig[] = [];

    const createPins = () => {
      for (let i = 0; i < randomYPin.length; i++) {
        // const randomNumber = Math.random()
        const randomNumber = 0;
        if (randomNumber < 0.5) {
          objects.push({
            x: randomXPin[i],
            y: randomYPin[i],
            h: randomHPin[i] * 50 + 100,
            type: "15",
          });
        }
      }
      if (objects.length === 4) createPins();
    };

    createPins();

    // Forest

    for (let i = 0; i < 40; i++) {
      objects.push({
        x: Math.floor(16 + Math.random() * 8),
        y: Math.floor(1 + Math.random() * 31),
        h: 0,
        type: "8",
      });
    }



    objects.push({
      x: 38,
      y: 23,
      h: 0,
      type: "8",
    });
    objects.push({
      x: 37,
      y: 25,
      h: 0,
      type: "8",
    });
    objects.push({
      x: 38,
      y: 29,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 40,
      y: 22,
      h: 0,
      type: "8",
    });
    objects.push({
      x: 45,
      y: 25,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 46,
      y: 23,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 14,
      y: 33,
      h: 0,
      type: "17",
    });

    objects.push({
      x: 6,
      y: 33,
      h: 0,
      type: "16",
    });


    objects.push({
      x: 38,
      y: 50,
      h: 0,
      type: "BEACHT1",
    });

    objects.push({
      x: 35,
      y: 50,
      h: 0,
      type: "BEACHT2",
    });

    objects.push({
      x: 33,
      y: 50,
      h: 0,
      type: "BEACHT2",
    });

    objects.push({
      x: 39,
      y: 47,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 33,
      y: 46,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 45,
      y: 52,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 3,
      y: 46,
      h: 0,
      type: "8",
    });
    objects.push({
      x: 3,
      y: 60,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 6,
      y: 60,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 9,
      y: 61,
      h: 0,
      type: "8",
    });

    //add a buspost
    objects.push({
      x: 6,
      y: 19,
      h: 50,
      type: "14",
    });


    const streetConfig = {
      streetWidth: [3, 3],
      streetHeight: 7,
      xPos: [7, 10],
      yPos: [34],
    };

    const sideWalkConfig = {
      xPos: [6, 13, 14],
      yPos: [33, 32, 41, 42],
    };
    const createCastle = (
      x: number,
      y: number,
      w: number,
      z: number,
      h: number
    ) => {
      /*
      w 9 
      z 12 
      h 8

          "3": "BLOQUE-1",
          "4": "BLOQUERANDOM",
          "5": "COLUMNALARGA",
          "6": "COLUMNACORTA",
          "7": "SEMIBLOQUE",
      */

      const castle = [
        [
          [5, 5, 5, 100, 100, 100, 5, 5, 5],
          [5, 100, 3, 3, 100, 3, 3, 100, 5],
          [5, 3, 3, 3, 100, 3, 3, 3, 5],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [5, 3, 3, 3, 100, 3, 3, 3, 5],
          [5, 100, 3, 3, 100, 3, 3, 100, 5],
          [5, 5, 5, 100, 100, 100, 5, 5, 5],
        ],
        [
          [5, 5, 100, 100, 100, 100, 100, 5, 5],
          [5, 100, 3, 3, 100, 3, 3, 100, 5],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [100, 3, 3, 3, 100, 3, 3, 3, 100],
          [5, 100, 3, 3, 100, 3, 3, 100, 5],
          [5, 5, 100, 100, 100, 100, 100, 5, 5],
        ],
        [
          [5, 5, 100, 100, 100, 100, 100, 5, 5],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [5, 5, 100, 100, 100, 100, 100, 5, 5],
        ],
        [
          [5, 100, 100, 100, 100, 100, 100, 100, 5],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 3, 3, 3, 3, 3, 3, 3, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [5, 100, 100, 100, 100, 100, 100, 100, 5],
        ],
        [
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
        [
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],

          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],

          [100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
        [
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 5, 100, 100, 100, 5, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 3, 3, 3, 3, 3, 100, 100],
          [100, 100, 5, 100, 100, 5, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
        [
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 3, 3, 3, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
          [100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
      ];

      return castle;
    };

    const createWindow = (
      x: number,
      y: number,
      w: number,
      z: number,
      h: number
    ) => {
      const building = [];
      for (let i = 0; i < h; i++) {
        const hArray = [];
        for (let j = 0; j < z; j++) {
          const hwArray = [];
          for (let k = 0; k < w; k++) {
            // if is the last floor, add block 37
            if (i === h - 1) {
              // hwArray.push(33)
              hwArray.push(46);

              // every 3 floors add 46
            } else if (i % 3 === 0) {
              // hwArray.push(18)
              hwArray.push(46);
            } else {
              // hwArray.push(18)
              hwArray.push(46);
              // every 3 blocks add a window
              if (j % 3 === 0) {
                if (k === 0) {
                  hwArray.pop();
                  // filp a coind, between 46 and 1113

                  const coinA = Math.random();
                  if (coinA > 0.7) {
                    hwArray.push(46);
                  } else {
                    hwArray.push(1113);
                  }
                }
                if (k === 3) {
                  hwArray.pop();
                  const coinB = Math.random();
                  if (coinB > 0.7) {
                    hwArray.push(46);
                  } else {
                    hwArray.push(1112);
                  }
                }
              }
            }
          }
          hArray.push(hwArray);
        }
        building.push(hArray);
      }
      return building;
    };

    const buildings2Build = [
      {
        x: 43,
        y: 1,
        w: 4,
        z: 4,
        h: 5,
        type: "46",
        replace: createWindow(43, 1, 4, 4, 5),
      },
      {
        x: 43,
        y: 6,
        w: 4,
        z: 4,
        h: 17,
        type: "46",
        replace: createWindow(43, 6, 4, 4, 17),
      },
      {
        x: 43,
        y: 11,
        w: 4,
        z: 4,
        h: 12,
        type: "46",
        replace: createWindow(43, 1, 4, 4, 12),
      },
      {
        x: 43,
        y: 16,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(43, 1, 4, 4, 6),
      },

      {
        x: 39,
        y: 1,
        w: 4,
        z: 4,
        h: 5,
        type: "46",
        replace: createWindow(39, 1, 4, 4, 5),
      },
      {
        x: 39,
        y: 6,
        w: 4,
        z: 4,
        h: 17,
        type: "46",
        replace: createWindow(39, 6, 4, 4, 17),
      },
      {
        x: 39,
        y: 16,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(39, 1, 4, 4, 6),
      },
      {
        x: 39,
        y: 11,
        w: 4,
        z: 4,
        h: 12,
        type: "46",
        replace: createWindow(39, 1, 4, 4, 12),
      },

      {
        x: 30,
        y: 1,
        w: 4,
        z: 12,
        h: 12,
        type: "46",
        replace: createWindow(30, 1, 4, 12, 12),
      },
      {
        x: 30,
        y: 6,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(30, 6, 4, 4, 6),
      },
      {
        x: 30,
        y: 11,
        w: 4,
        z: 4,
        h: 12,
        type: "46",
        replace: createWindow(30, 1, 4, 4, 12),
      },
      {
        x: 30,
        y: 16,
        w: 4,
        z: 4,
        h: 17,
        type: "46",
        replace: createWindow(30, 1, 4, 4, 17),
      },
      {
        x: 30,
        y: 21,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(30, 2, 4, 4, 6),
      },
      {
        x: 30,
        y: 27,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(30, 2, 4, 4, 6),
      },

      {
        x: 26,
        y: 1,
        w: 4,
        z: 12,
        h: 12,
        type: "46",
        replace: createWindow(26, 1, 4, 12, 12),
      },
      {
        x: 26,
        y: 6,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(26, 6, 4, 4, 6),
      },
      {
        x: 26,
        y: 11,
        w: 4,
        z: 4,
        h: 12,
        type: "46",
        replace: createWindow(26, 1, 4, 4, 12),
      },
      {
        x: 26,
        y: 16,
        w: 4,
        z: 4,
        h: 17,
        type: "46",
        replace: createWindow(26, 1, 4, 4, 17),
      },
      {
        x: 26,
        y: 21,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(26, 2, 4, 4, 6),
      },

      {
        x: 1,
        y: 1,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(1, 1, 4, 4, 6),
      },
      {
        x: 1,
        y: 6,
        w: 4,
        z: 4,
        h: 17,
        type: "46",
        replace: createWindow(1, 6, 4, 4, 17),
      },
      {
        x: 1,
        y: 11,
        w: 4,
        z: 4,
        h: 12,
        type: "46",
        replace: createWindow(1, 1, 4, 4, 12),
      },
      {
        x: 1,
        y: 16,
        w: 4,
        z: 4,
        h: 6,
        type: "46",
        replace: createWindow(1, 1, 4, 4, 6),
      },
      {
        x: 1,
        y: 21,
        w: 4,
        z: 12,
        h: 12,
        type: "46",
        replace: createWindow(1, 21, 4, 12, 12),
      },

      {
        x: 2,
        y: 47,
        w: 9,
        z: 12,
        h: 8,
        type: "3",
        replace: createCastle(2, 47, 9, 12, 8),
      },
    ];

    const buildings = generateBuildings(this.size, buildings2Build);

    const baseNumber = 1;

    const overrideBeach = (map: number[][], withParser: boolean = false) => {
      let _mp = [...map];

      for (let j = 0; j < _mp.length; j++) {
        for (let i = _mp[j].length; i > 42; i--) {
          _mp[j][i] = 1111;
        }
      }

      for (let j = _mp.length - 12; j < _mp.length; j++) {
        for (let i = 0; i < _mp[j].length; i++) {
          _mp[j][i] = 0;
        }
      }

      const builded = _mp;
      return !withParser
        ? builded
        : builded.map((row) => row.join(" ")).join("\n");
    };

    const overrideCustom = (map: number[][], withParser: boolean = false) => {
      let _mp = [...map];

      _mp[7][41] = 133;
      _mp[7][42] = 133;
      _mp[8][41] = 133;
      _mp[8][42] = 133;
      _mp[9][41] = 133;
      _mp[9][42] = 133;
      _mp[10][41] = 133;
      _mp[10][42] = 133;
      _mp[11][41] = 133;
      _mp[11][42] = 133;
      _mp[12][41] = 133;
      _mp[12][42] = 133;
      _mp[13][41] = 133;
      _mp[13][42] = 133;

      _mp[39][24] = 133;
      _mp[39][25] = 133;
      _mp[39][26] = 133;
      _mp[39][27] = 133;
      _mp[39][28] = 133;
      _mp[39][29] = 133;

      _mp[40][24] = 133;
      _mp[40][25] = 133;
      _mp[40][26] = 133;
      _mp[40][27] = 133;
      _mp[40][28] = 133;
      _mp[40][29] = 133;

      _mp[41][24] = 133;
      _mp[41][25] = 133;
      _mp[41][26] = 133;
      _mp[41][27] = 133;
      _mp[41][28] = 133;
      _mp[41][29] = 133;

      _mp[42][24] = 133;
      _mp[42][25] = 133;
      _mp[42][26] = 133;
      _mp[42][27] = 133;
      _mp[42][28] = 133;
      _mp[42][29] = 133;

      _mp[43][24] = 133;
      _mp[43][25] = 133;
      _mp[43][26] = 133;
      _mp[43][27] = 133;
      _mp[43][28] = 133;
      _mp[43][29] = 133;

      _mp[44][24] = 133;
      _mp[44][25] = 133;
      _mp[44][26] = 133;
      _mp[44][27] = 133;
      _mp[44][28] = 133;
      _mp[44][29] = 133;

      const builded = _mp;
      // matrix = [
      //   [1,2,3, 4], 
      //   [1,2,3, 4], 
      //   [1,2,3, 4]
      // ]

      for (let j = 0; j < builded.length; j++) {
        for (let i = 0; i < builded[j].length; i++) {

          if (i >= 60){
            const randomNumber = Math.random();
            builded[j][i] =  randomNumber < 0.8 ? 231 : 232;
            // builded[j][i] = randomNumber < 0.5 ? 231 : randomNumber < 0.75 ? 232 : 233;
          }
          if (i >= 66){
            const randomNumber = Math.random();
            builded[j][i] = randomNumber < 0.8 ? 232 : 233;
            // builded[j][i] = randomNumber < 0.5 ? 232 : randomNumber < 0.75 ? 233 : 234;
          }
          if (i >= 72){
            const randomNumber = Math.random();
            builded[j][i] = randomNumber < 0.8 ? 233 : 234;
            // builded[j][i] = randomNumber < 0.5 ? 233 : randomNumber < 0.75 ? 234 : 235;
          }
          if (i >= 78){
            const randomNumber = Math.random();
            builded[j][i] = randomNumber < 0.8 ? 234 : 235;
            // builded[j][i] = randomNumber < 0.2 ? 233 : randomNumber < 0.5 ? 234 : 235;
          }
          if (i >= 84){
            const randomNumber = Math.random();
            builded[j][i] = 235;
            // builded[j][i] = randomNumber < 0.3 ? 234 : 235;
          }
          // a los 65
          if (j>= 50) builded[j][i] = 100;
        }
      }
      
      return !withParser
        ? builded
        : builded.map((row) => row.join(" ")).join("\n");
    };

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
          "231": "OCEAN-1",
          "232": "OCEAN-2",
          "233": "OCEAN-3",
          "234": "OCEAN-4",
          "235": "OCEAN-5",
          "10": "STREET-A",
          "11": "STREET-B",
          "12": "STREET-C",
          "14": "BUS",
          "111": "STREET-E",
          "133": "SIDEWALK",
          "134": "SIDEWALK2",
          "100": "BUILDINGBLOCKEMPTY",
          "112": "DELIVERYBOX",

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
          "70": "DOG",
          "109": "CHICKEN",
          "110": "CAT",
          "114": "DROPZONE",
          "13": "ENDPOINT",
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
          "BEACHT1": "BEACHT1",
          "BEACHT2": "BEACHT2",
        },
      },

      // MAP PLAYER / ITEMS CONFIG
      [createBase(this.size, [45, 45])],
      overrideCustom(
        overrideBeach(
          createSideWalk(
            createStreets(
              createGrass(this.size, false, buildings2Build, baseNumber),
              streetConfig,
              false
            ) as number[][],
            sideWalkConfig,
            false
          ) as number[][],
          false
        ) as number[][],
        true
      ),
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
      if (configToDraw.length > 0) {
        this.map.push(createMinigame(this.size, configToDraw))
      }
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.DRAW_MINIGAME, mission.id)
    }
  }
}






