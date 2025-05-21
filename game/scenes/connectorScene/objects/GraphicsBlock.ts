import { ControlsObj } from "../types/ControlsObjType";
import { GraphicsBlockConfig } from "../types/GraphicsBlockConfigType";



export default class GraphicsBlock {
  x: number;
  y: number;
  size: number;
  graphics: Phaser.GameObjects.Graphics;
  controls: ControlsObj
  config: GraphicsBlockConfig;
  canBeCleared: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, size: number, controls: ControlsObj, config: GraphicsBlockConfig) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.controls = controls;
    this.config = config;
    this.graphics = new Phaser.GameObjects.Graphics(scene);
  }

  draw() {
    const xPos = this.x * this.size;
    const yPos = this.y * this.size;

     // if config.type is equal to current type, clean
     if(this.config.type === "lantern") {
      this.graphics.clear();
      this.graphics.fillStyle(this.config.color, 1);
      this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.setAlpha(1);
      this.graphics.setVisible(true);
      this.graphics.setInteractive(new Phaser.Geom.Rectangle(
        this.x * this.size,
        this.y * this.size,
        this.size,
        this.size
      ), Phaser.Geom.Rectangle.Contains);
      // Draw a triangle
     
      this.graphics.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        this.controls.onStopClick(pointer.x, pointer.y, this);
      });
     }
     
     if(this.config.type == "bomb") {
      this.graphics.clear();
      this.graphics.fillStyle(this.config.color, 1);
      this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.setAlpha(1);
      this.graphics.setVisible(true);
      this.graphics.setInteractive(new Phaser.Geom.Rectangle(
        this.x * this.size,
        this.y * this.size,
        this.size,
        this.size
      ), Phaser.Geom.Rectangle.Contains);
      // Draw a triangle
     
      this.graphics.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        this.controls.onStopClick(pointer.x, pointer.y, this);
      });
      return
    }

    if(this.config.type !== "empty") this.canBeCleared = false;
    this.graphics.fillStyle(this.config.color, 1);
    this.graphics.fillRect(xPos, yPos, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(xPos, yPos, this.size, this.size);
    this.graphics.setAlpha(0.5);
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
    this.graphics.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.controls.onStopClick(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.controls.onMove(pointer.x, pointer.y, this);
    });
   
  }
  
  
  onHover(){
    // change color
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }

  onHoverOut(){
    // change color
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }
  
  // Create Drag Controls, the idea is to drag the block (not 0 or empty) and colored alll blocks while the drag continues, dont change the color of other blocks colors
  changeConfig(config: GraphicsBlockConfig) {
    
    console.log("CHANGE CONFIG", config, this.canBeCleared, this.config);
   
    // set config to new config
    this.config = config;
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
    // set canBeCleared to false
    
  }
}
