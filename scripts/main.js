var config;
let game;
window.onload = function() {
    // object containing configuration options
    config = {
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
    game = new Phaser.Game(config);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
}//END load listener

let camera,
    background,
    lerp,
    ollie,
    cursors,
    isDead,
    sx = 0,
    waterLevel,
    afterJump,
    timer,
    metersSwam = 0,
    metersSwamText,
    shellCount = 0,
    shellCountText,
    hasPuffer = false,
    loadedPuffer = false,
    ollieAndPuffer,
    canJumpText

class GameScene extends Phaser.Scene {
    constructor() { 
        super("GameScene")
    }

    preload() {
        this.load.image('background', 'assets/background_V1.png')
        // this.load.spritesheet('ollie', 'assets/ollie.png', { frameWidth: 180, frameHeight: 60 })
        this.load.spritesheet ('ollie', 'assets/ollieSwim.png', {frameWidth: 160, frameHeight: 125});
        this.load.image('obstacle1', 'assets/underwaterplant_pink.png');
        this.load.image('obstacle2', 'assets/underwaterplant_orange.png');
        this.load.image('obstacle3', 'assets/underwaterplant_green.png');
        this.load.image('powerUpPH1', 'assets/puffer.png');
        this.load.image('powerUpPH2', 'assets/shell.png');
        this.load.image('shell_pink', 'assets/shell_pink.png')



        //physics editor testing:
        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', 'assets/underwaterplant_green.json');
        
    }

    

    create() {
        var shapes = this.cache.json.get('shapes');
        //world stuff
        background = this.add.tileSprite(4000, 900, 0, 0, 'background')
        .setScale(8)

        this.physics.world.setBounds(0, 0, game.config.width, game.config.height * 1.5)
        
        //ollie and camera
        background.fixedToCamera = true;
        
        // ollie = this.physics.add.sprite(game.config.width / 3, game.config.height * .75, 'ollie')
        // .setScale(2);
        // ollie.setCollideWorldBounds(true);

        //animations
        ollie = this.physics.add.sprite(game.config.width / 3, game.config.height * .75, 'ollie').setScale(2);
        ollie.setCollideWorldBounds(true);
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('ollie'),
            frameRate: 8,
            repeat: -1
        });
        ollie.anims.play('swim');

        camera = this.cameras.main;
        camera.setBounds(0, 0, game.config.width, game.config.height * 1.5);
        camera.startFollow(ollie, false, 0.5, 0.03);

        //obstacles, currency, power ups
        this.groundObstacles = this.physics.add.group();
        this.currencies = this.physics.add.group();
        this.powerUps = this.physics.add.group();

        //generates obstacles at random times
        setInterval(() => createGroundObstacles(this.groundObstacles), 5000);
        setInterval(() => createCurrency(this.currencies), 2000);
        setInterval(() => createPowerUps(this.powerUps), 4000);

        //detects for collisions between ollie & currency + ground obstacles
        this.physics.add.collider(ollie, this.groundObstacles, obstacleCollision)
        this.physics.add.collider(ollie, this.currencies, collectCurrency)
        this.physics.add.collider(ollie, this.powerUps, collectPuffer)

        //create text to display score
        metersSwamText = this.add.text(game.config.width * 0.02, game.config.height * 0.01, 'Meters Swam: 0', {fontSize: '85px', color: '#FFF'}).setScrollFactor(0);
        //create text to display shell count
        this.shellCounter = this.add.image(game.config.width * 0.79, game.config.height * 0.048, 'shell_pink').setOrigin(0.5).setScrollFactor(0,0).setScale(2);
        shellCountText = this.add.text(game.config.width * 0.90, game.config.height * 0.05, 'Shell Count: 0', {fontSize: '65px', fill: '#FFF'}).setOrigin(0.5).setScrollFactor(0,0);
        //user is able to jump text
        canJumpText = this.add.text(game.config.width * 0.5, game.config.height * 0.01, 'jump', {fontSize: '85px', color: 'rgba(256,256,256,0.5)'}).setScrollFactor(0);

        //input
        cursors = this.input.keyboard.createCursorKeys();

        //create variable to use for stopping ollie from moving up ocean level
        waterLevel = background.y / 2.1 //428.57
     
       
    }
    update() {
        this.checkForPuffer()
        this.movement()
        this.moveBackground()
        this.canJump()
        if (isDead) {
            console.log('ur dead');
            this.scene.stop();
        } else {
            sx += 8; //movement of the obstacles
            addMetersSwam(1);
            //updates obstacle pos
            if (sx === 16){
                this.groundObstacles.getChildren().forEach(obstacle => {
                    if (obstacle.getBounds().right < 0) {
                        this.groundObstacles.killAndHide(obstacle);
                    } else {
                        obstacle.x -= 20;
                    }
                })
                sx = 0;
            }

            //updates currency pos

            this.currencies.getChildren().forEach(currencyChild => {
              if (currencyChild.getBounds().right < 0) {
                this.currencies.killAndHide(currencyChild);
              }
              else {
                currencyChild.x -= 10;
              }
            });
            
            //updates power up pos
            this.powerUps.getChildren().forEach(powerUpChild => {
                if (powerUpChild.getBounds().right < 0) {
                    this.powerUps.killAndHide(powerUpChild);
                }
                else {
                    powerUpChild.x -= 10;
                }
            });
        }
        //background._tilePosition.x += 1.69
    }

    canJump() {
        if(ollie.y <= waterLevel + 150 && ollie.y >= waterLevel && ollie.body.velocity.y < 0) {
            canJumpText.setStyle({color: 'rgb(256,256,256,1)'})
        } else {
            canJumpText.setStyle({color: 'rgb(256,256,256,0.5)'})
        }
    }

    checkForPuffer() {
        if(hasPuffer && !loadedPuffer) {
            ollieAndPuffer = this.add.image(ollie.x, ollie.y-50, 'powerUpPH1').setScale(0.06)
            loadedPuffer = true;
        } else if(hasPuffer && loadedPuffer) {
            ollieAndPuffer.x = ollie.x;
            ollieAndPuffer.y = ollie.y-50;
        }
    }//END CHECKFORPUFFER

    movement() { //DECREASING Y IS UP AND INCREASING IS DOWN. NEGATIVE IS UP AND POSITIVE IS DOWN
        ollie.body.acceleration.y = 0
        if(ollie.y >= waterLevel + 300) { //underwater with some downward expanding margin -- disable up arrow to prevent upper bound stuttering
            ollie.body.gravity.y = 0 //reset gravity so ollie isn't always going down
            if(ollie.body.velocity.y > 0 && afterJump === true) { //brings Ollie down slower and slower until he stops descending
                ollie.body.acceleration.y = -400
                if(ollie.body.velocity.y < 4 ) {
                    ollie.body.velocity.y = 0
                    ollie.body.acceleration.y = 0
                    afterJump = false
                }
            }
            // ollie.setVelocity(0)
            if (cursors.up.isDown) {
                afterJump = false
                ollie.setVelocityY(-500)
            } if (cursors.down.isDown){
                afterJump = false
                ollie.setVelocityY(500)
            }
        } else if(ollie.y <= waterLevel + 150 && ollie.y >= waterLevel) { //below water but in range of waterLevel to charge jump - can move up, down, and jump
            ollie.body.gravity.y = 900
            if(cursors.space.isDown && ollie.body.velocity.y < 0) { //presses space - only works if Ollie is moving upwards to prevent space spam
                afterJump = true
                ollie.setVelocityY(ollie.body.velocity.y * 1.03) //increase upward velocity while space is pressed
            } else if(cursors.down.isDown) { // down pressed
                afterJump = false
                ollie.setVelocityY(500)
            } else {
                afterJump = true
            }
        }  else if(ollie.y < waterLevel) { //above water
            ollie.body.gravity.y = 400
        } 
    }//END MOVEMENT FUNCTION

    moveBackground() {
        background._tilePosition.x += 1.69
    }
} //END GameScene

