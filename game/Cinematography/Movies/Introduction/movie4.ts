import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie4 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;


  m1s4BackgroundRoom?: Phaser.GameObjects.Image;
  m1s4Character?: Phaser.GameObjects.Sprite;
  m1s4CharacterMouth?: Phaser.GameObjects.Sprite;

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

  playCine(this: Cine1Movie4) {
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
    this.m1s4Character = this.cine.add.sprite(0, 0, "m1s4Character").setOrigin(0.5, 0.5)
    this.m1s4CharacterMouth = this.cine.add.sprite(0, -2, "m1s4CharacterMouth").setOrigin(0.5, 0.5)
    const m1s4CharacterFrames = this.cine.anims.generateFrameNumbers("m1s4Character", {
      frames: [
        0, 1
      ],
    });
    const m1s4CharacterMouthFrames = this.cine.anims.generateFrameNumbers("m1s4CharacterMouth", {
      frames: [
        0, 1, 2, 3, 2, 3, 2, 3, 2, 1, 2, 3, 1, 3, 2,
      ],
    });

    this.cine.anims.create({
      key: "m1s4CharacterAnim",
      frames: m1s4CharacterFrames,
      frameRate: 11,
      repeat: -1,
    });
    this.cine.anims.create({
      key: "m1s4CharacterMouthAnim",
      frames: m1s4CharacterMouthFrames,
      frameRate: 6,
      delay: 700,
    });

    this.m1s4Character.anims.play("m1s4CharacterAnim");
    this.m1s4CharacterMouth.anims.play("m1s4CharacterMouthAnim");

    const gameObjects = [
      this.m1s4BackgroundRoom,
      this.m1s4Character,
      this.m1s4CharacterMouth,
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
          "Me pregunto qué será...",
        ],
        [],
        [
          {
            delay: 400,
            keepAlive: 1000,
            position: {
              width: 500
            }
          }
        ],
        90
      );
      this.dialogue?.play();

      // this.cine.tweens.add({
      //   targets: [this.cine.cameras.main],
      //   zoom: 1.2,
      //   duration: 40000,
      //   ease: "linear",
      // });

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
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene5" })
  }
}

export default Cine1Movie4;
