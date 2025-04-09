import { Scene } from "phaser";
import EventsCenterManager from "./services/EventsCenter";

export type IsoSceneType = {
  isoPhysics: any;
};
export type SceneWithIsoType = Scene & IsoSceneType;

export enum statusEnum {
  STOPPED,
  RUNNING,
  LOSING,
  IDLE,
  WINNING,
}
export default class GameScene extends Scene {
 
  eventCenter = EventsCenterManager.getInstance();
  constructor() {
    const sceneConfig = {
      key: "GameScene",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics", rexUI: "rexUI" },
    };

    super(sceneConfig);
  }
  create(){

    this.time.delayedCall(1000, () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.TEST, {
        test: "test",
      });
    }, [], this);



    this.add.rectangle(0, 0, 100, 100, 0xff0000).setOrigin(0).setInteractive().on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.CHANGE_SCENE, {
        test: "test",
      });
    }, this);
  }

  update() {
    
  }
}