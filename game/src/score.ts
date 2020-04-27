import 'phaser';

export class Score extends Phaser.GameObjects.Text {
    constructor(config: {
        scene: Phaser.Scene,
        x: number,
        y: number
    }) {
        super(config.scene, config.x, config.y, "Score: 0", { fontSize: '32px' });

        config.scene.events.on('score', score => {
            this.setText('Score: ' + score);
        }, this);

        config.scene.add.existing(this);
    }
}