import RPG from "@/game/rpg";
import Phaser from "phaser";
import { Avatar, DayBlock } from "./UIAssets";
import { globalState } from "@/game/GlobalDataManager";
import { changeSceneTo } from "@/game/helpers/helpers";
import EventsCenterManager from "../../services/EventsCenter";
import possibleSounds from "../../../game/modules/possibleSounds.json";
import { PossibleCity } from "@/game/helpers/models";
import { MissionTrofyChallenge } from "@/game/services/EventChallengeListener";

export default class UIContainer extends Phaser.GameObjects.Container {
  scene: RPG;
  tabletIcon: Phaser.GameObjects.Image;
  redDot: Phaser.GameObjects.Image;
  activeTween: Phaser.Tweens.Tween | null = null;
  nivel: PossibleCity;
  stateGlobal: globalState;
  // dayBlock: DayBlock;
  avatar: Avatar;
  eventCenter = EventsCenterManager.getInstance();
  blackScreen: Phaser.GameObjects.Rectangle;
  // testText: Phaser.GameObjects.Text;
  stateOfInversion: boolean = false;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    nivel: PossibleCity,
    data: globalState
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.nivel = nivel;
    this.stateGlobal = data;
    this.stateOfInversion = data.inversionModule.isActive;

    this.avatar = new Avatar(scene, 0, -500, this.stateGlobal).setDepth(99);
    this.scene.tweens.add({
      targets: this.avatar,
      y: -5,
      duration: 2000,
      delay: 1000,
      ease: "bounce",
    });

