class menu extends Phaser.Scene {

    constructor() {

        super({ key: 'menu'});
    }

    // carregando recursos
    preload() {
        this.load.image('background', '../assets/background.png');
        this.load.image('start', '../assets/start.png');
        this.load.image('witch_run', '../assets/witch_run.png');

       
    }

    create() {
        this.add.image(larguraJogo/2, alturaJogo/2, 'background').setScale(0.75);
        this.add.image(larguraJogo/2, alturaJogo/4, 'witch_run').setScale(0.45);
        this.reset = this.add.image(larguraJogo/2, alturaJogo/2, 'start').setScale(0.25).setInteractive();
        this.reset.on("pointerdown", () => {
            this.scene.start('jogo');
            pontos = 0
            console.log("a")
        })

    }

    update() {

    }

       

}