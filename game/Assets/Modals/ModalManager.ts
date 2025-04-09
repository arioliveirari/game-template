import RPG from "@/game/rpg";
import { missionsType, modalType } from "./ModalTypes";
import { ModalPC } from "./ModalsBuilders/ModalPC";
import { ModalQUEST } from "./ModalsBuilders/ModalQUEST";
import { ModalBase } from "./ModalsBuilders/ModalBase";
import { ModalNews } from "./ModalsBuilders/ModalNews";
import { MultiViewModal } from "./ModalsBuilders/MultiViewModal";
import { PinIsoSpriteBox } from "../pinIsoSpriteBox";
import { ModalForm } from "./ModalsBuilders/ModalForm";
import { ModalCities } from "./ModalsBuilders/ModalCities";
import { ModalMissionFinish } from "./ModalsBuilders/ModalMissionFinish";
import { ModalBuyRoom } from "./ModalsBuilders/ModalBuyRoom";
import { ModalTrade } from "./ModalsBuilders/ModalTrade";
import { ModalWorld } from "./ModalsBuilders/ModalWorld";
import { ModalMechanic } from "./ModalsBuilders/ModalMechanic";
import { ModalTrofies } from "./ModalsBuilders/ModalTrofies";
import { ModalPCV2 } from "./ModalsBuilders/ModalPCv2";


export class ModalManager {
    scene: RPG;
    activeModal: ModalBuyRoom | ModalPC | ModalQUEST | MultiViewModal | ModalNews | ModalForm | ModalMissionFinish | ModalTrade | ModalCities | ModalWorld | ModalMechanic | ModalTrofies | undefined = undefined;
    pin?: PinIsoSpriteBox;
    mission?: missionsType;
    inSomePlace?: string;
    type?: string;
    constructor(
        scene: RPG,
    ) {
        this.scene = scene;
    }

    createModal(data: { modalType: modalType, lock?: Phaser.GameObjects.Image, pin?: PinIsoSpriteBox, mission?: missionsType, responses?: number, maxQuestions?: number, callback?: Function, tradeIds?: number[], inSomePlace?: string, type?: string }) {
        if (data.pin) this.pin = data.pin;
        if (data.mission?.configMinigameId || data.mission) this.mission = data.mission;
        if (data.inSomePlace) this.inSomePlace = data.inSomePlace;
        if (data.type) this.type = data.type;
        switch (data.modalType) {
            case modalType.QUEST:
                this.activeModal = new ModalQUEST(this.scene, window.innerWidth / 2, window.innerHeight / 2, this.pin);
                break;
            case modalType.PC:
                this.scene.zoomEnabled = false;
                this.activeModal = new ModalPCV2(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.PHONE:
                this.activeModal = new MultiViewModal(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.NEWS:
                this.activeModal = new ModalNews(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                //this.activeModal = new ModalForm(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.FORM:
                //@ts-ignore
                this.activeModal = new ModalForm(this.scene, window.innerWidth / 2, window.innerHeight / 2, this.mission, this.pin);
                break;
            case modalType.CITIES:
                this.activeModal = new ModalCities(this.scene, window.innerWidth / 2, window.innerHeight / 2, this.inSomePlace);
                break;
            case modalType.BUYROOMCOFFE:
                this.activeModal = new ModalBuyRoom(this.scene, window.innerWidth / 2, window.innerHeight / 2, data.lock);
                break;
            case modalType.FINISH:
                this.activeModal = new ModalMissionFinish(this.scene, window.innerWidth / 2, window.innerHeight / 2, data.responses, this.mission?.rewardId ? this.mission?.rewardId : 0, data.maxQuestions ? data.maxQuestions : 0, data.callback ? data.callback : () => { });
                break;
            case modalType.TRADE:
                this.activeModal = new ModalTrade(this.scene, window.innerWidth / 2, window.innerHeight / 2, data.tradeIds ? data.tradeIds : []);
                break;
            case modalType.WORLD:
                this.activeModal = new ModalWorld(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.MECHANIC:
                this.activeModal = new ModalMechanic(this.scene, window.innerWidth / 2, window.innerHeight / 2, this.pin);
                break;
            case modalType.TROFIES:
                this.scene.zoomEnabled = false;
                this.activeModal = new ModalTrofies(this.scene, window.innerWidth / 2, window.innerHeight / 2, this.type);
            default:
                break;
        }
    }

    destroyModal() {
        if (this.activeModal) {
            this.activeModal = undefined;
            this.scene.zoomEnabled = true;
        }
    }
}