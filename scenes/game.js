//definimos a classe e trazemos as funções do phaser ao nosso jogo 
class jogo extends Phaser.Scene {
  constructor() {
    super({ key: "jogo" });
  }

  preload() {
    //pré carregamos algumas imagens e sprite
    this.load.image("bg", "../assets/fundo_meu_jogo.jpg");
    this.load.image("plataforma", "../assets/plataforma.png");
    this.load.image("personagem", "../assets/witch.png");
    this.load.image("moeda", "../assets/estrela.png");
    this.load.image("bomba", "../assets/bomba.png");
    this.load.image("purpurina", "../assets/purpurina.png");
    this.load.image("moedona", "../assets/moedagrande.png");
    this.load.image("fada", "../assets/fada.png");
    this.load.image("mago", "../assets/mago.png");
  }

  create() {
    //adicionamos física a as bombas 
    this.bombs = this.physics.add.group();
    //adicionamos o background
    this.add.image(larguraJogo / 2, alturaJogo / 2, "bg").setScale(2.4);

    //definimos o teclado
    this.teclado = this.input.keyboard.createCursorKeys();

    //adicionamos o sprite da purpurina 
    this.purpurina = this.add.sprite(0, 0, "purpurina");
    this.purpurina.setVisible(false);
    this.purpurina.setScale(0.125);

    //definimos física ao personagem 
    this.personagem = this.physics.add.sprite(larguraJogo / 2, 630,"personagem");
    //definimos o tamanho e a escala do personagem
    this.personagem.body.setSize(500, 950, true);
    this.personagem.setScale(0.075);
    this.personagem.setCollideWorldBounds(true);

    //se o jogo for no desktop selecionamos o sprite moedona
    if (game.device.os.desktop) {
      this.moeda = this.physics.add.sprite(455, 420, "moedona");
    } else {
        //se nao selecionamos o sprite moeda
      this.moeda = this.physics.add.sprite(455, 420, "moeda");
    }
    //definimos o tamanho da moeda 
    this.moeda.body.setSize(480, 600, true);
    this.moeda.setScale(0.08);
    this.moeda.setBounce(0.7);

    //os pontos iniciam com zero 
    this.pontos = 0;
    this.placar = this.add.text(25, 30, "Moedas:" + this.pontos, {
      fontSize: "25px",
      fill: "#ffffff",
    });

    //se a orientação do jogo for landscape vai aparecer o mago 
    if (game.scale.orientation === Phaser.Scale.LANDSCAPE) {
      this.mago = this.add.image(800, 600, "mago");
      this.mago.setScale(0.25);
      //se a orientação do jogo for landscape vai aparecer a fada
    } else if (game.scale.orientation === Phaser.Scale.PORTRAIT) {
      this.fada = this.add.image(800, 600, "fada");
      this.fada.setScale(0.25);
    }

    //definimos plataformas de 1 a 3
    this.plataformas = [];
    this.plataformas[0] = this.physics.add.staticImage(455, 520, "plataforma");
    this.plataformas[1] = this.physics.add.staticImage(250, 365, "plataforma");
    this.plataformas[2] = this.physics.add.staticImage(45, 210, "plataforma");

    //definimos um loop para as plataformas, contendo um tamanho específico
    this.plataformas.forEach((plataforma) => {
      plataforma.body.setSize(90, 25, true);
      plataforma.setScale(0.18);
      //adicionamos física e colisão ao personagem e a moeda
      this.physics.add.collider(this.personagem, plataforma);
      this.physics.add.collider(this.moeda, plataforma);
    });
    
    //adicionamos física ao chão
    this.chao = this.physics.add.staticImage(larguraJogo / 2, 850, "plataforma");
    this.chao.body.setSize(6000, 340, true);
    this.chao.setScale(2.5);
    //adiciono colisão do chão e da moeda
    this.physics.add.collider(this.personagem, this.chao);
    this.physics.add.collider(this.moeda, this.chao);

    //função que verifica se o personagem e a moeda batem
    this.physics.add.overlap(this.personagem, this.moeda, () => {
      this.moeda.setVisible(false);
      let posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
      this.moeda.setPosition(posicaoMoeda_Y, 100);
      //ao pegar a moeda, os pontos vão aumentar em um 
      this.pontos += 1;
      this.placar.setText("Moedas:" + this.pontos);
      this.moeda.setVisible(true);

      // se dividir os pontos por 3 vai ser criada uma bomba
      if (this.pontos % 3 === 0) {
        let bomba = this.bombs.create(Phaser.Math.Between(1, 700),100, "bomba");
        bomba.setBounce(1);
        bomba.setScale(0.125);
        bomba.body.setSize(500, 500);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
        this.physics.add.collider(bomba, this.plataformas);
      }
    });

    //ao personagem tocar na bomba, aparecerá a tela de game_over
    this.physics.add.overlap(this.personagem, this.bombs, () => {
      this.scene.start("game_over");
    });
  }

  update() {//espaço para definir os controles WASD
    if (this.teclado.left.isDown) {
      this.personagem.setVelocityX(-150);
      this.personagem.setFlip(true, false);
    } else if (this.teclado.right.isDown) {
      this.personagem.setVelocityX(150);
      this.personagem.setFlip(false, false);
    } else {
      this.personagem.setVelocityX(0);
    }

    //o personagem só pode pular quando encostar no chão 
    let encostaChao =
      this.personagem.body.blocked.down || this.personagem.body.touching.down;
    if (encostaChao && this.teclado.up.isDown) {
      this.personagem.setVelocityY(-370);
      this.ativarPulo();
    } else if (this.teclado.down.isDown) {
      this.personagem.setVelocityY(300);
      this.desativarPulo();
    } else {
      this.desativarPulo();
    }

    //a purpurina vai seguir o personagem nos 
    this.purpurina.setPosition(this.personagem.x, this.personagem.y + 50);
  }
//funçoes para ativar e desativar o pulo 
  ativarPulo() {
    this.purpurina.setVisible(true);
    this.tempoPulo = 47;
  }

  desativarPulo() {
    if (this.tempoPulo > 0) {
      this.tempoPulo -= 1;
    } else {
      this.purpurina.setVisible(false);
    }
  }
}
