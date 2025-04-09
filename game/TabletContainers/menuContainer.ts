import ButtonComponent, { ButtonComponentTablet } from "../Assets/Modals/ModalComponents/ButtonComponent";
import { globalState } from "../GlobalDataManager";
import EventsCenterManager from "../services/EventsCenter";
import possibleSounds from "../../game/modules/possibleSounds.json";


export type buttonMenu = {
    coords: number[],
    texture: string,
    textureHover: string,
    visible: boolean,
}

export class menuContainer extends Phaser.GameObjects.Container {
    scene: Phaser.Scene;
    closeButton: ButtonComponent;
    activeTween: Phaser.Tweens.Tween | null = null;
    eventCenter = EventsCenterManager.getInstance();
    settingsButton: ButtonComponent;

    //handleGoback: () => void;
    handleMove: Function;
    handleClose: Function;
    stateGlobal: globalState;
    redDot?: Phaser.GameObjects.Image;
    buttonChat?: ButtonComponentTablet;
    
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        handleToMove: Function,
        handleToClose: Function,

    ) {
        super(scene, x, y);
        this.scene = scene;
        this.handleMove = handleToMove;
        this.handleClose = handleToClose;
        this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        const isInversionActive = this.stateGlobal.inversionModule.isActive;
        const isLoansActive = this.stateGlobal.loansModule.isActive;

        this.eventCenter.on(this.eventCenter.possibleEvents.CHAT_OPEN, () => {
            this.checkChatDot();
        });

        const buttonsData: buttonMenu[] = [
            {
                coords: [-850, 0],//Stats
                texture: "btnTransc",
                textureHover: "btnTranscHover",
                visible: true,

            },
            (isInversionActive) ? {
                coords: [850, 0],//Inversions
                texture: "btnInv",
                textureHover: "btnInvHover",
                visible: true,

            } : {
                coords: [850, 0],//Inversions
                texture: "tabletNotReady",
                textureHover: "tabletNotReady",
                visible: false,
            },
            (isInversionActive) ? {
                coords: [0, 500],//Inversions
                texture: "btnAcc",
                textureHover: "btnAccHover",
                visible: true,

            } : {
                coords: [0, 500],//Inversions
                texture: "tabletNotReady",
                textureHover: "tabletNotReady",
                visible: false,
            },
            (isLoansActive) ? {
                coords: [-850, 500],//Loans
                texture: "btnLoans",
                textureHover: "btnLoansHover",
                visible: true,

            } : {
                coords: [-850, 500],//Loans
                texture: "tabletNotReady",
                textureHover: "tabletNotReady",
                visible: false,
            },
            {
                coords: [850, 500],//Chat
                texture: "chatIcon",
                textureHover: "chatIconHover",
                visible: true,

            }
        ];


        //Menu containers
        const topContainer = this.scene.add.container(0, -170);
        const centerContainer = this.scene.add.container(0, -100);

        //TOP CONTAINER ->


        this.closeButton = new ButtonComponent(this.scene, 355, 0, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonGoBack);
        });

        this.settingsButton = new ButtonComponent(this.scene, -355, 0, 200, "", "tabletSettings", "#ffffff", "16", 1, 0.8, () => {
            //this.handleMove([0, 500]);
            //this.handleGoback();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonSettings);
        });
        this.settingsButton.setScale(0.8);


        topContainer.add([this.closeButton, this.settingsButton]);

        //Top container <---
        //Grid menu
        let menuButtonsGrid = this.scene.add.group();

        let startX = -180;
        let startY = 10;
        let cellWidth = 190; // Ancho de cada celda
        let cellHeight = 190; // Alto de cada celda

        buttonsData.forEach((buttonMenu: buttonMenu, index: number) => {
            let buttonImg = new ButtonComponentTablet(this.scene, 0, 0, 200, "", buttonMenu, "#ffffff", "16", 1.2, 1, () => {
                if (buttonMenu.visible) {
                    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonOptionMenu)
                    this.handleMove(buttonMenu.coords);
                }
            });
            if (!buttonMenu.visible) {
                buttonImg.setScale(0.7);
                buttonImg.setAlpha(0.5);
                buttonImg.disableEvent("pointerup");
                buttonImg.disableEvent("pointerover");
                buttonImg.disableEvent("pointerout");
            }

            if(buttonMenu.texture === "chatIcon") {
                this.buttonChat = buttonImg;
            }

            menuButtonsGrid.add(buttonImg);

        });

        Phaser.Actions.GridAlign(menuButtonsGrid.getChildren(), {
            width: 3, // Cantidad de columnas
            height: 2, // Calcula automáticamente el número de filas
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            x: startX,
            y: startY,
        });


        if(this.buttonChat) {
            this.redDot = this.scene.add
            .image(this.buttonChat.x + 10, this.buttonChat.y + 22, "redDot")
            .setOrigin(-1.55, 4.7)
            .setScale(0.3)
            .setAlpha(0);
            this.redDot.setTint(0xff0000);
            this.checkChatDot();
        }

        // <-- Grid de Opciones
        
        centerContainer.add(menuButtonsGrid.getChildren());
        if(this.redDot) centerContainer.add(this.redDot);
        

        //Left container <---


        this.add([
            topContainer,
            centerContainer,

        ]);


        this.scene.add.existing(this)
        //this.scene.cameras.main.ignore(this)

        this.eventCenter.turnEventOn(
            "GlobalDataManager",
            this.eventCenter.possibleEvents.UPDATE_STATE,
            () => {
                return this.build();
            },
            this
        );

    }

    checkChatDot = () =>  {
        const active =
          this.stateGlobal.chatModule.checkIfThereIsAnyChatPendingReading();
        if (active && this.redDot) {
          this.redDot.setAlpha(1);
        } else {
          this.redDot?.setAlpha(0);
        }
    }

    build() {
        // remove all container children
        this.removeAll(true);

        this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        const isInversionActive = this.stateGlobal.inversionModule.isActive;
        const isLoansActive = this.stateGlobal.loansModule.isActive;
        const buttonsData: buttonMenu[] = [
            {
                coords: [-850, 0],//Stats
                texture: "btnTransc",
                textureHover: "btnTranscHover",
                visible: true,

            },
            (isInversionActive) ? {
                coords: [850, 0],//Inversions
                texture: "btnInv",
                textureHover: "btnInvHover",
                visible: true,

            } : {
                coords: [850, 0],//Inversions
                texture: "tabletNotReady",
                textureHover: "tabletNotReady",
                visible: false,
            },
            (isInversionActive) ? {
                coords: [0, 500],//Inversions
                texture: "btnAcc",
                textureHover: "btnAccHover",
                visible: true,

            } : {
                coords: [0, 500],//Inversions
                texture: "tabletNotReady",
                textureHover: "tabletNotReady",
                visible: false,
            },
            (isLoansActive) ? {
                coords: [-850, 500],//Loans
                texture: "btnLoans",
                textureHover: "btnLoansHover",
                visible: true,

            } : {
                coords: [-850, 500],//Loans
                texture: "tabletNotReady",
                textureHover: "tabletNotReady",
                visible: false,
            },
            {
                coords: [850, 500],//Chat
                texture: "chatIcon",
                textureHover: "chatIconHover",
                visible: true,

            }
        ];
        //Menu containers
        const topContainer = this.scene.add.container(0, -170);
        const centerContainer = this.scene.add.container(0, -100);

        //TOP CONTAINER ->


        this.closeButton = new ButtonComponent(this.scene, 355, 0, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
        });

        this.settingsButton = new ButtonComponent(this.scene, -355, 0, 200, "", "tabletSettings", "#ffffff", "16", 1, 0.8, () => {
            //this.handleMove([0, 500]);
            //this.handleGoback();
        });
        this.settingsButton.setScale(0.8);


        topContainer.add([this.closeButton, this.settingsButton]);

        //Top container <---
        //Grid menu
        let menuButtonsGrid = this.scene.add.group();


        let startX = -180;
        let startY = 10;
        let cellWidth = 190; // Ancho de cada celda
        let cellHeight = 190; // Alto de cada celda

        buttonsData.forEach((buttonMenu: buttonMenu, index: number) => {
            let buttonImg = new ButtonComponentTablet(this.scene, 0, 0, 200, "", buttonMenu, "#ffffff", "16", 1.2, 1, () => {
                if (buttonMenu.visible) {
                    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonOptionMenu)
                    this.handleMove(buttonMenu.coords);
                }
            });
            if (!buttonMenu.visible) {
                buttonImg.setScale(0.7);
                buttonImg.setAlpha(0.5);
                buttonImg.disableEvent("pointerup");
                buttonImg.disableEvent("pointerover");
                buttonImg.disableEvent("pointerout");
            }

            
        
            if(buttonMenu.texture === "chatIcon") {
                this.buttonChat = buttonImg;
            }

            menuButtonsGrid.add(buttonImg);

        });

        Phaser.Actions.GridAlign(menuButtonsGrid.getChildren(), {
            width: 3, // Cantidad de columnas
            height: 2, // Calcula automáticamente el número de filas
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            x: startX,
            y: startY,
        });

        if(this.buttonChat) {
            this.redDot = this.scene.add
            .image(this.buttonChat.x + 10, this.buttonChat.y + 22, "redDot")
            .setOrigin(-1.55, 4.7)
            .setScale(0.3)
            .setAlpha(0);
            this.redDot.setTint(0xff0000);
            this.checkChatDot();
        }

        // <-- Grid de Opciones

        centerContainer.add(menuButtonsGrid.getChildren());
        if(this.redDot) centerContainer.add(this.redDot);



        //Left container <---


        this.add([
            topContainer,
            centerContainer,

        ]);
    }
}