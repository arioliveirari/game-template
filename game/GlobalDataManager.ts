import Phaser from "phaser";
import RPG from "./rpg";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
import {
  configMiniGameScene,
  configMinigameType,
  happinessType,
  Inventory,
  InventoryType,
  Item,
  missionsType,
  modalType,
  newsType,
  ProductToBuy,
  questionFormsType,
  rewardType,
  transactionsType,
} from "./Assets/Modals/ModalTypes";
import newsMockData from "./MockData/News.json";
import ItemsMockData from "./MockData/Items.json";
import rewardsMockData from "./MockData/Rewards.json";
// import missionsMockData from "./MockData/manuNewMissions.json";
import missionsMockData from "./MockData/missionsFinalV1.json";
import tabletMockData from "./MockData/Tablet.json";
import configMinigamesMockData from "./MockData/ConfigMinigames.json";
import questionsFormsMockData from "./MockData/QuestionsForms.json";
import minigamesSceneMockData from "./MockData/minigamesScene.json";
import InversionModule from "./modules/InversionModule";
import WizzardModule from "./modules/WizzardModule";
import SoundModule from "./modules/SoundModule";
import { PossibleCity } from "./helpers/models";
import InventoryModule from "./modules/InventoryModule";
import { walletType } from "./Assets/Modals/ModalsBuilders/ModalTrade";
import BusinessModule from "./modules/BusinessModule";
import LoanModule, { InversionAndLoanType } from "./modules/LoanModule";
import { Chatbox } from "./services/Chatbox";
import { PossibleTrofy } from "./services/EventChallengeListener";
import LocalStorageService from "./services/LocalStorageService";

import MissionModule, { MissionModuleState } from "./modules/MissionModule";
import { DreamType } from "./services/Dreams";

export type stateTypes =
  | number
  | boolean
  | ProductToBuy[]
  | newsType[]
  | missionsType[]
  | Item[]
  | InventoryType
  | happinessType
  | transactionsType[]
  | rewardType
  | newsType
  | PossibleCity[]
  | undefined

export type playerConfig = {
  torso: string;
  head: string;
  legs: string;
};

export type globalState = {
  oceanAnimOn: boolean;

  reputation: number;
  happiness: happinessType;
  blockedMaps: PossibleCity[];
  timeOfDay: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  hoursPassed: number;
  sleepping: boolean;
  mechanicOptions: number[];
  InventoryModule: InventoryModule;
  items: Item[];
  inventary: InventoryType;
  transactions: transactionsType[];

  newsToRead: boolean;
  selectedNews?: newsType;
  news: newsType[];

  rewards: rewardType[];
  configMinigames: configMinigameType[];
  minigamesScene: configMiniGameScene[];
  questionsForms: questionFormsType[];
  businessModule: BusinessModule;
  soundModule: SoundModule;
  wizzardModule: WizzardModule;
  missionModule: MissionModule;
  inversionModule: InversionModule;
  loansModule: LoanModule;
  playerConfig: playerConfig;
  chatModule: Chatbox;
  trofies: PossibleTrofy[];
  tooltips: string[];
  dreamsViewed: string[];
};

