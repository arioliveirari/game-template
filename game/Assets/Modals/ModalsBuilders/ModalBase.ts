import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import possibleSounds from "../../../../game/modules/possibleSounds.json";
import { config } from "process";
import { checkIfMobile } from "@/game/helpers/helpers";

export type WizardModalConfig = {
  type: string;
  size: number;
  pos: number;
  isTop: boolean;
  tweenWizardIn?: Function;
  tweenWizardOut?: Function;
  image?: Phaser.GameObjects.Image;
  x?: number;
  y?: number;
};
export enum AppearModeEnum {
  FROMLEFT = "fromLeft",
  FROMCENTER = "fromCenter",
}
export class ModalBase extends Phaser.GameObjects.Container {
  scene: RPG;
  modalContainerWithElements: Phaser.GameObjects.Container;
  wizardContainer: Phaser.GameObjects.Container;
  wizardModal?: WizardModalConfig;
  backgroundLess: Phaser.GameObjects.Rectangle;
  handleClose: () => void;
  eventCenter = EventsCenterManager.getInstance();
  appearMode: AppearModeEnum = AppearModeEnum.FROMCENTER;
  baseScale:number = 1;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    appearMode?: AppearModeEnum
  ) {
    super(scene, x, y);
    if(appearMode) this.appearMode = appearMode;
    this.scene = scene;

    this.backgroundLess = scene.add.rectangle(
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      0x000000,
      0.5
    ).setDepth(1);
    this.backgroundLess.setInteractive();
    this.backgroundLess.on("pointerdown", () => {
      this.handleClose();
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.PLAY_SOUND,
        possibleSounds.sounds.modals.modalMission.buttonClose
      );
    });

    let ta = {};
    let tb = {};
    
    if(checkIfMobile(this.scene)){
      this.baseScale = 0.8;
    }

    if (this.appearMode === AppearModeEnum.FROMLEFT) {
      this.modalContainerWithElements = this.scene.add.container(
        -window.innerWidth,
        0
      );
      ta = {
        x: 0,
      };

      tb = {
        x: -window.innerWidth,
      };
    } else {
      //if(this.appearMode === AppearModeEnum.FROMCENTER) default
      this.modalContainerWithElements = this.scene.add
        .container(0, 0)
        .setScale(0)
        .setAlpha(0);
      ta = {
        scale: this.baseScale,
        alpha: 1,
      };

      tb = {
        scale: 0,
        alpha: 0,
      };
    }

    this.wizardContainer = this.scene.add.container(0, 0);

    this.scene.tweens.chain({
      targets: this.modalContainerWithElements,
      tweens: [
        {
          ...ta,
          ease: "power3",
          duration: 300,
          onUpdate: () => {
            this.fireUpdate();
          },
        },
      ],
      onComplete: () => {
        this.modalContainerWithElements.x = 0;
        this.modalContainerWithElements.y = 0;
        if (this.wizardModal && this.wizardModal.tweenWizardIn)
          this.wizardModal.tweenWizardIn();
      },
    });

    this.handleClose = () => {
      if (this.wizardModal && this.wizardModal.tweenWizardOut)
        this.wizardModal.tweenWizardOut();
      const chain = this.scene.tweens.chain({
        targets: this.modalContainerWithElements,
        //persist: true,
        tweens: [
          {
            ...tb,
            ease: "power3",
            duration: 300,
            onUpdate: () => {
              this.fireUpdate();
            },
          },
        ],
        onComplete: () => {
          this.fireClose();
          this.removeAll(true);
          // this.destroy(); //CHEQUEAR
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.CLOSE_MODAL,
            undefined
          );
        },
      });
    };

    this.add([
      this.backgroundLess,
      this.modalContainerWithElements,
      this.wizardContainer,
    ]);

    this.modalContainerWithElements.setScale(this.baseScale).setDepth(2)

    this.scene.add.existing(this);
    this.scene.cameras.main.ignore(this);

 
  }
 

  createRandomWizard(size: number, pos: number, type?: string) {
    if (!type) type = "wizzardAqua";
    let x = 0;
    let y = 0;
    let oriX = 0.5;
    let oriY = 0.5;
    let isFlipX = false;
    let isFlipY = false;
    let isVisible = true;

    const wizardWidth = 440;
    const wizardHeight = 462;

    switch (pos) {
      case 1:
        x = -window.innerWidth / 2;
        y = -window.innerHeight / 2;
        oriX = 0;
        oriY = 0;
        isFlipX = true;
        break;
      case 2:
        this.wizardModal = { type, size, pos, y: -462, isTop: true };
        x = 0;
        y = 0;
        oriX = 0.5;
        oriY = 0;
        isFlipX = false;
        this.wizardModal.image = this.scene.add
          .image(x, y, type + `_${pos}`)
          .setOrigin(oriX, oriY)
          .setFlipX(isFlipX)
          .setFlipY(isFlipY);

        this.wizardModal.tweenWizardIn = () => {
          if (this.wizardModal && this.wizardModal.y) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              y: this.wizardModal.y ? this.wizardModal.y : 0,
              duration: 750,
              ease: "power3",
            });
          }
        };

        this.wizardModal.tweenWizardOut = () => {
          if (this.wizardModal && this.wizardModal.y) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              y: -this.wizardModal.y,
              duration: 350,
              ease: "power3",
              onComplete: () => {
                this.wizardContainer.removeAll(true);
              },
            });
          }
        };

        break;
      case 3:
        x = window.innerWidth / 2;
        y = -window.innerHeight / 2;
        oriX = 1;
        oriY = 0;
        isFlipX = false;
        break;
      case 4:
        //x = -window.innerWidth / 2 + 220;
        this.wizardModal = { type, size, pos, x: -658, isTop: false };
        x = 0;
        y = 0;
        oriX = 0;
        oriY = 0.5;
        isFlipX = true;
        this.wizardModal.image = this.scene.add
          .image(x, y, type + `_${pos}`)
          .setOrigin(oriX, oriY)
          .setFlipX(isFlipX)
          .setFlipY(isFlipY);

        this.wizardModal.tweenWizardIn = () => {
          if (this.wizardModal && this.wizardModal.x) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              x: this.wizardModal.x ? this.wizardModal.x : 0,
              duration: 750,
              ease: "power3",
            });
          }
        };

        this.wizardModal.tweenWizardOut = () => {
          if (this.wizardModal && this.wizardModal.x) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              x: -window.innerWidth,
              duration: 350,
              ease: "power3",
              onComplete: () => {
                this.wizardContainer.removeAll(true);
              },
            });
          }
        };

        break;
      case 5:
      case 42:
        //x = window.innerWidth / 2 - 220;
        this.wizardModal = { type, size, pos, x: 658, isTop: false };
        x = 0;
        y = 0;
        oriX = 1;
        oriY = 0.5;
        isFlipX = false;
        this.wizardModal.image = this.scene.add
          .image(x, y, type + `_${pos}`)
          .setOrigin(oriX, oriY)
          .setFlipX(isFlipX)
          .setFlipY(isFlipY);

        this.wizardModal.tweenWizardIn = () => {
          if (this.wizardModal && this.wizardModal.x) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              x: this.wizardModal.x ? this.wizardModal.x : 0,
              duration: 750,
              ease: "power3",
            });
          }
        };

        this.wizardModal.tweenWizardOut = () => {
          if (this.wizardModal && this.wizardModal.x) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              x: -this.wizardModal.x,
              duration: 350,
              ease: "power3",
              onComplete: () => {
                this.wizardContainer.removeAll(true);
              },
            });
          }
        };

        break;
      case 6:
        x = -window.innerWidth / 2;
        y = window.innerHeight / 2;
        oriX = 0;
        oriY = 1;
        isFlipX = true;
        break;
      case 7:
        this.wizardModal = {
          type,
          size,
          pos,
          y: window.innerHeight / 2 - 20,
          isTop: true,
        };
        x = 0;
        y = window.innerHeight + 50;
        oriX = 0.5;
        oriY = 1;
        isFlipX = false;
        isFlipY = false;
        this.wizardModal.image = this.scene.add
          .image(x, y, type + `_${pos}`)
          .setOrigin(oriX, oriY)
          .setFlipX(isFlipX)
          .setFlipY(isFlipY);

        this.wizardModal.tweenWizardIn = () => {
          if (this.wizardModal && this.wizardModal.y) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              y: this.wizardModal.y ? this.wizardModal.y : 0,
              duration: 750,
              ease: "power3",
            });
          }
        };

        this.wizardModal.tweenWizardOut = () => {
          if (this.wizardModal && this.wizardModal.y) {
            this.scene.tweens.add({
              targets: this.wizardModal.image,
              y: window.innerHeight + 50,
              duration: 350,
              ease: "power3",
              onComplete: () => {
                this.wizardContainer.removeAll(true);
              },
            });
          }
        };
        break;
      case 8:
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
        oriX = 1;
        oriY = 1;
        isFlipX = false;
        break;
      default:
        break;
    }

    if (860 + wizardWidth > window.innerWidth || 462 + wizardHeight > window.innerHeight) {
      isVisible = false;
    }

    if (this.wizardModal && this.wizardModal.image) {
      this.wizardModal.image.setScale(size).setVisible(isVisible);

      this.modalContainerWithElements.add(this.wizardModal.image);
    }
  }

  fireClose() {}
  fireUpdate() {}
}
