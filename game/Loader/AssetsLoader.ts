import { start } from "repl";
import MultiScene from "./MultiScene";
import PreLoadScene from "./PreLoadScene";

export type SceneKeys = "BaseLoad" | "Movies";

export type LoadTypes =
  | "image"
  | "spritesheet"
  | "audio"
  | "svg"
  | "assetWithCallback";

const loadAssets = {
  BaseLoad: {
    assets: [
      // ["assetWithCallback", (scene: Phaser.Scene) => {
      //   scene.load.spritesheet("torso-01", "/images/player/01/walkBrazosTorso.png", {
      //     frameWidth: 200,
      //     frameHeight: 250,
      //     startFrame: 0,
      //     endFrame: 239
      //   });
      // }],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_a-01",
            "/images/player/01/walkBrazosA.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_b-01",
            "/images/player/01/walkBrazosB.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_t-01",
            "/images/player/01/walkTorso.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],

      // ["assetWithCallback", (scene: Phaser.Scene) => {
      //   scene.load.spritesheet("torso-02", "/images/player/02/walkBrazosTorso.png", {
      //     frameWidth: 200,
      //     frameHeight: 250,
      //     startFrame: 0,
      //     endFrame: 239
      //   });
      // }],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_a-02",
            "/images/player/02/walkBrazosA.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_b-02",
            "/images/player/02/walkBrazosB.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_t-02",
            "/images/player/02/walkTorso.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet("legs-01", "/images/player/01/walkLegs.png", {
            frameWidth: 200,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 200,
          });
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "chicken",
            "/images/chicken/spritesheetChicken.png",
            {
              frameWidth: 138,
              frameHeight: 96,
              startFrame: 0,
              endFrame: 48,
            }
          );
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet("legs-02", "/images/player/02/walkLegs.png", {
            frameWidth: 200,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 200,
          });
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet("head-01", "/images/player/01/walkHead.png", {
            frameWidth: 200,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 200,
          });
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet("head-02", "/images/player/02/walkHead.png", {
            frameWidth: 200,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 200,
          });
        },
      ],

      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_a-03",
            "/images/player/03/walkBrazosA.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_b-03",
            "/images/player/03/walkBrazosB.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "torso_t-03",
            "/images/player/03/walkTorso.png",
            {
              frameWidth: 200,
              frameHeight: 250,
              startFrame: 0,
              endFrame: 79,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet("legs-03", "/images/player/03/walkLegs.png", {
            frameWidth: 200,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 200,
          });
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet("head-03", "/images/player/03/walkHead.png", {
            frameWidth: 200,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 200,
          });
        },
      ],
      // BETA FORMS
      // ["html", "betaform1", "http://localhost:3000/api/betaProxy/141?did=test42123"], // FORM PROXY LOGIC

      // player
      [
        "spritesheet",
        "player",
        "/images/chicken/spritesheetPlayer2.png",
        { frameWidth: 200, frameHeight: 250, startFrame: 0 },
      ],
      [
        "spritesheet",
        "playerIdle",
        "/images/chicken/playerIdle.png",
        { frameWidth: 200, frameHeight: 250, startFrame: 0 },
      ],
      // npcs
      [
        "spritesheet",
        "npc01",
        "/images/chicken/npcs/npc01.png",
        { frameWidth: 110, frameHeight: 300, startFrame: 0 },
      ],
      [
        "spritesheet",
        "npc02",
        "/images/chicken/npcs/npc02.png",
        { frameWidth: 110, frameHeight: 300, startFrame: 0 },
      ],
      [
        "spritesheet",
        "npc03",
        "/images/chicken/npcs/npc03.png",
        { frameWidth: 110, frameHeight: 300, startFrame: 0 },
      ],
      [
        "spritesheet",
        "npc04",
        "/images/chicken/npcs/npc04.png",
        { frameWidth: 110, frameHeight: 300, startFrame: 0 },
      ],
      [
        "spritesheet",
        "npc05",
        "/images/chicken/npcs/npc05.png",
        { frameWidth: 110, frameHeight: 300, startFrame: 0 },
      ],
      [
        "spritesheet",
        "npc06",
        "/images/chicken/npcs/npc06.png",
        { frameWidth: 110, frameHeight: 300, startFrame: 0 },
      ],

      // between scenes
      ["image", "block", "/50x50.png"],

      // menu
      ["image", "backgroundCity", "/images/menuScene/backgroundCity.png"],
      ["image", "backgroundStart", "/ambient/backgroundStart.png"],

      // NEW MODAL PC
      //["image", "newsImageTest", "/assets/news/modalNews.png"],
      ["image", "academyActive", "/assets/modalAssets/modalPC/academyActive.png"],
      ["image", "storeActive", "/assets/modalAssets/modalPC/storeActive.png"],
      ["image", "buttonAvailable", "/assets/modalAssets/modalPC/buttonAvailable.png"],
      ["image", "buttonDisable", "/assets/modalAssets/modalPC/buttonDisable.png"],
      ["image", "moneyIcon", "/assets/modalAssets/modalPC/moneyIcon.png"],


      // TABLET
      ["image", "fondoTablet", "/tabletScene/fondoTablet.png"],
      ["image", "fondoTabletOp2", "/tabletScene/fondoTabletOp2.png"],
      ["image", "tabletStatLeft", "/tabletScene/tabletStatLeft.png"],
      ["image", "tabletRightDown", "/tabletScene/tabletRightDown.png"],
      ["image", "tabletRightUp", "/tabletScene/tabletRightUp.png"],

      // MINIJUEGO

      ["image", "avatar_selection_01", "/images/avatarsSelection/avatar01.png"],
      ["image", "avatar_selection_02", "/images/avatarsSelection/avatar02.png"],
      ["image", "avatar_selection_03", "/images/avatarsSelection/avatar03.png"],

      [
        "image",
        "wizard_selection_01",
        "/images/wizardSelection/wizardSelection1.png",
      ],
      [
        "image",
        "wizard_selection_02",
        "/images/wizardSelection/wizardSelection2.png",
      ],
      [
        "image",
        "wizard_selection_03",
        "/images/wizardSelection/wizardSelection3.png",
      ],
      [
        "image",
        "wizard_selection_background",
        "/images/wizardSelection/wizardSelectionBackground.png",
      ],
      [
        "image",
        "wizard_selection_overlay",
        "/images/wizardSelection/wizardSelectorBackground2.png",
      ],

      // MINIJUEGO

      ["image", "captcha_m_1", "/minigame/captcha_m_1.png"],
      ["image", "captcha_m_2", "/minigame/captcha_m_2.png"],
      ["image", "captcha_m_3", "/minigame/captcha_m_3.png"],
      ["image", "captcha_m_4", "/minigame/captcha_m_4.png"],
      ["image", "captcha_m_5", "/minigame/captcha_m_5.png"],
      ["image", "captcha_m_6", "/minigame/captcha_m_6.png"],
      ["image", "captcha_m_7", "/minigame/captcha_m_7.png"],
      ["image", "captcha_m_8", "/minigame/captcha_m_8.png"],
      ["image", "captcha_m_9", "/minigame/captcha_m_9.png"],
      ["image", "captcha_m_10", "/minigame/captcha_m_10.png"],
      ["image", "captcha_m_11", "/minigame/captcha_m_11.png"],
      ["image", "captcha_m_12", "/minigame/captcha_m_12.png"],
      ["image", "captcha_m_13", "/minigame/captcha_m_13.png"],

      [
        "image",
        "minigame_cameraBackground",
        "/minigame/minigame_cameraBackground.png",
      ],
      // ["image", "minigame_coffeBackground", "/minigame/minigame_camera.png"],
      [
        "image",
        "minigame_coffeBackground",
        "/minigame/minigame_coffeBackground.png",
      ],
      ["image", "minigame_coffeMachine", "/minigame/minigame_coffeMachine.png"],
      ["image", "minigame_coffeMask", "/minigame/minigame_coffeMask.png"],
      ["image", "minigame_coffeCup", "/minigame/minigame_coffeCup.png"],
      ["image", "minigame_plate", "/minigame/minigame_plate.png"],
      ["image", "minigame_spoon", "/minigame/minigame_spoon.png"],
      ["image", "minigame_donut_plate", "/minigame/donutPlate.png"],
      ["image", "minigame_donut_1", "/minigame/donut1.png"],
      ["image", "minigame_donut_2", "/minigame/donut2.png"],

      ["image", "cameraBackground", "/minigame/cameraBackground.png"],
      ["image", "cameraContent", "/minigame/cameraContent.png"],
      ["image", "cameraHeader", "/minigame/cameraHeader.png"],

      ["image", "bg1", "/minigame/bg1.png"],
      ["image", "bg2", "/minigame/bg2.png"],
      ["image", "camera_button", "/minigame/camera_button.png"],
      ["image", "camera_wheel", "/minigame/camera_wheel.png"],
      ["image", "camera_full", "/minigame/camera_full.png"],

      ["image", "minigame_b_No", "/minigame/b_No.png"],
      ["image", "minigame_b_Yes", "/minigame/b_Yes.png"],
      ["image", "minigame_coffee", "/minigame/coffee.jpg"],
      ["image", "minigame_glowCircle", "/minigame/glowCircle.png"],

      //OCEANO
      ["image", "OCEAN-1", "/assets/Pisos/oceano/OCEAN-1.png"],
      ["image", "OCEAN-2", "/assets/Pisos/oceano/OCEAN-2.png"],
      ["image", "OCEAN-3", "/assets/Pisos/oceano/OCEAN-3.png"],
      ["image", "OCEAN-4", "/assets/Pisos/oceano/OCEAN-4.png"],
      ["image", "OCEAN-5", "/assets/Pisos/oceano/OCEAN-5.png"],

      ["image", "tabletIcon", "/tabletScene/tabletIcon.png"],
      ["image", "tabletCamera", "/tabletScene/tablet-camera.png"],
      ["image", "tabletIconOn", "/tabletScene/tabletIconOn.png"],
      ["image", "tabletSettings", "/tabletScene/tabletSettings.png"],
      ["image", "tabletStats", "/tabletScene/tabletStats.png"],
      ["image", "tabletStats2", "/tabletScene/tabletStats2.png"],
      [
        "image",
        "transactionsTabletIcon",
        "/tabletScene/transactionsTabletIcon.png",
      ],
      [
        "image",
        "transactionsTabletIconText",
        "/tabletScene/transactionsTabletIconText.png",
      ],
      ["image", "tabletNotReady", "/tabletScene/tabletNotReady.png"],
      ["image", "tabletBack", "/tabletScene/tabletback.png"],
      ["image", "btnCheck", "/tabletScene/btnCheck.png"],
      ["image", "btnCruz", "/tabletScene/btnCruz.png"],
      ["image", "transactionGlow", "/tabletScene/transactionGlow.png"],
      ["image", "transaction", "/tabletScene/transaction.png"],
      ["image", "investment", "/tabletScene/investment.png"],
      ["image", "investmentGlow", "/tabletScene/investmentGlow.png"],
      ["image", "btnAcc", "/tabletScene/btnAcc.png"],
      ["image", "btnAccHover", "/tabletScene/btnAccHover.png"],
      ["image", "btnInv", "/tabletScene/btnInv.png"],
      ["image", "btnInvHover", "/tabletScene/btnInvHover.png"],
      ["image", "btnTransc", "/tabletScene/btnTransc.png"],
      ["image", "btnTranscHover", "/tabletScene/btnTranscHover.png"],
      ["image", "btnLoans", "/tabletScene/btnLoans.png"],
      ["image", "btnLoansHover", "/tabletScene/btnLoansHover.png"],
      ["image", "chatIcon", "/tabletScene/chatIcon.png"],
      ["image", "chatIconHover", "/tabletScene/chatIconGlow.png"],
      [
        "image",
        "conversationBackground",
        "/tabletScene/conversationBackground.png",
      ],
      ["image", "conversationAvatar", "/tabletScene/conversationAvatar.png"],

      // room
      ["image", "room1", "/assets/room/room1.png"],
      ["image", "room2", "/assets/room/room2.png"],
      ["image", "HabitacionFinalMai", "/assets/room/HabitacionFinalMai.png"],
      ["image", "pcGlow", "/assets/room/CompuGlow.png"],
      ["image", "cama", "/assets/room/cama.png"],
      ["image", "puertaGlow", "/assets/room/PuertaGlow.png"],
      ["image", "camera", "/assets/room/camera.png"],
      ["image", "bicicle", "/assets/room/bicicle.png"],
      ["image", "bicicleForBus", "/assets/room/bicicleForBus.png"],

      ["image", "degree", "/assets/room/degree.png"],
      ["image", "newspaper", "/assets/room/newspaper.png"],
      ["image", "newspaperGlow", "/assets/room/newspaperGlow.png"],
      ["image", "Corcho", "/assets/room/Corcho.png"],
      ["image", "Glowcorcho", "/assets/room/Glowcorcho.png"],
      ["image", "Glowestanteria", "/assets/room/Glowestanteria.png"],

      // backgroundScenes ambient
      ["image", "statsBar", "/images/UIChicken/statsBar.png"],
      ["image", "clockDay", "/images/UIChicken/clockDay.png"],
      ["image", "backgroundSky", "/images/menuScene/skyBack.png"],
      ["image", "backgroundMenu", "/images/menuScene/backgroundMenu.png"],
      ["image", "day", "/ambient/day.png"],
      ["image", "night", "/ambient/night.png"],
      ["image", "stars", "/ambient/stars.png"],
      ["image", "snowFlake", "/ambient/snowFlake.png"],
      ["image", "menuClouds", "/ambient/menu/menuClouds.png"],
      ["image", "menuCity", "/ambient/menu/menuCity.png"],
      ["image", "menuLights", "/ambient/menu/menuLights.png"],
      ["image", "menuPJ", "/ambient/menu/menuPJ.png"],
      ["image", "logo", "/ambient/menu/logoChambix2.png"],
      ["image", "menuSky", "/ambient/menu/menuSky.png"],
      // add menuSky_avatar01.png
      ["image", "menuSky_avatar01", "/ambient/menu/menuSky_avatar01.png"],

      ["image", "intro_image_1", "/ambient/menu/intro_image_1.png"],
      ["image", "intro_image_2", "/ambient/menu/intro_image_2.png"],
      ["image", "intro_image_3", "/ambient/menu/intro_image_3.png"],

      // UI
      ["image", "avatar1Happy", "/UI/navbarAssets/avatarHappyGreen1.png"],
      ["image", "avatar2Happy", "/UI/navbarAssets/avatarHappyGreen2.png"],
      ["image", "avatar3Happy", "/UI/navbarAssets/avatarHappyGreen3.png"],
      ["image", "avatar1Normal", "/UI/navbarAssets/avatarMidYellow1.png"],
      ["image", "avatar2Normal", "/UI/navbarAssets/avatarMidYellow2.png"],
      ["image", "avatar3Normal", "/UI/navbarAssets/avatarMidYellow3.png"],
      ["image", "avatar1Sad", "/UI/navbarAssets/avatarSadRed1.png"],
      ["image", "avatar2Sad", "/UI/navbarAssets/avatarSadRed2.png"],
      ["image", "avatar3Sad", "/UI/navbarAssets/avatarSadRed3.png"],
      ["image", "navBarBg", "/UI/navbarAssets/navBarBg.png"],
      ["image", "navLineGreen", "/UI/navbarAssets/navLineGreen.png"],
      ["image", "navLineRed", "/UI/navbarAssets/navLineRed.png"],
      ["image", "navLineYellow", "/UI/navbarAssets/navLineYellow.png"],
      ["image", "UIStateHappy", "/UI/navbarAssets/UIStateHappy.png"],
      ["image", "UIStateNormal", "/UI/navbarAssets/UIStateNormal.png"],
      ["image", "UIStateSad", "/UI/navbarAssets/UIStateSad.png"],
      ["image", "reputationIcon", "/UI/navbarAssets/reputationIcon.png"],
      ["image", "iconDigital", "/UI/navbarAssets/iconDigital.png"],
      ["image", "iconCommon", "/UI/navbarAssets/iconCommon.png"],
      ["image", "iconInversion", "/UI/navbarAssets/iconInversion.png"],
      [
        "image",
        "iconEmptyMediodia",
        "/UI/navbarAssets/dayblocks/iconEmptyMediodia.png",
      ],
      [
        "image",
        "iconEmptyMorning",
        "/UI/navbarAssets/dayblocks/iconEmptyMorning.png",
      ],
      [
        "image",
        "iconEmptyNoche",
        "/UI/navbarAssets/dayblocks/iconEmptyNoche.png",
      ],
      [
        "image",
        "iconEmptyTarde",
        "/UI/navbarAssets/dayblocks/iconEmptyTarde.png",
      ],
      [
        "image",
        "iconMidMediodia",
        "/UI/navbarAssets/dayblocks/iconMidMediodia.png",
      ],
      [
        "image",
        "iconMidMorning",
        "/UI/navbarAssets/dayblocks/iconMidMorning.png",
      ],
      ["image", "iconMidNoche", "/UI/navbarAssets/dayblocks/iconMidNight.png"],
      ["image", "iconMidTarde", "/UI/navbarAssets/dayblocks/iconMidTarde.png"],
      [
        "image",
        "iconFullMorning",
        "/UI/navbarAssets/dayblocks/iconFullMorning.png",
      ],
      [
        "image",
        "iconFullMediodia",
        "/UI/navbarAssets/dayblocks/iconFullMediodia.png",
      ],
      [
        "image",
        "iconFullTarde",
        "/UI/navbarAssets/dayblocks/iconFullTarde.png",
      ],
      [
        "image",
        "iconFullNoche",
        "/UI/navbarAssets/dayblocks/iconFullNight.png",
      ],
      [
        "image",
        "startMoonLineBar",
        "/UI/navbarAssets/dayblocks/startMoonLineBar.png",
      ],
      [
        "image",
        "endMorningLineBar",
        "/UI/navbarAssets/dayblocks/endMorningLineBar.png",
      ],
      [
        "image",
        "lineBarDayBlocks",
        "/UI/navbarAssets/dayblocks/lineBarDayBlocks.png",
      ],

      ["image", "goBack", "/images/UIChicken/goBack.png"],
      ["image", "goRoom", "/images/UIChicken/goRoom.png"],
      ["image", "playButton", "/images/menuScene/playButton.png"],
      ["image", "newGameButton", "/images/menuScene/newGameButton.png"],
      [
        "image",
        "newGameButtonPressed",
        "/images/menuScene/newGameButtonPressed.png",
      ],
      [
        "image",
        "continueGameButton",
        "/images/menuScene/continueGameButton.png",
      ],
      [
        "image",
        "continueGameButtonPressed",
        "/images/menuScene/continueGameButtonPressed.png",
      ],
      ["image", "leftMenuItem", "/images/menuScene/leftMenuItem.png"],
      ["image", "rightMenuItem", "/images/menuScene/rightMenuItem.png"],
      ["image", "coinUi", "/assets/UI/UiChiken/coinUi.png"],

      ["image", "dayBlock1", "/UI/dayBlocks/dayBlock1.png"],
      ["image", "dayBlock1Active", "/UI/dayBlocks/dayBlock1Active.png"],
      ["image", "dayBlock2", "/UI/dayBlocks/dayBlock2.png"],
      ["image", "dayBlock2Active", "/UI/dayBlocks/dayBlock2Active.png"],
      ["image", "dayBlock3", "/UI/dayBlocks/dayBlock3.png"],
      ["image", "dayBlock3Active", "/UI/dayBlocks/dayBlock3Active.png"],
      ["image", "dayBlock4", "/UI/dayBlocks/dayBlock4.png"],
      ["image", "dayBlock4Active", "/UI/dayBlocks/dayBlock4Active.png"],
      ["image", "lineDayBlocks", "/UI/dayBlocks/lineDayBlocks.png"],
      ["image", "flecha", "/UI/dayBlocks/flecha.png"],

      ["image", "avatarGlow", "/UI/avatar/avatarGlow.png"],
      ["image", "avatarStats", "/UI/avatar/avatarStats.png"],
      ["image", "coinIconUI", "/UI/avatar/coinIconUI.png"],
      ["image", "reputationIconUI", "/UI/avatar/reputationIconUI.png"],
      ["image", "avatarBackground", "/UI/avatar/avatarBackground.png"],
      ["image", "arrowInvestment", "/UI/avatar/arrowInvestment.png"],
      ["image", "burbujaVacia", "/UI/avatar/burbujaVacia.png"],
      ["image", "reputationIcon", "/UI/avatar/reputationIcon.png"],
      //inversiones adentro de UI
      ["image", "eyeHide", "/UI/avatar/eyeHide.png"],
      ["image", "eyeShowIcon", "/UI/avatar/eyeShow.png"],
      ["image", "iconStonks", "/UI/avatar/iconStonks.png"],
      ["image", "inversionBubble", "/UI/avatar/inversionBubble.png"],
      ["image", "avatarInversiones", "/UI/avatar/avatarInversiones.png"],
      [
        "image",
        "rectanguloInversiones",
        "/UI/avatar/rectanguloInversiones.png",
      ],

      // sounds and music
      ["audio", "clickButtonSound", "/soundAndMusic/sounds/pressButton.mp3"],
      ["audio", "winModalSound", "/soundAndMusic/sounds/winModalSound.mp3"],
      ["audio", "loopMusicTest", "/soundAndMusic/musics/loopMusicTest.mp3"],

      // tiles

      ["image", "coffeRefrigerator", "/images/business/coffeRefrigerator.png"],
      ["image", "coffePlant1", "/images/business/coffePlant1.png"],
      ["image", "coffePlant2", "/images/business/coffePlant2.png"],
      ["image", "coffePlant3", "/images/business/coffePlant3.png"],
      ["image", "coffePlant4", "/images/business/coffePlant4.png"],
      ["image", "coffeBar", "/images/business/coffeBar.png"],
      ["image", "coffeEmptyTrash", "/images/business/coffeEmptyTrash.png"],
      ["image", "picnicTable", "/images/business/picnicTable.png"],
      ["image", "coffeMetegol", "/images/business/coffeMetegol.png"],
      ["image", "coffeShelves", "/images/business/coffeShelves.png"],
      ["image", "coffeMinigame", "/images/business/coffeMacchine1.png"],

      //ASSETS ADOBE BUSSINESS
      ["image", "newCartelCoffe", "/images/business/newCartelCoffe.png"],
      ["image", "newCoffeBar", "/images/business/newCoffeBar.png"],
      ["image", "newCoffeMachine", "/images/business/newCoffeMachine.png"],
      ["image", "newCoffeRefrigerator", "/images/business/newCoffeRefrigerator.png"],
      ["image", "newIndividualTable", "/images/business/newIndividualTable.png"],
      ["image", "newPicnicTable", "/images/business/newPicnicTable.png"],

      ["image", "tile", "/images/bloque.png"],
      ["image", "cube1", "/images/cube1.png"],
      ["image", "trash", "/images/trash.png"],
      ["image", "dog", "/images/dog.png"],
      ["image", "dog2", "/images/dog2.png"],
      ["image", "cat1", "/images/cat1.png"],
      ["image", "whiteCat", "/images/whiteCat.png"],
      ["image", "deliveryBox1", "/images/deliveryBox1.png"],
      ["image", "deliveryBox2", "/images/deliveryBox2.png"],
      ["image", "deliveryBox3", "/images/deliveryBox3.png"],
      ["image", "street-a", "/images/street-a.png"],
      ["image", "street-b", "/images/street-b.png"],
      ["image", "street-c", "/images/street-c.png"],
      ["image", "street-e", "/images/street-e.png"],
      ["image", "doubleLine1", "/images/doubleLine1.png"],
      ["image", "doubleLine2", "/images/doubleLine2.png"],
      ["image", "peatonal1", "/images/peatonal1.png"],
      ["image", "peatonal2", "/images/peatonal2.png"],
      ["image", "side-walk", "/images/side-walk-2.png"],
      ["image", "side-walk-2", "/images/side-walk-2.png"],
      ["image", "grassTEST", "/images/bloque1TEST.png"],
      ["image", "buildingTEST", "/images/building1TEST.png"],
      ["image", "blockBuilding", "/images/buildingTest/solidBlock.png"],
      ["image", "blockBuilding-b", "/images/bloque4TEST.png"],
      ["image", "blockBuildingBase", "/images/bloque2TEST.png"],
      ["image", "blockBuildingEmpty", "/images/bloque5TEST.png"],
      ["image", "endpointLight", "/images/luzPlataformaInicio.png"],

      ["image", "deskt1", "/images/buildingTest/deskt1.png"],
      ["image", "deskt2", "/images/buildingTest/deskt2.png"],
      ["image", "newDeskt2", "/images/buildingTest/newDeskt2.png"],
      ["image", "newDeskt1", "/images/buildingTest/newDeskt1.png"],
      ["image", "newDeskt1v2", "/images/buildingTest/newDeskt1v2.png"],


      ["image", "beacht1", "/images/buildingTest/beacht1.png"],
      ["image", "beacht2", "/images/buildingTest/beacht2.png"],

      ["audio", "key01", "/sounds/bs15.mp3"],
      ["audio", "key02", "/sounds/bs13.mp3"],

      ["image", "glass3", "/images/vidrio3.png"],
      ["image", "glass2", "/images/vidrio2.png"],
      ["image", "glass1", "/images/vidrio1.png"],
      ["image", "window3", "/images/buildingTest/window3.png"],
      ["image", "window2", "/images/buildingTest/window2.png"],
      ["image", "window1", "/images/buildingTest/window1.png"],
      ["image", "door8", "/images/puerta8.png"],
      ["image", "door7", "/images/puerta7.png"],
      ["image", "door6", "/images/puerta6.png"],
      ["image", "door5", "/images/puerta5.png"],
      ["image", "door4", "/images/puert4.png"],
      ["image", "door3", "/images/puert3.png"],
      ["image", "door2", "/images/puert2.png"],
      ["image", "door1", "/images/puert1.png"],
      ["image", "brick2", "/images/ladrillosRojos.png"],
      ["image", "brick1", "/images/ladrillosGrises.png"],
      ["image", "stears3", "/images/escalera3.png"],
      ["image", "stears2", "/images/escalera2.png"],
      ["image", "stears1", "/images/escalera1.png"],
      ["image", "block2", "/images/bloque1.png"],
      ["image", "circleBlock3", "/images/bloqCirc3.png"],
      ["image", "circleBlock2", "/images/bloqCirc2.png"],
      ["image", "circleBlock1", "/images/bloqCirc1.png"],

      ["image", "window16", "images/vent6.png"],
      ["image", "window15", "images/vent5.png"],
      ["image", "window14", "images/vent4.png"],
      ["image", "window13", "images/vent3.png"],
      ["image", "window12", "images/vent2.png"],
      ["image", "window11", "images/vent1.png"],

      ["image", "door18", "images/puerta8.png"],
      ["image", "door17", "images/puerta7.png"],
      ["image", "door16", "images/puerta6.png"],
      ["image", "door15", "images/puerta5.png"],
      ["image", "door14", "images/puert4.png"],
      ["image", "door13", "images/puert3.png"],
      ["image", "door12", "images/puert2.png"],
      ["image", "door11", "images/puert1.png"],

      // items
      ["image", "traffic-light-a", "/images/traffic-light-a.png"],
      ["image", "traffic-light-b", "/images/traffic-light-b.png"],
      ["image", "tree", "/images/chicken/arbolConSombra.png"],
      ["image", "pin", "/images/pin.png"],
      ["image", "pinMecanich", "/images/tuerquita.png"],
      ["image", "redPinHollow", "/images/redPinHollow.png"],
      ["image", "greenPinHollow", "/images/greenPinHollow.png"],
      ["image", "redPinSolid", "/images/redPinSolid.png"],
      ["image", "greenPinSolid", "/images/greenPinSolid.png"],
      ["image", "trader", "/images/trader.png"],
      ["image", "iconTrader", "/images/trader-new.png"],
      ["image", "coffePin", "/images/coffePin.png"],

      // modal
      ["image", "imageModalPhoto", "/assets/modalAssets/imageModalPhoto.png"],
      ["image", "blueprintPicture", "/assets/modalAssets/blueprintPicture.png"],
      //["image", "modalNews", "/assets/modalAssets/modalNews.png"],

      ["image", "fotoEmblematica", "/assets/modalAssets/fotoEmblematica.png"],
      ["image", "fotoCamara2", "/assets/modalAssets/fotoCamara2.png"],

      ["image", "cityA", "/assets/modalAssets/cityA.png"],
      ["image", "btnGoCityModal", "/assets/modalAssets/btnGoCityModal.png"],
      ["image", "cityB", "/assets/modalAssets/cityB.png"],
      ["image", "route1", "/assets/modalAssets/route1.png"],
      // images modal missions (DEPRECADO)
      ["image", "fotoCamara", "/assets/modalAssets/fotoCamara.png"],
      ["image", "walkDogs", "/assets/modalAssets/walkDogs.png"],
      ["image", "deliverFood", "/assets/modalAssets/deliverFood.png"],
      ["image", "amigos4patas", "/assets/modalAssets/amigos4patas.png"],
      //["image", "callesObstruidasNews", "/assets/modalAssets/callesObstruidas.png"],
      ["image", "dogBeachNews", "/assets/modalAssets/dogBeach.png"],
      //["image", "nuevasMonedas", "/assets/modalAssets/nuevasMonedas.png"],
      ["image", "paisajista1", "/assets/modalAssets/paisajista1.png"],
      //["image", "plazasRelucientesNews", "/assets/modalAssets/plazasRelucientes.png"],
      ["image", "camareroImage", "/assets/modalAssets/camareroImage.png"],
      ["image", "amigosPatasImage", "/assets/modalAssets/amigosPatasImage.png"],
      ["image", "catImage", "/assets/modalAssets/catImage.png"],
      ["image", "cmImage", "/assets/modalAssets/cmImage.png"],
      ["image", "editorImage", "/assets/modalAssets/editorImage.png"],
      ["image", "deliverFood2", "/assets/modalAssets/deliverFood2.png"],
      ["image", "baristaImage", "/assets/modalAssets/baristaImage.png"],
      ["image", "camareroImage2", "/assets/modalAssets/camareroImage2.png"],
      // IMAGENES MODAL POSTA
      // create the arrays with the images in /public/assets/midalAssets/missionImages
      ["image", "defaultImage", "/assets/modalAssets/default.png"],
      [
        "image",
        "amigosPatas",
        "/assets/modalAssets/missionImages/amigosPatas.png",
      ],
      [
        "image",
        "atencionPrimera",
        "/assets/modalAssets/missionImages/atencionPrimera.png",
      ],
      [
        "image",
        "baristaLujo",
        "/assets/modalAssets/missionImages/baristaLujo.png",
      ],
      [
        "image",
        "callesObstruidas",
        "/assets/modalAssets/missionImages/callesObstruidas.png",
      ],
      [
        "image",
        "charlaAmigos",
        "/assets/modalAssets/missionImages/charlaAmigos.png",
      ],
      [
        "image",
        "cmEstrella",
        "/assets/modalAssets/missionImages/cmEstrella.png",
      ],
      ["image", "delivery", "/assets/modalAssets/missionImages/delivery.png"],
      [
        "image",
        "editorJunior",
        "/assets/modalAssets/missionImages/editorJunior.png",
      ],
      [
        "image",
        "fotografiaPrimera",
        "/assets/modalAssets/missionImages/fotografiaPrimera.png",
      ],
      [
        "image",
        "fotosEmblematicas",
        "/assets/modalAssets/missionImages/fotosEmblematicas.png",
      ],
      [
        "image",
        "gatosApuros",
        "/assets/modalAssets/missionImages/gatosApuros.png",
      ],
      [
        "image",
        "nuevaMoneda",
        "/assets/modalAssets/missionImages/nuevaMoneda.png",
      ],
      [
        "image",
        "paisajista",
        "/assets/modalAssets/missionImages/paisajista.png",
      ],
      [
        "image",
        "paseoCanino",
        "/assets/modalAssets/missionImages/paseoCanino.png",
      ],
      [
        "image",
        "patasArena",
        "/assets/modalAssets/missionImages/patasArena.png",
      ],
      [
        "image",
        "plazasRelucientes",
        "/assets/modalAssets/missionImages/plazasRelucientes.png",
      ],
      // nuevas imagenes falta asignar a mission 28/03
      [
        "image",
        "arteCallejero",
        "/assets/modalAssets/missionImages/arteCallejero.png",
      ],
      [
        "image",
        "dineroPerdido",
        "/assets/modalAssets/missionImages/dineroPerdido.png",
      ],
      ["image", "luis", "/assets/modalAssets/missionImages/luis.png"],
      [
        "image",
        "oportunidad",
        "/assets/modalAssets/missionImages/oportunidad.png",
      ],
      ["image", "receta", "/assets/modalAssets/missionImages/receta.png"],
      // --
      // NEWS IMAGES
      [
        "image",
        "amigosPatasNewsF",
        "/assets/modalAssets/newsModal/amigosPatasNewsF.png",
      ],
      [
        "image",
        "callesObstruidasNewsF",
        "/assets/modalAssets/newsModal/callesObstruidasNewsF.png",
      ],
      [
        "image",
        "dogBeachNewsF",
        "/assets/modalAssets/newsModal/dogBeachNewsF.png",
      ],
      [
        "image",
        "gatosApurosNewsF",
        "/assets/modalAssets/newsModal/gatosApurosNewsF.png",
      ],
      [
        "image",
        "nuevasMonedasNewsF",
        "/assets/modalAssets/newsModal/nuevasMonedasNewsF.png",
      ],
      [
        "image",
        "plazasRelucientesNewsF",
        "/assets/modalAssets/newsModal/plazasRelucientesNewsF.png",
      ],
      [
        "image",
        "newsDefaultImageF",
        "/assets/modalAssets/newsModal/newsDefaultImageF.png",
      ],

      ["image", "modalBackground", "/assets/modalAssets/modal.png"],
      [
        "image",
        "formBackground",
        "/assets/modalAssets/formModal/formBackground.png",
      ],
      ["image", "desafioTest1", "/assets/modalAssets/maskImg2.png"],
      ["image", "desafioTest2", "/assets/modalAssets/maskImg3.png"],
      ["image", "barraTitle", "/assets/modalAssets/barraTittle.png"],
      ["image", "btnExit", "/assets/modalAssets/btnExit.png"],
      ["image", "middlebarOff-1", "/assets/modalAssets/middlebarOff-1.png"],
      ["image", "middlebarOff-2", "/assets/modalAssets/middlebarOff-2.png"],
      ["image", "middlebarOn-1", "/assets/modalAssets/middlebarOn-1.png"],
      ["image", "middlebarOn-2", "/assets/modalAssets/middlebarOn-2.png"],
      ["image", "barritaOff", "/assets/modalAssets/barritaOff.png"],
      ["image", "barritaOn", "/assets/modalAssets/barritaOn.png"],
      ["image", "btn", "/assets/modalAssets/btn.png"],
      ["image", "iconClock", "/assets/modalAssets/iconClock.png"],
      ["image", "iconMoon", "/assets/modalAssets/iconMoon.png"],
      ["image", "iconSun", "/assets/modalAssets/iconSun.png"],
      ["image", "iconSunrise", "/assets/modalAssets/iconSunrise.png"],
      ["image", "iconSunset", "/assets/modalAssets/iconSunset.png"],
      ["image", "coin", "/assets/modalAssets/coin.png"],
      ["image", "camaraGrey", "/assets/modalAssets/masUi/camaraGrey.png"],
      ["image", "iconCamara1", "/assets/modalAssets/masUi/camaraWhite.png"],
      ["image", "iconBici1", "/assets/modalAssets/iconBici1.png"],
      ["image", "iconCertif1", "/assets/modalAssets/iconCertif1.png"],
      ["image", "iconDona1", "/assets/modalAssets/iconDona1.png"],
      ["image", "iconMochila1", "/assets/modalAssets/iconMochila1.png"],
      ["image", "camaraGreen", "/assets/modalAssets/masUi/camaraGreen.png"],
      ["image", "form1", "/assets/modalAssets/form1.png"],
      ["image", "form2", "/assets/modalAssets/form2.png"],
      ["image", "form3", "/assets/modalAssets/form3.png"],
      ["image", "exchangeTotalBar", "/assets/modalAssets/exchangeTotalBar.png"],
      [
        "image",
        "exchangeMiddleBar",
        "/assets/modalAssets/exchangeMiddleBar.png",
      ],
      ["image", "header-0", "/assets/modalAssets/finishMissions/header-0.png"],
      ["image", "header-1", "/assets/modalAssets/finishMissions/header-1.png"],
      ["image", "header-2", "/assets/modalAssets/finishMissions/header-2.png"],
      ["image", "header-3", "/assets/modalAssets/finishMissions/header-3.png"],
      [
        "image",
        "separator-0",
        "/assets/modalAssets/finishMissions/separator-0.png",
      ],
      [
        "image",
        "separator-1",
        "/assets/modalAssets/finishMissions/separator-1.png",
      ],
      [
        "image",
        "separator-2",
        "/assets/modalAssets/finishMissions/separator-2.png",
      ],
      [
        "image",
        "separator-3",
        "/assets/modalAssets/finishMissions/separator-3.png",
      ],
      [
        "image",
        "modalFinish",
        "/assets/modalAssets/finishMissions/modalFinish.png",
      ],
      ["image", "star", "/assets/modalAssets/finishMissions/star.png"],
      [
        "image",
        "iconCoinFinish",
        "/assets/modalAssets/finishMissions/iconCoinFinish.png",
      ],
      [
        "image",
        "iconLikeFinish",
        "/assets/modalAssets/finishMissions/iconLikeFinish.png",
      ],
      [
        "image",
        "iconSmileFinish",
        "/assets/modalAssets/finishMissions/iconSmileFinish.png",
      ],
      [
        "image",
        "iconFailFinish",
        "/assets/modalAssets/finishMissions/iconFailFinish.png",
      ],
      [
        "image",
        "btn-violet",
        "/assets/modalAssets/finishMissions/btn-violet.png",
      ],
      [
        "image",
        "btn-white",
        "/assets/modalAssets/finishMissions/btn-white.png",
      ],

      [
        "image",
        "arrow-black-left",
        "/assets/modalAssets/citiesModal/arrow-black-left.png",
      ],
      [
        "image",
        "arrow-black-right",
        "/assets/modalAssets/citiesModal/arrow-black-right.png",
      ],
      [
        "image",
        "arrow-blue-left",
        "/assets/modalAssets/citiesModal/arrow-blue-left.png",
      ],
      [
        "image",
        "arrow-blue-right",
        "/assets/modalAssets/citiesModal/arrow-blue-right.png",
      ],
      ["image", "iconBeach", "/assets/modalAssets/citiesModal/iconBeach.png"],
      ["image", "iconCity", "/assets/modalAssets/citiesModal/iconCity.png"],
      ["image", "iconRoom", "/assets/modalAssets/citiesModal/iconRoom.png"],
      ["image", "iconCity2", "/assets/modalAssets/citiesModal/iconCity2.png"],
      ["image", "iconCity3", "/assets/modalAssets/citiesModal/iconCity3.png"],
      ["image", "iconCoffe", "/assets/modalAssets/citiesModal/iconCoffe.png"],
      ["image", "iconLock", "/assets/modalAssets/citiesModal/iconLock.png"],
      ["image", "iconOffice", "/assets/modalAssets/citiesModal/iconOffice.png"],
      [
        "image",
        "iconWorld-d",
        "/assets/modalAssets/citiesModal/iconWorld-d.png",
      ],
      [
        "image",
        "iconWorld-e",
        "/assets/modalAssets/citiesModal/iconWorld-e.png",
      ],
      [
        "image",
        "backgroundRoom",
        "/assets/modalAssets/citiesModal/backgroundRoom.png",
      ],
      [
        "image",
        "backgroundBeach",
        "/assets/modalAssets/citiesModal/backgroundBeach.png",
      ],
      [
        "image",
        "backgroundCity1",
        "/assets/modalAssets/citiesModal/backgroundCity.png",
      ],
      [
        "image",
        "backgroundOffice",
        "/assets/modalAssets/citiesModal/backgroundOffice.png",
      ],
      [
        "image",
        "backgroundEntrepreneurship",
        "/assets/modalAssets/citiesModal/backgroundEntrepreneurship.png",
      ],
      [
        "image",
        "modalCitiesSelect",
        "/assets/modalAssets/citiesModal/modalCitiesSelect.png",
      ],
      ["image", "btn-ir-d", "/assets/modalAssets/citiesModal/btn-ir-d.png"],
      ["image", "world-e", "/assets/modalAssets/citiesModal/world-e.png"],
      ["image", "world-d", "/assets/modalAssets/citiesModal/world-d.png"],
      ["image", "wizard-e", "/assets/modalAssets/citiesModal/wizard-e.png"],
      ["image", "wizard-d", "/assets/modalAssets/citiesModal/wizard-d.png"],

      ["image", "buttonBg", "/assets/modalAssets/newsModal/buttonBg.png"],
      [
        "image",
        "buttonHoverBg",
        "/assets/modalAssets/newsModal/buttonHoverBg.png",
      ],
      [
        "image",
        "newsBackground",
        "/assets/modalAssets/newsModal/newsBackground.png",
      ],
      ["image", "newsMarkImg", "/assets/modalAssets/newsModal/newsMarkImg.png"],
      ["image", "newsNotRead", "/assets/modalAssets/newsModal/newsNotRead.png"],
      ["image", "newsRead", "/assets/modalAssets/newsModal/newsRead.png"],
      //["image", "newsDefaultImage", "/assets/modalAssets/newsModal/newsDefaultImage.png"],

      ["image", "camaraShopOff", "/assets/modalAssets/camaraShop.png"],
      ["image", "camaraShopOn", "/assets/modalAssets/camaraShopOn.png"],
      ["image", "certificadoOn", "/assets/modalAssets/certificadoOn.png"],
      ["image", "certificadoOff", "/assets/modalAssets/certificadoOff.png"],
      // ----
      // ASSETS MODAL QUEST
      [
        "image",
        "iconCertificado1On",
        "/assets/modalAssets/iconcertificado1On.png",
      ],
      [
        "image",
        "iconCertificado1Off",
        "/assets/modalAssets/iconcertificado1Off.png",
      ],
      [
        "image",
        "iconCertificado2On",
        "/assets/modalAssets/iconcertificado2On.png",
      ],
      [
        "image",
        "iconCertificado2Off",
        "/assets/modalAssets/iconcertificado2Off.png",
      ],
      [
        "image",
        "iconCertificado3On",
        "/assets/modalAssets/iconcertificado3On.png",
      ],
      [
        "image",
        "iconCertificado3Off",
        "/assets/modalAssets/iconcertificado3Off.png",
      ],
      ["image", "iconProCameraOn", "/assets/modalAssets/iconproCameraOn.png"],
      ["image", "iconProCameraOff", "/assets/modalAssets/iconproCameraOff.png"],
      ["image", "iconCameraOn", "/assets/modalAssets/iconcameraOn.png"],
      ["image", "iconCameraOff", "/assets/modalAssets/iconcameraOff.png"],
      [
        "image",
        "iconDeliveryBagOn",
        "/assets/modalAssets/icondeliveryBagOn.png",
      ],
      [
        "image",
        "iconDeliveryBagOff",
        "/assets/modalAssets/icondeliveryBagOff.png",
      ],
      ["image", "iconTripodeOn", "/assets/modalAssets/icontripodeOn.png"],
      ["image", "iconTripodeOff", "/assets/modalAssets/icontripodeOff.png"],
      ["image", "iconBicicleOn", "/assets/modalAssets/iconbicicleOn.png"],
      ["image", "iconBicicleOff", "/assets/modalAssets/iconbicicleOff.png"],
      ["image", "iconDelantalOn", "/assets/modalAssets/icondelantalOn.png"],
      ["image", "iconDelantalOff", "/assets/modalAssets/icondelantalOff.png"],
      // ----
      //NEW MODAL QUEST 28/03/2025
      ["image", "infoIcon", "/assets/modalAssets/questModal/infoIcon.png"],
      [
        "image",
        "quesContainerBackground1",
        "/assets/modalAssets/questModal/quesContainerBackground1.png",
      ],
      [
        "image",
        "quesContainerBackground2",
        "/assets/modalAssets/questModal/quesContainerBackground2.png",
      ],
      [
        "image",
        "questAccept",
        "/assets/modalAssets/questModal/questAccept.png",
      ],
      [
        "image",
        "questAcceptClick",
        "/assets/modalAssets/questModal/questAcceptClick.png",
      ],
      [
        "image",
        "questBackground",
        "/assets/modalAssets/questModal/questBackground.png",
      ],
      [
        "image",
        "questBackgroundTop",
        "/assets/modalAssets/questModal/questBackgroundTop.png",
      ],
      [
        "image",
        "infoContainer_1",
        "/assets/modalAssets/questModal/infoContainer_1.png",
      ],
      [
        "image",
        "infoContainer_2",
        "/assets/modalAssets/questModal/infoContainer_2.png",
      ],
      [
        "image",
        "infoContainer_3",
        "/assets/modalAssets/questModal/infoContainer_3.png",
      ],
      [
        "image",
        "infoContainer_4",
        "/assets/modalAssets/questModal/infoContainer_4.png",
      ],
      //QUEST DAY STATE
      [
        "image",
        "1EmptyGreen",
        "/assets/modalAssets/questModal/greenEmptyFull_1.png",
      ],
      [
        "image",
        "2EmptyGreen",
        "/assets/modalAssets/questModal/greenEmptyFull_2.png",
      ],
      [
        "image",
        "3EmptyGreen",
        "/assets/modalAssets/questModal/greenEmptyFull_3.png",
      ],
      [
        "image",
        "4EmptyGreen",
        "/assets/modalAssets/questModal/greenEmptyFull_4.png",
      ],
      ["image", "1Split", "/assets/modalAssets/questModal/greenSplit_1.png"],
      ["image", "2Split", "/assets/modalAssets/questModal/greenSplit_2.png"],
      ["image", "3Split", "/assets/modalAssets/questModal/greenSplit_3.png"],
      ["image", "4Split", "/assets/modalAssets/questModal/greenSplit_4.png"],
      [
        "image",
        "1HalfGreen",
        "/assets/modalAssets/questModal/greenHalfFull_1.png",
      ],
      [
        "image",
        "2HalfGreen",
        "/assets/modalAssets/questModal/greenHalfFull_2.png",
      ],
      [
        "image",
        "3HalfGreen",
        "/assets/modalAssets/questModal/greenHalfFull_3.png",
      ],
      [
        "image",
        "4HalfGreen",
        "/assets/modalAssets/questModal/greenHalfFull_4.png",
      ],
      ["image", "1FullGreen", "/assets/modalAssets/questModal/greenFull_1.png"],
      ["image", "2FullGreen", "/assets/modalAssets/questModal/greenFull_2.png"],
      ["image", "3FullGreen", "/assets/modalAssets/questModal/greenFull_3.png"],
      ["image", "4FullGreen", "/assets/modalAssets/questModal/greenFull_4.png"],
      [
        "image",
        "1EmptyRed",
        "/assets/modalAssets/questModal/redEmptyFull_1.png",
      ],
      [
        "image",
        "2EmptyRed",
        "/assets/modalAssets/questModal/redEmptyFull_2.png",
      ],
      [
        "image",
        "3EmptyRed",
        "/assets/modalAssets/questModal/redEmptyFull_3.png",
      ],
      [
        "image",
        "4EmptyRed",
        "/assets/modalAssets/questModal/redEmptyFull_4.png",
      ],
      ["image", "1HalfRed", "/assets/modalAssets/questModal/redHalfFull_1.png"],
      ["image", "2HalfRed", "/assets/modalAssets/questModal/redHalfFull_2.png"],
      ["image", "3HalfRed", "/assets/modalAssets/questModal/redHalfFull_3.png"],
      ["image", "4HalfRed", "/assets/modalAssets/questModal/redHalfFull_4.png"],
      ["image", "1FullRed", "/assets/modalAssets/questModal/redFull_1.png"],
      ["image", "2FullRed", "/assets/modalAssets/questModal/redFull_2.png"],
      ["image", "3FullRed", "/assets/modalAssets/questModal/redFull_3.png"],
      ["image", "4FullRed", "/assets/modalAssets/questModal/redFull_4.png"],
      [
        "image",
        "greenDayBar_1",
        "/assets/modalAssets/questModal/greenDayBar_1.png",
      ],
      [
        "image",
        "greenDayBar_2",
        "/assets/modalAssets/questModal/greenDayBar_2.png",
      ],
      [
        "image",
        "greenDayBar_3",
        "/assets/modalAssets/questModal/greenDayBar_3.png",
      ],
      [
        "image",
        "greenDayBar_4",
        "/assets/modalAssets/questModal/greenDayBar_4.png",
      ],
      [
        "image",
        "greenDayBar_0",
        "/assets/modalAssets/questModal/greenDayBar_0.png",
      ],
      [
        "image",
        "greenDayBar_00",
        "/assets/modalAssets/questModal/greenDayBar_00.png",
      ],
      [
        "image",
        "redDayBar_1",
        "/assets/modalAssets/questModal/redDayBar_1.png",
      ],
      [
        "image",
        "redDayBar_2",
        "/assets/modalAssets/questModal/redDayBar_2.png",
      ],
      [
        "image",
        "redDayBar_3",
        "/assets/modalAssets/questModal/redDayBar_3.png",
      ],
      [
        "image",
        "redDayBar_4",
        "/assets/modalAssets/questModal/redDayBar_4.png",
      ],
      [
        "image",
        "greenDayBar_5",
        "/assets/modalAssets/questModal/greenDayBar_5.png",
      ],
      [
        "image",
        "redDayBar_5",
        "/assets/modalAssets/questModal/redDayBar_5.png",
      ],

      //
      ["image", "bagOn", "/assets/modalAssets/bagOn.png"],
      ["image", "bagOff", "/assets/modalAssets/bagOff.png"],
      ["image", "coinModalIcon", "/assets/modalAssets/coinModalIcon.png"],
      [
        "image",
        "reputationModalIcon",
        "/assets/modalAssets/reputationModalIcon.png",
      ],
      [
        "image",
        "happinessModalIcon",
        "/assets/modalAssets/happinessModalIcon.png",
      ],
      ["image", "popUp2", "/assets/modalAssets/popUp2.png"],

      [
        "image",
        "copperTrofy",
        "/assets/modalAssets/trofiesModal/copperTrofy.png",
      ],
      ["image", "goldTrofy", "/assets/modalAssets/trofiesModal/goldTrofy.png"],
      [
        "image",
        "silverTrofy",
        "/assets/modalAssets/trofiesModal/SilverTrofy.png",
      ],
      [
        "image",
        "backgroundTrofies",
        "/assets/modalAssets/trofiesModal/backgroundTrofies.png",
      ],
      [
        "image",
        "blockTrofy",
        "/assets/modalAssets/trofiesModal/blockTrofy.png",
      ],
      [
        "image",
        "copperTrofy_Glow",
        "/assets/modalAssets/trofiesModal/copperTrofy_Glow.png",
      ],
      [
        "image",
        "copperTrofy_Show",
        "/assets/modalAssets/trofiesModal/copperTrofy_Show.png",
      ],
      [
        "image",
        "copperTrofy_Show_Effect",
        "/assets/modalAssets/trofiesModal/copperTrofy_Show_Effect.png",
      ],
      [
        "image",
        "goldTrofy_Glow",
        "/assets/modalAssets/trofiesModal/goldTrofy_Glow.png",
      ],
      [
        "image",
        "goldTrofy_Show",
        "/assets/modalAssets/trofiesModal/goldTrofy_Show.png",
      ],
      [
        "image",
        "goldTrofy_Show_Effect",
        "/assets/modalAssets/trofiesModal/goldTrofy_Show_Effect.png",
      ],
      [
        "image",
        "silverTrofy_Glow",
        "/assets/modalAssets/trofiesModal/SilverTrofy_Glow.png",
      ],
      [
        "image",
        "silverTrofy_Show",
        "/assets/modalAssets/trofiesModal/SilverTrofy_Show.png",
      ],
      [
        "image",
        "silverTrofy_Show_Effect",
        "/assets/modalAssets/trofiesModal/SilverTrofy_Show_Effect.png",
      ],
      [
        "image",
        "trofiesBackground",
        "/assets/modalAssets/trofiesModal/trofiesBackground.png",
      ],
      [
        "image",
        "trofyStars",
        "/assets/modalAssets/trofiesModal/trofyStars.png",
      ],
      //ASSETS INVENTARIO
      ["image", "bicicleta", "/assets/modalAssets/itemsIcons/bicicleta.png"],
      [
        "image",
        "bicicletaOn",
        "/assets/modalAssets/itemsIcons/bicicletaOn.png",
      ],
      [
        "image",
        "bicicletaOff",
        "/assets/modalAssets/itemsIcons/bicicletaOff.png",
      ],
      [
        "image",
        "camaraDigital",
        "/assets/modalAssets/itemsIcons/camaraDigital.png",
      ],
      [
        "image",
        "camaraDigitalOn",
        "/assets/modalAssets/itemsIcons/camaraDigitalOn.png",
      ],
      [
        "image",
        "camaraDigitalOff",
        "/assets/modalAssets/itemsIcons/camaraDigitalOff.png",
      ],
      [
        "image",
        "camaraProfesional",
        "/assets/modalAssets/itemsIcons/camaraProfesional.png",
      ],
      [
        "image",
        "camaraProfesionalOn",
        "/assets/modalAssets/itemsIcons/camaraProfesionalOn.png",
      ],
      [
        "image",
        "camaraProfesionalOff",
        "/assets/modalAssets/itemsIcons/camaraProfesionalOff.png",
      ],
      ["image", "cursoDos", "/assets/modalAssets/itemsIcons/cursoDos.png"],
      ["image", "cursoDosOn", "/assets/modalAssets/itemsIcons/cursoDosOn.png"],
      [
        "image",
        "cursoDosOff",
        "/assets/modalAssets/itemsIcons/cursoDosOff.png",
      ],
      ["image", "cursoTres", "/assets/modalAssets/itemsIcons/cursoTres.png"],
      [
        "image",
        "cursoTresOn",
        "/assets/modalAssets/itemsIcons/cursoTresOn.png",
      ],
      [
        "image",
        "cursoTresOff",
        "/assets/modalAssets/itemsIcons/cursoTresOff.png",
      ],
      ["image", "cursoUno", "/assets/modalAssets/itemsIcons/cursoUno.png"],
      ["image", "cursoUnoOn", "/assets/modalAssets/itemsIcons/cursoUnoOn.png"],
      [
        "image",
        "cursoUnoOff",
        "/assets/modalAssets/itemsIcons/cursoUnoOff.png",
      ],
      ["image", "delantal", "/assets/modalAssets/itemsIcons/delantal.png"],
      ["image", "delantalOn", "/assets/modalAssets/itemsIcons/delantalOn.png"],
      [
        "image",
        "delantalOff",
        "/assets/modalAssets/itemsIcons/delantalOff.png",
      ],
      ["image", "mochila", "/assets/modalAssets/itemsIcons/mochila.png"],
      ["image", "mochilaOn", "/assets/modalAssets/itemsIcons/mochilaOn.png"],
      ["image", "mochilaOff", "/assets/modalAssets/itemsIcons/mochilaOff.png"],
      ["image", "tripode", "/assets/modalAssets/itemsIcons/tripode.png"],
      ["image", "tripodeOn", "/assets/modalAssets/itemsIcons/tripodeOn.png"],
      ["image", "tripodeOff", "/assets/modalAssets/itemsIcons/tripodeOff.png"],

      [
        "image",
        "itemBackground",
        "/assets/modalAssets/itemsIcons/itemBackground.png",
      ],
      [
        "image",
        "itemDigitalMoney",
        "/assets/modalAssets/itemsIcons/itemDigitalMoney.png",
      ],
      [
        "image",
        "itemSelected",
        "/assets/modalAssets/itemsIcons/itemSelected.png",
      ],

      ["image", "redDot", "/assets/modalAssets/redDot.png"],

      ["image", "diarioBackground", "/assets/modalAssets/diarioBackground.png"],
      [
        "image",
        "imageDiarioGeneric",
        "/assets/modalAssets/imageDiarioGeneric.png",
      ],
      ["image", "bordeImgDiario", "/assets/modalAssets/bordeImgDiario.png"],
      [
        "image",
        "iconPhysicalMoney",
        "/assets/modalAssets/iconPhysicalMoney.png",
      ],
      ["image", "iconDigitalMoney", "/assets/modalAssets/iconDigitalMoney.png"],

      //Wizzards
      [
        "image",
        "wizzardAqua_2",
        "/assets/modalAssets/wizzardsModal/wizzardAqua_2.png",
      ],
      [
        "image",
        "wizzardAqua_4",
        "/assets/modalAssets/wizzardsModal/wizzardAqua_4.png",
      ],
      [
        "image",
        "wizzardAqua_42",
        "/assets/modalAssets/wizzardsModal/wizzardAqua_42.png",
      ],
      [
        "image",
        "wizzardAqua_5",
        "/assets/modalAssets/wizzardsModal/wizzardAqua_5.png",
      ],
      [
        "image",
        "wizzardAqua_7",
        "/assets/modalAssets/wizzardsModal/wizzardAqua_7.png",
      ],
      [
        "spritesheet",
        "wizzardAqua_anim",
        "/assets/modalAssets/wizzardsModal/w_f1-7.png",
        { frameWidth: 120, frameHeight: 100, startFrame: 0 },
      ],

      //Cine
      ["image", "cine_placa", "/assets/cine/placa.png"],
      //Buildings
      // thiss 3 public/images/buildingTest/bloqCirc1.png public/images/buildingTest/bloqCirc2.png public/images/buildingTest/bloqCirc3.png

      ["image", "beachWindow1", "images/buildingTest/bloqCirc1.png"],
      ["image", "beachWindow2", "images/buildingTest/bloqCirc2.png"],
      ["image", "beachWindow3", "images/buildingTest/bloqCirc3.png"],

      ["image", "test1", "/images/buildingTest/test1.png"],
      ["image", "test2", "/images/buildingTest/test2.png"],
      ["image", "test3", "/images/buildingTest/test3.png"],
      ["image", "test4", "/images/buildingTest/test4.png"],
      ["image", "test5", "/images/buildingTest/test5.png"],
      ["image", "test1B", "/images/buildingTest/probando1.png"],
      ["image", "test2B", "/images/buildingTest/probando2.png"],
      ["image", "test3B", "/images/buildingTest/probando3.png"],
      ["image", "test4B", "/images/buildingTest/probando4.png"],
      ["image", "test5B", "/images/buildingTest/probando5.png"],
      [
        "image",
        "buildingDoorLeftCorner",
        "/images/buildingTest/buildingDoorLeftCorner.png",
      ],
      [
        "image",
        "buildingDoorRightCorner",
        "/images/buildingTest/buildingDoorRightCorner.png",
      ],
      ["image", "doorLeftSide", "/images/buildingTest/doorLeftSide.png"],
      ["image", "doorRightSide", "/images/buildingTest/doorRightSide.png"],
      ["image", "solidBlock", "/images/buildingTest/solidBlock.png"],
      ["image", "window1", "/images/buildingTest/window1.png"],
      ["image", "window2", "/images/buildingTest/window2.png"],
      ["image", "window3", "/images/buildingTest/window3.png"],
      ["image", "windowB1", "/images/buildingTest/windowB1.png"],
      ["image", "windowB2", "/images/buildingTest/windowB2.png"],
      ["image", "windowB3", "/images/buildingTest/windowB3.png"],
      ["image", "tradePost", "/images/buildingTest/tradePost.png"],
      ["image", "busPost", "/images/buildingTest/busPost.png"],
      ["image", "coffePost", "/images/buildingTest/coffePost.png"],
      ["image", "busPin", "/images/busPin.png"],

      // deprecated?
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          for (let index = 0; index < 6; index++) {
            scene.load.spritesheet(
              `bloque-${index}`,
              "/images/chicken/piedraAbajo.png",
              {
                frameWidth: 100,
                frameHeight: 100,
                startFrame: index,
              }
            );
          }
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          for (let index = 0; index < 6; index++) {
            scene.load.spritesheet(
              `semibloque-${index}`,
              "/images/chicken/piedraAbajo.png",
              {
                frameWidth: 100,
                frameHeight: 100,
                startFrame: index + 6,
              }
            );
          }
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          for (let index = 0; index < 6; index++) {
            scene.load.spritesheet(
              `columna-${index}`,
              "/images/chicken/piedraAbajo.png",
              {
                frameWidth: 100,
                frameHeight: 100,
                startFrame: index + 18,
              }
            );
          }
        },
      ],
    ],
  },
  Movies: {
    assets: [
      //scene 1
      [
        "image",
        "m1s1background",
        "/cinematography/introduction/m1s1/m1s1BackgroundSky.png",
      ],
      [
        "image",
        "m1s1backgroundStars",
        "/cinematography/introduction/m1s1/m1s1BackgrounStars.png",
      ],
      ["image", "m1s1moon", "/cinematography/introduction/m1s1/m1s1Moon.png"],
      [
        "image",
        "m1s1backgroundRoom",
        "/cinematography/introduction/m1s1/m1s1BackgroundRoom.png",
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s1character",
            "/cinematography/introduction/m1s1/m1s1Character.png",
            {
              frameWidth: 494,
              frameHeight: 738,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      //scene 2
      [
        "image",
        "m1s2backgroundRoom",
        "/cinematography/introduction/m1s2/m1s2BackgroundRoom.png",
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s2character",
            "/cinematography/introduction/m1s2/m1s2Character.png",
            {
              frameWidth: 1206,
              frameHeight: 1312,
              startFrame: 0,
              endFrame: 6,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s2characterB",
            "/cinematography/introduction/m1s2/m1s2CharcterB.png",
            {
              frameWidth: 1206,
              frameHeight: 1312,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s2characterEye",
            "/cinematography/introduction/m1s2/m1s2CharacterEye.png",
            {
              frameWidth: 1206,
              frameHeight: 1312,
              startFrame: 0,
              endFrame: 4,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s2characterEyeB",
            "/cinematography/introduction/m1s2/m1s2CharacterEyeB.png",
            {
              frameWidth: 1206,
              frameHeight: 1312,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      //scene 3
      [
        "image",
        "m1s3BackgroundRoom",
        "/cinematography/introduction/m1s3/m1s3BackgroundRoom.png",
      ],
      [
        "image",
        "m1s3ChambixText",
        "/cinematography/introduction/m1s3/m1s3ChambixText.png",
      ],
      [
        "image",
        "m1s3CharacterHands",
        "/cinematography/introduction/m1s3/m1s3CharacterHands.png",
      ],
      [
        "image",
        "m1s3Violet",
        "/cinematography/introduction/m1s3/m1s3Violet.png",
      ],
      [
        "image",
        "m1s3Wizard",
        "/cinematography/introduction/m1s3/m1s3Wizard.png",
      ],
      [
        "image",
        "m1s3Yellow",
        "/cinematography/introduction/m1s3/m1s3Yellow.png",
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s3VioletBubble",
            "/cinematography/introduction/m1s3/m1s3VioletBubble.png",
            {
              frameWidth: 100,
              frameHeight: 100,
              startFrame: 0,
              endFrame: 10,
            }
          );
        },
      ],
      //scene 4
      [
        "image",
        "m1s4Background",
        "/cinematography/introduction/m1s4/m1s4Background.png",
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s4Character",
            "/cinematography/introduction/m1s4/m1s4Character.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s4CharacterMouth",
            "/cinematography/introduction/m1s4/m1s4CharacterMouth.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 3,
            }
          );
        },
      ],
      //scene 5
      [
        "image",
        "m1s5BackgroundRoom",
        "/cinematography/introduction/m1s5/m1s5BackgroundRoom.png",
      ],
      ["image", "gema1", "/cinematography/introduction/m1s5/gema1.png"],
      ["image", "gema2", "/cinematography/introduction/m1s5/gema2.png"],
      ["image", "gema3", "/cinematography/introduction/m1s5/gema3.png"],
      ["image", "gema4", "/cinematography/introduction/m1s5/gema4.png"],
      ["image", "gema5", "/cinematography/introduction/m1s5/gema5.png"],
      ["image", "gema6", "/cinematography/introduction/m1s5/gema6.png"],
      ["image", "gema7", "/cinematography/introduction/m1s5/gema7.png"],
      ["image", "gema8", "/cinematography/introduction/m1s5/gema8.png"],
      ["image", "gema9", "/cinematography/introduction/m1s5/gema9.png"],
      ["image", "gema10", "/cinematography/introduction/m1s5/gema10.png"],
      ["image", "gema11", "/cinematography/introduction/m1s5/gema11.png"],
      ["image", "gema12", "/cinematography/introduction/m1s5/gema12.png"],
      ["image", "gema13", "/cinematography/introduction/m1s5/gema13.png"],
      ["image", "gema14", "/cinematography/introduction/m1s5/gema14.png"],
      ["image", "gema15", "/cinematography/introduction/m1s5/gema15.png"],

      [
        "image",
        "m1s5CharacterHands",
        "/cinematography/introduction/m1s5/m1s5CharacterHands.png",
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s5Wizard",
            "/cinematography/introduction/m1s5/m1s5Wizard.png",
            {
              frameWidth: 958,
              frameHeight: 914,
              startFrame: 0,
              endFrame: 4,
            }
          );
        },
      ],
      //scene 6
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s6Character",
            "/cinematography/introduction/m1s6/m1s6Character.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s6CharacterEyes",
            "/cinematography/introduction/m1s6/m1s6CharacterEyes.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 3,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s6CharacterMouth",
            "/cinematography/introduction/m1s6/m1s6CharacterMouth.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 3,
            }
          );
        },
      ],
      //scene 7
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s7Wizard",
            "/cinematography/introduction/m1s7/m1s7Wizard.png",
            {
              frameWidth: 1528,
              frameHeight: 1512,
              startFrame: 0,
              endFrame: 2,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s7WizardEyes",
            "/cinematography/introduction/m1s7/m1s7WizardEyes.png",
            {
              frameWidth: 1528,
              frameHeight: 1512,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s7WizardMouth",
            "/cinematography/introduction/m1s7/m1s7WizardMouth.png",
            {
              frameWidth: 1528,
              frameHeight: 1512,
              startFrame: 0,
              endFrame: 2,
            }
          );
        },
      ],
      //scene 8
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s8Character",
            "/cinematography/introduction/m1s8/m1s8Character.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s8CharacterMouth",
            "/cinematography/introduction/m1s8/m1s8CharacterMouth.png",
            {
              frameWidth: 1474,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      //scene 9
      //scene 10
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s10Character",
            "/cinematography/introduction/m1s10/m1s10Character.png",
            {
              frameWidth: 1420,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 1,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s10CharacterEyes",
            "/cinematography/introduction/m1s10/m1s10CharacterEyes.png",
            {
              frameWidth: 1420,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 2,
            }
          );
        },
      ],
      [
        "assetWithCallback",
        (scene: Phaser.Scene) => {
          scene.load.spritesheet(
            "m1s10CharacterMouth",
            "/cinematography/introduction/m1s10/m1s10CharacterMouth.png",
            {
              frameWidth: 1420,
              frameHeight: 1640,
              startFrame: 0,
              endFrame: 3,
            }
          );
        },
      ],
      //music
      ["audio", "musicCinemato", "/cinematography/introduction/intro.mp3"],
      [
        "audio",
        "introCinemato",
        "/cinematography/introduction/chambixMusic.mp3",
      ],
    ],
  },
};

