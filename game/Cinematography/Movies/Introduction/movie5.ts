import Phaser from "phaser";
import Ticker, { TickerJob } from "../../Ticker";
import DialogueManager from "../../DialogueManager";
import CinematographyModular, { PossibleMovies } from "../../CinematographyHandler";

class Cine1Movie5 {
  ticker: Ticker;
  cine: CinematographyModular;
  nextCine: boolean = false;
  container?: Phaser.GameObjects.Container;
  dialogue?: DialogueManager;

  m1s5BackgroundRoom?: Phaser.GameObjects.Image;
  m1s5CharacterHands?: Phaser.GameObjects.Image;
  m1s5Wizard?: Phaser.GameObjects.Sprite;

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

  createGems() {
    const possibleGems = [
      "gema1", "gema2", "gema3", "gema4", "gema5",
      "gema6", "gema7", "gema8", "gema9", "gema10",
      "gema11", "gema12", "gema13", "gema14", "gema15",
    ];
  
    const randomGems = Phaser.Math.Between(8, 14);
    let gems = [];
  
    for (let i = 0; i < randomGems; i++) {
      const texture = Phaser.Math.RND.pick(possibleGems);
      possibleGems.splice(possibleGems.indexOf(texture), 1);
  
      const gem = this.cine.add.image(0, 0, texture)
        .setOrigin(0.5, 0.5)
        .setScale(1.8)
        .setAlpha(0);
      gems.push(gem);
    }
  
    // Crear un contenedor en el centro de la escena para manejar la rotación
    const centerX = this.cine.cameras.main.width / 2;
    const centerY = this.cine.cameras.main.height / 2;
    const gemContainer = this.cine.add.container(centerX, centerY, gems).setScale(0);
  
    this.container?.add(gemContainer);
    gemContainer.setAlpha(0);
  
    // Animación de aparición del contenedor
    this.cine.tweens.add({
      targets: gemContainer,
      alpha: 1,
      scale: 1,
      duration: 1000,
      ease: "Linear",
      onComplete: () => {
        gems.forEach((gem) => {
          this.cine.tweens.add({
            targets: gem,
            alpha: 1,
            delay: 1000 + Math.random() * 1000,
            duration: 1000,
            ease: "Linear",
          });
        });
  
        // Iniciar la rotación después de que las gemas aparezcan
        this.startGemsRotation(gemContainer, gems);
      },
    });
  
    // Distribuir las gemas en círculo
    const circleRadius = 200;
    const circle = new Phaser.Geom.Circle(0, 0, circleRadius);
    Phaser.Actions.PlaceOnCircle(gems, circle);
  }
  
  // Función para hacer que las gemas roten alrededor del centro
  startGemsRotation(container: any, gems: any) {
    this.cine.tweens.add({
      targets: gems,
      angle: 360, // Rotar sobre su propio eje
      duration: 5000,
      repeat: -1,
      ease: "Linear",
    });
  
    this.cine.time.addEvent({
      delay: 30, // Velocidad de la rotación
      loop: true,
      callback: () => {
        Phaser.Actions.RotateAroundDistance(gems, { x: 0, y: -250 }, 0.02, 450);
      }
    });
  }
  
  playCine(this: Cine1Movie5) {
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
    this.m1s5CharacterHands = this.cine.add.image(0, 505, "m1s5CharacterHands").setOrigin(0.5, 0.5)
    this.m1s5Wizard = this.cine.add.sprite(0, 450, "m1s5Wizard").setOrigin(0.5, 0.5).setScale(0)
    const m1s5WizardFrames = this.cine.anims.generateFrameNumbers("m1s5Wizard", {
      frames: [
        0, 1, 2, 3, 4
      ],
    });

    this.cine.anims.create({
      key: "m1s5WizardAnim",
      frames: m1s5WizardFrames,
      frameRate: 15,
    });


    const gameObjects = [
      this.m1s5BackgroundRoom,
      this.m1s5CharacterHands,
    ];
    this.container = this.cine.add
    .container(middlePoint.x, middlePoint.y)
    .setSize(2915, 1640);
    
    this.container.add(gameObjects);
    // this.createGems();
    this.container.add(this.m1s5Wizard);

    this.container.setScale(
      gameObjectScaler.x < gameObjectScaler.y
        ? gameObjectScaler.y
        : gameObjectScaler.x
    );
    // this.container.setScale(0.45)
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
          "¡TA-DAAAAA!",
        ],
        [],
        [
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

      // this.cine.tweens.add({
      //   targets: [this.cine.cameras.main],
      //   zoom: 1.2,
      //   duration: 40000,
      //   ease: "linear",
      // });

      this.cine.tweens.add({
        targets: [this.m1s5Wizard],
        scale: 1,
        y: -250,
        duration: 100,
        onUpdate: (tween, progress, target) => {
          if (tween.progress > 0.1) {
            this.m1s5Wizard?.anims.play("m1s5WizardAnim");
            this.m1s5Wizard?.setPosition(0, -250);
            this.m1s5Wizard?.on("animationcomplete", () => {
              this.cine.tweens.add({
                targets: [this.m1s5Wizard],
                y: '+=50',
                duration: 500,
                yoyo: true,
                loop: -1,
                ease: "ease",
              })
            });
          }
        },
        ease: "ease",
        delay: 500,
      });

      // scale backgronud by 1.2 in 30seconds
      this.cine.tweens.add({
        targets: [this.m1s5BackgroundRoom],
        scale: 1.5,
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
    if (this.nextCine) this.cine.scene.restart({ keynameCreate: "movie1scene6" })
  }
}

export default Cine1Movie5;
