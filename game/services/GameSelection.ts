import { checkIfMobile } from "../helpers/helpers";
import RPG from "../gameIndex";

export type GameSelectionItemType = {
  id: string;
  image: string;
  title: string;
  description: string;
  background: string;
  ignoreColorFilter?: boolean;
  disabled?: boolean;
  customScale?: number;
};

export type GameSelectionGlobalConfig = {
  baseBackground?: string;
  baseOverlay?: string;
};

const _BASECONFIG: GameSelectionGlobalConfig = {
  baseBackground: undefined,
  baseOverlay: undefined,
};

export class GameSelection {
  private static instance: GameSelection;

  private colorList: number[] = [
    0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
  ];

  constructor() {}

  static getInstance() {
    if (!GameSelection.instance) {
      GameSelection.instance = new GameSelection();
    }
    return GameSelection.instance;
  }

  createSelection(
    scene: RPG,
    items: GameSelectionItemType[],
    onSelected: Function,
    globalConfig: GameSelectionGlobalConfig = _BASECONFIG
  ) {
    // Split the screen in diagonal n - 1 times // n = items.length
    // Each diagonal will have a different color and it need to be filled the form to the left with the same color at backgroundColor

    // Create a container with all the items
    type ExtraContainerType = {
      playSelection: Function;
      imageScaleSize: number;
      backgorundScaleSize: number;
      movingImageTween?: Phaser.Tweens.Tween;
      masks: Phaser.GameObjects.Graphics[];
      titles: Phaser.GameObjects.Text[];
      borders: Phaser.GameObjects.Graphics[];
      images: Phaser.GameObjects.Image[];
      imagesShadows: Phaser.GameObjects.Image[];
    };

    const container = scene.add.container(
      0,
      0
    ) as Phaser.GameObjects.Container & ExtraContainerType;
    container.setDepth(999);
    container.setAlpha(0);
    container.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        scene.cameras.main.width,
        scene.cameras.main.height
      ),
      Phaser.Geom.Rectangle.Contains
    );

    const { width, height } = scene.game.canvas;
    const partWidth = width / items.length;
    container.masks = [];
    container.titles = [];
    container.borders = [];
    container.images = [];
    container.imagesShadows = [];
    // add n mask of container one next to each other
    let globalBackground:Phaser.GameObjects.Image | undefined = undefined;
    let globalOverlay:Phaser.GameObjects.Image | undefined = undefined;
    if (globalConfig.baseBackground) {
      globalBackground = scene.add
        .image(width / 2, height / 2, globalConfig.baseBackground)
        .setOrigin(0.5);
      // scale to cover the width and Height of the screen
      let newScale = 1;

      if (width < height) {
        newScale = width / globalBackground.displayWidth;
      } else {
        newScale = height / globalBackground.displayHeight;
      }
      globalBackground.setScale(newScale * 2)
      scene.tweens.add({
        targets: globalBackground,
        x: "+=50",
        y: "-=50",
        duration: 50000,
        angle:130,
        repeat:-1,
        yoyo:true,
        scale: (newScale * 2) + 0.2,
      });

      globalBackground.setPosition(width / 2, height / 2)

      // ignore globalBackground on ui camera
      scene.cameras.cameras.forEach((camera) => {
        if (scene.UICamera && scene.UICamera.id === camera.id) return;
        camera.ignore(globalBackground!);
      }); 
    }

    const closeSelection = () => {
      scene.tweens.add({
        targets: container,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if(globalBackground) globalBackground.destroy()
          container.titles.forEach((title) => title.destroy());
          container.destroy();
          if(globalOverlay) globalOverlay.destroy()
          this.resumeAllClicksAndInteractions(scene);
        },
      });
    };
    

    items.forEach((item, index) => {
      const mask = scene.add.graphics();
      mask.fillStyle(0x000000, 0);
      mask.fillRect(0, 0, partWidth, height);
      mask.x = partWidth * index;
      mask.setDepth(999);
      container.add(mask);
      container.masks.push(mask);

      const background = scene.add.image(0, 0, item.background).setAlpha(1);

      // set background tint more darker but also with a color filter from colorList index position

      if (!item.ignoreColorFilter) {
        const newColorTint = Number(
          this.colorList[index]
            .toString()
            .replace("0x", "#")
            .replace("ff", "88")
            .replace("#", "0x")
        );
        background.setTint(newColorTint);
      }
      // apply mask
      background.setMask(mask.createGeometryMask());
      background.x = partWidth * index;
      background.y = height / 2;
      //scale consider to cover the biggest size of x and y of the width and height of partialWidth and screen height
      container.backgorundScaleSize = Math.max(
        partWidth / background.width,
        height / background.height
      );
      background.setScale(container.backgorundScaleSize);
      if (globalConfig.baseBackground) {
        background.setAlpha(0);
      }
      container.add(background);

      // add border at the end of the mask
      const border = scene.add.graphics();
      border.lineStyle(8, 0x000000, 1);
      border.strokeRect(0, 0, partWidth, height);
      border.x = partWidth * index;
      container.add(border);
      container.borders.push(border);

      const imageShadow = scene.add
        .image(partWidth * index + partWidth / 2, height / 2, item.image)
        .setTint(0x000000)
        .setAlpha(0.2);
      container.imageScaleSize = 0.8;

      imageShadow.setScale(container.imageScaleSize);
      imageShadow.setMask(mask.createGeometryMask());
      container.add(imageShadow);
      container.imagesShadows.push(imageShadow);

      const image = scene.add
        .image(partWidth * index + partWidth / 2, height / 2, item.image)
        .setAlpha(0.2);

      if(checkIfMobile(scene)){
        image.setAlpha(1)
      }
      
      image.setScale(container.imageScaleSize);
      image.setMask(mask.createGeometryMask());
      container.add(image);
      container.images.push(image);

      const title = scene.add.text(
        partWidth * index + partWidth / 2,
        height + 100,
        item.title,
        {
          color: "#000",
          fontSize: "24px",
          fontStyle: "bold",
          backgroundColor: "#ffffff88",
          padding: { x: 10, y: 5 },
        }
      );
     

      // container.add(title); // outside container for depth
      title.setOrigin(0.5, 0);
      title.setDepth(999);


      container.titles.push(title);
      scene.cameras.cameras.forEach((camera) => {
        if (scene.UICamera && scene.UICamera.id === camera.id) return;
        camera.ignore(title);
      });

      container.setAlpha(0);

      // add mouse interaction for each background
      mask.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, partWidth, height),
        Phaser.Geom.Rectangle.Contains
      );

      mask.on("pointerdown", () => {
        onSelected(item);
        closeSelection();
      });

      mask.on("pointerover", () => {
        const title = container.titles[index];
        const image = container.images[index];
        scene.tweens.add({
          targets: title,
          alpha: 0.8,
          y: height - 80,
          duration: 100,
        });

        scene.input.setDefaultCursor("pointer");
        // add scale effect
        if (!globalConfig.baseBackground) {
          scene.tweens.add({
            targets: background,
            scale: container.backgorundScaleSize + 0.2,
            alpha: 1,
            duration: 200,
          });
        }

        scene.tweens.add({
          targets: image,
          scale: container.imageScaleSize + 0.6,
          alpha: 1,
          duration: 200,
        });

        background.setDepth(999);
        title.setDepth(9999);

        // move the image a little bit
        if (!globalConfig.baseBackground) {
          container.movingImageTween = scene.tweens.add({
            targets: background,
            y: "+=150",
            x: "+=150",
            duration: 30000,
          });
        }
      });

      mask.on("pointerout", () => {
        const title = container.titles[index];
        const image = container.images[index];
        if (title) {
          scene.tweens.add({
            targets: title,
            alpha: 1,
            y: height + 100,
            duration: 100,
          });
        }

        scene.input.setDefaultCursor("default");
        title.setDepth(9);
        if (!globalConfig.baseBackground) {
          background.setDepth(99);

          background.setPosition(partWidth * index, height / 2);
        }

        // remove scale effect
        if (container.movingImageTween) container.movingImageTween.stop();
        if (!globalConfig.baseBackground) {
          scene.tweens.add({
            targets: background,
            alpha: 1,
            scale: container.backgorundScaleSize,
            duration: 200,
          });
        }

        scene.tweens.add({
          targets: image,
          scale: container.imageScaleSize,
          alpha: 0.2,
          duration: 200,
        });
      });

      if (item.disabled) {
        mask.setInteractive().disableInteractive();

        title.setAlpha(0.5).setStyle({ color: "#000000" });

        // image
        //   .setAlpha(0.5)
        //   .setTint(0x000000);

        imageShadow.setAlpha(0).setTint(0x000000);
      }

      if (item.customScale) {
        image.setScale(item.customScale);
        imageShadow.setScale(item.customScale / 2);
      }
    });

    if(globalConfig.baseOverlay){
      globalOverlay = scene.add.image(width / 2, height, globalConfig.baseOverlay).setOrigin(0.5, 1);

    }

    const playSelection = (scene: RPG) => {
      this.stopAllOtherClicksAndInteractions(scene);
      container.on("pointerdown", () => {
        scene.input.stopPropagation();
        return true;
      });
      scene.cameras.cameras.forEach((camera) => {
        if (scene.UICamera && scene.UICamera.id === camera.id) return;
        camera.ignore(container);
      });
      container.setDepth(999);
      scene.tweens.add({
        targets: container,
        alpha: 1,
        duration: 500,
      });
    };

    container.playSelection = playSelection;

    return container;
  }
  stopAllOtherClicksAndInteractions(scene: RPG) {
    scene.player?.setCanMove(false);
  }

  resumeAllClicksAndInteractions(scene: RPG) {
    scene.player?.setCanMove(true);
  }
}
