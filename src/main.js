

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

const PACMAN_SPEED = 150;

class Pacman extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "pacman");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }
}

class Pellet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "pellet");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.setScale(0.5);
  }
}

class PacmanScene extends Phaser.Scene {
  constructor() {
    super("PacmanScene");
    this.pellets = [];
  }

  preload() {
    this.load.image("pacman", "assets/pacman.png");
    this.load.image("pellet", "assets/pellet.png");
    this.load.image("wall", "assets/wall.png");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // Simple map with walls on the border
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (
          x === 0 ||
          y === 0 ||
          x === MAP_WIDTH - 1 ||
          y === MAP_HEIGHT - 1
        ) {
          this.walls.create(
            x * TILE_SIZE + TILE_SIZE / 2,
            y * TILE_SIZE + TILE_SIZE / 2,
            "wall"
          );
        }
      }
    }

    // Place pellets in the maze (not on walls)
    this.pelletsGroup = this.physics.add.group();
    for (let y = 1; y < MAP_HEIGHT - 1; y++) {
      for (let x = 1; x < MAP_WIDTH - 1; x++) {
        if ((x + y) % 2 === 0) {
          let pellet = new Pellet(
            this,
            x * TILE_SIZE + TILE_SIZE / 2,
            y * TILE_SIZE + TILE_SIZE / 2
          );
          this.pelletsGroup.add(pellet);
        }
      }
    }

    // Create Pacman in the center
    this.pacman = new Pacman(
      this,
      Math.floor(MAP_WIDTH / 2) * TILE_SIZE + TILE_SIZE / 2,
      Math.floor(MAP_HEIGHT / 2) * TILE_SIZE + TILE_SIZE / 2
    );

    this.physics.add.collider(this.pacman, this.walls);
    this.physics.add.overlap(
      this.pacman,
      this.pelletsGroup,
      this.eatPellet,
      null,
      this
    );
  }

  eatPellet(pacman, pellet) {
    pellet.destroy();
  }

  update() {
    this.pacman.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.pacman.body.setVelocityX(-PACMAN_SPEED);
      this.pacman.angle = 180;
    } else if (this.cursors.right.isDown) {
      this.pacman.body.setVelocityX(PACMAN_SPEED);
      this.pacman.angle = 0;
    }

    if (this.cursors.up.isDown) {
      this.pacman.body.setVelocityY(-PACMAN_SPEED);
      this.pacman.angle = 270;
    } else if (this.cursors.down.isDown) {
      this.pacman.body.setVelocityY(PACMAN_SPEED);
      this.pacman.angle = 90;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: TILE_SIZE * MAP_WIDTH,
  height: TILE_SIZE * MAP_HEIGHT,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: PacmanScene,
};

const game = new Phaser.Game(config);
