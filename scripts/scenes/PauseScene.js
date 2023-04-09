class PauseScene extends Phaser.Scene {
    constructor() {
        super({key: 'PauseScene'});
    }

    preload() {
        this.load.image('background', 'assets/background_V1.png');
        this.load.image('pauseTitle', 'assets/otterescape_pausescreen_pause.png');
        this.load.image('endButton', 'assets/otterescape_pausescreen_end.png');
        this.load.image('resumeButton', 'assets/otterescape_pausescreen_resume.png');
    }

    create() {
        let background = this.add.sprite(2040, 950, 'background') //temporary background for pause scene
        .setScale(8)

        let pauseTitle = this.add.sprite(game.config.width/2, game.config.height/3, 'pauseTitle')
        .setOrigin(0.5)
        .setScale(2.5)

        let end = this.add.sprite(game.config.width/2, game.config.height/1.2, 'endButton')
        .setOrigin(0.5)
        .setScale(2)

        let resume = this.add.sprite(game.config.width/2, game.config.height/1.5, 'resumeButton')
        .setOrigin(0.5)
        .setScale(2)
    }

    //need to transition over to game scene


}

export default PauseScene;