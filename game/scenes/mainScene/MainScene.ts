import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";
import Player from "@/game/assets/Bodies/Player";

export type changeProperty = {
  type: "color" | "size";
  value: number;
};
export default class MainScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  player?: Player;
  constructor() {
    super({ key: "MainScene", active: true });
    console.log(this.eventCenter.possibleEvents.CHANGE_PLAYER_PROPERTIES)
    // eventos que escucha la escena
    this.eventCenter.turnEventOn(
      "MainScene",
      this.eventCenter.possibleEvents.CHANGE_PLAYER_PROPERTIES,
      (data: changeProperty) => {
        switch (data.type) {
          case "color":
            this.player?.changeColor(data.value);
            break;
          case "size":
            this.player?.changeSize(data.value);
            break;
          default:
            break;
        }
      },
      this
    );
  }



  create() {

    this.player = new Player(this, 100, window.innerHeight / 2, 150, 150, 0xff00ff);
    
    const wall = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2, 100, window.innerHeight, 0x0000ff)

    this.physics.add.existing(wall);

    this.physics.add.collider(this.player, wall, () => {
      if (this.player?.mainColor === wall.fillColor) {
        console.log("HOLU 1")
        return true
      } else {
        console.log("HOLU 2")
        return false
      }
    }, ()=>true, this);


    // this.time.delayedCall(2000, () => {
    //   this.eventCenter.emitEvent(
    //     this.eventCenter.possibleEvents.CHANGE_PLAYER_PROPERTIES,
    //     { type: "color", value: 0xff0000 }
    //   );
    // }
    // );

    // this.time.delayedCall(5000, () => {
    //   this.eventCenter.emitEvent(
    //     this.eventCenter.possibleEvents.CHANGE_PLAYER_PROPERTIES,
    //     { type: "size", value: 340 }
    //   );
    // }
    // );

    // console.log("CREO LA MAINS CENE")
    // this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffff00).setOrigin(0, 0).setAlpha(0.3).setVisible(true);  

    // const testCallback: () => void = () => {
    //   this.eventCenter.emitEvent(
    //     this.eventCenter.possibleEvents.CHANGE_SCENE,
    //     {
    //       sceneToStart: "MenuScene",
    //       sceneToStop: "MainScene",
    //       dataToPass: { test: "test" }
    //     }
    //   );
    // }

    // const button = new GenericButton(this, window.innerWidth / 4, window.innerHeight / 4, "button", testCallback);

  }

  update() {
    if (this.player) {
      this.player.handleMovement();
      this.player.handleSize();
    }
  }
}
