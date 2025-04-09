import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";
import { changeSceneTo } from "@/game/helpers/helpers";
import MultiScene from "@/game/Loader/MultiScene";

class Cine1Movie11 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;
  m1s1background?: Phaser.GameObjects.Image;
  m1s1backgroundStars?: Phaser.GameObjects.Image;
  m1s1moon?: Phaser.GameObjects.Image;
  m1s1backgroundRoom?: Phaser.GameObjects.Image;
  m1s1character?: Phaser.GameObjects.Sprite;
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

  playCine(this: Cine1Movie11) {
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

    this.m1s1background = this.cine.add.image(0, 0, "m1s1background").setOrigin(0.5, 0.5)
    this.m1s1backgroundStars = this.cine.add.image(0, -200, "m1s1backgroundStars").setOrigin(0.5, 0.5)
    this.m1s1moon = this.cine.add.image(-30, -200, "m1s1moon").setOrigin(0.5, 0.5)
    this.m1s1backgroundRoom = this.cine.add.image(0, 0, "m1s1backgroundRoom").setOrigin(0.5, 0.5)

    const m1s1CharacterAnim = this.cine.anims.generateFrameNumbers("m1s1character", {
      frames: [
        0, 1, 0
      ],
    });
    this.cine.anims.create({
      key: "m1s1CharacterAnim",
      frames: m1s1CharacterAnim,
      frameRate: 11,
      repeat: -1,
    });

    this.m1s1character = this.cine.add.sprite(400, 100, "m1s1character").setOrigin(0.5, 0.5)

    this.m1s1character.anims.play("m1s1CharacterAnim");
    this.m1s1character?.setVisible(false)

    const gameObjects = [
      this.m1s1background,
      this.m1s1backgroundStars,
      this.m1s1moon,
      this.m1s1backgroundRoom,
      this.m1s1character,
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
    this.cine.cameras.main.zoom = 1.6;
    this.cine.cameras.main.scrollY = -130

    const part = (job: TickerJob) => {
      this.dialogue = new DialogueManager(
        this.cine,
        [
          "¡Vamos! No hay tiempo que perder.",
          "¡Espera! ¿Ir a dónde?"
        ],
        [],
        [
          {
            delay: 500,
            keepAlive: 500,
            position: {
              width: 500
            }
          },
          {
            delay: 500,
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
        scale: 1.2,
        duration: 40000,
        ease: "linear",
      });
      const cameraTween = this.cine.tweens.add({
        targets: [this.cine.cameras.main],
        zoom: 1.8,
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

    const part2 = (job: TickerJob) => {
      this.dialogue = new DialogueManager(
        this.cine,
        [
          "Ya lo verás, solo confía en Chambix",
          "¡Está bien pero espérame!"
        ],
        [],
        [
          {
            delay: 100,
            keepAlive: 500,
            position: {
              width: 700
            }
          },
          {
            delay: 500,
            keepAlive: 1000,
            position: {
              width: 500
            }
          }
        ],
        90
      );
      this.dialogue?.play();

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
            this.cine.stopMusic();
          })
        )
      })
    );
  }

  update(this: PossibleMovies, time: number, delta: number) {
    if (this.dialogue) this.dialogue.update();
    if (this.nextCine) {
    // if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene11" })
      this.nextCine = false;
      const multiScene = this.cine.game.scene.getScene("MultiScene") as MultiScene;
      if (multiScene) {
        multiScene.makeTransition("RPG", "CinematographyHandler", "ROOM")
      } else {
        changeSceneTo(this.cine, "RPG", "CinematographyHandler", "ROOM")
      }
    }
  }
}

export default Cine1Movie11;
