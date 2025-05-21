import { BlackBrickControlsObj } from "../types/BlackBrickControlsObjType";
import { GraphicsBlockConfig } from "../types/GraphicsBlockConfigType";

export default class BlackBrickGraphicsBlock {
    x: number;
    y: number;
    size: number;
    graphics: Phaser.GameObjects.Graphics;
    controls: BlackBrickControlsObj
    config: GraphicsBlockConfig;
  
    constructor(scene: Phaser.Scene, x: number, y: number, size: number, controls: BlackBrickControlsObj) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.controls = controls;
      this.graphics = new Phaser.GameObjects.Graphics(scene);
      this.config = {type: "black", color: 0x000000, alpha: 1};
    }
  
    onHover(x: number, y: number, obj: BlackBrickGraphicsBlock) {
      this.graphics.clear();
      // this.graphics.fillStyle(this.config.color, 0.1); // Modo Debug
      this.graphics.fillStyle(0x0d0d0d, 1);
      this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  
    }
    onHoverOut(x: number, y: number, obj: BlackBrickGraphicsBlock) {
      // revert
      this.graphics.clear();
      // this.graphics.fillStyle(this.config.color, 1); // Modo Debug
      this.graphics.fillStyle(this.config.color, 1);
      this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size); 
      
    }
  
    draw() {
      const xPos = this.x * this.size;
      const yPos = this.y * this.size;
      this.graphics.fillStyle(this.config.color, 1);
      this.graphics.fillRect(xPos, yPos, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(xPos, yPos, this.size, this.size);
      this.graphics.setAlpha(1);
      this.graphics.setVisible(true);
      this.graphics.setInteractive(new Phaser.Geom.Rectangle(
        xPos,
        yPos,
        this.size,
        this.size
      ), Phaser.Geom.Rectangle.Contains);
  
      this.graphics.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.controls.onClick(pointer.x, pointer.y, this);
      });
  
      this.graphics.on('pointerover', (pointer: Phaser.Input.Pointer) => {
        this.controls.onHover(pointer.x, pointer.y, this);
      });
  
      this.graphics.on('pointerout', (pointer: Phaser.Input.Pointer) => {
        this.controls.onHoverOut(pointer.x, pointer.y, this);
      });
    }
  }