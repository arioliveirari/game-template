import { FX } from "phaser";
import ButtonComponent from "../Assets/Modals/ModalComponents/ButtonComponent";

export class FocusCameraMiniGame extends Phaser.Scene {
  backgroundFrame?: Phaser.GameObjects.Image;
  background?: Phaser.GameObjects.Image;
  backgroundImage?: Phaser.GameObjects.Image;
  centerPoint?: Phaser.GameObjects.Sprite;
  closeBtn?: Phaser.GameObjects.Container;
  cameraWheel?: Phaser.GameObjects.Image;
  cameraBtn?: Phaser.GameObjects.Image;
  headerModal?: Phaser.GameObjects.Image;
  contentModal?: Phaser.GameObjects.Image;
  contentImage?: Phaser.GameObjects.Image;
  title?: Phaser.GameObjects.Text;
  subTitle?: Phaser.GameObjects.Text;

  actualTexture?: string;

  backgroundModal?: Phaser.GameObjects.Image;

  progressBar?: Phaser.GameObjects.Graphics;
  progressBarIndicator?: Phaser.GameObjects.Graphics;

  baseAsset?: Phaser.GameObjects.Sprite;
  movementAsset?: Phaser.GameObjects.Sprite;

  goodAsset?: Phaser.GameObjects.Image;
  badAsset?: Phaser.GameObjects.Image;
  tweenCoffeMachine?: Phaser.Tweens.Tween;
  width: number = 588;
  height: number = 388;
  fx?: FX.Blur;
  score: number = 0;

  mask?: Phaser.Display.Masks.GeometryMask;
  maskContent?: Phaser.Display.Masks.GeometryMask;
  startValue: number = 0.9;
  goalValue: number = 0;
  tolerance: number = 0.1;
  speed: number = 2000;

  possibleTextures: string[] = [
    "walkDogs",
    "camareroImage2",
    "fotoCamara2",
    "catImage",
    "cmImage",
    "editorImage",
    "baristaImage",
  ];

  tween?: Phaser.Tweens.Tween;
  constructor() {
    super({ key: "FocusMiniGameScene", active: false });
  }

  getRandomtexture() {
    this.actualTexture = this.backgroundImage?.texture.key;
    let texturesToChoose = this.possibleTextures.filter(
      (texture) => texture !== this.actualTexture
    );
    return texturesToChoose[
      Math.floor(Math.random() * texturesToChoose.length)
    ];
  }

  getRandomSpeed() {
    return Math.floor(Math.random() * (3000 - 1000) + 1000);
  }

  getRandomStartValue() {
    return Math.random() * (2.8 - 0.6) + 0.6;
  }

  checkIfBlurIsClose(tolerance: number) {
    // use this.tween.getValue() to check if the blur is close to the goalValue
    if (this.tween) {
      // nothing
      return Math.abs(this.tween?.getValue() - this.goalValue) < tolerance;
    } else {
      return false;
    }
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
   
    if (this.backgroundImage) {
      this.backgroundImage.setTexture(this.getRandomtexture());
      this.contentImage?.setTexture(this.backgroundImage.texture.key);
      this.speed = this.getRandomSpeed();
      this.startValue = this.getRandomStartValue();
      this.backgroundImage.preFX?.clear();
      this.backgroundImage.preFX?.addBlur(
        1,
        2,
        2,
        this.startValue,
        0xffffff,
        1
      );
      this.startTween();
    }

  }

  startTween() {
    // stopTweenIfExist
    let p = {
      value: this.startValue,
    };
    this.tween?.stop();
    this.tween = this.tweens.add({
      targets: p,
      value: 0,
      duration: this.speed,
      yoyo: true,
      repeat: -1,
      onUpdate: this.scaleMovementAsset.bind(this),
    });
  }

  scaleMovementAsset(
    tween: Phaser.Tweens.Tween,
    target: Phaser.GameObjects.Sprite
  ) {
    if (this.backgroundImage) {
      this.backgroundImage.preFX?.clear();
      this.backgroundImage.preFX?.addBlur(
        1,
        2,
        2,
        tween.getValue(),
        0xffffff,
        1
      );

      // draw the progressBarIndicator
      if (this.progressBarIndicator) {
        this.progressBarIndicator.clear();
        this.progressBarIndicator.setAlpha(0); // HIDE PROGRESS BAR
        this.progressBarIndicator.fillStyle(0xffffff, 1);
        let value = this.height * (1 - tween.getValue());
        // the 0  to 100 goes between this.startValue and 0

        let newValue =
          ((tween.getValue() - this.startValue) / (0 - this.startValue)) * 100;

        // new value goes from 1 to 100, use that to calculate the height to draw

        newValue = (newValue * this.height) / 100;
        // consider to remove the this.startValue to the calc
        this.progressBarIndicator.fillRect(
          this.width + 10,
          newValue,
          10,
          this.height - newValue
        );
      }
    }
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
  }

  

