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
import { InversionAndLoanType } from "../modules/LoanModule";

const COLOR_PRIMARY =0x32F9C0;
const COLOR_LIGHT = 0xFFFFFF;
const COLOR_DARK = 0x000000;
const SliderWidth = 20;

const colWidth = [170, 100, 100, 200];

export class stockContainer extends Phaser.GameObjects.Container {
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
  money:  Phaser.GameObjects.Text
  availableMoney: number = 0

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

        this.scrollPanel.setItems(this.stateGlobal.inversionModule.possibleInversions.filter((inversion: InversionAndLoanType) => inversion.inversionType === "stock"));
        this.scrollPanel.layout();

        this.money.setText("$" + this.stateGlobal.inversionModule.totalInvested)
        this.availableMoney = this.stateGlobal.inventary.digitalMoney
      },
      this
    );

    this.stateGlobal = stateGlobal;
    this.availableMoney = this.stateGlobal.inventary.digitalMoney
    const hideButtons = (_target: any[]) => {
      this.activeTween = this.scene.tweens.add({
        targets: _target,
        alpha: 0,
        duration: 1000,
        ease: "ease",
        onComplete: () => {
          _target.forEach((element) => {
            element.visible = false;
          });
        },
      });
    };

    const showButtons = (_target: any[]) => {
      _target.forEach((element) => {
        element.visible = true;
      });
      this.activeTween = this.scene.tweens.add({
        targets: _target,
        alpha: 1,
        duration: 1000,
        ease: "ease",
      });
    };

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

    topContainer.add([/*this.closeButton,*/ this.gobackButton]);
    const topContainerInfo = this.scene.add.container(0, -120);
    const avatar = this.scene.add.image(-350, -70, "avatarInversiones").setOrigin(0, 0.5)
    const rectanguloInv = this.scene.add.image(5, 0, "rectanguloInversiones").setOrigin(0.5).setScale(0.995,1)
    const nameUser = this.scene.add.text(-300, -70, "Hola, #Chambo", {
      fontSize: "25px",
      color: "#ffffff",
      align: "center",
    }).setOrigin(0, 0.5)
    const moneyText = this.scene.add.text(-275, 0, "Dinero invertido", {
      fontFamily: "MontserratSemiBold",
      fontSize: "18px",
      color: "#32F9C0",
      align: "center",
    }).setOrigin(0.5)
    this.money = this.scene.add.text(0, 0, "$"+this.stateGlobal.inversionModule.totalInvested, {
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
        this.money.setText("$"+this.stateGlobal.inversionModule.totalInvested)
      } else {
        eyeShow.setTexture("eyeHide")
        this.money.setText("$*******")
      }
    });
    topContainerInfo.add([avatar, rectanguloInv, eyeShow, nameUser, this.money, moneyText]);

    // this.stateGlobal.
    const rexUI = (this.scene as any).rexUI as rexUI;
    const scrollMode = 0;

    function createInversionHeaderCell(scene: Phaser.Scene) {
      const rexUI = (scene as any).rexUI as rexUI;

      var name = rexUI.add.label({
        width: colWidth[0],
        text: scene.add.text(0, 0, "Nombre", {
          fontFamily: "MontserratSemiBold",
          fontSize: "18px",
          color: "#ffffff",
          fixedWidth: colWidth[0],
          align: "center",
        }),
        space: {
          left: 10,
          right: 10
        }
      });

      var time = rexUI.add.label({
        width: colWidth[1],
        text: scene.add.text(0, 0, "Hoy", {
          fontFamily: "MontserratSemiBold",
          fontSize: "18px",
          color: "#ffffff",
          fixedWidth: colWidth[1],
          align: "center",
        }),
        space: {
          left: 10,
          right: 10
        }
      });

      var price = rexUI.add.label({
        width: colWidth[2],
        text: scene.add.text(0, 0, "Monto", {
          fontFamily: "MontserratSemiBold",
          fontSize: "18px",
          color: "#ffffff",
          fixedWidth: colWidth[2],
          align: "center",
        }),
        space: {
          left: 10,
          right: 10
        }
      });

      var actions = rexUI.add.label({
        width: colWidth[3],
        text: scene.add.text(50, 0, "Acciones", {
          fontFamily: "MontserratSemiBold",
          fontSize: "18px",
          align: "center",
          fixedWidth: colWidth[3],
          color: "#ffffff",
        }),
      });

      const sizer = rexUI.add.sizer({
        width: 170,
        // height: 170,
      });

      sizer.minWidth = 170;
      return sizer
        .add(name, 0, "top", { left: 10, right: 10, top: 10, bottom: 10 }, true)
        .add(
          price,
          0,
          "top",
          { left: 10, right: 10, top: 10, bottom: 10 },
          true
        )
        .add(
          actions,
          0,
          "top",
          { left: 10, right: 10, top: 10, bottom: 10 },
          true
        )
        .add(time, 0, "top", { left: 10, right: 10, top: 10, bottom: 10 }, true)
    }

    const acceptInversion = (item: InversionAndLoanType, sizer: rexUI.Sizer, button: Label) => {
      if (this.stateGlobal.inventary.digitalMoney >= item.startAmount){
        this.stateGlobal.inversionModule.addInversion(item);
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonInvest);
        this.scrollPanel.setItems(this.stateGlobal.inversionModule.possibleInversions.filter((inversion: InversionAndLoanType) => inversion.inversionType === "stock"));
        this.scrollPanel.layout()
      } else {
        this.scrollPanel.setItems(this.stateGlobal.inversionModule.possibleInversions.filter((inversion: InversionAndLoanType) => inversion.inversionType === "stock"));
        this.scrollPanel.layout()
      }
    }

    const cancelInversion = (item: InversionAndLoanType, sizer: rexUI.Sizer, button: Label) => {
      this.stateGlobal.inversionModule.removeInversion(item.id);
      this.scrollPanel.setItems(this.stateGlobal.inversionModule.possibleInversions.filter((inversion: InversionAndLoanType) => inversion.inversionType === "stock"));
      this.scrollPanel.layout()
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonRetrive);
    }

    function createInversionCell(
      scene: Phaser.Scene,
      width: number,
      height: number,
      item: any
    ) {
      const rexUI = (scene as any).rexUI as rexUI;
      var background = rexUI.add.roundRectangle(20, 0, 40, 100, 0, COLOR_PRIMARY, 0).setStrokeStyle(2, COLOR_PRIMARY).setScale(0.95, 1)
      var name = rexUI.add.label({
        width: colWidth[0],
        height: 40,
        text: scene.add.text(0, 0, "item.name", {
          fontSize: "18px",
          color: "#FFFFFF",
          align: "center",
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

      const todayMovement = item.lastData === 'up' ? "↑" : item.lastData === 'down' ? "↓" : "-"

      var time = rexUI.add.label({
        width: colWidth[1],
        height: 40,
        text: scene.add.text(0, 0, todayMovement , {
          color: "#FFFFFF",
          fontSize: "18px",
          align: "center",
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
      var price = rexUI.add.label({
        width: colWidth[2] - 10,
        height: 40,
        text: scene.add.text(0, 0, "item.buyPrice", {
          color: "#FFFFFF",
          fontSize: "18px",
          align: "center",
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


      var button1 = rexUI.add
        .label({
          width: colWidth[3]/2 - 10,
          height: 40,
          background: rexUI.add.roundRectangle(0, 0, 40, 70, 10, COLOR_PRIMARY, 1).setStrokeStyle(2, COLOR_PRIMARY),
          text: scene.add.text(0, 0, "Invertir", {
            color: "#3340736",
            fontSize: "16px",
            align: "center",
            fixedWidth: 80,
            fontFamily: "MontserratSemiBold",
          }),
          space: {
            left: 10,
            right: 10,
          },
        })
        .setInteractive()
        .on("pointerdown", function () {
          acceptInversion(item, sizer, button1);
        });


      var button2 = rexUI.add
        .label({
          width: colWidth[3]/2,
          height: 40,
          background: rexUI.add.roundRectangle(0, 0, 40, 70, 10, 0x000000, 0).setStrokeStyle(2, COLOR_PRIMARY).setOrigin(0.5),
          text: scene.add.text(0, 0, "Retirar", {
            color: "#32F9C0",
            fontSize: "16px",
            align: "center",
            fixedWidth: 80,
            fontFamily: "MontserratSemiBold",
          }).setOrigin(0.5),  
          space: {
            left: 10,
            right: 10,
          },
        })
        .setInteractive()
        .on("pointerdown", function () {
          cancelInversion(item, sizer, button2);
        });

      const sizer = rexUI.add.sizer({
        width: 170,
      });

      sizer.addChildrenMap("name", name);
      sizer.addChildrenMap("price", price);
      sizer.addChildrenMap("accept", button1);
      sizer.addChildrenMap("cancel", button2);
      sizer.addChildrenMap("time", time);
      sizer.minWidth = width - 10;

      return sizer
        .addBackground(background)
        .add(name, 0, "top", { left: 10, right: 10, top: 16, bottom: 16 }, true)
        .add(
          price,
          0,
          "top",
          { left: 10, right: 10, top: 16, bottom: 16 },
          true
        )
        .add(
          button1,
          0,
          "top",
          { left: 10, right: 10, top: 16, bottom: 16 },
          true
        )
        .add(
          button2,
          0,
          "top",
          { left: 10, right: 0, top: 16, bottom: 16 },
          true
        )
        .add(time, 0, "top", { left: 10, right: 10, top: 16, bottom: 16 }, true)
    }

    const checkIfInversionInside = (_inversion: InversionAndLoanType) => {
      return this.stateGlobal.inversionModule.inversions.find((inversion: InversionAndLoanType) => (inversion.id === _inversion.id))
    }

    const getAvailableMoney = () => {
      return this.stateGlobal.inventary.digitalMoney
    }

    this.scrollPanel = rexUI.add.gridTable({
      x: 5,
      y: -50,
      originY: 0.31,
      originX: 0.485,
      height: 275,
      width: 760,
      background: rexUI.add.roundRectangle(0, 0, 780, 360, 10, 0x000000, 0).setStrokeStyle(2, COLOR_PRIMARY),
      scrollMode: scrollMode,
      scrollDetectionMode: 1,
      table: {
        cellWidth: scrollMode === 0 ? undefined : 60,
        cellHeight: scrollMode === 0 ? 80 : undefined,
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
        var item = cell.item as InversionAndLoanType;
        if (cellContainer === null) {
          cellContainer = createInversionCell(
            scene as any,
            width,
            height,
            item
          );
        }

        //@ts-ignore
        cellContainer.getElement("name").setText(item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name).setAlpha(item.state === "disabled" ? 0.5 : 1);
        //@ts-ignore
        cellContainer.getElement("price").setText(`$${item.startAmount}`).setAlpha(item.state === "disabled" ? 0.5 : 1);;
        //@ts-ignore

        // check if the inversion is active and inside the state.inversions.inversions, if is active, show the cancel button, otherwise show the accept button
        const r = checkIfInversionInside(item);
        const availableMoney = getAvailableMoney()
        //@ts-ignore
        const button1 = cellContainer.getElement("accept") as rexUI.Label;
        //@ts-ignore
        const button2 = cellContainer.getElement("cancel") as rexUI.Label;
        if (r) {
          button1.setAlpha(0);
          button1.removeInteractive();
          button2.setAlpha(1);
          button2.setInteractive();
        } else {
          if (item.startAmount > availableMoney){
            button1.setAlpha(0.5);
            button1.removeInteractive();
            button2.setAlpha(0);
            button2.removeInteractive();
          } else {
            button1.setAlpha(1);
            button1.setInteractive();
            button2.setAlpha(0);
            button2.removeInteractive();
          }
          if (item.state === "disabled") {
            button1.setAlpha(0.2);
            button1.removeInteractive();
            button2.setAlpha(0.2);
            button1.removeInteractive();
          }
        }

        return cellContainer;
      },

      space: {
        left: 10,
        right: 0,
        top: 0,
        bottom: 0,
      },

      items: (this.stateGlobal.inversionModule.possibleInversions as InversionAndLoanType[]).filter((inversion: InversionAndLoanType) => inversion.inversionType === "stock"),

      header: createInversionHeaderCell(this.scene),

      slider: {
        minThumbSize: 30,
        track: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 20,
          radius: { tl: 0, tr: 0, bl: 0, br: 10 },
          color: 0x000000,
          alpha: 0
        }).setStrokeStyle(2, COLOR_PRIMARY),
        thumb: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 100,
          radius: { tl: 0, tr: 0, bl: 0, br: 10 },
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

    this.centerPoint = this.scene.add
      .sprite(0, 40, "centerPoint")
      .setOrigin(0.5);
    this.centerPoint.setAlpha(0);

    this.add([topContainer, this.centerPoint, topContainerInfo]);

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
