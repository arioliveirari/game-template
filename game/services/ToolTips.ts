import { globalState } from "../GlobalDataManager";
import RPG from "../gameIndex";
import EventsCenterManager from "./EventsCenter";

export default class ToolTips {
  scene: RPG;
  sprite?: Phaser.GameObjects.Sprite;
  updateMovement?: Function;
  onClosed?: Function;
  checkClickInsideRect: boolean = false;
  textToShow: string = "";
  blackScreen?: Phaser.GameObjects.Graphics;
  containerBox?: Phaser.GameObjects.Container;
  box?: Phaser.GameObjects.Graphics;
  text?: Phaser.GameObjects.Text;
  closeBtn?: Phaser.GameObjects.Text;
  mask?: Phaser.GameObjects.Graphics;
  makeMask?: Phaser.Geom.Rectangle | Phaser.Geom.Circle;
  wheelListeners: any[] = [];
  labelText?: Phaser.GameObjects.Text;
  id: string = "";
  withDirectionIndicator: boolean = true;
  directionIndicatorGraphic?: Phaser.GameObjects.Graphics;
  wizzarImage?:Phaser.GameObjects.Sprite;
  eventCenter = EventsCenterManager.getInstance();
  openedStoolTips: string[] = []


  constructor(scene: RPG) {
    this.scene = scene;

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.LAST_TOOLTIP,
      (payload: string[]) => {
        this.updateOpenedToolTip(payload);
      },
      this
    )
    const globalState: globalState = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );

    this.openedStoolTips = [...globalState.tooltips];
  }

  checkIfPointerIsInsideRect(pointer: Phaser.Input.Pointer) {
    if (this.makeMask instanceof Phaser.Geom.Circle) {
      return Phaser.Geom.Circle.Contains(this.makeMask, pointer.x, pointer.y);
    } else {
      return Phaser.Geom.Rectangle.Contains(
        this.makeMask!,
        pointer.x,
        pointer.y
      );
    }
  }

  buildBack() {
    if (this.blackScreen) this.blackScreen.destroy();
    if (this.sprite) this.sprite.destroy();
    const { width, height } = this.scene.game.canvas;
    this.sprite = this.scene.add
      .sprite(0, 0, "block")
      .setOrigin(0, 0)
      .setTint(0x000000);
    this.sprite.addToUpdateList();
    this.sprite.setInteractive({
      topOnly: true,
      useHandCursor: true,
    });

    this.sprite.displayHeight = height;
    this.sprite.displayWidth = width;
    this.sprite.setAlpha(0.1);

    this.blackScreen = this.scene.add.graphics();
    this.blackScreen.fillStyle(0x000000, 0.5);
    this.blackScreen.fillRect(0, 0, width, height);

    this.sprite.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.scene.input.stopPropagation();
      if (
        this.checkClickInsideRect &&
        this.checkIfPointerIsInsideRect(pointer)
      ) {
        this.close();
      }
    });

    this.sprite.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.scene.input.stopPropagation();
    });
  }

  updateCamera(t: number) {
    if (!this.updateMovement) return;
    const newMask = this.updateMovement(t)
    this.makeMask = newMask
    this.buildMask();
    if(this.withDirectionIndicator){
      this.buildDirectionIndicator();
    }

  }

  buildDirectionIndicator() {
    if (this.directionIndicatorGraphic) this.directionIndicatorGraphic.clear();
    
    // neds to be an arrow in the top center of the screen, showing the direction from the center of the screen to the direction of the tooltip
    // without any mask, over all the other elements

    const { width, height } = this.scene.cameras.main;
    const x = width / 2;
    const y = height / 2;

    const x2 = this.makeMask?.x ?? 0;
    const y2 = this.makeMask?.y ?? 0;
    
    
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
    
    this.directionIndicatorGraphic = this.scene.add.graphics();
    // fill a circle in the back
    this.directionIndicatorGraphic.fillStyle(0x000000);
    this.directionIndicatorGraphic.fillCircle(x, y, lng);
    // add border to the circle
    this.directionIndicatorGraphic.lineStyle(4, 0xffd700);
    this.directionIndicatorGraphic.strokeCircle(x, y, lng);
    // draw the line


    this.directionIndicatorGraphic.lineStyle(4, 0xffd700);
    this.directionIndicatorGraphic.strokeLineShape(direction);
    this.directionIndicatorGraphic.fillStyle(0xffd700);
    
    // position the graphics in the top center of the screen with 100 as paddint top
    this.directionIndicatorGraphic.y =  (-1 * (height / 2)) + 100;
    
    
    this.directionIndicatorGraphic.setAlpha(0.7)


    

    
  }

  close() {
    if(this.directionIndicatorGraphic)  this.directionIndicatorGraphic.destroy();
    if(this.wizzarImage) this.wizzarImage.destroy();
    this.labelText?.destroy();
    this.blackScreen?.destroy();
    this.box?.destroy();
    this.text?.destroy();
    this.closeBtn?.destroy();
    this.sprite?.destroy();
    this.mask?.destroy();
    this.withDirectionIndicator = false;
    if (this.updateMovement) {
      this.scene.events.off("update", this.updateCamera, this);
    }
    for (let i = 0; i < this.wheelListeners.length; i++) {
      this.scene.input.addListener("wheel", this.wheelListeners[i]);
    }
    this.onClosed!();
  }

  buildBox() {
    this.box = this.scene.add.graphics();
    this.box.fillStyle(0x000000, 0.4);

    // stroke with gold color
    this.box.lineStyle(4, 0xffd700);

    const boxWidth = 300;
    const margin = 40;
    const boxPositionX = 150;
    const boxPositionY = 150;

    this.text = this.scene.add.text(boxPositionX + (margin / 2), boxPositionY + (margin / 2), this.textToShow, {
      color: "#fff",
      fontStyle: "bold",
      fontSize: "20px",
      wordWrap: { width: boxWidth - margin },
    });

    // calculate the height of the text
    const textHeight = this.text.height + margin;

    this.box.fillRoundedRect(boxPositionX, boxPositionY, boxWidth, textHeight, 10).strokeRoundedRect(boxPositionX, boxPositionY, boxWidth, textHeight, 10);

    this.closeBtn = this.scene.add.text(boxPositionX + boxWidth - margin + 3, boxPositionY + 4, "X", { 
      color: "#fff",
      fontSize: "20px",
      fontStyle: "bold",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
      
    });
    this.closeBtn.setInteractive();
    this.closeBtn.on("pointerdown", () => {
      this.close();
    });

    const buildText = (text: string) => {
      // if text is only one character, add a 0 in front
      let newText = text;
      if (text.length === 1) {
        newText = `0${text}`;
      }

      // split each character with a space
      return newText.split("").join(" ");
      

    }

    this.labelText = this.scene.add.text(
      boxPositionX - 32, boxPositionY + textHeight - 60, buildText(this.id), {
        fixedWidth: 30,
        wordWrap: { width: 1 },
        color: "#000",
        fontStyle: "bold",
        fontSize: "20px",
        backgroundColor: "#ffd700",
        padding: { x: 10, y: 5 },
      })

    this.containerBox = this.scene.add.container(0, 0, [
      this.labelText,
      this.box,
      this.text,
      this.closeBtn,
    ]);

    this.containerBox.setAlpha(0)
    this.containerBox.y = this.containerBox.y - 150;
    this.scene.tweens.add({
      targets: this.containerBox,
      alpha: 1,
      y: this.containerBox.y + 150,
      duration: 500,
      ease: "Back.easeOut",
    });

  }

  buildMask() {
    if (this.blackScreen) this.blackScreen.clearMask();
    if (this.mask) this.mask.clear();
  
    let mask = this.scene.add.graphics();
    mask.fillStyle(0xffffff, 0);
    mask.setAlpha(0.5);
    this.mask = mask;
  
    const scaleTarget = { scale: 1 };
  
    if (this.makeMask instanceof Phaser.Geom.Rectangle) {
      const { x, y, width, height } = this.makeMask;
  
      const redrawRectangle = () => {
        mask.clear();
        mask.fillStyle(0xffffff, 0);
        const newWidth = width * scaleTarget.scale;
        const newHeight = height * scaleTarget.scale;
        const newX = x - (newWidth - width) / 2;
        const newY = y - (newHeight - height) / 2;
        mask.fillRect(newX, newY, newWidth, newHeight);
        mask.closePath();
      };
  
      this.scene.tweens.add({
        targets: scaleTarget,
        scale: 1.05,
        duration: 500,
        yoyo: true,
        repeat: -1,
        onUpdate: redrawRectangle,
      });
  
      redrawRectangle(); // Dibuja la primera vez
  
    } else if (this.makeMask instanceof Phaser.Geom.Circle) {
      const { x, y, radius } = this.makeMask;
  
      const redrawCircle = () => {
        mask.clear();
        mask.fillStyle(0xffffff, 0);
        const newRadius = radius * scaleTarget.scale;
        mask.fillCircle(x, y, newRadius);
      };
  
      this.scene.tweens.add({
        targets: scaleTarget,
        scale: 1.05,
        duration: 500,
        yoyo: true,
        repeat: -1,
        onUpdate: redrawCircle,
      });
  
      redrawCircle(); // Dibuja la primera vez
    }
  
    const _mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.mask);
    _mask.invertAlpha = true;
    this.blackScreen?.setMask(_mask);
  }
  

  checkIfToolTipWasOpenBefore(id: string) {
    return this.openedStoolTips.includes(id)
  }

  updateOpenedToolTip(ids: string[]) {
    ids.forEach(id => {
      if(!this.openedStoolTips.includes(id)) {
        this.openedStoolTips.push(id);     
      }
    })
  }

  getOpenedToolTips() {
    return this.openedStoolTips;
  }

  openToolTip(
    id: string,
    textToShow: string,
    makeMask: Phaser.Geom.Rectangle | Phaser.Geom.Circle,
    onClosed: Function,
    checkClickInsideRect: boolean = true,
    updateMovement: Function | undefined = undefined,
    drawCompass: boolean = true,
    ignoreCheck: boolean = false,
    wizzardImg: string | undefined = undefined,
    onRight: boolean = false
  ) {
   

    this.withDirectionIndicator = drawCompass;
    if(!ignoreCheck && this.checkIfToolTipWasOpenBefore(id)) return;

    this.openedStoolTips.push(id)
    const { width, height } = this.scene.cameras.main;

   

    this.id = id;
    this.textToShow = textToShow;
    this.makeMask = makeMask;
    this.onClosed = onClosed;

    this.checkClickInsideRect = checkClickInsideRect;
    this.updateMovement = updateMovement;

    this.wheelListeners = this.scene.input.listeners("wheel");
    if (this.updateMovement) {
      // ESTO ES LO QUE NO SE DISPARA YET
      this.scene.events.on("update", this.updateCamera, this);
    }


    this.scene.input.removeListener("wheel");
    this.buildBack();
    // build wizzard
    if(wizzardImg){
      if(this.wizzarImage) this.wizzarImage.destroy();
      this.wizzarImage = this.scene.add.sprite(67, 230, wizzardImg+`_${2}`).setOrigin(0.5, 0.5);
      this.wizzarImage.setAlpha(1);
    }
    this.buildBox();
    this.buildMask();
    if(this.withDirectionIndicator){
      this.buildDirectionIndicator();
    }

   

    this.scene.cameras.cameras.forEach((camera) => {
      if (this.scene.UICamera && this.scene.UICamera.id === camera.id) return;
      if(this.directionIndicatorGraphic) camera.ignore(this.directionIndicatorGraphic);
      if(this.wizzarImage) camera.ignore(this.wizzarImage);
      camera.ignore(this.labelText!);
      camera.ignore(this.blackScreen!);
      camera.ignore(this.closeBtn!);
      camera.ignore(this.box!);
      camera.ignore(this.text!);
      camera.ignore(this.sprite!);
      camera.ignore(this.mask!);
    });

    if(onRight) {
      this.containerBox?.setX(width / 2);
    }
  }
}

export const GetPointFromWorld = (point: Phaser.Geom.Point, scene: RPG) => {
  const x = point.x - scene.cameras.main.scrollX;
  const y = point.y - scene.cameras.main.scrollY;
  return new Phaser.Geom.Point(x, y);
};