function createGroundObstacles(groundObstacles) {
    var obstacleList = ['obstacle1', 'obstacle2', 'obstacle3'];
    let obstacleIndex = Phaser.Math.RND.between(0, 2);
    var chosenObstacle = obstacleList[obstacleIndex];

    var obstacle = groundObstacles.create(game.config.width + 50, 1800, chosenObstacle);
    obstacle.setOrigin(0.5, 0);
    obstacle.setSize(200, 200);
    obstacle.setScale(2);
} //END CREATEGROUNDOBSTACLES

function createCurrency(currencies) {
    //choose random value between river height and bottom of the screen
    let currencyHeight = Phaser.Math.RND.between(2000, 500)
    var currency = currencies.create(game.config.width + 50, currencyHeight, 'shell_pink')
    currency.setOrigin(0.5, 0)
    currency.setScale(1.5)

    currency.body.setImmovable(false);
} //END CREATEFLOATOBSTACLES

function createPowerUps(powerUps) {
    // var powerUpList = ['powerUpPH1'];
    // // let powerUpIndex = Phaser.Math.RND.between(0, 1);
    // var chosenPowerUp = powerUpList[0];
    let powerUpHeight = Phaser.Math.RND.between(2000, 500)
    var powerUp = powerUps.create(game.config.width * 0.97, powerUpHeight, 'powerUpPH1');
    // console.log('spawning puffer')
    powerUp
    .setOrigin(0.5, 0.5)
    .setScale(0.08)
    //example code had these setings but console error when i use it
    // obstacle.body.allowGravity = false;
    powerUp.body.setImmovable(false);
    // obstacle.body.moves = false;
} //END CREATEFLOATOBSTACLES

function collectCurrency(ollie, currency) {
    currency.x = -200;
    shellCount++;
    shellCountText.setText('Shell Count: ' + shellCount)
    // console.log(shellCount)
}

function collectPuffer(ollie, puffer) {
    console.log('puffer powerup')
    puffer.x = -200;
    hasPuffer = true;
}

function obstacleCollision(ollie, obstacle) {
    if(hasPuffer) {
        obstacle.x = -200;
        hasPuffer = false;
        loadedPuffer = false;
        ollieAndPuffer.destroy();
    } else {
        isDead = true;
    }
}

function addMetersSwam(points){
    metersSwam += points;
    metersSwamText.setText('Meters Swam: ' + metersSwam);
}

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

