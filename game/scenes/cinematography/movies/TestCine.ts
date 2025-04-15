import Phaser from "phaser";
import Ticker, { TickerJob } from "../assets/Ticker";
import DialogueManager from "../assets/DialogueManager";
import CinematographyModular from "../CinematographyHandler";

class TestCine {
  ticker: Ticker;
  cine: CinematographyModular;
  container?: Phaser.GameObjects.Container;
  nextCine: boolean = false;
  dialogue?: DialogueManager;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(cine: CinematographyModular) {
    this.cine = cine;
    const tickerMS = 100;
    this.ticker = new Ticker(tickerMS);
    this.playCine();
  }

  stopDialogue(notDestroy?: boolean) {
    this.dialogue?.stop();
    if (notDestroy) {
      this.dialogue?.destroyContainer();
      this.dialogue = undefined;
    }
  }

  playCine(this: TestCine) {
    this.cine.time.addEvent({
      delay: this.ticker.ms,
      callback: this.ticker.runTicker,
      loop: true,
    });

    this.cursors = this.cine.input.keyboard?.createCursorKeys();

    const middlePoint = {
      x: this.cine.cameras.main.displayWidth / 2,
      y: this.cine.cameras.main.displayHeight / 2,
    };

    const gameObjectScaler = {
      x: window.innerWidth / 1920,
      y: window.innerHeight / 927,
    };

    const gameObjects = [
    ];

    const darkMask = this.cine.add.rectangle(
      0,
      0,
      window.innerWidth * 2,
      window.innerHeight * 2,
      0,
      1
    );

    this.container = this.cine.add
      .container(middlePoint.x, middlePoint.y)
      .setSize(1920, 927);

    this.container.add([
      darkMask,
    ]);

    this.container.setScale(
      gameObjectScaler.x < gameObjectScaler.y
        ? gameObjectScaler.y
        : gameObjectScaler.x
    );

    const cameraDialogue = this.cine.cameras.add(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    cameraDialogue.ignore(this.container);
//@ts-ignore
cameraDialogue.ignore(this.cine.background);

    const part = (job: TickerJob) => {

      const dialogueListener = (newState: string, nextText?: string) => {
        if (newState === "CONTINUE") {
        } else if (newState === "FINISHED") {
          this.ticker.deleteJob(job.id);
        }
      };

      this.dialogue?.killState(dialogueListener);
      this.dialogue?.getState(dialogueListener);
    };

    this.ticker.addJob(
      new TickerJob(1, 10, part, false, undefined, true, (job: TickerJob) => {
        this.nextCine = true;
      }
      ));

      
  }

  update(this: TestCine, time: number, delta: number) {
    if (this.dialogue) this.dialogue.update();
    if (this.nextCine) {
      this.cine.scene.restart({ keyname: "test" })
    }
  }
}

export default TestCine;
