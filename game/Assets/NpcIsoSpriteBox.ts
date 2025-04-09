
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

export class NPCisoSpriteBox extends RpgIsoSpriteBox {
  eventCenter = EventsCenter.getInstance();
  type: string = "NPC";

  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: {x: number, y: number, h: number},
    interactivityPosition?: {x: number, y: number, w: number, h: number},
  ) {

    const poolForNpcs = [
      "npc01",
      "npc02",
      "npc03",
      "npc04",
      "npc05",
      "npc06",
    ]

    const randomNpc = Math.floor(Math.random() * poolForNpcs.length);
    super(scene, x, y, z, poolForNpcs[randomNpc], frame, group, matrixPosition, interactivityPosition);
    this.customDepth = this.self.depth + 150

    // add animation to npc iterating the first 20 frames in infinity loop

    // this.scene.anims.create({
    //   key: 'npcIdle',
    //   frames: this.scene.anims.generateFrameNumbers('playerIdle', { start: 0, end: 19 }),
    //   frameRate: 30,
    //   repeat: -1
    // });

    // this.self.anims.play('npcIdle', true);

    // add random tint to npc
    const random = 0x000000 + Math.random() * 0xffffff
    this.self.setTint(random);

    
    this.self.setScale(0.4);

  }
  

 
}
