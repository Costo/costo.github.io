import 'phaser';
import { Demo } from './game.scene';
import { Intro } from './intro.scene';
import { Loading } from './loading.scene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    parent: 'my-phaser-game',
    scene: [ Intro, Loading, Demo ],
    audio: {
        disableWebAudio: false,
        context: new (window['webkitAudioContext'] || window['AudioContext']),
        noAudio: false
    }
};

const game = new Phaser.Game(config);
