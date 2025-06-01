import { GameConfig } from './types';

export const GAME_CONFIG: GameConfig = {
    // Game Settings
    title: 'Game Template',
    version: '1.0.0',
    width: 1280,
    height: 720,
    
    // Physics Settings
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    
    // Asset Settings
    assets: {
        preload: true,
        cache: true,
        basePaths: {
            sprites: '/assets/sprites/',
            audio: '/assets/audio/',
            maps: '/assets/maps/'
        }
    },
    
    // Scene Settings
    scenes: {
        initial: 'Boot',
        order: ['Boot', 'Preload', 'Menu', 'Game'],
        transitions: {
            duration: 500,
            effects: ['fade', 'slide']
        }
    },
    
    // Input Settings
    input: {
        debug: false,
        pointerLimit: 1,
        touch: true
    },
    
    // Audio Settings
    audio: {
        masterVolume: 1,
        musicVolume: 0.5,
        sfxVolume: 0.7
    }
};
