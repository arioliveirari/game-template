import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";
import { changeSceneTo } from "../loader/helpers";

export type changeSceneType = {
  sceneToStart: string,
  sceneToStop: string,
  dataToPass?: any
}

export default class SceneManagerScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();

  constructor() {
    super({key: "SceneManagerScene", active: true});
  }

  create() {
    // this.eventCenter.turnEventOn(
    //   "SceneManagerScene",
    //   this.eventCenter.possibleEvents.CHANGE_SCENE,
    //   (data: changeSceneType) => {
    //     console.log("DATA DE CAMBIO DE ESCENE ARIELITO  ", data)
    //     changeSceneTo(this, data.sceneToStart, data.sceneToStop, data.dataToPass);
    //   },
    //   this
    // );
  }

  update() {
  }
}
