import GlobalDataManager from "./scenes/globalData/GlobalDataManager";
import BetweenScenes from "./scenes/loader/BetweenScenes";
import MainScene from "./scenes/mainScene/MainScene";
import MenuScene from "./scenes/menuScene/MenuScene";
import SceneManagerScene from "./scenes/sceneManagerScene/sceneManagerScene";

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
    const menuScene = new MenuScene();
    const sceneManagerScene = new SceneManagerScene();
    const betweenScenes = new BetweenScenes();
    const dataManagerGlobalmanager = new GlobalDataManager();
    this.config.canvas = canvas;
    this.config.scene = [menuScene, sceneManagerScene, dataManagerGlobalmanager, betweenScenes ];
  }

  init() {
    const game = new Phaser.Game(this.config);
    game.scene.start("MenuScene");
    this.game = game;
    return game;
  }
}
