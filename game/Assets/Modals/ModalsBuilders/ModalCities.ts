import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { ModalFormQuestion } from "./ModalFormQuestion";
import { formQuestionType } from "@/game/maps/mapCreationFunctions";
import ButtonComponent from "../ModalComponents/ButtonComponent";
import TitleComponent from "../ModalComponents/TitleComponent";
import { ModalFormFinish } from "./ModalFormFinish";
import { missionsType, modalType } from "../ModalTypes";
import { PinIsoSpriteBox } from "../../pinIsoSpriteBox";
import { changeSceneTo } from "@/game/helpers/helpers";
import possibleSounds from "../../../../game/modules/possibleSounds.json";
import { tweenWorldTransition } from "../ModalComponents/tweenHelpers";
import { PossibleCity } from "@/game/helpers/models";

export class ModalCities extends ModalBase {
    scene: RPG;
    agreeButton: ButtonComponent;
    cancelButton: ButtonComponent;
    activeTween: boolean = false;
    citySelected?: string
    eventCenter = EventsCenterManager.getInstance();
    backgroundCity: Phaser.GameObjects.Image;
    goButton: ButtonComponent;
    worldButton: Phaser.GameObjects.Image;
    wizardButton?: Phaser.GameObjects.Image;
    nonBackground: Phaser.GameObjects.Rectangle;
    title: TitleComponent;

    updateActiveTween = (value: boolean = !this.activeTween) => {
        this.activeTween = value;
    }

    constructor(
        scene: RPG,
        x: number,
        y: number,
        inSomePlace?: string
    ) {
        super(scene, x, y);

        let availableCities = ["ROOM","CITY", "OFFICE", "BEACH", "ENTREPRENEURSHIP"];


        this.scene = scene;
        this.backgroundCity = scene.add.image(0, 0, "modalBackground").setOrigin(0.5).setVisible(true);
        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)
        const blockedCities = globalData.blockedMaps

