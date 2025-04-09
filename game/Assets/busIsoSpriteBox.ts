
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
import { Player } from "./Player";
import { RpgIsoPlayerPrincipal } from "./rpgIsoPlayerPrincipal";
import RPG from "../rpg";
import City from "../maps/City";
import EventsCenter from "../services/EventsCenter";
import { modalType } from "./Modals/ModalTypes";
import possibleSounds from "../modules/possibleSounds.json";

export class BusIsoSpriteBox extends RpgIsoSpriteBox {
  eventCenter = EventsCenter.getInstance();
  type: string = "BUS";
  objectPin: RpgIsoSpriteBox;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    objectPin: string,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: {x: number, y: number, h: number},
    interactivityPosition?: {x: number, y: number, w: number, h: number},

  ) {
    super(scene, x, y, z, texture, frame, group, matrixPosition,interactivityPosition);
    this.objectPin = new RpgIsoSpriteBox(scene, x + 30, y, z + 125, objectPin, frame, group, matrixPosition)
    //this.self.setScale(2);

  }

  updateBus(group: Phaser.GameObjects.Group) {
    this.self.setInteractive();
    this.self.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.CITIES, pin: this, inSomePlace: this.scene.mapType });
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.cities.clickPin);
    })
    this.objectPin.self.setInteractive();
    this.objectPin.self.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.CITIES, pin: this, inSomePlace: this.scene.mapType });
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.cities.clickPin);
    })

   this.scene.add.tween({
    targets: this.objectPin,
    y: "-=50",
    duration: 2000,
    repeat: -1,
    yoyo: true, 
    ease: "power1",
    });
  }
}
