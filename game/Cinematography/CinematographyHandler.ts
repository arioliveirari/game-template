import Phaser from "phaser";
import Ticker from "./Ticker";
import HoldableButton from "./HoldableButton";
import TestCine from "./Movies/TestCine";
import { changeSceneTo } from "../helpers/helpers";
import MultiScene from "../Loader/MultiScene";
import Cine1Movie1 from "./Movies/Introduction/movie1";
import Cine1Movie2 from "./Movies/Introduction/movie2";
import Cine1Movie3 from "./Movies/Introduction/movie3";
import Cine1Movie4 from "./Movies/Introduction/movie4";
import Cine1Movie5 from "./Movies/Introduction/movie5";
import Cine1Movie6 from "./Movies/Introduction/movie6";
import Cine1Movie10 from "./Movies/Introduction/movie10";
import Cine1Movie11 from "./Movies/Introduction/movie11";
import Cine1Movie7 from "./Movies/Introduction/movie7";
import Cine1Movie8 from "./Movies/Introduction/movie8";
import Cine1Movie9 from "./Movies/Introduction/movie9";

export type SceneKeys = 'TEST'
export type PossibleMovies = TestCine | Cine1Movie1
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
      case "movie1scene1":
        this.playingCine = new Cine1Movie1(this);
        this.nextLevel = 0;
        break;
      case "movie1scene2":
        this.playingCine = new Cine1Movie2(this);
        this.nextLevel = 0;
        break;
      case "movie1scene3":
        this.playingCine = new Cine1Movie3(this);
        this.nextLevel = 0;
        break;
      case "movie1scene4":
        this.playingCine = new Cine1Movie4(this);
        this.nextLevel = 0;
        break;
      case "movie1scene5":
        this.playingCine = new Cine1Movie5(this);
        this.nextLevel = 0;
        break;
      case "movie1scene6":
        this.playingCine = new Cine1Movie6(this);
        this.nextLevel = 0;
        break;
      case "movie1scene7":
        this.playingCine = new Cine1Movie7(this);
        this.nextLevel = 0;
        break;
      case "movie1scene8":
        this.playingCine = new Cine1Movie8(this);
        this.nextLevel = 0;
        break;
      case "movie1scene9":
        this.playingCine = new Cine1Movie9(this);
        this.nextLevel = 0;
        break;
      case "movie1scene10":
        this.playingCine = new Cine1Movie10(this);
        this.nextLevel = 0;
        break;
      case "movie1scene11":
        this.playingCine = new Cine1Movie11(this);
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
