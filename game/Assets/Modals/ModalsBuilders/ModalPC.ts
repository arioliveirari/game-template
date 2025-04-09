import RPG from "@/game/rpg";
import {
  Inventory,
  Item,
  ModalConfig,
  ProductToBuy,
  missionsType,
  modalType,
} from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { AppearModeEnum, ModalBase } from "./ModalBase";
import TitleComponent from "../ModalComponents/TitleComponent";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";
import possibleSounds from "../../../../game/modules/possibleSounds.json";
import FormAssemblySingleton, { FormType } from "@/services/formAssembly";
import { ChallengeState, ChallengeType } from "@/game/services/EventChallengeListener";
import { globalState } from "@/game/GlobalDataManager";

const COLOR_PRIMARY = 0x00000000;
const COLOR_LIGHT = 0xffffff;
const COLOR_DARK = 0x000000;
const SliderWidth = 20;

export class ModalPC extends ModalBase {
  scene: RPG;
  agreeButton: ButtonComponent;
  cancelButton: ButtonComponent;
  activeTween: Phaser.Tweens.Tween | null = null;
  canBuy: boolean = false;
  eventCenter = EventsCenterManager.getInstance();
  scrollPanel: rexUI.GridTable;
  centerPoint: Phaser.GameObjects.Sprite;
  constructor(scene: RPG, x: number, y: number) {
    super(scene, x, y, AppearModeEnum.FROMLEFT);
    this.scene = scene;

    const handleAgreeModalRoom = (bought: ProductToBuy[]) => {
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.BUY_ITEMS,
        bought
      );
      // if (bought instanceof Array) {
      // } else {
      //     this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_ITEM, bought);
      // }
    };
    // separar items que van al shop de los que son el inventario
    const modalConfig = {
      type: modalType.PC,
      title: "MERCADO DE PULGAS ONLINE",
      picture: "desafioTest2",
      text: "CAMARA",
      products: this.eventCenter
        .emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null)
        .items.filter((item: Item) => item.inStore),
      agreeFunction: handleAgreeModalRoom,
    };

    const globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );
    const inventary = globalState.inventary;
    modalConfig.products?.forEach((product: Item, index: number) => {
      if (inventary.items.some((item: Item) => item.id === product.id)) {
        product.inInventory = true;
      }
    });

    const selectedItems: any = [];
    const selectStates: boolean[] = (modalConfig.products ?? []).map(
      () => false
    );

    //Modals containers
    const topContainer = this.scene.add.container(0, -225);
    // const centerContainer = this.scene.add.container(-150, 0);

    //backgroundModal
    const modalBackground = this.scene.add
      .image(0, 0, "modalBackground")
      .setOrigin(0.5)
      .setScale(1.2)
      .setInteractive();

    //LEFT BUTTON
    this.agreeButton = new ButtonComponent(
      this.scene,
      -100,
      40,
      200,
      "ACEPTAR",
      "btn",
      "#ffffff",
      "16",
      1.2,
      1,
      () => {
        if (!this.canBuy) return;
        modalConfig.agreeFunction(selectedItems);
        this.handleClose();
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.buttonAccept);
      }
    );

    if (modalConfig.products && modalConfig.products.length > 0) {
      selectStates.forEach((state, index) => {
        if (
          modalConfig.products &&
          inventary.items.some(
            (item: Inventory) => item.id === modalConfig.products![index].id
          )
        ) {
          selectStates[index] = true;
        } else selectStates[index] = false;
      });
    }

    //TOP CONTAINER
    const btnExit_p = new ButtonComponent(
      this.scene,
      465,
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
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.buttonClose);
      }
    );

    //@ts-ignore
    const title_p = new TitleComponent(
      this.scene,
      5,
      5,
      modalConfig.title,
      400
    );

    topContainer.add([title_p, btnExit_p]);

    const checkMoney = () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.clickOnProduct);
      let totalAmount = 0;
      selectedItems.forEach((product: Item) => {
        if (product.buyPrice) totalAmount += product.buyPrice;
      });
      if (totalAmount > globalState.inventary.digitalMoney) {
        leftTextNotMoney.setVisible(true);
        this.agreeButton.setAlpha(0.5);
        this.canBuy = false;
      } else {
        leftTextNotMoney.setVisible(false);
        this.agreeButton.setAlpha(1);
        this.canBuy = true;
      }
    };
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-sizer/
    // https://rexrainbow-github-io.translate.goog/phaser3-rex-notes/docs/site/ui-overview/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc
    // https://rexrainbow-github-io.translate.goog/phaser3-rex-notes/docs/site/ui-scrollablepanel/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

    const rexUI = (this.scene as any).rexUI as rexUI;

    var CreateLevelButton = function (
      scene: RPG & { rexUI: typeof rexUI },
      width: number,
      height: number,
      item: Item
    ) {

      const bold = "bold";
      const gold = "#FFD700";

      var name = scene.add.text(0, 0, " ", {
        fontSize: "16px",
        fontStyle: bold,
      });

      var emptyText = scene.add.text(0, 0, "", {
        fontSize: "16px",
        fontStyle: bold,
      });

      var image = scene.add
        .image(x, y, "")
        .setScale(0.8)
        .setAlpha(1);
      
      var iconDigitalMoney = scene.add
        .image(0, 0, "iconDigitalMoney").setScale(0.5);


      var price = scene.add.text(0, 0, "", {
        fontSize: "26px",
        color: gold,
        fontStyle: bold,
      });

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
            .add(image)
            .addSpace(),
          2,
          "center",
          { top: 0, bottom: 0, left: 10, right: 10 },
          true
        )
        .add(
          scene.rexUI.add
            .sizer({
              orientation: "x",
            })
            .addSpace()
            .add(name)
            .addSpace(),
          1,
          "center",
          { top: 4, bottom: 2, left: 12, right: 10 },
          true
        )
        .add(
          scene.rexUI.add
            .sizer({
              orientation: "x",
            })

            .addSpace()
            .add(iconDigitalMoney)
            .add(price)
            .addSpace(),
          1,
          "center",
          { top: 2, bottom: 50, left: 12, right: 10 },
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
          { top: 2, bottom: 50, left: 12, right: 10 },
          true
        );

      button.addChildrenMap("name", name);
      button.addChildrenMap("image", image);
      button.addChildrenMap("price", price);
      button.addChildrenMap("iconDigitalMoney",iconDigitalMoney)

      //@ts-ignore
      button.addChildrenMap("product", item);

      return button;
    };

    const scrollMode = 0;
    this.scrollPanel = rexUI.add.gridTable({
      x: 0,
      y: 0,
      height: 350,

      width: modalBackground.displayWidth - 16,

      scrollMode: scrollMode,
      scrollDetectionMode: 1,
      table: {
        cellWidth: scrollMode === 0 ? undefined : 60,
        cellHeight: scrollMode === 0 ? 170 : undefined,

        columns: 3,

        mask: {
          padding: 2,
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
        
        //@ts-ignore
        cellContainer.getElement("name").setText(item.name);
        //@ts-ignore
        cellContainer.getElement("price").setText((!item.inInventory) ? ` ${item.buyPrice}` : `COMPRADO`);
        if(item.inInventory) {
          //@ts-ignore
          cellContainer.getElement("iconDigitalMoney").destroy();
        }
        //@ts-ignore
        cellContainer.setMinSize(width, height);
        //@ts-ignore
        cellContainer.getElement("image").setTexture(item.imageInStore + (item.inInventory || selectedItems.includes(item) ? "On" : "Off"));


        return cellContainer;
      },

      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },

      items: modalConfig.products, // CreateItems(100),

      slider: {
        track: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 20,
          radius: 10,
          color: COLOR_DARK,
        }),
        thumb: rexUI.add.roundRectangle({
          radius: 13,
          color: COLOR_LIGHT,
        }),
      },
      scroller: {
        threshold: 10,
        slidingDeceleration: 5000,
        backDeceleration: 200
      },
      mouseWheelScroller: {
        focus: true,
        speed: 0.5
      },
    });
    this.scrollPanel.setScale(this.baseScale)

    this.scrollPanel.layout();

    this.scrollPanel.on(
      "cell.down",
      function (cellContainer: any) {
        const img = cellContainer.getElement(
          "image"
        ) as Phaser.GameObjects.Image;

        const item = cellContainer.getElement(
          "product"
        ) as Item;

        if (item.inInventory) return;
        else {
          if (!selectedItems.includes(item)) {
            selectedItems.push(item);
            item.imageInStore &&
              img.setTexture(item.imageInStore + "On");
            checkMoney();

          } else {
            selectedItems.splice(selectedItems.indexOf(item), 1);
            item.imageInStore && img.setTexture(item.imageInStore + "Off");
            checkMoney();
            
          }
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
      // panel,
      // centerContainer,
    ]);


    //Buttons Container
    const buttonsContainer = this.scene.add.container(0, 215);
    const rightButtonContainer = this.scene.add.container(100, 40);

    //not enough money text
    const leftTextNotMoney = this.scene.add
      .text(0, 15, "NO TIENES SUFICIENTE DINERO", {
        fontFamily: "MontserratSemiBold",
        fontSize: "12px",
        color: "#ff0011",
      })
      .setOrigin(0.5)
      .setVisible(false);

    //RIGHT BUTTON
    this.cancelButton = new ButtonComponent(
      this.scene,
      0,
      0,
      200,
      "CANCELAR",
      "btn",
      "#ffffff",
      "16",
      1.2,
      1,
      () => {
        leftTextNotMoney.setVisible(false);
        this.agreeButton.setAlpha(1);
        this.handleClose();
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.buttonCancel);
      }
    );

    rightButtonContainer.add([this.cancelButton]);

    buttonsContainer.add([
      this.agreeButton,
      rightButtonContainer,
      leftTextNotMoney,
    ]);

    this.modalContainerWithElements.add([
      modalBackground,
      topContainer,
      this.centerPoint,
      // centerContainer,
      buttonsContainer,
    ]);

   this.startLoadingForms();
  }
 
  startLoadingForms() {

    let loadingSpinnerContainer = this.scene.add.container(0, 0);
    let loadingSpinner = this.scene.add.sprite(0, 0, "loadingSpinner");
    loadingSpinner.playSpinner = () => {
      this.scene.tweens.add({
        targets: loadingSpinner,
        angle: 360,
        duration: 2000,
        repeat: -1,
      });
    };

    loadingSpinnerContainer.add(loadingSpinner);
    this.add(loadingSpinnerContainer);
    loadingSpinner.playSpinner();
    const forms = FormAssemblySingleton;
    const stringID = "159";
    forms.getFormId(stringID).then((res) => {
      loadingSpinner.destroy();
      

      const globalData = this.eventCenter.emitWithResponse(
        this.eventCenter.possibleEvents.GET_STATE,
        null
      ) as globalState

      const {
        missionsType,
        configMinigames,
        rewards,
        questionsForms,
      } = forms.createMissionObjectwithObj(forms.parseFormResponse(res.data as FormType, Number(stringID)),globalData)

      // globalState.configMinigames = [...globalState.configMinigames, newConfigMiniGame]
      // globalState.rewards = [...globalState.rewards, newReward]
      // globalState.questionsForms = [...globalState.questionsForms, ...newQuestionsForms]


      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_RECORD, { 
        key: "configMinigames",
        value: configMinigames
      });

      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_RECORD, { 
        key: "rewards",
        value: rewards
      });

      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_RECORD, { 
        key: "questionsForms",
        value: questionsForms
      });


      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_MISSION_RECORD, missionsType.mission);

      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL_FORM, missionsType );
      
    });

  }
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