  create({ win, lose, withClose = true }: { win: () => void; lose: () => void, withClose: boolean }): void {

    
    this.backgroundModal = this.add.image(this.width / 2, this.height / 2, "cameraBackground").setScale(1.5);

    this.headerModal = this.add.image(this.width / 2, this.height / 2 - 315, "cameraHeader").setScale(1.5);
    this.contentModal = this.add.image(this.width / 2, this.height / 2 + 135, "cameraContent").setScale(1.5);


    this.title = this.add.text(this.width / 2 - 150, this.height / 2 - 315, "Enfoca la cámara", {
      color: "#ffffff",
      fontFamily: "MontserratBold",
      fontSize: "28px",
      wordWrap: { width: 500 },
    }).setScale(1.2);

    this.subTitle = this.add.text(this.width / 2 - 280, this.height / 2 - 200, "Enfoca la cámara en el momento correcto!", {
      color: "#ffffff",
      fontFamily: "MontserratSemiBold",
      fontSize: "22px",
      wordWrap: { width: 500 },
    }).setScale(1.2);



    // -> Imagen blurreada de fondo
    const maskContentBit = new Phaser.Display.Masks.BitmapMask(this, this.contentModal);
    this.contentImage = this.add.image(this.width / 2, this.height / 2 + 180, "").setScale(5);
    this.contentImage.preFX?.addBlur(1, 2, 2, 2, 0xffffff, 1);
    this.contentImage.setMask(maskContentBit);
    //<- Imagen blurreada de fondo

    this.backgroundFrame = this.add.image(this.width / 2 - 65, this.height / 2 + 190, "camera_full")
    .setScale(1.5).setOrigin(0.375,0.631);
    
    this.cameraBtn = this.add.image(this.width / 2 + 190, this.height / 2 + 200, "camera_button").setOrigin(0.5, 0.5).setScale(1);
    this.cameraWheel = this.add.image(this.width / 2 + 190, this.height / 2 + 200, "camera_wheel").setOrigin(0.5, 0.5).setScale(1);
    
    //this.background = this.add.graphics();
    //this.background.fillStyle(0x000000, 1);
    //this.background.fillRect(200, 240, this.width / 2 - 110, this.height - 270);
    this.background = this.add.image(this.width / 2 - 60, this.height / 2 + 190, "bg1").setScale(1.5);
    const cameraBgMask = new Phaser.Display.Masks.BitmapMask(this, this.background);
    

    this.backgroundImage = this.add
      .image(this.width / 2 - 60, this.height / 2 + 190 , "minigame_coffee")
      .setOrigin(0.5, 0.5)
      //.setScale(1.5);

    //this.backgroundImage.setScale(2.3);
    this.backgroundImage.setScale(1.5);
    this.backgroundImage.setAlpha(1);

    //this.mask = this.background?.createGeometryMask();

    this.backgroundImage.setMask(cameraBgMask);
    // this.fx = this.backgroundImage.preFX!.addBlur(1,2,2,0,0xffffff,1)

    this.centerPoint = this.add
      .sprite(this.width / 2, this.height / 2, "")
      .setAlpha(0)
      .setScale(0);

    // create progressBar and progressBarIndicator at the right of the mask
    this.progressBar = this.add.graphics();
    this.progressBar.setAlpha(0); // HIDE PROGRESS BAR
    this.progressBar.fillStyle(0x000000, 1);
    this.progressBar.fillRect(this.width + 10, 0, 10, this.height);
    this.progressBarIndicator = this.add.graphics();
    this.progressBarIndicator.fillStyle(0xffffff, 1);
    this.progressBarIndicator.fillRect(this.width + 10, 0, 10, 0);

    // this.baseAsset = this.createAsset();
    this.backgroundImage.setInteractive();
    this.backgroundImage.on("pointerdown", () => {
      if (this.checkIfBlurIsClose(this.tolerance)) {
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
    if(withClose) {
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
        this.scene.sendToBack();
        this.scene.stop();
      });
    }

    // tween this.brackgroundImage to be orbit a little bit

    const doTweenA = () => {
      this.tweens.add({
        targets: this.backgroundImage,
        angle: 2,
        alpha: 0.78,
        x: "+=10",
        y: "-=10",
        duration: 1000,
        yoyo: true,
        repeat: 0,
        ease: "Sine.easeInOut",
        onComplete: doTweenB.bind(this)
      });
    }

    const doTweenB = () => {
      this.tweens.add({
        targets: this.backgroundImage,
        angle: -2,
        alpha: 0.9,
        duration: 2000,
        x: "-=10",
        y: "+=10",
        yoyo: true,
        onComplete: doTweenA.bind(this)
      });
    }
    const doTweenC = () => {
      this.tweens.add({
        targets: this.cameraWheel,
        angle: 180,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    doTweenA();
    doTweenC();

    this.startGame();

    const width = this.width;
    const height = this.height;
    const canvasWidth = this.game.canvas.width;
    const canvasHeight = this.game.canvas.height;

    let scaleCameraWidth = canvasWidth / width;
    let scaleCameraHeight = canvasHeight / height;
    let scaleCamera = Math.min(scaleCameraWidth, scaleCameraHeight);
    scaleCamera = scaleCamera - (scaleCamera / 2 + scaleCamera / 4);
    if(scaleCamera < 0.5) scaleCamera = 0.5;
    this.cameras.main.zoomTo(scaleCamera, 250);

    /*const width = this.width;
    let scaleCamera = this.game.canvas.width / width; 
    scaleCamera = scaleCamera - (scaleCamera / 2 );
    this.cameras.main.zoomTo(scaleCamera, 250)*/
  }

  update(time: number, delta: number): void {
    if (this.centerPoint) this.cameras.main.startFollow(this.centerPoint);
  }
}
