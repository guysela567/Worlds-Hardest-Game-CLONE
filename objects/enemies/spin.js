class SpinEnemy extends Enemy {
  constructor(x, y, r, anchor, angle, spinStep) {
    super(x, y, r);

    this.anchor = anchor;
    this.spinStep = spinStep;
    this.angle = angle;
  }

  update(boundaries, player, paused) {
    if (paused) return;
    this.baseUpdate(player);

    this.angle += this.spinStep;
    
    const d = dist(this.pos.x, this.pos.y, this.anchor[0], this.anchor[1]);
    const newX = this.anchor[0] + cos(this.angle) * d;
    const newY = this.anchor[1] + sin(this.angle) * d;

    this.pos = createVector(newX, newY);
  }
}