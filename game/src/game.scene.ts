import 'phaser'
import { Player, Elliot, Robin } from './player'
import { Score } from './score'

export class Demo extends Phaser.Scene {
    sfx: Phaser.Sound.BaseSound;
    constructor () {
      super('demo')
    }

    preload () {

    }

    platforms: Phaser.Physics.Arcade.StaticGroup;
    player1: Player;
    player2: Player;
    tokens: Phaser.Physics.Arcade.Group;
    bomb;
    bombs;
    score = 0;
    gameOver: boolean = false;

    create () {
      this.sfx = this.sound.add('sfx')
      const sfx2 = this.sound.add('sfx')
      const markers = [
        { name: 'charm', start: 0, duration: 0.5, config: {} },
        { name: 'curse', start: 4, duration: 2.9, config: {} },
        { name: 'fireball', start: 8, duration: 3, config: {} },
        { name: 'spell', start: 14, duration: 4.7, config: {} },
        { name: 'soundscape', start: 20, duration: 18.8, config: {} }
      ]

      markers.forEach(function (marker) {
        this.sfx.addMarker(marker)
        sfx2.addMarker(marker)
      }, this)

      this.add.image(0, 0, 'sky').setOrigin(0, 0)
      this.platforms = this.physics.add.staticGroup()

      this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()

      this.platforms.create(600, 400, 'ground')
      this.platforms.create(50, 250, 'ground')
      this.platforms.create(750, 220, 'ground')

      this.anims.create({
        key: 'sparkle',
        frames: this.anims.generateFrameNumbers('gem', { frames: [0, 1, 2, 3] }),
        frameRate: 8,
        repeat: -1
      })

      this.anims.create({
        key: 'elliot-looks-right',
        frames: [{ key: 'elliot', frame: 5 }],
        frameRate: 20
      })
      this.anims.create({
        key: 'elliot-looks-left',
        frames: [{ key: 'elliot', frame: 2 }],
        frameRate: 20
      })

      this.anims.create({
        key: 'elliot-left',
        frames: this.anims.generateFrameNumbers('elliot', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      })

      this.anims.create({
        key: 'elliot-right',
        frames: this.anims.generateFrameNumbers('elliot', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      })

      this.anims.create({
        key: 'robin-looks-right',
        frames: [{ key: 'robin', frame: 5 }],
        frameRate: 20
      })

      this.anims.create({
        key: 'robin-looks-left',
        frames: [{ key: 'robin', frame: 2 }],
        frameRate: 20
      })

      this.anims.create({
        key: 'robin-left',
        frames: this.anims.generateFrameNumbers('robin', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      })

      this.anims.create({
        key: 'robin-right',
        frames: this.anims.generateFrameNumbers('robin', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      })

      this.player1 = new Robin({
        scene: this,
        x: 100,
        y: 450
      }).on('fireball', function () {
        console.log('fireball')
        sfx2.play('curse')
      }, this)
      this.player2 = new Elliot({
        scene: this,
        x: 700,
        y: 450
      }).on('fireball', function () {
        console.log('fireball')
        this.sfx.play('fireball')
      }, this)

      this.physics.add.collider([this.player1, this.player2], this.platforms)

      const stars = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: { x: 12, y: 0, stepX: 140 }
      })

      const gems = this.physics.add.group({
        key: 'gem',
        repeat: 4,
        setXY: { x: 12 + 70, y: 0, stepX: 140 }
      })
      gems.playAnimation('sparkle')

      this.tokens = this.physics.add.group([...stars.children.entries, ...gems.children.entries])

      this.tokens.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4))
      })
      this.physics.add.collider(this.tokens, this.platforms)
      this.physics.add.overlap([this.player1, this.player2], this.tokens, this.collectStar, null, this)

      this.add.existing(new Score({
        scene: this,
        x: 16,
        y: 16
      }))

      this.bombs = this.physics.add.group()

      this.physics.add.collider(this.bombs, this.platforms)
      this.physics.add.collider([this.player1, this.player2], this.bombs, this.hitBomb, null, this)
      this.physics.add.collider(this.player1, this.player2, null, null, this)

      this.physics.add.collider([this.player1.fireballs, this.player2.fireballs], this.bombs, this.destroyBomb, null, this)
    }

    update () {
      this.player1.update()
      this.player2.update()
    }

    collectStar (player, star) {
      this.sound.play('sfx', {
        name: 'charm',
        start: 0,
        duration: 1,
        config: {}
      })
      star.disableBody(true, true)
      this.score += 10
      this.events.emit('score', this.score)

      if (this.tokens.countActive(true) === 0) {
        this.tokens.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
          child.enableBody(true, child.x, 0, true, true)
        })

        for (let i = 0; i < 1; i++) {
          var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
          var bomb = this.bombs.create(x, 16, 'bomb')
          bomb.setBounce(1)
          bomb.setScale(4)
          bomb.setCollideWorldBounds(true)
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        }
      }
    }

    hitBomb (player, bomb) {
      // this.physics.pause();

      // player.setTint(0xff0000);

      // player.anims.play('turn');

      // this.gameOver = true;
    }

    destroyBomb (fireball: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite) {
      fireball.destroy()
      bomb.destroy()
    }
}
