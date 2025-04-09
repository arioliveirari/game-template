import { globalState } from "./GlobalDataManager";
import { inversionsContainer } from "./TabletContainers/inversionsContainer";
import { stockContainer } from "./TabletContainers/stockContainer";
import { menuContainer } from "./TabletContainers/menuContainer";
import { statsContainer } from "./TabletContainers/statsContainer";
import EventsCenterManager from "./services/EventsCenter";

import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { loansContainer } from "./TabletContainers/loansContainer";
import { conversationContainer } from "./TabletContainers/conversationContainer";

export default class TabletScene extends Phaser.Scene {

    worldSize = { width: 850, height: 500 };
    tabletShown: boolean = false;


    tabletBorder?: Phaser.GameObjects.Image;
    mask?: Phaser.Display.Masks.GeometryMask;
    group?: Phaser.GameObjects.Group;
    eventCenter = EventsCenterManager.getInstance();
    stateGlobal: globalState;


    containerMenu?: menuContainer;
    containerStats?: statsContainer;
    containerInversions?: inversionsContainer;
    containerLoans?: loansContainer;
    containerStocks?: stockContainer;
    containerConversation?: conversationContainer;

    constructor(x: number, y: number) {
        super({ key: "TabletScene", mapAdd: { rexUI: "rexUI" } });

        this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        this.eventCenter.turnEventOn("TabletScene", this.eventCenter.possibleEvents.CHANGE_SCENE, () => {
            this.showOrHideTablet(true);
        }, this);
    }

    preload() {
        this.load.scenePlugin({
            key: "rexUI",
            url: rexUI,
            sceneKey: "rexUI",
        });
    }

    showOrHideTablet(forceClose: boolean = false) {
        if (!forceClose) {
            this.tweens.add({
                targets: [this.cameras.main],
                y: this.tabletShown ? window.innerHeight + 200 : window.innerHeight / 2 - this.worldSize.height / 2,
                duration: 200,
                ease: 'ease'
            })

            this.tweens.add({
                targets: [this.cameras.getCamera("itemsCam")],
                y: this.tabletShown ? window.innerHeight + 200 : window.innerHeight / 2 - this.worldSize.height / 2 + 20,
                duration: 200,
                ease: 'ease',
            })
            // if (this.containerLoans) this.containerLoans.showOrHideContainer(!this.tabletShown)
            this.tabletShown = !this.tabletShown;
        } else {
            this.tweens.add({
                targets: [this.cameras.main],
                y: window.innerHeight + 200,
                duration: 200,
                ease: 'ease'
            })

            this.tweens.add({
                targets: [this.cameras.getCamera("itemsCam")],
                y: window.innerHeight + 200,
                duration: 200,
                ease: 'ease',
            })
            this.tabletShown = false;
            // if (this.containerLoans) {
            //     this.containerLoans.showOrHideContainer(false)
            // }
        }
        
        this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);

        if (this.tabletShown) this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.OPEN_TABLET_MENU, null);
        else this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.CLOSE_TABLET_MENU, null);

    }

    moveCamerasTo(coords: number[] = [0, 0]) {
        this.cameras.getCamera("itemsCam")?.pan(coords[0], coords[1], 200, 'Linear', true);
    }



    create() {
        this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);

        this.cameras.main.setViewport((window.innerWidth / 2 - this.worldSize.width / 2), this.tabletShown ? window.innerHeight / 2 - this.worldSize.height / 2 : window.innerHeight + 200, this.worldSize.width, this.worldSize.height)
        this.cameras.main.centerOn(0, 0)
        this.tabletBorder = this.add.image(0, 0, "fondoTabletOp2").setOrigin(0).setScale(0.5,0.5).setScrollFactor(0).setInteractive()

       
        
        const handleMoveMenu = () => {
            this.moveCamerasTo(middlePositions[0]);
        }

        const handleMove = (coords: number[]) => {
            this.moveCamerasTo(coords);
        };

        const handleHideShowTablet = () => {
            this.showOrHideTablet();
            this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
        }

        const middlePositions = [
            [0, 0],
            [0, this.worldSize.height],
            [-this.worldSize.width, 0],
            [0, this.worldSize.height],
            [this.worldSize.width, 0],
        ]

        const tabletItemsCamera = this.cameras.add(window.innerWidth / 2 - this.worldSize.width / 2 + 20, window.innerHeight + 200, this.worldSize.width - 50, this.worldSize.height - 65, false, "itemsCam")
        tabletItemsCamera.centerOn(0, 0)
        tabletItemsCamera.ignore(this.tabletBorder);
       
        this.containerMenu = new menuContainer(this, 0, 0, handleMove, handleHideShowTablet);

        this.containerStats = new statsContainer(this, -this.worldSize.width, 0, handleMoveMenu, handleHideShowTablet, this.stateGlobal);

        this.containerInversions = new inversionsContainer(this, this.worldSize.width, 0, handleMoveMenu, handleHideShowTablet, this.stateGlobal);

        this.containerStocks = new stockContainer(this, 0, this.worldSize.height, handleMoveMenu, handleHideShowTablet, this.stateGlobal);
        
        this.containerConversation = new conversationContainer(this, this.worldSize.width, this.worldSize.height, handleMoveMenu, handleHideShowTablet, this.stateGlobal);

        this.containerLoans = new loansContainer(this, -this.worldSize.width, this.worldSize.height, handleMoveMenu, handleHideShowTablet, this.stateGlobal);

        this.cameras.main.ignore([
            this.containerConversation,
            this.containerStocks,
            this.containerStats,
            this.containerInversions,
            this.containerMenu,
            this.containerLoans,
            
        ]);

        this.eventCenter.turnEventOn("TabletScene", this.eventCenter.possibleEvents.UPDATE_STATE, () => {
            this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        }, this);

        this.events.once('destroy', () => {
            if (this.containerInversions) {
                this.containerInversions.fireClose();
            }
            if (this.containerStocks) {
                this.containerStocks.fireClose();
            }
            if (this.containerStats) {
                this.containerStats.fireClose();
            }
            if (this.containerLoans) {
                this.containerLoans.fireClose();
            }
            if (this.containerConversation) {
                this.containerConversation.fireClose();
            }
        }, this);

        // add tabletCamera image 

        // const tabletItemsCamera2 = this.cameras.add(window.innerWidth / 2 - this.worldSize.width / 2 + 20, window.innerHeight + 200, this.worldSize.width - 50, this.worldSize.height - 65, false, "itemsCam2")
        // tabletItemsCamera2.centerOn(0, 0)
        // tabletItemsCamera2.ignore([
        //     this.containerConversation,
        //     this.containerStocks,
        //     this.containerStats,
        //     this.containerInversions,
        //     this.containerMenu,
        //     this.containerLoans,
        //     this.tabletBorder
        // ]);
        // const tabletCamera = this.add.image(0, 210, "tabletCamera").setOrigin(0.5).setScale(1).setScrollFactor(0)
        // this.cameras.main.ignore(tabletCamera);
        // tabletItemsCamera.ignore(tabletCamera);

      
    }

    update() {
        if (this.containerInversions) {
            this.containerInversions.fireUpdate();
        }
        if (this.containerStocks) {
            this.containerStocks.fireUpdate();
        }
        if (this.containerStats) {
            this.containerStats.fireUpdate();
        }
        if (this.containerLoans) {
            this.containerLoans.fireUpdate();
        }
        if (this.containerConversation) {
            this.containerConversation.fireUpdate();
        }
    }
}