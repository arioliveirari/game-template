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
import { ItemSelected, TrofySelected } from "./ModalTrofies";

const COLOR_PRIMARY = 0x00000000;
const COLOR_LIGHT = 0xffffff;
const COLOR_DARK = 0x000000;
const SliderWidth = 20;


export class StoreContainer extends Phaser.GameObjects.Container {
  scene: RPG;
  activeTween: Phaser.Tweens.Tween | null = null;
  canBuy: boolean = false;
  eventCenter = EventsCenterManager.getInstance();
  scrollPanel: rexUI.GridTable;
  centerPoint: Phaser.GameObjects.Sprite;
  itemSelected: Item | null = null;
  trofySelected: Item | null = null;
  trofySelectedRight?: TrofySelected;
  itemSelectedRight?: ItemSelected;
  lastItemImgRef: number | null = null;
  iconCashSell: Phaser.GameObjects.Image;
  textMoneySell: Phaser.GameObjects.Text;
  sellButton: ButtonComponent;
  iconCashBuy: Phaser.GameObjects.Image;
  textMoneyBuy: Phaser.GameObjects.Text;
  buyButton: ButtonComponent;
  rightContainer: Phaser.GameObjects.Container;
  modalConfig: {
    type: string;
    title: string;
    products: Item[];
  };
  handleClose: Function

  constructor(scene: RPG, x: number, y: number, type: string = "store", modalBase: ModalBase) {
    super(scene, x, y);
    this.scene = scene;

    this.handleClose = modalBase.handleClose;
    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );

    this.modalConfig = {
      type: type,
      title: type === 'trofies' ? "LOGROS" : "INVENTARIO",
      products: this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null).items.filter(
        (item: Item) => item.inStore && item.id !== 15 && item.id !== 3
      ),
    };


    this.modalConfig.products = this.modalConfig.products.map((item) => {
      const itemInInventory = globalState.inventary.items.find(
        (i: Item) => i.id === item.id
      );
      if (itemInInventory) {
        item.inInventory = true;
      } else {
        item.inInventory = false;
      }
      return item;
    }
    );

    const leftContainer = this.scene.add.container(-168, 55);

    let leftBackground = this.scene.add
      .image(0, 0, "backgroundTrofies")
      .setOrigin(0.5)
      .setScale(1);

    leftContainer.add(leftBackground);

    this.rightContainer = this.scene.add.container(235, 50);


    this.itemSelectedRight = {
      name: this.scene.add
        .text(0, -170, "", {
          fontFamily: "MontserratBold",
          fontStyle: "bold",
          fontSize: "24px",
          align: "center",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setVisible(false),
      icon: this.scene.add
        .image(0, -50, "")
        .setScale(1)
        .setOrigin(0.5)
        .setDepth(1)
        .setVisible(false),
      description: this.scene.add
        .text(0, 70, "", {
          fontFamily: "MontserratSemiBold",
          fontSize: "16px",
          color: "#ffffff",
          align: "center",
          //wordWrap: { width: 300 },
          //fixedWidth: 300,
          //fixedHeight: 100,
        })
        .setOrigin(0.5)
        .setVisible(false),
      bg: this.scene.add
        .image(0, -50, "")
        .setScale(1)
        .setOrigin(0.5)
        .setDepth(10)
        .setVisible(false),

    }

    this.iconCashSell = this.scene.add
      .image(-75, 125, "moneyIcon").setScale(0.8).setOrigin(1, 0.5).setVisible(false);
    this.textMoneySell = this.scene.add
      .text(-70, 125, `$ ${this.modalConfig.products[this.lastItemImgRef || 0].sellPrice}`, {
        fontFamily: "MontserratSemiBold",
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5).setVisible(false);

    this.sellButton = new ButtonComponent(
      this.scene,
      -70,
      170,
      300,
      "VENDER",
      this.modalConfig.products[this.lastItemImgRef || 0].inInventory ? "buttonAvailable" : "buttonDisable",
      "#ffffff",
      "16",
      1,
      1,
      () => {
        if (this.lastItemImgRef !== null) {
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.SELL_ITEMS,
            [this.itemSelected]
          );
          this.scrollPanel.setItems(this.modalConfig.products.map((item) => {
            if (item.id === this.itemSelected?.id) {
              item.inInventory = false;
            }
            return item;
          }))
          this.scrollPanel.layout();
        }
        this.drawTrofy(this.trofySelected as Item);
      },
      {
        x: 0.9,
        y: 1,
      },
    ).setVisible(false);;

    if (!this.modalConfig.products[this.lastItemImgRef || 0].inInventory) this.sellButton.removeInteractive();

    this.iconCashBuy = this.scene.add
      .image(60, 125, "moneyIcon").setScale(0.8).setOrigin(1, 0.5).setVisible(false);
    this.textMoneyBuy = this.scene.add
      .text(65, 125, `$ ${this.modalConfig.products[this.lastItemImgRef || 0].buyPrice}`, {
        fontFamily: "MontserratSemiBold",
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5).setVisible(false);

    this.buyButton = new ButtonComponent(
      this.scene,
      70,
      170,
      300,
      "COMPRAR",
      this.modalConfig.products[this.lastItemImgRef || 0].buyPrice <= globalState.inventary.digitalMoney ? "buttonAvailable" : "buttonDisable",
      "#ffffff",
      "16",
      1,
      1,
      () => {
        if (this.lastItemImgRef !== null) {
          this.eventCenter.emitEvent( 
            this.eventCenter.possibleEvents.BUY_ITEMS,
            [this.itemSelected]
          );
          this.scrollPanel.setItems(this.modalConfig.products.map((item) => {
            if (item.id === this.itemSelected?.id) {
              item.inInventory = true;
            }
            return item;
          }))
          this.scrollPanel.layout();
        }
        this.drawTrofy(this.trofySelected as Item);
      },
      {
        x: 0.9,
        y: 1,
      },
    ).setVisible(false);

    this.rightContainer.add([
      this.itemSelectedRight.name,
      this.itemSelectedRight.description,
      this.itemSelectedRight.bg,
      this.itemSelectedRight.icon,
      this.iconCashSell,
      this.textMoneySell,
      this.sellButton,
      this.iconCashBuy,
      this.textMoneyBuy,
      this.buyButton
    ]);

    const rexUI = (this.scene as any).rexUI as rexUI;

    var CreateLevelButton = function (
      scene: RPG & { rexUI: typeof rexUI },
      width: number,
      height: number,
      item: Item
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

      var container = scene.rexUI.add.container(0, 0, width, height, [
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
      button.addChildrenMap("image", image);

      //@ts-ignore
      button.addChildrenMap("product", item);

      return button;
    };

    const scrollMode = 0;
    let that = this;

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
        var item = cell.item as Item;
        if (cellContainer === null) {
          cellContainer = CreateLevelButton(scene as any, width, height, item);
        }

        /// PERSISTIR EL ESTADO EN UN OBJETO DEL CONSTRUCTOR Y LEERLO ACA PARA MOSTRAR / MARCAR EL ITEM O NO,
        // NO HACERLO EN EL ON CLICK
        item = item as Item;
        //@ts-ignore
        cellContainer.getElement("name").setText(item.name);
        //@ts-ignore
        cellContainer.setMinSize(width, height);
        //@ts-ignore
        cellContainer.getElement("image")
          .setTexture(`${item.imageInStore + (item.inInventory ? 'On' : 'Off')}`).setDepth(10)
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

    // this.scrollPanel.setScale(this.baseScale);
    this.scrollPanel.layout();

    this.scrollPanel.on(
      "cell.down",
      (cellContainer: any, indexOfItem: number) => {
        const item = cellContainer.getElement("product") as Item;
        const img = cellContainer.getElement(
          "image"
        ) as Phaser.GameObjects.Image;
        img.setTexture(`${item.imageInStore + "On"}`);
        this.drawTrofy(item);
        this.trofySelected = item;
        if (this.lastItemImgRef === null) {
          this.lastItemImgRef = indexOfItem;
          console.log(1111)
          return
        }
        const lastItem = this.scrollPanel.items[this.lastItemImgRef] as Item;
        if (lastItem && lastItem.inInventory) {
          this.lastItemImgRef = indexOfItem;
          console.log(2222)

          return
        };

        if(this.lastItemImgRef == indexOfItem) return
        else {
          const lastChild = this.scrollPanel.getCellContainer(this.lastItemImgRef)
          this.lastItemImgRef = indexOfItem;
          //@ts-ignore
          const image = lastChild?.getElement("image") as Phaser.GameObjects.Image;
          image.setTexture(`${lastItem.imageInStore + "Off"}`);
          this.scrollPanel.layout();
        }
        // const lastChild = this.scrollPanel.getCellContainer(this.lastItemImgRef)
        // //@ts-ignore
        // const image = lastChild?.getElement("image") as Phaser.GameObjects.Image;
        // image.setTexture(`${lastItem.imageInStore + "Off"}`);
        // this.lastItemImgRef = indexOfItem;
        // this.scrollPanel.layout();
        // console.log(item,this.lastItemImgRef)
      },
      this
    )

    this.scene.cameras.main?.ignore(this.scrollPanel);

    this.centerPoint = this.scene.add
      .sprite(-20, 40, "centerPoint")
      .setOrigin(0.5);
    this.centerPoint.setAlpha(0);
    this.add([
      this.centerPoint,
      leftContainer,
      this.rightContainer,

    ]);
    this.scrollPanel.setAlpha(0);
    this.scene.add.existing(this);
  }

  drawTrofy = (trofy: Item) => {
    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );
    this.itemSelectedRight?.name.setText(trofy.name);
    this.itemSelectedRight?.name.setWordWrapWidth(300);
    this.itemSelectedRight?.description.setText(`${trofy.description}`);
    this.itemSelectedRight?.description.setWordWrapWidth(300);
    this.itemSelectedRight?.bg.setTexture(`itemBackground`).setScale(0.9)//.setDepth(10);
    this.itemSelectedRight?.icon.setTexture(`${trofy.imageInStore}`)//.setDepth(1);
    this.textMoneyBuy.setText(`$ ${trofy.buyPrice}`);
    this.textMoneySell.setText(`$ ${trofy.sellPrice}`);
    this.itemSelected = trofy;
    if (trofy.inInventory) {
      this.sellButton.setBackgroundTexture("buttonAvailable")
      this.sellButton.background.setInteractive();
      this.buyButton.setBackgroundTexture("buttonDisable")
      this.buyButton.background.removeInteractive();
      this.buyButton.setAlpha(0.3)
      this.iconCashBuy.setAlpha(0.3)
      this.textMoneyBuy.setAlpha(0.3)
      this.iconCashSell.setAlpha(1)
      this.textMoneySell.setAlpha(1)
      this.sellButton.setAlpha(1)
    } else {
      this.buyButton.setAlpha(1)
      this.iconCashBuy.setAlpha(1)
      this.textMoneyBuy.setAlpha(1)
      this.iconCashSell.setAlpha(0.3)
      this.textMoneySell.setAlpha(0.3)
      this.sellButton.setAlpha(0.3)
      this.sellButton.background.removeInteractive();
      this.sellButton.setBackgroundTexture("buttonDisable")
      if (trofy.buyPrice > globalState.inventary.digitalMoney) {
        this.buyButton.background.removeInteractive();
        this.buyButton.setColorText("red")
      }
      else {
        this.buyButton.setColorText("white")
        this.buyButton.setBackgroundTexture("buttonAvailable")
        this.buyButton.background.setInteractive();
      }
    }

    this.itemSelectedRight?.name.setVisible(true);
    this.itemSelectedRight?.description.setVisible(true);
    this.itemSelectedRight?.bg.setVisible(true);
    this.itemSelectedRight?.icon.setVisible(true);
    this.iconCashSell.setVisible(true)
    this.textMoneySell.setVisible(true)
    this.sellButton.setVisible(true)
    this.iconCashBuy.setVisible(true)
    this.textMoneyBuy.setVisible(true)
    this.buyButton.setVisible(true)
  };

  fireClose() {
    this.scrollPanel.destroy();
    this.removeAll(true);
    this.destroy();
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
