import BackgroundMenu from "./backgroundMenu";
import TweenSky from "./TweenSky";


export default class AmbientBackgroundScene extends Phaser.Scene{
    container?: Phaser.GameObjects.Container;
    middlePoint: {
        x: number;
        y: number
    } 
    sceneKey: string;
    
    constructor(sceneKey: string) {
        super({ key: "AmbientBackgroundScene" });
        this.middlePoint = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        }
        this.sceneKey = sceneKey;

    }

    create(data: { sceneKey: string }) {
        if (Object.keys(data).length !== 0) this.sceneKey = data.sceneKey;
        switch(this.sceneKey){
            case "MenuScene":
                this.container = new BackgroundMenu(this, this.middlePoint.x, this.middlePoint.y, this.middlePoint.x*2, this.middlePoint.y*2);
                break;
            case "DayAndNight":
                this.container = new TweenSky(this, this.middlePoint.x, this.middlePoint.y, this.middlePoint.x*2, this.middlePoint.y*2);
                break;
        }
    }
}