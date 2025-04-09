import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import { changeSceneTo, checkIfMobile } from "../helpers/helpers";
import EventsCenter from "../services/EventsCenter";
import RPG from "../rpg";
import { globalState } from "../GlobalDataManager";
import { Inventory, Item, missionsType, ModalConfig, modalType, ProductToBuy } from "../Assets/Modals/ModalTypes";
import AmbientBackgroundScene from "../ambientAssets/backgroundScene";
import possibleSounds from "../../game/modules/possibleSounds.json";

export default class Room {

  scene: RPG;
  map: any[];
  minigameMap: any;
  interactiveComputer?: Phaser.GameObjects.Rectangle;
  interactiveDoor?: Phaser.GameObjects.Rectangle;
  interactiveBed?: Phaser.GameObjects.Rectangle;
  interactiveNewsPaper?: Phaser.GameObjects.Rectangle;
  interactiveBoard?: Phaser.GameObjects.Rectangle;
  interactiveShelf?: Phaser.GameObjects.Rectangle;
  eventCenter = EventsCenter.getInstance();
  imagesPositions: { x: number; y: number } = { x: -75, y: 35 };
  backgroundContainer?: Phaser.GameObjects.Container;
  frontContainer?: Phaser.GameObjects.Container;

  sleeping: boolean = false;
  constructor(scene: RPG) {
    this.scene = scene;

    this.map = [
      {
        nivel: "room",
        player: "pepito",
        musica: "bkg-uno.mp3",
        ballTexture: "123",
        gravity: 9.8,
        distanceBetweenFloors: 50,
        tiles: {
          "1": "GRASS",
          "3": "BLOQUE-1",
          "4": "BLOQUERANDOM",
          "5": "COLUMNALARGA",
          "6": "COLUMNACORTA",
          "7": "SEMIBLOQUE",
          "8": "TREE",
          "9": "CUBE",
          "23": "BUILDINGBLOCKEMPTY",
          PN: "PLAYER-N",
          PS: "PLAYER-S",
          PE: "PLAYER-E",
          PW: "PLAYER-W",
        },
      },

      // MAP PLAYER / ITEMS CONFIG
      [
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 PS 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0",
      ],
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23",

      // ONE
      "23 0 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "0 23 0 0 0 0 0 0 0 23\n" +
      "0 23 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23",

    ];
  }

