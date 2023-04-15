var config;
var game;
window.onload = function() {
    let titleScene = new TitleScene();
    let gameScene = new GameScene();
    let pauseScene = new PauseScene();
    let deathScene = new DeathScene();
    // object containing configuration options
    config = {
        type: Phaser.AUTO,
        width: 3000,
        height: 1452,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        scene: [TitleScene, GameScene, PauseScene, DeathScene], //made it a scene array to switch between scenes
        physics: {
            default: "arcade",
            arcade: { debug:true }
        }
    }
    game = new Phaser.Game(config);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);

    game.scene.add('TitleScene', titleScene);
    // game.scene.start('TitleScene');

    game.scene.add('GameScene', gameScene);
    // game.scene.start('GameScene');

    game.scene.add('PauseScene', pauseScene);
    // game.scene.start('PauseScene');

    game.scene.add('DeathScene', deathScene);

}//END load listener

class DeathScene extends Phaser.Scene {
    constructor() {
        super({key: 'DeathScene'});
    }//END CONSTRUCTOR
    preload() {
        //this.load.image('background', 'assets/background_V1.png')
        // this.load.spritesheet('ollie', 'assets/ollie.png', { frameWidth: 180, frameHeight: 60 })
        //this.load.spritesheet ('ollie', 'assets/ollieSwim.png', {frameWidth: 160, frameHeight: 125});
        //this.load.image('obstacle1', 'assets/underwaterplant_pink.png');
        //this.load.image('obstacle2', 'assets/underwaterplant_orange.png');
        //this.load.image('obstacle3', 'assets/underwaterplant_green.png');
        //this.load.image('powerUpPH1', 'assets/puffer.png');
        //this.load.image('powerUpPH2', 'assets/shell.png');
        //this.load.image('shell_pink', 'assets/shell_pink.png')
        // this.load.image('background', 'assets/background_V1.png');
        this.load.image('deathTitle', 'assets/otterescape_pausescreen_pause.png'); //temp
    }//END PRELOAD
    create() {
        // let background = this.add.sprite(2040, 950, 'background') //temporary background for pause scene
        // .setScale(8)

        let deathTitle = this.add.sprite(game.config.width/2, game.config.height/3, 'deathTitle')
        .setOrigin(0.5)
        .setScale(2.5)

        let playAgainTitle = this.add.text(game.config.width/2, game.config.height/1.5, 'Play Again?')
        .setOrigin(0.5)
        .setScale(6)

        var yes = this.add.text(game.config.width/2.4, game.config.height/1.3, 'yes')
        .setScale(4.5)
        .setInteractive({ useHandCursor: true })

        var no = this.add.text(game.config.width/1.9, game.config.height/1.3, 'no')
        .setScale(4.5)
        .setInteractive({ useHandCursor: true })


        //color the button when cursor is hovered over
        yes.on('pointerover', function(event) {
            yes.setTint(808080);
        });
        yes.on('pointerout', function (pointer) {
            yes.clearTint();
        });
        yes.on('pointerdown', function(pointer) { 
            // game.scene.stop('GameScene');
            game.scene.start('GameScene');
            game.scene.stop('DeathScene');
        });


        //color the button when cursor is hovered over
        no.on('pointerover', function(event) {
            no.setTint(808080);
        });
        no.on('pointerout', function (pointer) {
            no.clearTint();
        });
        no.on('pointerdown', function(pointer) { 
            game.scene.stop('GameScene');
            game.scene.stop('DeathScene');
            game.scene.start('TitleScene');
        });
    }//END CREATE
}//END DEATHSCENE

class PauseScene extends Phaser.Scene {
    constructor() {
        super({key: 'PauseScene'});
    }//END CONSTRUCTOR

    preload() {
        this.load.image('pauseTitle', 'assets/otterescape_pausescreen_pause.png');
        this.load.image('endButton', 'assets/otterescape_pausescreen_end.png');
        this.load.image('resumeButton', 'assets/otterescape_pausescreen_resume.png');
    }//END PRELOAD

