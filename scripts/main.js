function handleVisibilityChange() {
    if (document.hidden) {
      game.scene.pause('default');
    } else {
      game.scene.resume('default');
    }
  }
  
  // Add a listener for the visibility change event
  document.addEventListener('visibilitychange', handleVisibilityChange); //testing for issue

var config;
var game;
const delay = ms => new Promise(res => setTimeout(res, ms));
window.onload = function() {
    let titleScene = new TitleScene();
    let gameScene = new GameScene();
    let pauseScene = new PauseScene();
    let deathScene = new DeathScene();
    let preGameScene = new PreGameScene();
    let howToPlayScene = new HowToPlayScene();
    // object containing configuration options
    config = {
        type: Phaser.AUTO,
        width: 3000,
        height: 1452,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        scene: [TitleScene, GameScene, PauseScene, DeathScene, PreGameScene, HowToPlayScene], //made it a scene array to switch between scenes
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

    game.scene.add('preGameScene', preGameScene);

    game.scene.add('HowToPlayScene', howToPlayScene);

}//END load listener

let play,
home
class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super({key: 'HowToPlayScene'});
    }//END CONSTRUCTOR

    preload() {
        // this.load.image('pauseTitle', 'assets/otterescape_pausescreen_pause.png');
        // this.load.image('endButton', 'assets/otterescape_pausescreen_end.png');
        // this.load.image('resumeButton', 'assets/otterescape_pausescreen_resume.png');

        // this.load.image('background', 'assets/background_V1.png'); //placeholder
        this.load.image('bubble', 'assets/bubble2.png')
        this.load.image('titlebackground', 'assets/titlebg.png')
        this.load.spritesheet('ollie', 'assets/ollieSwim.png', { frameWidth: 160, frameHeight: 125 })
    }//END PRELOAD

    create() {

        // this.background = this.add.sprite(1500, 100, 'background')
        // .setScale(8)
        this.background = this.add.tileSprite(1500, 490, 0, 0, 'titlebackground').setScale(2)

        bubbles = this.physics.add.group()
        bubbles.maxSize = 10

        this.fakeollie = this.physics.add.sprite(900, game.config.height * .65, 'ollie')
        .setScale(7)
        .setDepth(1)
        //OLLIES HITBOX
        this.fakeollie.body
        .setSize(120,30,true)//width,height, center -- boolean
        .setOffset(20,35) //x and y offset
        this.fakeollie.setCollideWorldBounds(false);
        //ANIMATIONS        
        this.anims.create({
            key: 'how to swim',
            frames: this.anims.generateFrameNumbers('ollie'),
            frameRate: 9,
            repeat: -1
        });
        this.fakeollie.anims.play('how to swim');


        this.title = this.add.text(game.config.width/3.3, game.config.height/7.5, 'HOW TO PLAY', {fontFamily: 'Retro Gaming', fontSize: '200px', color: '#FFFFFF'})
        .setOrigin(0.5)
        .setDepth(1)

        this.controlDes = this.add.text(game.config.width/1.27, game.config.height/3, 'use the up & down\n' + 'arrow keys to move', {fontFamily: 'Retro Gaming', fontSize: '80px', align: 'right', color: '#FFFFFF'})
        .setOrigin(0.5)
        .setDepth(1)

        this.jumpDes = this.add.text(game.config.width/1.18, game.config.height/1.7, 'push SPACE\n' + 'to jump!', {fontFamily: 'Retro Gaming', fontSize: '80px', align: 'right', color: '#FFFFFF'})
        .setOrigin(0.5)
        .setDepth(1)


        play = this.add.text(game.config.width/1.15, game.config.height/1.1, 'Let\'s Play! →', {fontFamily: 'Retro Gaming', fontSize: '55px', align: 'right', color: '#FFFFFF'})
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(1)
        //color the button when cursor is hovered over
        play.on('pointerover', function(event) {
            play.setColor('#F5C12D');
        });
        play.on('pointerout', function (pointer) {
            play.setColor('#FFFFFF');
        });
        play.on('pointerdown', function(pointer) { //FIX: need to show the fakeollie swimming animation but doesn't
            this.swtichScenes()
        },this);

        home = this.add.text(game.config.width/9, game.config.height/1.1, '← Back to Home', {fontFamily: 'Retro Gaming', fontSize: '55px', align: 'left', color: '#FFFFFF'})
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(1)
        //color the button when cursor is hovered over
        home.on('pointerover', function(event) {
            home.setColor('#F5C12D');
        });
        home.on('pointerout', function (pointer) {
            home.setColor('#FFFFFF');
        });
        home.on('pointerdown', function(pointer) { 
            // game.scene.stop('GameScene');
            game.scene.stop('HowToPlayScene');
            game.scene.start('TitleScene')
        });
        }//END CREATE
        update() {
            this.moveBackground()
            this.createNewBubble()
            this.moveBubbles()
        }//END UPDATE
        moveBackground() {
            this.background._tilePosition.x += 1
        }
        createNewBubble() {
            if(bubbles.countActive(true) < 10) {
                var spawn = Phaser.Math.RND.between(0,100)
                if(spawn < 2) {
                    var x = Phaser.Math.RND.between(0, game.config.width)
                    var newBubble = bubbles.create(x, game.config.height, 'bubble')
                    newBubble.setVelocityX(30)
                }
            }
        }//END CREATENEWBUBBLE
        moveBubbles() {
            bubbles.getChildren().forEach(bubble => {
                if (bubble.getBounds().top < 0) {
                    bubbles.remove(bubble, true, true);
                    // console.log('killing')
                } else {
                    var direction = Phaser.Math.RND.between(0,1000);
                    if(direction < 10) {
                        // console.log(bubble.body.velocity.x)
                        bubble.setVelocityX(bubble.body.velocity.x * -1)
                    } 
                    bubble.y -= 3;
                }
            })        
        }//END MOVEBUBBLES
        swtichScenes = async() => {
            home.visible = false;
            play.visible = false;
            this.title.visible = false;
            this.controlDes.visible = false;
            this.jumpDes.visible = false;
            this.fakeollie.visible = false;
            bubbles.getChildren().forEach(bubble => {
                bubble.visible = false;
            })              
            // await delay(10)
            game.scene.start('PreGameScene')
            game.scene.pause('HowToPlayScene')
            
        }
}//END HOW TO PLAY SCENE

