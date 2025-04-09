import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { globalState } from "@/game/GlobalDataManager";
import { ItemSelected, TrofySelected } from "./ModalTrofies";
import AcademyData from "../../../MockData/AcademyMockData.json";
import FormAssemblySingleton, { FormType } from "@/services/formAssembly";
import { ModalBase } from "./ModalBase";

const SliderWidth = 20;

export type AcademyItemType = {
  id: number;
  name: string;
  description: string;
  imageInAcademy: string;
  imageInGrid: string;
  type: string;
  requirement: number[];
  reward: number[];
  isDone: boolean;
  itemIdMatch: number;
};
export class AcademyContainer extends Phaser.GameObjects.Container {
  scene: RPG;
  activeTween: Phaser.Tweens.Tween | null = null;
  canBuy: boolean = false;
  eventCenter = EventsCenterManager.getInstance();
  scrollPanel: rexUI.GridTable;
  centerPoint: Phaser.GameObjects.Sprite;
  trofySelected: AcademyItemType | null = null;
  trofySelectedRight?: TrofySelected;
  itemSelectedRight?: ItemSelected;
  lastItemImgRef: number | null = null;
  buyButton: ButtonComponent;
  rightContainer: Phaser.GameObjects.Container;
  modalConfig: {
    type: string;
    title: string;
    products: AcademyItemType[];
  };
  handleClose: Function

