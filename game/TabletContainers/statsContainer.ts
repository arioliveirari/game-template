import { globalState } from "../GlobalDataManager";
import {
  missionsType,
  newsType,
  transactionsType,
} from "../Assets/Modals/ModalTypes";
import EventsCenterManager from "../services/EventsCenter";
import ButtonComponent from "../Assets/Modals/ModalComponents/ButtonComponent";
import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import TabletScene from "../TabletScene";
import possibleSounds from "../modules/possibleSounds.json";
import { configPieChartMulticolor, PieChartMultiColor } from "../Assets/PieChart";
import { InversionAndLoanType } from "../modules/LoanModule";

const COLOR_PRIMARY = 0x32F9C0;
const COLOR_LIGHT = 0xFFFFFF;
const COLOR_DARK = 0x000000;
const SliderWidth = 20;

const colWidth = [170, 80];

export class statsContainer extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  closeButton?: Phaser.GameObjects.Image;
  gobackButton: ButtonComponent;
  activeTween: Phaser.Tweens.Tween | null = null;
  eventCenter = EventsCenterManager.getInstance();
  doneMissionsPaper: missionsType[] = [];
  stateGlobal: globalState;
  handleGoback: Function;
  handleClose: Function;
  centerPoint: Phaser.GameObjects.Sprite;
  scrollPanel: rexUI.GridTable;
  money: Phaser.GameObjects.Text
  totalMoney: number = 0
  pieChart: PieChartMultiColor | null = null
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    goback: Function,
    handleToClose: Function,
    stateGlobal: globalState
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.handleGoback = goback;
    this.handleClose = handleToClose;
    this.doneMissionsPaper = [];

    this.eventCenter.turnEventOn(
      "TabletScene",
      this.eventCenter.possibleEvents.UPDATE_STATE,
      () => {
        this.stateGlobal = this.eventCenter.emitWithResponse(
          this.eventCenter.possibleEvents.GET_STATE,
          null
        );
        this.totalMoney = this.stateGlobal.inventary.physicalMoney + this.stateGlobal.inventary.digitalMoney + this.stateGlobal.inversionModule.totalInvested
        this.money.setText("$" + this.totalMoney)
        // Datos para el pie chart (valores absolutos)
        const data = [
          { value: this.stateGlobal.inventary.physicalMoney, color: 0x232323, text: 'Físico' }, // Rojo
          { value: this.stateGlobal.inventary.digitalMoney, color: 0x32F9C0, text: 'Digital' }, // Verde
          { value: this.stateGlobal.inversionModule.totalInvested, color: 0x5034F7, text: 'Invertido' }  // Azul
        ];

        const configPieChart: configPieChartMulticolor = {
          container: this,
          inTablet: true,
          textConfig: {
            x: 260,
            startY: 55,
            gap: 10,
          },
          pieConfig: {
            centerX: 110,
            centerY: 100,
            radius: 90,
          }
        }
        this.pieChart?.destroy();
        this.pieChart = new PieChartMultiColor(this.scene, data, configPieChart);
        this.scrollPanel.setItems(this.stateGlobal.transactions);
        this.scrollPanel.layout();
      },
      this
    );

    this.stateGlobal = stateGlobal;
    this.totalMoney = this.stateGlobal.inventary.physicalMoney + this.stateGlobal.inventary.digitalMoney + this.stateGlobal.inversionModule.totalInvested

    //Menu containers
    const topContainer = this.scene.add.container(0, -200);

    this.gobackButton = new ButtonComponent(
      this.scene,
      -375,
      10,
      200,
      "",
      "tabletBack",
      "#ffffff",
      "16",
      1.2,
      0.8,
      () => {
        this.handleGoback();
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonGoBack);
      }
    );
    this.gobackButton.setScale(0.8);

    topContainer.add([this.gobackButton]);
    const topContainerInfo = this.scene.add.container(0, -120);
    const avatar = this.scene.add.image(-350, -70, "avatarInversiones").setOrigin(0, 0.5)
    const rectanguloInv = this.scene.add.image(5, 0, "rectanguloInversiones").setOrigin(0.5).setScale(0.995, 1)
    const nameUser = this.scene.add.text(-300, -70, "Hola, #Chambo", {
      fontSize: "25px",
      color: "#ffffff",
      align: "center",
    }).setOrigin(0, 0.5)
    const moneyText = this.scene.add.text(-275, 0, "Activos totales", {
      fontFamily: "MontserratSemiBold",
      fontSize: "18px",
      color: "#32F9C0",
      align: "center",
    }).setOrigin(0.5)
    this.money = this.scene.add.text(0, 0, "$" + this.totalMoney, {
      fontFamily: "MontserratBold",
      fontSize: "34px",
      color: "#32F9C0",
      align: "center",
    }).setOrigin(1, 0.5)
    let eyeShown = true
    const eyeShow = this.scene.add.image(20, 0, "eyeShowIcon").setOrigin(0.5).setInteractive().on("pointerup", () => {
      eyeShown = !eyeShown
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonSeeMoney);
      if (eyeShown) {
        eyeShow.setTexture("eyeShowIcon")
        this.money.setText("$" + this.totalMoney)
      } else {
        eyeShow.setTexture("eyeHide")
        this.money.setText("$*******")
      }
    });
    topContainerInfo.add([avatar, rectanguloInv, eyeShow, nameUser, this.money, moneyText]);

    // this.stateGlobal.
    const rexUI = (this.scene as any).rexUI as rexUI;
    const scrollMode = 0;

    function createInversionCell(
      scene: Phaser.Scene,
      width: number,
      height: number,
      item: any
    ) {
      const rexUI = (scene as any).rexUI as rexUI;
      var name = rexUI.add.label({
        width: colWidth[0],
        height: 20,
        text: scene.add.text(0, 0, "item.description", {
          fontSize: "14px",
          color: "#FFFFFF",
          align: "left",
          fixedWidth: colWidth[0],
          fontFamily: "MontserratSemiBold",
        }),
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      });

      var amount = rexUI.add.label({
        width: colWidth[1],
        height: 20,
        text: scene.add.text(0, 0, "item.amount", {
          color: "#FFFFFF",
          fontSize: "14px",
          align: "right",
          fixedWidth: colWidth[1],
          fontFamily: "MontserratSemiBold",
        }),
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },

      });


      const sizer = rexUI.add.sizer({
        width: 170,
      });

      sizer.addChildrenMap("name", name);
      sizer.addChildrenMap("price", amount);
      sizer.minWidth = width - 10;

      return sizer
        .add(name, 0, "top", { left: 10, right: 10, top: 5, bottom: 15 }, true)
        .add(
          amount,
          0,
          "top",
          { left: 10, right: 10, top: 5, bottom: 15 },
          true
        )
    }

    this.scrollPanel = rexUI.add.gridTable({
      x: 5,
      y: -50,
      originY: 0.1,
      originX: 1,
      height: 210,
      width: 370,
      background: rexUI.add.roundRectangle(0, 0, 780, 360, 10, 0x000000, 0).setStrokeStyle(2, COLOR_PRIMARY),
      scrollMode: scrollMode,
      scrollDetectionMode: 1,
      table: {
        cellWidth: scrollMode === 0 ? undefined : 60,
        cellHeight: scrollMode === 0 ? 40 : undefined,
        columns: 1,
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
        var item = cell.item as transactionsType;
        if (cellContainer === null) {
          cellContainer = createInversionCell(
            scene as any,
            width,
            height,
            item
          );
        }

        //@ts-ignore
        cellContainer.getElement("name").setText(item.description.length > 20 ? item.description.substring(0, 20) + "..." : item.description);
        //@ts-ignore
        cellContainer.getElement("price").setText(`$${item.amount}`);
        //@ts-ignore


        return cellContainer;
      },

      space: {
        left: 10,
        right: 0,
        top: 0,
        bottom: 0,
      },

      items: this.stateGlobal.transactions,

      slider: {
        minThumbSize: 30,
        track: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 20,
          radius: { tl: 0, tr: 10, bl: 0, br: 10 },
          color: 0x000000,
          alpha: 0
        }).setStrokeStyle(2, COLOR_PRIMARY),
        thumb: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 100,
          radius: { tl: 0, tr: 10, bl: 0, br: 10 },
          color: COLOR_PRIMARY,
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

    const transactionsIcon = this.scene.add.image(-300, -35, "transactionsTabletIconText").setOrigin(0.5)
    const textTransactions = this.scene.add.text(-170, -35, "TRANSACCIONES", {}).setOrigin(0.5);
    textTransactions.setStyle({
      fontFamily: "MontserratBold",
      fontSize: "24px",
      color: "#32F9C0",
      align: "center",
    });
    const textActives = this.scene.add.text(190, -35, "ACTIVOS", {}).setOrigin(0.5);
    textActives.setStyle({
      fontFamily: "MontserratBold",
      fontSize: "24px",
      color: "#32F9C0",
      align: "center",
    });
    this.add([textTransactions, transactionsIcon, textActives])

    // Datos para el pie chart (valores absolutos)
    const data = [
      { value: stateGlobal.inventary.physicalMoney, color: 0x232323, text: 'Físico' }, // Rojo
      { value: stateGlobal.inventary.digitalMoney, color: 0x32F9C0, text: 'Digital' }, // Verde
      { value: stateGlobal.inversionModule.totalInvested, color: 0x5034F7, text: 'Invertido' }  // Azul
    ];

    const configPieChart: configPieChartMulticolor = {
      container: this,
      inTablet: true,
      textConfig: {
        x: 260,
        startY: 55,
        gap: 10,
      },
      pieConfig: {
        centerX: 110,
        centerY: 100,
        radius: 90,
      }
    }
    this.pieChart = new PieChartMultiColor(this.scene, data, configPieChart);

    this.centerPoint = this.scene.add
      .sprite(0, 40, "centerPoint")
      .setOrigin(0.5);
    this.centerPoint.setAlpha(0);

    this.add([topContainer, this.centerPoint, topContainerInfo, textTransactions]);

    this.scrollPanel.layout();

    this.scene.add.existing(this);
    this.scene.cameras.main.ignore(this.centerPoint);
    this.scene.cameras.main.ignore(this.scrollPanel);

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
