import RPG from "../rpg";

export class Compass {
    graphics?: Phaser.GameObjects.Graphics;
    checkPosition?: Function
    scene?: RPG;
    constructor() {
    
    }

  removeCompass() {
    this.graphics?.destroy();
    this.graphics = undefined;
    this.checkPosition = undefined;
    if(this.scene) this.scene.events.off("update", this.markDirection, this);
  }

  markDirection() {
    if(!this.checkPosition || !this.graphics || !this.scene) return
    
    const { width, height } = this.scene.cameras.main;
    const x = width / 2;
    const y = height / 2;

    const { x: x2, y: y2 } = this.checkPosition();
    
    // draw a 100px line between the center of the screen to the direction of the make mask
    let lng = 20;
    let minLng = 10;
    let direction = new Phaser.Geom.Line(x, y, x2, y2);
    // check if the line is too long
    const length = Phaser.Geom.Line.Length(direction);
    if (length > lng) {
      const newLength = lng;
      const angle = Phaser.Geom.Line.Angle(direction);
      const x3 = x + Math.cos(angle) * newLength;
      const y3 = y + Math.sin(angle) * newLength;
      direction = new Phaser.Geom.Line(x, y, x3, y3);
    }
    const length2 = Phaser.Geom.Line.Length(direction);
    if(minLng > length2 ) {
      // invisible
      return
    }

     this.graphics.clear();
     // fill a circle in the back
     this.graphics.fillStyle(0x000000);
     this.graphics.fillCircle(x, y, lng);
     // add border to the circle
     this.graphics.lineStyle(4, 0xffd700);
     this.graphics.strokeCircle(x, y, lng);
     // draw the line
 
 
     this.graphics.lineStyle(4, 0xffd700);
     this.graphics.strokeLineShape(direction);
     this.graphics.fillStyle(0xffd700);
     
     // position the graphics in the top center of the screen with 100 as paddint top
     this.graphics.y =  (-1 * (height / 2)) + 100;
     
     
     this.graphics.setAlpha(0.7)
     
  }

  createCompass(scene:RPG, fn:Function) {
    const { width, height } = scene.cameras.main;
    const x = width / 2;
    const y = height / 2;

    this.checkPosition = fn;
    this.scene = scene;
    this.graphics = scene.add.graphics();

    this.markDirection();
    this.scene.events.on("update", this.markDirection, this);
    // add to 
   
  }
}