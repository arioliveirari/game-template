
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

export class CoffeMinigameSpriteBox extends RpgIsoSpriteBox {
  eventCenter = EventsCenter.getInstance();
  type: string = "COFFEMINIGAME";
  objectPin?: RpgIsoSpriteBox;
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
    this.objectPin = new RpgIsoSpriteBox(scene, x + 40, y + 10, z + 40, "coffePin", frame, group, matrixPosition)
    this.objectPin.self.setScale(0.67)

  }

  updateCoffe(group: Phaser.GameObjects.Group) {
    this.self.setInteractive();
    this.self.on("pointerdown", () => {
      // tint when over
      // CoffeMiniGameScene
      // CleanTableMiniGameScene
      const obj = { 
        name:'CoffeMiniGameScene', 
        item: 15, 
        damage:5,
        consume: 9, 
        money: 11,
        considerBusinessFuel: true
      }
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MINIGAME, obj);
      // this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MINIGAME, { name:'CleanTableMiniGameScene' });
      // this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MINIGAME, { name:'FocusMiniGameScene' });
      
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.CLOSE_MINIGAME, possibleSounds.sounds.cities.clickPin);
    })
    this.self.on("pointerover", () => {
      // tint when over
      this.self.setTint(0xffd700);
    })

    this.self.on("pointerout", () => {
      // clear tint
      this.self.clearTint();
    })

    // this.objectPin.self.setInteractive();
    // this.objectPin.self.on("pointerdown", () => {
    //   // clear tint
    //   this.self.clearTint();
    //   this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MINIGAME,  { name:'coffeMachine' });
    //   this.eventCenter.emitEvent(this.eventCenter.possibleEvents.CLOSE_MINIGAME, possibleSounds.sounds.cities.clickPin);
    // })

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
