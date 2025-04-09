import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie2 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;

  m1s1background?: Phaser.GameObjects.Image;
  m1s1backgroundStars?: Phaser.GameObjects.Image;
  m1s1moon?: Phaser.GameObjects.Image;

  m1s2backgroundRoom?: Phaser.GameObjects.Image;
  m1s2character?: Phaser.GameObjects.Sprite;
  m1s2characterEye?: Phaser.GameObjects.Sprite;

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

  playCine(this: Cine1Movie2) {
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
      y: window.innerHeight / 1450,
    };

    this.m1s1background = this.cine.add.image(0, 0, "m1s1background").setOrigin(0.5, 0.5)
    this.m1s1backgroundStars = this.cine.add.image(-210, 0, "m1s1backgroundStars").setOrigin(0.5, 0.5).setScale(1.2)
    this.m1s1moon = this.cine.add.image(-730, -200, "m1s1moon").setOrigin(0.5, 0.5).setScale(1.2)
    this.m1s2backgroundRoom = this.cine.add.image(0, 0, "m1s2backgroundRoom").setOrigin(0.5, 0.5)
    const m1s2CharacterAnim = this.cine.anims.generateFrameNumbers("m1s2character", {
      frames: [
        0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1
      ],
    });
    this.cine.anims.create({
      key: "m1s2CharacterAnim",
      frames: m1s2CharacterAnim,
      frameRate: 11,
      repeat: -1,
    });
    const m1s2CharacterAnimEye = this.cine.anims.generateFrameNumbers("m1s2characterEye", {
      frames: [
        0, 1, 2, 3, 4, 3, 2, 1, 0
      ],
    });
    this.cine.anims.create({
      key: "m1s2CharacterAnimEye",
      frames: m1s2CharacterAnimEye,
      frameRate: 11,
      repeat: -1,
      repeatDelay: 1000
    });

    const m1s2CharacterAnimB = this.cine.anims.generateFrameNumbers("m1s2characterB", {
      frames: [
        0, 1
      ],
    }); 
    this.cine.anims.create({
      key: "m1s2CharacterAnimB",
      frames: m1s2CharacterAnimB,
      frameRate: 11,
      repeat: -1,
    });
    const m1s2CharacterAnimEyeB = this.cine.anims.generateFrameNumbers("m1s2characterEyeB", {
      frames: [
        1,0
      ],
    }); 
    this.cine.anims.create({
      key: "m1s2CharacterAnimEyeB",
      frames: m1s2CharacterAnimEyeB,
      frameRate: 6,
      repeat: 2,
      
    });


    this.m1s2character = this.cine.add.sprite(400, 210, "m1s2character").setOrigin(0.5, 0.5)
    this.m1s2character.anims.play("m1s2CharacterAnim");

    this.m1s2characterEye = this.cine.add.sprite(400, 210, "m1s2characterEye").setOrigin(0.5, 0.5)
    this.m1s2characterEye.anims.play("m1s2CharacterAnimEye");



    const gameObjects = [
      this.m1s1background,
      this.m1s1backgroundStars,
      this.m1s1moon,
      this.m1s2backgroundRoom,
      this.m1s2character,
      this.m1s2characterEye,
    ];

    this.container = this.cine.add
      .container(middlePoint.x, middlePoint.y)
      .setSize(2915, 1450);

    this.container.add(gameObjects);

    this.container.setScale(
      gameObjectScaler.x < gameObjectScaler.y
        ? gameObjectScaler.y
        : gameObjectScaler.x
    );
    // this.container.setScale(0.3)
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
          "Memes, videos, lo de siempre.",
        ],
        [],
        [
          {
            delay: 100,
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
        targets: [this.m1s1backgroundStars, this.m1s1moon],
        scale: 1.4,
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

    const part2 =  (job: TickerJob) => {
      this.dialogue = new DialogueManager(
        this.cine,
        [
          "¿Qué?",
        ],
        [],
        [
          {
            delay: 1500,
            keepAlive: 2000,
            position: {
              width: 500
            }
          },
        ],
        90
      );
      this.dialogue?.play();
      this.m1s2characterEye?.setTexture("m1s2CharacterEyeB", 0);
      this.m1s2character?.anims.play("m1s2CharacterAnimB");
      this.m1s2characterEye?.anims.play("m1s2CharacterAnimEyeB");
  

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
        this.ticker.addJob(
          new TickerJob(2, 10, part2, false, undefined, true, (job: TickerJob) => {
            this.nextCine = true;
          }
          ))
      }
      ))
  }

  update(this: PossibleMovies, time: number, delta: number) {
    if (this.dialogue) this.dialogue.update();
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene3" })
  }
}

export default Cine1Movie2;
