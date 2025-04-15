import Phaser from "phaser";
import PreLoadScene from "./PreLoadScene";
import EventsCenterManager from "../services/eventsServices/EventsCenterService";

import MenuScene from "../scenes/menuScene/MenuScene";
import CinematographyHandler from "../scenes/cinematography/CinematographyHandler";

export enum BetweenScenesStatus {
    IDLE,
    PROCCESSING,
    WAITING,
}
export default class BetweenScenes extends Phaser.Scene {
    status: BetweenScenesStatus;
    blocks?: Phaser.GameObjects.Group;
    newSceneName?: string;
    sceneToStop?: string;
    newSceneWith?: any;
    firstRender: boolean = true
    startTime: number = 0
    eventCenter = EventsCenterManager.getInstance();
    wParts = 30;
    hParts = 25;
    speed = 600;
    delayTime= 20;
    ease= "linear";

    constructor() {
        super({ key: "BetweenScenes" });
        this.status = BetweenScenesStatus.IDLE;
    }

    stopScene(scene: Phaser.Scene, callBack: Function) {
        scene.scene.stop();
        callBack();
    }

    getSceneByName(sceneKey: string) {
        return this.scene.get(sceneKey);
    }

    removeScene(scene: Phaser.Scene, callBack: Function) {
        scene.events.once(
            "destroy",
            () => {
                callBack();
            },
            this
        );
        scene.scene.remove();
    }

    changeSceneTo(sceneName: string, sceneToStop: string | undefined, data: any) {
        if (this.status == BetweenScenesStatus.IDLE) {
            this.sceneToStop = sceneToStop;
            this.newSceneName = sceneName;
            this.newSceneWith = data;
            this.status = BetweenScenesStatus.PROCCESSING;
            this.scene.launch(this);
        }
    }

    loadNewScene() {
        if (this.status == BetweenScenesStatus.PROCCESSING) {
            this.status = BetweenScenesStatus.WAITING;
            if (this.newSceneName) {
                if (this.sceneToStop) {
                    this.eventCenter.turnOffAllEventsByScene(this.sceneToStop)
                    const scene = this.getSceneByName(this.sceneToStop);
                    if (scene) {
                        this.stopScene(scene, () => {
                            this.removeScene(scene, () => {
                                if (this.newSceneName) {
                                    if (this.newSceneName == "MenuScene") {
                                        const menuScene = new MenuScene()
                                        this.scene.add("MenuScene", menuScene, true);
                                        this.scene.bringToTop("BetweenScenes");
                                    }
                                }
                                this.turnOff();
                            });
                        });
                    }
                } else {
                    if (this.newSceneName) {
                        if (this.newSceneName == "MenuScene") {
                            const menuScene = new MenuScene()
                            this.scene.add("MenuScene", menuScene, true);
                            this.scene.bringToTop("BetweenScenes");
                        }
                    }
                    this.turnOff();
                }
            }
        }
    }

    finishLogic() {
        this.newSceneName = undefined;
        this.newSceneWith = undefined;
        this.status = BetweenScenesStatus.IDLE;
        this.scene.remove('PreLoadScene')
        this.scene.remove('MultiScene')
    }

    turnOff() {
        const self = this;
        let i = 0;
        let ii = 0;

        //@ts-ignore
        this.blocks.children.iterate((c) => {
            const child = c as Phaser.GameObjects.GameObject;
            this.tweens.add({
                targets: child,
                alpha: 0,
                ease: this.ease,
                duration: this.speed,
                delay: i * this.delayTime,
                repeat: 0,
                yoyo: false,
                hold: 200,
                onComplete: ii == 107 ? self.finishLogic.bind(self) : () => { },
            });

            i++;
            ii++;

            if (i % this.wParts === 0) {
                i = 0;
            }
        });
    }

    onTurnOnComplete() {
        const preloadScene = new PreLoadScene(this.newSceneWith && this.newSceneWith.loadKey ? this.newSceneWith.loadKey : undefined, () => {
            this.loadNewScene()
            this.turnOff()
        });
        const scene = this.scene.add("PreLoadScene", preloadScene, true);

    }
    turnOn() {
        const self = this;
        let i = 0;
        let ii = 0;
        //@ts-ignore
        this.blocks.children.iterate((c) => {
            const child = c as Phaser.GameObjects.GameObject;
            this.tweens.add({
                targets: child,
                alpha: 1,
                ease: this.ease,
                duration: this.speed,
                delay: i * this.delayTime,
                repeat: 0,
                yoyo: false,
                hold: 200,
                onComplete: ii == 107 ? this.onTurnOnComplete.bind(self) : () => { },
            });
            i++;
            ii++;
            if (i % this.wParts === 0) {
                i = 0;
            }
        });
    }

    create() {
        this.firstRender = true
        this.blocks = this.add.group({
            key: "block",
            repeat: (this.wParts * this.hParts) - 1,
            setScale: { x: 0, y: 0 },
        });
        const { width, height } = this.cameras.main;
        //@ts-ignore
        this.blocks.getChildren().forEach((child: Phaser.GameObjects.Sprite, i) => {
            child.setOrigin(0.5, 0.5);
            child.displayWidth = Math.ceil(width / this.wParts);
            child.displayHeight = Math.ceil(height / this.hParts);
            child.setAlpha(0);
            child.setTint(0x000000);
        })
        Phaser.Actions.GridAlign(this.blocks.getChildren(), {
            width: this.wParts,
            height: this.hParts,
            cellWidth: Math.ceil(width / this.wParts),
            cellHeight: Math.ceil(height / this.hParts),
            x: 0,
            y: 0,
            position: Phaser.Display.Align.CENTER,
        });

    }

    update(time: number) {
        if (this.startTime == 0) {
            this.startTime = time
        }
        if (this.firstRender && time - this.startTime > 980) {
            this.firstRender = false
            this.turnOn();
        }
    }
}
