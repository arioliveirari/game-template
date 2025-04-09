import Phaser from "phaser";
import EventsCenterManager from "../services/EventsCenter";
import GlobalDataManager from "../GlobalDataManager";

class SoundModule {
    scene: GlobalDataManager
    eventCenter = EventsCenterManager.getInstance()
    music?:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;
    sounds?:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;
    constructor(scene: GlobalDataManager) {
        this.scene = scene
        

        // EVENTS
        this.eventCenter.turnEventOn(
            "GlobalDataManager",
            this.eventCenter.possibleEvents.PLAY_SOUND,
            (key: string) => {
                this.playSound(key);
            },
            this
        );
        this.eventCenter.turnEventOn(
            "GlobalDataManager",
            this.eventCenter.possibleEvents.PLAY_MUSIC,
            (key: string) => {
                this.playMusic(key);
            },
            this
        );
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
            this.music.destroy;
        }
    }

    stopSounds() {
        if (this.sounds) {
            this.sounds.stop();
            this.sounds.destroy;
        }
    }

    playSound(name: string, loop: boolean = false) {
        this.sounds = this.scene.sound.add(name, {
            volume: 0.5,
            loop: loop,
        });
        this.sounds.play();
    }

    playMusic(name: string, loop: boolean = true) {
        if (this.music) {
            this.music.stop();
        }
        this.music = this.scene.sound.add(name, {
            volume: 0.05,
            loop: loop
        });
        this.music.play();
    }
}

export default SoundModule;