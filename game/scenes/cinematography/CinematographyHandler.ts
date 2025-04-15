import Phaser from "phaser";
import Ticker from "./assets/Ticker";
import TestCine from "./movies/TestCine";
import MultiScene from "../../Loader/MultiScene";
import { changeSceneTo } from "../../Loader/helpers";
import HoldableButton from "./assets/HoldableButton";

export type SceneKeys = 'TEST'
export type PossibleMovies = TestCine
class CinematographyHandler extends Phaser.Scene {
  ticker: Ticker;
  playingCine?: PossibleMovies;
  nextLevel?: number | undefined;
  code?: string | undefined;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  holdableButton?: HoldableButton;
  keyname?: string;
  UIcontainer?: Phaser.GameObjects.Container;
  graphics?: Phaser.GameObjects.Graphics;
  enabled: boolean = false;
  background?: Phaser.GameObjects.Rectangle;
  
  constructor(keyname: string) {
    super({ key: "CinematographyHandler" });
    this.keyname = keyname;
    const tickerMS = 100;
    this.ticker = new Ticker(tickerMS);
  }

  create(this: CinematographyHandler, data: { keynameCreate: string }) {
    if (data.keynameCreate) this.keyname = data.keynameCreate;
    this.time.delayedCall(4000, () => this.enabled = true)
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.background = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 1).setOrigin(0).setDepth(1)
    this.holdableButton = new HoldableButton(
      this,
      30,
      30,
      20,
      0xffffff,
      "#ffffff66",
      () => {
        if (this.playingCine?.dialogue) {
          this.stopDialogue();
          this.playingCine.dialogue.destroyContainer();
        }
        const multiScene = this.game.scene.getScene("MultiScene") as MultiScene;
        if (multiScene) {
          multiScene.makeTransition("RPG", "CinematographyHandler", "ROOM")
        } else {
          changeSceneTo(this, "RPG", "CinematographyHandler", "ROOM")
        }
        this.stopMusic();
      },
      false
    )

    switch (this.keyname) {
      case "test":
        this.playingCine = new TestCine(this);
        this.nextLevel = 0;
        break;
    }
    
    const UICAM = this.cameras.add(0, 0, window.innerWidth, window.innerHeight);
    UICAM.ignore(this.background);

    
    
    if (this.playingCine && this.playingCine.container) {
      this.playingCine.container.setDepth(999);
      UICAM.ignore(this.playingCine?.container);
    }
  }

  stopDialogue() {
    if (this.playingCine?.dialogue) {
      this.playingCine?.dialogue.stop();
      this.playingCine?.dialogue.stopAudio();
    }
  }

  playMusic(key: string) {
    this.sound.stopAll();
    this.sound.play(key, { loop: true });
  }

  stopMusic() {
    this.sound.stopAll();
  }

  update(time: number, delta: number) {
    if (this.playingCine?.update) this.playingCine?.update(time, delta);
    this.holdableButton?.update();
  }
}

export default CinematographyHandler;
