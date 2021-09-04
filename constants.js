const CELL_SIZE = 64;

const CELL_COLORS = {
  full: '#e6e6ff',
  empty: '#ffffff',
  wall: '#b4b5fe',
  checkpoint: '#b5feb4',
  player: '#ff0000',
  dot: '#0000ff',
  start: '#b5feb4',
  finish: '#b5feb4'
};

const WIDTH = 20;
const HEIGHT = 14;

const GRID_LEGEND = {
  ' ': 'blank',
  '*': 'wall',
  '(': 'start',
  ')': 'finish',
  '-': 'checkpoint'
};

BOUND_THICKNESS = 5;