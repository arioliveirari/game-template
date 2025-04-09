import { GameObjects, Scene } from "phaser";
//@ts-ignore
import IsoPlugin, { IsoPhysics } from "phaser3-plugin-isometric";
import MapManager from "@/game/mapManager";
import { ConfObjectType } from "./types";
import { RpgIsoSpriteBox } from "./Assets/rpgIsoSpriteBox";
import {
  RpgIsoPlayerPrincipal,
  TouchCursorsType,
} from "./Assets/rpgIsoPlayerPrincipal";
import { RpgIsoPlayerSecundarioTalker } from "./Assets/rpgIsoPlayerSecundarioTalker";
import UIContainer from "./Assets/UIAssetsChicken/UIContainer";
import { PinIsoSpriteBox } from "./Assets/pinIsoSpriteBox";
import { globalState, playerConfig } from "./GlobalDataManager";
import {
  changeSceneTo,
  getObjectByType,
  makeOpacityNearPlayer,
} from "./helpers/helpers";
import Room from "./maps/Room";
import TileCreator from "./helpers/TileCreator";

import City from "./maps/City";
import Beach from "./maps/Beach";
import Entrepreneurship from "./maps/Entrepreneurship";
import TestCity from "./maps/TestCity";

import AmbientBackgroundScene from "./ambientAssets/backgroundScene";
import EventsCenterManager from "./services/EventsCenter";
import { ModalManager } from "./Assets/Modals/ModalManager";
import {
  configMiniGameScene,
  missionsType,
  modalType,
} from "./Assets/Modals/ModalTypes";
import TabletScene from "./TabletScene";

import rexUI from "phaser3-rex-plugins/templates/ui/ui-plugin";
import Office from "./maps/Office";
import RoomTest from "./maps/RoomTest";
import { CoffeMiniGame } from "./miniGames/coffeMachine";
import { FocusCameraMiniGame } from "./miniGames/focusCamera";
import { CleanTableMiniGameScene } from "./miniGames/cleanTable";
import { PossibleCity } from "./helpers/models";
import { TraderIsoSpriteBox } from "./Assets/traderIsoSpriteBox";
import { PopUpManager } from "./Assets/Modals/PopUpManager";
import LocalStorageService from "./services/LocalStorageService";
import { CoffeMinigameSpriteBox } from "./Assets/coffeMinigameSpriteBox";
import { BusIsoSpriteBox } from "./Assets/busIsoSpriteBox";
import ApiConsumerSingleton from "./services/apiConsume";
import { StatusBarForItem } from "./Assets/statusBarForItem";
import ToolTips, { GetPointFromWorld } from "./services/ToolTips";
import { TraderCoffeIsoSpriteBox } from "./Assets/traderCoffeIsoSpriteBox";
import { Dreams, DreamType } from "./services/Dreams";
import { GameSelection, GameSelectionItemType } from "./services/GameSelection";
import { Compass } from "./services/Compass";
import { Cronometer, CronometerObject } from "./services/Cronometer";
import { findObjectIsoSpriteBox } from "./Assets/findObjectIsoSpriteBox";
import { BetaForm } from "./services/BetaForm";
import { CaptchaDataGame, CaptchaMiniGameScene } from "./miniGames/captcha";

export type IsoSceneType = {
  isoPhysics: any;
};
export type SceneWithIsoType = Scene & IsoSceneType;

export enum statusEnum {
  STOPPED,
  RUNNING,
  LOSING,
  IDLE,
  WINNING,
}
export default class RPG extends Scene {
  touchDetected: boolean = false;
  touchDetectionTimer?: Phaser.Time.TimerEvent;
  tileCreator: TileCreator;
  modalManager: ModalManager;
  popUpManager: PopUpManager;

  mapType: PossibleCity = "ROOM";
  map?: Room | City;
  mapBlueprint?: any[];
  UIContainer?: UIContainer;

  withPlayer: Boolean;
  cameraTunnel?: Phaser.GameObjects.Arc;

  mapsBuilded: any[] = []; // q vergis es esto?

  isoPhysics: IsoPhysics;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  isoGroup?: Phaser.GameObjects.Group;
  minigameIsoGroup?: Phaser.GameObjects.Group;
  sceneKey: string;
  forest: Array<RpgIsoSpriteBox> = [];
  player?: RpgIsoPlayerPrincipal;
  NPCTalker?: RpgIsoPlayerSecundarioTalker;
  UICamera?: Phaser.Cameras.Scene2D.Camera;
  group?: Phaser.GameObjects.Group;
  distanceBetweenFloors: number = 50;
  eventEmitter?: Phaser.Events.EventEmitter;
  tabletScene?: TabletScene;
  tabletNoInteractiveMesh?: Phaser.GameObjects.Rectangle;
  zoomEnabled: boolean = true;

  eventCenter = EventsCenterManager.getInstance();
  localStorageCenter = LocalStorageService.getInstance();
  stateGlobal: globalState;
  tooltipHelper: ToolTips;
  // input: any;
  currentPin?: PinIsoSpriteBox;

  ambientScenes: Phaser.Scene[] = [];
  CoffeMiniGameScene?: CoffeMiniGame;
  CoffeCounter: number = 0;
  BlurMiniGameScene?: FocusCameraMiniGame;
  CleanTableMiniGameScene?: CleanTableMiniGameScene;
  CaptchaMiniGameScene?: CaptchaMiniGameScene;
  dreamInstance: Dreams;
  compass?: Compass;
  cronometerInstance?: Cronometer;
  touchGraphics?: Phaser.GameObjects.Graphics;
  originalTouchX: number = 0;
  originalTouchY: number = 0;
  willListenTouch: boolean = true;
  listenTouchDirectionX: number = 0;
  listenTouchDirectionY: number = 0;
  touchCursors: TouchCursorsType = {
    right: { isDown: false, isUp: false },
    left: { isDown: false, isUp: false },
    up: { isDown: false, isUp: false },
    down: { isDown: false, isUp: false },
  };

  constructor(mapType: PossibleCity) {
    const sceneConfig = {
      key: "RPG",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics", rexUI: "rexUI" },
    };

    super(sceneConfig);

    this.mapType = mapType;
    this.sceneKey = sceneConfig.key;
    this.withPlayer = true;

    this.eventCenter.emitEvent(
      this.eventCenter.possibleEvents.PLAY_MUSIC,
      "loopMusicTest"
    );

    this.stateGlobal = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.UPDATE_STATE,
      null
    );

