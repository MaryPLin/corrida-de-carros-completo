class Form{
  //constroi o formulario inicial
  constructor(){
    this.input = createInput("").attribute("placeholder", "Digite Seu Nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "game title");
    this.greeting = createElement("h2");
  }

  //define a posição dos elementos do formulario
  setElementsPosition(){
    this.titleImg.position(120, 50);
    this.input.position(width / 2 - 110, height / 2 - 80);
    this.playButton.position(width / 2 - 90, height / 2 - 20);
    this.greeting.position(width / 2 - 300, height / 2 - 100);
  }

  //define o estilo dos elementos do formulario
  setElementsStyle(){
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  //função para esconder os elementos
  hide(){
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  //função de intereção com o botao do formulario
  handleMousePressed(){
    this.playButton.mousePressed(() => {

      this.input.hide();
      this.playButton.hide();

      var message = `Olá ${this.input.value()}
      </br>espere o outro jogador entrar...`;
      this.greeting.html(message);

      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;

      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    });
  }

  //função para mostrar
  display(){
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }
}