  constructor(scene: RPG, x: number, y: number, type: string = "academy", modalBase: ModalBase) {
    super(scene, x, y);
    this.scene = scene;
    this.handleClose = modalBase.handleClose;
    this.modalConfig = {
      type: type, // NO SE USA
      title: type === "trofies" ? "LOGROS" : "INVENTARIO", // NO SE USA
      products: this.checkItems(AcademyData.items),
    };
    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
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
        })
        .setOrigin(0.5)
        .setVisible(false),
      bg: this.scene.add
        .image(0, -50, "")
        .setScale(1)
        .setOrigin(0.5)
        .setDepth(10)
        .setVisible(false),
    };

    console.log(this.modalConfig.products, this.lastItemImgRef, "asdsadsad");
    this.buyButton = new ButtonComponent(
      this.scene,
      0,
      140,
      300,
      "COMENZAR",
      "buttonDisable",
      // !this.modalConfig.products[this.lastItemImgRef || 0].isDone
      //   ? "buttonAvailable"
      //   : "buttonDisable",
      "#ffffff",
      "16",
      1,
      1,
      () => {
        // this.startLoadingForms();
        // conectar con barto logic
        // champan, fijate que dps de hacer el form necesitariamos que pase la property isDone a true
        // y que se vea el item en la parte de abajo, y que no se pueda volver a comprar
      },
      {
        x: 0.9,
        y: 1,
      },
      true // event .once
    ).setVisible(false);

    this.rightContainer.add([
      this.itemSelectedRight.name,
      this.itemSelectedRight.description,
      this.itemSelectedRight.bg,
      this.itemSelectedRight.icon,
      this.buyButton,
    ]);

    const rexUI = (this.scene as any).rexUI as rexUI;

    var CreateLevelButton = function (
      scene: RPG & { rexUI: typeof rexUI },
      width: number,
      height: number,
      item: AcademyItemType
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

      var container = scene.rexUI.add.container(0, 0, width, height, [image]);

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
      console.log("image", image, item);
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
        var item = cell.item as AcademyItemType;
        if (cellContainer === null) {
          cellContainer = CreateLevelButton(scene as any, width, height, item);
        }

        item = item as AcademyItemType;
        //@ts-ignore
        cellContainer.getElement("name").setText(item.name);
        //@ts-ignore
        cellContainer.setMinSize(width, height);
        //@ts-ignore
        cellContainer.getElement("image")
          .setTexture(`${item.imageInGrid + (item.isDone ? "On" : "Off")}`)
          .setDepth(10);
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
        const item = cellContainer.getElement("product") as AcademyItemType;
        const img = cellContainer.getElement(
          "image"
        ) as Phaser.GameObjects.Image;
        img.setTexture(`${item.imageInGrid + "On"}`);
        this.drawTrofy(item);
        this.trofySelected = item;

        console.log(this.trofySelected, "trofySelected");
        if (this.lastItemImgRef === null) {
          this.lastItemImgRef = indexOfItem;
          return;
        }
        const lastItem = this.scrollPanel.items[
          this.lastItemImgRef
        ] as AcademyItemType;
        if (lastItem && lastItem.isDone) {
          this.lastItemImgRef = indexOfItem;
          return;
        }
        const lastChild = this.scrollPanel.getCellContainer(
          this.lastItemImgRef
        );
        //@ts-ignore
        const image = lastChild?.getElement(
          "image"
        ) as Phaser.GameObjects.Image;
        image.setTexture(`${lastItem.imageInGrid + "Off"}`);
        this.lastItemImgRef = indexOfItem;
        this.scrollPanel.layout();
      },
      this
    );

    this.scene.cameras.main?.ignore(this.scrollPanel);

    this.centerPoint = this.scene.add
      .sprite(-20, 40, "centerPoint")
      .setOrigin(0.5);
    this.centerPoint.setAlpha(0);
    this.add([this.centerPoint, leftContainer, this.rightContainer]);
    this.scrollPanel.setAlpha(0);
    this.scene.add.existing(this);
  }


  checkItems(items: AcademyItemType[]) {
    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );
    const InventoryItems = globalState.inventary.items;
    // iterate all items, check if the trofy on trofyIdMatch is already made, to change the isDone  property
    let _items:AcademyItemType[] = []

    console.log(InventoryItems,items)
    items.forEach((item) => {
      const itemIDMatch = InventoryItems.find((i) => i.id === item.itemIdMatch);
      if (itemIDMatch && itemIDMatch.inInventory) {
        item.isDone = true;
      }
      _items.push(item);
    });
    console.log(_items)
    return _items
  }

  drawTrofy = (trofy: AcademyItemType) => {
    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );
    this.itemSelectedRight?.name.setText(trofy.name);
    this.itemSelectedRight?.name.setWordWrapWidth(300);

    this.itemSelectedRight?.description.setText(`${trofy.description}`);
    this.itemSelectedRight?.description.setWordWrapWidth(300);
    this.itemSelectedRight?.bg.setTexture(`itemBackground`).setScale(0.9); //.setDepth(10);
    this.itemSelectedRight?.icon.setTexture(`${trofy.imageInAcademy}`); //.setDepth(1);

    if (trofy.isDone) {
      this.buyButton.setBackgroundTexture("buttonDisable");
      this.buyButton.background.removeInteractive();
      this.buyButton.setAlpha(0.3);
    } else {
      this.buyButton.setAlpha(1);
      this.buyButton.setBackgroundTexture("buttonAvailable");
      this.buyButton.background.setInteractive();
    }

    this.itemSelectedRight?.name.setVisible(true);
    this.itemSelectedRight?.description.setVisible(true);
    this.itemSelectedRight?.bg.setVisible(true);
    this.itemSelectedRight?.icon.setVisible(true);
    console.log("trofySelected", trofy);
    if (trofy?.isDone) {
      this.buyButton.setBackgroundTexture("buttonDisable");
      this.buyButton.background.removeInteractive();
    } else {
      this.buyButton.setBackgroundTexture("buttonAvailable");
      this.buyButton.background.setInteractive();

      this.buyButton.callback = () => {
        this.startLoadingForms(trofy.id.toString())
        this.handleClose();
      }
    }
    this.buyButton.setVisible(true);

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

  startLoadingForms(id:string) {
    let loadingSpinnerContainer = this.scene.add.container(0, 0);
    let loadingSpinner = this.scene.add.sprite(0, 0, "loadingSpinner");
    // loadingSpinner.playSpinner = () => {
    //   this.scene.tweens.add({
    //     targets: loadingSpinner,
    //     angle: 360,
    //     duration: 2000,
    //     repeat: -1,
    //   });
    // };

    loadingSpinnerContainer.add(loadingSpinner);
    this.add(loadingSpinnerContainer);
    // loadingSpinner.playSpinner();
    const forms = FormAssemblySingleton;
    forms.getFormId(id).then((res) => {
      loadingSpinner.destroy();

      const globalData = this.eventCenter.emitWithResponse(
        this.eventCenter.possibleEvents.GET_STATE,
        null
      ) as globalState;

      const { missionsType, configMinigames, rewards, questionsForms } =
        forms.createMissionObjectwithObj(
          forms.parseFormResponse(res.data as FormType, Number(id)),
          globalData
        );

      // globalState.configMinigames = [...globalState.configMinigames, newConfigMiniGame]
      // globalState.rewards = [...globalState.rewards, newReward]
      // globalState.questionsForms = [...globalState.questionsForms, ...newQuestionsForms]

      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_RECORD, {
        key: "configMinigames",
        value: configMinigames,
      });

      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_RECORD, {
        key: "rewards",
        value: rewards,
      });

      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_RECORD, {
        key: "questionsForms",
        value: questionsForms,
      });

      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.ADD_MISSION_RECORD,
        missionsType.mission
      );

      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.OPEN_MODAL_FORM,
        missionsType
      );
    });
  }
}
