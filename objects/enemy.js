class Enemy {
  constructor(x, y, r, speed) {
    this.pos = createVector(x, y);
    this.r = r;
    this.speed = speed;
  }

  show() {
    fill(0, 0, 255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  update(boundaries, player, pause) {
    if (pause) return;
    this.baseUpdate(player);
  }

  baseUpdate(player) {
    // kill the player on contact
    if (this.pos.x - this.r < player.pos.x + player.w && this.pos.x + this.r > player.pos.x
      && this.pos.y - this.r < player.pos.y + player.w && this.pos.y + this.r > player.pos.y)
      player.kill();
  }
}