import GlobalDataManager from "./scenes/globalData/GlobalDataManager";
import MenuScene from "./scenes/menuScene/MenuScene";

export default class Game {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      parent: 'phaser-example',
    },
    dom:{
      createContainer: true
    },
    fps: {
      smoothStep: true,
      limit: 40
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 400 },
        debug: true,
        debugShowBody: true,
        debugShowStaticBody: true,
        debugShowVelocity: true,
        debugVelocityColor: 0xffff00,
        debugBodyColor: 0x0000ff,
        debugStaticBodyColor: 0xffffff,
      },
    },
  };

  constructor(canvas: HTMLCanvasElement, maps: string[]) {
    const game = new MenuScene();
    const dataManagerGlobalmanager = new GlobalDataManager();
    this.config.canvas = canvas;
    this.config.scene = [game, dataManagerGlobalmanager];
  }

  init() {
    const game = new Phaser.Game(this.config);
    game.scene.start("GameScene");
    this.game = game;
    return game;
  }
}
