import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";

export default class MenuScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();

  constructor() {
    super({key: "MenuScene"});
  }

  create() {

  }

  update() {

  }
}