class DeathScene extends Phaser.Scene {
    constructor() {
        super({key: 'DeathScene'});
    }//END CONSTRUCTOR
    preload() {
        this.load.image('deathBoard', 'assets/otterescape_gameover_board.png'); //temp
    }//END PRELOAD
    create() {

        //creating array of encouraging quotes for player :D
        let quotes = ["Keep trying, you'll get there.",
        "Don't give up, try again.",
        "Failure is a lesson.",
        "Try again, fresh start.",
        "Persevere, you got this.",
        "Get up, try again.",
        "You'll win next time.",
        "One more try, victory awaits.",
        "Believe in yourself, try again.",
        "Come back stronger, try again.",
        "Try again, improve strategy.",
        "Try again, closer than ever.",
        "Failure leads to success.",
        "Try again, persistence pays off.",
        "Don't stop now, try again.",
        "You can do it, try again.",
        "Failure is not the end.",
        "Rise from defeat.",
        "Come back stronger.",
        "Next game, new opportunity.",
        "Get back in the game.",
        "Stay determined, keep going.",
        "Don't stop now, keep pushing.",
        "Learn from your mistakes.",
        "Reset, start fresh.",
        "Try again, never give up.",
        "Success is one try away."]


        let deathBoard = this.add.sprite(game.config.width/2, game.config.height/2, 'deathBoard')
        .setOrigin(0.5)
        .setScale(2.8)

        let playTitle = this.add.text(game.config.width/1.68, game.config.height/2, 'Play', {fontFamily: 'Retro Gaming', fontSize: '80px', color: '00000'})
        .setOrigin(0.5)

        let againTitle = this.add.text(game.config.width/1.68, game.config.height/1.72, 'Again?', {fontFamily: 'Retro Gaming', fontSize: '80px', color: '00000'})
        .setOrigin(0.5)


        var yes = this.add.text(game.config.width/1.88, game.config.height/1.5, 'yes', {fontFamily: 'Retro Gaming', fontSize: '60px', color: '00000'})
        .setInteractive({ useHandCursor: true })

        var no = this.add.text(game.config.width/1.62, game.config.height/1.5, 'no', {fontFamily: 'Retro Gaming', fontSize: '60px', color: '00000'})
        .setInteractive({ useHandCursor: true })


        let gameOver = this.add.text(game.config.width/2.12, game.config.height/3.5, 'GAME OVER', {fontFamily: 'Retro Gaming', fontSize: '100px', color: '#D81414'})
        .setOrigin(0.5)

        let quote = this.getRandomItem(quotes)
        
        let randomQuote = this.add.text(game.config.width/2.12, game.config.height/2.9, quote, {fontFamily: 'Retro Gaming', fontSize: '40px', color: '00000'})
        .setOrigin(0.5)

        let distance = this.add.text(game.config.width/2.9, game.config.height/2.12, 'Distance', {fontFamily: 'Retro Gaming', fontSize: '55px', color: '00000'})

        let userScore = this.add.text(game.config.width/2.9, game.config.height/1.9, Math.trunc(metersSwam) + 'M', {fontFamily: 'Retro Gaming', fontSize: '55px', color: '00000'})
        // .setOrigin(0.5)

        //color the button when cursor is hovered over
        yes.on('pointerover', function(event) {
            yes.setColor('#FFFFFF');
        });
        yes.on('pointerout', function (pointer) {
            // yes.clearTint();
            yes.setColor('00000');
        });
        yes.on('pointerdown', function(pointer) { 
            // game.scene.stop('GameScene');
            game.scene.start('GameScene');
            game.scene.stop('DeathScene');
        });


        //color the button when cursor is hovered over
        no.on('pointerover', function(event) {
            no.setColor('#FFFFFF');
        });
        no.on('pointerout', function (pointer) {
            no.setColor('00000');
        });
        no.on('pointerdown', function(pointer) { 
            game.scene.stop('GameScene');
            game.scene.stop('DeathScene');
            game.scene.start('TitleScene');
        });
    }//END CREATE


