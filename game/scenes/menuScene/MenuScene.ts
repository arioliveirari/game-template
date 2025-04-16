import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";

export default class MenuScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();

  constructor() {
    super({key: "MenuScene"});
  }

  create() {
    console.log("SCENE MENU", this)
    this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffffff).setOrigin(0, 0).setAlpha(0.3).setVisible(true);

    const testCallback: () => void = () => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.CHANGE_SCENE,
        {
          sceneToStart: "MainScene",
          sceneToStop: "MenuScene",
          dataToPass: { test: "test" }
        }
      );
    }

    const button = new GenericButton(this, window.innerWidth / 2, window.innerHeight / 2, "button", testCallback);


  }

  update() {

  }
}
