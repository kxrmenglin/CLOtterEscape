let config
let game
window.onload = function() {
    // object containing configuration options
    let config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: GameScene,
        physics: {
            default: "arcade",
            arcade: { debug:true }
        }
    }
    game = new Phaser.Game(config)
    window.focus()
    resize()
    window.addEventListener("resize", resize, false)
}//END load listener

let camera,
    background,
    lerp,
    ollie,
    cursors
    
    

class GameScene extends Phaser.Scene {
    constructor() { 
        super("GameScene")
    }

    preload() {
        this.load.image('background', 'assets/background_V1.png')
        this.load.spritesheet('ollie', 'assets/ollie.png', { frameWidth: 180, frameHeight: 60 })
    }

    create() {
        this.physics.world.setBounds(0, 0, game.config.width, game.config.height * 1.24)
        
        background = this.add.tileSprite(game.config.width / 2, game.config.height / 2,0,game.config.height , 'background')
        .setScale(4)
        
        background.fixedToCamera = true;
        
        ollie = this.physics.add.sprite(game.config.width / 3, game.config.height * .75, 'ollie')
        ollie.setCollideWorldBounds(true)

        camera = this.cameras.main
        camera.setBounds(0, 0, game.config.width /2, game.config.height*1.24)
        camera.startFollow(ollie, false, 0.5, 0.03)
        
        cursors = this.input.keyboard.createCursorKeys()
    }
    update() {
        this.movement()
        background._tilePosition.x += 1.69;
    }

    movement() {
        if (cursors.up.isDown) {
            ollie.setVelocityY(-200)
        } else if (cursors.down.isDown){
            ollie.setVelocityY(200)
        }
    }


} //END GameScene

function resize() { 
    let canvas = document.querySelector("canvas")
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight
    let windowRatio = windowWidth / windowHeight
    let gameRatio = game.config.width / game.config.height
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px"
        canvas.style.height = (windowWidth / gameRatio) + "px"
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px"
        canvas.style.height = windowHeight + "px"
    }
} //END resize function