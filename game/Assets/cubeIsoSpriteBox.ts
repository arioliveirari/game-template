
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
import { Player } from "./Player";
import { RpgIsoPlayerPrincipal } from "./rpgIsoPlayerPrincipal";
import RPG from "../rpg";
import { isNativeError } from "util/types";
import { GetPointFromWorld } from "../services/ToolTips";

export class CubeIsoSpriteBox extends RpgIsoSpriteBox {

  type: string = "CUBE";
  distanceBetweenFloors: number
  isEndpoint: boolean = false;
  textDisplayed?: Phaser.GameObjects.Text;
  text?: string;
  isWriting: boolean = false;
  possibleTexts: string[] = ["DALE!", "VAMOS!"];
  canShowText: boolean = false;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: { x: number, y: number, h: number },
    interactivityPosition?: { x: number, y: number, w: number, h: number },
    distanceBetweenFloors: number = 50,
    isEndpoint: boolean = false
  ) {
    super(scene, x, y, z, texture, frame, group, matrixPosition, interactivityPosition);
    this.self.setScale(0.9);
    this.isEndpoint = isEndpoint;
    this.distanceBetweenFloors = distanceBetweenFloors;
    if (isEndpoint) {
      this.type = "ENDPOINT";
      this.self.setOrigin(0.5, 0.7)
    }
    if(texture === "trash") {
      //this.self.setScale(0.5);
      this.self.setOrigin(0.5, 0.6);
    }
    if(texture.includes("deliveryBox")) {
      //this.self.setScale(0.5);
      this.self.setOrigin(0.5, 0.4);
    }

    // if(texture === "dog") {
    //   this.scene.tweens.add({
    //     targets: this.self,
    //     //scaleX: 1.001, 
    //     scaleY: 1.0001,
    //     duration: 1000,
    //     yoyo: true, 
    //     repeat: -1, 
    //     ease: 'Sine.easeInOut',
    //   })
    // };
    // this.scene.add.existing(this.self);
    this.textDisplayed = this.scene.add.text(0,0, "", {
      backgroundColor: 'white',
      color: 'black',
      fontStyle: 'bold',
      padding: {x: 4, y: 4},
      fontSize: 24,
    }).setVisible(false)


  }


  grabFromPosibleTexts () {
    const randomIndex = Math.floor(Math.random() * this.possibleTexts.length)
    this.text = this.possibleTexts[randomIndex]
  }


  breakInteract(){
    if (this.textDisplayed?.text === this.text && this.isWriting === true){
      this.isWriting = false
    }
    if (!this.isWriting) {
      this.textDisplayed?.setVisible(false)
      this.textDisplayed?.setText("")
    }
  }

  interact(){
    if (this.canShowText && !this.isWriting) {
      this.grabFromPosibleTexts()
      this.textBuilder(this.text!, 22)
      this.isWriting = true
    }
  }

  textBuilder(text: string, deltaTime: number = 22) {
    if (this.textDisplayed?.text === ""){
      const letters = text.split("");
      if (this.textDisplayed) {
        this.textDisplayed.setVisible(true)
        this.showText(
          this.textDisplayed,
          letters,
          0,
          deltaTime,
          this.showText,
        );
        const scale = this.scene.cameras.main.zoom
        const CubePoint = GetPointFromWorld(
          this.self.getCenter(),
          this.scene
        );

        // create a rect of 100  pixels in CubePoint
        const rect = new Phaser.Geom.Rectangle(CubePoint.x, CubePoint.y, 100, 100);
        // get random point of rect 
        let _randomPoint =  new Phaser.Geom.Point();
        const randomPoint = Phaser.Geom.Rectangle.Random(rect, _randomPoint);

        this.textDisplayed.setPosition(_randomPoint.x, _randomPoint.y).setScale(scale)
        
      }
    } 
  }

  showText(
    target: Phaser.GameObjects.Text,
    message: string[],
    index: number = 0,
    interval: number,
    callBack: Function,
  ) {
    if (index < message.length) {
      const self = this;
      target.setText(target.text + message[index]);
    
      setTimeout(() => {
        index++;
        callBack.bind(self)(
          target,
          message,
          index,
          interval,
          callBack,
        );
      }, interval);
    } else {
      setTimeout(() => {
        this.isWriting = false
        target.setText("")
        target.setVisible(false)
      }, interval);
    }
  }

  moveCube(player: RpgIsoPlayerPrincipal) {
    if (this.matrixPosition) {
      const distance = player.checkCubeAround(this.matrixPosition);
      
      if (distance && Math.abs(distance.x) + Math.abs(distance.y) /*+ Math.abs(distance.h) */ == 1) {
        
        let newDirection = player?.facingDirection;
        if (distance.x > 0) {
          newDirection = "w";
        } else if (distance.x < 0) {
          newDirection = "e";
        } else if (distance.y > 0) {
          newDirection = "s";
        } else if (distance.y < 0) {
          newDirection = "n";
        }

        const newMatrixPos = { x: this.matrixPosition.x + (distance.x), y: this.matrixPosition.y + (distance.y), h: 0 };
        const nextTileToCube = player?.getObjectAt(newMatrixPos);

        const newMatrixPosTop = { x: this.matrixPosition.x + (distance.x), y: this.matrixPosition.y + (distance.y), h: this.distanceBetweenFloors };
        const nextTileToCubeTop = player?.getObjectAt(newMatrixPosTop);


        if (nextTileToCube && (!nextTileToCubeTop || nextTileToCubeTop.type === "ENDPOINT")) {
          if(this.canShowText) {
            this.interact(); 
          }
          this.scene.tweens.add({
            targets: this.self,
            isoZ: this.isoZ,
            isoX: nextTileToCube.isoX,
            isoY: nextTileToCube.isoY,
            duration: 250,
            yoyo: false,
            repeat: 0,
            onComplete: () => {
              this.matrixPosition = { ...newMatrixPos, h: this.distanceBetweenFloors };
            },
          });
          //if(newDirection) player?.move(newDirection,(distance.x * -1), (distance.y * -1));
        }

        this.scene.time.delayedCall(500, this.scene.handleMinigame.bind(this.scene))
      }
    }
  }
  
}
