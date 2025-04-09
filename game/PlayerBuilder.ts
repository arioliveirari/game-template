import Phaser from "phaser";
import RPG from "./rpg";


export enum PossibleMovements {
  // LEFT0 = "P-LEFT0",
  LEFT1 = "P-LEFT1",
  LEFT2 = "P-LEFT2",
  // TOP0 = "P-TOP0",
  TOP1 = "P-TOP1",
  TOP2 = "P-TOP2",
  // RIGHT0 = "P-RIGHT0",
  RIGHT1 = "P-RIGHT1",
  RIGHT2 = "P-RIGHT2",
  // BOTTOM0 = "P-BOTTOM0",
  BOTTOM1 = "P-BOTTOM1",
  BOTTOM2 = "P-BOTTOM2",
  LEFT1IDDLE = "P-LEFT1IDDLE",
  RIGHT1IDDLE = "P-RIGHT1IDDLE",
  BOTTOM1IDDLE = "P-BOTTOM1IDDLE",
  TOP1IDDLE = "P-TOP1IDDLE",
}

export enum PlayerParts {
  TORSO = "torso",
  LEFT_HAND = "leftHand",
  RIGHT_HAND = "rightHand",
  HEAD = "head",
  LEGS = "legs",
} ;

export type FramesForMovementsType = {
    [PlayerParts.TORSO]: number[];
    [PlayerParts.LEFT_HAND]: number[];
    [PlayerParts.RIGHT_HAND]: number[];
    [PlayerParts.HEAD]: number[];
    [PlayerParts.LEGS]: number[];
};

export type FramesForMovementsGroupType = {
  [key in PossibleMovements]: FramesForMovementsType;
};

