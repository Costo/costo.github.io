import 'phaser';

export class Intro extends Phaser.Scene
{
    constructor ()
    {
        super('intro');
    }

    preload() {
        
    }

    create() {
        const text = this.add.text(400, 100, 'Les Aventures d\'Elliot et Robin', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5);
        this.add.text(400, 200, 'Loading...', { fontSize: '16px', fill: '#fff' });
        this.game.scene.start('loading');
    }

    update() {
        
    }
}