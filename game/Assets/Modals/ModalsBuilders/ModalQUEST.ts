import RPG from "@/game/rpg";
import { ModalConfig, ProductToBuy, modalType } from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { PinIsoSpriteBox } from "../../pinIsoSpriteBox";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import possibleSounds from "../../../../game/modules/possibleSounds.json";
import { start } from "repl";
import { time } from "console";

export type infoObject = {
    name: string,
    haveIt: boolean
};

export class ModalQUEST extends ModalBase {
    scene: RPG;
    agreeButton?: ButtonComponent;
    cancelButton?: ButtonComponent;
    infoButton?: ButtonComponent;
    infoObjects?: infoObject[];
    infoHideShow: boolean = false;
    requireDurationText?: Phaser.GameObjects.Text;
    requireObjectsText?: Phaser.GameObjects.Text;
    activeTween: Phaser.Tweens.Tween | null = null;


    eventCenter = EventsCenterManager.getInstance();
    constructor(
        scene: RPG,
        x: number,
        y: number,
        pin: PinIsoSpriteBox | undefined
    ) {
        super(scene, x, y);
        this.scene = scene;

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)
        const { filteredMissions, allMissions } = globalData.missionModule.getState()
        if (filteredMissions && allMissions) {
            let availableMissions = [...filteredMissions];
            let texture = globalData.wizzardModule.getState().texture
            if (this.scene.stateGlobal.wizzardModule.getState().isActive) this.createRandomWizard(0.8, Phaser.Math.Between(4, 5), texture);

            const checkInAllMissions = (idToCheck: number) => {
                let mission = allMissions.find(mission => mission.id === idToCheck);
                return mission;  // mission
            }
            let missionsSelected = availableMissions[Math.floor(Math.random() * availableMissions.length)];
            if (pin && pin.assignMission) {
                missionsSelected = availableMissions.find(mission => mission.id === pin.assignMission) || checkInAllMissions(pin.assignMission) || missionsSelected;
            }

            const handleAgreeModal = (amount: number, timePass: number) => {
                // this.eventCenter.emitEvent(this.eventCenter.possibleEvents.FINISH_MISSION, missionsSelected.id);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.INPROGRESS_MISSION, { id: missionsSelected?.id, map: this.scene.mapType, mission: missionsSelected });
                if (pin) {
                    pin.self.destroy();
                }
            }
            const modalConfig: ModalConfig = {
                type: modalType.QUEST,
                requirements: missionsSelected.requirements,
                // requires: "camera",
                // requirePicture: "camaraWhite",
                title: missionsSelected.title,
                picture: missionsSelected.picture,
                // picture: missionsSelected.picture,
                time: missionsSelected.time,
                text: missionsSelected.description,
                reward: globalData.rewards.find(reward => missionsSelected.rewardId === reward.id) || { id: 1, money: 0, reputation: 0, happiness: 0 },
                agreeFunction: handleAgreeModal,
            }
            const inventary = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_INVENTARY, null);

            //Modals containers
            const topContainer = this.scene.add.container(0, -205);
            const leftContainer = this.scene.add.container(-170, 20);
            const rightContainer = this.scene.add.container(205, 20);
            const infoContainer = this.scene.add.container(380, -70);
            const dayContainer = this.scene.add.container(-180, -5);


            //backgroundModal
            const modalBackground = this.scene.add.image(0, 0, "questBackground").setOrigin(0.5).setInteractive();
            const modalBackgroundTop = this.scene.add.image(0, -200, "questBackgroundTop").setOrigin(0.5);

            modalBackground.on("pointerup", () => {
                infoClose();
            });

            //modalContainerWithElements.setAngle(35);

            //LEFT BUTTON

