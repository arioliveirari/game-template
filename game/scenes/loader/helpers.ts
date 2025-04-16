import { PossibleScenesTypes } from "../../GlobalTypes";
import MultiScene from "./MultiScene";

export const changeSceneTo = (scene: PossibleScenesTypes, sceneToStart: string, sceneToStop: string, data: any) => {
    const multiScene = new MultiScene(sceneToStart, sceneToStop, data);
    console.log("ARIELITO", scene.game.scene.getScenes());
    scene.game.scene.getScenes(true)[0].scene.add("MultiScene", multiScene, true);
  }