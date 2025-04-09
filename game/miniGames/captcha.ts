export type CaptchaSpriteType = Phaser.GameObjects.Sprite & {
  isGoodToClick?: boolean;
  isSelected?: boolean;
  borderGraphics?: Phaser.GameObjects.Graphics;
  fixedWidth?: number;
  fixedHeight?: number;
};

export type CaptchaDataGame = {
  description: string[];
  size: number;
  images: (string | boolean)[][][];
};

export class CaptchaMiniGameScene extends Phaser.Scene {
  centerPoint?: Phaser.GameObjects.Sprite;
  background?: Phaser.GameObjects.Graphics;
  closeBtn?: Phaser.GameObjects.Container;
  cameraWheel?: Phaser.GameObjects.Image;
  cameraBtn?: Phaser.GameObjects.Image;
  headerModal?: Phaser.GameObjects.Image;
  contentModal?: Phaser.GameObjects.Image;
  contentImage?: Phaser.GameObjects.Image;
  description?: Phaser.GameObjects.Text;
  acceptBtn?: Phaser.GameObjects.Image;

  goodAsset?: Phaser.GameObjects.Image;
  badAsset?: Phaser.GameObjects.Image;
  width: number = 588;
  height: number = 588;

  splitX: number = 4;
  splitY: number = 4;
  borderSize = 5;
  allImages: CaptchaSpriteType[] = [];
  gameData?: CaptchaDataGame;

  win?: () => void;
  lose?: () => void;

  possibleTextures: (string | boolean)[][] = [
    ["walkDogs", true],
    ["camareroImage2", false],
    ["fotoCamara2", true],
    ["catImage", false],
    ["cmImage", true],
    ["editorImage", false],
    ["baristaImage", true],
  ];

  tween?: Phaser.Tweens.Tween;
  constructor() {
    super({ key: "CaptchaMiniGameScene", active: false });
  }