    // program to get a random item from an array

    getRandomItem(quotes) {

        // get random index value
        const randomIndex = Math.floor(Math.random() * quotes.length);

        // get random item
        const item = quotes[randomIndex];

        return item;
    }
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
let bubbles,
playButton,
question
//title scene
class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});
    }//END CONSTRUCTOR
    preload() {

        this.load.image('background', 'assets/background_V1.png');
        this.load.image('title', 'assets/logov2.png');
        this.load.image('playButton', 'assets/playButton.png');
        this.load.image('titlebackground', 'assets/titlebg.png')
        this.load.image('title', 'assets/logov2.png')
        this.load.image('playButton', 'assets/play.png')
        this.load.image('bubble', 'assets/bubble2.png')
        this.load.image('border', 'assets/borderv2.png')
        this.load.image('question', 'assets/otterescape_questionmark.png'); //for how to play scene
    }//END PRELOAD
    create() {
        // var background = this.add.image(1500,490, 'titlebackground').setScale(2)
        this.background = this.add.tileSprite(1500, 490, 0, 0, 'titlebackground').setScale(2)
        // border = this.add.image(game.config.width / 2, game.config.height / 2,'border')
        // .setDepth(1)
        // .setScrollFactor(0)

        this.title = this.add.sprite(game.config.width/2, game.config.height/3.5, 'title')
        .setOrigin(0.5)
        .setScale(6.5)
        .setDepth(1)
        
        bubbles = this.physics.add.group()
        bubbles.maxSize = 10
        
        // this.bubble = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'bubble')
        // this.bubble.body.setGravity(0,-150)

        playButton = this.add.sprite(game.config.width/2, game.config.height/1.4, 'playButton')
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setScale(2)
        .setDepth(1)

        question = this.add.sprite(game.config.width*0.95, game.config.height/1.09, 'question')
        .setInteractive({ useHandCursor: true })
        .setScale(2.5)
        .setOrigin(0.5)
        .setDepth(1)
        question.on('pointerover', function(event) {
            question.setTint(808080);
        });
        question.on('pointerout', function (pointer) {
            question.clearTint();
        });
        //starts the game scene
        question.on('pointerdown', function(pointer) { 
            // game.scene.start('HowToPlayScene');
            // game.scene.stop('TitleScene');
            this.switchHTP();
        },this);

        //color the button when cursor is hovered over
        playButton.on('pointerover', function(event) {
            playButton.setTint(808080);
        });
        playButton.on('pointerout', function (pointer) {
            playButton.clearTint();
        });
        //starts the game scene
        playButton.on('pointerdown', function(pointer) { 
            this.switchPreGame()
        },this);        
    }//END CREATE
    update() {
        this.moveBackground()
        this.createNewBubble()
        this.moveBubbles()
    }
    moveBackground() {
        this.background._tilePosition.x += 1
    }
    createNewBubble() {
        if(bubbles.countActive(true) < 10) {
            var spawn = Phaser.Math.RND.between(0,100)
            if(spawn < 2) {
                var x = Phaser.Math.RND.between(0, game.config.width)
                var newBubble = bubbles.create(x, game.config.height, 'bubble')
                newBubble.setVelocityX(30)
                newBubble.body.setCircle(55,0,0).setOffset(18,14)
            }
        }
    }//END CREATENEWBUBBLE
    moveBubbles() {
        bubbles.getChildren().forEach(bubble => {
            if (bubble.getBounds().top < 0) {
                bubbles.remove(bubble, true, true);
                // console.log('killing')
            } else {
                var direction = Phaser.Math.RND.between(0,1000);
                if(direction < 10) {
                    // console.log(bubble.body.velocity.x)
                    bubble.setVelocityX(bubble.body.velocity.x * -1)
                } 
                bubble.y -= 3;
            }
        })        
    }//END MOVEBUBBLES
    switchPreGame = async() => {
        this.title.visible = false;
        playButton.visible = false;
        question.visible = false;
        bubbles.getChildren().forEach(bubble => {
            bubble.visible = false;
        })              
        await delay(10)
        game.scene.pause('TitleScene')
        game.scene.start('PreGameScene')
    }
    switchHTP = async() => {
        // this.title.visible = false;
        // playButton.visible = false;
        // question.visible = false;
        // bubbles.getChildren().forEach(bubble => {
        //     bubble.visible = false;
        // })              
        await delay(10)
        game.scene.start('HowToPlayScene')
        game.scene.stop('TitleScene')
    }
}//END TITLESCENE

class PreGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'PreGameScene'});
    }//END CONSTRUCTOR

    preload() {
        this.load.image('bubble', 'assets/bubble2.png')
        this.load.spritesheet('ollie', 'assets/ollieSwim.png', { frameWidth: 160, frameHeight: 125 })
    }//END PRELOAD

    create() {
        game.scene.bringToTop('PreGameScene')
        // bubbles = this.physics.add.group()
       this.fakeollie1 = this.physics.add.sprite(-150, game.config.height * .75, 'ollie')
        .setScale(2)
        //OLLIES HITBOX
        this.fakeollie1.body
        .setSize(120,30,true)//width,height, center -- boolean
        .setOffset(20,35) //x and y offset
        this.fakeollie1.setCollideWorldBounds(false);
        //ANIMATIONS        
        this.anims.create({
            key: 'fake swim',
            frames: this.anims.generateFrameNumbers('ollie'),
            frameRate: 24,
            repeat: -1
        });
        this.fakeollie1.anims.play('fake swim');

        this.bubbleRush = this.physics.add.group()
        this.playBubbleRushAnnimation(this.bubbleRush)
        this.playOllieSwimmingAnimation()
    }
    update() {
        this.moveBubbles()
    }
    moveBubbles() {
        this.bubbleRush.getChildren().forEach(bubble => {
            var direction = Phaser.Math.RND.between(0,1000);
            var randomSpeedUp = Phaser.Math.RND.between(0,50);
            if(direction < 100) {
                // console.log(bubble.body.velocity.x)
                bubble.setVelocityX(bubble.body.velocity.x * -1)
                bubble.setVelocityY(bubble.body.velocity.y - randomSpeedUp)
            } 
            // bubble.y -= 3; 
        })        
    }//END MOVEBUBBLES
    playBubbleRushAnnimation = async(bubbleRush) => {
        while(this.bubbleRush.countActive(true) <100) {
            var x = Phaser.Math.RND.between(0, game.config.width)
            var y = Phaser.Math.RND.between(game.config.height, game.config.height+2000)
            var newBubble = this.bubbleRush.create(x, y, 'bubble')
            newBubble.body.setCircle(55,0,0).setOffset(18,14)
            newBubble.setVelocityY(-800)
            newBubble.setVelocityX(50)
        }   
        await delay(5000);
    }
    playOllieSwimmingAnimation = async() => {
        await delay(1200);
        this.fakeollie1.setVelocityX(1500)
        await delay(2800);
        this.switchGames()
    }
    switchGames = async () => {
        game.scene.stop('TitleScene');
        game.scene.stop('preGameScene')
        game.scene.start('GameScene');
        game.scene.stop('DeathScene');
        game.scene.stop('HowToPlayScene');
    }
}

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
        inputDisabled = false,
        ox = 0,
    //NAVBAR
        //METERS SWAM TEXT
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
        this.load.spritesheet('ollieJump', 'assets/ollieJump.png', { frameWidth: 220, frameHeight: 190 })
        this.load.spritesheet('olliePowerUp', 'assets/olliePowerUp.png', {frameWidth: 220, frameHeight: 190});
        this.load.spritesheet('ollieDeath', 'assets/ollieDeath.png', {frameWidth: 220, frameHeight: 190});
        this.load.spritesheet('olliePearl', 'assets/olliePearl.png', {frameWidth: 220, frameHeight: 190});
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
        this.load.image('rockpowerup', 'assets/rockpowerup.png')
        this.load.image('bubble', 'assets/bubble.png')
        //CURRENCY
        this.load.image('shell_pink', 'assets/shell_pink.png')
        this.load.image('shell_orange', 'assets/shell_orange.png')
        this.load.image('shell_gold', 'assets/shell_gold.png')
    }//END PRELOAD
    create() {
        //WORLD
        this.physics.world.setBounds(0, 160, game.config.width, game.config.height * 1.35)
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
        ollie.body.setGravity(0,10)
        ollie.setCollideWorldBounds(true);
        //ANIMATIONS        
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('ollie'),
            frameRate: 11,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('ollieJump'),
            frameRate: 4, //need more frame
            repeat: 0
        });
        this.anims.create({
            key: 'powerUp',
            frames: this.anims.generateFrameNumbers('olliePowerUp'),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('ollieDeath'),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'pearl',
            frames: this.anims.generateFrameNumbers('olliePearl'),
            frameRate: 11,
            repeat: -1
        });
        ollie.anims.play('swim')
        //CAMERA
        background.fixedToCamera = true;
        camera = this.cameras.main;
        camera.setBounds(0, 0, game.config.width, game.config.height * 1.5);
        camera.startFollow(ollie, false, 0.5, 0.03);
        //METERS SWAM TEXT
        metersSwam = 0
        metersSwamText = this.add.text(game.config.width * 0.024, game.config.height * 0.00001, '000000' , {fontFamily: 'Retro Gaming', fontSize: '70px', color: '#FFF'}).setScrollFactor(0).setDepth(1);
        //JUMP TEXT
        canJumpText = this.add.text(game.config.width * 0.44, game.config.height * 0.00001, 'jump', {fontFamily: 'Retro Gaming', fontSize: '70px', color: 'rgba(256,256,256,0.5)'}).setScrollFactor(0).setDepth(1);
        //SHELL COUNT
        shellCount = 0
        this.shellCounter = this.add.image(game.config.width * 0.875, game.config.height * 0.03, 'shell_pink').setOrigin(0.5).setScrollFactor(0,0).setScale(2).setDepth(1);
        shellCountText = this.add.text(game.config.width * 0.93, game.config.height * 0.03,'00000', {fontFamily: 'Retro Gaming', fontSize: '65px', fill: '#FFF'}).setOrigin(0.5).setScrollFactor(0,0).setDepth(2);
        //OBSTACLES
        this.groundObstacles = this.physics.add.group();
        setInterval(() => this.createGroundObstacles(this.groundObstacles), Phaser.Math.RND.between(3000, 5000));
        this.physics.add.collider(ollie, this.groundObstacles, this.obstacleCollision.bind(this))
        this.floatObstacles = this.physics.add.group();
        setInterval(() =>this.createFloatObstacles(this.floatObstacles), Phaser.Math.RND.between(5000, 8000))
        this.physics.add.collider(ollie, this.floatObstacles, this.obstacleCollision.bind(this))
        //POWERUPS
        this.powerUps = this.physics.add.group();
        setInterval(() => this.createPowerUps(this.powerUps), 10000);
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
            // metersSwam = 0;
        } else {
            //GAME ELEMENTS
            this.moveBackground()
            this.addMetersSwam(0.052)
            //MOVEMENT
            this.movement()
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
        var placeholder = '000000'
        metersSwam += points;
        metersSwamText.setText(placeholder.substring(Math.trunc(metersSwam).toString().length) + Math.trunc(metersSwam));
    }//END ADDMETERSSWAM