export const FramesForMovements: FramesForMovementsGroupType = {
  [PossibleMovements.LEFT1]: {
    [PlayerParts.TORSO]: [0,1,2,3,4,5,6,7,8,9],
    [PlayerParts.LEFT_HAND]: [0,1,2,3,4,5,6,7,8,9],
    [PlayerParts.RIGHT_HAND]: [0,1,2,3,4,5,6,7,8,9],
    [PlayerParts.HEAD]: [0,1,2,3,4,5,6,7,8,9],
    [PlayerParts.LEGS]: [0,1,2,3,4,5,6,7,8,9],
  },
  [PossibleMovements.LEFT2]: {
    [PlayerParts.TORSO]: [10,11,12,13,14,15,16,17,18,19],
    [PlayerParts.LEFT_HAND]: [10,11,12,13,14,15,16,17,18,19],
    [PlayerParts.RIGHT_HAND]: [10,11,12,13,14,15,16,17,18,19],
    [PlayerParts.HEAD]: [10,11,12,13,14,15,16,17,18,19],
    [PlayerParts.LEGS]: [10,11,12,13,14,15,16,17,18,19],
  },
  [PossibleMovements.BOTTOM1]: {
    [PlayerParts.TORSO]: [20,21,22,23,24,25,26,27,28,29],
    [PlayerParts.LEFT_HAND]: [20,21,22,23,24,25,26,27,28,29],
    [PlayerParts.RIGHT_HAND]: [20,21,22,23,24,25,26,27,28,29],
    [PlayerParts.HEAD]: [20,21,22,23,24,25,26,27,28,29],
    [PlayerParts.LEGS]: [20,21,22,23,24,25,26,27,28,29],
  },
  [PossibleMovements.BOTTOM2]: {
    [PlayerParts.TORSO]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.LEFT_HAND]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.RIGHT_HAND]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.HEAD]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.LEGS]: [30,31,32,33,34,35,36,37,38,39],
  },
  [PossibleMovements.RIGHT1]: {
    [PlayerParts.TORSO]: [40,41,42,43,44,45,46,47,48,49],
    [PlayerParts.LEFT_HAND]: [40,41,42,43,44,45,46,47,48,49],
    [PlayerParts.RIGHT_HAND]: [40,41,42,43,44,45,46,47,48,49],
    [PlayerParts.HEAD]: [40,41,42,43,44,45,46,47,48,49],
    [PlayerParts.LEGS]: [40,41,42,43,44,45,46,47,48,49],
  },
  [PossibleMovements.RIGHT2]: {
    [PlayerParts.TORSO]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.LEFT_HAND]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.RIGHT_HAND]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.HEAD]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.LEGS]: [50,51,52,53,54,55,56,57,58,59],
  },
  [PossibleMovements.TOP1]: {
    [PlayerParts.TORSO]: [60,61,62,63,64,65,66,67,68,69],
    [PlayerParts.LEFT_HAND]: [60,61,62,63,64,65,66,67,68,69],
    [PlayerParts.RIGHT_HAND]: [60,61,62,63,64,65,66,67,68,69],
    [PlayerParts.HEAD]: [60,61,62,63,64,65,66,67,68,69],
    [PlayerParts.LEGS]: [60,61,62,63,64,65,66,67,68,69],
  },
  [PossibleMovements.TOP2]: {
    [PlayerParts.TORSO]: [70,71,72,73,74,75,76,77,78,79],
    [PlayerParts.LEFT_HAND]: [70,71,72,73,74,75,76,77,78,79],
    [PlayerParts.RIGHT_HAND]: [70,71,72,73,74,75,76,77,78,79],
    [PlayerParts.HEAD]: [70,71,72,73,74,75,76,77,78,79],
    [PlayerParts.LEGS]: [70,71,72,73,74,75,76,77,78,79],
  },
  [PossibleMovements.LEFT1IDDLE]: {
    [PlayerParts.TORSO]: [9],
    [PlayerParts.LEFT_HAND]: [9],
    [PlayerParts.RIGHT_HAND]: [9],
    [PlayerParts.HEAD]: [9],
    [PlayerParts.LEGS]: [9],

  },
  [PossibleMovements.RIGHT1IDDLE]: {
    [PlayerParts.TORSO]: [49],
    [PlayerParts.LEFT_HAND]: [49],
    [PlayerParts.RIGHT_HAND]: [49],
    [PlayerParts.HEAD]: [49],
    [PlayerParts.LEGS]: [49],
    
  },
  [PossibleMovements.BOTTOM1IDDLE]: {
    [PlayerParts.TORSO]: [29],
    [PlayerParts.LEFT_HAND]: [29],
    [PlayerParts.RIGHT_HAND]: [29],
    [PlayerParts.HEAD]: [29],
    [PlayerParts.LEGS]: [29],
  },
  [PossibleMovements.TOP1IDDLE]: {
    [PlayerParts.TORSO]: [69],
    [PlayerParts.LEFT_HAND]: [69],
    [PlayerParts.RIGHT_HAND]: [69],
    [PlayerParts.HEAD]: [69],
    [PlayerParts.LEGS]: [69],
  },
 
}

export class PlayerBuilder {
  // this is a class to consolidate different player parts and create a player
  private torsoSelected = "01";
  private headSelected = "01";
  private legsSelected = "01";
  private torso: Phaser.GameObjects.Sprite;
  private leftHand: Phaser.GameObjects.Sprite;
  private rightHand: Phaser.GameObjects.Sprite;
  private head: Phaser.GameObjects.Sprite;
  private legs: Phaser.GameObjects.Sprite;
  private container: Phaser.GameObjects.Container;
  private scene: RPG;

  constructor(scene: RPG) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    // this.scene.UIContainer?.avatar?.setHead(this.headSelected);
    //DAVID PLAYER RANDOM
    /*
    const options = ["01","02"];
    const randomBetween01 = () => options[Math.floor(Math.random() * options.length)];
    

    this.torsoSelected = randomBetween01();
    this.headSelected = randomBetween01();
    this.legsSelected = randomBetween01();
    */
    
