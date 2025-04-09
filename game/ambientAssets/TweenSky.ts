import { globalState } from "../GlobalDataManager";
import EventsCenterManager from "../services/EventsCenter";
import AmbientBackgroundScene from "./backgroundScene";

export default class TweenSky extends Phaser.GameObjects.Container {
    scene: AmbientBackgroundScene
    morning: Phaser.GameObjects.Rectangle;
    middleDay: Phaser.GameObjects.Rectangle;
    background: Phaser.GameObjects.Rectangle;
    afternoun: Phaser.GameObjects.Image;
    night: Phaser.GameObjects.Image;
    stars: Phaser.GameObjects.Image;
    eventCenter = EventsCenterManager.getInstance();
    globalState: globalState;
    stateBackground: "RUNNING" | "IDLE" = "IDLE"
    ANIM_DURATION = 800
    oldTimeOfDay: number = 1
    constructor(scene: AmbientBackgroundScene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        this.scene = scene
        this.background = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(1).setOrigin(0.5)
        this.morning = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xaefbff).setAlpha(1).setOrigin(0.5)
        this.middleDay = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(0).setOrigin(0.5)
        this.afternoun = scene.add.image(0, 0, "day").setAlpha(0).setScale(1.5);// Fix el scale para que se expanda la imagen
        this.night = scene.add.image(0, 0, "night").setAlpha(0).setScale(1.5);// Fix el scale para que se expanda la imagen
        this.stars = scene.add.image(0, 0, "stars").setAlpha(0);
        this.globalState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, undefined)
        this.oldTimeOfDay = this.globalState.timeOfDay
        this.changeSky(this.globalState)
        this.add([this.background, this.morning, this.middleDay, this.afternoun, this.night, this.stars]);
        this.scene.add.existing(this)

        this.eventCenter.turnEventOn("AmbientBackgroundScene", this.eventCenter.possibleEvents.UPDATE_STATE, () => {
            const globalState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, undefined)
            if (globalState.timeOfDay !== this.oldTimeOfDay) {
                this.oldTimeOfDay = globalState.timeOfDay
                this.changeSky(globalState)
            }
        }, this.scene)
    }

    tweenSky(target: 'morning' | 'middleDay' | 'afternoun' | 'night', on: boolean) {
        const targets = {
            'morning': [this.morning],
            'middleDay': [this.middleDay],
            'afternoun': [this.afternoun],
            'night': [this.night, this.stars]
        }
        this.scene.tweens.add({
            targets: targets[target],
            alpha: on ? 1 : 0,
            duration: this.ANIM_DURATION,
            ease: 'ease',
        });
    }

    changeSky(data?: globalState) {
        if (this.stateBackground === "RUNNING") return
        this.stateBackground = "RUNNING"
        if (data?.inversionModule.isActive) {
            switch (data.timeOfDay) {
                case 1:
                    this.tweenSky('morning', true)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', false)
                    break;
                case 2:
                    this.tweenSky('morning', true)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', false)
                    break;
                case 3:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', true)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', false)
                    break;
                case 4:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', true)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', false)
                    break;
                case 5:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', true)
                    this.tweenSky('night', false)
                    break;
                case 6:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', true)
                    this.tweenSky('night', false)
                    break;
                case 7:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', true)
                    break;
                case 8:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', true)
                    break;
            }
        } else {
            switch (data?.timeOfDay) {
                case 1:
                    this.tweenSky('morning', true)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', false)
                    break;
                case 2:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', true)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', false)
                    break;
                case 3:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', true)
                    this.tweenSky('night', false)
                    break;
                case 4:
                    this.tweenSky('morning', false)
                    this.tweenSky('middleDay', false)
                    this.tweenSky('afternoun', false)
                    this.tweenSky('night', true)
                    break;
            }
        }
        this.scene.time.delayedCall(this.ANIM_DURATION, () => {
            this.stateBackground = "IDLE"
        })
    }
}