    switch (this.mapType) {
      case "ENTREPRENEURSHIP":
        this.map = new Entrepreneurship(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
      case "ROOM":
        this.map = new Room(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
      case "ROOMTEST":
        this.map = new RoomTest(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
      case "CITY":
        this.map = new City(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
      case "BEACH":
        this.map = new Beach(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
      case "OFFICE":
        this.map = new Office(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
      default:
        this.map = new Room(this);
        this.mapBlueprint = this.map.map.map((m) =>
          typeof m === "string" ? m : JSON.stringify(m)
        );
        break;
    }

    this.tileCreator = new TileCreator(this);
    this.modalManager = new ModalManager(this);
    this.popUpManager = new PopUpManager(this);
    this.tooltipHelper = new ToolTips(this);

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.SELECT_WIZARD,
      () => {
        this.selectWizard();
      },
      this
    );

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.UPDATE_STATE,
      () => {
        this.stateGlobal = this.eventCenter.emitWithResponse(
          this.eventCenter.possibleEvents.GET_STATE,
          null
        );
        this.UIContainer?.updateData(this.stateGlobal);
        if (!(this.mapType === "ENTREPRENEURSHIP"))
          this.map?.addMapFunctionalities(this.stateGlobal);
        if (this.stateGlobal.wizzardModule.getState().isActive) {
          this.player?.wizzard?.playCompanion(this, this.player, this.mapType);
          if (this.player?.wizzard?.sprite)
            this.UICamera?.ignore(this.player.wizzard?.sprite);
        }
      },
      this
    );
    // <- UPDATER EVENT

    // -> MODAL EVENTS
    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.OPEN_MODAL,
      (data: {
        modalType: modalType;
        pin?: PinIsoSpriteBox;
        mission: missionsType;
        type?: string;
      }) => {
        this.modalManager.createModal(data);
        if (data.pin) this.currentPin = data.pin;
        if (this.stateGlobal.wizzardModule.getState().isActive) {
          //@ts-ignore
          this.player?.wizzard?.sprite?.startFollow(this.currentPin);
        }
      },
      this
    );
    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.CLOSE_MODAL,
      () => {
        this.modalManager.destroyModal();
        if (this.stateGlobal.wizzardModule.getState().isActive) {
          this.player?.wizzard?.playCompanion(this, this.player, this.mapType);
          if (this.player?.wizzard?.sprite)
            this.UICamera?.ignore(this.player.wizzard?.sprite);
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.LEAVE_CITY,
      () => {
        if (this.cronometerInstance) {
          this.cronometerInstance.cronometers.forEach((cronometer) => {
            this.eventCenter.emitEvent(
              this.eventCenter.possibleEvents.FAIL_MISSION,
              cronometer.mission
            );
          });
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.FAIL_MISSION,
      (data: missionsType) => {
        this.stateGlobal.missionModule.failMissionInProgress(data.id);
      },
      this
    );
    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.OPEN_MISSION_BOX,
      (data: missionsType) => {
        if (data) this.popUpManager.createModal(data);
        if (data.takesPlaceOn.includes(this.mapType)) {
          if (!data.startedTime && data.cronometer) {
            data.startedTime = new Date().getTime();
            const failMission = (
              mission: missionsType,
              cronometer: CronometerObject
            ) => {
              if (!this.cronometerInstance) return;
              const cr = this.cronometerInstance.getByMissionId(mission.id);
              if (cr) {
                cr.removeCronometer();
                this.time.delayedCall(300, () => {
                  this.eventCenter.emitEvent(
                    this.eventCenter.possibleEvents.LEAVE_CITY,
                    undefined
                  );
                  changeSceneTo(this, "RPG", "RPG", this.mapType);
                });
              }
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.FAIL_MISSION,
                data
              );
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.CLOSE_MISSION_BOX,
                data
              );
              if (this.compass) this.compass.removeCompass();
            };
            if (this.cronometerInstance) {
              this.cronometerInstance.create(data, failMission);
            }
          }
        }
      },
      this
    );



    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.CLOSE_MISSION_BOX,
      (mission: missionsType) => {
        if (this.popUpManager.activeBoxes && mission) {
          this.popUpManager.destroyModal(mission);
        }
        if (!this.cronometerInstance) return;
        const cr = this.cronometerInstance.getByMissionId(mission.id);
        if (cr) cr.removeCronometer();
      },
      this
    );

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.OPEN_MODAL_FORM,
      (data: { modalType: modalType; mission: missionsType }) => {
        this.modalManager.createModal(data);
      },
      this
    );
    // <- MODAL

    // -> SLEEP EVENTS
    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.TRY_SLEEP,
      () => {
        let can = false;
        const moment = this.stateGlobal.timeOfDay;
        const hoursOfDay = this.stateGlobal.inversionModule.isActive ? 8 : 4;
        if (hoursOfDay == 4) {
          can = moment > 1;
        } else if (hoursOfDay == 8) {
          can = moment > 2;
        }
        let dontRead = false;
        if(this.stateGlobal.selectedNews === undefined || this.stateGlobal.selectedNews.readed === false) {
          dontRead = true;
        }
        if (can && !dontRead) {
          (this.map as Room).sleeping = true;
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.SLEEP,
            null
          );
        }else if (dontRead){
          const fContainer = (this.map as Room).frontContainer;
          if (!fContainer) {
            this.player!.setCanMove(true);
            return;
          }
          const fPoint = new Phaser.Geom.Point(fContainer!.x, fContainer!.y);

          const cameraFPoint = GetPointFromWorld(fPoint, this);

          const newsPeaper = (this.map as Room).interactiveNewsPaper;
          if (newsPeaper) {
            let newsMask = new Phaser.Geom.Circle(
              cameraFPoint.x + newsPeaper!.x,
              cameraFPoint.y - newsPeaper!.y,
              150
            );
            this.tweens.add({
              targets: this.cameras.main,
              zoom: 1,
              duration: 500,
              ease: "Linear",
            });
            this.time.delayedCall(
              550,
              () => {
                this.tooltipHelper.openToolTip(
                  "D10",
                  "No dejes pasar oportunidades! Lee el diario antes de dormir!",
                  newsMask!,
                  () => { },
                  true,
                  undefined,
                  false,
                  true,
                  this.getWizzard(),
                  true
                );
              },
              [],
              this
            );
          }

        } else {
          (this.map as Room).sleeping = false;

          const fContainer = (this.map as Room).frontContainer;
          if (!fContainer) {
            this.player!.setCanMove(true);
            return;
          }
          const fPoint = new Phaser.Geom.Point(fContainer!.x, fContainer!.y);

          const cameraFPoint = GetPointFromWorld(fPoint, this);

          const door = (this.map as Room).interactiveDoor;
          if (door) {
            let doorMask = new Phaser.Geom.Circle(
              cameraFPoint.x + door!.x,
              cameraFPoint.y - door!.y,
              150
            );
            this.tweens.add({
              targets: this.cameras.main,
              zoom: 1,
              duration: 500,
              ease: "Linear",
            });
            this.time.delayedCall(
              550,
              () => {
                this.tooltipHelper.openToolTip(
                  "D9",
                  "Intenta no dormir tan seguido! Vas a perder muchas oportunidades!",
                  doorMask!,
                  () => { },
                  true,
                  undefined,
                  false,
                  true,
                  this.getWizzard(),
                  true
                );
              },
              [],
              this
            );
          }
        }
      },
      this
    );

    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.SLEEP,
      () => {
        this.dreamInstance.createDream(this, this.dreamFunctionCallback);
        if (this.dreamInstance) {
          this.tweens.add({
            targets: this.UIContainer?.blackScreen,
            alpha: 1,
            duration: 400,
            ease: "ease",
            repeat: 0,
            onComplete: () => {
              this.dreamInstance.playDream();
            },
            hold: 800,
            delay: 500,
          });
        } else {
          this.tweens.add({
            targets: this.UIContainer?.blackScreen,
            alpha: 1,
            duration: 400,
            ease: "ease",
            repeat: 0,
            onComplete: () => {
              this.UIContainer?.blackScreen.setAlpha(0);
              (this.map as Room).sleeping = false;
            },
            yoyo: true,
            hold: 800,
            delay: 500,
          });
        }
        const progress = localStorage.getItem("globalStateChambix");
        ApiConsumerSingleton.saveUser(progress);
      },
      this
    );
    // <- SLEEP

    // -> DRAW MINIGAME
    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
      (show: boolean) => {
        getObjectByType(this, "PIN")?.forEach(
          (_pin: GameObjects.GameObject) => {
            const pin = _pin as unknown as PinIsoSpriteBox;
            if (this.isoGroup) {
              if (show) {
                pin.self.setVisible(true);
                pin.startTween();
              } else {
                pin.self.setVisible(false);
                pin.stopTween();
              }
            }
          }
        );
      },
      this
    );
    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.START_MINIGAME,
      (mission: missionsType) => {
        if (mission.configMinigameId) {
          const miniGameConfig = this.stateGlobal.configMinigames.find(
            (minigame) => minigame.id === mission.configMinigameId
          );

          if (!miniGameConfig) return;
          const { itemsId } = miniGameConfig;
          const typeMinigame = miniGameConfig?.type;

          switch (typeMinigame) {
            case "COMPLETE_FORM":
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.OPEN_MODAL_FORM,
                { modalType: modalType.FORM, mission }
              );
              break;
            case "PUSH_OBJECT":
              if (mission.draw) return;
              if (!mission.takesPlaceOn?.includes(this.mapType)) return;
              this.map?.drawMinigame(mission);
              this.time.delayedCall(1000, () => {
                this.mapBlueprint = this.map?.map.map((m) =>
                  typeof m === "string" ? m : JSON.stringify(m)
                );
                //@ts-ignore
                this.spawnTiles(this.mapBlueprint?.length - 1, 1);
                this.checkCompassForMiniGame();
                //@ts-ignore
                this.UICamera?.ignore(this.isoGroup);
              });

              break;
            case "FIND_OBJECT":
              if (mission.draw) return;
              if (!mission.takesPlaceOn?.includes(this.mapType)) return;
              this.map?.drawMinigame(mission);
              this.time.delayedCall(1000, () => {
                this.mapBlueprint = this.map?.map.map((m) =>
                  typeof m === "string" ? m : JSON.stringify(m)
                );
                //@ts-ignore
                this.spawnTiles(this.mapBlueprint?.length - 1, 1);
                this.checkCompassForMiniGame();
                //@ts-ignore
                this.UICamera?.ignore(this.isoGroup);
              });
              break;

            case "MINIGAME_SCENE":
              this.stateGlobal.minigamesScene.find(
                (minigameScene: configMiniGameScene) => {
                  if (itemsId && minigameScene.id === itemsId[0]) {
                    this.stateGlobal.rewards.find((reward) => {
                      if (reward.id === mission.rewardId) {
                        let trys = 3;
                        let goods = 0;
                        let limit = 3;
                        const lose = () => {
                          trys--;
                          checkIfWinLose();
                        };
                        const win = () => {
                          goods++;
                          checkIfWinLose();
                        };
                        const checkIfWinLose = () => {
                          if (goods === limit || trys === 0) {
                            this.eventCenter.emitEvent(
                              this.eventCenter.possibleEvents.FINISH_MODAL,
                              {
                                modalType: modalType.FINISH,
                                mission: mission,
                                responses: goods,
                                maxQuestions: trys + goods,
                                callback: () => {
                                  this.eventCenter.emit(
                                    this.eventCenter.possibleEvents
                                      .FINISH_MISSION,
                                    mission.id,
                                    goods,
                                    trys + goods
                                  );
                                },
                              }
                            );

                            closeMiniameScene();
                          }
                        };

                        const closeMiniameScene = () => {
                          this.scene.stop(minigameScene.miniGameName);
                          this.scene.sendToBack(minigameScene.miniGameName);
                        };

                        let data = {};
                        if (
                          minigameScene.miniGameName == "CaptchaMiniGameScene"
                        ) {
                          let _minigameSceneData =
                            minigameScene as unknown as CaptchaDataGame;
                          data = {
                            description: _minigameSceneData.description,
                            size: _minigameSceneData.size,
                            images: _minigameSceneData.images,
                          };
                        }
                        this.scene.launch(minigameScene.miniGameName, {
                          win: win.bind(this),
                          lose: lose.bind(this),
                          withClose: false,
                          data,
                        });
                        this.scene.bringToTop(minigameScene.miniGameName);
                      }
                    });
                  }
                }
              );

              break;
          }
        }
      },
      this
    );
    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.FINISH_MISSION,
      () => {
        if (this.currentPin) this.currentPin.self.destroy();
      },
      this
    );
    // <- DRAW MINIGAME

    // -> TABLET
    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.OPEN_TABLET_MENU,
      () => {
        this.tabletNoInteractiveMesh?.setVisible(true);
      },
      this
    );

    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.CLOSE_TABLET_MENU,
      () => {
        this.tabletNoInteractiveMesh?.setVisible(false);
      },
      this
    );

    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.UPDATE_COFFE_COUNTER,
      (payload: number) => {
        if(payload === -1) this.CoffeCounter = 0;
        else this.CoffeCounter+= payload;
      },
      this
    );
    //hace un evento que me devuelva el valor de  CoffeCounter
    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.GET_COFFE_COUNTER,
      () => {
        return this.CoffeCounter;
      },
      this
    );


    EventsCenterManager.turnEventOn(
      "RPG",
      EventsCenterManager.possibleEvents.FINISH_MODAL,
      (data: {
        modalType: modalType;
        mission: missionsType;
        responses: number;
        maxQuestions: number;
        callback: Function;
      }) => {
        this.modalManager.createModal(data);
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.CLOSE_MISSION_BOX,
          data.mission
        );
      },
      this
    );
    // <- TABLET

    // <- CREATE EVENTS
    this.dreamInstance = new Dreams();
    this.cronometerInstance = new Cronometer(this);
  }

  checkCompassForMiniGame() {
    const objectsCube = getObjectByType(this, "CUBE") || [];
    const objectsChicken = getObjectByType(this, "CHICKEN") || [];
    if (objectsCube.length == 0 && objectsChicken.length == 0) {
      if (this.compass) this.compass.removeCompass();
    } else if (objectsCube.length > 0 || objectsChicken.length > 0) {
      if (this.compass) this.compass.removeCompass();
      this.compass = new Compass();
      this.compass.createCompass(this, () => {
        const objectsCube = getObjectByType(this, "CUBE") || [];
        const objectsChicken = getObjectByType(this, "CHICKEN") || [];
        const firstObject = objectsCube[0] || objectsChicken[0];
        if (firstObject) {
          return GetPointFromWorld(
            (firstObject as unknown as RpgIsoSpriteBox).self.getCenter(),
            this
          );
        }
        return {
          x: 0,
          y: 0,
        };
      });
    }
  }

  preload() {
    let tabletSceneActive = this.game.scene.getScene("TabletScene");
    if (!tabletSceneActive) {
      this.tabletScene = new TabletScene(0, 0);
      this.scene.add("TabletScene", this.tabletScene, true);
    } else {
      this.tabletScene = tabletSceneActive as TabletScene;
    }

    let AmbientBackScene = this.game.scene.getScene("AmbientBackgroundScene");
    if (!AmbientBackScene) {
      AmbientBackScene = new AmbientBackgroundScene("DayAndNight");
      this.scene.add("AmbientBackgroundScene", AmbientBackScene, true);
      AmbientBackScene.scene.sendToBack("AmbientBackgroundScene");
    } else {
      this.eventCenter.turnOffAllEventsByScene("AmbientBackgroundScene");
      AmbientBackScene.scene.restart({ sceneKey: "DayAndNight" });
    }

    let minigames = [
      {
        key: "CoffeMiniGameScene",
        sceneName: CoffeMiniGame,
        assign: this.CoffeMiniGameScene,
      },
      {
        key: "FocusMiniGameScene",
        sceneName: FocusCameraMiniGame,
        assign: this.BlurMiniGameScene,
      },
      {
        key: "CleanTableMiniGameScene",
        sceneName: CleanTableMiniGameScene,
        assign: this.CleanTableMiniGameScene,
      },
      {
        key: "CaptchaMiniGameScene",
        sceneName: CaptchaMiniGameScene,
        assign: this.CaptchaMiniGameScene,
      },
    ];

    minigames.forEach((_minigame) => {
      let miniGame = this.game.scene.getScene(_minigame.key);
      if (!miniGame) {
        // check if scene already exist or not
        if (this.scene.get(_minigame.key)) return;
        miniGame = new _minigame.sceneName();
        this.scene.add(_minigame.key, miniGame, false);
        this.scene.pause(_minigame.key);
        this.scene.sendToBack(_minigame.key);
        _minigame.assign = miniGame as any;
      } else {
        _minigame.assign = miniGame as any;
      }
    });

    this.load.scenePlugin({
      key: "IsoPlugin",
      url: IsoPlugin,
      sceneKey: "iso",
    });

    this.load.scenePlugin({
      key: "IsoPhysics",
      url: IsoPhysics,
      sceneKey: "isoPhysics",
    });

    this.load.scenePlugin({
      key: "rexUI",
      url: rexUI,
      sceneKey: "rexUI",
    });
  }
  getWizzard() {
    try {
      const wState = this.stateGlobal.wizzardModule.getState();
      return wState.isActive ? wState.texture : undefined;
    } catch (e) {
      return undefined;
    }
  }

  selectWizard(callback?: Function) {
    const selectionfactory = new GameSelection();
    const selected = (item: GameSelectionItemType) => {
      this.tweens.add({
        targets: this.UIContainer?.blackScreen,
        alpha: 0,
        duration: 400,
        ease: "ease",
        repeat: 0,
        onComplete: () => {
          this.UIContainer?.blackScreen.setAlpha(0);
          (this.map as Room).sleeping = false;
          const stateGlobal: globalState = this.eventCenter.emitWithResponse(
            this.eventCenter.possibleEvents.GET_STATE,
            null
          );
          stateGlobal.wizzardModule.setActive(
            !stateGlobal.wizzardModule.getState().isActive
          );

          this.player?.wizzard?.playCompanion(this, this.player, this.mapType);
          if (this.player?.wizzard?.sprite)
            this.UICamera?.ignore(this.player.wizzard?.sprite);

          if (callback) callback();
        },
        hold: 800,
        delay: 500,
      });
    };

    const showWizardAfter =
      !this.stateGlobal.wizzardModule?.getState().isActive;
    const selection = selectionfactory.createSelection(
      this,
      [
        {
          id: "1",
          image: "wizard_selection_01",
          title: "Xoxo 1",
          description: "Dream 1", // not in use
          background: "wizard_selection_background",
          ignoreColorFilter: true,
          // customScale: 1,
        },
        {
          id: "2",
          image: "wizard_selection_02",
          title: "",
          description: "Dream 2", // not in use
          background: "wizard_selection_background",
          ignoreColorFilter: true,
          disabled: true,
          // customScale: 1,
        },
        {
          id: "3",
          image: "wizard_selection_03",
          title: "",
          description: "Dream 3", // not in use
          background: "wizard_selection_background",
          ignoreColorFilter: false,
          disabled: true,
          // customScale: 1,
        },
      ],
      selected,
      {
        baseBackground: "wizard_selection_background",
        baseOverlay: "wizard_selection_overlay",
      }
    );

    if (showWizardAfter) {
      selection.playSelection(this);
    }
  }

  selectAvatar(callback?: Function) {
    const selectionfactory = new GameSelection();
    const selected = (item: GameSelectionItemType) => {
      let newPlayerConfig: playerConfig;
      if (item.id === "1") {
        newPlayerConfig = {
          head: "01",
          torso: "01",
          legs: "01",
        };
      } else if (item.id == "3") {
        newPlayerConfig = {
          head: "02",
          torso: "02",
          legs: "02",
        };
      } else {
        // NO DEBERIA HABER ITEM 2
        newPlayerConfig = {
          head: "03",
          torso: "03",
          legs: "03",
        };
      }

      this.eventCenter.emit(this.eventCenter.possibleEvents.CHANGE_GENERIC, {
        keys: ["playerConfig"],
        values: [{ ...newPlayerConfig }],
      });

      this.player?.playerBuilder.applySkis(newPlayerConfig);

      this.UIContainer?.avatar?.setHead(newPlayerConfig.head);
      if (callback) callback();
    };

    const selection = selectionfactory.createSelection(
      this,
      [
        {
          id: "1",
          image: "avatar_selection_01",
          title: "Grega",
          description: "Dream 1", // not in use
          background: "menuSky_avatar01",
          ignoreColorFilter: true,
        },

        {
          id: "3",
          image: "avatar_selection_03",
          title: "Tamara",
          description: "Dream 3", // not in use
          background: "menuSky_avatar01",
          ignoreColorFilter: true,
        },
        {
          id: "2",
          image: "avatar_selection_02",
          title: "Shaino",
          description: "Dream 2", // not in use
          background: "menuSky_avatar01",
          ignoreColorFilter: true,
          // disabled: true,
        },
      ],
      selected
    );

    selection.playSelection(this);
  }
  create() {
    this.isoGroup = this.add.group();
    this.minigameIsoGroup = this.add.group();
    this.isoPhysics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 4);
    this.isoPhysics.projector.origin.setTo(0.5, 0.3);
    const ee = this.events;
    this.eventEmitter = ee;
    this.scale.resize(window.innerWidth, window.innerHeight);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.tabletNoInteractiveMesh = this.add
      .rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth,
        window.innerHeight,
        0x000000,
        0
      )
      .setInteractive()
      .setVisible(false);

    this.spawnTiles();
   
    // -> UI
    this.UIContainer = new UIContainer(
      this,
      0,
      0,
      this.mapType,
      this.stateGlobal
    );

    console.log("this.UIContainer",this.UIContainer)
    this.UICamera = this.cameras.add(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
   

    this.spawnObjects();
    this.cameras.main.setZoom(0.5);
    this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.UICamera.ignore(this.isoGroup);
    
    if (this.player) {
      this.UICamera.ignore(this.player.playerBuilder.getContainer());
      if (this.player.wizzard?.sprite) {
        this.UICamera.ignore(this.player.wizzard?.sprite);
        this.player?.playerBuilder.applySkis(this.stateGlobal.playerConfig);
        this.UIContainer?.avatar?.setHead(
          this.player?.playerBuilder.getHeadSelected()
        );
      }
    }

    const forestContainers = this.forest.map((arbolito) => arbolito.container);
    this.UICamera.ignore(forestContainers);
    this.UIContainer.updateData(this.stateGlobal);
    // <- UI

    // EVENTS

    // -> MAP FUNCTIONS AFTER SPAWN TILES (POST UI CREATION)
    this.map?.addMapFunctionalities(this.stateGlobal);
    // <- MAP FUNCTIONS AFTER SPAWN TILES (POST UI CREATION)

    if (!this.withPlayer) {
      this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        if (pointer.isDown) {
          this.cameras.main.scrollX -= pointer.velocity.x / 2;
          this.cameras.main.scrollY -= pointer.velocity.y / 2;
        }
      });
    }

    this.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: any[],
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        if (!this.zoomEnabled) {
          return;
        }
        if (deltaY > 0) {
          var newZoom = this.cameras.main.zoom - 0.1;
          if (newZoom > 0.3) {
            this.cameras.main.zoom = newZoom;
          }
        }

        if (deltaY < 0) {
          var newZoom = this.cameras.main.zoom + 0.1;
          if (newZoom < 1.3) {
            this.cameras.main.zoom = newZoom;
          }
        }
      }
    );

    if (window.innerWidth < 900) {
      this.eventEmitter?.addListener(
        "zoomIn",
        () => {
          var newZoom = this.cameras.main.zoom + 0.1;
          if (newZoom < 1.3) {
            this.cameras.main.zoom = newZoom;
          }
        },
        this
      );
      this.eventEmitter?.addListener(
        "zoomOut",
        () => {
          var newZoom = this.cameras.main.zoom - 0.1;
          if (newZoom > 0.3) {
            this.cameras.main.zoom = newZoom;
          }
        },
        this
      );

      if (this.player) {
        this.eventEmitter?.addListener(
          "moveLeft",
          () => {
            this.player?.move("w", -1, 0);
          },
          this
        );

        this.eventEmitter?.addListener(
          "moveRight",
          () => {
            this.player?.move("e", 1, 0);
          },
          this
        );

        this.eventEmitter?.addListener(
          "moveTop",
          () => {
            this.player?.move("n", 0, 1);
          },
          this
        );

        this.eventEmitter?.addListener(
          "moveBottom",
          () => {
            this.player?.move("s", 0, -1);
          },
          this
        );
      }
    }

    this.time.delayedCall(500, () => {
      getObjectByType(this, "PIN")?.forEach(
        (_pin: GameObjects.GameObject, index: number) => {
          const pin = _pin as unknown as PinIsoSpriteBox;
          const item = this.stateGlobal.inventary.items.find(
            (i) => i.id === 15 // maquina de caffe
          );
          if (this.isoGroup) {
            if (
              index === 2 &&
              item &&
              item.life !== undefined &&
              item.life <= 50 &&
              (this.mapType === "CITY" || this.mapType === "BEACH" || this.mapType === "OFFICE" ) &&
              this.stateGlobal.inversionModule.isActive
            ) {
              pin.isMechanic = true;
              pin.self.setVisible(true);
              pin.self.setAlpha(1);
              const selection = this.mapType === "CITY" ? 0 : this.mapType === "BEACH" ? 1 : 2;
              pin.mechanicId = this.stateGlobal.mechanicOptions[selection] || 1
              pin.self.setTexture("pinMecanich").setScale(1.2);
            }
            pin.startTween();
          }
        }
      );
      getObjectByType(this, "TRADER")?.forEach(
        (_trader: GameObjects.GameObject) => {
          const trader = _trader as unknown as TraderIsoSpriteBox;
          if (this.isoGroup) {
            trader.updateTrader(this.isoGroup);
          }
        }
      );

      getObjectByType(this, "COFFEMINIGAME")?.forEach(
        (_coffeMinigame: GameObjects.GameObject) => {
          const coffeMinigame =
            _coffeMinigame as unknown as CoffeMinigameSpriteBox;
          if (this.isoGroup) {
            coffeMinigame.updateCoffe(this.isoGroup);
          }
        }
      );

      getObjectByType(this, "BUS")?.forEach(
        (_trader: GameObjects.GameObject) => {
          const bus = _trader as unknown as BusIsoSpriteBox;
          if (this.isoGroup) {
            bus.updateBus(this.isoGroup);
          }
        }
      );
      getObjectByType(this, "TRADERCOFFE")?.forEach(
        (_trader: GameObjects.GameObject) => {
          const traderCoffe = _trader as unknown as TraderCoffeIsoSpriteBox;
          if (this.isoGroup) {
            traderCoffe.updateTrader(this.isoGroup);
          }
        }
      );
    });

    this.time.delayedCall(
      200,
      () => {
        this.createPins();
      },
      [],
      this
    );

    const { inProgressMissions } = this.stateGlobal.missionModule.getState();
    if (inProgressMissions && inProgressMissions.length > 0) {
      let hidePins = false;
      let blockBoxMessage: boolean | number = false
      for (let i = 0; i < inProgressMissions.length; i++) {
        const mission = inProgressMissions[i];
        if (mission.takesPlaceOn.includes(this.mapType) && (mission.isMinigame || mission.followUpMission.length)) {
          const dayLongevity = this.stateGlobal.inversionModule.isActive
            ? 8
            : 4;
          if (mission.time >= dayLongevity - this.stateGlobal.timeOfDay) {
            this.stateGlobal.missionModule.failMissionInProgress(mission.id);



            blockBoxMessage = mission.id

            const rect = new Phaser.Geom.Rectangle(200, 0, 0, 0);
            this.tooltipHelper.openToolTip(
              "T1",
              "Te has quedado sin tiempo para hacer la misión, vuelve a intentarlo otro día!",
              rect,
              () => {
                this.player!.setCanMove(true);
                this.eventCenter.emitEvent(
                  this.eventCenter.possibleEvents.CLOSE_MISSION_BOX,
                  mission
                );
              },
              true,
              undefined,
              false,
              true,
              this.getWizzard()
            );
            this.eventCenter.emitEvent(
              this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
              ["T1"]
            );
          } else {
            hidePins = mission.isMinigame;
            this.eventCenter.emitEvent(
              this.eventCenter.possibleEvents.START_MINIGAME,
              mission
            );
          }
        }
      }
      if (hidePins) {
        this.time.delayedCall(
          1000,
          () => {
            this.eventCenter.emitEvent(
              this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
              false
            );
          },
          [],
          this
        );
      }

      inProgressMissions?.forEach((mission) => {
        if (blockBoxMessage !== mission.id) {
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.OPEN_MISSION_BOX,
            mission
          );
        }
      });
    }

    this.eventCenter.turnEventOn(
      "RPG",
      this.eventCenter.possibleEvents.OPEN_MINIGAME,
      (payload: {
        name: string;
        item: number;
        consume: number;
        damage: number;
        money: number;
        considerBusinessFuel: boolean;
      }) => {
        if (payload.considerBusinessFuel) {
          if (this.stateGlobal.inventary.businessFuel - payload.consume <= 0) {
            let width = this.UICamera!.width;
            let widthScaleParam = 1200;
            let widthScale = width / widthScaleParam;
            let rectSize = 200;
            let newSize = rectSize * widthScale;

            const rect = new Phaser.Geom.Rectangle(
              200 * widthScale,
              0,
              newSize / 1.5,
              50 * widthScale
            );
            this.tooltipHelper.openToolTip(
              "C1",
              "Te has quedado sin combustible para tu emprendimiento. Tienes que conseguir mas!",
              rect,
              () => { },
              true,
              undefined,
              false,
              true,
              this.getWizzard()
            );
            this.eventCenter.emitEvent(
              this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
              ["C1"]
            );

            return;
          }
        }
        if (this.stateGlobal.timeOfDay === (this.stateGlobal.inversionModule.isActive ? 8 : 4)) {
          const { width } = this.UICamera!;
          let widthScaleParam = 1200;
          let widthScale = width / widthScaleParam;
          let rectSize = 200;
          let newSize = rectSize * widthScale;

          this.tooltipHelper.openToolTip(
            "C4",
            "Ya has trabajado mucho por hoy, vuelve mañana!",
            new Phaser.Geom.Rectangle(
              width / 2 - newSize / 2,
              0,
              newSize,
              50 * widthScale
            ),
            () => {},
            true,
            undefined,
            false,
            true,
            this.getWizzard()
          );
        
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
            ["C4"]
          );
          return;
        }

        const item = this.stateGlobal.inventary.items.find(
          (i) => i.id === payload.item
        );
        if (payload.item && (!item || (item.life || 0) - payload.consume < 0)) {
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.REPAIRMENT,
            payload
          );

          const coffeMachine = getObjectByType(
            this,
            "COFFEMINIGAME"
          )?.[0] as unknown as PinIsoSpriteBox;
          if (coffeMachine) {
            const coffeMachinePoint = GetPointFromWorld(
              coffeMachine.self.getCenter(),
              this
            );
            const coffeMachineCircle = new Phaser.Geom.Circle(
              coffeMachinePoint.x + 50,
              coffeMachinePoint.y - 25,
              100
            );
            // tween zoom 1

            this.tweens.add({
              targets: this.cameras.main,
              zoom: 1,
              duration: 300,
              ease: "Linear",
              repeat: 0,
              yoyo: false,
              onComplete: () => {
                this.tooltipHelper.openToolTip(
                  "C2",
                  "La máquina está rota. Busca los dos mecánicos y elige el más conveniente.",
                  coffeMachineCircle,
                  () => { },
                  true,
                  (t: number) => {
                    const coffeMachinePoint = GetPointFromWorld(
                      coffeMachine.self.getCenter(),
                      this
                    );
                    const coffeMachineCircle = new Phaser.Geom.Circle(
                      coffeMachinePoint.x + 50,
                      coffeMachinePoint.y - 25,
                      100 + Math.sin(t / 100) * 5
                    );
                    return coffeMachineCircle;
                  },
                  false,
                  true,
                  this.getWizzard()
                );
                this.eventCenter.emitEvent(
                  this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
                  ["C2"]
                );
              },
            });
          }
          return;
        }
        const scene = this.scene.get(payload.name);

        this.scene.launch(payload.name, {
          win: () => this.winMiniGame.bind(this)(scene, payload),
          lose: () => this.loseMiniGame.bind(this)(scene, payload),
          stateGlobal: this.stateGlobal,
        });
        this.scene.bringToTop(payload.name);
      },
      this
    );

    //const this.tooltipHelper = new ToolTips(this);

    this.time.delayedCall(1500, () => {
      // POSICION DEL PLAYER DENTRO DEL MUNDO Y CONVERTIDO A PUNTO EN LA CAMARA
      const PlayerPoint = GetPointFromWorld(
        this.player?.self.getCenter()!,
        this
      );
      const playerCircle = new Phaser.Geom.Circle(
        PlayerPoint.x,
        PlayerPoint.y,
        100
      );
      if (this.mapType === "ROOM") {
        const checkTooltip1 =
          this.tooltipHelper.checkIfToolTipWasOpenBefore("D1");
        const checkTooltip4 =
          this.tooltipHelper.checkIfToolTipWasOpenBefore("D2");
        if (!checkTooltip1 && !checkTooltip4) {
          // FRENA EL MOVIMIENTO DEL JUGADOR CON FLECHITAS
          this.player!.setCanMove(false);

          // HAY UN PROBLEMA QUE NO PUEDO AGARRAR BIEN EL PUNTO SI ES QUE LA CAMARA MAIN TIENE ZOOM,
          // POR ESO SETEO EL ZOOM EN 1
          // tween camera zoom to 1

          this.tweens.add({
            targets: this.cameras.main,
            zoom: 1,
            duration: 500,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          });

          // this.cameras.main.setZoom(1);

          // SI SE QUIERE ALGO DE LA UI, DIRECTAMENTE SE PUEDE AGARRAR EL OBJETO Y USAR EL GETCENTER
          const TabletPoint = this.UIContainer?.tabletIcon.getCenter();

          // LA MASCARA PUEDE SER REDONDA O CUADRADA
          // RECOMIENDO REDONDA PORQUE PARTE DESDE EL CENTRO DEL OBJETO

          // const hardcodedRect = new Phaser.Geom.Rectangle(PlayerPoint.x, PlayerPoint.y, 100,100);

          this.tooltipHelper.openToolTip(
            "D1",
            "Esta es la tablet, no la pierdas de vista. Te va a servir para muchas cosas.",
            new Phaser.Geom.Circle(TabletPoint!.x, TabletPoint!.y, 100),
            () => {
              const { width } = this.UICamera!;
              let widthScaleParam = 1200;
              let widthScale = width / widthScaleParam;
              let rectSize = 200;
              let newSize = rectSize * widthScale;
              this.tooltipHelper.openToolTip(
                "D2",
                "Esta barra representa el progreso del tiempo",
                new Phaser.Geom.Rectangle(
                  width / 2 - newSize / 2,
                  0,
                  newSize,
                  50 * widthScale
                ),
                () => {
                  // add tooltip para la cama

                  const fContainer = (this.map as Room).frontContainer;
                  if (!fContainer) {
                    this.player!.setCanMove(true);
                    return;
                  }
                  const fPoint = new Phaser.Geom.Point(
                    fContainer!.x,
                    fContainer!.y
                  );

                  const cameraFPoint = GetPointFromWorld(fPoint, this);

                  const bed = (this.map as Room).interactiveBed;
                  if (bed) {
                    let bedMask = new Phaser.Geom.Circle(
                      cameraFPoint.x + bed!.x,
                      cameraFPoint.y - bed!.y,
                      150
                    );

                    this.tooltipHelper.openToolTip(
                      "D3",
                      "Esta es la cama. Recuerda dormir de vez en cuando",
                      bedMask!,
                      () => {
                        this.player!.setCanMove(true);
                      },
                      true,
                      undefined,
                      false,
                      false,
                      this.getWizzard()
                    );
                    this.eventCenter.emitEvent(
                      this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
                      ["D2", "D3"]
                    );
                    // ESTE PARAMETRO, SE EJEC
                  } else {
                    this.player!.setCanMove(true);
                  }
                },
                true,
                undefined,
                false,
                false,
                this.getWizzard()
              );
            },
            true,
            (t: number) => {
              const TabletPoint = this.UIContainer?.tabletIcon.getCenter();
              return new Phaser.Geom.Circle(
                TabletPoint!.x,
                TabletPoint!.y,
                100 + Math.sin(t / 100) * 5
              );
            },
            false,
            false,
            this.getWizzard()
          );
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
            ["D1"]
          );
        }
      }
      // check if map is city
      else if (
        this.mapType === "CITY" ||
        this.mapType === "BEACH" ||
        this.mapType === "OFFICE" ||
        this.mapType === "ENTREPRENEURSHIP"
      ) {
        this.player?.setCanMove(true);
        this.tooltipHelper.openToolTip(
          "R1",
          "Con las flechas del teclado podras moverte.",
          playerCircle,
          (t: number) => {
            const pins = (getObjectByType(this, "PIN") ||
              []) as unknown as PinIsoSpriteBox[];
            const pin = pins.find((p) => {
              return p.assignMission;
            });

            if (pin) {
              const pinPoint = GetPointFromWorld(pin.self.getCenter(), this);
              const pinCircle = new Phaser.Geom.Circle(
                pinPoint.x,
                pinPoint.y,
                100 + Math.sin(t / 100) * 5
              );
              this.tooltipHelper.openToolTip(
                "R2",
                "Las misiones aparecen arriba de las cabezas de las personas en el mapa. Haz Click para verlas.",
                pinCircle,
                () => { },
                true,
                () => {
                  // ESTE PARAMETRO, SE EJECUTA EN EL UPDATE Y DEVUELVE LA POSITION ACTUALIZADA DEL TOOLTIP
                  // ENTONCES HACE QUE EL TOOLTIP SE MUEVA AO VIVO
                  const pins = (getObjectByType(this, "PIN") ||
                    []) as unknown as PinIsoSpriteBox[];

                  const pin = pins.find((p) => {
                    return p.assignMission;
                  });
                  if (!pin) return;
                  const pinPoint = GetPointFromWorld(
                    pin.self.getCenter(),
                    this
                  );
                  const pinCircle = new Phaser.Geom.Circle(
                    pinPoint.x,
                    pinPoint.y,
                    100 + Math.sin(t / 100) * 5
                  );
                  return pinCircle;
                },
                true,
                false,
                this.getWizzard()
              );
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
                ["R2"]
              );
            }
          },
          true,
          undefined,
          false,
          false,
          this.getWizzard()
        );
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
          ["R1"]
        );
      } else {
        this.player!.setCanMove(true);
      }
    });
    // check if wizard eist
    if (!this.getWizzard()) {
      this.dreamInstance.setDreamPool([
        {
          id: "w1",
          texts: [
            "Wow, fue un gran día chambix.",
            "¿Qué trabajos te gustaron más?",
            "¿Pensaste que haremos mañana?",
          ],
        },
        {
          id: "w2",
          texts: [
            "¡Que día tan agotador! Chambix está cansado.",
            "¿Qué podríamos comprar con todo el dinero que ganamos?",
          ],
        },
        {
          id: "w3",
          texts: [
            "¡Eres increíble! Hoy también te luciste.",
            "¡Ha llegado la hora de elegir a tu Chambix de aventuras!",
          ],
        },
        {
          id: "w4",
          texts:   [
            "¡Misión cumplida! ¿Cómo te sentiste manejando responsabilidades hoy?",
          ],
        },
        {
          id: "w5",
          texts:   [
            "¿Cuánto has avanzado? ", 
            "Mira todo lo que has conseguido desde que conociste a Chambix.", 
          ],
        },
        {
          id: "w6",
          texts:   [
            "La primera moneda se acuñó con las manos.", 
            "Siglos después, el dinero se mueve sin que lo toquemos." 
          ],
        },
        {
          id: "w7",
          texts:   [
            "¡Tomar un préstamo no es algo malo!", 
            " Úsalo para algo que te hará crecer, como un buen emprendimiento."
          ],
        },

      ]);
    }

    // get all items on onventory
    const items = this.stateGlobal.inventary.items;
    // get all items by type STATUSBAR
    const statusBars = getObjectByType(
      this,
      "STATUSBAR"
    ) as unknown as StatusBarForItem[];
    statusBars?.forEach((statusBar: StatusBarForItem) => {
      const item = items.find((i) => i.id === statusBar.forItemId);
      if (item) {
        statusBar.setPercentage(item.life || 0);
      }
    });

    this.UIContainer?.checkChatDot();
    this.input.on("pointermove", this.listenTouch.bind(this));
    this.input.on("pointerup", this.listenTouch.bind(this));

  }
  listenTouch(p: {
    x: any;
    y: any;
    prevPosition: { x: any; y: any };
    isDown: boolean;
  }) {
    // on mobile p.isDown is always true
    // other way to detect touch is not moving
    if (!p.isDown) {
      this.willListenTouch = false;
      this.listenTouchDirectionX = 0;
      this.listenTouchDirectionY = 0;
      this.originalTouchX = 0;
      this.originalTouchY = 0;
      this.touchCursors = {
        right: { isDown: false, isUp: false },
        left: { isDown: false, isUp: false },
        up: { isDown: false, isUp: false },
        down: { isDown: false, isUp: false },
      };
      return;
    } else {
      if (this.originalTouchX == 0) this.originalTouchX = p.prevPosition.x;
      if (this.originalTouchY == 0) this.originalTouchY = p.prevPosition.y;
      this.willListenTouch = true; // BLOCK TOUCH!

      let x = p.x - this.originalTouchX;
      let y = p.y - this.originalTouchY;

      // max 20 or -20

      if (x > 80) x = 80;
      else if (x < -80) x = -80;

      if (y > 80) y = 80;
      else if (y < -80) y = -80;

      // the abs number of x and y peristt, the other one is 0
      if (Math.abs(x) > Math.abs(y)) y = y / 2;
      else x = x / 2;

      this.listenTouchDirectionX = x;
      this.listenTouchDirectionY = y;
    }
  }
  dreamFunctionCallback = (dream: DreamType) => {
    // check if wizard is active first
    this.tweens.add({
      targets: this.UIContainer?.blackScreen,
      alpha: 0,
      duration: 400,
      ease: "ease",
      repeat: 0,
      onComplete: () => {
        this.UIContainer?.blackScreen.setAlpha(0);
        (this.map as Room).sleeping = false;
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.DREAM,
          dream
        );
      },
      // hold: 800,
      delay: 500,
    });
  };

  winMiniGame(
    scene: Phaser.Scene,
    data: {
      name: string;
      item: number;
      damage: number;
      consume: number;
      money: number;
      considerBusinessFuel: boolean;
    }
  ) {
    const { item, consume, money, considerBusinessFuel, damage } = data;
    this.eventCenter.emit(
      this.eventCenter.possibleEvents.UPDATE_COFFE_COUNTER,
      1
    );

    let actualCounter = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_COFFE_COUNTER,
      null
    );

    if(actualCounter === 5) {
      this.eventCenter.emit(
        this.eventCenter.possibleEvents.TIME_CHANGE,
        1
      );
      this.eventCenter.emit(
        this.eventCenter.possibleEvents.UPDATE_COFFE_COUNTER,
        -1
      );
    }

    let inventaryItem = this.stateGlobal.inventary.items.find(
      (i) => i.id === item
    );
    if (!inventaryItem && item) return;

    if(this.stateGlobal.timeOfDay === (this.stateGlobal.inversionModule.isActive ? 8 : 4)) {
      scene.scene.stop();
      scene.scene.sendToBack();
    }

    if (considerBusinessFuel) {
      if (inventaryItem && (inventaryItem.life || 0) <= 0) {
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.REPAIRMENT,
          data
        );

        scene.scene.stop();
        scene.scene.sendToBack();
      }

      const businessFuel = this.stateGlobal.inventary.businessFuel;
      if (businessFuel - consume <= 0) {
        scene.scene.stop();
        scene.scene.sendToBack();
      } else {
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.UPDATE_BUSINESS_FUEL,
          -consume
        );
      }
      this.eventCenter.emit(
        this.eventCenter.possibleEvents.UPDATE_ITEM_LIFE,
        item,
        damage,
        false
      );

      const statusBars = getObjectByType(
        this,
        "STATUSBAR"
      ) as unknown as StatusBarForItem[];
      statusBars?.forEach((statusBar: StatusBarForItem) => {
        if (inventaryItem && statusBar.forItemId === item) {
          statusBar.setPercentage(inventaryItem.life || 0);
        }
      });
    }
    this.eventCenter.emitEvent(
      this.eventCenter.possibleEvents.UPDATE_BUSINESS,
      money
    );
  }

  loseMiniGame(
    scene: Phaser.Scene,
    data: {
      name: string;
      item: number;
      consume: number;
      damage: number;
      money: number;
      considerBusinessFuel: boolean;
    }
  ) {
    const { item, consume, money, considerBusinessFuel, damage } = data;
    this.eventCenter.emit(
      this.eventCenter.possibleEvents.UPDATE_COFFE_COUNTER,
      1
    );

    let actualCounter = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_COFFE_COUNTER,
      null
    );

    if(actualCounter === 5) {
      this.eventCenter.emit(
        this.eventCenter.possibleEvents.TIME_CHANGE,
        1
      );
      this.eventCenter.emit(
        this.eventCenter.possibleEvents.UPDATE_COFFE_COUNTER,
        -1
      );
    }

    let inventaryItem = this.stateGlobal.inventary.items.find(
      (i) => i.id === item
    );
    if (!inventaryItem && item) return;

    if(this.stateGlobal.timeOfDay === (this.stateGlobal.inversionModule.isActive ? 8 : 4)) {
      scene.scene.stop();
      scene.scene.sendToBack();
    }

    if (considerBusinessFuel) {
      if (inventaryItem && (inventaryItem.life || 0) <= 0) {
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.REPAIRMENT,
          data
        );

        scene.scene.stop();
        scene.scene.sendToBack();
      }

      // check if
      const businessFuel = this.stateGlobal.inventary.businessFuel;
      if (businessFuel - consume <= 0) {
        scene.scene.stop();
        scene.scene.sendToBack();
      } else {
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.UPDATE_BUSINESS_FUEL,
          -consume
        );
      }

      this.eventCenter.emit(
        this.eventCenter.possibleEvents.UPDATE_ITEM_LIFE,
        item,
        damage,
        false
      );

      // get All items by type STATUSBAR

      const statusBars = getObjectByType(
        this,
        "STATUSBAR"
      ) as unknown as StatusBarForItem[];
      statusBars?.forEach((statusBar: StatusBarForItem) => {
        if (inventaryItem && statusBar.forItemId === item) {
          statusBar.setPercentage(inventaryItem.life || 0);
        }
      });
    }
  }

  checkIfMissionIsOnMap(mission: missionsType) {
    return mission.takesPlaceOn?.includes(this.mapType);
  }

  createPins() {
    this.stateGlobal = this.eventCenter.emitWithResponse(
      this.eventCenter.possibleEvents.GET_STATE,
      null
    );
    // disable pin by default

    const pins = getObjectByType(this, "PIN");

    pins?.forEach((pin: GameObjects.GameObject) => {
      const p = pin as unknown as PinIsoSpriteBox;
      p.self.setAlpha(0);
      p.self.setVisible(false);
      p.stopTween();
    });

    //let missionsToBeDone = this.stateGlobal.availableMissions;

    let missionsToBeDone =
      this.stateGlobal.missionModule.getAllFilteredMissions(
        this.mapType,
        true,
        true
      );
    // filter if missionsToBeDone any one has isFollowUp
    const followUpMissions = [...missionsToBeDone].filter((m) => m.isFollowUp);
    missionsToBeDone = missionsToBeDone.filter((m) => !m.isFollowUp);

    // get all followUpMissions
    if (pins) {
      let pinIndexList = new Array(pins?.length)
        .fill(0)
        .map((_, i) => i)
        .sort(() => Math.random() - 0.5);
      for (let i = 0; i < followUpMissions.length; i++) {
        // check if pin length is not lower thatn i
        if (pins && pinIndexList.length <= 0) {
          break;
        }
        const pin = pins[pinIndexList[0]] as unknown as PinIsoSpriteBox;
        pin.self.setAlpha(1);
        pin.self.setVisible(true);
        pin.startTween();
        pin.self.setTexture("greenPinHollow");
        pin.assignMission = followUpMissions[i].id;
        pinIndexList.shift();
      }

      for (let i = 0; i < missionsToBeDone.length; i++) {
        // check if pin length is not lower thatn i
        if (pins && pinIndexList.length <= 0) {
          break;
        }
        const pin = pins[pinIndexList[0]] as unknown as PinIsoSpriteBox;
        pin.self.setAlpha(1);
        pin.self.setVisible(true);
        pin.startTween();
        pin.assignMission = missionsToBeDone[i].id;
        pinIndexList.shift();
      }
    }
  }

  handleMinigame(
    type: "PUSH_OBJECT" | "FIND_OBJECT" | "MINIGAME_SCENE" = "PUSH_OBJECT",
    itemFound?: findObjectIsoSpriteBox
  ) {
    const groupChildren = this.isoGroup?.getChildren();
    const { inProgressMissions } = this.stateGlobal.missionModule.getState();
    const currentMission = inProgressMissions?.find(
      (m) => m.takesPlaceOn?.includes(this.mapType) && m.draw
    );
    switch (type) {
      case "PUSH_OBJECT":
        //@ts-ignore
        const block = groupChildren?.filter(
          (child) => child.type === "CUBE"
        ) as RpgIsoSpriteBox[];
        //@ts-ignore
        const endpoint = groupChildren?.filter(
          (child) => child.type === "ENDPOINT"
        ) as RpgIsoSpriteBox[];
        for (let i = 0; i < block.length; i++) {
          for (let k = 0; k < endpoint.length; k++) {
            if (block[i] && endpoint[k]) {
              if (
                block[i].matrixPosition?.x === endpoint[k].matrixPosition?.x &&
                block[i].matrixPosition?.y === endpoint[k].matrixPosition?.y
              ) {
                block[i].self.destroy();
                endpoint[k].self.destroy();
                block.splice(i, 1);
                endpoint.splice(k, 1);
                if (block.length && endpoint.length) return;
                if (currentMission) {
                  this.checkCompassForMiniGame();
                  this.eventCenter.emitEvent(
                    this.eventCenter.possibleEvents.FINISH_MODAL,
                    {
                      modalType: modalType.FINISH,
                      mission: currentMission,
                      responses: undefined,
                      maxQuestions: undefined,
                      callback: () => {
                        this.modalManager.destroyModal();
                        this.eventCenter.emitEvent(
                          this.eventCenter.possibleEvents.FINISH_MISSION,
                          currentMission.id
                        );
                      },
                    }
                  );
                } else {
                  window.alert("No mission found");
                }
              }
            }
          }
        }
        break;
      case "FIND_OBJECT":
        //TODO REFACTOR SI HAY MAS DE 1 ITEM TO FIND Y FINISH MISSION SOLO SI ENCUERNTRO EL ULTIMO
        //@ts-ignore
        if (!itemFound) return;
        itemFound.self.destroy();

        const itemToFind = groupChildren?.filter(
          (ch) => ch.type === "CHICKEN"
        ) as unknown as RpgIsoSpriteBox[];

        if (itemToFind.length) return;
        if (currentMission) {
          this.checkCompassForMiniGame();
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.FINISH_MODAL,
            {
              modalType: modalType.FINISH,
              mission: currentMission,
              responses: undefined,
              maxQuestions: undefined,
              callback: () => {
                this.modalManager.destroyModal();
                this.eventCenter.emitEvent(
                  this.eventCenter.possibleEvents.FINISH_MISSION,
                  currentMission.id
                );
              },
            }
          );
        } else {
          window.alert("No mission found");
        }
        break;
    }
  }

  spawnObjects() {
    if (this.mapBlueprint) {
      let scalar = 0;
      let h;
      const _lvlConf = this.mapBlueprint[0];
      const lvlConf = JSON.parse(_lvlConf);

      this.distanceBetweenFloors = lvlConf.distanceBetweenFloors;
      h = this.distanceBetweenFloors;

      const objectsMaps = JSON.parse(this.mapBlueprint[1]);

      for (let index = 0; index < objectsMaps.length; index++) {
        const map = objectsMaps[index];

        // const h = 1000 + index * 600;
        scalar = index;
        const m = new MapManager(map, this as any);
        const conf = {
          height: h * scalar,
          structure: (
            a: string,
            b: number,
            c: number,
            that: MapManager,
            conf: ConfObjectType,
            objectKey: string
          ) => {
            //
            const { game, setPosFromAnchor } = that;

            const { height } = conf;
            const x = setPosFromAnchor(b, c).x;
            const y = setPosFromAnchor(b, c).y;

            let direction = undefined;
            switch (objectKey) {
              case "PLAYER-E":
                direction = "e";
                break;
              case "PLAYER-N":
                direction = "n";
                break;
              case "PLAYER-S":
                direction = "s";
                break;
              case "PLAYER-W":
                direction = "w";
                break;
            }
            if (direction) {
              let matrixPosition = {
                x: b,
                y: c,
                h: height,
              };

              if (objectKey == "PLAYER-S") {
                if (this.withPlayer) {
                  this.player = new RpgIsoPlayerPrincipal(
                    this, // Scene
                    x, // x
                    y, // y
                    height + h, // height
                    "chicken", // spriteName
                    17, // baseFrame
                    this.isoGroup, // group
                    direction, // direction
                    matrixPosition,
                    "Pepe",
                    this.distanceBetweenFloors
                  );
                  console.log("this.stateGlobal.playerConfig",this.stateGlobal.playerConfig.head)
                  if (this.stateGlobal.playerConfig.head == "00") {
                    this.selectAvatar(() => {
                      // nothing
                    });
                  } else {
                    console.log("ACA ENTREO?", this.UIContainer)
                    this.UIContainer?.avatar?.setHead(this.stateGlobal.playerConfig.head);
                    this.player?.playerBuilder.applySkis(
                      this.stateGlobal.playerConfig
                    );
                  }

                  // BAD BLOCK BARTO
                  this.player.wizzard =
                    this.stateGlobal.wizzardModule.getState().companion;
                  if (this.stateGlobal.wizzardModule.getState().isActive) {
                    this.player?.wizzard?.playCompanion(
                      this,
                      this.player,
                      this.mapType
                    );
                    if (this.player?.wizzard?.sprite)
                      this.UICamera?.ignore(this.player.wizzard?.sprite);
                  }
                  // BAD BLOCK BARTO
                }
              } else {
                this.NPCTalker = new RpgIsoPlayerSecundarioTalker(
                  this, // Scene
                  x, // x
                  y, // y
                  height + h, // height
                  "chicken", // spriteName
                  17, // baseFrame
                  this.isoGroup, // group
                  direction, // direction
                  matrixPosition
                );
              }
            }
          },
        };
        //@ts-ignore
        m.drawMap(this.isoGroup, conf, lvlConf);
      }
    }
  }

  spawnTiles(startIn: number = 2, startHeight: number = 0) {
    if (this.mapBlueprint) {
      const self = this;
      let pos = 0;
      let h: number;
      const _lvlConf = this.mapBlueprint[0];
      const lvlConf = JSON.parse(_lvlConf);

      this.distanceBetweenFloors = lvlConf.distanceBetweenFloors;
      h = this.distanceBetweenFloors;

      let scalar = 0;
      let startOnMap = startIn;
      for (let index = startOnMap; index < this.mapBlueprint.length; index++) {
        // reverse the map string
        const map = this.mapBlueprint[index];
        // const h = 1000 + index * 600;
        scalar = index - startOnMap + startHeight;
        const m = new MapManager(map, this as any);
        const conf = {
          height: h * scalar,
          structure: (
            a: string,
            b: number,
            c: number,
            that: MapManager,
            conf: ConfObjectType,
            objectKey: string
          ) => {
            switch (objectKey) {
              case "BUILDINGBRICK2SOLID":
                this.tileCreator.createBlockTile(
                  b,
                  c,
                  "brick2",
                  that,
                  conf,
                  pos
                );
                break;
              case "GRASS":
                this.tileCreator.createGrassTile(b, c, that, conf, pos);
                break;
              case "BEACHBLOCK":
                const bb = this.tileCreator.createBeachBlockTile(
                  b,
                  c,
                  that,
                  conf,
                  pos
                );
                bb.self.setTint(0xffeded);
                break;
              case "STREET-A":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "street-a"
                );
                break;
              case "STREET-B":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "street-b"
                );
                break;
              case "STREET-C":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "street-c"
                );
                break;

              case "STREET-E":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "street-e"
                );
                break;
              case "BLOCKED-SPACE":
                const bblocked = this.tileCreator.createBeachBlockTile(
                  b,
                  c,
                  that,
                  conf,
                  pos
                );
                bblocked.self.setTint(0x0d8d0d).setAlpha(0.1);
                break;

              case "BLOCKED-SPACEB":
                const bblockedB = this.tileCreator.createBeachBlockTile(
                  b,
                  c,
                  that,
                  conf,
                  pos
                );
                bblockedB.self.setTint(0x0d0d8d).setAlpha(0.1);
                break;
              case "BLOCKED-SPACEC":
                const bblockedC = this.tileCreator.createBeachBlockTile(
                  b,
                  c,
                  that,
                  conf,
                  pos
                );
                bblockedC.self.setTint(0x8d0d0d).setAlpha(0.1);
                bblockedC.self.type = "TO_BUY";
                break;
              case "STREET-DOBLE-1":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "doubleLine1"
                );
                break;
              case "STREET-DOBLE-2":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "doubleLine2"
                );
                break;
              case "STREET-CROSS-1":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "peatonal1"
                );
                break;
              case "STREET-CROSS-2":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "peatonal2"
                );
                break;

              case "SIDEWALK":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "side-walk"
                );
                break;
              case "SIDEWALK2":
                this.tileCreator.createStreetTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "side-walk-2"
                );
                break;
              case "BLOQUERANDOM":
                this.tileCreator.createBloqueRandomTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  index
                );
                break;
              case "BLOQUE-1":
                this.tileCreator.createBloqueTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  objectKey
                );
                break;
              case "OCEAN-1":
              case "OCEAN-2":
              case "OCEAN-3":
              case "OCEAN-4":
              case "OCEAN-5":
                const olita = this.tileCreator.createOceanTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  objectKey
                );

                const _conf2 = { ...conf };
                _conf2.height += 50;

                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c,
                  that,
                  _conf2,
                  pos,
                  "blockBuildingEmpty"
                );
                break;
              case "COLUMNALARGA":
                this.tileCreator.createColumnaTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "columna-0"
                );
                break;
              case "COLUMNACORTA":
                this.tileCreator.createColumnaTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "columna-1"
                );
                break;
              case "SEMIBLOQUE":
                this.tileCreator.createSemiBloque(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "semibloque-0"
                );
                break;
              case "TREE":
                this.tileCreator.createTreeTile(b, c, that, conf, pos);
                break;
              case "CUBE":
                this.tileCreator.createCubeTile(b, c, that, conf, pos, "trash");
                break;
              case "DOG":
                let _d = this.tileCreator.createCubeTile(b, c, that, conf, pos, "dog2");
                _d.canShowText = true
                _d.possibleTexts = [
                  "WOF! WOF!",
                  "WOF!",
                  "POR AQUI PERRITO!"
                ]
                break;
              case "CAT":
                this.tileCreator.createChickenTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "whiteCat" //"chicken"
                );
                
                break;
              case "DELIVERYBOX":
                const randomNumber = Math.random();
                let _c = this.tileCreator.createCubeTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  randomNumber < 0.33
                    ? "deliveryBox1"
                    : randomNumber < 0.66
                      ? "deliveryBox2"
                      : "deliveryBox3"
                );
                _c.canShowText = true
                _c.possibleTexts = [
                  "¡UFF! CUANTO PESA ESTO",
                  "YA CASI",
                  "UN POCO MAS",
                ]
                break;
              case "CHICKEN":
                this.tileCreator.createChickenTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "dog2" //"chicken"
                );
                break;
              case "DROPZONE":
                this.tileCreator.createChickenTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "endpointLight", //"chicken",
                  true
                );
                break;
              case "ENDPOINT":
                this.tileCreator.createEndpointTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "endpointLight",
                  true
                );
                break;
              case "PIN":
                this.tileCreator.createPinTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "redPinHollow"
                );
                break;
              case "TRADER":
                this.tileCreator.createTraderTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "tradePost"
                );
                const _conf = { ...conf };
                _conf.height -= 50;

                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c + 1,
                  that,
                  _conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c - 1,
                  that,
                  _conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c,
                  that,
                  _conf,
                  pos,
                  "blockBuildingEmpty"
                );

                break;
              case "COFFE-BAR":
                const texxtureBar = {
                  texture: "newCoffeBar",
                  scale: 0.35,
                };
                const coffeBar = this.tileCreator.createCoffeDonutMiniGame(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  texxtureBar.texture
                  // this.openCoffeMachineCoffeMiniGameScene.bind(this)
                );
                coffeBar.self.setScale(texxtureBar.scale);
                break;
              case "COFFE-MINIGAME":
                const texture = {
                  texture: "newCoffeMachine",
                  scale: 0.3,
                };

                const matchItem = 15;
                const itemsInInventory = this.stateGlobal.inventary.items;
                const hasCoffeMachine = itemsInInventory.find(
                  (item) => item.id === matchItem
                );
                if (!hasCoffeMachine) return;
                const coffe = this.tileCreator.createCoffeMinigame(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  texture.texture
                  // this.openCoffeMachineCoffeMiniGameScene.bind(this)
                );
                coffe.self.setScale(texture.scale);

                // add StatusBarForItem above the coffe
                const progressBar = new StatusBarForItem(
                  this,
                  coffe.isoX - 15,
                  coffe.isoY,
                  coffe.isoZ + 35,
                  "",
                  0,
                  this.isoGroup
                );
                progressBar.forItemId = matchItem;

                break;
              case "BUS":
                this.tileCreator.createBusTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "busPost"
                );
                const __conf = { ...conf };
                __conf.height -= 50;
                // check if player has item 7 (bicicle) then draw a biciclye object beside the bus stop
                const matchItemBicicle = 7;
                const hasBicicle = this.stateGlobal.inventary.items.find(
                  (item) => item.id === matchItemBicicle && item.inInventory
                );
                const isBeach = this.mapType === "BEACH";
                if (hasBicicle && !isBeach) {
                  this.tileCreator
                    .createBikeForCity(
                      b,
                      c + 3,
                      that,
                      __conf,
                      pos,
                      "bicicleForBus"
                    )
                    .self.setScale(0.3);
                }

                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c + 1,
                  that,
                  __conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c - 1,
                  that,
                  __conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c,
                  that,
                  __conf,
                  pos,
                  "blockBuildingEmpty"
                );

                break;

              case "TRADERCOFFE":
                if (this.stateGlobal.inversionModule.isActive) {
                  this.tileCreator.createTraderCoffeTile(
                    b,
                    c,
                    that,
                    conf,
                    pos,
                    "coffePost"
                  );
                  const ___conf = { ...conf };
                  ___conf.height -= 50;

                  this.tileCreator.createBloqueBuildingTile(
                    b,
                    c + 1,
                    that,
                    ___conf,
                    pos,
                    "blockBuildingEmpty"
                  );
                  this.tileCreator.createBloqueBuildingTile(
                    b,
                    c - 1,
                    that,
                    ___conf,
                    pos,
                    "blockBuildingEmpty"
                  );
                  this.tileCreator.createBloqueBuildingTile(
                    b,
                    c,
                    that,
                    ___conf,
                    pos,
                    "blockBuildingEmpty"
                  );
                }

                break;
              case "COFFE-ALFOMBRA":
              case "COFFE-BASURA":
              case "COFFE-PICNICTABLE":
              case "COFFE-METEGOL":
              case "COFFE-SHELVES":
              case "COFFE-PLANTA-1":
              case "COFFE-PLANTA-2":
              case "COFFE-PLANTA-3":
              case "COFFE-REFRIGERATOR":
              case "COFFE-PLANTA-4":
                const textures = {
                  "COFFE-ALFOMBRA": {
                    texture: "coffeAlfombra",
                    scale: 0.15,
                  },
                  "COFFE-REFRIGERATOR": {
                    texture: "newCoffeRefrigerator",
                    scale: 0.28,
                  },
                  "COFFE-PLANTA-1": {
                    texture: "coffePlant1",
                    scale: 0.05,
                  },
                  "COFFE-PLANTA-2": {
                    texture: "coffePlant1",
                    scale: 0.15,
                  },
                  "COFFE-PLANTA-3": {
                    texture: "coffePlant1",
                    scale: 0.15,
                  },
                  "COFFE-PLANTA-4": {
                    texture: "coffePlant1",
                    scale: 0.15,
                  },
                  // "COFFE-BAR": {
                  //   texture: "coffeBar",
                  //   scale: 0.2,
                  // },

                  "COFFE-BASURA": {
                    texture: "coffeEmptyTrash",
                    scale: 0.1,
                  },
                  "COFFE-PICNICTABLE": {
                    texture: "newPicnicTable",
                    scale: 0.4,
                  },
                  "COFFE-METEGOL": {
                    texture: "coffeMetegol",
                    scale: 0.08,
                  },
                  "COFFE-SHELVES": {
                    texture: "coffeShelves",
                    scale: 0.2,
                  },
                };
                const item = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  textures[objectKey].texture
                );
                item.self.setScale(textures[objectKey].scale);
                break;
              case "DESKT1":
                const deskt1 = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "newDeskt1"
                );
                deskt1.self.setScale(0.5);
                deskt1.isoZ += 100; // distancia entre bloques
                deskt1.self.displayOriginY = 50;

                this.tileCreator.createBloqueBuildingTile(
                  b + 1,
                  c,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b - 1,
                  c,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c + 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c - 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b - 1,
                  c - 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b + 1,
                  c - 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                this.tileCreator.createBloqueBuildingTile(
                  b - 2,
                  c - 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );

                break;

              case "DESKT2":
                const deskt2 = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "newDeskt2"
                );
                deskt2.self.setScale(0.5);
                deskt2.isoZ += 80; // distancia entre bloques
                deskt2.self.displayOriginY = 50;
                deskt2.self.displayOriginX = 90;

                this.tileCreator.createBloqueBuildingTile(
                  b - 1,
                  c,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                /*this.tileCreator.createBloqueBuildingTile(
                  b,
                  c + 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );*/
                this.tileCreator.createBloqueBuildingTile(
                  b,
                  c - 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );
                /*this.tileCreator.createBloqueBuildingTile(
                  b - 1,
                  c - 1,
                  that,
                  conf,
                  pos,
                  "blockBuildingEmpty"
                );*/

                break;

              case "BEACHT1":
                const beacht1 = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "beacht1"
                );
                beacht1.self.setScale(0.3);
                beacht1.isoZ += 90; // distancia entre bloques
                beacht1.self.displayOriginY = 50;

                break;
              case "BEACHT2":
                const beacht2 = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "beacht2"
                );
                beacht2.self.setScale(0.3);
                beacht2.isoZ += 90; // distancia entre bloques
                beacht2.self.displayOriginY = 50;

                break;

              case "TRAFFIC-LIGHT-A":
                const ta = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "traffic-light-a"
                );
                // ta.self.setScale(0.5);
                // ta.isoZ += 100; // distancia entre bloques
                // ta.self.displayOriginY+= 50;
                ta.self.displayOriginX -= 35;
                ta.isoZ += 27;

                break;

              case "TRAFFIC-LIGHT-B":
                const tb = this.tileCreator.createTrafficLightTile(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "traffic-light-b"
                );
                tb.self.displayOriginX -= 56;
                tb.self.displayOriginY += 10;
                tb.isoZ += 27;
                break;
              case "BUILDING":
                this.tileCreator.createBuilding(
                  b,
                  c,
                  that,
                  conf,
                  pos,
                  "buildingTEST"
                );
                break;
              case "BEACHWINDOW1":
              case "BEACHWINDOW2":
              case "BEACHWINDOW3":
              case "BUILDINGBLOCK":
              case "BUILDINGWINDOW1":
              case "BUILDINGWINDOW2":
              case "BUILDINGWINDOW3":
              case "BUILDINGWINDOWB1":
              case "BUILDINGWINDOWB2":
              case "BUILDINGWINDOWB3":
              case "BUILDINGDOORLEFTCORNER":
              case "BUILDINGDOORRIGHTCORNER":
              case "BUILDINGDOORLEFT":
              case "BUILDINGDOORRIGHT":
              case "BUILDINGTOP1":
              case "BUILDINGTOP2":
              case "BUILDINGTOP3":
              case "BUILDINGTOP4":
              case "BUILDINGTOP5":
              case "BUILDINGTOP1B":
              case "BUILDINGTOP2B":
              case "BUILDINGTOP3B":
              case "BUILDINGTOP4B":
              case "BUILDINGTOP5B":
              case "BUILDINGBLOCK-B":
              case "BUILDINGBLOCKBASE":
              case "BUILDINGBLOCKEMPTY":
              case "BUILDINGBLOCK2":
              case "BUILDINGWINDOWB12":
              case "BUILDINGDOORLEFT2":
              case "BUILDINGDOORRIGHT2":
              case "BUILDINGDOORLEFT3":
              case "BUILDINGDOORRIGHT3":
              case "BUILDINGWINDOW11":
              case "BUILDINGWINDOW12":
              case "BUILDINGWINDOW13":
              case "BUILDINGWINDOWB11":
              case "BUILDINGWINDOWB12":
              case "BUILDINGWINDOWB13":
              case "BUILDINGBRICK1":
              case "BUILDINGBRICK2":
              case "BUILDINGGLASS1":
              case "BUILDINGGLASS2":
              case "BUILDINGGLASS3":
              case "BLOCKWAY":
                const stringMap = {
                  BEACHWINDOW1: "beachWindow1",
                  BEACHWINDOW2: "beachWindow2",
                  BEACHWINDOW3: "beachWindow3",
                  BUILDINGBLOCK: "blockBuilding",
                  BUILDINGWINDOW1: "window1",
                  BUILDINGWINDOW2: "window2",
                  BUILDINGWINDOW3: "window3",
                  BUILDINGWINDOWB1: "windowB1",
                  BUILDINGWINDOWB2: "windowB2",
                  BUILDINGWINDOWB3: "windowB3",
                  BUILDINGDOORLEFTCORNER: "buildingDoorLeftCorner",
                  BUILDINGDOORRIGHTCORNER: "buildingDoorRightCorner",
                  BUILDINGDOORLEFT: "doorLeftSide",
                  BUILDINGDOORRIGHT: "doorRightSide",
                  BUILDINGTOP1: "test1",
                  BUILDINGTOP2: "test2",
                  BUILDINGTOP3: "test3",
                  BUILDINGTOP4: "test4",
                  BUILDINGTOP5: "test5",
                  BUILDINGTOP1B: "test1B",
                  BUILDINGTOP2B: "test2B",
                  BUILDINGTOP3B: "test3B",
                  BUILDINGTOP4B: "test4B",
                  BUILDINGTOP5B: "test5B",
                  "BUILDINGBLOCK-B": "blockBuilding-b",
                  BUILDINGBLOCKBASE: "blockBuildingBase",
                  BUILDINGBLOCKEMPTY: "blockBuildingEmpty",
                  BUILDINGBLOCK2: "block2",
                  BUILDINGDOORLEFT2: "door11",
                  BUILDINGDOORRIGHT2: "door14",
                  BUILDINGDOORLEFT3: "door12",
                  BUILDINGDOORRIGHT3: "door13",
                  BUILDINGWINDOW11: "window16",
                  BUILDINGWINDOW12: "window15",
                  BUILDINGWINDOW13: "window14",
                  BUILDINGWINDOWB11: "window13",
                  BUILDINGWINDOWB12: "window12",
                  BUILDINGWINDOWB13: "window11",
                  BUILDINGBRICK1: "brick1",
                  BUILDINGBRICK2: "brick2",
                  BUILDINGGLASS1: "glass1",
                  BUILDINGGLASS2: "glass2",
                  BUILDINGGLASS3: "glass3",
                  BLOCKWAY: "blockBuildingEmpty",
                };

                if (
                  objectKey === "BUILDINGBLOCKEMPTY" &&
                  this.mapType !== "ROOM" &&
                  this.mapType !== "ENTREPRENEURSHIP"
                ) {
                  // nothing
                } else {
                  let t = this.tileCreator.createBloqueBuildingTile(
                    b,
                    c,
                    that,
                    conf,
                    pos,
                    stringMap[objectKey]
                  );
                  if (objectKey === "BLOCKWAY") t.self.type = "BLOCK_WAY";
                  if (
                    [
                      "BUILDINGGLASS1",
                      "BUILDINGGLASS2",
                      "BUILDINGGLASS3",
                    ].indexOf(objectKey) > -1
                  ) {
                    t.setBaseAlpha(0.9);
                  }
                }
                break;
            }
          },
        };
        //@ts-ignore
        m.drawMap(this.isoGroup, conf, lvlConf);
      }
    }
  }

  drawCircleOfTouchMovementIfExistOnUiCamera() {
    if (this.UICamera) {
      if (this.touchGraphics) {
        this.touchGraphics.clear();
      } else {
        this.touchGraphics = this.add.graphics();
        this.cameras.main.ignore(this.touchGraphics);
      }
      if (this.willListenTouch) {
        const DARKVIOLET = 0x9400d3;
        if (this.originalTouchX != 0 && this.originalTouchY != 0) {
          this.touchGraphics.lineStyle(3, DARKVIOLET, 0.1);
          this.touchGraphics.strokeCircle(
            this.originalTouchX,
            this.originalTouchY,
            80
          );
          // fill circle with solid color and opacity
          this.touchGraphics.fillStyle(DARKVIOLET, 0.4);
          this.touchGraphics.fillCircle(
            this.originalTouchX,
            this.originalTouchY,
            80
          );
          // this.touchGraphics.lineBetween(
          //   this.originalTouchX,
          //   this.originalTouchY,
          //   this.originalTouchX + this.listenTouchDirectionX,
          //   this.originalTouchY + this.listenTouchDirectionY
          // );
          // add a circle at the end of the line
          this.touchGraphics.fillStyle(DARKVIOLET, 0.9);
          this.touchGraphics.fillCircle(
            this.originalTouchX + this.listenTouchDirectionX,
            this.originalTouchY + this.listenTouchDirectionY,
            30
          );
        }
      }
    }
  }
  persistTouchDetection() {
    this.touchDetected = true;
    // debounce call to persisfalset touch detection
    if (this.touchDetectionTimer) this.touchDetectionTimer.destroy();
    this.touchDetectionTimer = this.time.delayedCall(1000, () => {
      this.touchDetected = false;
    });
  }

  checkTouchCursor() {
    if (this.willListenTouch) {
      this.persistTouchDetection();
      let newCursor = {
        ...this.touchCursors,
      };
      newCursor.right.isUp =
        !this.touchCursors.down.isDown || this.touchCursors.up.isDown;
      newCursor.left.isUp =
        !this.touchCursors.up.isDown || this.touchCursors.down.isDown;
      newCursor.up.isUp =
        !this.touchCursors.right.isDown || this.touchCursors.left.isDown;
      newCursor.down.isUp =
        !this.touchCursors.left.isDown || this.touchCursors.right.isDown;

      newCursor.right.isDown = this.listenTouchDirectionX > 0;
      newCursor.left.isDown = this.listenTouchDirectionX < 0;
      newCursor.up.isDown = this.listenTouchDirectionY < 0;
      newCursor.down.isDown = this.listenTouchDirectionY > 0;

      // remove isDown if the oppossitive is bigger
      if (
        Math.abs(this.listenTouchDirectionX) >
        Math.abs(this.listenTouchDirectionY)
      ) {
        newCursor.up.isDown = false;
        newCursor.down.isDown = false;
      } else {
        newCursor.right.isDown = false;
        newCursor.left.isDown = false;
      }
    }
  }
  update() {
    const self = this;
    if (self.player && self.cursors) {
      this.checkTouchCursor();
      if (this.touchDetected) {
        self.player.updateAnimByTouch(self.touchCursors);
      } else {
        self.player.updateAnim(self.cursors);
      }
      makeOpacityNearPlayer(this);
      if (
        this.player?.isoX === 660 &&
        this.player?.isoY === 55 &&
        this.player.facingDirection === "e"
      )
        this.NPCTalker?.interact();
      else this.NPCTalker?.breakInteract();
    }

    // check touchCursors

    this.drawCircleOfTouchMovementIfExistOnUiCamera();
  }
}