    const { torso, leftHand, rightHand, head, legs } = this.buildPlayer(this.torsoSelected, this.torsoSelected, this.torsoSelected, this.headSelected, this.legsSelected);
    
    
    this.torso = torso;
    this.leftHand = leftHand;
    this.rightHand = rightHand;
    this.head = head;
    this.legs = legs;


    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];
    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.on("animationstart", ({key}: Phaser.Animations.Animation, {textureKey}: Phaser.Animations.AnimationFrame) => {
        const possibleMovement = Object.values(PossibleMovements).find(v => v ==`P-${key.split("-")[1]}`) ?? PossibleMovements.LEFT1;
        const version = textureKey.split("-")[1];
        const part = Object.values(PlayerParts).find(v => v ==`${textureKey.split("-")[0]}`) ?? PlayerParts.TORSO;
        this.orderSpritesForMovement(possibleMovement, part, version);
      })
    }

    // this.buildPlayer = this.buildPlayer.bind(this);
    // this.selectMovement(PossibleMovements.LEFT1);
  }
  getHeadSelected() {
    return this.headSelected || "01";
  }
  getPlayerParts() {
    return {
      torso: this.torso,
      leftHand: this.leftHand,
      rightHand: this.rightHand,
      head: this.head,
      legs: this.legs,
    };
  }

  buildContainer({ torso, leftHand, rightHand, head, legs }: { torso: Phaser.GameObjects.Sprite; leftHand: Phaser.GameObjects.Sprite; rightHand: Phaser.GameObjects.Sprite; head: Phaser.GameObjects.Sprite; legs: Phaser.GameObjects.Sprite; }) {
    this.stopAllAnimations();
    this.container.removeAll();

    this.container.add([
      this.rightHand,
      this.legs,
      this.torso,
      this.leftHand,
      this.head,
    ])
  }

  getSelectionFromPart(playerPart: PlayerParts){
    switch (playerPart) {
      case PlayerParts.TORSO:
        return this.torsoSelected;
      case PlayerParts.LEFT_HAND:
        return this.torsoSelected;
      case PlayerParts.RIGHT_HAND:
        return this.torsoSelected;
      case PlayerParts.HEAD:
        return this.headSelected;
      case PlayerParts.LEGS:
        return this.legsSelected;
    }
  }

  buildAnimations(animations: PlayerParts[]) {
    for (let animation of animations) {
      const animationParts = Object.keys(FramesForMovements) as unknown as PossibleMovements[]
      for (let animationPart of animationParts) {
        const frames: FramesForMovementsType = FramesForMovements[animationPart];
        let _animation: string = animation
        if (_animation == "torso") _animation = "torso_t";
        if (_animation == "leftHand") _animation = "torso_a";
        if (_animation == "rightHand") _animation = "torso_b";
        this.scene.anims.remove(`${animationPart}-${animation}`)
        this.scene.anims.create({
          key: `${animationPart}-${animation}`,
          duration: 300, // playerSpeed
          frames: this.scene.anims.generateFrameNumbers(
            `${_animation}-${this.getSelectionFromPart(animation)}`,
            { frames: frames[animation] }
          ),
          // frameRate: 24, //estaba en 20
          // repeat: -1,

        });
     
      }
    }
   
  }


  buildPlayer(leftHandSelected: string = "01", torsoSelected: string = "01", rightHandSelected: string = "01", headSelected: string = "01", legsSelected: string = "01") {
    const obj = {
      legs: this.selectLegs(legsSelected),
      torso: this.selectTorso(torsoSelected),
      leftHand: this.selectLeftHand(leftHandSelected),
      rightHand: this.selectRightHand(rightHandSelected),
      head: this.selectHead(headSelected),
    };

    this.torso = obj.torso;
    this.leftHand = obj.leftHand;
    this.rightHand = obj.rightHand;
    this.head = obj.head;
    this.legs = obj.legs;

    this.buildContainer(this.getPlayerParts());

    return obj;


  }

  selectLeftHand(leftHandSelected: string) {
    if (this.leftHand) this.leftHand.destroy();
    this.torsoSelected = leftHandSelected;
    const leftHand = this.scene.add
      .sprite(0, 0, "torso_a-" + this.torsoSelected, 0)
      .setOrigin(0.5);
    this.leftHand = leftHand;
    this.buildAnimations([PlayerParts.LEFT_HAND]);
    return leftHand;
  }

  selectTorso(torsoSelected: string) {
    if (this.torso) this.torso.destroy();
    this.torsoSelected = torsoSelected;
    const torso = this.scene.add
      .sprite(0, 0, "torso_t-" + this.torsoSelected, 0)
      // .setScale(1.4)
      .setOrigin(0.5);

    this.torso = torso;
    this.buildAnimations([PlayerParts.TORSO]);
    this.buildAnimations([PlayerParts.LEFT_HAND]);
    this.buildAnimations([PlayerParts.RIGHT_HAND]);
    return torso;
  }

  selectRightHand(rightHandSelected: string) {
    if (this.rightHand) this.rightHand.destroy();
    this.torsoSelected = rightHandSelected;
    const rightHand = this.scene.add
      .sprite(0, 0, "torso_b-" + this.torsoSelected, 0)
      // .setScale(1.4)
      .setOrigin(0.5);
    this.rightHand = rightHand;
    this.buildAnimations([PlayerParts.RIGHT_HAND]);
    return rightHand;
  }

  selectHead(headSelected: string) {
    if (this.head) this.head.destroy(true);
    this.headSelected = headSelected;
    const head = this.scene.add
      .sprite(0, 0, "head-" + this.headSelected, 0)
      // .setScale(1.4)
      .setOrigin(0.5);
    this.head = head;
    this.buildAnimations([PlayerParts.HEAD]);
    return head;
  }

  selectLegs(legsSelected: string) {
    if (this.legs) this.legs.destroy();
    this.legsSelected = legsSelected;
    const legs = this.scene.add
      .sprite(0, 0, "legs-" + this.legsSelected, 0)
      // .setScale(1.4)
      .setOrigin(0.5);

    this.legs = legs;
    this.buildAnimations([PlayerParts.LEGS]);
    return legs;
  }


  getContainer() {
    return this.container;
  }

  getPartByKeyname(key: string) {
    switch (key) {
      case "torso":
        return this.torso;
      case "leftHand":
        return this.leftHand;
      case "rightHand":
        return this.rightHand;
      case "head":
        return this.head;
      case "legs":
        return this.legs;
        default:
        return new Phaser.GameObjects.Sprite(this.scene, 0, 0, "", 0);
    }
  }

  chainMovement(possibleMovements: PossibleMovements[]){
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];
    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.anims.pause();
      
      p.play(`${possibleMovements[0]}-${part}`, false);
      p.chain(possibleMovements.filter((v,index) => index > 0).map(v => `${v}-${part}`)); 
    }
  }

  selectMovement(possibleMovement: PossibleMovements) {
    // all PlayerParts enum values in an array
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];

    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.play(`${possibleMovement}-${part}`);
    }
  }

  orderSpritesForMovement(possibleMovement: PossibleMovements, part: PlayerParts, version: string) {
   // TODO: Se puede modificar los sprites separados antes de arrancar la animacion si es deseable
  }

  stopAllAnimations() {
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];
    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.anims.pause();
    }
  }


  applySkis(jsonValues: any) {
    this.torsoSelected = jsonValues.torso;
    this.headSelected = jsonValues.head;
    this.legsSelected = jsonValues.legs;
    this.torso = this.selectTorso(this.torsoSelected);
    this.head = this.selectHead(this.headSelected);
    this.legs = this.selectLegs(this.legsSelected);
    this.buildContainer(this.getPlayerParts());
  }

  getJsonValues() {
    return {
      torso: this.torsoSelected,
      head: this.headSelected,
      legs: this.legsSelected,
    }
  }
}