    create() {

        let pauseTitle = this.add.sprite(game.config.width/2, game.config.height/3, 'pauseTitle')
        .setOrigin(0.5)
        .setScale(2.5)

        var end = this.add.sprite(game.config.width/2, game.config.height/1.2, 'endButton')
        .setOrigin(0.5)
        .setScale(2)
        .setInteractive({ useHandCursor: true })

        var resume = this.add.sprite(game.config.width/2, game.config.height/1.5, 'resumeButton')
        .setOrigin(0.5)
        .setScale(2)
        .setInteractive({ useHandCursor: true })

        //color the button when cursor is hovered over
        resume.on('pointerover', function(event) {
            resume.setTint(808080);
        });
        resume.on('pointerout', function (pointer) {
            resume.clearTint();
        });
        resume.on('pointerdown', function(pointer) { //
            game.scene.stop('PauseScene');
            game.scene.resume('GameScene');
        });


        //color the button when cursor is hovered over
        end.on('pointerover', function(event) {
            end.setTint(808080);
        });
        end.on('pointerout', function (pointer) {
            end.clearTint();
        });
        end.on('pointerdown', function(pointer) { //
            game.scene.stop('GameScene');
            game.scene.start('TitleScene');
            game.scene.stop('PauseScene');
        });//END CREATE
    }//END PAUSE SCENE
}
//title scene
class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});
    }//END CONSTRUCTOR

    preload() {
        this.load.image('background', 'assets/background_V1.png');
        this.load.image('title', 'assets/logov2.png');
        this.load.image('playButton', 'assets/playButton.png');
    }//END PRELOAD

    create() {
        let background = this.add.sprite(2040, 950, 'background') //temporary background for title scene
        .setScale(8)

        let title = this.add.sprite(game.config.width/2, game.config.height/2.5, 'title')
        .setOrigin(0.5)
        .setScale(6.5)

        var playButton = this.add.sprite(game.config.width/2, game.config.height/1.3, 'playButton')
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setScale(2)

        //color the button when cursor is hovered over
        playButton.on('pointerover', function(event) {
            playButton.setTint(808080);
        });
        playButton.on('pointerout', function (pointer) {
            playButton.clearTint();
        });

        //starts the game scene
        playButton.on('pointerdown', function(pointer) { 
            game.scene.start('GameScene');
            game.scene.stop('TitleScene');
            game.scene.stop('DeathScene');
        });
    }//END CREATE
}//END TITLESCENE

//DECLARATIONS
let 
    //GAME ELEMNTS 
        //CONSTANTS
        border,
        background,
        ollie,
        camera,
        cursors,
        waterLevel,
        //GAME STATE
        isDead,
    //MOVEMENT
        afterJump,
    //NAVBAR
        //METERS SWAM TEXT
        placeholder = "0000000000",
        metersSwam,
        metersSwamText,
        //JUMP TEXT
        canJumpText,
        //CURRENCY TEXT
        shellCount,
        shellCountText,
        //ON DECK POWERUP IMAGE
        onDeck,  
    //OBSTACLES
        sx = 0,
    //POWERUPS --- 0 = nothing, 1 = puffer, 2 = bubble
        currentPowerUp,
        loadedPowerUp = 0,
        powerUpsQueue = []
//END DECLARATIONS
class GameScene extends Phaser.Scene {
    constructor() { 
      super({key: 'GameScene'}) //added key
    }//END CONSTRUCTOR

