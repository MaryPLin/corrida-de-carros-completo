class Game {
  //constroi os elementos do jogo
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  //pega o estado do jogo
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  //atualiza o estado do jogo
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  //quando inicia o jogo
  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 100, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.09;
    car1.addImage("blast", blastImage);

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.09;
    car2.addImage("blast", blastImage);

    cars = [car1, car2];

    fuels = new Group();

    powerCoins = new Group();

    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 200, y: height - 800, image: obstacle1Image },
      { x: width / 2 - 200, y: height - 1000, image: obstacle2Image },
      { x: width / 2 + 170, y: height - 1200, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 1400, image: obstacle1Image },
      { x: width / 2 + 120, y: height - 1600, image: obstacle2Image },
      { x: width / 2 - 120, y: height - 1800, image: obstacle2Image },
      { x: width / 2 - 220, y: height - 2000, image: obstacle1Image },
      { x: width / 2 + 220, y: height - 2200, image: obstacle2Image },
      { x: width / 2 + 180, y: height - 2400, image: obstacle1Image },
      { x: width / 2 - 230, y: height - 2600, image: obstacle2Image },
      { x: width / 2 + 200, y: height - 2800, image: obstacle2Image },
    ];

    this.addSprites(fuels, 4, fuelImage, 0.02);
    this.addSprites(powerCoins, 20, powerCoinImage, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);

  }

  //mostrar na tela
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x;
      var y;
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }
      else {
        x = random(width / 2 - 150, width / 2 + 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;

      spriteGroup.add(sprite);
    }
  }

  //elementos escritos e botão
  handleElements() {
    form.hide();
    form.titleImg.hide();

    this.resetTitle.html("reiniciar jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 280, 30);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 330, 100);

    this.leadeboardTitle.html("players");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 2 - 400, 30);

    this.leader1.class("leadersText");
    this.leader1.position(width / 2 - 450, 100);
    this.leader2.class("leadersText");
    this.leader2.position(width / 2 - 450, 150);
  }

  //função botão reset
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showFuelBar();
      this.showLife();
      this.showLeaderboard();

      var index = 0;
      for (var plr in allPlayers) {
        index = index + 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentlife = allPlayers[plr].life;

        if (currentlife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.3;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCarACollisionWithCarB(index);
          this.handleObstacleCollision(index);

          if (player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }

          camera.position.y = cars[index - 1].position.y;
        }
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }

      this.handlePlayerControls();

      const finshLine = height * 6 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 230, height - player.positionY - 480, 20, 20);
    fill("white");
    rect(width / 2 - 200, height - player.positionY - 480, 185, 20);
    fill("#f50057");
    rect(width / 2 - 200, height - player.positionY - 480, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuelImage, width / 2 - 230, height - player.positionY - 430, 20, 20);
    fill("white");
    rect(width / 2 - 200, height - player.positionY - 430, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 200, height - player.positionY - 430, player.fuel, 20);
    noStroke();
    pop();
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = true;
        player.positionX -= 5;
        player.update();
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionX += 5;
        player.update();
      }
    }
  }

  handleFuel(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      collected.remove();
    });

    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function (collector, collected) {
      player.score += 21;
      player.update();
      collected.remove();
    });
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }

  //mostrar o rank final
  showRank() {
    swal({
      title: `parabens! ${"\n"} rank ${"\n"} ${player.rank}`,
      text: "muito bom, voce ganhou o jogo",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "ok"

    });
  }

  //mostrar o game over
  gameOver() {
    swal({
      title: `fim de jogo`,
      text: "que pena, voce perdeu",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "ok"

    });
  }

  end() {
    console.log("Fim de Jogo");
  }
}
