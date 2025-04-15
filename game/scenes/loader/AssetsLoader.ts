import { start } from "repl";
import MultiScene from "./MultiScene";
import PreLoadScene from "./PreLoadScene";

export type SceneKeys = "BaseLoad"

export type LoadTypes =
  | "image"
  | "spritesheet"
  | "audio"
  | "svg"
  | "assetWithCallback";

const loadAssets = {
  BaseLoad: {
    assets: [
    ],
  },
};

class AssetsLoader {
  scene: MultiScene | PreLoadScene;
  finished: boolean = false;
  loadKey: SceneKeys[] = ["BaseLoad"];
  constructor(
    scene: MultiScene | PreLoadScene,
    loadKey: SceneKeys[] = ["BaseLoad"]
  ) {
    this.scene = scene;
    this.loadKey = loadKey;
  }

  buildLoadingEffect() {
    const assetsToUse = [
      "loadingBlock1",
      "loadingBlock2",
      "loadingBlock3",
      "loadingBlock4",
      "loadingBlock5",
    ];

    const interval = setInterval(() => {
      let exist = true;

      assetsToUse.map((asset) => {
        if (!this.scene.textures.exists(asset)) {
          exist = false;
        }
        return asset;
      });

      if (exist) {
        clearInterval(interval);
        logic();
      }
    }, 10);

    const logic = () => {
      const width = window.innerWidth; //this.scene.cameras.main.width // TODO REVISAR
      const height = window.innerHeight; //this.scene.cameras.main.height // TODO REVISAR
      const blockSize = 56;
      const middlePoint = {
        x: width / 2 - blockSize * 3,
        y: height / 2 - blockSize * 3,
      };

      // draw random blocks to appear from the bottom like fish jumping from the water
      const drawJump = () => {
        const random = Phaser.Math.Between(3, 8);
        const randomDelay = () => Phaser.Math.Between(100, 500);

        const array = new Array(random).fill(0).map((_) => randomDelay());
        // position of the biggest number in the array

        const max = Math.max(...array);
        const index = array.indexOf(max);

        for (let i = 0; i < random; i++) {
          const randomX = Phaser.Math.Between(-80, 80);
          const randomY = Phaser.Math.Between(-80, 80);
          const randomAngle = Phaser.Math.Between(-100, 100);
          const randomAsset = Phaser.Math.Between(0, assetsToUse.length - 1);
          const block = this.scene.add
            .image(
              width - 150 + randomX,
              height + 150,
              assetsToUse[randomAsset]
            )
            .setDisplaySize(blockSize, blockSize);
          // block.alpha = 0
          const delay = randomDelay();
          block.setScale(0.5);
          this.scene.tweens.add({
            targets: block,
            // scale: 1,
            duration: 1000,
            delay: delay,
            ease: "Back.easeInOut",
            yoyo: true,
            y: "-=" + (300 + randomY),
            onComplete: () => {
              block.destroy();
              if (i === index) {
                drawJump();
              }
            },
          });
          this.scene.tweens.add({
            targets: block,
            // scale: 1,
            duration: 1000,
            delay: delay,
            ease: "linear",
            angle: randomAngle,
          });
        }
      };

      drawJump();
    };
  }
  runPreload(callback?: Function) {
    if (!this.finished) {
      this.buildLoadingEffect();

      var width = this.scene.cameras.main.width;
      var height = this.scene.cameras.main.height;
      var loadingText = this.scene.make.text({
        x: 100,
        y: height - 50,
        text: "Cargando...",
        style: {
          fontStyle: "bold",
          font: "20px monospace",
          color: "#ffffff",
        },
      });
      var progressBar = this.scene.add.graphics().setDepth(1001);
      var progressBox = this.scene.add.graphics().setDepth(1000);
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(0, height - 30, width, 50);
      loadingText.setOrigin(0.5, 0.5);

      var percentText = this.scene.make.text({
        x: 186,
        y: height - 50,
        text: "0%",
        style: {
          fontStyle: "bold",
          font: "20px monospace",
          color: "#ffffff",
        },
      });

      percentText.setOrigin(0.5, 0.5);

      this.scene.load.on("progress", function (value: number) {
        percentText.setText(Math.floor(Number(value * 100)) + "%");
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(0, height - 30, width * value, 30);
      });

      this.scene.load.once("complete", function (this: AssetsLoader) {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        this.finished = true;
        if (callback) callback();
      });

      const scenesTitles: Array<SceneKeys> = this.loadKey;
      for (let i = 0; i < scenesTitles.length; i++) {
        loadAssets[scenesTitles[i]].assets.map((sceneAssetConfig: any) => {
          const type = sceneAssetConfig[0] as LoadTypes;
          if (type !== "assetWithCallback") {
            const name = sceneAssetConfig[1] as string;
            const src = sceneAssetConfig[2] as string;
            const config = sceneAssetConfig[3] as any;
            if (config) {
              this.scene.load[type](name, src, config);
            } else {
              this.scene.load[type](name, src);
            }
          } else {
            const callback = sceneAssetConfig[1] as Function;
            callback(this.scene);
          }
        });
      }
      const ArcadeFont = this.scene.add.text(0, 0, " .", {
        fontFamily: "MontserratSemiBold",
      });
      const ArcadeFont2 = this.scene.add.text(0, 0, " .", {
        fontFamily: "MontserratBold",
      });
      const ArcadeFont3 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosBold",
      });
      const ArcadeFont4 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosBoldItalic",
      });
      const ArcadeFont5 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosItalic",
      });
      const ArcadeFont6 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosRegular",
      });
    }
  }
}

export default AssetsLoader;