    preload() {
        //GAME ELEMENTS
        this.load.image('border', 'assets/borderv2.png')
        this.load.image('background', 'assets/background_V1.png')
        this.load.spritesheet('ollie', 'assets/ollieSwim.png', { frameWidth: 160, frameHeight: 125 })
        //OBSTACLES
        this.load.image('obstacle1', 'assets/underwaterplant_pink.png')
        this.load.image('obstacle2', 'assets/underwaterplant_orange.png')
        this.load.image('obstacle3', 'assets/underwaterplant_green.png')
        this.load.image('boot', 'assets/boot.png')
        this.load.image('can', 'assets/can.png')
        this.load.image('duck', 'assets/duck.png')
        this.load.image('rock1', 'assets/rock1.png')
        this.load.image('rock2', 'assets/rock2.png')
        this.load.image('rock3', 'assets/rock3.png')
        this.load.image('rock4', 'assets/rock4.png')
        this.load.image('rock5', 'assets/rock5.png')
        this.load.image('rock6', 'assets/rock6.png')
        //POWERUPS
        this.load.image('powerUpPH1', 'assets/puffer.png')
        this.load.image('bubble', 'assets/bubble.png')
        //CURRENCY
        this.load.image('shell_pink', 'assets/shell_pink.png')
    }//END PRELOAD
    create() {
        //WORLD
        this.physics.world.setBounds(0, 0, game.config.width, game.config.height * 1.52)
        //BACKGROUND
        background = this.add.tileSprite(4000, 900, 0, 0, 'background')
        .setScale(8)
        border = this.add.image(game.config.width / 2, game.config.height / 2,'border')
        .setDepth(1)
        .setScrollFactor(0)
        //OLLIE
        ollie = this.physics.add.sprite(game.config.width / 3, game.config.height * .75, 'ollie')
        .setScale(2)
        //OLLIES HITBOX
        ollie.body
        .setSize(120,30,true)//width,height, center -- boolean
        .setOffset(20,35) //x and y offset
        ollie.setCollideWorldBounds(true);
        //ANIMATIONS        
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('ollie'),
            frameRate: 8,
            repeat: -1
        });
        ollie.anims.play('swim');
        //CAMERA
        background.fixedToCamera = true;
        camera = this.cameras.main;
        camera.setBounds(0, 0, game.config.width, game.config.height * 1.5);
        camera.startFollow(ollie, false, 0.5, 0.03);
        //METERS SWAM TEXT
        metersSwam = 0
        metersSwamText = this.add.text(game.config.width * 0.02, game.config.height * 0.01, 'Meters Swam: 0000000000' , {fontSize: '85px', color: '#FFF'}).setScrollFactor(0).setDepth(1);
        //JUMP TEXT
        canJumpText = this.add.text(game.config.width * 0.5, game.config.height * 0.01, 'jump', {fontSize: '85px', color: 'rgba(256,256,256,0.5)'}).setScrollFactor(0).setDepth(1);
        //SHELL COUNT
        shellCount = 0
        this.shellCounter = this.add.image(game.config.width * 0.79, game.config.height * 0.048, 'shell_pink').setOrigin(0.5).setScrollFactor(0,0).setScale(2).setDepth(1);
        shellCountText = this.add.text(game.config.width * 0.90, game.config.height * 0.05, 'Shell Count: ' + shellCount, {fontSize: '65px', fill: '#FFF'}).setOrigin(0.5).setScrollFactor(0,0).setDepth(2);
        //OBSTACLES
        this.groundObstacles = this.physics.add.group();
        setInterval(() => this.createGroundObstacles(this.groundObstacles), Phaser.Math.RND.between(3000, 5000));
        this.physics.add.collider(ollie, this.groundObstacles, this.obstacleCollision.bind(this))
        this.floatObstacles = this.physics.add.group();
        setInterval(() =>this.createFloatObstacles(this.floatObstacles), Phaser.Math.RND.between(5000, 8000))
        this.physics.add.collider(ollie, this.floatObstacles, this.obstacleCollision.bind(this))
        //POWERUPS
        this.powerUps = this.physics.add.group();
        setInterval(() => this.createPowerUps(this.powerUps), 4000);
        this.physics.add.collider(ollie, this.powerUps, this.collectPowerUp.bind(this))
        //CURRENCY
        this.currencies = this.physics.add.group();
        setInterval(() => this.createCurrency(this.currencies), 2000);
        this.physics.add.collider(ollie, this.currencies, this.collectCurrency)
        //INPUT
        cursors = this.input.keyboard.createCursorKeys();
        //pauses the game and starts pause scene when 'P' is pressed
        //* need to make sure ollie resumes from the same spot, not the starting point, and shell count stays the same
        this.input.keyboard.on('keydown-ESC', function(pointer) {
            game.scene.pause('GameScene');
            game.scene.start('PauseScene');
        })
        //WATER LEVEL
        waterLevel = background.y / 2.1 //428.57
    }//END CREATE
    update() {
        if (isDead) {
            //freezes game scene background
            //hide all obstacles/ stop them
            //put in ollie hitting obstacle animation
            this.scene.pause();
            game.scene.start('DeathScene');
            isDead = false; //resets the play
            metersSwam = 0;
        } else {
            //GAME ELEMENTS
            this.moveBackground()
            this.addMetersSwam(0.052)
            //MOVEMENT
            this.movement()
            this.canJump()
            //POWERUPS
            this.movePowerUp()
            this.movePowerUps(this.powerUps)
            //OBSTACLES
            this.moveObstacles(this.groundObstacles)
            this.moveFloatObstacles(this.floatObstacles)
            //CURRENCY
            this.moveCurrencies(this.currencies)
        }
    }//END UPDATE

    //---GAME ELEMENTS---//
    moveBackground() {
        background._tilePosition.x += 1.69
    }//END MOVEBACKGROUND
    addMetersSwam(points){

        metersSwam += points;
        metersSwamText.setText('Meters Swam: ' + placeholder.substring(10 - metersSwam.toString().length) + Math.trunc(metersSwam));
    }//END ADDMETERSSWAM
