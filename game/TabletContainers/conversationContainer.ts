import { globalState } from "../GlobalDataManager";
import {
  missionsType,
} from "../Assets/Modals/ModalTypes";
import EventsCenterManager from "../services/EventsCenter";
import ButtonComponent from "../Assets/Modals/ModalComponents/ButtonComponent";
import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";

import possibleSounds from "../modules/possibleSounds.json";
import { Actor, Chat, Message, MessageActions } from "../services/Chatbox";

const COLOR_DARK = 0x000000;
const SliderWidth = 20;

// const colWidth = [150, 100];
const ChatWidth = 500;
export type ActorWithActive = Actor & { isActive: boolean };
export type RexScene = Phaser.Scene & { rexUI: rexUI };

export class conversationContainer extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  eventCenter = EventsCenterManager.getInstance();
  closeButton?: Phaser.GameObjects.Image;
  handleGoback: Function;
  handleClose: Function;
  gobackButton: ButtonComponent;
  stateGlobal: globalState;

  activeTween: Phaser.Tweens.Tween | null = null;
  doneMissionsPaper: missionsType[] = [];
  centerPoint: Phaser.GameObjects.Sprite;
  availableMoney: number = 0;

  scrollPanel: rexUI.GridTable;
  scrollPanelChat: rexUI.ScrollablePanel;
  currentActorSelected?: String;
  chatPanel: rexUI.Sizer;
  chatMessages: rexUI.Sizer[] = [];
  currentChat?: Chat;
  persistOrder: string[] = []

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
      (globalReset: boolean = false) => {
        this.stateGlobal = this.eventCenter.emitWithResponse(
          this.eventCenter.possibleEvents.GET_STATE,
          null
        );
        if(globalReset) this.persistOrder = [];
        // set layout of 
        this.scrollPanel.setItems(this.markCurrentActiveActor());
        this.scrollPanel.layout();
        this.scrollPanelChat.layout();
        this.createChat();
      },
      this
    );

    this.stateGlobal = stateGlobal;

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
      "14",
      1.2,
      0.8,
      () => {
        this.handleGoback();
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.PLAY_SOUND,
          possibleSounds.sounds.tablet.buttonGoBack
        );
      }
    );

    const topContainerInfo = this.scene.add.container(0, -120);
    topContainerInfo.add([]);

    // this.stateGlobal.
    const rexUI = (this.scene as any).rexUI as rexUI;

    this.chatPanel = rexUI.add.sizer({
      orientation: "y",
      space: { top: 10, bottom: 10 },
    });

    this.createChat();

    this.scrollPanel = this.createActorGrid();

    this.scrollPanelChat = this.createChatGrid()

    this.gobackButton.setScale(0.8);
    const conversationIcon = this.scene.add
      .image(-170, 10, "transactionsTabletIconText")
      .setOrigin(0.5).setAlpha(0);
    const textConversation = this.scene.add
      .text(0, 10, "MENSAJES", {}).setOrigin(0.5);
      // tint white conversationIcon
    conversationIcon.setTint(0xffffff);

      
      
    textConversation.setStyle({
      fontFamily: "MontserratBold",
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
    });
    // this.add([textConversation, conversationIcon])
    // Datos para el pie chart (valores absolutos)
    
    // add conversationBackground as a background for the container
    
    const conversationBackground = this.scene.add
    .image(0, 0, "conversationBackground")
    .setOrigin(0.5);
    
    topContainer.add([conversationBackground,textConversation, conversationIcon, this.gobackButton]);
    
    this.centerPoint = this.scene.add
      .sprite(0, 40, "centerPoint")
      .setOrigin(0.5);
    this.centerPoint.setAlpha(0);

    this.add([topContainer, this.centerPoint]);

    this.scrollPanel.layout();
    this.scrollPanelChat.layout();
    this.scrollPanelChat.scrollToBottom();

    this.scene.add.existing(this);
    this.scene.cameras.main.ignore(this.centerPoint);
    this.scene.cameras.main.ignore(this.scrollPanel);
    this.scene.cameras.main.ignore(this.scrollPanelChat);
  //
  }

  createChatGrid() {
    const rexUI = (this.scene as any).rexUI as rexUI;
    return rexUI.add.scrollablePanel({
      x: 0,
      y: 0,
      originY: 0.5,
      originX: 1,
      height: 370,
      width: ChatWidth,
      background: rexUI.add
        .roundRectangle({
          width: ChatWidth,
          height: 370,
          radius: { tl: 0, tr: 0, bl: 0, br: 0 },
          color: 0x000000,
          alpha: 1,
        }),
        // .setStrokeStyle(2, COLOR_PRIMARY),
    
      scrollMode: 0,
      scrollDetectionMode: 1,

      panel: {
        child: this.chatPanel,
      },
      space: {
        left: 10,
        right: 0,
        top: 0,
        bottom: 0,
      },

      slider: {
        minThumbSize: 30,
        adaptThumbSize: true,
        track: rexUI.add
          .roundRectangle({
            width: SliderWidth,
            height: 20,
            radius: { tl: 0, tr: 0, bl: 0, br: 0 },
            color: 0x000000,
            alpha: 0,
          })
          .setStrokeStyle(2, 0x906AFF),
        thumb: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 100,
          radius: { tl: 0, tr: 0, bl: 0, br: 0 },
          color: 0x906AFF,
        }),
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
  }

  createChatItem(message: Message) {
    const text = message.text;
    let leftOrRight: "left" | "right" =
      message.actorId != "Player" ? "left" : "right";

    const rexUI = (this.scene as any).rexUI as rexUI;
    var item = rexUI.add.sizer({
      height: 0,
      width: ChatWidth - SliderWidth * 2,
      orientation: "y",
      name: text.toString(),
      space: {
        bottom: 10,
      }
    });

    let height = 0;
    for (let i = 0; i < text.length; i++) {
      let backgroundBox = rexUI.add.sizer({
        space: { left: 10, right: 10, top: 10, bottom: 10 },
      });

      backgroundBox.addBackground(
        rexUI.add.roundRectangle({
          radius: 10,
          color: leftOrRight == "left" ? 0xdddddd : 0x906AFF,
        })
      );

      let t = text[i];
      let limit = 30
      if(t.length > limit){
        let newText = "";
        for(let j = 0; j < t.length; j++){
          if(j % limit === 0 && j !== 0){
            newText += "\n";
          }
          newText += t[j];
        }
        t = newText;
      }
      let size = 16;
      let textItem = rexUI.add.label({
        text: this.scene.add.text(0, 0, t as string, {
          color: leftOrRight == "left" ? "#000000" : "#ffffff",
          fontSize: size+"px",
          wordWrap: { 
            width: (ChatWidth / 2 - 200) ,
            callback: (text: string, textObject: any) => this.formatTextRecursively(text, 40),
            //   {
            //   const newText = text.replace(/(\r\n|\n|\r)/gm,"");
            //   let lastSpace = newText.lastIndexOf(" ", 42);
            //   if(lastSpace !== -1 && newText.length > 40){
            //     if (newText.substring(lastSpace + 1).length > 40) {
            //       const firstPart = newText.substring(0, lastSpace);
            //       const secondPart = newText.substring(lastSpace + 1);
            //       const _newText = secondPart.replace(/(\r\n|\n|\r)/gm,"");
            //       let _lastSpace = secondPart.lastIndexOf(" ", 42);
            //       let newSecond = secondPart.substring(0, _lastSpace)
            //       let newThird = secondPart.substring(_lastSpace + 1);
            //       return firstPart + "\n" + newSecond + "\n" + newThird;
            //     } else {
            //       return newText.substring(0, lastSpace) + "\n" + newText.substring(lastSpace + 1);
            //     }
            //   } else {
            //     return newText;
            //   } 
            // }
          },
          
        },
      ),
        
      });

      backgroundBox.add(textItem);

      item.add(backgroundBox, { align: leftOrRight });
      height += backgroundBox.height;
    }
    item.height = height;
    item.layout();

    return item;
  }

  formatTextRecursively(text: string, maxLength: number = 40): string {
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    
    if (text.length <= maxLength) return text;
    
    let lastSpace = text.lastIndexOf(" ", maxLength);
    if (lastSpace === -1) return text; // No hay espacios para dividir
    
    const firstPart = text.substring(0, lastSpace);
    const secondPart = text.substring(lastSpace + 1);
    
    return firstPart + "\n" + this.formatTextRecursively(secondPart, maxLength);
}


  createChat(chat?: Chat) {
    this.chatMessages.forEach((chat) => {
      chat.destroy();
    });
    this.chatMessages = [];
    if (chat) {
      let messageId = chat.messages[chat.messages.length - 1].messageId;
      chat.messages.forEach((message) => {
        const messageItem = this.createChatItem(message);
        this.chatMessages.push(messageItem);
        this.chatPanel.add(messageItem);
        this.chatPanel.setChildAlign(messageItem, "right")
      });

      let last = chat.messages[chat.messages.length - 1];
      if (last.options) {
        const actions = last.options.actions;
        if (actions && messageId) {
          const item = this.createChatAction(actions, messageId);
          this.chatMessages.push(item);
          this.chatPanel.add(item);
        }
      }
    }

    this.chatPanel.layout();
  }

  createChatAction(actions: MessageActions[], messageId: string) {
    let height = 180;
    const rexUI = (this.scene as any).rexUI as rexUI;
    var item = rexUI.add.sizer({
      height: height,
      width: ChatWidth - SliderWidth * 2,
      orientation: "x",
      name: "actions",
    });

    const grid = rexUI.add.gridTable({
      width: ChatWidth - SliderWidth * 2,
      height: height,
      table: {
        columns: 2,
        reuseCellContainer: false,
      },

      createCellContainerCallback: function (cell: any, cellContainer: any) {
        var item = cell.item as Message;
        if (cellContainer === null) {
          // @ts-ignore
          cellContainer = this.createChatActionCell(
            item,
            messageId,
            cell.index
          );
        }

        //@ts-ignore
        // cellContainer.getElement("text").setText(item.text);
        //@ts-ignore

        return cellContainer;
      }.bind(this),
      items: actions,
    });

    item.add(grid);

    return item;
  }

  createChatActionCell(item: Message, messageId: string, index: number) {
    const scene = this.scene as RexScene;
    
    let backgroundBox = scene.rexUI.add.sizer({
      space: { left: 10, right: 10, top: 10, bottom: 10 },
    });
    let background = scene.rexUI.add.roundRectangle({
      radius: 10,
      color: COLOR_DARK,
    }).setStrokeStyle(2, 0x906AFF);
    backgroundBox.addBackground(background);
    let textItem = scene.rexUI.add.label({
      text: this.scene.add.text(0, 0, item.text, {
        wordWrap: { 
          width: (ChatWidth / 2) - 40,
          useAdvancedWrap: true
        },
        
      }),
    });

    backgroundBox.add(textItem);

    backgroundBox.setInteractive({ useHandCursor: true });
    // fill background when mouse over and recover when mouse out
    const setBackgroundActive = () => {
      background.fillColor = 0x906AFF;
    }

    const setBackgroundInactive = () => {
      background.fillColor = COLOR_DARK;
    }
    backgroundBox.on("pointerover", setBackgroundActive);

    backgroundBox.on("pointerout", setBackgroundInactive);

    
    backgroundBox.on("pointerdown", (sizer: any) => {
      this.clickOnResponse(item, messageId, index);
    });
    return backgroundBox;
  }

  clickOnResponse(item: Message, messageId: string, index: number) {
    const chatBox = this.stateGlobal.chatModule;

    if (messageId && this.currentChat) {
      chatBox.selectActionFromChat(this.currentChat, messageId, index);
      const chat = this.stateGlobal.chatModule.getChatsFromActor(
        this.currentChat.actors[1]
      );
      this.currentChat = chat[0];
      this.createChat(this.currentChat);

      this.scrollPanel.layout();
      this.scrollPanelChat.layout();
      this.chatPanel.layout();
      this.scrollPanelChat.scrollToBottom();
    }
  }

  selectActorChat(actor: Actor) {
    if (actor) {
      this.currentActorSelected = actor.id;
      const chat = this.stateGlobal.chatModule.getChatsFromActor(actor.id);
      if (chat[0]) {
        this.createChat(chat[0]);
        this.currentChat = chat[0];
      }
      this.stateGlobal.chatModule.markActorChatReaded(actor.id);
      this.scrollPanel.setItems(this.markCurrentActiveActor());
      // emit event center to update the red dot
      this.eventCenter.emitEvent(
        this.eventCenter.possibleEvents.CHAT_OPEN,
        null
      );
      this.scrollPanel.layout();
      this.scrollPanelChat.layout();
      this.chatPanel.layout();
      this.scrollPanelChat.scrollToBottom();
    }
  }

  markCurrentActiveActor() {
    let actors = this.stateGlobal.chatModule.getAllActors();
    if(this.persistOrder.length != actors.length) {
      let sortedActors = [...actors].sort((a, b) => {
        if (a.readed && !b.readed) return 1;
        if (!a.readed && b.readed) return -1;
        return 0;
      });
      this.persistOrder = sortedActors.map((actor) => actor.id);
      actors = sortedActors
    }  else {
      actors = this.persistOrder.map((id) => {
        return actors.find((actor) => actor.id === id) as Actor;
      });
    }
    
    
    const activeActorId = this.currentActorSelected;
    const nanoGay = actors.map((actor) => {
      return {
        ...actor,
        isActive: actor.id === activeActorId,
      };
    }) as ActorWithActive[];
    return nanoGay;
  }

  createActorCell(item: ActorWithActive, cell: any) {
    const scene = this.scene as RexScene;

    let backgroundBox = scene.rexUI.add.sizer({
      width: cell.width - 22,
      height: cell.height,
      space: { left: 10, top: 15, bottom: 15 },
    });
    // const grey = 0xdedede;
    backgroundBox.addBackground(
      scene.rexUI.add.roundRectangle({
        radius: 0,
        color: (item.isActive) ? 0xbbbbbb : 0xcccccc
      })
    );
    
    let textItem = scene.rexUI.add.label({
      space: { left: 10 },
      text: this.scene.add.text(
        0, 
        0, 
        "",
        {
          fontSize: "16px",
          color: "#000000",
          // align: "left",
          // fixedWidth: cell.width - 30,
          fontFamily: "MontserratSemiBold",
          // wordWrap: { width: cell.width - 30 },
        }
      ),
      width: cell.width - 80,
    });
    const avatar = this.scene.add.image(0, 0, "conversationAvatar").setScale(0.5);
    const redDot = this.scene.add.image(0, 0, "redDot").setScale(0.2);
    redDot.setTint(0xff0000);
    redDot.setAlpha((item.readed) ? 0 : 1);
    backgroundBox.add(avatar);
    backgroundBox.add(textItem, {
      expand: true,
    });
    backgroundBox.add(redDot, {
      align: "right",
    });
    
    backgroundBox.addChildrenMap("name", textItem);
    backgroundBox.addChildrenMap("redDot", redDot);
    backgroundBox.setInteractive({ useHandCursor: true });
    backgroundBox.on("pointerdown", (sizer: any) => {
      this.selectActorChat(item);
      // Add your custom click handling logic here
    });
    return backgroundBox;
  }

  createActorGrid() {
    const rexUI = (this.scene as RexScene).rexUI;
    const gridTable = rexUI.add.gridTable({
      x: 0,
      y: 0,
      originY: 0.5,
      originX: 0,
      height: 370,
      width: 300,
      background: rexUI.add
        .roundRectangle({
          width: 300,
          height: 370,
          radius: { tl: 0, tr: 0, bl: 0, br: 0 },
          color: 0xdedede,
          alpha: 1,
        }),
        // .setStrokeStyle(2, COLOR_PRIMARY),
      scrollMode: 0,
      scrollDetectionMode: 1,
      table: {
        cellWidth: 300,
        cellHeight: 58,
        columns: 1,
        mask: {
          padding: 0,
        },
        reuseCellContainer: false,
      },

      createCellContainerCallback: function (cell: any, cellContainer: any) {
        var item = cell.item as ActorWithActive;
        if (cellContainer === null) {
          // @ts-ignore
          cellContainer = this.createActorCell(item,cell);
        }

        //@ts-ignore
        cellContainer.getElement("name").setText(item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name);
        cellContainer.getElement("redDot").setAlpha((item.readed) ? 0 : 1);
        //@ts-ignore

        return cellContainer;
      }.bind(this),

      space: {
        left: 1,
        right: 0,
        top: 1,
        bottom: 0,
      },

      items: this.markCurrentActiveActor(),

      slider: {
        minThumbSize: 30,
        track: rexUI.add
          .roundRectangle({
            width: SliderWidth,
            height: 20,
            radius: { tl: 0, tr: 0, bl: 0, br: 0 },
            color: 0x000000,
            alpha: 0,
          })
          .setStrokeStyle(2, 0x906AFF),
        thumb: rexUI.add.roundRectangle({
          width: SliderWidth,
          height: 100,
          radius: { tl: 0, tr: 0, bl: 0, br: 0 },
          color: 0x906AFF,
        }),
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

    return gridTable;
  }

  fireClose() {
    this.scrollPanel.destroy();
  }

  fireUpdate() {
    // move this.scrollPanel if exist to the position of the container
    // get globla position of centerPoint
    const point = this.centerPoint.getBounds();
    if (this.scrollPanel) {
      this.scrollPanel.setPosition(
        point.x - 850 / 2 + SliderWidth * 2,
        point.y
      );
      this.scrollPanelChat.setPosition(
        point.x + 850 / 2 - (SliderWidth / 2),
        point.y
      );
    }
  }
}
