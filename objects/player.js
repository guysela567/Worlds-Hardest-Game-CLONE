class Player {
  constructor(x, y, w, h, coins) {
    // movement
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.speed = 3;

    // dimensions
    this.w = w;
    this.h = h;

    // death
    this.dying = false;
    this.alpha = 255;
    this.weight = BOUND_THICKNESS;
    this.deathAnimSpeed = 0.1;
    
    // game logic
    this.dead = false;
    this.finished = false;
    this.coins = coins;
  }

  kill() {
    this.dying = true;
  }

  show() {
    // death animation
    this.alpha = this.dying ? lerp(this.alpha, 0, this.deathAnimSpeed) : this.alpha;
    this.weight = this.dying ? lerp(this.weight, 0, this.deathAnimSpeed) : this.weight;
    
    // draw player to canvas
    push();
    stroke(0, this.alpha);
    strokeWeight(this.weight);
    fill(255, 0, 0, this.alpha);
    rect(this.pos.x, this.pos.y, this.w, this.h);
    pop();
  }

  update(boundaries, finishBounds, pause) {
    if (this.dying) {
      // "kill" player on end of death animation
      if (this.alpha < 0.1 && this.weight < 0.1) this.dead = true;
      return;
    }

    // prevent player from moving and potentially dying while game is paused
    if (pause) return;
    if (this.checkFinish(finishBounds)) return;

    this.coinCollisionCheck();
    this.handleKeyPresses(boundaries);
    this.pos.add(this.vel); // apply movement
  }

  coinCollisionCheck() {
    // iterate through array backwards to avoid flickering
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const { x, y, r } = this.coins[i];
      // check if player collides with any coin
      if (this.pos.x + this.w > x - r && this.pos.x < x + r
      && this.pos.y + this.h > y - r && this.pos.y < y + r)
        this.coins.splice(i, 1);
    }
  }

  handleKeyPresses(boundaries) {
    // vertical movement
    if (keyIsDown(UP_ARROW)) this.vel.y = -this.speed;
    else if (keyIsDown(DOWN_ARROW)) this.vel.y = this.speed;
    else this.vel.y = 0;

    // horizontal movement
    if (keyIsDown(LEFT_ARROW)) this.vel.x = -this.speed;
    else if (keyIsDown(RIGHT_ARROW)) this.vel.x = this.speed;
    else this.vel.x = 0;

    
    // constrain velocity to avoid overlapping with game's bounds
    boundaries.forEach(({ x, y, w, h, type }) => {
      // check if player collides with any boundary
      if (this.pos.x < x + w && this.pos.x + this.w > x
        && this.pos.y < y + h && this.pos.y + this.h > y) {
          
          switch (type) {
            case 'RIGHT': // constrain movement to the left
              this.vel.x = constrain(this.vel.x, 0, this.speed);
              break;

            case 'LEFT': // constrain movement to the right
              this.vel.x = constrain(this.vel.x, -this.speed, 0);
              break;

            case 'UP': // constrain movement downwards
              this.vel.y = constrain(this.vel.y, -this.speed, 0);
              break;

            case 'DOWN': // constrain movement upwards
              this.vel.y = constrain(this.vel.y, 0, this.speed);
          }
      }
    });
  }

  checkFinish(finishBounds) {
    // check if player collides with any finish bound
    return finishBounds.forEach(({ x, y, w, h }) => {
      if (this.pos.x + this.w > x && this.pos.x < x + w
        && this.pos.y + this.h > y && this.pos.y < y + h
        && this.coins.length == 0) { // check if player collected all of the coins
          this.finished = true;
          return; // no need to keep searching
        }
    });
  }
}