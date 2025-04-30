import AmbientBackgroundScene from "./scenes/ambientAssets/backgroundScene";
import AmbientFrontgroundScene from "./scenes/ambientAssets/frontgroundScene";
import MainScene from "./scenes/mainScene/MainScene";
import MenuScene from "./scenes/menuScene/MenuScene";

export type PossibleScenesTypes = MainScene | MenuScene | Phaser.Scene | AmbientBackgroundScene | AmbientFrontgroundScene 