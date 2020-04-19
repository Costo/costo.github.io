import 'phaser';

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('gem', 'assets/gem2.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('robin', 
            'assets/dude2.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('elliot', 
            'assets/elliot-spritesheet.png',
            { frameWidth: 32, frameHeight: 48 }
        );

    }

    platforms: Phaser.Physics.Arcade.StaticGroup;
    player1: Phaser.Physics.Arcade.Sprite;
    player2: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    keys: {
        'a': Phaser.Input.Keyboard.Key,
        'w': Phaser.Input.Keyboard.Key,
        's': Phaser.Input.Keyboard.Key,
        'd': Phaser.Input.Keyboard.Key,
    };
    //stars: Phaser.Physics.Arcade.Group;
    //gems: Phaser.Physics.Arcade.Group;
    tokens: Phaser.Physics.Arcade.Group;
    bomb;
    bombs;
    score = 0;
    scoreText;
    gameOver: boolean = false;

    create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.platforms = this.physics.add.staticGroup();
    
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
    
        this.player1 = this.physics.add.sprite(100, 450, 'robin');
        this.player2 = this.physics.add.sprite(700, 450, 'elliot');
    
        this.player1.setBounce(0.2);
        this.player1.setCollideWorldBounds(true);
        this.player1.setGravityY(300);
    
        this.player2.setBounce(0.2);
        this.player2.setCollideWorldBounds(true);
        this.player2.setGravityY(300);
    
        this.anims.create({
            key: 'robin-left',
            frames: this.anims.generateFrameNumbers('robin', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'robin-turn',
            frames: [ { key: 'robin', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'robin-right',
            frames: this.anims.generateFrameNumbers('robin', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'elliot-left',
            frames: this.anims.generateFrameNumbers('elliot', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'elliot-turn',
            frames: [ { key: 'elliot', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'elliot-right',
            frames: this.anims.generateFrameNumbers('elliot', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.physics.add.collider([this.player1, this.player2], this.platforms);
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        let stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: { x: 12, y: 0, stepX: 140 }
        });

        let gems = this.physics.add.group({
            key: 'gem',
            repeat: 4,
            setXY: { x: 12 + 70, y: 0, stepX: 140 }
        });
        this.tokens = this.physics.add.group([...stars.children.entries, ...gems.children.entries]);
    
        this.tokens.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
    
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    
        });
        this.physics.add.collider(this.tokens, this.platforms);
        this.physics.add.overlap([this.player1, this.player2], this.tokens, this.collectStar, null, this);
    
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
        this.bombs = this.physics.add.group();
    
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider([this.player1, this.player2], this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player1, this.player2, null, null, this);

        this.keys = this.input.keyboard.addKeys({
            'a': Phaser.Input.Keyboard.KeyCodes.A,
            'w': Phaser.Input.Keyboard.KeyCodes.W,
            's': Phaser.Input.Keyboard.KeyCodes.S,
            'd': Phaser.Input.Keyboard.KeyCodes.D,
        }) as {
            'a': Phaser.Input.Keyboard.Key,
            'w': Phaser.Input.Keyboard.Key,
            's': Phaser.Input.Keyboard.Key,
            'd': Phaser.Input.Keyboard.Key,
        };
    }

    update ()
    {
        if (this.cursors.left.isDown)
        {
            this.player1.setVelocityX(-320);

            this.player1.anims.play('robin-left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player1.setVelocityX(160*2);

            this.player1.anims.play('robin-right', true);
        }
        else
        {
            this.player1.setVelocityX(0);

            this.player1.anims.play('robin-turn');
        }

        if (this.cursors.up.isDown && this.player1.body.touching.down)
        {
            this.player1.setVelocityY(-400);
        }

        if (this.keys.a.isDown) {
            this.player2.setVelocityX(-320);
            this.player2.anims.play('elliot-left', true);
        } else if (this.keys.d.isDown) {
            this.player2.setVelocityX(320);
            this.player2.anims.play('elliot-right', true);
        } else {
            this.player2.setVelocityX(0);
            this.player2.anims.play('elliot-turn');
        }

        if (this.keys.w.isDown && this.player2.body.touching.down) {
            this.player2.setVelocityY(-400);
        }
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    
        if (this.tokens.countActive(true) === 0)
        {
            this.tokens.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
    
            for (let i = 0; i < 1; i++) {
                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = this.bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setScale(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }    
        }
    }
    
    hitBomb (player, bomb)
    {
        // this.physics.pause();
    
        // player.setTint(0xff0000);
    
        // player.anims.play('turn');
    
        // this.gameOver = true;
    }
}

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
    scene: Demo
};

const game = new Phaser.Game(config);