    let that = this;

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.TROFY_COMPLETED,
      (data: {trofy: MissionTrofyChallenge, delay?: number}) => {
        //this.modalManager.destroyModal();
        const popUpManager = scene.popUpManager;

        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.TROFIES_UPDATE, data.trofy);
        if (popUpManager) {
          // 3 sec game delay
          this.scene.time.delayedCall(2200 * (data.delay ? data.delay : 1), () => {
            const t = popUpManager.createTrofyModal(data.trofy);

          })
        }
      },
      this
    );



    // listen CHAT_OPEN event and check if there is any chat pending reading to show the red dot or not
    this.eventCenter.on(this.eventCenter.possibleEvents.CHAT_OPEN, () => {
      this.checkChatDot();
    });

    // const buttonChangeScene = this.scene.add
    //   .image(
    //     -150,
    //     window.innerHeight - 50,
    //     nivel === "ROOM" ? "goBack" : "goRoom"
    //   )
    //   .setOrigin(0, 1)
    //   .setInteractive();
    // buttonChangeScene.on("pointerdown", () => {
    //   if (nivel === "ROOM") {
    //     changeSceneTo(this.scene, "MenuScene", "RPG", undefined);
    //     this.eventCenter.emitEvent(
    //       this.eventCenter.possibleEvents.PLAY_SOUND,
    //       possibleSounds.sounds.UI.buttonGoBack
    //     );
    //   } else {
    //     changeSceneTo(this.scene, "RPG", "RPG", "ROOM");
    //     this.eventCenter.emitEvent(
    //       this.eventCenter.possibleEvents.LEAVE_CITY,
    //       undefined
    //     );
    //     this.eventCenter.emitEvent(
    //       this.eventCenter.possibleEvents.PLAY_SOUND,
    //       possibleSounds.sounds.UI.buttonGoBack
    //     );
    //   }
    // });

    // this.scene.tweens.add({
    //   targets: buttonChangeScene,
    //   x: 50,
    //   duration: 1000,
    //   delay: 1000,
    //   ease: "bounce",
    // });

    this.tabletIcon = this.scene.add
      .image(window.innerWidth - 90, window.innerHeight + 150, "tabletIcon")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.game.scene.bringToTop("TabletScene");
        this.scene.tabletScene?.showOrHideTablet();
        this.scene.tabletScene?.moveCamerasTo();
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.PLAY_SOUND,
          possibleSounds.sounds.UI.tabletIcon
        );
      });

    this.redDot = this.scene.add
      .image(window.innerWidth - 90, window.innerHeight + 150, "redDot")
      .setOrigin(-1.55, 4.7)
      .setScale(0.3)
      .setAlpha(0);
    this.redDot.setTint(0xff0000);
    this.scene.tweens.add({
      targets: [this.tabletIcon, this.redDot],
      y: window.innerHeight + 10,
      duration: 2000,
      delay: 1000,
      ease: "ease",
    });
    this.tabletIcon.on("pointerover", () => {
      this.tabletIcon.setTexture("tabletIconOn");
      if (this.activeTween) this.activeTween.stop();
      this.activeTween = this.scene.tweens.add({
        targets: [this.tabletIcon, this.redDot],
        y: window.innerHeight - 100,
        duration: 200,
        ease: "ease",
      });
    });

    this.tabletIcon.on("pointerout", () => {
      this.tabletIcon.setTexture("tabletIcon");
      if (this.activeTween) this.activeTween.stop();
      this.activeTween = this.scene.tweens.add({
        targets: [this.tabletIcon, this.redDot],
        y: window.innerHeight + 10,
        duration: 200,
        ease: "ease",
      });
    });
    this.checkChatDot();
    this.blackScreen = this.scene.add
      .rectangle(
        -100,
        -100,
        window.innerWidth + 200,
        window.innerHeight + 200,
        0x000000,
        1
      )
      .setOrigin(0, 0)
      .setAlpha(0);

    this.add([
      // buttonChangeScene,
      this.avatar,
      this.tabletIcon,
      this.redDot,
      this.blackScreen,
    ]);

    this.scene.add.existing(this);
    this.scene.cameras.main.ignore(this);
  }

  checkChatDot() {
    const active =
      this.stateGlobal.chatModule.checkIfThereIsAnyChatPendingReading();
    if (active) {
      this.redDot.setAlpha(1);
    } else {
      this.redDot.setAlpha(0);
    }
  }
  updateData(data: globalState) {
    if (this.stateOfInversion !== data.inversionModule.isActive) {
      this.avatar.createDayBlock(data);
    }
    if (data.inversionModule.isActive) {
      this.avatar.bubble?.setVisible(true);
      this.avatar.inversionBubbleNumber?.setVisible(true);
      this.avatar.iconInvestment?.setVisible(true);
    } else {
      this.avatar.bubble?.setVisible(false);
      this.avatar.inversionBubbleNumber?.setVisible(false);
      this.avatar.iconInvestment?.setVisible(false);
    }
    this.stateGlobal = data;
    this.stateOfInversion = data.inversionModule.isActive;
    this.avatar.updateValues(data);
  }

  // changeValuesUI(amount: number, type: "money" | "reputation" | "invested") {
  //     const yPos = type === "invested" ? 185 : type === "money" ? 145 : 105
  //     const finalXPos = type === "invested" ? 310 : type === "money" ? 340 : 320
  //     const changeNumber = this.scene.add.text(100, yPos, amount < 0 ? amount.toString() : "+" + amount.toString(), {
  //         fontSize: '30px',
  //         color: amount < 0 ? 'red' : 'green',
  //         fontFamily: "MontserratSemiBold",
  //     }).setOrigin(0, 0).setAlpha(0)
  //     if (amount < 0) {
  //         this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.UI.loseMoney);
  //     } else {
  //         this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.UI.gainMoney);
  //     }
  //     this.add(changeNumber)
  //     this.sort('alpha')
  //     this.scene.tweens.add({
  //         targets: changeNumber,
  //         x: finalXPos,
  //         alpha: 1,
  //         duration: 800,
  //         ease: 'ease',
  //         onComplete: () => {
  //             this.scene.tweens.add({
  //                 targets: changeNumber,
  //                 y: -500,
  //                 alpha: 0,
  //                 duration: 1500,
  //                 delay: 800,
  //                 ease: 'ease',
  //                 onComplete: () => {
  //                     changeNumber.destroy()
  //                 }
  //             })
  //         }
  //     })
  // }
}
