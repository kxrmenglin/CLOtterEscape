let config
let game
window.onload = function() {
    // object containing configuration options
    let config = {
        type: Phaser.AUTO,
        width: 3000,
        height: 1452,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
    cursors,
    isDead,
    sx = 0

class GameScene extends Phaser.Scene {
    constructor() { 
        super("GameScene")
    }

    preload() {
        this.load.image('background', 'assets/background_V1.png')
        this.load.spritesheet('ollie', 'assets/ollie.png', { frameWidth: 180, frameHeight: 60 })

        this.load.image('obstacle1', 'assets/underwaterplant_pink.png');
        this.load.image('obstacle2', 'assets/underwaterplant_orange.png');
        this.load.image('obstacle3', 'assets/underwaterplant_green.png');
        this.load.image('puffer', 'assets/puffer.png');
        this.load.image('shell', 'assets/shell.png');
    }

    create() {
        //world stuff
        background = this.add.tileSprite(4000, 900, 0, 0, 'background')
        .setScale(8)

        this.physics.world.setBounds(0, 0, game.config.width, game.config.height * 1.5)
        
        //ollie and camera
        background.fixedToCamera = true;
        
        ollie = this.physics.add.sprite(game.config.width / 3, game.config.height * .75, 'ollie')
        .setScale(2)
        ollie.setCollideWorldBounds(true)

        camera = this.cameras.main
        camera.setBounds(0, 0, game.config.width, game.config.height * 1.5)
        camera.startFollow(ollie, false, 0.5, 0.03)

        //obstacles
        this.groundObstacles = this.physics.add.group();
        this.floatObstacles = this.physics.add.group();

        setInterval(() => createGroundObstacles(this.groundObstacles), 3000);
        //setInterval(() => createFloatObstacles(this.floatObstacles), 2000);
          this.physics.add.collider(ollie, this.groundObstacles, function (ollie, groundObstacles) {
            console.log("lol");
            isDead = true;
        });
        
        cursors = this.input.keyboard.createCursorKeys()
    }
    update() {
        this.movement()
        background._tilePosition.x += 1.69;

        if (isDead) {
            console.log('ur dead');
            //this.scene.stop();
        } else {
            sx += 8; //change this to diff number divisible by 4 to slow down movement
            if (sx === 16){
                this.groundObstacles.getChildren().forEach(obstacle => {
                    if (obstacle.getBounds().right < 0) {
                        this.groundObstacles.killAndHide(obstacle);
                    } else {
                        obstacle.x -= 3;
                    }
                })
            }

            //Code for power up item update

            // this.floatObstacles.getChildren().forEach(floatObstacle => {
            //   if (floatObstacle.getBounds().right < 0) {
            //     this.floatObstacles.killAndHide(floatObstacle);
            //   }
            //   else {
            //     floatObstacle.x -= 3;
            //   }
            // });
            sx = 0;
        }
  
  
    }

    movement() {
        if (cursors.up.isDown) {
            ollie.setVelocityY(-500)
        } else if (cursors.down.isDown){
            ollie.setVelocityY(500)
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

function createGroundObstacles(groundObstacles) {
    var obstacleList = ['obstacle1', 'obstacle2', 'obstacle3'];
    let obstacleIndex = Phaser.Math.RND.between(0, 2);
    var chosenObstacle = obstacleList[obstacleIndex];

    var obstacle = groundObstacles.create(game.config.width + 50, game.config.height, chosenObstacle);
    obstacle.setOrigin(0.5, 1);
    obstacle.setSize(200, 400);
    console.log(obstacle);

    //example code had these setings but console error when i use it
    //obstacle.body.allowGravity = false;
    //obstacle.body.setImmovable(true);
    //obstacle.body.moves = false;
} //END CREATEGROUNDOBSTACLES