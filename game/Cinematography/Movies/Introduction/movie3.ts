import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie3 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;


  m1s3BackgroundRoom?: Phaser.GameObjects.Image;
  m1s3ChambixText?: Phaser.GameObjects.Image;
  m1s3CharacterHands?: Phaser.GameObjects.Image;
  m1s3Violet?: Phaser.GameObjects.Image;
  m1s3Wizard?: Phaser.GameObjects.Image;
  m1s3Yellow?: Phaser.GameObjects.Image;
  m1s3VioletBubble1?: Phaser.GameObjects.Sprite;
  m1s3VioletBubble2?: Phaser.GameObjects.Sprite;
  m1s3VioletBubble3?: Phaser.GameObjects.Sprite;

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

  playCine(this: Cine1Movie3) {
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

    this.m1s3BackgroundRoom = this.cine.add.image(0, 0, "m1s3BackgroundRoom").setOrigin(0.5, 0.5)
    this.m1s3Yellow = this.cine.add.image(0, 48, "m1s3Yellow").setOrigin(0.5, 0.5)
    this.m1s3ChambixText = this.cine.add.image(10, 598, "m1s3ChambixText").setOrigin(0.5, 0.5)
    this.m1s3Violet = this.cine.add.image(0, 538, "m1s3Violet").setOrigin(0.5, 0.5)
    this.m1s3Wizard = this.cine.add.image(30, 48, "m1s3Wizard").setOrigin(0.5, 0.5)
    this.m1s3VioletBubble1 = this.cine.add.sprite(350, 248, "m1s3VioletBubble").setOrigin(0.5, 0.5)
    this.m1s3VioletBubble2 = this.cine.add.sprite(0, 348, "m1s3VioletBubble").setOrigin(0.5, 0.5)
    this.m1s3VioletBubble3 = this.cine.add.sprite(-350, 298, "m1s3VioletBubble").setOrigin(0.5, 0.5)
    this.m1s3CharacterHands = this.cine.add.image(0, 90, "m1s3CharacterHands").setOrigin(0.5, 0.5)
    const rect = this.cine.add.rectangle(middlePoint.x, middlePoint.y + 73, 870, 1470, 0x000000, 0)
    rect.setOrigin(0.5, 0.5)
    const mask = rect.createGeometryMask()
    this.m1s3Yellow.setMask(mask)


    const m1s3VioletBubbleAnim = this.cine.anims.generateFrameNumbers("m1s3VioletBubble", {
      frames: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      ],
    });

    const m1s3VioletBubbleAnimBounce = this.cine.anims.generateFrameNumbers("m1s3VioletBubble", {
      frames: [
        10, 9
      ],
    });

    this.cine.anims.create({
      key: "m1s3VioletBubbleAnim",
      frames: m1s3VioletBubbleAnim,
      frameRate: 11,
      repeat: 1,
    });

    this.cine.anims.create({
      key: "m1s3VioletBubbleAnimBounce",
      frames: m1s3VioletBubbleAnimBounce,
      frameRate: 11,
      repeat: -1,
    });

    const bubbles = [
      this.m1s3VioletBubble1,
      this.m1s3VioletBubble2,
      this.m1s3VioletBubble3,
    ]

    const bubbleAnimFunction = (bubble: Phaser.GameObjects.Sprite, callback: Function) => {
      bubble.anims.play("m1s3VioletBubbleAnim")
      .on('animationcomplete', () => {
        bubble?.anims.play('m1s3VioletBubbleAnimBounce')
        const scaleBubble = bubble.scale
        this.cine.tweens.add({
          targets: [bubble],
          alpha: 0,
          scale: 0,
          delay: 500 + Math.random() * 1000,
          onComplete: () => {
            bubble.y = 250 + Math.random() * 100
            bubble.setAlpha(1)
            bubble.setScale(scaleBubble)
            bubble.anims.stop()
            this.cine.tweens.add({
              targets: [bubble],
              y: '-=550',
              duration: 3500 + Math.random() * 1500,
              ease: "ease",
            });
            callback(bubble, callback)
          },
          duration: 2000,
          ease: "ease",
        });
      });
    }

    for (let i = 0; i < 3; i++) {
      bubbleAnimFunction(bubbles[i], bubbleAnimFunction)
    }

    const gameObjects = [
      this.m1s3BackgroundRoom,
      this.m1s3Yellow,
      this.m1s3VioletBubble1,
      this.m1s3VioletBubble2,
      this.m1s3VioletBubble3,
      this.m1s3Wizard,
      this.m1s3Violet,
      this.m1s3ChambixText,
      this.m1s3CharacterHands,
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
    rect.setScale(gameObjectScaler.x < gameObjectScaler.y
      ? gameObjectScaler.y
      : gameObjectScaler.x)
    // this.container.setScale(0.45)
    // rect.setScale(0.45)
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
          "¿Qué es esto?",
          "¿Qué es Chambix?",
        ],
        [],
        [
          {
            delay: 100,
            keepAlive: 1000,
            position: {
              width: 500
            }
          },
          {
            delay: 500,
            keepAlive: 1000,
            position: {
              width: 600
            }
          }
        ],
        90
      );
      this.dialogue?.play();
      this.cine.playMusic("musicCinemato")
      this.cine.tweens.add({
        targets: [this.m1s3Yellow],
        rotation: Math.PI * 2,
        duration: 20000,
        ease: "linear",
        repeat: -1
      });
      this.cine.tweens.add({
        targets: [this.m1s3Yellow],
        scale: 1.1,
        duration: 20000,
        ease: "linear",
        yoyo: true,
        repeat: -1
      });
      this.cine.tweens.add({
        targets: [this.m1s3VioletBubble1],
        y: '-=550',
        duration: 3500 + Math.random() * 1500,
        delay: 500 + Math.random() * 500,
        ease: "ease",
      });
      this.cine.tweens.add({
        targets: [this.m1s3VioletBubble2],
        y: '-=550',
        duration: 3500 + Math.random() * 1500,
        delay: 1000 + Math.random() * 1000,
        ease: "ease",
      });
      this.cine.tweens.add({
        targets: [this.m1s3VioletBubble3],
        y: '-=550',
        duration: 3500 + Math.random() * 1500,
        delay: 1500 + Math.random() * 500,
        ease: "ease",
      });
      this.cine.tweens.add({
        targets: [this.m1s3ChambixText],
        scale: 0.95,
        duration: Math.random() * 500 + 500,
        delay: 1000 + Math.random() * 500,
        ease: "ease",
        yoyo: true,
        repeat: -1
      });

      // rotate the wizard anticlockwise 20% in 30 s
      this.cine.tweens.add({
        targets: [this.m1s3Wizard],
        rotation: -Math.PI * 0.1,
        duration: 30000,
        ease: "linear",
      });

      this.cine.tweens.add({
        targets: [this.m1s3BackgroundRoom, this.m1s3Wizard],
        scale: 1.2,
        duration: 30000,
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
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene4" })
  }
}

export default Cine1Movie3;
