import { buidling1, buidling3, buidling30, buidling4, buidling5, buidling6, buidling7, piramide, rotateBuilding } from "./buildings";
import { generateBuildings, createBase, createSideWalk, createStreets, createGrass, addItems, createMinigame } from "./mapCreationFunctions";
import { ObjetsConfig } from "./mapTypes";
import RPG from "../rpg";
import EventsCenter from "../services/EventsCenter";
import { missionsType } from "../Assets/Modals/ModalTypes";

export default class TestCity {
  scene: RPG;
  map: any[];
  size: number = 20;
  minigameMap: any;
  eventCenter = EventsCenter.getInstance();
  constructor(scene: RPG) {
    this.scene = scene;
    // const randomYPin = [11, 16, 26, 31, 5, 5, 5, 5]
    // const randomXPin = [5, 5, 5, 5, 18, 23, 28, 33]
    // const randomHPin = [11, 6, 11, 6, 11, 6, 6, 11]
    const randomYPin: number[] = [2]
    const randomXPin: number[] = [2]
    const randomHPin: number[] = [1]
    
    const objects: ObjetsConfig[] = [
      {
        x: 8,
        y: 36,
        h: 0,
        type: "8",
      },
      {
        x: 8,
        y: 2,
        h: 0,
        type: "8",
      },
      {
        x: 6,
        y: 3,
        h: 0,
        type: "8",
      },
      {
        x: 3,
        y: 36,
        h: 0,
        type: "8",
      },
    ];

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

    const sideWalkConfig = {
      sideWalkWidth: 1,
      xPos: [],
      yPos: [],
    };

    const streetConfig = {
      streetWidth: 3, 
      xPos: [10],
      yPos: [10],
    };

    const buildings2Build = [
      { x: 4, y: 5, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----  
    ]

    const buildings = generateBuildings(this.size, buildings2Build);


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
          "10": "STREET-A",
          "11": "STREET-B",
          "12": "STREET-C",
          "111": "STREET-E",
          "133": "SIDEWALK",
          "134": "SIDEWALK2",
          "135": "STREET-DOBLE-1",
          "136": "STREET-DOBLE-2",
          "137": "STREET-CROSS-1",
          "138": "STREET-CROSS-2",
          "100": "BUILDINGBLOCKEMPTY",
          "3": "BLOQUE-1",
          "4": "BLOQUERANDOM",
          "5": "COLUMNALARGA",
          "6": "COLUMNACORTA",
          "7": "SEMIBLOQUE",
          "8": "TREE",
          "9": "CUBE",
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
        },
      },

      // MAP PLAYER / ITEMS CONFIG
      [createBase(this.size, [12, 12])],
      createSideWalk(createStreets(createGrass(this.size, false, buildings2Build), streetConfig, false) as number[][], sideWalkConfig, true) as number[][],
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

  drawMinigame(mission: missionsType){
  }
}
