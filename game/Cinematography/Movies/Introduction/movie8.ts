import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie8 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;


  m1s4BackgroundRoom?: Phaser.GameObjects.Image;
  m1s8Character?: Phaser.GameObjects.Sprite;
  m1s8CharacterMouth?: Phaser.GameObjects.Sprite;

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

  playCine(this: Cine1Movie8) {
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

    this.m1s4BackgroundRoom = this.cine.add.image(0, 0, "m1s4Background").setOrigin(0.5, 0.5)
    this.m1s8Character = this.cine.add.sprite(0, 0, "m1s8Character").setOrigin(0.5, 0.5)
    this.m1s8CharacterMouth = this.cine.add.sprite(0, 0, "m1s8CharacterMouth").setOrigin(0.5, 0.5)

    const m1s8CharacterFrames = this.cine.anims.generateFrameNumbers("m1s8Character", {
      frames: [
        0, 1
      ],
    });

    const m1s8CharacterMouthFrames = this.cine.anims.generateFrameNumbers("m1s8CharacterMouth", {
      frames: [
        0, 1, 1, 0, 1, 1, 0
      ],
    });

    this.cine.anims.create({
      key: "m1s8CharacterAnim",
      frames: m1s8CharacterFrames,
      frameRate: 11,
      repeat: -1,
    });

    this.cine.anims.create({
      key: "m1s8CharacterMouthAnim",
      frames: m1s8CharacterMouthFrames,
      frameRate: 14,
      repeat: 1,
      delay: 1000,
      repeatDelay: 1200
    });

    this.m1s8Character.anims.play("m1s8CharacterAnim");
    this.m1s8CharacterMouth.anims.play("m1s8CharacterMouthAnim");

    const gameObjects = [
      this.m1s4BackgroundRoom,
      this.m1s8Character,
      this.m1s8CharacterMouth,
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
          "¿Mi... qué?",
        ],
        [],
        [
          {
            delay: 1000,
            keepAlive: 1500,
            position: {
              width: 600
            }
          }
        ],
        90
      );
      this.dialogue?.play();

      this.cine.tweens.add({
        targets: [this.m1s4BackgroundRoom],
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
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene9" })
  }
}

export default Cine1Movie8;
