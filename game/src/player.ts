import 'phaser';

interface PlayerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}
export abstract class Player extends Phaser.Physics.Arcade.Sprite {
    fireballs: Phaser.Physics.Arcade.Group;
    
    constructor(config: PlayerConfig) {
        super(config.scene, config.x, config.y, config.texture);
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

    protected jump() {
        this.setVelocityY(-800);
    }
}

interface Keys { 
    a: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
 };

interface ElliotConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
}

export class Elliot extends Player {
    private keys: Keys;
    
    constructor(config: ElliotConfig) {
        super({
            texture: 'elliot',
            ...config
        });
        
        this.keys = this.scene.input.keyboard.addKeys({
            'a': Phaser.Input.Keyboard.KeyCodes.A,
            'w': Phaser.Input.Keyboard.KeyCodes.W,
            's': Phaser.Input.Keyboard.KeyCodes.S,
            'd': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        }) as Keys;
    }

    update() {
        super.update();

        if (this.keys.a.isDown) {
            this.setVelocityX(-320);
            this.anims.play('elliot-left', true);
        } else if (this.keys.d.isDown) {
            this.setVelocityX(320);
            this.anims.play('elliot-right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('elliot-turn');
        }

        if (this.keys.w.isDown && this.body.touching.down) {
            this.jump();
        }

        this.fireballs.children.each(o => {
            let sprite = o as Phaser.Physics.Arcade.Sprite;
            if (!this.scene.cameras.main.worldView.contains(sprite.x, sprite.y)) {
                this.fireballs.remove(o);
            }
        })
        if (this.keys.space.isDown && (this.keys.a.isDown || this.keys.d.isDown)) {
            const fireball = this.fireballs.create(this.x, this.y, 'fireball');
            if (fireball != null) {
                fireball.setCollideWorldBounds(false);
                if (this.keys.a.isDown) {
                    fireball.setVelocity(-1200, 0);
                } else {
                    fireball.setVelocity(1200, 0);
                }
            }
        }
        this.fireballs.rotate(0, 0.1);
        
    }
}

interface RobinConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
}

export class Robin extends Player {
    
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    constructor(config: RobinConfig) {
        super({
            texture: 'robin',
            ...config
        });

        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update() {

        super.update();

        if (this.cursors.left.isDown) {
            this.setVelocityX(-320);
            this.anims.play('robin-left', true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(160*2);
            this.anims.play('robin-right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('robin-turn');
        }

        if (this.cursors.up.isDown && this.body.touching.down){
            this.jump();
        }
    }
}