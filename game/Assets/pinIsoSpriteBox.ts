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
import possibleSounds from "../../game/modules/possibleSounds.json";

export class PinIsoSpriteBox extends RpgIsoSpriteBox {
  eventCenter = EventsCenter.getInstance();
  type: string = "PIN";
  assignMission?: number;
  isMechanic: boolean = false;
  mechanicId?: number;
  animationTween?: Phaser.Tweens.Tween;

  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: { x: number; y: number; h: number },
    interactivityPosition?: { x: number; y: number; w: number; h: number }
  ) {
    super(
      scene,
      x,
      y,
      z,
      texture,
      frame,
      group,
      matrixPosition,
      interactivityPosition
    );

    this.self.setScale(.55).setVisible(false)
    this.self.setInteractive();
    this.self.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, {
        modalType: !this.isMechanic ? modalType.QUEST : modalType.MECHANIC,
        pin: this,
      });
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.PLAY_SOUND,
        possibleSounds.sounds.cities.clickPin
      );
    });
  }

  stopTween() {
    if (this.animationTween) {
      this.animationTween.stop();
    }
  }

  startTween() {
    if (this.animationTween) {
      this.animationTween.stop();
    }
    this.animationTween = this.scene.add.tween({
      targets: this.self,
      y: "-=50",
      duration: 1000 + Math.floor(1200*Math.random()),
      repeat: -1,
      delay: 200*Math.random(),
      yoyo: true,
      ease: "power1",
    });
  }
}
