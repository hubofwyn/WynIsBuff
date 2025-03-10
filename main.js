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
      debug: false  // Change to true to visualize collision boundaries for debugging
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
let jumps = 0;
let jumpEmitter;
let jumpText;

function preload() {
  // Load assets
  this.load.image('platform', 'assets/sprites/platform.png');
  this.load.spritesheet('player', 'assets/player.png', {
    frameWidth: 32,
    frameHeight: 48
  });
  // Load a cloud image to add extra visual fun (ensure this asset exists)
  this.load.image('cloud', 'assets/sprites/cloud.png');
}

function create() {
  // Uncomment the block below to add a moving cloud for extra visual interest
  /*
  let cloud = this.add.image(400, 100, 'cloud').setScale(0.5).setAlpha(0.5);
  this.tweens.add({
    targets: cloud,
    x: 800,
    duration: 10000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });
  */

  // Setup platforms with defined positions and scales.
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 584, 'platform').setScale(2, 1).refreshBody();
  platforms.create(150, 450, 'platform');
  platforms.create(650, 320, 'platform');
  platforms.create(400, 200, 'platform');

  // Setup player sprite and its physics properties.
  player = this.physics.add.sprite(100, 450, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Create animations for the player.
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

  // Enable collision detection between the player and platforms.
  this.physics.add.collider(player, platforms);

  // Setup keyboard input.
  cursors = this.input.keyboard.createCursorKeys();

  // Setup jump particles for a visual burst effect when jumping.
  jumpEmitter = this.add.particles('player').createEmitter({
    speed: { min: -100, max: 100 },
    scale: { start: 0.5, end: 0 },
    lifespan: 300,
    on: false
  });

  // Display text showing the current jump count.
  jumpText = this.add.text(16, 16, 'Jumps: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
  // Handle horizontal movement and play corresponding animations.
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

  // Check if the player is on the ground using both blocked and touching checks.
  let onGround = player.body.blocked.down || player.body.touching.down;

  // Log the current jump count and ground status for debugging.
  console.log("Jumps:", jumps, "onGround:", onGround);

  // Reset the jump counter when the player lands.
  if (onGround) {
    if (jumps !== 0) {
      console.log("Player landed – resetting jump counter.");
    }
    jumps = 0;
  }

  // Update the on-screen jump count text.
  jumpText.setText('Jumps: ' + jumps);

  // Handle jump input robustly:
  // - Use JustDown so each tap is counted only once.
  // - Allow up to 3 jumps (initial ground jump + 2 air jumps).
  if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
    console.log("Up key was just pressed!");
    if (jumps < 3) {
      jumps++;
      console.log("Performing jump #" + jumps);
      // Adjust the jump velocity here if needed (e.g., try -400 or -450 for a stronger jump)
      player.setVelocityY(-350);
      // Emit particles at the player's position for a visual effect.
      jumpEmitter.explode(10, player.x, player.y);
    } else {
      console.log("Maximum jump count reached.");
    }
  }
}
