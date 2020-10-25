import 'phaser'

export class Loading extends Phaser.Scene {
  constructor () {
    super('loading')
  }

  preload () {
    this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('bomb', 'assets/brocoli.png')
    this.load.image('fireball', 'assets/fireball.png')
    this.load.spritesheet('robin',
      'assets/dude2.png',
      { frameWidth: 32, frameHeight: 48 }
    )
    this.load.spritesheet('snake',
      'assets/serpent.png',
      { frameWidth: 40, frameHeight: 25 })

    this.load.spritesheet('gem',
      'assets/gem.png',
      { frameWidth: 32, frameHeight: 32 }
    )
    this.load.spritesheet('elliot',
      'assets/elliot-spritesheet.png',
      { frameWidth: 32, frameHeight: 48 }
    )
    this.load.audio('sfx', [
      'assets/sound-effects/magical_horror_audiosprite.ogg',
      'assets/sound-effects/magical_horror_audiosprite.mp3'
    ])
  }

  create () {
    this.game.scene.start('demo')
  }

  update () {

  }
}
