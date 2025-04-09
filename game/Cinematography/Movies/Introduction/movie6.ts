import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie6 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;


  m1s4BackgroundRoom?: Phaser.GameObjects.Image;
  m1s6Character?: Phaser.GameObjects.Sprite;
  m1s6CharacterEyes?: Phaser.GameObjects.Sprite;
  m1s6CharacterMouth?: Phaser.GameObjects.Sprite;

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

  playCine(this: Cine1Movie6) {
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
    this.m1s6Character = this.cine.add.sprite(0, 0, "m1s6Character").setOrigin(0.5, 0.5)
    this.m1s6CharacterEyes = this.cine.add.sprite(0, 0, "m1s6CharacterEyes", 0).setOrigin(0.5, 0.5)
    this.m1s6CharacterMouth = this.cine.add.sprite(0, 0, "m1s6CharacterMouth").setOrigin(0.5, 0.5)

    const m1s6CharacterFrames = this.cine.anims.generateFrameNumbers("m1s6Character", {
      frames: [
        0, 1
      ],
    });

    const m1s6CharacterEyesFrames = this.cine.anims.generateFrameNumbers("m1s6CharacterEyes", {
      frames: [
        0, 1, 2, 3, 2, 1, 0
      ],
    });

    const m1s6CharacterMouthFrames = this.cine.anims.generateFrameNumbers("m1s6CharacterMouth", {
      frames: [
        0, 1, 2, 3, 3, 2, 3, 2, 1
      ],
    });

    this.cine.anims.create({
      key: "m1s6CharacterAnim",
      frames: m1s6CharacterFrames,
      frameRate: 11,
      repeat: -1,
    });

    this.cine.anims.create({
      key: "m1s6CharacterEyesAnim",
      frames: m1s6CharacterEyesFrames,
      frameRate: 11,
      repeat: 2,
    });

    this.cine.anims.create({
      key: "m1s6CharacterMouthAnim",
      frames: m1s6CharacterMouthFrames,
      frameRate: 15,
      repeat: 1,
      delay: 1000,
      repeatDelay: 500
    });

    this.m1s6Character.anims.play("m1s6CharacterAnim");
    this.m1s6CharacterEyes.anims.play("m1s6CharacterEyesAnim");
    this.m1s6CharacterMouth.anims.play("m1s6CharacterMouthAnim");

    const gameObjects = [
      this.m1s4BackgroundRoom,
      this.m1s6Character,
      this.m1s6CharacterEyes,
      this.m1s6CharacterMouth,
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
          "¿Qué?... ¿Cómo?...",
        ],
        [],
        [
          {
            delay: 1000,
            keepAlive: 1000,
            position: {
              width: 500
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
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene7" })
  }
}

export default Cine1Movie6;
