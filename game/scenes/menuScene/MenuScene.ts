import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";

export default class MenuScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  debug?: Phaser.GameObjects.Graphics;
  fondoA?: Phaser.GameObjects.Image;
  fondoB?: Phaser.GameObjects.Image;
  containerA?: Phaser.GameObjects.Container;
  containerB?: Phaser.GameObjects.Container;
  containerAPos: {x: number, y: number} = {x: window.innerWidth / 2 - 400, y: window.innerHeight / 2};
  containerBPos: {x: number, y: number} = {x: window.innerWidth / 2 + 400, y: window.innerHeight / 2};
  maskGraphics1?: Phaser.GameObjects.Graphics;
  maskGraphics2?: Phaser.GameObjects.Graphics;
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    this.load.image("player", "/assets/sprites/test/player.png");
    this.load.image("fondoA", "/assets/backgrounds/fondoA.png");
    this.load.image("fondoB", "/assets/backgrounds/fondoB.png");
  }

  create() {
    this.containerA = this.add.container(this.containerAPos.x, this.containerAPos.y).setSize(400, 800).setInteractive();
    this.containerB = this.add.container(this.containerBPos.x, this.containerBPos.y).setSize(400, 800).setInteractive();
    this.fondoA = this.add.image(400, 0, "fondoA");
    this.containerA.add(this.fondoA);
    this.fondoB = this.add.image(-400, 0, "fondoB");
    this.containerB.add(this.fondoB);
    // this.maskGraphics1 = this.add.graphics();
    // this.maskGraphics1.fillRect(window.innerWidth / 2 - 400 - 200, window.innerHeight / 2 - 400, 400, 800);
    const rectTestJP = this.add.rectangle(window.innerWidth / 2 - 400, window.innerHeight / 2, 400, 800, 0xff0000, 0).setOrigin(0.5);
    this.maskGraphics2 = this.add.graphics();
    this.maskGraphics2.fillRect(window.innerWidth / 2 + 400 - 200, window.innerHeight / 2 - 400, 400, 800);
    const mask = rectTestJP.createGeometryMask();
    // const mask = this.maskGraphics1.createGeometryMask();
    const mask2 = this.maskGraphics2.createGeometryMask();
    this.containerA.setMask(mask);
    this.containerB.setMask(mask2);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.containerA.on('pointerdown', () => {
      // this.changeGraphicsSize(this.maskGraphics1!, 50, this.containerA!)
      this.tweens.add({
        targets: rectTestJP,
        duration: 1000,
        width: 2500,
        x: '-=400',
        y: '-=' + windowHeight / 2,
        height: 1200,
        onUpdate: () => {
          console.log('1,' , rectTestJP.x, rectTestJP.y)
          rectTestJP.setPosition(window.innerWidth / 2 - 400, window.innerHeight / 2);
          this.fondoA?.setMask(rectTestJP.createGeometryMask());
          console.log('2,' , rectTestJP.x, rectTestJP.y)
        },
        ease: 'Bounce.easeOut',
      })
    });

    this.containerB.on('pointerdown', () => {
      this.changeGraphicsSize(this.maskGraphics2!, 50, this.containerB!)
    });


    if (this.maskGraphics1 && this.maskGraphics2) {
      // this.time.delayedCall(3000, () => this.changeGraphicsSize(this.maskGraphics1), [], this)
    }

  }

  changeGraphicsSize(graphics: Phaser.GameObjects.Graphics, steps: number = 1000, container: Phaser.GameObjects.Container) {
    container.setDepth(999)
    // Clear the existing graphics
    graphics?.clear();
    
    // Get screen dimensions
    const screenWidth = window.innerWidth * 2;
    const screenHeight = window.innerHeight * 2;
    
    // Calculate center point (this remains constant)
    const centerX = container.x;
    const centerY = container.y;
    
    // Get container's initial size
    const initialWidth = container.width;
    const initialHeight = container.height;
    
    // Calculate the step size for width and height (from container size to screen size)
    const widthStep = (screenWidth - initialWidth) / steps;
    const heightStep = (screenHeight - initialHeight) / steps;
    
    // Redraw the graphics with multiple rectangles, growing from center using delayed calls
    let currentStep = 1;
    const drawStep = () => {
      const currentWidth = initialWidth + (widthStep * currentStep);
      const currentHeight = initialHeight + (heightStep * currentStep);
      
      // Calculate position to keep center point constant
      const x = centerX - currentWidth / 2;
      const y = centerY - currentHeight / 2;
      
      // Draw rectangle (you can add different colors or styles per step if needed)
      graphics.fillRect(x, y, currentWidth, currentHeight);
      container.setMask(graphics.createGeometryMask());
      
      currentStep++;
      
      // Continue if we haven't reached the final step
      if (currentStep <= steps) {
        this.time.delayedCall(currentStep < steps/2 ? 10 : 1, drawStep, [], this);
      }
    };
    
    // Start the first step
    drawStep();
  }

  update() {

  }
}
