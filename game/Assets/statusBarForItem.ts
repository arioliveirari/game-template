export const ISOSPRITE: string = "IsoSprite";
import RPG from "../rpg";
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
export class StatusBarForItem extends RpgIsoSpriteBox {
  graphics: Phaser.GameObjects.Graphics;
  percentage: number = 0;
  type: string = "STATUSBAR";
  forItemId?: number;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number = 0,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: { x: number; y: number; h: number },
    interactivityPosition?: { x: number; y: number; w: number; h: number }
  ) {
    super(
      scene,
      x,
      y,
      z,
      texture,
      frame,
      group,
      matrixPosition,
      interactivityPosition
    );

    // create a graphic progress bar
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillRect(0, 0, 100, 10);
    this.graphics.fillStyle(this.returnColorFromPercentage(this.percentage), 1);
    this.graphics.fillRect(0, 0, this.percentage, 10);

    this.graphics.setScale(0.6,1.3)

    this.self.setAlpha(0);

    // move graphics to same point of sprite
    this.graphics.x = x;
    this.graphics.y = y;

    // set depth
    this.graphics.x = this.self.x - this.isoX
    this.graphics.y = this.self.y - this.isoY

    this.scene.events.on('update', this.update, this);
  } 

  returnColorFromPercentage(percentage: number) {
    // return number color, but goes from red to green depending on percentage

    let red = 255;
    let green = 0;
    if (percentage < 50) {
      red = 255;
      green = Math.round(5.1 * percentage);
    } else {
      green = 255;
      red = Math.round(510 - 5.1 * percentage);
    }
    return (red << 16) + (green << 8);


  }

  setPercentage(percentage: number) {
    this.percentage = percentage < 0 ? 0 : (percentage > 100 ? 100 : percentage);
    this.graphics.clear();
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillRect(0, 0, 100, 10);
    this.graphics.fillStyle(this.returnColorFromPercentage(this.percentage), 1);
    this.graphics.fillRect(0, 0, this.percentage, 10);
    this.graphics.setScale(0.6,1.3)


    this.graphics.x = this.self.x 
    this.graphics.y = this.self.y 
    this.graphics.depth = this.self.depth + 1

    // tween shake progressBar
    this.scene.add.tween({
      targets: this.graphics,
      scaleX: 0.7,
      scaleY: 1.5,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });
  }

  update(){
    this.graphics.x = this.self.x 
    this.graphics.y = this.self.y 
    this.graphics.depth = this.self.depth + 1

  }
}
