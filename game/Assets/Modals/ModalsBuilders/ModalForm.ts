import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { ModalFormQuestion } from "./ModalFormQuestion";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import { configMinigameType, missionsType, modalType, questionFormsType } from "../ModalTypes";
import { PinIsoSpriteBox } from "../../pinIsoSpriteBox";
import possibleSounds from "../../../../game/modules/possibleSounds.json";




export class ModalForm extends ModalBase {
    scene: RPG;
    agreeButton: ButtonComponent;
    cancelButton: ButtonComponent;
    activeTween: Phaser.Tweens.Tween | null = null;
    lastIndex: number = 0;
    feedbackResponse: number = 0;
    questionsContainer: Phaser.GameObjects.Container;
    correctAnswers: number = 0;
    feedback: string[] = [];
    feedbackText: string = "";
    finished: boolean = false;
    missionToDraw: missionsType;
    questionsData: questionFormsType[] = [];
    minigameConfig: configMinigameType = {} as configMinigameType;
    eventCenter = EventsCenterManager.getInstance();

    pin: PinIsoSpriteBox | undefined;
    constructor(
        scene: RPG,
        x: number,
        y: number,
        missionsSelected: missionsType,
        pin: PinIsoSpriteBox | undefined,
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.missionToDraw = missionsSelected;
        this.pin = pin || undefined;
        this.correctAnswers = 0;
        this.backgroundLess.removeInteractive();// lo saco para que no se cierre con el fondo

        this.eventCenter.turnEventOn("RPG", this.eventCenter.possibleEvents.OPEN_MODAL_FORM, (missionsSelected: missionsType) => {
        }, this);

        if (missionsSelected.configMinigameId) {
            let minigameId = missionsSelected.configMinigameId;
            this.questionsData = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_QUESTIONS, minigameId);
        }

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)



        //const allNews = globalData.news

        this.feedback = [
            "Parece que ninguna respuesta fue acertada. Vuelve a intentarlo para mejorar tu puntuación.",
            "¡Buen comienzo! Sigue practicando y alcanza la meta en tu próximo intento.",
            "¡Vas por buen camino! Cada paso te acerca más al éxito. Inténtalo de nuevo y consíguelo todo.",
            "¡Eres imparable! Sigue avanzando, nuevas aventuras te esperan.",
        ];

        this.questionsContainer = this.scene.add.container(0, -50);
        const leftButtonContainer = this.scene.add.container(-140, 0);
        const rightButtonContainer = this.scene.add.container(140, 0);

        const checkFeedback = (correctAnswers: number) => {
            switch (correctAnswers) {
                case 0:
                    return this.feedbackResponse = 0;
                case 1:
                    return this.feedbackResponse = 1;
                case 2:
                    return this.feedbackResponse = 2;
                default:
                    return this.feedbackResponse = 3;
            }

        }

        const loadQuestions = (questions: questionFormsType[], lastIndex: number) => {
            if (lastIndex > 0) this.questionsContainer.removeAll(true);
            let activeQuestion = questions[lastIndex];
            const modalFormQuestion = new ModalFormQuestion(this.scene, 0, 0, activeQuestion, (response: string) => {   
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalForm.choseOption);
                if (lastIndex < questions.length - 1) {
                    this.lastIndex = lastIndex + 1;
                    if (response == activeQuestion.correctAnswer[0]) this.correctAnswers++;
                    loadQuestions(questions, this.lastIndex);
                } else {
                    if (response == activeQuestion.correctAnswer[0]) this.correctAnswers++;
                    modalFormQuestion.setVisible(false);
                    this.finished = true;

                    if (questions.length === 1) {
                        if (this.correctAnswers > 0) this.feedbackResponse = 3;
                        else this.feedbackResponse = 0;

                    } else {
                        checkFeedback(this.correctAnswers);
                    }
                    this.handleClose();
                    if(this.pin) this.pin.self.destroy();

                    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.FINISH_MODAL,
                        {
                            modalType: modalType.FINISH, pin: undefined, mission: missionsSelected, responses: this.feedbackResponse, maxQuestions: questions.length, callback: () => {
                                scene.modalManager.destroyModal();
                                this.eventCenter.emit(
                                    this.eventCenter.possibleEvents.FINISH_MISSION,
                                    this.missionToDraw.id,
                                    this.correctAnswers,
                                    questions.length
                                );
                            }
                        }
                    );
                }
            });
            this.questionsContainer.add(modalFormQuestion);
        }

        //const availableNews = allNews.filter(news => !news.readed);
        //if (availableNews.length === 1) this.eventCenter.emit(this.eventCenter.possibleEvents.RESTART_NEWS, undefined);
        
        //Modals containers
        const topContainer = this.scene.add.container(0, -170);


        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "formBackground").setOrigin(0.5).setInteractive();;

        //LEFT BUTTON
        this.agreeButton = new ButtonComponent(this.scene, -140, 0, 200, "ACEPTAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalForm.buttonClose);
            //@ts-ignore
            loadQuestions(this.questionsData, this.lastIndex);
            buttonsContainer.setVisible(false);
        });


        //right button
        this.cancelButton = new ButtonComponent(this.scene, 140, 0, 200, "CANCELAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalForm.buttonClose);
        });

        //TOP CONTAINER
        /*const btnExit_p = new ButtonComponent(this.scene, 285, -40, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.HIDE_SHOW_PINS, true);
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalForm.buttonClose);
        });*/
 
        const title = new TitleComponent(this.scene, 0, -20, missionsSelected.title, 300);

        topContainer.add([
            title,
            //btnExit_p,
        ]);

        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 220);

        //@ts-ignore
        loadQuestions(this.questionsData, this.lastIndex);
        buttonsContainer.setVisible(false);

        buttonsContainer.add([
            this.agreeButton,
            this.cancelButton

        ]);


        this.modalContainerWithElements.add([
            modalBackground,
            topContainer,
            this.questionsContainer,
            buttonsContainer
        ]);
    }
}