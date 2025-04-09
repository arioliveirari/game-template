import { FX } from "phaser";

export class CleanTableMiniGameScene extends Phaser.Scene {
  background?: Phaser.GameObjects.Graphics;
  backgroundImageTexture?: Phaser.GameObjects.Image;

  centerPoint?: Phaser.GameObjects.Sprite;
  closeBtn?: Phaser.GameObjects.Container;
  badAsset?: Phaser.GameObjects.Image;
  goodAsset?: Phaser.GameObjects.Image;

  tweenCoffeMachine?: Phaser.Tweens.Tween;
  width: number = 460;
  height: number = 380;
  mask?: Phaser.Display.Masks.GeometryMask;

  imageMoving?: Phaser.GameObjects.Image;
  imageMovingHolding?: Phaser.GameObjects.Image;
  tween?: Phaser.Tweens.Tween;
  score: number = 0;
  constructor() {
    super({ key: "CleanTableMiniGameScene", active: false });
  }

  create({
    win,
    lose,
    withClose = true,
  }: {
    win: () => void;
    lose: () => void;
    withClose: boolean;
  }): void {
    this.centerPoint = this.add.sprite(this.width / 2, this.height / 2, "");
    this.centerPoint.setOrigin(0.5, 0.5);

    this.background = this.add.graphics();
    this.background.fillStyle(0xff22ff, 1);
    this.background.fillRect(0, 0, this.width, this.height);
    // fill graphic size with minigame_coffeBackground texture

    this.backgroundImageTexture = this.add.image(
      this.width / 2,
      this.height / 2,
      "minigame_coffeBackground"
    );
    this.backgroundImageTexture.setDisplaySize(this.width, this.height);
    this.backgroundImageTexture.setInteractive();
    this.backgroundImageTexture.on("pointerdown", () => {
      // check if this.imagemoving position is over the imageMovingHolding position
      // not the same point, the potin from the imageMoving inside the render squer of imageMovingHolding
      if (this.imageMoving && this.imageMovingHolding) {
        const point: Phaser.Geom.Point = this.imageMoving.getCenter();
        const imageMovingHoldingBounds = this.imageMovingHolding.getBounds();
        // check point in bounds
        if (
          Phaser.Geom.Rectangle.ContainsPoint(imageMovingHoldingBounds, point)
        ) {
          this.score += 1;
          win();
          this.showGood();
          this.startGame();
        } else {
          this.score -= 1;
          lose();
          this.showBad();
          this.startGame();
        }
      }
    });

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
    if (withClose) {
      this.closeBtn = this.add.container(this.width + 7, -7).setDepth(10);
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
        this.scene.sendToBack();
        this.scene.stop();
      });
    }
    this.score = 0;
    //Create grid

    this.createImageMoving();
    this.createImageHoldingMoving();

    // clicking on the backgroudn make the sprite go to a random position
    this.startGame();
  }

  grabRandomTexture() {
    const random = ["minigame_donut_1", "minigame_donut_2"];
    return random[Math.floor(Math.random() * random.length)];
  }

  createImageMoving() {
    this.imageMoving = this.add
      .image(this.width / 2, this.height / 2, this.grabRandomTexture())
      .setScale(0.8);
    this.imageMoving.setDepth(10);
  }

  createImageHoldingMoving() {
    this.imageMovingHolding = this.add
      .image(this.width / 2, this.height / 2, "minigame_donut_plate")
      .setScale(0.8)
      .setDepth(9);
  }

  startGame() {
    // change texture using this.grabRandomTexture()

    this.imageMoving?.setTexture(this.grabRandomTexture());

    this.tween?.stop();
    const { xArray, yArray } = this.createGrid();

    const xs = [...xArray].map((line) => ({ x: line.x, y: line.y }));
    const ys = [...yArray].map((line) => ({ x: line.x, y: line.y }));

    const randomNumber = Math.floor(Math.random() * xs.length);
    const obj = {
      from: { x: xs[randomNumber].x, y: xs[randomNumber].y },
      to: { x: ys[randomNumber].x, y: ys[randomNumber].y },
    };

    // add tween for the sprite
    const randomBetweenFromAndTo = Math.random() ? obj.from : obj.to;

    const otherX =
      randomBetweenFromAndTo.x == 0 ? this.width : randomBetweenFromAndTo.x;
    const otherY =
      randomBetweenFromAndTo.y == 0 ? this.height : randomBetweenFromAndTo.y;

    this.imageMoving?.setPosition(
      randomBetweenFromAndTo.x,
      randomBetweenFromAndTo.y
    );
    this.tween = this.add.tween({
      targets: this.imageMoving,
      x: otherX,
      y: otherY,
      duration: 2000,
      // repeat: -1,
      // yoyo: true,
      ease: "power1",
      onComplete: () => {
        this.startGame();
      },
    });

    // the tween is a line from  to points,
    // grab a random point from that line

    const line = new Phaser.Geom.Line(
      randomBetweenFromAndTo.x,
      randomBetweenFromAndTo.y,
      otherX,
      otherY
    );

    // grab a random point from line

    const randomPoint = Phaser.Geom.Line.Random(line);

    // move the imageHolding to that point, without a tween

    this.imageMovingHolding?.setPosition(randomPoint.x, randomPoint.y);
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

  createGrid() {
    const size = 5;

    let xArray = [];
    let yArray = [];

    // create lines that are from the x and the full height and the y and the full width
    for (let i = 0; i < size; i++) {
      xArray.push(this.add.graphics().setDepth(1));
      xArray[i].fillStyle(0x000000, 0);
      xArray[i].fillRect(0, 0, this.width, 1);
      xArray[i].y = (this.height / size) * i;
    }

    for (let i = 0; i < size; i++) {
      yArray.push(this.add.graphics().setDepth(1));
      yArray[i].fillStyle(0x000000, 0);
      yArray[i].fillRect(0, 0, 1, this.height);
      yArray[i].x = (this.width / size) * i;
    }
    return { xArray, yArray };
  }

  update(time: number, delta: number): void {
    if (this.centerPoint) this.cameras.main.startFollow(this.centerPoint);
  }
}
