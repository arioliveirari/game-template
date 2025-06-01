export interface GameConfig {
    title: string;
    description: string;
    version: string;
    width: number;
    height: number;
    
    physics: {
        default: string;
        arcade: {
            gravity: {
                y: number;
            };
            debug: boolean;
        };
    };
    
    assets: {
        preload: boolean;
        cache: boolean;
        basePaths: {
            sprites: string;
            audio: string;
            maps: string;
        };
    };
    
    scenes: {
        initial: string;
        order: string[];
        transitions: {
            duration: number;
            effects: string[];
        };
    };
    
    input: {
        debug: boolean;
        pointerLimit: number;
        touch: boolean;
    };
    
    audio: {
        masterVolume: number;
        musicVolume: number;
        sfxVolume: number;
    };
}