//---END GAME ELEMENTS---//

//---MOVEMENT---//
movement = async() => { //DECREASING Y IS UP AND INCREASING IS DOWN. NEGATIVE IS UP AND POSITIVE IS DOWN
    var currentVelocity = ollie.body.velocity.y
    var currentPosition = ollie.body.y
    var currentAngularVelocity = ollie.body.angularVelocity
    var canJump = this.canJump()

    // console.log(currentAngularVelocity) 
    // console.log(ollie.angle)
        // console.log(currentVelocity)
  

    if((afterJump || inputDisabled) && currentPosition >= waterLevel + 400) {
        afterJump = false;
        inputDisabled = false;
    }

    if(currentPosition <= waterLevel) { //Ollie is above water(already jumped), disable all movement
        ollie.body.setGravity(0,500)
        if(afterJump === true && currentVelocity > 0 && (currentPosition >= waterLevel-50 && currentPosition <= waterLevel)) { //hits the water
            ollie.setVelocityY(150)      
            // ollie.angle = 30
            // ollie.setAngularVelocity(100)
        } 
    } else { //Ollie is under watter
        if(ollie.angle < -15) {
            ollie.angle = -15
        } else if (ollie.angle > 15) {
            ollie.angle = 15
        }
        ollie.body.setGravity(0, 10)
        if(canJump) { //if in the zone to jump, he can either jump or swim down
            ollie.body.setGravity(0,200)
            inputDisabled = true
            if(cursors.space.isDown) {
                afterJump = true
                ollie.setVelocityY(-500)
                ollie.anims.play('jump');
                ollie.setAngularVelocity(0)
                ollie.angle = 0
                await delay(1300)
                ollie.angle = 30
                ollie.anims.play('swim')
            } else if(cursors.down.isDown){
                if(currentVelocity < 0){//switching directions
                    ollie.setAngularVelocity(currentAngularVelocity+100)
                    currentVelocity = 5
                }
    
                if(currentVelocity < 100) {
                    (currentAngularVelocity + 5 < 50) ? ollie.setAngularVelocity(currentAngularVelocity+10) : ollie.setAngularVelocity(0)
                    ollie.setVelocityY(currentVelocity+20)
                } else if(currentVelocity < 200) {
                    (currentAngularVelocity + 1 < 50) ? ollie.setAngularVelocity(currentAngularVelocity+10) : ollie.setAngularVelocity(0)
                    ollie.setVelocityY(currentVelocity+15)
                } else if(currentVelocity < 350) {
                    (currentAngularVelocity + 1 < 50) ? ollie.setAngularVelocity(currentAngularVelocity+10) : ollie.setAngularVelocity(0)
                    ollie.setVelocityY(currentVelocity+10)
                }
            } 
        } else { //not in the zone to jump, just under water
            if(!inputDisabled){
                if(cursors.up.isDown) {
                    if(currentVelocity > 0){ //switching directions
                        ollie.setAngularVelocity(currentAngularVelocity-100)
                        currentVelocity = -5
                    }
                    if(currentVelocity > -100) {
                        (currentAngularVelocity - 5 > -50) ? ollie.setAngularVelocity(currentAngularVelocity-10) : ollie.setAngularVelocity(0)
                        ollie.setVelocityY(currentVelocity-20)
                    } else if(currentVelocity > -200) {
                        (currentAngularVelocity - 1 > -50) ? ollie.setAngularVelocity(currentAngularVelocity-10) : ollie.setAngularVelocity(0)
                        ollie.setVelocityY(currentVelocity-15)
                    } else if(currentVelocity > -350) {
                        (currentAngularVelocity - 1 > -50) ? ollie.setAngularVelocity(currentAngularVelocity-10) : ollie.setAngularVelocity(0)
                        ollie.setVelocityY(currentVelocity-10)
                    }
                }
            } 
            if(cursors.down.isDown) {
                if(currentVelocity < 0){//switching directions
                    ollie.setAngularVelocity(currentAngularVelocity+100)
                    currentVelocity = 5
                }
    
                if(currentVelocity < 100) {
                    (currentAngularVelocity + 5 < 50) ? ollie.setAngularVelocity(currentAngularVelocity+10) : ollie.setAngularVelocity(0)
                    ollie.setVelocityY(currentVelocity+20)
                } else if(currentVelocity < 200) {
                    (currentAngularVelocity + 1 < 50) ? ollie.setAngularVelocity(currentAngularVelocity+10) : ollie.setAngularVelocity(0)
                    ollie.setVelocityY(currentVelocity+15)
                } else if(currentVelocity < 350) {
                    (currentAngularVelocity + 1 < 50) ? ollie.setAngularVelocity(currentAngularVelocity+10) : ollie.setAngularVelocity(0)
                    ollie.setVelocityY(currentVelocity+10)
                }
            }
        }
    }
}//END MOVEMENT
    canJump() {
        var currentPosition = ollie.body.y
        if(currentPosition <= waterLevel + 200 && currentPosition >= waterLevel && !afterJump) {
            canJumpText.setStyle({color: 'rgb(256,256,256,1)'}) //can jump
            return true;
        } else {
            canJumpText.setStyle({color: 'rgb(256,256,256,0.5)'}) //can not jump
            return false;
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
            obstacle.body
            .setSize(150,250,true)//width,height, center -- boolean
            .setOffset(20,35) //x and y offset
        }
        //TALL ROCK SPAWN (rock 2)
        else if (obstacleIndex === 4) {
            var obstacle = groundObstacles.create(game.config.width + 50, 1990, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(80, 100);
            obstacle.setScale(3);
            obstacle.body
            .setCircle(35, 3, 0)//radius,x offset, y offset 
        }
        //TINYROCKSPAWN (rock 6)
        else if (obstacleIndex === 8) {
            var obstacle = groundObstacles.create(game.config.width + 50, 2095, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(50, 50);
            obstacle.setScale(2);
            obstacle.body
            .setCircle(20, 5, 0)//radius,x offset, y offset 
        }
        //REG ROCK SPAWN (rock 1, 3, 4, 5)
        else {
            var obstacle = groundObstacles.create(game.config.width + 50, 2065, chosenObstacle);
            obstacle.setOrigin(0.5, 0);
            obstacle.setSize(200, 100);
            obstacle.setScale(2);
            switch (obstacleIndex) {
                case 3:
                    obstacle.body
                    .setCircle(50, 20, 0)//radius,x offset, y offset s
                    break; 
                case 5:
                    obstacle.body
                    .setCircle(35, 0, 0)//radius,x offset, y offset s
                    break;
                case 6:
                    obstacle.body
                    .setSize(130, 60, true)
                    break;
                case 7:
                    obstacle.body
                    .setSize(100, 60, true)
                    break;
            }
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
            console.log(floatObstacle.body.halfWidth + '+'+ floatObstacle.body.halfHeight)
            floatObstacle.body
            .setCircle(75, 0, 0)
        }
        //BOOT OR CAN SPAWN
        else {
            let floatObstacleHeight = Phaser.Math.RND.between(2000, 500)
            var floatObstacle = floatObstacles.create(game.config.width + 50, floatObstacleHeight, chosenFloatObstacle)
            floatObstacle.setOrigin(0.5, 0)
            .setScale(1.5)
            switch (obstacleIndex) {
                case 0:
                    floatObstacle.body
                    .setSize(80, 67, true)
                    break;
                case 1:
                    floatObstacle.body
                    .setSize(50,90, true)
                    break
            }
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
            switch(powerUpsQueue[0]) {
                case 1:
                    currentPowerUp.x = ollie.x+60
                    currentPowerUp.y = ollie.y+20;
                    break;
                case 2: 
                    currentPowerUp.x = ollie.x;
                    currentPowerUp.y = ollie.y;
            }
            
        }
    }//END CHECK FOR POWERUPS
    createPowerUps(powerUps) {
        var powerUpList = ['rockpowerup', 'bubble']
        let powerUpIndex = Phaser.Math.RND.between(0, 1);
        var chosenPowerUp = powerUpList[powerUpIndex];
        
        let powerUpHeight = Phaser.Math.RND.between(2000, 500)
        var powerUp = powerUps.create(game.config.width * 0.97, powerUpHeight, chosenPowerUp);

        switch(chosenPowerUp) {
            case 'bubble':
                powerUp.name = 'bubble'
                powerUp.body.setCircle(55,9,17)
                powerUp
                .setImmovable(false)
                .setCollideWorldBounds(false)
                break;
            case 'rockpowerup':
                powerUp.name = 'rockpowerup'
                powerUp.body.setSize(19,15,true).setOffset(3,8)
                powerUp
                .setScale(3)
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
                case 'rockpowerup':
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
            ollie.anims.stop('pearl');
            ollie.anims.play('swim');
            ollie.body.setSize(120,30,true).setOffset(20,35)
            this.loadNextPowerUp()
        } else {
            console.log('Hit ' + JSON.stringify(obstacle) + '!')
            ollie.anims.play('death');
            ollie.body.velocity.x = -564;
            setTimeout(() => {
                isDead = true;
            }, 1000);
        }
    } //END OBSTACLECOLLISION
    loadNextPowerUp() { 
        if(powerUpsQueue.length === 1) {
            switch(powerUpsQueue[0]) {
                case 1:
                    ollie.anims.stop('swim');
                    ollie.body.setSize(120,30,true).setOffset(50,70)
                    ollie.anims.play('powerUp');
                    setTimeout(() => {
                        ollie.anims.play('pearl');
                        ollie.body.setSize(120,30,true).setOffset(40,80)
                    }, 1000);
                    break;
                case 2:
                    ollie.anims.stop('swim');
                    ollie.body.setSize(120,30,true).setOffset(50,70)
                    ollie.anims.play('powerUp');
                    setTimeout(() => {
                        ollie.anims.play('swim');
                        ollie.body.setSize(120,30,true).setOffset(20,35)
                        currentPowerUp = this.add.image(ollie.x, ollie.y, 'bubble').setScale(3)
                    }, 1000);
                    break;
            }
        } else if (powerUpsQueue.length === 2 && !onDeck) {
            var onDeckPowerUp = (powerUpsQueue[1] === 1) ? 'rockpowerup' : 'bubble'
            if(onDeckPowerUp === 'rockpowerup') {
                onDeck = this.add.image(game.config.width * 0.035, game.config.height * 0.068, onDeckPowerUp).setOrigin(0.5).setScrollFactor(0,0).setScale(2).setDepth(1);
            } else {
                onDeck = this.add.image(game.config.width * 0.035, game.config.height * 0.068, onDeckPowerUp).setOrigin(0.5).setScrollFactor(0,0).setScale(0.4).setDepth(1.2);
            }
            
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
        let randomValue = Phaser.Math.RND.between(1, 10)
        console.log(randomValue)
        var chosenCurrency;
        //60% highest probability -- pink shell
        if (randomValue > 1 && randomValue <= 6) {
            chosenCurrency = 'shell_pink'
        }
        //30% medium probability -- orange shell
        else if (randomValue > 6 && randomValue <= 9) {
            chosenCurrency = 'shell_orange'
        }
        //10% low probability -- gold shell
        else {
            chosenCurrency = 'shell_gold'
        }
        console.log(chosenCurrency)
        var currency = currencies.create(game.config.width + 50, currencyHeight, chosenCurrency)
        console.log(currency.body.halfHeight + '+' + currency.body.halfWidth)
        currency.body.setSize(20,23,true).setOffset(0,3)
        currency
        .setScale(2)
        .setImmovable(false)
        .setCollideWorldBounds(false)
    }//END CREATECURRENCY
    collectCurrency(ollie, currency) {
        var maxShells = '00000'
        currency.destroy();
        console.log(currency.texture.key)
        switch(currency.texture.key) {
            case 'shell_pink':
                shellCount++;
                break;
            case 'shell_orange':
                shellCount+=5;
                break;
            case 'shell_gold':
                shellCount+=10;
                break;
        }
        
        // shellCountText.setText(maxShells.substring(5 - shellCount.toString().length + shellCount))
        shellCountText.setText(maxShells.substring(shellCount.toString().length) + shellCount)
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