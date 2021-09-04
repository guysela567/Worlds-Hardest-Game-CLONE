class Game {
  constructor(levelNum) {
    this.level = LEVEL_DATA[levelNum];
    this.levelNum = levelNum;
    
    this.player;
    this.playerW = 30;
    this.playerH = 30;
    
    this.coinR = 10;
    this.coins = this.level.coins.map(coin => this.createCoin(coin));

    this.grid = this.level.grid;
    this.player = new Player(this.level.playerPos.x, this.level.playerPos.y, this.playerW, this.playerH, this.coins);
    
    this.enemyR = 13;

    this.checkpoints;
    this.boundaries;
    this.finishBounds;
    this.enemies;
    
    this.generateBoundaries();
    this.generateFinishBounds();
    this.generateEnemies();

    // game logic
    this.paused = false;
    this.prelevel = true;
    this.prelevelDur = 1500;
    this.startLevel();
  }

  startLevel() {
    setTimeout(() => this.prelevel = false, this.prelevelDur);
  }

  nextLevel() {
    this.levelNum++;
    this.level = LEVEL_DATA[this.levelNum];
    this.grid = this.level.grid;

    this.generateBoundaries();
    this.generateFinishBounds();
    this.generateEnemies();

    this.coins = this.coins = this.level.coins.map(coin => this.createCoin(coin));

    this.prelevel = true;
    this.startLevel();
    this.reset();
  }

  reset() {
    this.coins = this.level.coins.map(coin => this.createCoin(coin));
    this.player = new Player(this.level.playerPos.x, this.level.playerPos.y, this.playerW, this.playerH, this.coins);
    
    this.paused = false;
  }

  generateEnemies() {
    this.enemies = this.level.enemies.map(enemy => this.createEnemiesFromType(enemy)).flat();
  }

  generateFinishBounds() {
    this.finishBounds = [];

    // get the finish areas
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const type = GRID_LEGEND[this.grid[j][i]];

        if (type == 'finish') {
          const x = i * CELL_SIZE;
          const y = j * CELL_SIZE;
          this.finishBounds.push({ x, y, w: CELL_SIZE, h: CELL_SIZE })
        }
      }
    }
  }

  createCoin({ x, y }) {
    return new Coin(x * CELL_SIZE, y * CELL_SIZE, this.coinR);
  }

  createEnemiesFromType({ type, speed, index, data }) {
    let x, y, enemies, dir;

    switch (type) {
      case 'linear':
        const { horizontal } = data;
        dir = data.dir;
        
        [x, y] = index.map(i => i * CELL_SIZE + CELL_SIZE * 0.5);
        return [new LinearEnemy(x, y, this.enemyR, speed, horizontal, dir)];
      
      case 'rectangular':
        const { path, vel } = data;
        dir = data.dir;

        [x, y] = index.map(i => i * CELL_SIZE + CELL_SIZE * 0.5);
        return [new RectangularEnemy(x, y, this.enemyR, speed, path, vel, dir)];
      
      case 'spin':
        const { amount, interval, hollow } = data;

        const anchor = index.map(i => i * CELL_SIZE + CELL_SIZE * 0.5);
        enemies = hollow ? [] : [new Enemy(...anchor, this.enemyR)];

        for (let i = 1; i < amount; i++) {
          for (let j = 0; j < 4; j++) {
            enemies.push(new SpinEnemy(
              anchor[0], 
              anchor[1] - i * interval * CELL_SIZE, 
              this.enemyR, 
              anchor,
              PI / 2 * j,
              speed,
            ));
          }
        }
        
        return enemies;
    }
  }

  generateBoundaries() {
    this.boundaries = [];

    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const type = GRID_LEGEND[this.grid[j][i]];

        if (type == 'wall') {
          // check all neighbor sides
          const right = GRID_LEGEND?.[this.grid?.[j]?.[i + 1]];
          const left = GRID_LEGEND?.[this.grid?.[j]?.[i - 1]];
          const up = GRID_LEGEND?.[this.grid?.[j - 1]?.[i]];
          const down = GRID_LEGEND?.[this.grid?.[j + 1]?.[i]];

          // add boundaries to border shape
          if (right && right != 'wall') {
            this.boundaries.push(new Boundary(
              (i + 1) * CELL_SIZE,
              j * CELL_SIZE,
              'RIGHT',
            ));
          }

          if (left && left != 'wall') {
            this.boundaries.push(
            new Boundary(
              i * CELL_SIZE, 
              j * CELL_SIZE,
              'LEFT',
            ));
          }

          if (up && up != 'wall') {
            this.boundaries.push(new Boundary(
              i * CELL_SIZE, 
              j * CELL_SIZE,
              'UP',
            ));
          }

          if (down && down != 'wall') {
            this.boundaries.push(new Boundary(
              i * CELL_SIZE,
              (j + 1) * CELL_SIZE,
              'DOWN',
            ));
          }
        }
      }
    }
  }

  drawBackground() {
    push();
    noStroke();

    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const type = GRID_LEGEND[this.grid[j][i]];
        // checkerboard pattern
        const color = type == 'blank' ?
          CELL_COLORS[i % 2 == j % 2 ? 'empty' : 'full'] :
          CELL_COLORS[type];

        fill(color);
        rect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    pop();
  }

  show() {
    if (this.prelevel) { // draw text before each level
      push();
      fill(0);
      noStroke();
      textSize(80);
      textFont(assets.fonts.prelevel);
      background(CELL_COLORS['wall']);
      text(this.level.prelevelText.toUpperCase(), width * 0.5, height * 0.5);
      pop();
    } else { // draw game normally
      this.drawBackground();
      this.boundaries.forEach(b => b.show());
      this.enemies.forEach(enemy => enemy.show());
      this.coins.forEach(coin => coin.show());
      this.player.show();
    }
  }

  update() {
    const paused = this.paused || this.prelevel;

    this.player.update(this.boundaries, this.finishBounds, paused);
    this.enemies.forEach(enemy => enemy.update(this.boundaries, this.player, paused));

    if (this.player.dead) this.reset();
    if (this.player.finished) this.nextLevel();
  }

  addEnemies(enemies) {
    this.enemies.push(...enemies);
  }
}