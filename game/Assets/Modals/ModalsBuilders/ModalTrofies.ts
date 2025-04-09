import RPG from "@/game/rpg";
import {
  Inventory,
  Item,
  ModalConfig,
  ProductToBuy,
  modalType,
} from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { AppearModeEnum, ModalBase } from "./ModalBase";
import TitleComponent from "../ModalComponents/TitleComponent";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";
import possibleSounds from "../../../modules/possibleSounds.json";
import TrofiesMockData from "../../../MockData/TrofiesData.json";
import ItemsMockData from "../../../MockData/Items.json";
import { globalState } from "@/game/GlobalDataManager";
import { Game, GameObjects } from "phaser";

const COLOR_PRIMARY = 0x00000000;
const COLOR_LIGHT = 0xffffff;
const COLOR_DARK = 0x000000;
const SliderWidth = 20;

export type TrofyShow = {
  id: number;
  name: string;
  description: string;
  trofyIcon: string;
  hadIt: boolean;
  glow?: GameObjects.Image;
};

export type TrofySelected = {
  name: GameObjects.Text;
  description: GameObjects.Text;
  icon: GameObjects.Image;
  glow: GameObjects.Image;
};

export type ItemSelected = {
  name: GameObjects.Text;
  description: GameObjects.Text;
  icon: GameObjects.Image;
  bg: GameObjects.Image;
};

export class ModalTrofies extends ModalBase {
  scene: RPG;
  activeTween: Phaser.Tweens.Tween | null = null;
  canBuy: boolean = false;
  eventCenter = EventsCenterManager.getInstance();
  scrollPanel: rexUI.GridTable;
  centerPoint: Phaser.GameObjects.Sprite;
  trofySelected: TrofyShow | Item | null = null;
  trofySelectedRight?: TrofySelected;
  itemSelectedRight?: ItemSelected;
  lastItemImgRef: Phaser.GameObjects.Image | null = null;
  rightContainer: Phaser.GameObjects.Container;
  isScrolling: boolean = false;
  modalConfig: {
    type: string;
    title: string;
    products: TrofyShow[] | Item[];
  };

  constructor(scene: RPG, x: number, y: number, type: string = "trofies") {
    super(scene, x, y, AppearModeEnum.FROMLEFT);
    this.scene = scene;

    this.modalConfig = {
      type: type,
      title: type === 'trofies' ? "LOGROS" : "INVENTARIO",
      products: type === 'trofies' ? TrofiesMockData.trofies as TrofyShow[] : ItemsMockData.items as Item[],
    };

    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );

    if (type === 'trofies') {
      const trofiesHad = globalState.trofies;
      (this.modalConfig.products as TrofyShow[])?.forEach((product: TrofyShow, index: number) => {
        if (trofiesHad.some((trofy: { id: number }) => trofy.id === product.id)) {
          product.hadIt = true;
        }
      });
    } else if (type === 'inventory') {
      this.modalConfig.products = globalState.inventary.items.filter((item: Item) => (item.inInventory && item.id !== 15 && item.id !== 3));
    }

    /*
    const selectedItems: any = [];
    const selectStates: boolean[] = (modalConfig.products ?? []).map(
      () => false
    );
    */

    //Modals containers
    const topContainer = this.scene.add.container(0, -225);
    // const centerContainer = this.scene.add.container(-150, 0);

    //backgroundModal
    const modalBackground = this.scene.add
      .image(0, 0, "trofiesBackground")
      .setOrigin(0.5)
      .setScale(1)
      .setInteractive();

    const leftContainer = this.scene.add.container(-168, 55);

    let leftBackground = this.scene.add
      .image(0, 0, "backgroundTrofies")
      .setOrigin(0.5)
      .setScale(1);

    leftContainer.add(leftBackground);

    this.rightContainer = this.scene.add.container(235, 50);