class AssetsLoader {
  scene: MultiScene | PreLoadScene;
  finished: boolean = false;
  loadKey: SceneKeys[] = ["BaseLoad"];
  constructor(
    scene: MultiScene | PreLoadScene,
    loadKey: SceneKeys[] = ["BaseLoad", "Movies"]
  ) {
    this.scene = scene;
    this.loadKey = loadKey;
  }

  buildLoadingEffect() {
    const assetsToUse = [
      "loadingBlock1",
      "loadingBlock2",
      "loadingBlock3",
      "loadingBlock4",
      "loadingBlock5",
    ];

    const interval = setInterval(() => {
      let exist = true;

      assetsToUse.map((asset) => {
        if (!this.scene.textures.exists(asset)) {
          exist = false;
        }
        return asset;
      });

      if (exist) {
        clearInterval(interval);
        logic();
      }
    }, 10);

    const logic = () => {
      const width = window.innerWidth; //this.scene.cameras.main.width // TODO REVISAR
      const height = window.innerHeight; //this.scene.cameras.main.height // TODO REVISAR
      const blockSize = 56;
      const middlePoint = {
        x: width / 2 - blockSize * 3,
        y: height / 2 - blockSize * 3,
      };

      // draw random blocks to appear from the bottom like fish jumping from the water
      const drawJump = () => {
        const random = Phaser.Math.Between(3, 8);
        const randomDelay = () => Phaser.Math.Between(100, 500);

        const array = new Array(random).fill(0).map((_) => randomDelay());
        // position of the biggest number in the array

        const max = Math.max(...array);
        const index = array.indexOf(max);

        for (let i = 0; i < random; i++) {
          const randomX = Phaser.Math.Between(-80, 80);
          const randomY = Phaser.Math.Between(-80, 80);
          const randomAngle = Phaser.Math.Between(-100, 100);
          const randomAsset = Phaser.Math.Between(0, assetsToUse.length - 1);
          const block = this.scene.add
            .image(
              width - 150 + randomX,
              height + 150,
              assetsToUse[randomAsset]
            )
            .setDisplaySize(blockSize, blockSize);
          // block.alpha = 0
          const delay = randomDelay();
          block.setScale(0.5);
          this.scene.tweens.add({
            targets: block,
            // scale: 1,
            duration: 1000,
            delay: delay,
            ease: "Back.easeInOut",
            yoyo: true,
            y: "-=" + (300 + randomY),
            onComplete: () => {
              block.destroy();
              if (i === index) {
                drawJump();
              }
            },
          });
          this.scene.tweens.add({
            targets: block,
            // scale: 1,
            duration: 1000,
            delay: delay,
            ease: "linear",
            angle: randomAngle,
          });
        }
      };

      drawJump();
    };
  }
  runPreload(callback?: Function) {
    if (!this.finished) {
      this.buildLoadingEffect();

      var width = this.scene.cameras.main.width;
      var height = this.scene.cameras.main.height;
      var loadingText = this.scene.make.text({
        x: 100,
        y: height - 50,
        text: "Cargando...",
        style: {
          fontStyle: "bold",
          font: "20px monospace",
          color: "#ffffff",
        },
      });
      var progressBar = this.scene.add.graphics().setDepth(1001);
      var progressBox = this.scene.add.graphics().setDepth(1000);
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(0, height - 30, width, 50);
      loadingText.setOrigin(0.5, 0.5);

      var percentText = this.scene.make.text({
        x: 186,
        y: height - 50,
        text: "0%",
        style: {
          fontStyle: "bold",
          font: "20px monospace",
          color: "#ffffff",
        },
      });

      percentText.setOrigin(0.5, 0.5);

      // var assetText = this.scene.make.text({
      //   x: width / 2,
      //   y: height / 2 + 50,
      //   text: "",
      //   style: {
      //     font: "18px monospace",
      //     color: "#ff0000",
      //   },
      // });

      // assetText.setOrigin(0.5, 0.5);

      this.scene.load.on("progress", function (value: number) {
        percentText.setText(Math.floor(Number(value * 100)) + "%");
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(0, height - 30, width * value, 30);
      });

      // this.scene.load.on("fileprogress", function (file: any) {
      //   assetText.setText("Loading asset: " + file.key);
      // });

      this.scene.load.once("complete", function (this: AssetsLoader) {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        // assetText.destroy();
        this.finished = true;
        if (callback) callback();
      });

      const scenesTitles: Array<SceneKeys> = this.loadKey;
      for (let i = 0; i < scenesTitles.length; i++) {
        loadAssets[scenesTitles[i]].assets.map((sceneAssetConfig) => {
          const type = sceneAssetConfig[0] as LoadTypes;
          if (type !== "assetWithCallback") {
            const name = sceneAssetConfig[1] as string;
            const src = sceneAssetConfig[2] as string;
            const config = sceneAssetConfig[3] as any;
            if (config) {
              this.scene.load[type](name, src, config);
            } else {
              this.scene.load[type](name, src);
            }
          } else {
            const callback = sceneAssetConfig[1] as Function;
            callback(this.scene);
          }
        });
      }
      const ArcadeFont = this.scene.add.text(0, 0, " .", {
        fontFamily: "MontserratSemiBold",
      });
      const ArcadeFont2 = this.scene.add.text(0, 0, " .", {
        fontFamily: "MontserratBold",
      });
      const ArcadeFont3 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosBold",
      });
      const ArcadeFont4 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosBoldItalic",
      });
      const ArcadeFont5 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosItalic",
      });
      const ArcadeFont6 = this.scene.add.text(0, 0, " .", {
        fontFamily: "TinosRegular",
      });
    }
  }
}

export default AssetsLoader;
