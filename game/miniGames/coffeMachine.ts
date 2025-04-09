import EventsCenterManager from "../services/EventsCenter";


export class CoffeMiniGame extends Phaser.Scene {
  background?: Phaser.GameObjects.Graphics;
  backgroundImage?: Phaser.GameObjects.Image;
  baseAsset?: Phaser.GameObjects.Sprite;
  movementAsset?: Phaser.GameObjects.Sprite;
  goodAsset?: Phaser.GameObjects.Image;
  badAsset?: Phaser.GameObjects.Image;
  coffeMachine?: Phaser.GameObjects.Image;
  coffeCup?: Phaser.GameObjects.Image;
  coffePlate?: Phaser.GameObjects.Image;
  closeBtn?: Phaser.GameObjects.Container;
  tweenCoffeMachine?: Phaser.Tweens.Tween;
  width: number = 600;
  height: number = 380;

  score: number = 0;

  stateGlobal: any;
  eventCenter = EventsCenterManager.getInstance();

  tween?: Phaser.Tweens.Tween;
  constructor() {
    super({ key: "CoffeMiniGameScene", active: false });
  }

  checkIfScalesAreDifferent(tolerance: number) {
    const scaleBaseX = this.baseAsset?.scaleX || 1;
    const scaleBaseY = this.baseAsset?.scaleY || 1;
    const scaleMovementX = this.movementAsset?.scaleX || 1;
    const scaleMovementY = this.movementAsset?.scaleY || 1;
    const diffX = Math.abs(scaleBaseX - scaleMovementX);
    const diffY = Math.abs(scaleBaseY - scaleMovementY);
    return diffX < tolerance && diffY < tolerance;
  }

  createAsset() {
    const asset = this.add
      .sprite(this.width / 2, this.height / 2, "minigame_glowCircle")
      .setOrigin(0.5);
    // tint semi Gold

    // asset.setTint(0xffd700);

    return asset;
  }

  restartMovementAsset() {
    this.movementAsset?.destroy();
    this.movementAsset = this.createAsset();
    this.movementAsset.setScale(0);
  }

  showGood() {
    const duration = 270;
    this.tweens.add({
      targets: this.goodAsset,
      alpha: 1,
      y: "+=10",
      duration: duration,
      onComplete: () => {
        this.tweens.add({
          targets: this.goodAsset,
          alpha: 0,
          duration: duration / 3,
          onComplete: () => {
            this.goodAsset?.setY(this.goodAsset?.y - 10);
          },
        });
      },
    });
  }

  showBad() {
    const duration = 270;
    this.tweens.add({
      targets: this.badAsset,
      alpha: 1,
      y: "+=10",
      duration: duration,
      onComplete: () => {
        this.tweens.add({
          targets: this.badAsset,
          alpha: 0,
          duration: duration / 3,
          onComplete: () => {
            this.badAsset?.setY(this.badAsset?.y - 10);
          },
        });
      },
    });
  }

  win() {
    this.tweens.add({
      targets: this.backgroundImage,
      alpha: 0.78,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });
  }

  startGame() {
    this.setBaseAssetRandomScale();
    this.restartMovementAsset();
    const randomDuration = Math.floor(Math.random() * (5000 - 2000) + 2000);
    this.startTween(randomDuration);
  }

  startTween(duration: number = 5000) {
    // stopTweenIfExist
    this.tween?.stop();

    // create tween to incress the scale of the movementAsset, Check if  the scale reach the top of 4 and restart the game
    // the pointerDown will be listen if the scales are close to each other

    this.tween = this.tweens.add({
      targets: this.movementAsset,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: duration,
      onComplete: () => {
        this.startGame();
      },
    });

    this.tweenCoffeMachine = this.tweens.add({
      targets: this.coffeMachine,
      x: this.coffeMachine!.x + 5,
      y: this.coffeMachine!.y + 5,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });
  }

  setBaseAssetRandomScale() {
    const maxScale = 0.1;
    const minScale = 0.05;
    const randomScale = Math.random() * (maxScale - minScale) + minScale;
    this.baseAsset?.setAlpha(0);
    // scale coffeCup to match randomScale

    // tween fast to that position
    this.tweens.add({
      targets: [this.baseAsset],
      scaleX: randomScale,
      scaleY: randomScale,
      alpha: 0.4,
      duration: 100,
    });
    const multiply = 2.5;
    this.tweens.add({
      targets: [this.coffeCup, this.coffePlate],
      scaleX: randomScale * multiply,
      scaleY: randomScale * multiply,
      duration: 100,
    });
  }

