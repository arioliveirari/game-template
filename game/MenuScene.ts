import Phaser from "phaser";
import MultiScene from "./Loader/MultiScene";
import roomMap from "./maps/Room";
import cityMap from "./maps/City";
import EventsCenterManager from "./services/EventsCenter";
import AmbientBackgroundScene from "./ambientAssets/backgroundScene";
import possibleSounds from "../game/modules/possibleSounds.json";
import ApiConsumerSingleton from "./services/apiConsume";
import LocalStorageServiceSingleton from "./services/LocalStorageService";
import { checkIfMobile } from "./helpers/helpers";

export default class MenuScene extends Phaser.Scene {
  newGameButton?: Phaser.GameObjects.Image;
  continueGameButton?: Phaser.GameObjects.Image;
  container?: Phaser.GameObjects.Container;
  eventCenter = EventsCenterManager.getInstance();
  loadingSprite?: Phaser.GameObjects.Sprite;

  constructor() {
    const sceneConfig = {
      key: "MenuScene",
    };
    super(sceneConfig);
  }


  continueWith(progress?: any) {
    this.removeLoadingSprite();
    if (progress) {
      try {
        localStorage.setItem("globalStateChambix", JSON.parse(progress));
      } catch (error) {
        console.error("error parsing data from DB", error);
        this.addPlayBtn();
        return;
      }
    }
    this.addPlayBtn(true);
  }

  create(data: { maps: string[] }) {
    // get parameters from window url
    const params = new URLSearchParams(window.location.search);
    // get sso param

    let AmbientScene = this.game.scene.getScene("AmbientBackgroundScene");
    if (!AmbientScene) {
      AmbientScene = new AmbientBackgroundScene("MenuScene");
      this.scene.add("AmbientBackgroundScene", AmbientScene, true);
      AmbientScene.scene.sendToBack("AmbientBackgroundScene");
    } else {
      AmbientScene.scene.restart({ sceneKey: "MenuScene" });
    }

   
    
    // const AmbientScene = new AmbientBackgroundScene("MenuScene")
    // this.ambientScenes.push(AmbientScene);
    // this.scene.add("AmbientBackgroundScene", AmbientScene, true);
    // AmbientScene.scene.sendToBack("AmbientBackgroundScene");

    const middlePoint = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    this.container = this.add.container(middlePoint.x, middlePoint.y);

    this.container.add([]);

    const ssoToken = params.get("sso");
    this.addLoadingSprite();

    if (!ssoToken) {
      this.continueWith();
    } else {
      const API = ApiConsumerSingleton;
      API.loginUser(ssoToken!)
        .then((response) => {
          if (response.result.saveToken)
            API.setSaveToken(response.result.saveToken);
          this.continueWith(response.result.progress);
        })
        .catch((err) => {
          this.continueWith();
        });
    }

    this.eventCenter.emitEvent(
      this.eventCenter.possibleEvents.PLAY_MUSIC,
      "loopMusicTest"
    );

  }

  removeLoadingSprite() {
    this.loadingSprite?.destroy();
  }

  addLoadingSprite() {
    const { width, height } = this.game.canvas;
    this.loadingSprite = this.add.sprite(
      width / 2 - 50,
      height / 2 - 50,
      "block"
    );
    this.loadingSprite.setScale(1);
    this.container?.add(this.loadingSprite);
    this.tweens.add({
      targets: [this.loadingSprite],
      scale: 1,
      duration: 1000,
      ease: "bounce",
      onComplete: () => {
        this.tweens.add({
          targets: this.loadingSprite,
          scale: 0,
          angle: 360,
          duration: 1000,
          ease: "bounce",
          yoyo: true,
          loop: -1,
        });
      },
    });
  }

  addPlayBtn(withContinue: boolean = false) {
    if (this.container) {
      this.newGameButton = this.add
        .image(0, 0, "newGameButton")
        .setScale(0)
        .setInteractive()
        .once("pointerup", () => {
          this.newGameButton!.setTexture("newGameButton");
          this.deleteLocalStorage();
          // if mobile 
          const isMobile = checkIfMobile(this);
          if(isMobile) {
            const multiScene = new MultiScene("RPG", "MenuScene", "ROOM");
            this.scene.add("MultiScene", multiScene, true);
          } else {
            const multiScene = new MultiScene(
              "CinematographyHandler",
              "MenuScene",
              "movie1scene1"
            );
            this.scene.add("MultiScene", multiScene, true);
          }
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.PLAY_SOUND,
            possibleSounds.sounds.menu.buttonPlay
          );
        })
        .on("pointerout", () => {
          this.newGameButton!.setTexture("newGameButton");
        })
        .on("pointerdown", () => {
          this.newGameButton!.setTexture("newGameButtonPressed");
        });
      this.newGameButton.setPosition(
        0,
        window.innerHeight / 3 - this.newGameButton.height
      );

      this.continueGameButton = this.add
        .image(0, 0, "continueGameButton")
        .setScale(0)
        .setInteractive()
        .once("pointerup", () => {
          this.continueGameButton!.setTexture("continueGameButton");
          const multiScene = new MultiScene("RPG", "MenuScene", "ROOM");
          this.scene.add("MultiScene", multiScene, true);
          this.eventCenter.emitEvent(
            this.eventCenter.possibleEvents.PLAY_SOUND,
            possibleSounds.sounds.menu.buttonPlay
          );
        })
        .on("pointerout", () => {
          this.continueGameButton!.setTexture("continueGameButton");
        })
        .on("pointerdown", () => {
          this.continueGameButton!.setTexture("continueGameButtonPressed");
        });
      this.continueGameButton.setPosition(0, this.newGameButton.y + 100);

      this.tweens.add({
        targets: [this.newGameButton],
        scale: 1,
        duration: 1000,
        delay: 4000,
        ease: "bounce",
        onComplete: () => {
          this.tweens.add({
            targets: this.newGameButton,
            scale: 1.05,
            duration: 1000,
            ease: "bounce",
            yoyo: true,
            loop: -1,
          });
        
        },
      });

      this.tweens.add({
        targets: [this.continueGameButton],
        scale: 1,
        duration: 1000,
        delay: 4500,
        ease: "bounce",
        onComplete: () => {
          this.tweens.add({
            targets: this.continueGameButton,
            scale: 1.05,
            duration: 444,
            ease: "bounce",
            yoyo: true,
            loop: -1,
          });
        },
      });

      this.container.add([this.newGameButton, this.continueGameButton]);
    }

    if (withContinue) {
      // check if data saved has head on "00"
      
      const data = localStorage.getItem("globalStateChambix");
      try {
        const parsedData = JSON.parse(data!);
        if (parsedData.globalState.playerConfig.head !== "00") {
          this.continueGameButton?.setAlpha(1);
        } else {
          this.continueGameButton
            ?.setAlpha(0.2)
            .removeInteractive()
            .setTint(0xdedede);
        }
      } catch (error) {
        this.continueGameButton
          ?.setAlpha(0.2)
          .removeInteractive()
          .setTint(0xdedede);
      }
    } else {
      this.continueGameButton
        ?.setAlpha(0.2)
        .removeInteractive()
        .setTint(0xdedede);
    }

     // const element = this.add.dom(400, 600).createFromCache('betaform1');
    // window.test = element
    
    // phaser add an iframe 

    // const fetch = this.cache.html.get('betaform1');
   
    // element.addListener('click');
  }

  deleteLocalStorage() {
    this.eventCenter.emitEvent(
      this.eventCenter.possibleEvents.RESTART_GLOBAL_STATE,
      true
    );
    localStorage.removeItem("globalStateChambix");
  }

  update() {}
}
