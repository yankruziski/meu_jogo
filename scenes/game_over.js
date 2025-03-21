class game_over extends Phaser.Scene {

    constructor() {

        super({ key: 'game_over'});
    }

    // carregando recursos
    preload() {
        this.load.image('background', '../assets/background.png');
        this.load.image('reset', '../assets/reset.png');

       
    }

    create() {
        this.add.image(larguraJogo/2, alturaJogo/2, 'background').setScale(0.75);
        this.reset = this.add.image(larguraJogo/2, alturaJogo/2, 'reset').setScale(0.25).setInteractive();
        this.reset.on("pointerdown", () => {
            this.scene.start('jogo');
            pontos = 0
            console.log("a")
        })

    }

    update() {

    }

       

}