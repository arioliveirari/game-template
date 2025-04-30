import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";

export default class MenuScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  player: Phaser.GameObjects.Rectangle | null = null;
  bot: Phaser.GameObjects.Rectangle | null = null;
  canChange: boolean = true;
  goalTile: Phaser.GameObjects.Rectangle | null = null;
  difficulty: number = 1;
  clickCount: number = 0;

  botSpeed: number = 25;
  playerSpeed: number = 30;

  withSpeedBonus: boolean = false;

  bonusItem: Phaser.GameObjects.Rectangle | null = null;


  constructor() {
    super({key: "MenuScene", active: true});
  }

  create() {
  

    this.canChange = true;
    this.withSpeedBonus = false;

    console.log("SCENE MENU", this)
    // bring scene to top
    this.scene.bringToTop("MenuScene");
    // console all active scenes
    const activeScenes = this.game.scene.getScenes(true);
    console.log("ACTIVE SCENES", activeScenes);

    //background gris
    this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffffff).setOrigin(0, 0).setAlpha(0.3).setVisible(true);

    
    // get random position of the screen
    const randomX = Math.floor(Math.random() * (window.innerWidth - 100)) + 50;
    const randomY = Math.floor(Math.random() * (window.innerHeight - 100)) + 50;

    // get opocite position of the screen
    const oppositeX = window.innerWidth - randomX;
    const oppositeY = window.innerHeight - randomY;


    // set a cube player in the random position 
    this.player = this.add.rectangle(randomX, randomY, 100, 100, 0xff0000).setOrigin(0, 0).setAlpha(1).setVisible(true);

    // set a cube bot in the opposite position
    this.bot = this.add.rectangle(oppositeX, oppositeY, 100, 100, 0x0000ff).setOrigin(0, 0).setAlpha(1).setVisible(true);

    this.physics.add.existing(this.bot);
    // this.physics.world.gravity.y = 0;
    (this.bot.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // add controls to control the player
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if(!this.player) return;
      if(!this.bot) return;
      this.clickCount++;
      const distanceX = pointer.x - this.player.x;
      const distanceY = pointer.y - this.player.y;
      const angle = Math.atan2(distanceY, distanceX);
      const speed = this.withSpeedBonus ? this.playerSpeed * 2 : this.playerSpeed;
      this.player.x += Math.cos(angle) * speed;
      this.player.y += Math.sin(angle) * speed;
      this.physics.moveToObject(this.bot, this.player, this.botSpeed * this.difficulty);
    });

    // add a green rect and use the same position as bot rectangle
    this.goalTile = this.add.rectangle(this.bot.x, this.bot.y, 100, 100, 0x00ff00).setOrigin(0, 0).setAlpha(1).setVisible(true);

    this.physics.add.existing(this.goalTile);
    // make rect world collide with world bounds
    (this.goalTile.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    // (rect.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    // (rect.body as Phaser.Physics.Arcade.Body).setBounce(1, 1);
    

    this.bot.setDepth(9)

    this.drawDificultyAndScore()

    // randomTime between 1s and 3s
    const randomTime = Math.floor(Math.random() * 2000) + 1000;
    this.time.delayedCall(randomTime, () => {
     this.createBonusItem();
    })
  }
  
  createBonusItem() {
    if(!this.player) return;
    const randomX = Math.floor(Math.random() * (window.innerWidth - 100)) + 50;
    const randomY = Math.floor(Math.random() * (window.innerHeight - 100)) + 50;

    // set a cube player in the random position 
    this.bonusItem = this.add.rectangle(randomX, randomY, 50, 50, 0xffff00).setOrigin(0, 0).setAlpha(1).setVisible(true);

    this.physics.add.existing(this.bonusItem);
    // make rect world collide with world bounds
    (this.bonusItem.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    // (rect.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    // (rect.body as Phaser.Physics.Arcade.Body).setBounce(1, 1);
  }


  drawDificultyAndScore() {
    const style = { font: "20px Arial", fill: "#000000", align: "center" };
    const text = this.add.text(10, 10, `Dificulty: ${this.difficulty}`, style);
    text.setOrigin(0, 0);
    text.setDepth(10)

    const style2 = { font: "20px Arial", fill: "#000000", align: "center" };
    const text2 = this.add.text(10, 40, `Score: ${this.clickCount}`, style2);
    text2.setOrigin(0, 0);
    text2.setDepth(10)
    // this.events.on('update', () => {
    //   text.setText(`Dificulty: ${this.difficulty}`);
    //   text2.setText(`Score: ${this.clickCount}`);
    // });
  }

  testCallback(newDifficulty: number = 0) {
    if(!this.canChange) return
    this.canChange = false;
    this.difficulty += newDifficulty;
    this.scene.restart()
    // this.eventCenter.emitEvent(
    //   this.eventCenter.possibleEvents.CHANGE_SCENE,
    //   {
    //     sceneToStart: "MenuScene",
    //     sceneToStop: "MenuScene",
    //     dataToPass: { test: "test" }
    //   }
    // );
  }

  update() {
    // Check if player and bot touch 
    if (this.player && this.bot) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bot.x, this.bot.y);
      if (distance < 100) {
        console.log("TOUCH");
        this.testCallback(-1)
      }
    }

    // Check if player is touching the goal tile and restart the scene with a new level of difficulty
    if (this.player && this.goalTile) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.goalTile.x, this.goalTile.y);
      if (distance < 100) {
        console.log("TOUCH GOAL");
        this.testCallback(1)
      }
    }

    // Check if bonusItem exist and player touch it
    if (this.player && this.bonusItem) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bonusItem.x, this.bonusItem.y);
      if (distance < 100) {
        console.log("TOUCH BONUS ITEM");
        this.withSpeedBonus = true;
        this.bonusItem.destroy();
        this.bonusItem = null;
        this.time.delayedCall(2000, () => {
          this.withSpeedBonus = false;
        })
      }
    }

  }
}
