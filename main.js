// main.js

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // sky blue background
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 600 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  let player;
  let platforms;
  let cursors;
  
  function preload() {
    // Updated asset paths
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }
  
  function create() {
    // Platforms setup
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 584, 'platform').setScale(2, 1).refreshBody();
    platforms.create(150, 450, 'platform');
    platforms.create(650, 320, 'platform');
    platforms.create(400, 200, 'platform');
  
    // Player setup
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  
    // Player animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 20
    });
  
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  
    // Collision detection
    this.physics.add.collider(player, platforms);
  
    // Keyboard input
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  function update() {
    // Horizontal movement and animations
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
  
    // Corrected jumping mechanics
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-380);
    }
  }
  