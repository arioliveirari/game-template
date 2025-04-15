import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import AssetsLoader, { SceneKeys } from "./AssetsLoader";
import EventsCenter from "../../services/eventsServices/EventsCenterService";
import MenuScene from "../menuScene/MenuScene";

export default class MultiScene extends Phaser.Scene {

  scenekey?: string;
  assetLoaderClass?: AssetsLoader;
  sceneData?: any;
  sceneToStop?: string;
  eventCenter = EventsCenter.getInstance();


  constructor(scenekey?: string, sceneToStop?: string, sceneData?: any, loadKey?: string) {
    super({ key: "MultiScene", active: true });
    this.scenekey = scenekey;
    this.sceneToStop = sceneToStop;
    this.sceneData = sceneData;
  }

  preload(data: any) {
    this.load.image("loadingBlock1", "/images/bloque2TEST.png");
    this.load.image("loadingBlock2", "/images/bloque.png");
    this.load.image("loadingBlock3", "/images/street-a.png");
    this.load.image("loadingBlock4", "/images/street-c.png");
    this.load.image("loadingBlock5", "/images/buildingTest/test5.png");
    
    this.assetLoaderClass = new AssetsLoader(this, ["BaseLoad"]);
    this.assetLoaderClass.runPreload(() => {
      if (this.scenekey) {
        this.makeTransition(this.scenekey, this.sceneToStop ?? undefined, this.sceneData ?? undefined);
      } else {
          this.makeTransition("MenuScene", undefined);
      }
    });
  }
  
  makeTransition(sceneName: string, sceneToStop?: string | undefined, data?: any) {
    this.eventCenter.emit(this.eventCenter.possibleEvents.CHANGE_SCENE);
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    if (getBetweenScenesScene) {
      if (getBetweenScenesScene.status != BetweenScenesStatus.IDLE)
        return false;
      getBetweenScenesScene.scene.bringToTop("BetweenScenes")
      getBetweenScenesScene.changeSceneTo(sceneName, sceneToStop, data);
      this.time.delayedCall(1000, () => {
        this.scene.remove("MultiScene");
      });
    } else {
      const defaultScene = new MenuScene();
      this.scene.add("MenuScene", defaultScene, true);
      this.time.delayedCall(1000, () => {
        this.scene.remove("MultiScene");
      });
    }
  }

  update() {
  }
}
