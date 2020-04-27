import 'phaser';

interface Keys { 
    left: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    fire: Phaser.Input.Keyboard.Key;
 };

interface PlayerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    anims: Animations;
}

interface Animations {
    left: string,
    right: string,
    looksLeft: string
    looksRight: string
}

export abstract class Player extends Phaser.Physics.Arcade.Sprite {
    private looksRight: boolean = true;
    fireballs: Phaser.Physics.Arcade.Group;
    private animations: Animations;
    protected keys: Keys;
    
    constructor(config: PlayerConfig) {
        super(config.scene, config.x, config.y, config.texture);
        
        this.animations = config.anims;

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.setGravityY(300);

        this.fireballs = config.scene.physics.add.group({
            maxSize: 1,
            allowGravity: false
        });
    }
    update() {
        if (this.keys.left.isDown) {
            this.looksRight = false;
            this.setVelocityX(-320);
            this.anims.play(this.animations.left, true);
        } else if (this.keys.right.isDown) {
            this.looksRight = true;
            this.setVelocityX(320);
            this.anims.play(this.animations.right, true);
        } else {
            this.setVelocityX(0);
            this.anims.play(this.looksRight ? this.animations.looksRight : this.animations.looksLeft);
        }

        if (this.keys.jump.isDown && this.body.touching.down) {
            this.setVelocityY(-800);
        }

        this.fireballs.children.each(o => {
            let sprite = o as Phaser.Physics.Arcade.Sprite;
            if (!this.scene.cameras.main.worldView.contains(sprite.x, sprite.y)) {
                this.fireballs.remove(o);
            }
        });

        if (this.keys.fire.isDown) {
            const fireball = this.fireballs.create(this.x, this.y, 'fireball');
            if (fireball != null) {
                this.emit('fireball', this);
                fireball.setCollideWorldBounds(false);
                if (this.looksRight) {
                    fireball.setVelocity(1200, 0);
                } else {
                    fireball.setVelocity(-1200, 0);
                }
            }
        }
        this.fireballs.rotate(0, 0.1);
    }
}

interface ElliotConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
}

export class Elliot extends Player {
    
    constructor(config: ElliotConfig) {
        super({
            texture: 'elliot',
            anims: {
                left: 'elliot-left',
                right: 'elliot-right',
                looksLeft: 'elliot-looks-left',
                looksRight: 'elliot-looks-right',
            },
            ...config
        });
        
        this.keys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            jump: Phaser.Input.Keyboard.KeyCodes.W,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
        }) as Keys;
    }
}

interface RobinConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
}

export class Robin extends Player {
    
    constructor(config: RobinConfig) {
        super({
            texture: 'robin',
            anims: {
                left: 'robin-left',
                right: 'robin-right',
                looksLeft: 'robin-looks-left',
                looksRight: 'robin-looks-right',
            },
            ...config
        });

        const cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = {
            left: cursors.left,
            jump: cursors.up,
            right: cursors.right,
            fire: cursors.shift,
        };
    }
}