  preload() {
    // this.load.image("NO", "/images/miniGame/b_No.png");
    // this.load.image("YES", "/images/miniGame/b_Yes.png");
    // this.load.image("background", "/images/miniGame/coffee3.jpeg");
    // this.load.image("background", "/images/miniGame/coffee.jpg");
    // this.load.image("circle", "/images/miniGame/glowCircle.png");
  }

  create({ win, lose, stateGlobal }: { win: () => void; lose: () => void; stateGlobal: any }) {
    this.background = this.add.graphics();
    this.background.fillStyle(0x000000, 1);
    this.background.fillRect(0, 0, this.width, this.height);

    this.stateGlobal = stateGlobal;
    this.backgroundImage = this.add
      .image(this.width, this.height, "minigame_coffeBackground")
      .setOrigin(0.75, 0.75);

    this.backgroundImage.setScale(0.5);
    // this.backgroundImage.setScale(1);
    this.backgroundImage.setAlpha(1);

    this.coffeMachine = this.add
      .image(
        this.width / 2 - 150,
        this.height / 2 - 180,
        "minigame_coffeMachine"
      )
      .setScale(0.2)
      .setOrigin(0.5, 0.5);

    this.coffePlate = this.add
      .image(this.width / 2, this.height / 2, "minigame_plate")
      .setScale(0.5)
      .setOrigin(0.5, 0.5);

    this.coffeCup = this.add
      .image(this.width / 2, this.height / 2, "minigame_coffeCup")
      .setScale(0.5)
      .setOrigin(0.5, 0.48);

    const mask = this.background?.createGeometryMask();

    this.backgroundImage.setMask(mask);
    this.coffeMachine.setMask(mask);

    this.baseAsset = this.createAsset();
    this.backgroundImage.setInteractive();
    this.backgroundImage.on("pointerdown", () => {
      if (this.checkIfScalesAreDifferent(0.05)) {
        this.score += 1;
        this.win();
        win();
        this.showGood();
      } else {
        this.score -= 1;
        lose();
        this.showBad();
      }
      this.startGame();
    });
    this.baseAsset.setAlpha(0.04);

    this.movementAsset = this.createAsset();

    this.movementAsset.setScale(0);
    this.movementAsset.setAlpha(0.8);

    this.goodAsset = this.add
      .image(this.width / 2, this.height / 2, "minigame_b_Yes")
      .setAlpha(0)
      .setScale(0.4);
    this.goodAsset.setX(this.goodAsset.x + 90);
    this.badAsset = this.add
      .image(this.width / 2, this.height / 2, "minigame_b_No")
      .setAlpha(0)
      .setScale(0.4);
    this.badAsset.setX(this.badAsset.x - 90);

    this.add.existing(this.background);
    this.add.existing(this.baseAsset);
    this.add.existing(this.movementAsset);
    this.add.existing(this.goodAsset);

    // create a closeBtn to close the minigame
    // the btn needs to be a container with a circle and a x in it, the circle white, the border black and the x black
    this.closeBtn = this.add.container(this.width + 7, -7);
    this.closeBtn.setSize(40, 40);
    const circle = this.add
      .circle(0, 0, 20, 0xffffff, 1)
      .setStrokeStyle(3, 0x000000);
    const x = this.add.text(0, 0, "X", {
      color: "black",
      font: "bold 20px Arial",
    });
    x.setOrigin(0.5);
    this.closeBtn.add(circle);
    this.closeBtn.add(x);
    this.closeBtn.setInteractive();
    this.closeBtn.on("pointerdown", () => {
      if(this.stateGlobal.timeOfDay !== (this.stateGlobal.inversionModule.isActive ? 8 : 4)){
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.TIME_CHANGE,
          1
        );
      }
      this.scene.sendToBack();
      this.scene.stop();
    });

    this.startGame();
  }

  update(time: number, delta: number): void {
    if (this.baseAsset) this.cameras.main.startFollow(this.baseAsset);
  }
}
