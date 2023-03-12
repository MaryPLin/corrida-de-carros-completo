//variaveis
var canvas;
var backgroundImage, car1_img, car2_img, track;
var fuelImage, powerCoinImage, lifeImage;
var obstacle1Image, obstacle2Image;
var database, gameState;
var blastImage;
var form, player, playerCount;
var allPlayers, car1, car2, fuels, powerCoins, obstacles;
var cars = [];

//carrega imagens/animaçoes/sons
function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/PISTA.png");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  blastImage = loadImage("./assets/blast.png");
}

//inicializa variaveis | executa uma vez
function setup() {
  //cria a tela
  canvas = createCanvas(windowWidth, windowHeight);
  
  //inicializa o bd
  database = firebase.database();

  //inicializa o jogo
  game = new Game();
  game.getState();
  game.start();
}

//desenha na tela | executa varias vezes
function draw() {
  background(backgroundImage);

  //se o player count for 2, o estado do jogo muda pra 1
  if (playerCount === 2) {
    game.update(1);
  }

  //se o estado do jogo for 1, o jogo inicia
  if (gameState === 1) {
    game.play();
  }

  //se o estado do jogo for 2, o jogo acabada
  if(gameState === 2){
    game.showLeaderboard();
    game.end();
  }
}

//atualiza o tamanho da tela sozinho
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}