    if (this.modalConfig.type === 'trofies') {
      this.trofySelectedRight = {
        name: this.scene.add
          .text(0, -120, "", {
            fontFamily: "MontserratBold",
            fontStyle: "bold",
            fontSize: "24px",
            color: "#ffffff",
          })
          .setOrigin(0.5)
          .setVisible(false),
        icon: this.scene.add
          .image(0, 0, "")
          .setScale(1)
          .setOrigin(0.5)
          .setVisible(false),
        glow: this.scene.add
          .image(0, 0, "")
          .setScale(1)
          .setOrigin(0.5)
          .setVisible(false),
        description: this.scene.add
          .text(0, 130, "", {
            fontFamily: "MontserratSemiBold",
            fontSize: "16px",
            color: "#ffffff",
            //wordWrap: { width: 300 },
            //fixedWidth: 300,
            //fixedHeight: 100,
          })
          .setOrigin(0.5)
          .setVisible(false),
      };

      this.rightContainer.add([
        this.trofySelectedRight.glow,
        this.trofySelectedRight.icon,
        this.trofySelectedRight.name,
        this.trofySelectedRight.description,
      ]);
    } else {
      this.itemSelectedRight = {
        name: this.scene.add
          .text(0, -120, "", {
            fontFamily: "MontserratBold",
            fontStyle: "bold",
            fontSize: "24px",
            color: "#ffffff",
          })
          .setOrigin(0.5)
          .setVisible(false),
        icon: this.scene.add
          .image(0, 0, "")
          .setScale(1)
          .setOrigin(0.5)
          .setDepth(1)
          .setVisible(false),
        description: this.scene.add
          .text(0, 130, "", {
            fontFamily: "MontserratSemiBold",
            fontSize: "16px",
            color: "#ffffff",
            //wordWrap: { width: 300 },
            //fixedWidth: 300,
            //fixedHeight: 100,
          })
          .setOrigin(0.5)
          .setVisible(false),
        bg: this.scene.add
          .image(0, 0, "")
          .setScale(1)
          .setOrigin(0.5)
          .setDepth(10)
          .setVisible(false),
      }

      this.rightContainer.add([
        this.itemSelectedRight.name,
        this.itemSelectedRight.description,
        this.itemSelectedRight.bg,
        this.itemSelectedRight.icon,
      ]);

    }



