import Phaser from "phaser";
import { Events } from "matter";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";

import LocalStorageService from "@/game/services/localStorageServices/LocalStorageService";
import GenericModule from "@/game/modules/GenericModule/GenericModule";

export type globalState = {
  testState: string
  testSubmodule: GenericModule
  lifes: number
  score: number | undefined
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
      testSubmodule: new GenericModule(),
      lifes: 3,
      score: undefined
    };

    this.state = {...this.INITIAL_STATE};

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.GET_STATE,
      () => {
        return {...this.state}
      },
      this
    );

      this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.LOSE_LIFE,
      () => {
        console.log("ARIELITO PERDIó UNA VIDA", {...this.state}.lifes--)
        this.state.lifes -= 1;
        if (this.state.lifes <= 0) {
          const newState = {...this.state, lifes: this.INITIAL_STATE.lifes, score: this.INITIAL_STATE.score};
          this.changeState(newState);
          this.eventCenter.emitEvent(this.eventCenter.possibleEvents.GAME_OVER, {...this.state})
        }
      },
      this
    );

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

  changeState(newState: globalState) {
    this.state = {...newState};
  }

  update() { }
}
