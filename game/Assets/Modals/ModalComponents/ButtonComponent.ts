import { buttonMenu } from "@/game/TabletContainers/menuContainer";
import { tweenButtonOut, tweenButtonOver } from "./tweenHelpers";
import possibleSounds from "../../../../game/modules/possibleSounds.json";
import EventsCenterManager from "../../../services/EventsCenter";

export default class ButtonComponent extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Image;
    buttonText: Phaser.GameObjects.Text;
    callback: Function;
    eventCenter = EventsCenterManager.getInstance();
    onceEvent: boolean = false;
    isPauseInteracts?: boolean = false;

    disableEvent(eventName: string): void {
        this.background.off(eventName);
    }

    pauseInteracts(state: boolean): void {
        this.isPauseInteracts = state;
    }

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        width: number, 
        content: string, 
        background: string = "btn", 
        color: string = "#ffffff", 
        size: string = "16", 
        scaleOver: number = 1.2, 
        scaleOut: number = 1, 
        callback: Function,
        customScale?: {
            x: number,
            y: number
        },
        onceEvent: boolean = false
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.onceEvent = onceEvent;
        this.callback = callback;

        let onceTime = false;
        if (background === "btn-ir-d" || this.onceEvent) {
            onceTime = true;
        }
        this.background = this.scene.add.image(0, 0, background).setScale(1.2, 1).setOrigin(0.5).setInteractive();

        this.buttonText = this.scene.add.text(0, 0, content, {
            fontFamily: "MontserratSemiBold",
            fontSize: size + 'px',
            color: color,
            wordWrap: { width: width },
            fixedWidth: width,
            fixedHeight: 0,
        }).setAlign('center').setOrigin(0.5);

        if (onceTime) {
            this.background.once('pointerup', () => {
                this.callback();
                //this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonOptionMenu);
            });
        } else {
            this.background.on('pointerup', () => {
                this.callback();
                //this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.tablet.buttonOptionMenu);
            });
        }

        this.background.on("pointerover", () => {
            if (!this.isPauseInteracts) {
                let allTweens = this.scene.tweens.getTweensOf(this);
                allTweens.forEach(tween => {
                    tween.stop();
                });
                tweenButtonOver(this, scaleOver, scene);
            }
        });
        this.background.on("pointerout", () => {
            if (!this.isPauseInteracts) {
                let allTweens = this.scene.tweens.getTweensOf(this);
                allTweens.forEach(tween => {
                    tween.stop();
                });
                tweenButtonOut(this, scaleOut, scene);
            }
        });

        if (customScale) {
            this.background.setScale(customScale.x, customScale.y);
        }

        this.add([
            this.background,
            this.buttonText,
        ]);


    }

    setBackgroundTexture(texture: string): void {
        this.background.setTexture(texture);
    }

    setColorText(color: string): void {
        this.buttonText.setColor(color);
    }
}


export class ButtonComponentTablet extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Image;
    buttonText: Phaser.GameObjects.Text;
    callback: Function;

    disableEvent(eventName: string): void {
        this.background.off(eventName);
    }

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, content: string, buttonData: buttonMenu, color: string = "#ffffff", size: string = "16", scaleOver: number = 1.2, scaleOut: number = 1, callback: Function) {
        super(scene, x, y);
        this.scene = scene;

        this.callback = callback;
        this.background = this.scene.add.image(0, 0, buttonData.texture).setOrigin(0.5).setInteractive();

        this.buttonText = this.scene.add.text(0, 0, content, {
            fontFamily: "MontserratSemiBold",
            fontSize: size + 'px',
            color: color,
            wordWrap: { width: width },
            fixedWidth: width,
            fixedHeight: 0,
        }).setAlign('center').setOrigin(0.5);

        this.background.on('pointerup', () => {
            this.callback();
        });

        this.background.on("pointerover", () => {
            this.background.setTexture(buttonData.textureHover)
            // let allTweens = this.scene.tweens.getTweensOf(this);
            // allTweens.forEach(tween => {
            //     tween.stop();
            // });
            // tweenButtonOver(this,scaleOver,scene);
        });
        this.background.on("pointerout", () => {
            this.background.setTexture(buttonData.texture)
            // let allTweens = this.scene.tweens.getTweensOf(this);
            // allTweens.forEach(tween => {
            //     tween.stop();
            // });
            // tweenButtonOut(this,scaleOut,scene);
        });



        this.add([
            this.background,
            this.buttonText,

        ]);


    }
}