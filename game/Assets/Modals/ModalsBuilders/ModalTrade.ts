import RPG from "@/game/rpg";
import {
  ProductToBuy,
} from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import TitleComponent from "../ModalComponents/TitleComponent";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import possibleSounds from "../../../modules/possibleSounds.json";
import ExchangeData from "../../../MockData/Exchange.json";

type exchangeType = {
  id: number;
  image: string;
  amount: number;
  buyPrice: number;
  sellPrice: number;
  name: string;
};

export type walletType = {
  type: string;
  amount: number;
};

export class ModalTrade extends ModalBase {
  scene: RPG;
  cancelButton: ButtonComponent;
  acceptButton: ButtonComponent;
  activeTween: Phaser.Tweens.Tween | null = null;
  canBuy: boolean = false;
  eventCenter = EventsCenterManager.getInstance();
  tradeIds: number[];
  tradeItems: exchangeType[] = [];
  valueDifference: number = 0;
  total1: Phaser.GameObjects.Text;
  total2: Phaser.GameObjects.Text;
  //importToExchange: Phaser.GameObjects.Text;
  totalAmount1: number = 0;
  totalAmount2: number = 0;

  constructor(scene: RPG, x: number, y: number, tradeIds: number[]) {
    super(scene, x, y);
    this.scene = scene;
    this.tradeIds = tradeIds;

    const globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );
    const inventary = globalState.inventary;
    const tradeData = ExchangeData.exchange.filter((exchange: exchangeType) => exchange.id === tradeIds[0] || exchange.id === tradeIds[1]);
    this.tradeItems = tradeData;

    this.tradeItems.forEach((tradeItem: exchangeType) => {
      switch (tradeItem.name) {
        case "physicalMoney":
          tradeItem.amount = inventary.physicalMoney;
          break;
        case "digitalMoney":
          tradeItem.amount = inventary.digitalMoney;
          break;
        case "businessFuel":
          tradeItem.amount = inventary.businessFuel;
          break;
        default:
          break;
      }
    });

    const checkExchange = (amount: number, total: number) => {
      if (total >= amount) {
        leftTextNotMoney.setVisible(false);
        return true;
      } else {
        leftTextNotMoney.setVisible(true);
        return false;
      }
    };

    const updateTotals = (amount: number, exc1: exchangeType, exc2: exchangeType, type: string) => {
      if (type === "buy") {
        exc1.amount -= amount;
        exc2.amount += (amount * exc2.buyPrice) / exc1.buyPrice;
        this.total1.setText(`TOTAL :  ` + exc1.amount.toString());
        this.total2.setText(`TOTAL :  ` + exc2.amount.toString());
        this.totalAmount1 += amount;

        let diferenceTotals = this.totalAmount1 - this.totalAmount2;

        if (diferenceTotals < 0) {
          diferenceTotals = diferenceTotals * -1;
        }

        //this.importToExchange.setText(`${diferenceTotals.toString()}`);

      } else if (type === "sell") {
        exc1.amount += (amount * exc1.buyPrice) / exc2.buyPrice;
        exc2.amount -= amount;
        this.total1.setText(`TOTAL :  ` + exc1.amount.toString());
        this.total2.setText(`TOTAL :  ` + exc2.amount.toString());

        this.totalAmount2 += amount;

        let diferenceTotals = (this.totalAmount2 - this.totalAmount1);
        if (diferenceTotals < 0) {
          diferenceTotals = diferenceTotals * -1;
        }
        //this.importToExchange.setText(`${diferenceTotals.toString()}`);
      }
    };



    //Modals containers
    const topContainer = this.scene.add.container(0, -225);

