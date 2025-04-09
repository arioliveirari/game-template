import Phaser from "phaser";
import RPG from "./gameIndex";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
import { PossibleTrofy } from "./services/EventChallengeListener";
import LocalStorageService from "./services/LocalStorageService";

import MissionModule from "./modules/MissionModule";

export type globalState = {
 testState: string
  testSubmodule: MissionModule
};

export default class GlobalDataManager extends Phaser.Scene {
  public alreadyLoadData: boolean = false;
  private state: globalState;
  private INITIAL_STATE: globalState;
  private localStorageCenter = LocalStorageService.getInstance();
  eventCenter = EventsCenterManager.getInstance();
  constructor() {

    super({ key: "GlobalDataManager", active: true });

    this.INITIAL_STATE = {
      testState: "test",
      testSubmodule: new MissionModule()
    };

    this.state = this.INITIAL_STATE;
    //Events  -->
    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.CHANGE_SCENE,
      (data: any) => {
        console.log(this.state, "PRE CHANGE")
        this.time.delayedCall(1000, () => {
          this.state.testSubmodule.changeStateTest();
          console.log(this.state, "POST CHANGE")
        }, [], this);
      },
      this
    );
  }

  create() {
    console.log("ARIELITO ENTRO ACA AL MANAGER DE GLOBAL DATA MANAGER", this.state);  
  }

  update() { }
}
