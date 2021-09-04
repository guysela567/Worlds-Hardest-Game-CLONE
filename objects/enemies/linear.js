class LinearEnemy extends Enemy {
  constructor(x, y, r, speed, horizontal, dir) {
    super(x, y, r, speed);

    this.vel = createVector(
      horizontal ? this.speed * dir : 0,
      horizontal ? 0 : this.speed * dir,
    );
    
    this.horizontal = horizontal;
  }

  update(boundaries, player, paused) {
    if (paused) return;
    this.baseUpdate(player);

    boundaries.forEach(({ x, y, w, h, horizontal }) => {
      // check if the enemy circle collides with any boundary

      // bounce horizontally
      if (this.horizontal && !horizontal
        && this.pos.x + this.r >= x 
        && this.pos.x - this.r <= x + w * 2
        && this.pos.y - CELL_SIZE * 0.5 - BOUND_THICKNESS * 0.5 == y)
          this.vel.x *= -1;

      // bounce vertically
      if (!this.horizontal && horizontal
        && this.pos.y + this.r >= y 
        && this.pos.y - this.r <= y + h * 2
        && this.pos.x - CELL_SIZE * 0.5 - BOUND_THICKNESS * 0.5 == x)
          this.vel.y *= -1;
    });

    this.pos.add(this.vel);
  }
}