        //Modals containers
        const topContainer = this.scene.add.container(0, -150);


        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "modalCitiesSelect").setOrigin(0.5).setScale(1.001).setInteractive();
        const scaleFactor = 2 / 3
        this.nonBackground =this.scene.add.rectangle(
            0,
            0,
            859,
            477,
            0x282828
        ).setOrigin(0.5).setVisible(false);

        const city0 = this.scene.add.image(0, 0, "iconRoom").setOrigin(0.5).setInteractive().setAlpha(0.8).setScale(scaleFactor);
        city0.on('pointerover', () => {
            city0.setAlpha(1);
        });
        city0.on('pointerout', () => {
            if(this.citySelected != 'ROOM')city0.setAlpha(.8);
        });
        city0.on('pointerup', () => {
            if(!this.activeTween && this.citySelected != 'ROOM') {
                this.updateActiveTween();
                this.citySelected = 'ROOM'
                this.title.setText("Vamos a la casa");
                //this.backgroundCity.setTexture("backgroundCity1");
                this.backgroundCity.setVisible(true);
                if(city0)city0.setScale(scaleFactor*1.1).setAlpha(1)
                if(cityA)cityA.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityB)cityB.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityC)cityC.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityD)cityD.setScale(scaleFactor*1).setAlpha(0.8)
                tweenWorldTransition(this.backgroundCity, "backgroundRoom", this.nonBackground,this.updateActiveTween , this.scene);
                this.goButton.background.setTexture("btnGoCityModal");
                this.goButton.pauseInteracts(false);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.selectCity);
            }
        });


        const cityA = this.scene.add.image(0, 0, "iconCity").setOrigin(0.5).setInteractive().setAlpha(0.8).setScale(scaleFactor);
        cityA.on('pointerover', () => {
            cityA.setAlpha(1);
        });
        cityA.on('pointerout', () => {
            if(this.citySelected != 'CITY')cityA.setAlpha(.8);
        });
        cityA.on('pointerup', () => {
            if(!this.activeTween && this.citySelected != 'CITY') {
                this.updateActiveTween();
                this.citySelected = 'CITY'
                this.title.setText("Vamos a la ciudad");
                //this.backgroundCity.setTexture("backgroundCity1");
                this.backgroundCity.setVisible(true);
                if(city0)city0.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityA)cityA.setScale(scaleFactor*1.1).setAlpha(1)
                if(cityB)cityB.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityC)cityC.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityD)cityD.setScale(scaleFactor*1).setAlpha(0.8)
                tweenWorldTransition(this.backgroundCity, "backgroundCity1", this.nonBackground,this.updateActiveTween , this.scene);
                this.goButton.background.setTexture("btnGoCityModal");
                this.goButton.pauseInteracts(false);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.selectCity);
            }
        });

        const cityB = this.scene.add.image(0, 0, blockedCities.includes("OFFICE") ? "iconLock" : "iconOffice").setOrigin(0.5).setInteractive().setAlpha(0.8).setScale(scaleFactor);
        cityB.on('pointerover', () => {
            if (blockedCities.includes("OFFICE")) return
            cityB.setAlpha(1);
        });
        cityB.on('pointerout', () => {
            if (blockedCities.includes("OFFICE")) return
            if(this.citySelected != 'OFFICE') cityB.setAlpha(.8);
        });

        cityB.on('pointerup', () => {
            if (blockedCities.includes("OFFICE")) return
            if(!this.activeTween && this.citySelected != 'OFFICE') {
                this.updateActiveTween();
                this.citySelected = 'OFFICE';
                this.title.setText("Vamos a la oficina");
                //this.backgroundCity.setTexture("backgroundOffice");
                this.backgroundCity.setVisible(true);
                if(city0)city0.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityA)cityA.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityB)cityB.setScale(scaleFactor*1.1).setAlpha(1)
                if(cityC)cityC.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityD)cityD.setScale(scaleFactor*1).setAlpha(0.8)
                tweenWorldTransition(this.backgroundCity, "backgroundOffice",this.nonBackground, this.updateActiveTween, this.scene);
                this.goButton.background.setTexture("btnGoCityModal");
                this.goButton.pauseInteracts(false);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.selectCity);
            }
        });



        const cityC = this.scene.add.image(0, 0, blockedCities.includes("BEACH") ? "iconLock" : "iconBeach").setOrigin(0.5).setInteractive().setAlpha(0.8).setScale(scaleFactor);
        //.setTint(0xfcdb03)
        cityC.on('pointerover', () => {
            if (blockedCities.includes("BEACH")) return
            cityC.setAlpha(1);
        });
        cityC.on('pointerout', () => {
            if (blockedCities.includes("BEACH")) return
            if(this.citySelected != 'BEACH')cityC.setAlpha(.8);
        });

        cityC.on('pointerup', () => {
            if (blockedCities.includes("BEACH")) return
            if(!this.activeTween && this.citySelected != 'BEACH') {
                this.updateActiveTween();
                this.citySelected = 'BEACH';
                this.title.setText("Vamos a la playa");
                //this.backgroundCity.setTexture("backgroundBeach");
                this.backgroundCity.setVisible(true);
                if(city0)city0.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityA)cityA.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityB)cityB.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityC)cityC.setScale(scaleFactor*1.1).setAlpha(1)
                if(cityD)cityD.setScale(scaleFactor*1).setAlpha(0.8)
                tweenWorldTransition(this.backgroundCity, "backgroundBeach",this.nonBackground,this.updateActiveTween, this.scene);
                this.goButton.background.setTexture("btnGoCityModal");
                this.goButton.pauseInteracts(false);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.selectCity);
            }
        });

        const cityD = this.scene.add.image(0, 0, globalData.inversionModule.isActive ? "iconCoffe" : "iconLock").setOrigin(0.5).setInteractive().setAlpha(0.8).setScale(scaleFactor);

        cityD.on('pointerover', () => {
            if(globalData.inversionModule.isActive)cityD.setAlpha(1);
        });

        cityD.on('pointerout', () => {
            if(this.citySelected != 'ENTREPRENEURSHIP' && globalData.inversionModule.isActive)cityD.setAlpha(.8);
        });

        cityD.on('pointerup', () => {
            if(!this.activeTween && this.citySelected != 'ENTREPRENEURSHIP' && globalData.inversionModule.isActive) {
                this.updateActiveTween();
                this.citySelected = 'ENTREPRENEURSHIP';
                this.title.setText("Vamos al emprendimiento")
                //this.backgroundCity.setTexture("backgroundEntrepreneurship");
                this.backgroundCity.setVisible(true);
                if(city0)city0.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityA)cityA.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityB)cityB.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityC)cityC.setScale(scaleFactor*1).setAlpha(0.8)
                if(cityD)cityD.setScale(scaleFactor*1.1).setAlpha(1)
                tweenWorldTransition(this.backgroundCity, "backgroundEntrepreneurship",this.nonBackground,this.updateActiveTween, this.scene);
                this.goButton.background.setTexture("btnGoCityModal");
                this.goButton.pauseInteracts(false);
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.selectCity);
            }
        });
        
        const investMentContainer = this.scene.add.container(285, 190);
        this.worldButton = this.scene.add.image(0, 0, globalData.inversionModule.isActive ? "world-e" : "world-d").setOrigin(0.5).setAlpha(0.8).setInteractive();
        this.worldButton.on('pointerup', () => {
           /* const stateGlobal: globalState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
            this.worldButton.setTexture(stateGlobal.inversionModule.isActive ? "world-d" : "world-e");
            cityD.setTexture(stateGlobal.inversionModule.isActive ? "iconLock" : "iconCoffe");
            stateGlobal.inversionModule.isActive = !stateGlobal.inversionModule.isActive;
            this.eventCenter.emit(this.eventCenter.possibleEvents.ACTIVATE_INVERSION_MODULE);
            */
           if(!globalData.inversionModule.isActive) {
            //    const newMissionsAvailable = [46, 51, 55]
            //    for (let i = 0; i < newMissionsAvailable.length; i++) {
            //         this.eventCenter.emitEvent(this.eventCenter.possibleEvents.ADD_MISSION, newMissionsAvailable[i]);
            //    }
               this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.buttonClose);
               this.handleClose();
               this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.WORLD });
               
           }
           
        })

        this.worldButton.on('pointerover', () => {
            this.worldButton.setAlpha(1)
        });

        this.worldButton.on('pointerout', () => {
            this.worldButton.setAlpha(0.8)
        });

        investMentContainer.add(this.worldButton);

        const wizardContainer = this.scene.add.container(-285, 190);
        
        // this.wizardButton = this.scene.add.image(0, 0, globalData.wizzardModule.getState().isActive ? "wizard-e" : "wizard-d").setOrigin(0.5).setAlpha(0.8).setInteractive();
        // this.wizardButton.on('pointerup', () => {
        //     const stateGlobal: globalState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        //     stateGlobal.wizzardModule.setActive(!stateGlobal.wizzardModule.getState().isActive);
        //     stateGlobal.oceanAnimOn = !stateGlobal.oceanAnimOn;
        //     this.wizardButton.setTexture(stateGlobal.wizzardModule.getState().isActive  ? "wizard-e" : "wizard-d")
        // })

        // this.wizardButton.on('pointerover', () => {
        //     this.wizardButton.setAlpha(1)
        // });

        // this.wizardButton.on('pointerout', () => {
        //     this.wizardButton.setAlpha(0.8)
        // });



        if(this.wizardButton) wizardContainer.add(this.wizardButton);

        const goButtonContainer = this.scene.add.container(0, 130)
        
        //POSICIONES
        /*const leftMapContainer = this.scene.add.container(-240, 0);
        const centerMapContainer = this.scene.add.container(-80, 0);
        const rightMapContainer = this.scene.add.container(80, 0);
        const enterpreneurshipContainer = this.scene.add.container(240, 0);
        leftMapContainer.add(cityA);
        rightMapContainer.add(cityB);
        centerMapContainer.add(cityC);
        enterpreneurshipContainer.add(cityD); */

        const cityElements = {
            "ROOM": city0,
            "CITY": cityA,
            "OFFICE": cityB,
            "BEACH": cityC,
            "ENTREPRENEURSHIP": cityD
        };


        this.goButton = new ButtonComponent(this.scene, 0, 0, 200, "", "btn-ir-d", "#ffffff", "16", 1.2, 1, () => {
            if (this.citySelected) {
                this.scene.time.delayedCall(600, () => {
                    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.LEAVE_CITY, undefined)
                    // add consume money for travel ticket 

                    let price = this.getPriceForCity(this.citySelected!, cityElements, inSomePlace);
                    if(!this.checkForBicycle(this.citySelected!)) {
                        // change money image for bicicle
                        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PAY_TRAVEL_TICKET, price);
                    }
                    changeSceneTo(this.scene, "RPG", "RPG", this.citySelected);
                })
                this.handleClose();
            }
        });
    

        goButtonContainer.add(this.goButton)

        this.goButton.pauseInteracts(true);
        if(!inSomePlace) inSomePlace = "ROOM";
        availableCities = availableCities.filter(city => city !== inSomePlace);


       

        //@ts-ignore
        const cities = availableCities.map(city => cityElements[city]).filter(city => city !== undefined);
        //destroy city if not available in cities array
        Object.keys(cityElements).forEach(city => {
            //@ts-ignore
            if(!cities.includes(cityElements[city])) {
                //@ts-ignore
                cityElements[city].destroy();
            }
        });
        const positions =  [-240, -80, 80, 240];
        
        const citiesContainers = this.scene.add.container(0, 0);
        cities.forEach((city, index) => {
            citiesContainers.add(city);
            city.setX(positions[index]);
        });

 

        //LEFT BUTTON
        this.agreeButton = new ButtonComponent(this.scene, -140, 0, 200, "ACEPTAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            buttonsContainer.setVisible(false);
        });


        //right button
        this.cancelButton = new ButtonComponent(this.scene, 140, 0, 200, "CANCELAR", "btn", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PLAY_SOUND, possibleSounds.sounds.modals.modalCities.buttonClose);
        });

        //TOP CONTAINER
        const btnExit_p = new ButtonComponent(this.scene, 340, -40, 200, "", "btnExit", "#ffffff", "16", 1.2, 1, () => {
            this.handleClose();
        });

        this.title = new TitleComponent(this.scene, 0, -35, "¿A dónde vamos?", 500, '28');

        topContainer.add([
            this.title,
            btnExit_p,
        ]);

        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 220);

        buttonsContainer.setVisible(false);

        buttonsContainer.add([
            this.agreeButton,
            this.cancelButton
        ]);
        // iterate cityElements
        // add an sprite with text next to it with a money image and the amount of money that cost travel to taht city
        // check the order of the cities, te current city is blocked, the price of the travel is 0 to that particular city ( check witcth current city is with citySelected)
        // The price for the other places is 5 * the distance between the current city and the destination city
        // The price is shown in the text next to the city

        // get Position of the actual city
        
        let keyArray = Object.keys(cityElements);
        // compare keyArray with availableCities and leave only those that repeat
        keyArray = keyArray.filter(city => availableCities.includes(city) && !blockedCities.includes(city as PossibleCity));
        const citySelectedIndex = this.citySelected ? keyArray.indexOf(this.citySelected) : -1;

        for (let i = 0; i < keyArray.length; i++) {
            if (i !== citySelectedIndex) {
                const city = keyArray[i];
                //@ts-ignore
                const cityElement = cityElements[city];
                const cityPosition = cityElement.getCenter();
                
                let price = this.getPriceForCity(city, cityElements, inSomePlace);
               
                let goldColor = '#ffd700';
                let newContainer = this.scene.add.container(cityPosition.x, cityPosition.y + 80);
                let background = this.scene.add.rectangle(0,0, 100, 30, 0x282828).setOrigin(0.5);
                let moneyImage = this.scene.add.image(-20, 0, "iconPhysicalMoney").setOrigin(0.5).setScale(0.5);
                let text = this.scene.add.text(20, 0, `${price}`, { fontSize: '20px', color: goldColor, fontStyle:"bold", fontFamily: 'Arial' }).setOrigin(0.5);

                if(this.checkForBicycle(city,inSomePlace)) {
                    // change money image for bicicle
                    moneyImage.setTexture("bicicletaOn").setPosition(0,0).setScale(0.2)
                    background.setAlpha(0)
                    text.setText("0").setAlpha(0)
                }

                // check if city is blocked
                if(!globalData.inversionModule.isActive && city === "ENTREPRENEURSHIP") {
                    background.setAlpha(0)
                    moneyImage.setAlpha(0)
                    text.setAlpha(0)
                }

                // check if player has de physical money to buy the ticket to that city
                if(price > globalData.inventary.physicalMoney) {
                    text.setColor('#8b0000');
                    cityElement.setAlpha(0.5);
                    cityElement.removeInteractive();
                } else {
                    cityElement.setAlpha(1);
                    cityElement.setInteractive();
                }

                newContainer.add([background, moneyImage, text]);
                citiesContainers.add(newContainer);
            }
        }
        

        this.modalContainerWithElements.add([
            this.nonBackground,
            this.backgroundCity,
            modalBackground,
            topContainer,
            buttonsContainer,
            /*leftMapContainer,
            rightMapContainer,
            centerMapContainer,
            enterpreneurshipContainer,*/
            //@ts-ignore
            citiesContainers,
            investMentContainer,
            wizardContainer,
            //investMentContainer2,
            goButtonContainer,
        ]);
    }

    getPriceForCity(city: string,  cityElements: any, actualPlace?:string) {

        let citySelected = actualPlace;
        let distance = 0;
        let price = 0;
        const keyArray = Object.keys(cityElements);
        const citySelectedIndex = citySelected ? keyArray.indexOf(citySelected) : 0;
        const cityIndex = keyArray.indexOf(city);
        
        if (citySelectedIndex !== -1 && cityIndex !== -1) {
            distance = Math.abs(citySelectedIndex - cityIndex);
            distance = distance + 1
        }
        
        price = distance * 1.5;
        // round price 
        price = Math.ceil(Math.round(price * 100) / 100);

        return price
       
    }

    checkForBicycle(city:string, inSomePlace?:string) {
        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)
        if(inSomePlace === "BEACH") return false
        // check for "id": 7,  "name": "Bicicleta",
        let hasBike = false;
        let item = globalData.inventary.items.find(item => item.id === 7)
        if(item && item.inInventory) {
            hasBike = true
        }
        // check if city is not BEACH
        if(city === "BEACH") {
            return false
        } else {
            return hasBike
        }
    }
}