  create({
    win,
    lose,
    withClose = true,
    data,
  }: {
    win: () => void;
    lose: () => void;
    withClose: boolean;
    data?: CaptchaDataGame;
  }): void {
    const { width, height } = this.game.canvas;
    const middlePoint = {
      x: width / 2,
      y: height / 2,
    };
    if (data) {
      //  this.headerModal = this.add.image(this.width / 2, this.height / 2 - 315, "cameraHeader").setScale(1.5);
      this.gameData = data;
      this.splitX = data.size;
      this.splitY = data.size;
    }
    // description
    // acceptBtn

    this.win = win;
    this.lose = lose;

    this.centerPoint = this.add
      .sprite(middlePoint.x, middlePoint.y, "")
      .setAlpha(0)
      .setScale(0);

    this.background = this.add.graphics();
    this.background.fillStyle(0x000000, 1);
    this.background.fillRect(
      middlePoint.x - this.width / 2,
      middlePoint.y - this.height / 2,
      this.width,
      this.height
    );

    if (withClose) {
      this.closeBtn = this.add
        .container(
          middlePoint.x + this.width / 2 + 7,
          middlePoint.y - this.height / 2 - 7
        )
        .setDepth(10);
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

    this.startGame();
  }

  checkItemClick(item: CaptchaSpriteType) {
    item.isSelected = !item.isSelected;
    if (item.borderGraphics) item.borderGraphics.clear();
    else item.borderGraphics = this.add.graphics().setPosition(item.x, item.y);
    if (item.isSelected) {

      const goldColor = 0xffd700;
      item.borderGraphics.fillStyle(goldColor);
      if (item.isGoodToClick) {
        // item.borderGraphics.fillStyle(0x00ff00);

        // this.showGood();
      } else {
        // this.showBad();
        // item.borderGraphics.fillStyle(0xff0000);
      }
      item.borderGraphics.fillRoundedRect(
        -(item.displayWidth / 2) - this.borderSize,
        -(item.displayHeight / 2) - this.borderSize,
        item.displayWidth + this.borderSize * 2,
        item.displayHeight + this.borderSize * 2,
        12
      );
      item.setDepth(3);
      item.borderGraphics.setDepth(2);
      this.tweens.add({
        targets: item,
        alpha: 1,
        duration: 100,
        ease: "Sine.easeInOut",
      });
    } else {
      this.tweens.add({
        targets: item,
        alpha: 0.3,
        duration: 100,
        ease: "Sine.easeInOut",
      });
    }
    // this.checkIfWin();
  }

  checkIfWin() {
    let win = true;
    for (let index = 0; index < this.allImages.length; index++) {
      const element = this.allImages[index];
      if (element.isGoodToClick && !element.isSelected) win = false;
      if (!element.isGoodToClick && element.isSelected) win = false
    }

    if (win) {
      if (this.win) this.win();
      this.showGood();
    } else {
      if (this.lose) this.lose();
      this.showBad();
    }
    // shift gamedata.images
    this.gameData?.images.shift();
    this.gameData?.description.shift();

    this.allImages.forEach((i) => {
      if (i.borderGraphics) i.borderGraphics?.destroy();
      i.destroy();
    });
    if (this.description) this.description.destroy();
    if (this.acceptBtn) this.acceptBtn.destroy();
    this.goodAsset?.destroy();
    this.badAsset?.destroy();
    this.startGame();
  }

  startGame() {
    const { width, height } = this.game.canvas;
    const middlePoint = {
      x: width / 2,
      y: height / 2,
    };

    const splitXSize = this.width / this.splitX;
    const splitYSize = this.height / this.splitY;

    if (this.gameData) {
      if (this.description) this.description.destroy();
      const heightOfDescription = 50;
      // add a description above the game with the same with, text will be centered in the middle
      this.description = this.add
        .text(
          middlePoint.x,
          middlePoint.y - (this.height / 2) - (heightOfDescription / 2),
          this.gameData.description[0],
          {
            color: "white",
            backgroundColor: "black",
            font: "bold 16px Arial",
            wordWrap: { width: this.width - 20 },
            fixedWidth: this.width,
            fixedHeight: heightOfDescription,
            align: "center",
            padding: {
              top:10
            }
          }
        )
        .setOrigin(0.5);

        window.test = this.description;

      //
    }
    const board = this.add.graphics();
    board.setPosition();

    let grid = [];

    for (let j = 0; j < this.splitX; j++) {
      let newArray = [];
      for (let k = 0; k < this.splitY; k++) {
        newArray.push([
          middlePoint.x - this.width / 2 + splitXSize / 2 + j * splitXSize,
          middlePoint.y - this.height / 2 + splitYSize / 2 + k * splitYSize,
        ]);
      }
      grid.push(newArray);
    }

    board.fillStyle(0xffffff);

    this.allImages = [];

    let itemsToDraw = new Array(this.splitX * this.splitY)
      .fill(null)
      .map((i, index) => this.getRandomtexture());

    if (this.gameData && this.gameData.images.length > 0) {
      itemsToDraw = itemsToDraw.map(
        (i, index) => this.gameData!.images[0][index]
      );
    }

    for (let j = 0; j < grid.length; j++) {
      for (let k = 0; k < grid[j].length; k++) {
        const point = grid[j][k];
        board.fillCircle(point[0], point[1], 10).setAlpha(0);
        const dummySprite: CaptchaSpriteType = this.add
          .sprite(point[0], point[1], itemsToDraw[0][0] as string)
          .setAlpha(0)
          .setScale(0) as CaptchaSpriteType;
        // dummySprite.setScale(0.3)
        dummySprite.isGoodToClick = itemsToDraw[0][1] as boolean;

        dummySprite.fixedWidth = splitXSize;
        dummySprite.fixedHeight = splitYSize;
        dummySprite.displayWidth = dummySprite.fixedWidth - this.borderSize * 2;
        dummySprite.displayHeight =
          dummySprite.fixedHeight - this.borderSize * 2;

        dummySprite.setInteractive();
        dummySprite.on("pointerdown", () => {
          this.checkItemClick(dummySprite);
        });

        this.allImages.push(dummySprite);

        itemsToDraw.shift();
        
      }
    }

    for (let index = 0; index < this.allImages.length; index++) {
      const element = this.allImages[index];

      this.tweens.add({
        targets: element,
        alpha: 0.3,
        duration: 300,
        delay: index * 10,
        // scale: 0.3,
        ease: "Sine.easeInOut",

        onComplete: () => {},
      });
    }

    this.goodAsset = this.add
      .image(middlePoint.x, middlePoint.y, "minigame_b_Yes")
      .setAlpha(0)
      .setOrigin(0.5)
      .setScale(0.4)
      .setDepth(10);
    this.goodAsset.setX(this.goodAsset.x + 100);
    this.badAsset = this.add
      .image(middlePoint.x, middlePoint.y, "minigame_b_No")
      .setAlpha(0)
      .setOrigin(0.5)
      .setScale(0.4)
      .setDepth(10);
    this.badAsset.setX(this.badAsset.x - 100);

    // add accept btn below the game
    this.acceptBtn = this.add
      .image(
        middlePoint.x,
        middlePoint.y + this.height / 2 + 50,
        "btnGoCityModal"
      )
      .setAlpha(1)
      .setOrigin(0.5)
      .setScale(0.8)
      .setDepth(10)
      .setInteractive()
      .on("pointerdown", () => {
        this.checkIfWin();
      });
  }

  getRandomtexture() {
    return this.possibleTextures[
      Math.floor(Math.random() * this.possibleTextures.length)
    ];
  }

  showGood() {
    const duration = 270;
    this.goodAsset?.setAlpha(0);
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
            this.goodAsset?.setY(this.goodAsset?.y - 10).setAlpha(0);
          },
        });
      },
    });
  }

  showBad() {
    const duration = 270;
    this.badAsset?.setAlpha(0);

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
            this.badAsset?.setY(this.badAsset?.y - 10).setAlpha(0);
          },
        });
      },
    });
  }
}
