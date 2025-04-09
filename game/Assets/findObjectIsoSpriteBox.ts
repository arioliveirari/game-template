
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
import { Player } from "./Player";
import { RpgIsoPlayerPrincipal } from "./rpgIsoPlayerPrincipal";
import RPG from "../rpg";

export class findObjectIsoSpriteBox extends RpgIsoSpriteBox {

  type: string = "CHICKEN";
  distanceBetweenFloors: number

  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: { x: number, y: number, h: number },
    interactivityPosition?: { x: number, y: number, w: number, h: number },
    distanceBetweenFloors: number = 50,
    isEndpoint: boolean = false
  ) {
    super(scene, x, y, z, texture, frame, group, matrixPosition, interactivityPosition);
    this.self.setScale(0.9);
    this.distanceBetweenFloors = distanceBetweenFloors;  
    if (isEndpoint) {
      this.self.setOrigin(0.5, 0.7)
    }
  }

  findObject(player: RpgIsoPlayerPrincipal) {
        this.scene.handleMinigame("FIND_OBJECT", this);
      }
}