    //TOP CONTAINER
    const btnExit_p = new ButtonComponent(
      this.scene,
      340,
      0,
      200,
      "",
      "btnExit",
      "#ffffff",
      "16",
      1.2,
      1,
      () => {
        this.handleClose();
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.PLAY_SOUND,
          possibleSounds.sounds.modals.storePC.buttonClose
        );
      }
    );

    //@ts-ignore
    const title_p = new TitleComponent(
      this.scene,
      5,
      5,
      this.modalConfig.title,
      400,
      "26"
    );

    topContainer.add([title_p, btnExit_p]);

    if (this.modalConfig.type === 'trofies') {
      const stars = this.scene.add.image(0, 5, "trofyStars").setScale(0.7).setOrigin(0.5);
      topContainer.add(stars);
    }

    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-sizer/
    // https://rexrainbow-github-io.translate.goog/phaser3-rex-notes/docs/site/ui-overview/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc
    // https://rexrainbow-github-io.translate.goog/phaser3-rex-notes/docs/site/ui-scrollablepanel/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

    const rexUI = (this.scene as any).rexUI as rexUI;

    var CreateLevelButton = function (
      scene: RPG & { rexUI: typeof rexUI },
      width: number,
      height: number,
      item: TrofyShow | Item
    ) {
      const bold = "bold";

      var name = scene.add.text(0, 0, " ", {
        fontFamily: "MontserratSemiBold",
        fontSize: "12px",
        fontStyle: bold,
        color: "#ffffff",
      });

      var emptyText = scene.add.text(0, 0, "", {
        fontSize: "16px",
        fontStyle: bold,
      });

      var image = scene.add.image(0, 0, "").setScale(1).setAlpha(1);

      var glow = scene.add.image(0, 0, "").setScale(1).setAlpha(1);

      // var container = scene.add.container(x, y, [image, glow]);

      var container = scene.rexUI.add.container(0, 0, width, height, [
        glow,
        image
      ]);

      var button = scene.rexUI.add
        .sizer({
          width: width,
          height: height,
          orientation: "y",
        })
        .add(
          scene.rexUI.add
            .sizer({
              orientation: "x",
            })
            .addSpace()
            .add(container)
            // .addToContainer(container)
            .addSpace(),
          2,
          "center",
          { top: 0, bottom: 0, left: 10, right: 10 },
          true
        )
        .add(
          scene.rexUI.add
            .sizer({
              width: width,
              orientation: "y",
              origin: 0.5,
            })
            .add(name),
          1,
          "center",
          { top: -24, bottom: 0, left: 0, right: 0 },
          true
        )
        .add(
          scene.rexUI.add
            .sizer({
              orientation: "x",
            })

            .addSpace()
            .add(emptyText)
            .addSpace(),
          1,
          "center",
          { top: 0, bottom: 0, left: 0, right: 0 },
          true
        );

      // button.addChildrenMap("container", container);
      button.addChildrenMap("name", name);
      button.addChildrenMap("glow", glow);
      button.addChildrenMap("image", image);

      //@ts-ignore
      button.addChildrenMap("product", item);

      return button;
    };

    const scrollMode = 0;
    const that = this;

    this.scrollPanel = rexUI.add.gridTable({
      x: 5,
      y: 0,
      //originY: 0.43,
      originY: 0.43,
      //originX: 1.05,
      originX: 0.82,
      height: 440,
      width: 480,
      //background: this.scene.add.rectangle(0, 0, 500, 400, 0x00ff00),
      //width: leftBackground.displayWidth - 16,

      scrollMode: scrollMode,
      scrollDetectionMode: 1,
      table: {
        cellWidth: scrollMode === 0 ? undefined : 60,
        cellHeight: scrollMode === 0 ? 170 : undefined,

        columns: 3,

        mask: {
          padding: 0,
        },

        reuseCellContainer: false,
      },

      createCellContainerCallback: function (cell, cellContainer) {
        var scene = cell.scene,
          width = cell.width,
          height = cell.height,
          index = cell.index;
        var item = cell.item as TrofyShow | Item;
        if (cellContainer === null) {
          cellContainer = CreateLevelButton(scene as any, width, height, item);
        }

        if (that.modalConfig.type === 'trofies') {
          item = item as TrofyShow;
          //@ts-ignore
          cellContainer.getElement("name").setText(item.hadIt ? item.name : "");
          //@ts-ignore
          cellContainer.setMinSize(width, height);
          //@ts-ignore
          cellContainer.getElement("image")
            .setTexture(item.hadIt ? item.trofyIcon : "blockTrofy").setDepth(10)

          //@ts-ignore
          cellContainer.getElement("glow").setTexture(item.trofyIcon + "_Glow").setDepth(1)

          //@ts-ignore
          cellContainer.getElement("glow").setAlpha(0);
        } else {
          item = item as Item;
          //@ts-ignore
          cellContainer.getElement("name").setText(item.inInventory ? item.name : "");
          //@ts-ignore
          cellContainer.setMinSize(width, height);
          //@ts-ignore
          cellContainer.getElement("image")
            .setTexture(`${item.imageInStore + "Off"}`).setDepth(10)
          if (that.lastItemImgRef) that.lastItemImgRef = null;
        }


        return cellContainer;
      },

      space: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },

      items: this.modalConfig.products, // CreateItems(100),

      slider: {
        minThumbSize: 30,
        adaptThumbSize: true,
        track: rexUI.add
          .roundRectangle({
            width: SliderWidth,
            height: 20,
            radius: { tl: 0, tr: 0, bl: 0, br: 0 },
            color: 0x282828,
            alpha: 1,
          })
          .setStrokeStyle(2, 0x000000),

        thumb: rexUI.add
          .roundRectangle({
            width: SliderWidth,
            height: 100,
            radius: { tl: 0, tr: 0, bl: 0, br: 0 },
            color: 0x333333,
          })
          .setStrokeStyle(3, 0x000000),
      },
      scroller: {
        threshold: 10,
        slidingDeceleration: 5000,
        backDeceleration: 200,
      },
      mouseWheelScroller: {
        focus: true,
        speed: 0.5,
      },
    });
    this.scrollPanel.setScale(this.baseScale);

    this.scrollPanel.layout();
    // this.scrollPanel.drawBounds(this.scene.add.graphics(), 0xff0000);

    this.scrollPanel.on(
      "cell.down",
      function (cellContainer: any) {
        if (that.isScrolling) {
          return;
        }
        that.isScrolling = false;
        const item = cellContainer.getElement("product") as TrofyShow | Item;
        const img = cellContainer.getElement(
          "image"
        ) as Phaser.GameObjects.Image;

        const glow = cellContainer.getElement(
          "glow"
        ) as Phaser.GameObjects.Image;

        let lastTrofy = that.trofySelected;
        that.trofySelected = item;

        if ('trofyIcon' in item) {
          if (!item.hadIt) return;
          else {
            glow.setTexture(item.trofyIcon + "_Glow");
            glow.setAlpha(0);
            glow.depth = 1;
            img.depth = 10;

            if (lastTrofy && lastTrofy?.id !== item.id) {
              //@ts-ignore
              if (lastTrofy?.glow) {
                //@ts-ignore
                lastTrofy.glow.setAlpha(0);
              }

            }

            that.trofySelected = item;
            that.trofySelected.glow = glow;
            that.drawTrofy(item);

            if (that.modalConfig.type === 'trofies') {
              that.activeTween = that.scene.tweens.add({
                targets: that.trofySelected.glow,
                alpha: { from: 0, to: 1 },
                duration: 150,
                yoyo: false,
                repeat: 0,
                ease: "Sine.easeInOut",
                onComplete: () => {
                  //@ts-ignore
                  if (that.trofySelected && that.trofySelected.glow) {
                    //@ts-ignore
                    that.trofySelected.glow.setAlpha(1);
                  }
                },
              });
            }

            that.scrollPanel.layout();
          }
        } else {

          if (lastTrofy && lastTrofy?.id !== item.id) {
            if (that.lastItemImgRef && that.lastItemImgRef.texture && that.lastItemImgRef.texture.key.endsWith("On")) {
              that.lastItemImgRef.setTexture(`${that.lastItemImgRef.texture.key.slice(0, -2) + "Off"}`);
            }
          }
          img.setTexture(`${item.imageInStore + "On"}`);
          that.lastItemImgRef = img;
          that.drawTrofy(item);
        }


      },
      this
    );


    this.scene.cameras.main?.ignore(this.scrollPanel);

    this.centerPoint = this.scene.add
      .sprite(0, 40, "centerPoint")
      .setOrigin(0.5);
    this.centerPoint.setAlpha(0);

    this.add([
      topContainer,
      this.centerPoint,
      leftContainer,
      this.rightContainer,
      // panel,
      // centerContainer,
    ]);

    this.modalContainerWithElements.add([
      modalBackground,
      topContainer,
      this.centerPoint,
      leftContainer,
      this.rightContainer,
      // centerContainer,
    ]);
  }

  drawTrofy = (trofy: TrofyShow | Item) => {
    if ("trofyIcon" in trofy) {
      if (this.trofySelectedRight) {
        this.trofySelectedRight.name.setText(trofy.name);
        this.trofySelectedRight.icon.setTexture(`${trofy.trofyIcon}_Show`);
        this.trofySelectedRight.description.setText(trofy.description);
        this.trofySelectedRight.description.setWordWrapWidth(300);
        //this.trofySelectedRight.description.setWordWrap(true);

        if (this.modalConfig.type === 'trofies') {
          this.trofySelectedRight.glow.setTexture(`${trofy.trofyIcon}_Show_Effect`);

          this.scene.add.tween({
            targets: this.trofySelectedRight.glow,
            angle: 360,
            duration: 8000,
            repeat: -1,
            ease: "Linear",
            yoyo: true,
            onComplete: () => {
              this.scene.add.tween({
                targets: this.trofySelectedRight?.glow,
                angle: -360,
                duration: 8000,
                repeat: -1,
                ease: "Linear",
                yoyo: true,
              });
            },
          });

          this.trofySelectedRight.glow.setVisible(true);
        }

        this.trofySelectedRight.name.setVisible(true);
        this.trofySelectedRight.icon.setVisible(true);
        this.trofySelectedRight.description.setVisible(true);

      }
    } else {
      this.itemSelectedRight?.name.setText(trofy.name);
      this.itemSelectedRight?.name.setWordWrapWidth(300);

      this.itemSelectedRight?.description.setText(`${trofy.description}`);
      this.itemSelectedRight?.description.setWordWrapWidth(300);
      this.itemSelectedRight?.bg.setTexture(`itemBackground`).setScale(0.9)//.setDepth(10);
      this.itemSelectedRight?.icon.setTexture(`${trofy.imageInStore}`)//.setDepth(1);

      this.itemSelectedRight?.name.setVisible(true);
      this.itemSelectedRight?.description.setVisible(true);
      this.itemSelectedRight?.bg.setVisible(true);
      this.itemSelectedRight?.icon.setVisible(true);

    }
  };

  fireClose() {
    this.scrollPanel.destroy();
  }
  fireUpdate() {
    // move this.scrollPanel if exist to the position of the container
    // get globla position of centerPoint
    const point = this.centerPoint.getBounds();

    if (this.scrollPanel) {
      this.scrollPanel.setPosition(point.x + SliderWidth / 2, point.y);
    }
  }
}