  drawItems(items: Item[]) {
    items.forEach(item => {
      if (!item.imageInRoom) return;
      const itemToDraw = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, item.imageInRoom).setOrigin(0.5);
      item.imageInRoom === "bicicle" ? this.frontContainer?.add(itemToDraw) : this.backgroundContainer?.add(itemToDraw);
    });
  }

  addMapFunctionalities(globalState: globalState) {

    if (this.scene.player) {
      if (checkIfMobile(this.scene)) {
        // @ts-ignore
        this.scene.cameras.main.centerOn(this.scene.player.x, this.scene.player.y);
      } else {
        // @ts-ignore
        this.scene.cameras.main.stopFollow().centerOn(this.scene.player.x, this.scene.player.y - 250);
      }
      this.scene.player.self.setVisible(false)
      this.scene.player.self.setScale(1.4);
    }

    const firstPos = this.scene.isoGroup?.children.entries[0] as unknown as RpgIsoSpriteBox;
    this.frontContainer = this.scene.add.container(firstPos.self.x, firstPos.self.y).setDepth(999999)
    this.backgroundContainer = this.scene.add.container(firstPos.self.x, firstPos.self.y)

    // -> BASIC ITEMS
    let backgroundRoom = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "HabitacionFinalMai").setOrigin(0.5);

    let pcGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "pcGlow").setOrigin(0.5).setVisible(false);
    this.interactiveComputer = this.scene.add.rectangle(350, -20, 100, 100, 0x6666ff, 0).setInteractive();
    this.interactiveComputer.on('pointerdown', () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.PC });
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.room.pc);
    });
    this.interactiveComputer.on("pointerover", () => {
      pcGlow.setVisible(true);
    });
    this.interactiveComputer.on("pointerout", () => {
      pcGlow.setVisible(false);
    });

    let newspaperGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "newspaperGlow").setOrigin(0.5).setVisible(false);
    this.interactiveNewsPaper = this.scene.add.rectangle(440, 30, 40, 60, 0x6666ff, 0).setInteractive().setRotation(Math.PI / 3);
    this.interactiveNewsPaper.on('pointerdown', () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.NEWS });
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.room.newspaper);
    });

    this.interactiveNewsPaper.on("pointerover", () => {
      newspaperGlow.setVisible(true);
    });

    this.interactiveNewsPaper.on("pointerout", () => {
      newspaperGlow.setVisible(false);
    });

    let puertaGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "puertaGlow").setOrigin(0.5).setVisible(false);
    this.interactiveDoor = this.scene.add.rectangle(-550, 65, 150, 360, 0x6666ff, 0).setInteractive();
    this.interactiveDoor.on('pointerdown', () => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.OPEN_MODAL,
        { modalType: modalType.CITIES, undefined }
      );
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.room.door);

    });
    this.interactiveDoor.on("pointerover", () => {
      puertaGlow.setVisible(true);
    });
    this.interactiveDoor.on("pointerout", () => {
      puertaGlow.setVisible(false);
    });
    let corcho = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "Corcho").setOrigin(0.5).setVisible(true);
    let corchoGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "Glowcorcho").setOrigin(0.5).setVisible(false);
    this.interactiveBoard = this.scene.add.rectangle(390, -180, 230, 160, 0x66ffff, 0).setInteractive();
    this.interactiveBoard.on('pointerdown', () => {
      this.eventCenter.emit(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.TROFIES, mission: null, type: "trofies" });

    });
    this.interactiveBoard.on("pointerover", () => {
      corchoGlow.setVisible(true);
    });
    this.interactiveBoard.on("pointerout", () => {
      corchoGlow.setVisible(false);
    });

    let estanteriaGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "Glowestanteria").setOrigin(0.5).setVisible(false);
    this.interactiveShelf = this.scene.add.rectangle(130, -190, 180, 340, 0xff66ff, 0).setInteractive();
    this.interactiveShelf.on('pointerdown', () => {
      // OPEN MODAL BOARD DAVID TODO
      this.eventCenter.emit(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.TROFIES, mission: null, type: "inventory" });
    });
    this.interactiveShelf.on("pointerover", () => {
      estanteriaGlow.setVisible(true);
    });
    this.interactiveShelf.on("pointerout", () => {
      estanteriaGlow.setVisible(false);
    });

    let cama = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "cama").setOrigin(0.5).setVisible(false);
    this.interactiveBed = this.scene.add.rectangle(-150, 20, 130, 200, 0x6666ff, 0).setRotation(Math.PI / 3).setInteractive();
    this.interactiveBed.on('pointerdown', () => {

      // check time

      if (!this.sleeping) {
        // this.eventCenter.emitEvent(this.eventCenter.possibleEvents.SLEEP, undefined); // TEST DREAMS
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.TRY_SLEEP, undefined);
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.room.bed);
      }
    });
    this.interactiveBed.on("pointerover", () => {
      cama.setVisible(true);
    });
    this.interactiveBed.on("pointerout", () => {
      cama.setVisible(false);
    });

    this.backgroundContainer.add([
      backgroundRoom,
      corcho,
      corchoGlow,
      estanteriaGlow,
      pcGlow,
      puertaGlow,
      newspaperGlow,
      cama,
    ])

    this.frontContainer.add([
      this.interactiveBoard,
      this.interactiveShelf,
      this.interactiveComputer,
      this.interactiveDoor,
      this.interactiveBed,
      this.interactiveNewsPaper
    ]);

    this.scene.UICamera?.ignore(this.backgroundContainer);
    this.scene.UICamera?.ignore(this.frontContainer);
    // <- BASIC ITEMS

    // -> ITEMS IN INVENTORY FROM GLOBAL STATE
    this.drawItems(globalState.inventary.items);
    // <- ITEMS IN INVENTORY FROM GLOBAL STATE

  }

  drawMinigame(missionId: missionsType) {

  }
}
