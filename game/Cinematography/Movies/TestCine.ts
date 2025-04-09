import Phaser from "phaser";
import Ticker, { TickerJob } from "../Ticker";
import DialogueManager from "../DialogueManager";
import CinematographyModular from "../CinematographyHandler";
import { lookup } from "dns";

class TestCine {
  ticker: Ticker;
  cine: CinematographyModular;
  container?: Phaser.GameObjects.Container;
  nextCine: boolean = false;
  dialogue?: DialogueManager;
  background?: Phaser.GameObjects.Image;
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

    this.background = this.cine.add
      .image(0, 0, "cine_placa")
      .setOrigin(0.5, 0.5)
      .setScale(1);

    const gameObjects = [
      this.background
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
      this.background,
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
      // this.dialogue = new DialogueManager(
      //   this.cine,
      //   [
      //     "Test cinemato for the testing of tests",
      //   ],
      //   [],
      //   [
      //     {
      //       delay: 100,
      //       withTapping: {
      //         audios: ["key01", "key01", "key02"],
      //         count: 15,
      //         delay: 180,
      //       },
      //       keepAlive: 1500,
      //       position: {
      //         width: 500
      //       }
      //     },
      //   ],
      //   90
      // );
      // this.dialogue?.play();


      // check width and height of the screen
      const width = this.cine.cameras.main.width;
      const height = this.cine.cameras.main.height;

      // check width and height of this.backgroud
      const bgWidth = this.background!.displayWidth;
      const bgHeight = this.background!.displayHeight;

      // scale the background to fit the smallest side of the screen with the smalles side of the background
      let scale = 1;
      if (width < height) {
        scale = width / bgWidth;
      } else {
        scale = height / bgHeight;
      }

      // consider to fit the background to the screen
      
      let scale2 = 1;
      if (width < height) {
        scale2 = height / bgHeight;
      } else {
        scale2 = width / bgWidth;
      }

      let biggestScale = scale > scale2 ? scale : scale2;
      

      this.background?.setScale(biggestScale);
      this.background?.setAlpha(0.3);
      this.cine.tweens.add({
        targets: this.background,
        alpha: 1,
        duration: 1000,
        ease: "Power2",
        loop: -1,
        yoyo: true,
      })
      this.cine.tweens.add({
        targets: this.background,
        scale: biggestScale + 0.15,
        duration: 20000,
        ease: "Power2",
        loop: -1,
        yoyo: true,
      })

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
