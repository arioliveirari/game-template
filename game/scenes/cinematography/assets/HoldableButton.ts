import Phaser from "phaser";
import CinematographyModular from "./CinematographyHandler";

// Scene in class
class HoldableButton extends Phaser.GameObjects.Container {
    scene: CinematographyModular;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    text?: Phaser.GameObjects.Text;
    graphics: Phaser.GameObjects.Graphics;
    circle?: Phaser.GameObjects.Graphics;

    progress: number = 0;

    radius: number;
    color: number;
    x: number;
    y: number;
    callBack: Function

    constructor(
        scene: CinematographyModular,
        x: number,
        y: number,
        radius: number,
        color: number,
        colorText: string,
        callBack: Function,
        isPostal: boolean,
    ) {
        super(scene);
        this.scene = scene;
        this.callBack = callBack;
        this.cursors = this.scene.cursors;
        this.color = color
        this.radius = radius
        this.x = x;
        this.y = y;
        this.graphics = this.scene.add.graphics();
        this.text = this.scene.add.text(x + radius*2 + 10, y, isPostal ? "Mantén espacio para continuar" : "Mantén espacio para continuar", {
            fontSize: 28,
            color: colorText,
            fontFamily: 'Arcade'
        }).setOrigin(0, 0.5)
        this.add([this.graphics, this.text])
        this.scene.cameras.main.ignore(this)
        this.scene.add.existing(this)
    }

    updateCircle(progress: number) {
        this.graphics.clear();
        //set opacity on depens of progress
        this.graphics.setAlpha(progress);
        this.graphics.lineStyle(2, this.color, 1);
        this.graphics.strokeCircle(this.x, this.y, this.radius);
        this.graphics.beginPath();
        this.graphics.fillStyle(this.color, 1);
        this.graphics.moveTo(this.x, this.y);
        this.graphics.arc(this.x, this.y, this.radius, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(270 + 360 * this.progress), false);
        this.graphics.lineTo(this.x, this.y);
        this.graphics.fillPath();
        this.graphics.closePath();
        this.add(this.graphics)
    }

    update(this: HoldableButton) {
        if (this.cursors) {
            // check touch
            let pointer = this.scene.input.activePointer;
            if (this.cursors.space.isDown || pointer.isDown) {
                this.progress += 0.02;
                if (this.progress >= 1) {
                    this.progress = 1;
                    this.callBack()
                }
            } else {
                this.progress = 0
            }
            this.updateCircle(this.progress)
        }
    }
}
export default HoldableButton;
