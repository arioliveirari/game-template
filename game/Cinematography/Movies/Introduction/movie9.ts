import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie9 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;


  m1s5BackgroundRoom?: Phaser.GameObjects.Image;
  m1s7Wizard?: Phaser.GameObjects.Sprite;
  m1s7WizardEyes?: Phaser.GameObjects.Sprite;
  m1s7WizardMouth?: Phaser.GameObjects.Sprite;

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

  playCine(this: Cine1Movie9) {
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
      x: window.innerWidth / 2915,
      y: window.innerHeight / 1640,
    };

    this.m1s5BackgroundRoom = this.cine.add.image(0, 0, "m1s5BackgroundRoom").setOrigin(0.5, 0.5)
    this.m1s7Wizard = this.cine.add.sprite(0, 0, "m1s7Wizard").setOrigin(0.5, 0.5)
    this.m1s7WizardEyes = this.cine.add.sprite(0, 0, "m1s7WizardEyes", 0).setOrigin(0.5, 0.5)
    this.m1s7WizardMouth = this.cine.add.sprite(0, 0, "m1s7WizardMouth").setOrigin(0.5, 0.5)

    const m1s7WizardFrames = this.cine.anims.generateFrameNumbers("m1s7Wizard", {
      frames: [
        0, 1, 2, 1, 0
      ],
    });

    const m1s7WizardEyesFrames = this.cine.anims.generateFrameNumbers("m1s7WizardEyes", {
      frames: [
        0, 1, 0
      ],
    });

    const m1s7WizardMouthFrames = this.cine.anims.generateFrameNumbers("m1s7WizardMouth", {
      frames: [
        0, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1, 0
      ],
    });

    const m1s7WizardMouthFramesB = this.cine.anims.generateFrameNumbers("m1s7WizardMouth", {
      frames: [
        0, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 0
      ],
    });

    this.cine.anims.create({
      key: "m1s7WizardAnim",
      frames: m1s7WizardFrames,
      frameRate: 11,
      repeat: -1,
    });

    this.cine.anims.create({
      key: "m1s7WizardEyesAnim",
      frames: m1s7WizardEyesFrames,
      frameRate: 11,
      repeat: 3,
      repeatDelay: 500
    });

    this.cine.anims.create({
      key: "m1s7WizardMouthAnim",
      frames: m1s7WizardMouthFrames,
      frameRate: 15,
      delay: 1000,
      repeatDelay: 1000
    });

    this.cine.anims.create({
      key: "m1s7WizardMouthAnimB",
      frames: m1s7WizardMouthFramesB,
      frameRate: 15,
      delay: 200,
    });

    this.m1s7Wizard.anims.play("m1s7WizardAnim");
    this.m1s7WizardEyes.anims.play("m1s7WizardEyesAnim");
    this.m1s7WizardMouth.anims.play("m1s7WizardMouthAnim");
    this.m1s7WizardMouth.on("animationcomplete", () => {
      this.m1s7WizardMouth?.anims.play("m1s7WizardMouthAnimB");
    }
    );
    const gameObjects = [
      this.m1s5BackgroundRoom,
      this.m1s7Wizard,
      this.m1s7WizardEyes,
      this.m1s7WizardMouth,
    ];

    this.container = this.cine.add
      .container(middlePoint.x, middlePoint.y)
      .setSize(2915, 1640);

    this.container.add(gameObjects);

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
      this.dialogue = new DialogueManager(
        this.cine,
        [
          "Tu nueva compañía Chambix",
          "Genial! No?"
        ],
        [],
        [
          {
            delay: 1000,
            keepAlive: 500,
            position: {
              width: 600
            }
          },
          {
            delay: 700,
            keepAlive: 1000,
            position: {
              width: 400
            }
          }
        ],
        90
      );
      this.dialogue?.play();

      this.cine.tweens.add({
        targets: [this.m1s5BackgroundRoom],
        scale: 1.2,
        duration: 40000,
        ease: "linear",
      });

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

  update(this: PossibleMovies, time: number, delta: number) {
    if (this.dialogue) this.dialogue.update();
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene10" })
  }
}

export default Cine1Movie9;
