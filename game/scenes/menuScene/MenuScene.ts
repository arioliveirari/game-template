import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";

export default class MenuScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  player: Phaser.GameObjects.Rectangle | null = null;
  bot: Phaser.GameObjects.Rectangle | null = null;
  canChange: boolean = true;
  constructor() {
    super({key: "MenuScene"});
  }

  create() {
    console.log("SCENE MENU", this)
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
    this.physics.world.gravity.y = 0;
   

    // add controls to control the player
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if(!this.player) return;
      if(!this.bot) return;
      const distanceX = pointer.x - this.player.x;
      const distanceY = pointer.y - this.player.y;
      const angle = Math.atan2(distanceY, distanceX);
      const speed = 25;
      this.player.x += Math.cos(angle) * speed;
      this.player.y += Math.sin(angle) * speed;
      this.physics.moveToObject(this.bot, this.player, 200);

    });


  }

  testCallback() {
    if(!this.canChange) return
    this.canChange = false;
    this.scene.restart();
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
        this.testCallback()
      }
    }

  }
}