    //backgroundModal
    const modalBackground = this.scene.add.image(0, 0, "modalBackground").setOrigin(0.5).setScale(1.2).setInteractive();


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
      "INTERCAMBIOS",
      400
    );

    topContainer.add([title_p, btnExit_p]);


    this.add([
      topContainer,
      // panel,
      // centerContainer,
    ]);


    //Buttons Container
    const buttonsContainer = this.scene.add.container(0, 215);
    //const rightButtonContainer = this.scene.add.container(100, 40);

    //not enough money text
    const leftTextNotMoney = this.scene.add
      .text(0, -55, "NO TIENES SUFICIENTE DINERO", {
        fontFamily: "MontserratSemiBold",
        fontSize: "12px",
        color: "#ff0011",
      })
      .setOrigin(0.5)
      .setVisible(false);

    //LEFT BUTTON
    this.acceptButton = new ButtonComponent(
      this.scene,
      -100,
      0,
      200,
      "ACEPTAR",
      "btn",
      "#ffffff",
      "16",
      1.2,
      1,
      () => {
        leftTextNotMoney.setVisible(false);
        this.handleClose();
        let newExc1: walletType = { type: this.tradeItems[0].name, amount: this.tradeItems[0].amount };
        let newExc2: walletType = { type: this.tradeItems[1].name, amount: this.tradeItems[1].amount };
        this.eventCenter.emit(
          this.eventCenter.possibleEvents.UPDATE_ANY_MONEY,
          [newExc1, newExc2],
        );
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.buttonCancel);
      }
    );

    this.cancelButton= new ButtonComponent(
      this.scene,
      100,
      0,
      200,
      "CANCELAR",
      "btn",
      "#ffffff",
      "16",
      1.2,
      1,
      () => {
        this.handleClose();
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.buttonCancel);
      }
    );

    //let futureTransition =  this.scene.add.image(0, -215, "exchangeMiddleBar").setOrigin(0.5).setScale(1.2)
    //this.importToExchange = this.scene.add.text(5, -215, "0").setOrigin(0.8, 0.5).setStyle({ fontFamily: "MontserratSemiBold", fontSize: "20px", color: "#ffffff" });

    buttonsContainer.add([
      this.acceptButton,
      leftTextNotMoney,
      this.cancelButton,
      //futureTransition,
      //this.importToExchange,
    ]);


    //LEFT CONTAINER
    const leftContainer = this.scene.add.container(-300, -100);
    //RIGHT CONTAINER
    const rightContainer = this.scene.add.container(300, -100);

    /*
    const rectangleTotal1 = this.scene.add.rectangle(-30, 100, 100, 60, 0xBAB8BC, 0.5).setOrigin(0.5);
    const graphicsTotal1 = this.scene.make.graphics();
    graphicsTotal1.fillStyle(0xBAB8BC);
    graphicsTotal1.fillRoundedRect(-85, 75, 170, 50, 20);
    const maskTitle = graphicsTotal1.createGeometryMask();

    rectangleTotal1.setMask(maskTitle);
    */

    const iconTrade1 = this.scene.add.image(0, 0, this.tradeItems[0].image).setOrigin(0.5).setScale(1.2);
    const backgroundTotal1 = this.scene.add.image(0, 100, "exchangeTotalBar").setOrigin(0.5).setScale(1.2).setFlipX(true);
    this.total1 = this.scene.add.text(35, 100, "TOTAL :  " + this.tradeItems[0].amount.toString()).setOrigin(0.8, 0.5).setStyle({ fontFamily: "MontserratSemiBold", fontSize: "20px", color: "#ffffff" });

    const backgroundBuy1 = this.scene.add.rectangle(-100, 200, 150, 40, 0x32F9C0, 0).setOrigin(0.5).setStrokeStyle(2, 0x32F9C0, 0.5).setScale(0.95, 1).setInteractive();
    const buyAmount1 = this.scene.add.text(-100, 200, "VENDER 10", {
      fontFamily: "MontserratSemiBold",
      fontSize: "16px",
      color: "#ffffff",
    }).setOrigin(0.5).setAlpha(0.5);

    backgroundBuy1.on("pointerover", () => {
      buyAmount1.setAlpha(1);
      backgroundBuy1.setStrokeStyle(2, 0x32F9C0, 1);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0.8);
    });
    backgroundBuy1.on("pointerout", () => {
      buyAmount1.setAlpha(0.5);
      backgroundBuy1.setStrokeStyle(2, 0x32F9C0, 0.5);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0);
    });

    backgroundBuy1.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.clickOnProduct);
      if (checkExchange(10, this.tradeItems[0].amount)) {
        updateTotals(10, this.tradeItems[0], this.tradeItems[1], "buy");
      }
    });

    const backgroundBuyAll1 = this.scene.add.rectangle(100, 200, 170, 40, 0x32F9C0, 0).setOrigin(0.5).setStrokeStyle(2, 0x32F9C0, 0.5).setScale(0.95, 1).setInteractive();
    const buyAll1 = this.scene.add.text(100, 200, "VENDER TODO", {
      fontFamily: "MontserratSemiBold",
      fontSize: "16px",
      color: "#ffffff",
    }).setOrigin(0.5).setAlpha(0.5);

    backgroundBuyAll1.on("pointerover", () => {
      buyAll1.setAlpha(1);
      backgroundBuyAll1.setStrokeStyle(2, 0x32F9C0, 1);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0.8);
    });
    backgroundBuyAll1.on("pointerout", () => {
      buyAll1.setAlpha(0.5);
      backgroundBuyAll1.setStrokeStyle(2, 0x32F9C0, 0.5);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0);
    });

    backgroundBuyAll1.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.clickOnProduct);
      if (checkExchange(this.tradeItems[0].amount, this.tradeItems[0].amount)) {
        updateTotals(this.tradeItems[0].amount, this.tradeItems[0], this.tradeItems[1], "buy");
      }
    });

    leftContainer.add([/*graphicsTotal1, rectangleTotal1,*/backgroundBuy1, backgroundBuyAll1, backgroundTotal1, iconTrade1, this.total1, buyAmount1, buyAll1]);


    const iconTrade2 = this.scene.add.image(0, 0, this.tradeItems[1].image).setOrigin(0.5).setScale(this.tradeItems[1].name === "fuel" ? .9 : 1.2);
    const backgroundTotal2 = this.scene.add.image(0, 100, "exchangeTotalBar").setOrigin(0.5).setScale(1.2);
    this.total2 = this.scene.add.text(65, 100, "TOTAL :  " + this.tradeItems[1].amount.toString()).setOrigin(1, 0.5).setStyle({ fontFamily: "MontserratSemiBold", fontSize: "20px", color: "#ffffff" });
    const backgroundBuy2 = this.scene.add.rectangle(-100, 200, 150, 40, 0x32F9C0, 0).setOrigin(0.5).setStrokeStyle(2, 0x32F9C0, 0.5).setScale(0.95, 1).setInteractive();
    const buyAmount2 = this.scene.add.text(-100, 200, "VENDER 10", {
      fontFamily: "MontserratSemiBold",
      fontSize: "16px",
      color: "#ffffff",
    }).setOrigin(0.5).setAlpha(0.5);

    backgroundBuy2.on("pointerover", () => {
      buyAmount2.setAlpha(1);
      backgroundBuy2.setStrokeStyle(2, 0x32F9C0, 1);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0.8);
    });
    backgroundBuy2.on("pointerout", () => {
      buyAmount2.setAlpha(0.5);
      backgroundBuy2.setStrokeStyle(2, 0x32F9C0, 0.5);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0);
    });


    backgroundBuy2.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.clickOnProduct);
      if (checkExchange(10, this.tradeItems[1].amount)) {
        updateTotals(10, this.tradeItems[0], this.tradeItems[1], "sell");
      }
    });

    const backgroundBuyAll2 = this.scene.add.rectangle(100, 200, 150, 40, 0x32F9C0, 0).setOrigin(0.5).setStrokeStyle(2, 0x32F9C0, 0.5).setScale(0.95, 1).setInteractive();

    const buyAll2 = this.scene.add.text(100, 200, "VENDER TODO", {
      fontFamily: "MontserratSemiBold",
      fontSize: "16px",
      color: "#ffffff",
    }).setOrigin(0.5).setAlpha(0.5);

    backgroundBuyAll2.on("pointerover", () => {
      buyAll2.setAlpha(1);
      backgroundBuyAll2.setStrokeStyle(2, 0x32F9C0, 1);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0.8);
    });
    backgroundBuyAll2.on("pointerout", () => {
      buyAll2.setAlpha(0.5);
      backgroundBuyAll2.setStrokeStyle(2, 0x32F9C0, 0.5);
      //backgroundBuy1.setFillStyle(0x32F9C0, 0);
    });

    backgroundBuyAll2.on("pointerdown", () => {
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.storePC.clickOnProduct);
      if (checkExchange(this.tradeItems[1].amount, this.tradeItems[1].amount)) {
        updateTotals(this.tradeItems[1].amount, this.tradeItems[0], this.tradeItems[1], "sell");
      }
    });

    rightContainer.add([backgroundTotal2, backgroundBuyAll2, backgroundBuy2, iconTrade2, this.total2, buyAmount2, buyAll2]);


    //const iconTradeMiddle = this.scene.add.image(0, -100, "iconTrader").setOrigin(0.5).setScale(2);

    //Creacion de flechas
    const graphicsArrow = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x32F9C0 } });

    const arrowLength = 100;
    const arrowWidth = 6;
    const arrowSize = 12;

    graphicsArrow.beginPath();
    graphicsArrow.moveTo(-220, -115);
    graphicsArrow.lineTo(130 + arrowLength, -115);
    graphicsArrow.strokePath();

    graphicsArrow.fillStyle(0x32F9C0);
    graphicsArrow.fillTriangle(
      130 + arrowLength + arrowSize, -115,
      130 + arrowLength - arrowSize, -115 - arrowWidth,
      130 + arrowLength - arrowSize, -115 + arrowWidth
    );

    graphicsArrow.beginPath();
    graphicsArrow.moveTo(-220, -80);
    graphicsArrow.lineTo(130 + arrowLength, -80);
    graphicsArrow.strokePath();

    graphicsArrow.fillTriangle(
      -220 - arrowSize, -80,
      -220 + arrowSize, -80 - arrowWidth,
      -220 + arrowSize, -80 + arrowWidth
    );

    this.modalContainerWithElements.add([
      modalBackground,
      graphicsArrow,
      //arrowRight,
      //arrowLeft,
      //lineArrow,
      topContainer,
      leftContainer,
      rightContainer,
      //iconTradeMiddle,
      // centerContainer,
      buttonsContainer,
    ]);
  }
}
