let game;
let assets;

function preload() {
	assets = {
		fonts: {
			prelevel: loadFont('assets/fonts/preLevel.ttf'),
			round: loadFont('assets/fonts/round.ttf'),
		},
	}
}

function setup() {
	createCanvas(WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE).center('horizontal');
  strokeWeight(BOUND_THICKNESS);
	textAlign(CENTER, CENTER);
	stroke(0);

	game = new Game(0);
}

function draw() {
	game.show();
	game.update();	
}