//---END GAME ELEMENTS---//

//---MOVEMENT---//
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
    }//END MOVEMENT
    canJump() {
        if(ollie.y <= waterLevel + 150 && ollie.y >= waterLevel && ollie.body.velocity.y < 0) {
            canJumpText.setStyle({color: 'rgb(256,256,256,1)'})
        } else {
            canJumpText.setStyle({color: 'rgb(256,256,256,0.5)'})
        }
    } //END CANJUMP
//---END MOVEMENT---//

//---OBSTACLES---//
    moveObstacles(groundObstacles) {
        sx += 8; //movement of the obstacles
        if (sx === 16){
            groundObstacles.getChildren().forEach(obstacle => {
                if (obstacle.getBounds().right < 0) {
                    groundObstacles.killAndHide(obstacle);
                } else {
                    obstacle.x -= 20;
                }
            })
            // sx = 0;
        }
    }//END MOVEOBSTACLES
    moveFloatObstacles(floatObstacles) {
        if (sx === 16){
            floatObstacles.getChildren().forEach(obstacle => {
                if (obstacle.getBounds().right < 0) {
                    floatObstacles.killAndHide(obstacle);
                } else {
                    obstacle.x -= 20;
                }
            })
            sx = 0;
        }
    }//END MOVEFLOATOBSTACLES
    createGroundObstacles(groundObstacles) {
        var obstacleList = ['obstacle1', 'obstacle2', 'obstacle3', 'rock1', 'rock2', 'rock3', 'rock4', 'rock5', 'rock6'];
        let obstacleIndex = Phaser.Math.RND.between(0, 8);
        var chosenObstacle = obstacleList[obstacleIndex];
        //CORAL REEF SPAWN (obstacle 1, 2 ,3)
        if (obstacleIndex <= 2){
            var obstacle = groundObstacles.create(game.config.width + 50, 1750, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(200, 200);
            obstacle.setScale(2);
        }
        //TALL ROCK SPAWN (rock 2)
        else if (obstacleIndex === 4) {
            var obstacle = groundObstacles.create(game.config.width + 50, 1990, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(200, 150);
            obstacle.setScale(3);
        }
        //TINYROCKSPAWN (rock 6)
        else if (obstacleIndex === 8) {
            var obstacle = groundObstacles.create(game.config.width + 50, 2095, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(50, 50);
            obstacle.setScale(2);
        }
        //REG ROCK SPAWN (rock 1, 3, 4, 5)
        else {
            var obstacle = groundObstacles.create(game.config.width + 50, 2065, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(200, 100);
            obstacle.setScale(2);
        }
    } //END CREATEGROUNDOBSTACLES

    createFloatObstacles(floatObstacles) {
        var obstacleList = ['boot', 'can', 'duck']
        let obstacleIndex = Phaser.Math.RND.between(0, 2)
        var chosenFloatObstacle = obstacleList[obstacleIndex]
        //DUCK SPAWN HIGHER
        if (obstacleIndex === 2) {
            var floatObstacle = floatObstacles.create(game.config.width + 50, 300, chosenFloatObstacle)
            floatObstacle.setOrigin(0.5, 0)
            floatObstacle.setSize(100, 100)
        }
        //BOOT OR CAN SPAWN
        else {
            let floatObstacleHeight = Phaser.Math.RND.between(2000, 500)
            var floatObstacle = floatObstacles.create(game.config.width + 50, floatObstacleHeight, chosenFloatObstacle)
            floatObstacle.setOrigin(0.5, 0)
            floatObstacle.setSize(100, 100)
            .setScale(1.5)
        }

    }//END CREATEFLOATOBSTACLES 
//---END OBSTACLES---//

//---POWERUPS---//
    movePowerUps(powerUps) {
        //updates power up pos
        powerUps.getChildren().forEach(powerUpChild => {
            if (powerUpChild.getBounds().right < 0) {
                powerUps.kill(powerUpChild);
            }
            else {
                powerUpChild.x -= 10;
            }
        });
    } //END MOVE OBSTACLES
    movePowerUp() {
        if(currentPowerUp) {
            currentPowerUp.x = ollie.x;
            switch(powerUpsQueue[0]) {
                case 1:
                    currentPowerUp.y = ollie.y-50;
                    break;
                case 2: 
                    currentPowerUp.y = ollie.y;
            }
            
        }
    }//END CHECK FOR POWERUPS
    createPowerUps(powerUps) {
        var powerUpList = ['powerUpPH1', 'bubble']
        let powerUpIndex = Phaser.Math.RND.between(0, 1);
        var chosenPowerUp = powerUpList[powerUpIndex];
        
        let powerUpHeight = Phaser.Math.RND.between(2000, 500)
        var powerUp = powerUps.create(game.config.width * 0.97, powerUpHeight, chosenPowerUp);

        switch(chosenPowerUp) {
            case 'bubble':
                powerUp.name = 'bubble'
                powerUp
                .setOrigin(0.5, 0.5)
                .setScale(0.3)
                .setImmovable(false)
                .setCollideWorldBounds(false)
                break;
            case 'powerUpPH1':
                powerUp.name = 'puffer'
                powerUp
                .setOrigin(0.5, 0.5)
                .setScale(0.08)
                .setImmovable(false)
                .setCollideWorldBounds(false)
                break;
        }
        powerUp.body.setImmovable(false);
    } //END CREATEPOWERUPS
    collectPowerUp(ollie, powerUp) {
        powerUp.destroy();
        if(powerUpsQueue.length < 2) {
            switch(powerUp.name) {
                case 'puffer':
                    powerUpsQueue.push(1)
                    break;
                case 'bubble':
                    powerUpsQueue.push(2)
                    break;
            }
        }
        this.loadNextPowerUp()
    }//END COLLECTPOWERUPS
    obstacleCollision(ollie, obstacle) {
        if(powerUpsQueue.length > 0) {
            obstacle.destroy()
            currentPowerUp.destroy()
            powerUpsQueue.shift()
            if(powerUpsQueue.length === 1) {
                onDeck.destroy() 
                onDeck = null
            } 
            this.loadNextPowerUp()
        } else {
            console.log('Hit ' + JSON.stringify(obstacle) + '!')
            isDead = true;
        }
    } //END OBSTACLECOLLISION
    loadNextPowerUp() { 
        if(powerUpsQueue.length === 1) {
            switch(powerUpsQueue[0]) {
                case 1:
                    currentPowerUp = this.add.image(ollie.x, ollie.y-50, 'powerUpPH1').setScale(0.06)
                    break;
                case 2:
                    currentPowerUp = this.add.image(ollie.x, ollie.y, 'bubble').setScale(1)
                    break;
            }
        } else if (powerUpsQueue.length === 2 && !onDeck) {
            var onDeckPowerUp = (powerUpsQueue[1] === 1) ? 'powerUpPH1' : 'bubble'
            onDeck = this.add.image(game.config.width * 0.03, game.config.height * 0.08, onDeckPowerUp).setOrigin(0.5).setScrollFactor(0,0).setScale((onDeckPowerUp === 'powerUpPH1' ? 0.06 : 0.1)).setDepth(1);
        }
    }//END GETNEXTPOWERUP
//---END POWERUPS---//f

//---CURRENCY---//
    moveCurrencies(currencies) {
        currencies.getChildren().forEach(currencyChild => {
            if (currencyChild.getBounds().right < 0) {
                currencies.kill(currencyChild);
            }
            else {
                currencyChild.x -= 10;
            }
        });
    }//END MOVE CURRENCIES
    createCurrency(currencies) {
        //choose random value between river height and bottom of the screen
        let currencyHeight = Phaser.Math.RND.between(2000, 500)
        var currency = currencies.create(game.config.width + 50, currencyHeight, 'shell_pink')
        currency
        .setOrigin(0.5, 0)
        .setScale(1.5)
        .setImmovable(false)
        .setCollideWorldBounds(false)
    }//END CREATECURRENCY
    collectCurrency(ollie, currency) {
        currency.destroy();
        shellCount++;
        shellCountText.setText('Shell Count: ' + shellCount)
        // console.log(shellCount)
    }//END COLLECTCURRENCY
//---END CURRENCY---//

} //END GAMESCENE
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
}//END RESIZE 