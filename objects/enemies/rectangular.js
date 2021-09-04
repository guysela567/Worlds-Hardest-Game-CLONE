class RectangularEnemy extends Enemy {
  constructor(x, y, r, speed, path, vel, dir) {
    super(x, y, r, speed);

    this.vel = createVector(...vel.map(v => v * this.speed));

    this.dir = dir; // 1 for clockwize, -1 for anti-clockwize
    this.path = path;
  }

  update(boundaries, player, paused) {
    if (paused) return;
    this.baseUpdate(player);
    
    const [x, y, w, h] = this.path;
    const i = (this.pos.x - CELL_SIZE * 0.5) / CELL_SIZE;
    const j = (this.pos.y - CELL_SIZE * 0.5) / CELL_SIZE;

    // move in previous direction untill it reaches one of the path's corners
    if (equal(i, x) && equal(j, y)) // top left
      this.vel = this.dir > 0 ? createVector(this.speed, 0)
        : createVector(0, this.speed);

    else if (equal(i, x) && equal(j, y + h)) // bottom left
      this.vel = this.dir > 0 ? createVector(0, -this.speed)
        : createVector(this.speed, 0);

    else if (equal(i, x + w) && equal(j, y)) // top right
      this.vel = this.dir > 0 ? createVector(0, this.speed)
        : createVector(-this.speed, 0);
      
    else if (equal(i, x + w) && equal(j, y + h)) // bottom right
      this.vel = this.dir > 0 ? createVector(-this.speed, 0)
        : createVector(0, -this.speed);

    this.pos.add(this.vel); // move in the set direction
  }
}

function equal(a, b) {
  return abs(a - b) < 0.015626;
}