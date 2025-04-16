import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";

export default class MainScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();

  constructor() {
    super({key: "MainScene", active: false});
  }

  create() {
    console.log("CREO LA MAINS CENE")
    this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffff00).setOrigin(0, 0).setAlpha(0.3).setVisible(true);  

    const testCallback: () => void = () => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.CHANGE_SCENE,
        {
          sceneToStart: "MenuScene",
          sceneToStop: "MainScene",
          dataToPass: { test: "test" }
        }
      );
    }

    const button = new GenericButton(this, window.innerWidth / 4, window.innerHeight / 4, "button", testCallback);
  }

  update() {

  }
}
