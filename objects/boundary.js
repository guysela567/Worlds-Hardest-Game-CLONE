class Boundary {
  constructor(x, y, type) {
    const thickness = BOUND_THICKNESS * 0.5;

    this.x = x - thickness;
    this.y = y - thickness;
    
    this.horizontal = ['UP', 'DOWN'].includes(type);
    this.w = this.horizontal ? CELL_SIZE + thickness : thickness;
    this.h = this.horizontal ? thickness : CELL_SIZE + thickness;
    
    this.type = type;
  }
  
  show() {
    fill(0);
    rect(this.x, this.y, this.w, this.h);
  }
}