            this.agreeButton = new ButtonComponent(this.scene, 0, 0, 210, "ACEPTAR", "questAccept", "#ffffff", "16", 1.2, 1, () => {
                if (canDoMission && (globalData.timeOfDay + modalConfig.time <= (globalData.inversionModule.isActive ? 8 : 4))) {
                    modalConfig.agreeFunction(modalConfig.reward, modalConfig.time);
                    this.handleClose();
                    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalMission.buttonAccept);
                }
            });
            this.agreeButton.background.setScale(0.8);

            const btnExit = new ButtonComponent(this.scene, 355, 0, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
                leftTextNotMoney.setVisible(false);
                this.handleClose();
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalMission.buttonCancel);
            });


            //@ts-ignore
            const title_q = new TitleComponent(this.scene, 0, 5, modalConfig.title, 400);

            topContainer.add([
                title_q,
                btnExit,
            ]);

            //LEFT CONTAINER

            //@ts-ignore
            const photo_q = this.scene.add.image(-115, 60, modalConfig.picture).setScale(1);
            const graphics = this.scene.make.graphics();
            graphics.fillRoundedRect(-100, -100, 170, 220, 20);
            const mask = graphics.createGeometryMask();
            // photo_q.setMask(mask);



            //RIGHT CONTAINER
            //row 1
            const requireBackground = this.scene.add.image(-95, -35, "quesContainerBackground1").setOrigin(0.5).setScale(1);
            const rewardBackground = this.scene.add.image(-95, 100, "quesContainerBackground2").setOrigin(0.5).setScale(1);
            rightContainer.add([
                requireBackground,
                rewardBackground,
            ]);
            //@ts-ignore
            //const descp = new TitleComponent(this.scene, -24, -110, `${modalConfig.text}`, 300, '14', 'MontserratSemiBold', '#ffffff', 0);
            const description = this.scene.add.text(-215, -155, `${modalConfig.text}`, {
                fontFamily: "MontserratSemiBold",
                fontSize: '18px',
                color: '#ffffff',
                wordWrap: { width: 780 },
                fixedWidth: 780,
                fixedHeight: 0,
            }).setAlign('left').setLineSpacing(3);
            //const timeIcon_q = this.scene.add.image(-145, -105, "iconClock").setOrigin(0.5);

            leftContainer.add([
                // graphics,
                photo_q,
                description,
            ]);

            //row 2
            //const subTitleBackground_1_q = this.scene.add.image(-185, -80, "barraTitle").setOrigin(0, -0.1).setScale(1);
            const subTitle_1_q = this.scene.add.text(-120, -70, "REQUISITOS", {
                fontFamily: "MontserratSemiBold",
                fontSize: '18px',
                color: '#ffffff',
            });

            const durationTitle = this.scene.add.text(-360, -70, "DURACIÓN", {
                fontFamily: "MontserratSemiBold",
                fontSize: '18px',
                color: '#ffffff',
            });

            const infoClose = () => {
                if (infoContainer) infoContainer.setVisible(false);
                this.infoHideShow = false;
            }

            //row 3
            this.infoButton = new ButtonComponent(this.scene, 150, -60, 200, "", "infoIcon", "#ffffff", "18", 0.8, 0.8, () => {

                if (this.infoObjects?.length === 0) return;
                if (this.infoHideShow && infoContainer) infoContainer.setVisible(false);
                if (!this.infoHideShow && infoContainer) infoContainer.setVisible(true);
                let newBox = this.scene.add.image(0, 0, `infoContainer_${this.infoObjects?.length}`).setOrigin(0).setScale(1);
                infoContainer.add(newBox);
                this.infoObjects?.forEach((info, index) => {
                    let color = info.haveIt ? '#ffffff' : '#ff0000';
                    const text = this.scene.add.text(13, 15 + index * 25, `- ${info.name}`, {
                        fontFamily: "Montserrat",
                        fontSize: '14px',
                        color: color,
                        wordWrap: { width: 200 },
                        fixedWidth: 200,

                    }).setAlign('left').setOrigin(0);
                    infoContainer.add(text);
                });
                this.infoHideShow = !this.infoHideShow;
            });

            this.requireObjectsText = this.scene.add.text(-120, -2, "Elementos insuficientes", {
                fontFamily: "Montserrat",
                fontSize: '14px',
                color: '#ffff00',
                fontStyle: 'italic',
            }).setVisible(false);

            this.requireDurationText = this.scene.add.text(-360, -2, 'Tiempo insuficiente', {
                fontFamily: "Montserrat",
                fontSize: '14px',
                color: '#ffff00',
                fontStyle: 'italic',
            }).setVisible(false);

            this.infoButton.setScale(0.8);
            rightContainer.add(this.infoButton);

            this.infoObjects = [];
            let haveObjects: boolean[] = []
            const requirementsData = globalData.items.filter((item) => modalConfig.requirements.includes(item.id));
            for (let i = 0; i < requirementsData.length; i++) {
                //@ts-ignore
                const requireItem = this.scene.add.image(-105 - i * -35, -25, requirementsData[i].imageInMission + 'Off').setScale(.8)
                rightContainer.add(requireItem);
                //Check si tiene el objeto
                const haveObject = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.CHECK_MISSION_REQUIREMENTS, requirementsData[i]);
                if (haveObject) {
                    // requireItem.setTint(0x00ff00);
                    requireItem.setTexture(requirementsData[i].imageInMission + 'On');
                    this.agreeButton.setAlpha(1);
                    haveObjects.push(true);
                    this.requireObjectsText.setVisible(false);
                    this.infoObjects?.push({ name: requirementsData[i].name, haveIt: true });
                } else {
                    // requireItem.setTint(0xff0000);
                    requireItem.setTexture(requirementsData[i].imageInMission + 'Off');
                    this.agreeButton.setAlpha(0.5);
                    haveObjects.push(false);
                    this.requireObjectsText.setVisible(true);
                    this.infoObjects?.push({ name: requirementsData[i].name, haveIt: false });
                }
            }




            const createTimeBlocks = (globalData: any, modalConfig: any) => {
                let daySetUp: {
                    type: string | number
                    status?: string
                    color?: string
                }[] = new Array(4).fill(undefined).map((_, index) => ({ type: index + 1, status: "Empty", color: "Green" }));
                console.log("ARIEL DIAS INICIALES", daySetUp.map(_ => _.status))
                const lastToFirst = (_: any) => [_.pop(), ..._];

                const timeOfDay = globalData.timeOfDay;
                const timeRequired = modalConfig.time;
                const dayLong = globalData.inversionModule.isActive ? 8 : 4;
                console.log("ARIEL TIME REQUIRED", timeRequired);
                let limit = dayLong - timeOfDay;
                let timePossible = (timeRequired <= limit)

                if (dayLong == 4) {
                    for (let index = 4; index > timeOfDay; index--) {
                        daySetUp = lastToFirst([...daySetUp]);
                    }
                } else {
                    for (let index = 4; index > Math.floor(timeOfDay / 2); index--) {
                        daySetUp = lastToFirst([...daySetUp]);
                    }
                }
                console.log("DIAS ARIEL 1" , daySetUp.map(_ => _.status))

                // remove all after timeRequired


                if (!timePossible) {
                    daySetUp = daySetUp.map((_, i) => {
                        if (i + 1 <= timeRequired) {
                            return { ..._, color: "Red", status: "Full" }
                        } else {
                            return { ..._, color: "Red", status: "Empty" }
                        }
                    })
                } else {
                    // iterate all before timeRequired and set color Red
                    daySetUp = daySetUp.map((_, i) => {
                        if (i + 1 <= timeRequired) {
                            return { ..._, color: "Green", status: "Full" }
                        } else {
                            return { ..._, color: "Green", status: "Empty" }
                        }
                    })
                }
                
                if (dayLong == 4) daySetUp.splice(limit, 0, { type: "separator" });



                let magicNumber = 45;
                let passSeparator: false | number = false;
                let howManySmall = 0;

                if (dayLong == 4) {
                    daySetUp.forEach((_, i) => {

                        if (passSeparator !== false && i > passSeparator) {
                            howManySmall++;
                        }

                        if (_) {
                            if (_.type === "separator") {
                                const block = this.scene.add.graphics();
                                block.fillStyle(0xffffff, 1);
                                block.fillRect(0, -20, 2, 40);
                                block.x = ((magicNumber / 1.8) + i * magicNumber)
                                block.y = 0;

                                dayContainer.add(block);

                                passSeparator = i;
                            } else {
                                let texture = _.type + _.status! + _.color!;
                                let spaceX = magicNumber + i * magicNumber
                                spaceX = spaceX - (howManySmall * 10)
                                if (passSeparator !== false) spaceX -= 32
                                const block = this.scene.add.image(spaceX, 0, texture).setScale(howManySmall ? 0.85 : 1);

                                dayContainer.add(block);
                            }
                        }


                    })
                } else {
                    // 4 escenarios, es full y par => termina empty / es full e impar => termina half / es half y par => termina half / es half e impar => terminfinaa full    
                    let startsFull = timeOfDay % 2 === 0 ? true : false;
                    let isEven = timeRequired % 2 === 0 ? true : false;
                    let endsFull = false

                    if (startsFull && isEven || !startsFull && !isEven) endsFull = true;
                    let slotsUsed = timeRequired / 2;
                    if (slotsUsed % 1 !== 0 && startsFull || slotsUsed % 1 !== 0 && !startsFull || slotsUsed % 1 === 0 && !startsFull) slotsUsed = Math.floor(slotsUsed) + 1;
                    else slotsUsed = Math.floor(slotsUsed);
                    console.log("ARIEL SLOTS USED", slotsUsed)
                    daySetUp = daySetUp.map((_, i) => {
                        if (i + 1 < slotsUsed) {
                            _.status = "Full";
                        } else if (i + 1 === slotsUsed) {  
                            if (endsFull) {
                                _.status = "Full";
                            } else {
                                _.status = "Half";
                            }
                        } else {
                            _.status = "Empty";
                        }

                        //   if(_.status === "Full") {
                        //     console.log("ARIEL 123") // acá está el problema
                        //     if(i > loop) {
                        //         _.status = "Empty";
                        //     } else {
                        //         if(i + 1 <= loop && !odd){
                        //             _.status = "Full";
                        //         } else {
                        //             console.log("ARIEL ENTRO ACA 12314")
                        //             _.status = "Half";
                        //         }
                        //     }
                        //   }
                        return _
                    })
                    daySetUp.splice(Math.ceil(limit / 2), 0, { type: "separator" });

                    console.log("DIAS ARIEL 2" , daySetUp.map(_ => _.status))
                    let moveSplitToEnd = false
                    daySetUp.forEach((_, i) => {

                        if (passSeparator !== false && i > passSeparator) {
                            howManySmall++;
                        }

                        if (_) {
                            if (_.type === "separator") {
                                const block = this.scene.add.graphics();
                                block.fillStyle(0xffffff, 1);
                                block.fillRect(0, -20, 2, 40);
                                block.x = ((magicNumber / 1.8) + i * magicNumber)
                                block.y = 0;

                                dayContainer.add(block);

                                passSeparator = i;
                            } else {
                                let texture = _.type + _.status! + _.color!;
                                let spaceX = magicNumber + i * magicNumber
                                spaceX = spaceX - (howManySmall * 10)
                                if (passSeparator !== false) spaceX -= 32
                                let parseTimeOfDay = Math.ceil(timeOfDay / 2)
                                if (dayLong == 8 && parseTimeOfDay == _.type && _.status == "Half") {
                                    console.log("ENTRO ACA ARIEL 1")
                                    // check if number in odd
                                    if (timeOfDay % 2 !== 0) {
                                        console.log("ENTRO ACA ARIEL 2")
                                        texture = _.type + "Split"
                                    }
                                }

                                if (moveSplitToEnd && _.status == "Half") {
                                    console.log("ENTRO ACA ARIEL 3")
                                    texture = _.type + "Half" + _.color!
                                    moveSplitToEnd = false
                                }
                                if (timeOfDay % 2 !== 0 && i == 0 && _.status == "Full") {
                                    console.log("ENTRO ACA ARIEL 4")
                                    texture = _.type + "Split"
                                    moveSplitToEnd = true
                                }



                                const block = this.scene.add.image(spaceX, 0, texture).setScale(howManySmall ? 0.85 : 1)

                                dayContainer.add(block);
                            }
                        }


                    })
                }


            };


            createTimeBlocks(globalData, modalConfig);



            const subTitle_2_q = this.scene.add.text(-185, 65, "RECOMPENSAS", {
                fontFamily: "MontserratSemiBold",
                fontSize: '18px',
                color: '#ffffff',
            });

            //@ts-ignore

            const coinIcon = this.scene.add.image(-180, 120, "iconCommon").setScale(0.55);
            const reward_q = this.scene.add.text(-180 - coinIcon.displayWidth / 2 - 10, 120, `${modalConfig.reward.money}`, {
                fontFamily: "MontserratSemiBold",
                fontSize: '24px',
                color: '#ffffff',
            }).setOrigin(1, 0.5);
            const reward_q2 = this.scene.add.text(-110, 120, `${modalConfig.reward.reputation}`, {
                fontFamily: "MontserratSemiBold",
                fontSize: '24px',
                color: '#ffffff',
            }).setOrigin(0.5);

            const reputationIcon = this.scene.add.image(-80, 120, "reputationIcon").setScale(0.6);

            const reward_q3 = this.scene.add.text(-10, 120, `${modalConfig.reward.happiness}`, {
                fontFamily: "MontserratSemiBold",
                fontSize: '24px',
                color: '#ffffff',
            }).setOrigin(0.5);

            const happinessIcon = this.scene.add.image(20, 120, "happinessModalIcon");


            rightContainer.add([
                requireBackground,
                rewardBackground,
                durationTitle,
                subTitle_1_q,
                this.requireObjectsText,
                this.requireDurationText,
                //morningIcon_q,
                //afternoonIcon_q,
                //eveningIcon_q,
                //nightIcon_q,
                subTitle_2_q,
                reward_q,
                coinIcon,
                reward_q2,
                reputationIcon,
                reward_q3,
                happinessIcon,
            ]);

            this.add([
                topContainer,
                leftContainer,
                rightContainer,
                dayContainer
            ]);

            const canDoMission = haveObjects.every((haveObject) => haveObject);

            if (!canDoMission || !(globalData.timeOfDay + modalConfig.time <= (globalData.inversionModule.isActive ? 8 : 4))) {
                this.agreeButton.setAlpha(0.5);
            } else {
                this.agreeButton.setAlpha(1);
            }

            if (this.requireDurationText && !(globalData.timeOfDay + modalConfig.time <= (globalData.inversionModule.isActive ? 8 : 4))) {
                this.requireDurationText.setVisible(true);
                if (this.agreeButton) this.agreeButton.setAlpha(false ? 1 : 0.5);
            }

            //Buttons Container
            const buttonsContainer = this.scene.add.container(0, 220);
            const leftButtonContainer = this.scene.add.container(108, -10);
            const rightButtonContainer = this.scene.add.container(100, 0);

            //not enough money text
            const leftTextNotMoney = this.scene.add.text(0, -30, "NO TIENES SUFICIENTE DINERO", {
                fontFamily: "MontserratSemiBold",
                fontSize: '14px',
                color: '#ff0011',
            }).setOrigin(0.5).setVisible(false);



            leftButtonContainer.add([
                this.agreeButton,
                leftTextNotMoney
            ]);

            //RIGHT BUTTON
            /*this.cancelButton = new ButtonComponent(this.scene, 0, 0, 200, "CANCELAR", "btn", "#ffffff", "16", 1.2, 1,() => {
                leftTextNotMoney.setVisible(false);
                this.agreeButton?.setAlpha(1);
                this.handleClose();
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalMission.buttonCancel);
            });*/



            rightButtonContainer.add([
                //this.cancelButton,
            ]);

            buttonsContainer.add([
                leftButtonContainer,
                rightButtonContainer,
            ]);


            this.modalContainerWithElements.add([
                modalBackground,
                modalBackgroundTop,
                topContainer,
                leftContainer,
                rightContainer,
                dayContainer,
                infoContainer,
                buttonsContainer
            ]);

            this.setVisible(true)
        }

    }
}