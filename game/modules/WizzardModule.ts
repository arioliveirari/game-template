// Module (CLASS): InversionModule
// it will recopile all the inversions active and indicates with events if any inversion has completed or changed state by period or day

import { CubeIsoSpriteBox } from "../Assets/cubeIsoSpriteBox";
import { findObjectIsoSpriteBox } from "../Assets/findObjectIsoSpriteBox";
import { RpgIsoPlayerPrincipal } from "../Assets/rpgIsoPlayerPrincipal";
import { PossibleCity } from "../helpers/models";
import RPG from "../rpg";
import ObserverPatronModule from "./ObserverPatronModule";

export class WizzardSprite extends Phaser.GameObjects.Container {
  followObject?: Phaser.GameObjects.Sprite | RpgIsoPlayerPrincipal | CubeIsoSpriteBox | findObjectIsoSpriteBox;
  isFollowing: boolean = false;
  insideObject: Phaser.GameObjects.Sprite;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, mapType: PossibleCity = "CITY") {
    super(scene, x, y);
    this.insideObject = scene.add.sprite(0, 0, `${texture}_anim`, 0);
    this.add(this.insideObject);
    scene.add.existing(this);
    this.scene = scene;
    scene.events.on("update", this.update, this);
    this.setDepth(1000000); 
    this.setScale(0.6);
    if(mapType !== "ROOM") this.setScale(0.3);
    this.insideObject.setFlipX(false);
    this.startTweenCombo(scene);
    scene.anims.create({
      key: `wizzard_anim`,
      frames: scene.anims.generateFrameNames(`${texture}_anim`, {
        start: 0,
        end: 6,
      }),
      yoyo: true,
      frameRate: 10,
      repeat: -1,
    });
    this.insideObject.play(`wizzard_anim`);
  }

  startTweenCombo(scene: Phaser.Scene) {
    this.insideObject.setFlipX(false);
    
    const loop = (lap: number) => {
      let width;
      if(this.followObject && (this.followObject as RpgIsoPlayerPrincipal).self) width = (this.followObject as RpgIsoPlayerPrincipal).self.getBounds().width;
      else if (this.followObject) width = (this.followObject as Phaser.GameObjects.Sprite).getBounds().width;
      else width = 100;

      let height;
      if(this.followObject && (this.followObject as RpgIsoPlayerPrincipal).self) height = (this.followObject as RpgIsoPlayerPrincipal).self.getBounds().height;
      else if (this.followObject) height = (this.followObject as Phaser.GameObjects.Sprite).getBounds().height;
      else height = 75;

      if (lap % 2 === 0) {
        scene.tweens.add({
          targets: this.insideObject,
          duration: 1500,
          x: this.insideObject.x - width,
          y: this.insideObject.y - height,
          ease: "ease",
          yoyo: true,
          onYoyo: () => {
            this.insideObject.setFlipX(false);
            let depth = 0
            if(this.followObject && (this.followObject as RpgIsoPlayerPrincipal).self) depth = (this.followObject as RpgIsoPlayerPrincipal).self.depth;
            else if (this.followObject) depth = (this.followObject as Phaser.GameObjects.Sprite).depth;
            if(this.followObject) this.setDepth(depth + 100);
          },
          onComplete: () => {
            loop(lap + 1);
          },
        });
      } else {
        scene.tweens.add({
          targets: this.insideObject,
          duration: 1500,
          ease: "ease",
          x: this.insideObject.x + width,
          y: this.insideObject.y + height,
          yoyo: true,
          onYoyo: () => {
            this.insideObject.setFlipX(true);
            let depth = 0
            if(this.followObject && (this.followObject as RpgIsoPlayerPrincipal).self) depth = (this.followObject as RpgIsoPlayerPrincipal).self.depth;
            else if (this.followObject) depth = (this.followObject as Phaser.GameObjects.Sprite).depth;
            if(this.followObject) this.setDepth(depth - 100);
          },
          onComplete: () => {
            loop(lap + 1);
          },
        });
      }
    };

    loop(0);
  }
  startFollow(follow: Phaser.GameObjects.Sprite | RpgIsoPlayerPrincipal | CubeIsoSpriteBox | findObjectIsoSpriteBox) {
    this.followObject = follow;
    this.isFollowing = true;
    // add opacity shown effect to this.sprite
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      duration: 500,
      alpha: 1,
    });
  }

  stopFollow() {
    this.isFollowing = false;
  }

  update(): void {
    const paddingY = 60;
    if (this.isFollowing && this.followObject) {
      this.x = (this.followObject as Phaser.GameObjects.Sprite).x;
      this.y = (this.followObject as Phaser.GameObjects.Sprite).y - paddingY;
    }
  }
}

export class CompanionWizzard {
  name: string;
  scene?: Phaser.Scene | RPG;
  sprite?: WizzardSprite;
  followObject?: Phaser.GameObjects.Sprite | RpgIsoPlayerPrincipal;

  constructor(name: string) {
    this.name = name;
  }

  playCompanion(
    scene: Phaser.Scene | RPG,
    follow?: Phaser.GameObjects.Sprite | RpgIsoPlayerPrincipal,
    mapType: PossibleCity = "CITY"
  ) {
    this.scene = scene;
    if(this.sprite) this.sprite.destroy();
    this.sprite = new WizzardSprite(scene, 0, 0, this.name, mapType);
    if (follow) this.sprite.startFollow(follow);
  }
}

export interface WizzardState {
  isActive: boolean;
  isPaused: boolean;
  companion: CompanionWizzard;
  texture: string;
}

class WizzardModule extends ObserverPatronModule<Partial<WizzardState>> {
  protected state: WizzardState;
  
  constructor(texture = "wizzardAqua") {
    super({});
    this.state = {
      isActive: false,
      isPaused: false,
      companion: new CompanionWizzard(texture),
      texture: texture,
    };

    // add delayed call
    //    setTimeout(() => {
    //     this.setActive(false);
    //    },10000)
  }

  setActive(active: boolean) {
    this.state.isActive = active;
    this.state.companion.sprite?.setVisible(active);
    this.state.companion.sprite?.setAlpha(active ? 1 : 0);
  }

  getWState(): Partial<WizzardState> {
    let newState = {
      isActive: this.state.isActive,
      isPaused: this.state.isPaused,
      texture: this.state.texture,
    };
    return newState;
  }

  setWState(state: Partial<WizzardState>) {

    Object.keys(state).forEach(key => {
      if (state[key as keyof WizzardState] !== undefined) {
        // @ts-ignore
        this.state[key as keyof WizzardState] = state[key as keyof WizzardState];       
      }
    });

  }
}

export default WizzardModule;
