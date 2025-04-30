import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";
import { PossibleScenesTypes } from "@/game/GlobalTypes";

export default class Player extends Phaser.GameObjects.Rectangle {
    recSize: number = 50;
    mainColor: number = 0x00ff00;
    eventCenter = EventsCenterManager.getInstance();
    cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    movSpeed: number = 10;
    sizeSpeed: number = 10;
    constructor(
        scene: PossibleScenesTypes,
        x: number = 0,
        y: number = 0,
        width: number = 100,
        height: number = 100,
        color: number = 0x0000ff
    ) {
        super(scene, x, y, width, height, color);
        this.scene.add.existing(this);
        this.recSize = width;
        this.mainColor = color;
        this.cursor = this.scene.input.keyboard?.createCursorKeys();
        // this.strokeColor = 0x000000;
        this.scene.physics.add.existing(this);
       
    }

    changeColor(color: number) {
        this.setFillStyle(color);
        this.mainColor = color;
    }

    changeSize(size: number) {
        this.setSize(size, size);
        this.recSize = size;
    }
   
    handleSize() {
        if (this.cursor) {
            if (this.cursor.shift.isDown) {
                this.recSize += this.sizeSpeed;
                if (this.recSize >= 300) this.recSize = 300;
                this.setSize(this.recSize, this.recSize);
            } else if (this.cursor.space.isDown) {
                this.recSize -= this.sizeSpeed;
                if (this.recSize <= 30) this.recSize = 30; 
                this.setSize(this.recSize, this.recSize);
            }
        }
    }

    handleMovement(){
        if (this.cursor) {
            if (this.cursor.left.isDown) {
                this.setPosition(this.x - this.movSpeed, this.y);
            } else if (this.cursor.right.isDown) {
                this.setPosition(this.x + this.movSpeed, this.y);
            }
            if (this.cursor.up.isDown) {
                this.setPosition(this.x, this.y - this.movSpeed);
            } else if (this.cursor.down.isDown) {
                this.setPosition(this.x, this.y + this.movSpeed);
            }
        }
    }

}
