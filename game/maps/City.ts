import { buidling1, buidling3, buidling30, buidling4, buidling5, buidling6, buidling7, piramide, rotateBuilding } from "./buildings";
import { generateBuildings, createBase, createSideWalk, createStreets, createGrass, addItems, createMinigame, configMinigamePushFind } from "./mapCreationFunctions";
import { ObjetsConfig } from "./mapTypes";
import RPG from "../rpg";
import EventsCenter from "../services/EventsCenter";
import { missionsType } from "../Assets/Modals/ModalTypes";
import ConfigMinigamesPushFind from '../MockData/minigamesPushFind.json'
import ConfigMinigames from '../MockData/ConfigMinigames.json'
import { config } from "process";
export default class City {
  scene: RPG;
  map: any[];
  size: number = 80;
  minigameMap: any;
  eventCenter = EventsCenter.getInstance();
  constructor(scene: RPG) {
    this.scene = scene;
    // const randomYPin = [11, 16, 26, 31, 5, 5, 5, 5]
    // const randomXPin = [5, 5, 5, 5, 18, 23, 28, 33]
    // const randomHPin = [11, 6, 11, 6, 11, 6, 6, 11]
    // const randomYPin = [48]
    // const randomXPin = [48]
    // const randomHPin = [1]
    const randomYPin = [11,47,65,32,68,69,49,77]
    const randomXPin = [9,47,73,8,27,49,65,9]
    const randomHPin = [1,1,5,1,1,1,1,1]
    
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

    //add a trader
    objects.push({
      x: 48,
      y: 41,
      h: 50,
      type: "19",
    });

    //add a tradercoffe
    objects.push({
      x: 48,
      y: 45,
      h: 50,
      type: "63",
    });

    //add a buspost
    objects.push({
      x: 49,
      //y: 41,
      y: 56,
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
    for (let i = 0; i < 40; i++) {
      objects.push({
        x: Math.floor(20 + Math.random() * 27),
        y: Math.floor(20 + Math.random() * 27),
        h: 0,
        type: "8",
      });
    }

    for (let i = 0; i < 10; i++) {
      objects.push({
        x: Math.floor(20 + Math.random() * 28),
        y: Math.floor(65 + Math.random() * 6),
        h: 0,
        type: "8",
      });
    }

    for (let i = 0; i < 30; i++) {
      objects.push({
        x: Math.floor(73 + Math.random() * 6),
        y: Math.floor(2 + Math.random() * 30),
        h: 0,
        type: "8",
      });
    }

    for (let i = 0; i < 30; i++) {
      objects.push({
        x: Math.floor(58 + Math.random() * 6),
        y: Math.floor(40 + Math.random() * 9),
        h: 0,
        type: "8",
      });
    }

    objects.push({
      x: 63,
      y: 24,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 64,
      y: 22,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 48,
      y: 56,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 48,
      y: 58,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 48,
      y: 76,
      h: 0,
      type: "8",
    });

    objects.push({
      x: 48,
      y: 79,
      h: 0,
      type: "8",
    });

    const streetConfig = {
      streetWidth: [3,3],
      streetHeight: 3,
      xPos: [12, 50],
      yPos: [50],
    };

    const sideWalkConfig = {
      xPos: [11, 15, 49, 53],
      yPos: [49,53],
    };


    const buildings2Build = [
      { x: 4, y: 5, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      { x: 4, y: 10, w: 4, z: 4, h: 12, type: "46", replace: buidling3 }, // <----
      { x: 4, y: 15, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      { x: 4, y: 20, w: 4, z: 12, h: 12, type: "100", replace: buidling5 }, // <----

      { x: 18, y: 1, w: 4, z: 4, h: 4, type: "21", replace: buidling1 }, // <----
      { x: 23, y: 1, w: 4, z: 4, h: 10, type: "21", replace: buidling1 }, // <----
      { x: 27, y: 1, w: 4, z: 4, h: 8, type: "21", replace: buidling1 }, // <----
      { x: 31, y: 1, w: 4, z: 4, h: 4, type: "21", replace: buidling1 }, // <----
      { x: 35, y: 1, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      { x: 39, y: 1, w: 4, z: 4, h: 12, type: "21", replace: buidling1 }, // <----
      { x: 43, y: 1, w: 4, z: 4, h: 8, type: "21", replace: buidling1 }, // <----

      { x: 18, y: 12, w: 4, z: 4, h: 10, type: "21", replace: buidling1 }, // <----
      { x: 23, y: 12, w: 4, z: 4, h: 4, type: "21", replace: buidling1 }, // <----
      { x: 27, y: 12, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      { x: 31, y: 12, w: 4, z: 4, h: 4, type: "21", replace: buidling1 }, // <----
      { x: 35, y: 12, w: 4, z: 4, h: 12, type: "21", replace: buidling1 }, // <----
      { x: 39, y: 12, w: 4, z: 4, h: 12, type: "21", replace: buidling1 }, // <----
      { x: 43, y: 12, w: 4, z: 4, h: 18, type: "21", replace: buidling1 }, // <----


      { x: 4, y: 56, w: 4, z: 4, h: 8, type: "46", replace: buidling3 }, // <----
      { x: 4, y: 61, w: 4, z: 4, h: 12, type: "46", replace: buidling3 }, // <----
      { x: 4, y: 68, w: 4, z: 4, h: 17, type: "46", replace: buidling3 }, // <----
      { x: 4, y: 73, w: 4, z: 4, h: 10, type: "46", replace: buidling3 }, // <----


      { x: 18, y: 56, w: 5, z: 5, h: 14, type: "59", replace: buidling6 }, // <----
      { x: 26, y: 56, w: 5, z: 5, h: 10, type: "59", replace: buidling6 }, // <----
      { x: 33, y: 56, w: 13, z: 5, h: 5, type: "59", replace: buidling7 }, // <----

      { x: 18, y: 74, w: 5, z: 5, h: 14, type: "59", replace: buidling6 }, // <----
      { x: 26, y: 74, w: 5, z: 5, h: 16, type: "59", replace: buidling6 }, // <----
      { x: 33, y: 74, w: 5, z: 5, h: 5, type: "59", replace: buidling6 }, // <----
      { x: 40, y: 74, w: 5, z: 5, h: 20, type: "59", replace: buidling6 }, // <----

      { x: 58, y: 58, w: 18, z: 18, h: 8, type: "46", replace: piramide }, // <----


      { x: 56, y: 1, w: 4, z: 4, h: 5, type: "46", replace: buidling3 }, // <----
      
      { x: 56, y: 7, w: 4, z: 4, h: 17, type: "46", replace: buidling3 }, // <----

      { x: 56, y: 13, w: 6, z: 6, h: 10, type: "46", replace: buidling3 }, // <----

      { x: 56, y: 20, w: 4, z: 4, h: 12, type: "46", replace: buidling3 }, // <----

      { x: 56, y: 25, w: 4, z: 10, h: 10, type: "46", replace: buidling3 }, // <----


      { x: 66, y: 7, w: 4, z: 4, h: 5, type: "46", replace: buidling30 }, // <----
      
      { x: 66, y: 1, w: 4, z: 4, h: 17, type: "46", replace: buidling30 }, // <----

      { x: 66, y: 13, w: 4, z: 4, h: 12, type: "46", replace: buidling30 }, // <----

      { x: 66, y: 19, w: 4, z: 4, h: 7, type: "46", replace: buidling30 }, // <----

      { x: 66, y: 32, w: 4, z: 4, h: 5, type: "46", replace: buidling30 }, // <----

      { x: 66, y: 37, w: 4, z: 4, h: 15, type: "46", replace: buidling30 }, // <----

      { x: 66, y: 44, w: 4, z: 4, h: 9, type: "46", replace: buidling30 }, // <----      

      
      { x: 75, y: 33, w: 4, z: 4, h: 5, type: "46", replace: buidling30 }, // <----

      { x: 75, y: 38, w: 4, z: 4, h: 12, type: "46", replace: buidling30 }, // <----

      { x: 75, y: 44, w: 4, z: 4, h: 9, type: "46", replace: buidling30 }, // <----


      // { x: 58, y: 10, w: 4, z: 4, h: 12, type: "46", replace: buidling3 }, // <----
      // { x: 58, y: 15, w: 4, z: 4, h: 6, type: "46", replace: buidling3 }, // <----
      // { x: 58, y: 20, w: 4, z: 12, h: 12, type: "46", replace: buidling3 }, // <----

      // { x: 18, y: 62, w: 6, z: 4, h: 10, type: "59" }, // <----

      // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----

      // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----

      // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----

      // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----




      // { x: 4, y: 20, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      // { x: 4, y: 25, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
      // { x: 4, y: 30, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      
      // { x: 17, y: 4, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
      // { x: 22, y: 4, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      // { x: 27, y: 4, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      // { x: 32, y: 4, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----

      // { x: 44, y: 25, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      // { x: 44, y: 30, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
      // { x: 44, y: 35, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      // { x: 44, y: 40, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      
      // { x: 22, y: 44, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
      // { x: 27, y: 44, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      // { x: 32, y: 44, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      // { x: 37, y: 44, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
    ]


    
    // const buildings2Build = [
    //   { x: 4, y: 5, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 4, y: 10, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----
    //   { x: 4, y: 15, w: 4, z: 4, h: 3, type: "21", replace: buidling4 }, // <----
    //   { x: 4, y: 20, w: 4, z: 12, h: 3, type: "100", replace: buidling5 }, // <----

    //   { x: 18, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 23, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 27, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 31, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 35, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 39, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 43, y: 1, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----

    //   { x: 18, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 23, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 27, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 31, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 35, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 39, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----
    //   { x: 43, y: 12, w: 4, z: 4, h: 3, type: "21", replace: buidling1 }, // <----


    //   { x: 4, y: 56, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----
    //   { x: 4, y: 61, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----
    //   { x: 4, y: 68, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----
    //   { x: 4, y: 73, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----


    //   { x: 18, y: 56, w: 5, z: 5, h: 3, type: "59", replace: buidling6 }, // <----
    //   { x: 26, y: 56, w: 5, z: 5, h: 3, type: "59", replace: buidling6 }, // <----
    //   { x: 33, y: 56, w: 13, z: 5, h: 3, type: "59", replace: buidling7 }, // <----

    //   { x: 18, y: 74, w: 5, z: 5, h: 3, type: "59", replace: buidling6 }, // <----
    //   { x: 26, y: 74, w: 5, z: 5, h: 3, type: "59", replace: buidling6 }, // <----
    //   { x: 33, y: 74, w: 5, z: 5, h: 3, type: "59", replace: buidling6 }, // <----
    //   { x: 40, y: 74, w: 5, z: 5, h: 3, type: "59", replace: buidling6 }, // <----

    //   { x: 58, y: 58, w: 18, z: 18, h: 3, type: "46", replace: piramide }, // <----


    //   { x: 56, y: 1, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----
      
    //   { x: 56, y: 7, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----

    //   { x: 56, y: 13, w: 6, z: 6, h: 3, type: "46", replace: buidling3 }, // <----

    //   { x: 56, y: 20, w: 4, z: 4, h: 3, type: "46", replace: buidling3 }, // <----

    //   { x: 56, y: 25, w: 4, z: 10, h: 3, type: "46", replace: buidling3 }, // <----


    //   { x: 66, y: 7, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----
      
    //   { x: 66, y: 1, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 66, y: 13, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 66, y: 19, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 66, y: 32, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 66, y: 37, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 66, y: 44, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----      

      
    //   { x: 75, y: 33, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 75, y: 38, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----

    //   { x: 75, y: 44, w: 4, z: 4, h: 3, type: "46", replace: buidling30 }, // <----


    //   // { x: 58, y: 10, w: 4, z: 4, h: 12, type: "46", replace: buidling3 }, // <----
    //   // { x: 58, y: 15, w: 4, z: 4, h: 6, type: "46", replace: buidling3 }, // <----
    //   // { x: 58, y: 20, w: 4, z: 12, h: 12, type: "46", replace: buidling3 }, // <----

    //   // { x: 18, y: 62, w: 6, z: 4, h: 10, type: "59" }, // <----

    //   // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----

    //   // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----

    //   // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----

    //   // { x: 18, y: 56, w: 4, z: 4, h: 17, type: "59" }, // <----




    //   // { x: 4, y: 20, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
    //   // { x: 4, y: 25, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
    //   // { x: 4, y: 30, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      
    //   // { x: 17, y: 4, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
    //   // { x: 22, y: 4, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
    //   // { x: 27, y: 4, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
    //   // { x: 32, y: 4, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----

    //   // { x: 44, y: 25, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
    //   // { x: 44, y: 30, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
    //   // { x: 44, y: 35, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
    //   // { x: 44, y: 40, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      
    //   // { x: 22, y: 44, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
    //   // { x: 27, y: 44, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
    //   // { x: 32, y: 44, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
    //   // { x: 37, y: 44, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
    // ]

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
          "100": "BUILDINGBLOCKEMPTY",
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
          "112": "DELIVERYBOX",
          "114": "DROPZONE",
          "13": "ENDPOINT",
          "14": "BUS",
          "15": "PIN",
          "16": "TRAFFIC-LIGHT-A",
          "17": "TRAFFIC-LIGHT-B",
          "18": "BUILDINGBLOCK",
          "19": "TRADER",
          "63": "TRADERCOFFE",
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
      [createBase(this.size, [50, 50])],
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
