class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});
    }

    preload() {
        this.load.image('background', 'assets/background_V1.png');
        this.load.image('title', 'assets/logov2.png');
    }

    create() {
        let background = this.add.sprite(2040, 950, 'background') //temporary background for title scene
        .setScale(8)

        let title = this.add.sprite(game.config.width/2, game.config.height/3, 'title')
        .setScale(6)

        let playNow = this.add.text(game.config.width/2, game.config.height/1.3, 'PRESS SPACE TO START')
        .setOrigin(0.5)
        .setScale(6)

        //this creates blinking text effect
        this.tweens.add({
            targets: playNow,
            alpha: 0,
            ease: 'Quad.easeOut',  
            duration: 2000,
            repeat: -1,
            yoyo: true
          })
    }



}

export default TitleScene;