export default class GlobalDataManager extends Phaser.Scene {
  public alreadyLoadData: boolean = false;
  private state: globalState;
  private INITIAL_STATE: globalState;
  private localStorageCenter = LocalStorageService.getInstance();
  dayState: "IDLE" | "RUNNING" = "IDLE";
  eventCenter = EventsCenterManager.getInstance();
  constructor() {
    super({ key: "GlobalDataManager", active: true });

    const mechanicOptionsRandomSorted = [1, 2, 3].sort(
      () => Math.random() - 0.5
    );

    this.INITIAL_STATE = {
      oceanAnimOn: false,
      mechanicOptions: mechanicOptionsRandomSorted,
      playerConfig: {
        torso: "00",
        head: "00",
        legs: "00",
      },
      blockedMaps: ["BEACH", "OFFICE"],
      soundModule: new SoundModule(this),
      inversionModule: new InversionModule(),
      wizzardModule: new WizzardModule(),
      chatModule: new Chatbox(),
      reputation: 400,
      happiness: tabletMockData.happiness,
      rewards: rewardsMockData.rewards,

      timeOfDay: 1,
      hoursPassed: 0,
      sleepping: false,

      missionModule: new MissionModule(),
      loansModule: new LoanModule(),
      businessModule: new BusinessModule(),
      InventoryModule: new InventoryModule(),
      items: ItemsMockData.items,
      inventary: {
        physicalMoney: 3500,
        digitalMoney: 4500,
        investedMoney: 0,
        businessFuel: 50,
        items: ItemsMockData.items.filter(
          (item: Item) => item.inInventory
        ) as Item[],
      },
      transactions: [],
      trofies: [],
      tooltips: [],
      dreamsViewed: [],

      newsToRead: false,
      news: newsMockData.news,
      questionsForms: questionsFormsMockData.questions,
      configMinigames: configMinigamesMockData.ConfigMinigames,
      minigamesScene: minigamesSceneMockData.ConfigMinigamesScene,
    };

    //Events  -->

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.DREAM,
      (payload: DreamType) => {
        this.state.dreamsViewed.push(payload.id);
        this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_LOCAL, {
          ...this.state,
        });
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UPDATE_LOCAL,
      (data: globalState) => {
        if (data) this.localStorageCenter.setStates(data);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.CHANGE_GENERIC,
      (payload: { keys: string[]; values: stateTypes[] }) => {
        this.changeState(payload.keys, payload.values);
      },
      this
    );
    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.ADD_CHAT,
      (payload: { id: string }) => {
        this.state.chatModule.addChatMocked(payload);
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.CHAT_OPEN,
          null
        );
      },
      this
    );
    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.BUY_ITEM,
      (payload: Item) => {
        this.addInventary(payload);
        if (payload.buyPrice) {
          const newState = this.changeMoney(
            -payload.buyPrice,
            "digital",
            payload.name
          );
          this.changeState(["inventary"], [newState]);
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UPDATE_BUSINESS_FUEL,
      (payload: number) => {
        const newState = this.changeMoney(
          payload,
          "businessFuel",
          "Uso de maquina"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UPDATE_ITEM_LIFE,
      (itemId: number, value: number, restart: boolean = false) => {
        this.changeItemLife(itemId, value, restart);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UPDATE_BUSINESS,
      (payload: number) => {
        if (!this.state.inversionModule.isActive) return;
        const newState = this.changeMoney(
          payload,
          "physical",
          "Ganancia del negocio"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",  
      this.eventCenter.possibleEvents.TROFIES_UPDATE,
      (payload: PossibleTrofy) => {
        this.updateTrofies(payload);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UNBLOCK_MAP,
      (payload: 'BEACH' | 'OFFICE') => {
        const newState = this.state.blockedMaps.filter((map) => map !== payload);
        this.changeState(["blockedMaps"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.SET_SELECTED_NEWS,
      () => {
        // set one unreaded news as selected
        const news = this.state.news.filter((news) => !news.readed);
        if (news.length) {
          const selectedNews = news[0];
          this.changeState(["selectedNews"], [selectedNews]);
          return selectedNews;
        }
        return null;
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.TOOLTIPS_UPDATE,
      (payload: string[]) => {
        if (payload.length > 0) this.updateTooltips(payload);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.BUY_ITEMS,
      (payload: Item[]) => {
        let moneyLess = 0;
        payload.forEach((item) => {
          this.addInventary(item);
          if (item.buyPrice) moneyLess += item.buyPrice;
        });
        const newState = this.changeMoney(
          -moneyLess,
          "digital",
          "Compra de " + payload.length + " items"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.SELL_ITEMS,
      (payload: Item[]) => {
        let moneyLess = 0;
        payload.forEach((item) => {
          this.removeInventary(item);
          if (item.sellPrice) moneyLess += item.sellPrice;
        });
        const newState = this.changeMoney(
          moneyLess,
          "digital",
          "Venta de " + payload.length + " items"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.HANDLE_INVERSION,
      (payload: {
        type: "add" | "remove";
        inversion: InversionAndLoanType;
      }) => {
        switch (payload.type) {
          case "add":
            const newState = this.changeMoney(
              -payload.inversion.startAmount,
              "digital",
              "Inversion en " + payload.inversion.name
            );
            this.changeState(["inventary"], [newState]);
            break;
          case "remove":
            const newState2 = this.changeMoney(
              payload.inversion.holdAmout,
              "digital",
              "Retiro de inversion " + payload.inversion.name
            );
            this.changeState(["inventary"], [newState2]);
            break;
          default:
            break;
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.HANDLE_LOAN,
      (payload: { type: "add" | "remove"; loan: InversionAndLoanType }) => {
        const interestLoan = payload.loan.interestLoan
          ? payload.loan.interestLoan
          : 0;
        switch (payload.type) {
          case "add":
            const newState = this.changeMoney(
              payload.loan.startAmount,
              "digital",
              payload.loan.name
            );
            this.changeState(["inventary"], [newState]);
            break;
          case "remove":
            let newMoney =
              (payload.loan.startAmount * (100 + interestLoan)) / 100 -
              payload.loan.holdAmout;
            const newState2 = this.changeMoney(
              -newMoney,
              "digital",
              payload.loan.name
            );
            this.changeState(["inventary"], [newState2]);
            break;
          default:
            break;
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.PAY_LOAN,
      (payload: { amount: number; loan: InversionAndLoanType }) => {
        const newState = this.changeMoney(
          -payload.amount,
          "digital",
          "Cuota de " + payload.loan.name
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.READ_NEWSPAPER,
      (newsId: number) => {
        const newNews = this.state.news.map((news) => {
          if (news.id === newsId) {
            news.readed = true;
          }
          return news;
        });
        //newsToRead
        //selectedNews
        let actualNew = this.state.selectedNews;
        if (actualNew?.id === newsId) {
          actualNew.readed = true;
        }
        this.changeState(["news", "selectedNews"], [newNews, actualNew]);
        const news = this.state.news.find((news) => news.id === newsId);
        if (news?.missionId && news?.missionId?.length > 0) {
          news.missionId.forEach((missionId) => {
            this.eventCenter.emit(
              this.eventCenter.possibleEvents.ADD_MISSION,
              missionId
            );
          });
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.BUY_EXPANSION,
      (amount: number) => {
        const newState = this.changeMoney(
          -amount,
          "digital",
          "Compra de expansión del negocio"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.REPAIR_MACHINE,
      (amount: number) => {
        const newState = this.changeMoney(
          -amount,
          "digital",
          "Reparar maquina de cafe"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.FINISH_MISSION,
      (missionId: number, isCorrect: number = 1, maxQuestions: number = 1) => {
        const mission = this.state.missionModule
          .getState()
          .inProgressMissions?.find((mission) => mission.id === missionId);
        this.state.missionModule.handleMissionDone(missionId);

        if (mission) {
          const missionReward = this.state.rewards.find(
            (reward) => reward.id === mission.rewardId
          );

          this.eventCenter.emit(
            this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
            true
          );

          if (missionReward) {

            const newInventory = this.changeMoney(
              maxQuestions <= 1
                ? missionReward.money * isCorrect
                : Math.round((missionReward.money * isCorrect) / maxQuestions),
              "physical",
              "Recompensa de misión " + mission.title
            );
            const keysToBeChanged = ["inventary", "reputation", "happiness"];

            const newReputation =
              this.state.reputation + missionReward.reputation;

            const newHappiness = {
              actualValue:
                this.state.happiness.actualValue + missionReward.happiness,
              maxValue: this.state.happiness.maxValue,
            };
            
            if(missionReward.items){
              // look for item in this.state.items and add it to inventary with inInventory = true
              const newItems = this.state.items.map((item) => {
                if (missionReward.items?.includes(item.id)) {
                  item.inInventory = true;
                  if(newInventory.items.findIndex((i) => i.id === item.id) === -1){
                    newInventory.items.push(item);
                  }
                }
                return item;
              });
            
            }


            const valuesToBeChanged = [
              newInventory,
              newReputation,
              newHappiness,
            ];
            this.changeState(keysToBeChanged, valuesToBeChanged);
          }

          if (mission.time > 0) {
            this.time.delayedCall(400, () => {
              if (mission.relatedMission) {
                this.eventCenter.emit(
                  this.eventCenter.possibleEvents.RELATED_MISSION,
                  mission.relatedMission
                );
              }
              this.eventCenter.emit(
                this.eventCenter.possibleEvents.TIME_CHANGE,
                mission.time
              );
            });
          }
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.INPROGRESS_MISSION,
      (payload: { id: number; map: string }) => {
        const mission = this.state.missionModule.inProgressMission(
          payload.id,
          payload.map
        );

        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
          false
        );
        this.eventCenter.emitEvent(
          this.eventCenter.possibleEvents.CHANGE_GENERIC,
          { keys: [], values: [] }
        );

        const checkWhatToDoWithMission = (mission: missionsType) => {
          if (mission) {
            if (
              !mission.isFollowUp &&
              !mission.isMinigame &&
              !mission.draw &&
              !mission.followUpMission.length
            ) {
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.FINISH_MODAL,
                {
                  modalType: modalType.FINISH,
                  mission: mission,
                  responses: undefined,
                  maxQuestions: undefined,
                  callback: () => {
                    this.eventCenter.emitEvent(
                      this.eventCenter.possibleEvents.FINISH_MISSION,
                      mission.id
                    );
                  },
                }
              );
            } else if (mission.isMinigame) {
              this.eventCenter.emit(
                this.eventCenter.possibleEvents.OPEN_MISSION_BOX,
                mission
              );
              this.eventCenter.emit(
                this.eventCenter.possibleEvents.START_MINIGAME,
                mission
              );
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
                false
              );
            } else if (mission.followUpMission.length) {
              this.eventCenter.emit(
                this.eventCenter.possibleEvents.OPEN_MISSION_BOX,
                mission
              );
              this.eventCenter.emitEvent(
                this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
                true
              );
            }
          }
        };

        if (mission && mission.isFollowUp) {
          const { inProgressMissions } = this.state.missionModule.getState();
          const mission2Close = inProgressMissions?.find((m) => {
            if (m.followUpMission.includes(mission.id)) {
              this.eventCenter.emit(
                this.eventCenter.possibleEvents.FINISH_MISSION,
                m.id
              );
              this.eventCenter.emit(
                this.eventCenter.possibleEvents.CLOSE_MISSION_BOX,
                m
              );
              checkWhatToDoWithMission(mission);
            }
          });
        } else if (mission) {
          checkWhatToDoWithMission(mission);
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.DRAW_MINIGAME,
      (missionId: number) => {
        const mission = this.state.missionModule
          .getState()
          .inProgressMissions?.find((mission) => mission.id === missionId);
        if (mission) {
          this.state.missionModule.drawMinigameFromMission(missionId);
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.ADD_MISSION,
      (missionId: number) => {
        const mission =
          this.state.missionModule.changeMissionToAvailable(missionId);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.RELATED_MISSION,
      (missionRelatedId: number) => {
        this.state.missionModule.changeMissionToAvailable(missionRelatedId);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.LEAVE_CITY,
      () => {
        this.state.missionModule.markInprogressMissionDrawFalse();
        this.eventCenter.emit(
          this.eventCenter.possibleEvents.HIDE_SHOW_PINS,
          true
        );
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.RESTART_NEWS,
      () => {
        const newNews = this.state.news.map((news) => {
          news.readed = false;
          return news;
        });
        this.changeState(["news"], [newNews]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.GET_QUESTIONS,
      (payload: number) => {
        const minigameId = this.getConfigMiniGameById(payload);
        return this.getQuestionsByIds(minigameId[0].itemsId);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.GET_INVENTARY,
      () => {
        return this.getInventary();
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UPDATE_STATE,
      () => {
        const updatedState = this.getState();
        return updatedState;
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.GET_STATE,
      () => {
        return this.getState();
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.SET_STATE,
      (payload: globalState | Partial<globalState> | any) => {
        this.setState(payload.globalState);
        this.updateWizzardModule(payload.wizzardState);
        this.updateBusinnesModule(payload.businessState);
        this.updateInversionModule(payload.inversionState);
        this.updateLoansModule(payload.loansState);
        this.updateChatModule(payload.chatState);
        this.updateMissionModule(payload.missionsState);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.GET_OBJECTINVENTARY,
      (payload: number) => {
        return this.getObjectInventary(payload);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.CHECK_MISSION_REQUIREMENTS,
      (payload: Item) => {
        return this.checkRequirements(payload);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.TIME_CHANGE,
      (payload: number) => {
        this.passTime(payload);
        this.state.inversionModule.dayChanged();
        this.state.loansModule.dayChanged(payload);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.REPAIRMENT,
      (data: {
        name: string;
        item: number;
        consume: number;
        money: number;
        considerBusinessFuel: boolean;
        newLife?: number;
      }) => {
        let oldState = { ...this.state.inventary };
        const _item = oldState.items.find((item) => item.id === data.item);
        if (_item) {
          oldState.items = oldState.items.map((i) => {
            if (i.id == _item.id && data.newLife && _item.life != undefined) {
              i.life =
                data.newLife + _item.life > 100
                  ? 100
                  : data.newLife + _item.life;
              return _item;
            } else return i;
          });
          this.changeState(["inventary"], [oldState]);
        }
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.SLEEP,
      () => {
        const hoursOfDay = this.state.inversionModule.isActive ? 8 : 4;
        this.changeState(
          ["timeOfDay", "hoursPassed", "sleeping"],
          [hoursOfDay, hoursOfDay - this.state.timeOfDay, true]
        );
        this.time.delayedCall(1200, () => {
          this.sleep();
          this.state.inversionModule.dayChanged();
          this.state.loansModule.dayChanged(
            hoursOfDay - this.state.timeOfDay + 1
          );
        });
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.CLEAN_FILTER_MISSIONS,
      () => {
        this.state.missionModule.cleanFilterMissions();
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.DREAM,
      (payload: any) => {
        //TODO COMPLETAR LOGICA DE DREAMS
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.RESTART_GLOBAL_STATE,
      (payload: boolean) => {
        if (payload) this.restartGlobalState();
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.ACTIVATE_INVERSION_MODULE,
      () => {
        // create an array of number from 46 to 69
        const randomNumbers = Array.from({ length: 24 }, (_, i) => i + 46);
        randomNumbers.forEach((m) => {
          this.state.missionModule.changeMissionToAvailable(m);
        });
        this.resetTimeOnInversionActivation();
      },
      this
    );
    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.UPDATE_ANY_MONEY,
      (wallets: walletType[]) => {
        wallets.forEach((wallet) => {
          this.changeAnyMoney(wallet);
        });
        this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
        this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_LOCAL, {
          ...this.state,
        });
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.BUY_WORLD_EXPANSION,
      (amount: number) => {
        const newState = this.changeMoney(
          -amount,
          "digital",
          "Compra de nuevo mundo"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );

    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.PAY_TRAVEL_TICKET,
      (amount: number) => {
        const newState = this.changeMoney(
          -amount,
          "physical",
          "Pago de pasaje"
        );
        this.changeState(["inventary"], [newState]);
      },
      this
    );


    // listen ADD_MISSION_RECORD
    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.ADD_MISSION_RECORD,
      (payload: missionsType) => {
        const oldMissions = this.state.missionModule.getState();
        // check if payload mission exist in allMissions
        let inProgressMissions = oldMissions.inProgressMissions || [];
        if(inProgressMissions.filter((mission) => mission.id === payload.id).length === 0){
          inProgressMissions.push(payload)
        }
        const newObject ={
          ...oldMissions as MissionModuleState,
          inProgressMissions: inProgressMissions,
        }
        this.state.missionModule.setMissions(newObject);

      },
      this
    );

    // listen ADD_RECORD
    this.eventCenter.turnEventOn(
      "GlobalDataManager",
      this.eventCenter.possibleEvents.ADD_RECORD,
      (payload: { key: string, value: any | any[] }) => {

        //@ts-ignore
        const oldValue = this.state[payload.key]
        let arrayValue = Array.isArray(payload.value) ? payload.value : [payload.value]

        // iterate arrayValue, check if id exist on oldValue, otherwise append
        arrayValue.forEach((value) => {
          if (!oldValue.includes(value)) {
            oldValue.push(value)
          }
        })
        
        this.changeState(
          [payload.key],
          [oldValue]
        );
      },
      this
    );
    // <--- Events

    this.state = { ...this.INITIAL_STATE };
    this.state.missionModule.setMissions({
      allMissions: missionsMockData.missions as missionsType[],
      availableMissions: missionsMockData.missions.filter(
        (mission) => mission.available
      ) as missionsType[],
      doneMissions: missionsMockData.missions.filter(
        (mission) => mission.done
      ) as missionsType[],
      inProgressMissions: [],
      filteredMissions: [],
    });
    this.state.chatModule.addMockConversation();
    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.CHAT_OPEN, null);

    const inventoryListener = () => {
      this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
    };
    const missionListener = (missionState: MissionModuleState) => {
      this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
    };

    this.state.InventoryModule.subscribe(inventoryListener);
    this.state.missionModule.subscribe(missionListener);
  }

  changeState(keys: string[], values: stateTypes[]) {
    if (keys.length && values.length) {
      keys.forEach((key, index) => {
        const clone = Array.isArray(values[index])
          ? [...values[index]]
          : typeof values[index] === "object"
            ? { ...values[index] }
            : values[index];
        this.state = { ...this.getState(), [key]: clone };
      });
    }

    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_LOCAL, {
      ...this.state,
    });
  }

  changeItemLife(itemId: number, value: number, restart: boolean = false) {
    const oldState = { ...this.state.inventary };
    const item = oldState.items.find((item) => item.id === itemId);
    if (item && item.life) {
      item.life -= value;
      if (item.life <= 0) {
        item.life = 0;
      }
      if (item.life < 0 && restart) {
        item.life = 100;
      }
      oldState.items = oldState.items.map((i) => {
        if (i.id == itemId) {
          return item;
        } else return i;
      });
    }
    this.changeState(["inventary"], [oldState]);
  }

  changeMoney(
    amount: number,
    type: "physical" | "digital" | "invested" | "businessFuel" = "physical",
    concept: string = "Undefined concept error"
  ) {
    const newTransactions: transactionsType[] = [...this.state.transactions];
    newTransactions.unshift({
      amount: amount,
      description: concept,
      date: new Date().toString(),
    });
    this.changeState(["transactions"], [newTransactions]);
    const oldState = { ...this.state.inventary };
    let newMoney =
      type === "physical"
        ? oldState.physicalMoney
        : type === "digital"
          ? oldState.digitalMoney
          : type === "invested"
            ? oldState.investedMoney
            : oldState.businessFuel;

    newMoney = newMoney ? newMoney + amount : amount;

    switch (type) {
      case "physical":
        return { ...oldState, physicalMoney: newMoney };
      case "digital":
        return { ...oldState, digitalMoney: newMoney };
      case "invested":
        return { ...oldState, investedMoney: newMoney };
      case "businessFuel":
        return { ...oldState, businessFuel: newMoney };
      default:
        return oldState;
    }
  }

  checkRequirements(payload: Item) {
    switch (payload.type) {
      case "money":
        const money = this.state.inventary.physicalMoney;
        return money >= payload.amount;
      case "item":
        const itemId = payload.id;
        const hasItems = this.state.inventary.items
          .map((item) => item.id)
          .includes(itemId);
        return hasItems;
      default:
        return false;
    }
  }

  changeAnyMoney(wallet: walletType) {
    switch (wallet.type) {
      case "physicalMoney":
        this.state.inventary.physicalMoney = wallet.amount;
        break;
      case "digitalMoney":
        this.state.inventary.digitalMoney = wallet.amount;
        break;
      case "investedMoney":
        this.state.inventary.investedMoney = wallet.amount;
        break;
      case "businessFuel":
        this.state.inventary.businessFuel = wallet.amount;
        break;
      default:
        break;
    }
  }

  sleep() {
    const news = this.state.news.filter((news) => !news.readed);
    let selectedNews = undefined;
    if (news.length) {
      selectedNews = news[0];
    }
    this.changeState(
      ["timeOfDay", "hoursPassed", "sleepping", "selectedNews"],
      [1, 0, false, selectedNews]
    );
  }

  passTime(amount: number) {
    const finishOfDay = this.state.inversionModule.isActive ? 8 : 4;
    let newTimeOfDay = this.state.timeOfDay + amount;
    if (newTimeOfDay > finishOfDay) newTimeOfDay = 1;
    this.changeState(["hoursPassed", "timeOfDay"], [amount, newTimeOfDay]);
  }

  resetTimeOnInversionActivation() {
    this.changeState(["timeOfDay", "hoursPassed"], [1, 0]);
  }

  addInventary(item: Item) {
    if (this.state.inventary.items.some((product) => product.id === item.id)) {
      return;
    } else {
      let oldStateItems = [ ...this.state.items ];
      const newItem = { ...item, inInventory: true };
      oldStateItems = oldStateItems.map((i) => {
        if (i.id === item.id) {
          return newItem
        } else return i;
      });
      const oldState = { ...this.state.inventary };
      oldState.items.push(newItem);
      this.changeState(["inventary", "items"], [oldState, oldStateItems]);
    }
  }

  removeInventary(item: Item) {
    if (!this.state.inventary.items.some((product) => product.id === item.id)) {
      return;
    } else {
      let oldStateItems = [ ...this.state.items ];
      const newItem = { ...item, inInventory: false };
      oldStateItems = oldStateItems.map((i) => {
        if (i.id === item.id) {
          return newItem;
        } else return i;
      });
      const oldState = { ...this.state.inventary };
      oldState.items = oldState.items.filter((i) => i.id !== item.id);
      this.changeState(["inventary", "items"], [oldState, oldStateItems]);
    }
  }

  getObjectInventary(id: number) {
    return this.state.inventary.items.find((item) => item.id === id);
  }

  getConfigMiniGameById(id: number) {
    return this.state.configMinigames.filter(
      (configMinigame) => configMinigame.id == id
    );
  }

  restartGlobalState() {
    this.state.chatModule.resetState();
    this.state.inversionModule.isActive = false;
    this.state.wizzardModule.setActive(false)
    this.state.chatModule.addMockConversation();
    this.state.missionModule.setMissions({
      allMissions: missionsMockData.missions as missionsType[],
      availableMissions: missionsMockData.missions.filter(
        (mission) => mission.available
      ) as missionsType[],
      doneMissions: missionsMockData.missions.filter(
        (mission) => mission.done
      ) as missionsType[],
      inProgressMissions: [],
      filteredMissions: [],
    });
    this.state = { ...this.INITIAL_STATE };
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE, true);
  }

  getQuestionsByIds(ids: number[]) {
    return this.state.questionsForms.filter((question) =>
      ids.includes(question.id)
    );
  }

  public getState() {
    return { ...this.state };
  }

  public setState(newState: globalState | Partial<globalState>) {
    Object.keys(newState).forEach((key) => {
      if (newState[key as keyof globalState] !== undefined) {
        // @ts-ignore
        this.state[key as keyof globalState] =
          newState[key as keyof globalState];
      }
    });
  }

  updateWizzardModule(newWizardData: any) {
    this.state.wizzardModule.setWState(newWizardData);
  }

  updateBusinnesModule(newBusinnesData: any) {
    this.state.businessModule.setBState(newBusinnesData);
  }

  updateInversionModule(newInversionData: any) {
    this.state.inversionModule.applyJsonState(newInversionData);
  }

  updateLoansModule(newLoansData: any) {
    this.state.loansModule.applyJsonState(newLoansData);
  }

  updateChatModule(newChatData: any) {
    this.state.chatModule.setStateFromLocalStorage(newChatData);
  }

  updateMissionModule(missionData: MissionModuleState) {
    const inProgressMissions = missionData.inProgressMissions;
    const newInProgressMissions = inProgressMissions.map((mission) => {
      mission.draw = false;
      return mission;
    });
    missionData.inProgressMissions = newInProgressMissions;
    this.state.missionModule.setMissions(missionData);
  }

  updateTrofies(newTrofies: PossibleTrofy) {
    this.state.trofies.push(newTrofies);
  }

  updateTooltips(newTooltips: string[]) {
    if (newTooltips.length > 0) {
      newTooltips.forEach((tooltip) => {
        if (!this.state.tooltips.includes(tooltip)) {
          this.state.tooltips.push(tooltip);
        }
      });
    }
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_LOCAL, {
      ...this.state,
    });
  }

  public getInventary() {
    return this.state.inventary;
  }

  create() {
    const eventCenter = EventsCenterManager.getInstance();
    this.state.newsToRead = true;
    const localData = LocalStorageService.getLocalStorageStates();

    if (Object.keys(localData).length) {
      this.eventCenter.emit(this.eventCenter.possibleEvents.SET_STATE, {
        ...localData,
      });
      this.eventCenter.emit(this.eventCenter.possibleEvents.LAST_TOOLTIP, {
        ...this.state.tooltips,
      });
    }
    this.eventCenter.emitEvent(
      this.eventCenter.possibleEvents.UPDATE_BUSINESS,
      this.state.inversionModule.buisnessMoney
    );
  }

  update() { }
}
