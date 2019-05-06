// affiche la fenetre du jeu sur la page web
var game = new Phaser.Game(970, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create});
    function preload() {
        game.load.audio('wind', 'audio/wind.mp3');
        game.load.spritesheet('button', 'images/start.png', 193, 71);
        game.load.spritesheet('button1', 'images/restart.png', 193, 71);
        game.load.image('background-begin', 'images/title_screen.png');
        game.load.image('bg', 'images/win_png.png');

    }
    
    var text;
    var button;
    var x = 32;
    var y = 80;
    
    function create() {
        musicSound = this.sound.add('wind');
        musicSound.loopFull();
        musicSound.play();
        
        game.add.image(0, 0, 'background-begin');
    
        //	You can listen for each of these events from Phaser.Loader
        game.load.onLoadStart.add(loadStart, this);
        game.load.onFileComplete.add(fileComplete, this);
        game.load.onLoadComplete.add(loadComplete, this);
    
        //	Just to kick things off
        button = game.add.button(game.world.centerX - 75, 275, 'button', start, this, 2, 1, 0);
    
        //	Progress report
        text = game.add.text(32, 32, '', { fill: '#ffffff' });
    
    }
    
    function start() {
        game.state.add('play', PlayState);
        game.state.start('play', true, false, {level: 0});
        button.visible = false;        
    }

    function loadStart() {
        text.setText("Loading ...");
    }
    
    //	This callback is sent the following parameters:
    function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    }
    
    function loadComplete() {
    }
    
    


//===================================================
function Hero(game, x, y) {
    // appelle Phaser.Sprite constructeur
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.animations.add('stop', [1, 2, 3],4 ,true);
    this.animations.add('run', [4, 5, 6, 7], 8, true); // boucle de 8fps
    this.animations.add('jump', [8, 9, 10]);
    this.animations.add('fall', [11, 12], 8, false);
    this.animations.add('death', [13, 14, 15, 16]);
    this.animations.play('stop');
};
//herite du phaser sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
//on ajoute le mouvement
Hero.prototype.move = function (direction) {
    const SPEED = 300;
    this.body.velocity.x = direction * SPEED;

    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    } else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};
// le saut
Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;
    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};
Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = - BOUNCE_SPEED;
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // animation par défaut
    // saut
    if (this.body.velocity.y < 0) {
        name = 'jump'; 
    }
    // chute
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    //course
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

Hero.prototype.update = function () {
    // changer l'animation, si besoin de changements
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

// le playstate
PlayState = {};
// numero du level
const LEVEL_COUNT = 5;
PlayState.init = function (data) {
    //initialisation des touches claviers
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.SPACEBAR
    });
    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
    // nombre de pieces par défaut
    this.coinPickupCount = 0;
    // win conditions
    this.hasKey = false;
    // level
    this.level = (data.level || 0) % LEVEL_COUNT;
};
// les assets du jeu (atouts)
// on recupere les images
PlayState.preload = function () {
//==========================
//charge la page accueil
   
// charger data des level
    // level 0 load
    this.game.load.json('level:0', 'data/level00.json');
    // level 1 load
    this.game.load.json('level:1', 'data/level01.json');
    
    // level 2 load
    this.game.load.json('level:2', 'data/level02.json');
    
     //level 3 load
    this.game.load.json('level:3', 'data/level03.json');
    //level 4 load
    this.game.load.json('level:4', 'data/level04.json');
    // charger map bg
    this.game.load.image('background:0', 'images/background-sky.png');
    this.game.load.image('background:1', 'images/background-desert.png');
    this.game.load.image('background:2', 'images/background-jungle.png');
    this.game.load.image('background:3', 'images/background-cave.png');
    this.game.load.image('background:4', 'images/background-jungle.png');
    // charger murs invisibles
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    // charger la clé
    this.game.load.spritesheet('key', 'images/key.png', 52.3, 42);

    //on place toutes les images du fichier JSON ici
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');

    // jungle platforms
    this.game.load.image('wood:8x1', 'images/wood_8x1.png');
    this.game.load.image('wood:6x1', 'images/wood_6x1.png');
    this.game.load.image('wood:4x1', 'images/wood_4x1.png');
    this.game.load.image('wood:2x1', 'images/wood_2x1.png');
    this.game.load.image('wood:1x1', 'images/wood_1x1.png');

    this.game.load.image('woodLogs:8x1', 'images/woodenLog_8x1.png');
    this.game.load.image('woodLogs:6x1', 'images/woodenLog_6x1.png');
    this.game.load.image('woodLogs:4x1', 'images/woodenLog_4x1.png');
    this.game.load.image('woodLogs:2x1', 'images/woodenLog_2x1.png');
    this.game.load.image('woodLogs:1x1', 'images/woodenLog_1x1.png');

    // lave niveau
    this.game.load.image('ground_grey', 'images/ground_grey.png');
    this.game.load.image('grey:8x1', 'images/grey_8x1.png');
    this.game.load.image('grey:6x1', 'images/grey_6x1.png');
    this.game.load.image('grey:4x1', 'images/grey_4x1.png');
    this.game.load.image('grey:2x1', 'images/grey_2x1.png');
    this.game.load.image('grey:1x1', 'images/grey_1x1.png');

    this.game.load.image('tree_1', 'images/tree_1.png');
    this.game.load.image('tree_2', 'images/tree_2.png');
    this.game.load.image('bush_1', 'images/bush_1.png');
    this.game.load.image('bush_2', 'images/bush_2.png');
    this.game.load.image('bush_3', 'images/bush_3.png');
    // image fleche
    this.game.load.image('fleche_0', 'images/right.png');
    this.game.load.image('fleche_1', 'images/left.png');
    this.game.load.image('fleche_2', 'images/up.png');
    this.game.load.image('fleche_3', 'images/down.png');
    //image torche
    this.game.load.image('torch', 'images/torch.png');
    // charge le hero
    this.game.load.spritesheet('hero', 'images/hero.png', 52.47, 42);
    //animation saut
    
    //icon piece score 
    this.game.load.image('icon:coin', 'images/ring.png', 43.5, 42);
    //Text score 
    this.game.load.image('font:numbers', 'images/numbers.png');
    //son
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    //musique de fond 


    // this.game.load.audio('sfx:stomp', 'audio/stomp.wav');


    //charger les prites
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 38, 42);
    // charger les spiders
    this.game.load.spritesheet('spider', 'images/spider.png', 45.7, 42);
    //charger porte 
    this.game.load.spritesheet('door', 'images/doors.png', 56.5, 66);
    // charger clef icon
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 42.5, 42);
};

PlayState.create = function () {
      // create sound entities
      this.sfx = {
        key: this.game.add.audio('sfx:key'),
        door: this.game.add.audio('sfx:door'),
        jump: this.game.add.audio('sfx:jump'),
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp')
    };
       //creation du background
    this.game.add.image(0, 0, `background:${this.level}`);
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    this._createHud();

};


PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
    this.door.frame = this.hasKey ? 0 : 1;
};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.overlap(this.hero, this.coins,
        this._onHeroVsCoin, null, this);
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);
};



PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // hero bouge a gauche
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // hero bouge a droite
        this.hero.move(1);
    } else { // stop
        this.hero.move(0);
    }
};
PlayState._loadLevel = function (data) {
    //créa porte
    this.bgDecoration = this.game.add.group();    
    // creation des groupe dans la function
    this.trees = this.game.add.group();
    this.bushes = this.game.add.group();
    this.fleches = this.game.add.group();
    this.torches = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    // le console log permet de voir les objets json :-)
    //console.log(data);
   data.platforms.forEach(this._spawnPlatform, this);
   data.trees.forEach(this._spawnTree, this);
   data.bushes.forEach(this._spawnBush, this);
   data.fleches.forEach(this._spawnFleche, this);
   data.torches.forEach(this._spawnTorch, this);
   // on affiche le personnage et les ennemis
   this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    // active la gravité
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
     // active les objets
    data.coins.forEach(this._spawnCoin, this);
    // spawndoor
    this._spawnDoor(data.door.x, data.door.y);
    // spanwkey
    this._spawnKey(data.key.x, data.key.y);
};
// on fait spawn les plateformes
PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnTree = function (tree) {
    let sprite = this.trees.create(
        tree.x, tree.y, tree.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
PlayState._spawnBush = function (bush) {
    let sprite = this.bushes.create(
        bush.x, bush.y, bush.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
PlayState._spawnFleche = function (fleche) {
    let sprite = this.fleches.create(
        fleche.x, fleche.y, fleche.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
PlayState._spawnTorch = function (torch) {
    let sprite = this.torches.create(
        torch.x, torch.y, torch.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    },this);

    // spawn du hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};
PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6], 8, true); // 8fps, rotation
    sprite.animations.play('rotate');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};
PlayState._onHeroVsCoin = function (hero, coin) {
    coin.kill();
    this.sfx.coin.play();
    this.coinPickupCount++;
};
PlayState._onHeroVsEnemy = function (hero, enemy) {
    if (hero.body.velocity.y > 0) {
        hero.bounce();
        enemy.die();
        this.sfx.stomp.play();
    } else {
        this.sfx.stomp.play();
        this.game.state.restart(true, false, {level: this.level});
    }
};
PlayState._onHeroVsKey = function (hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};
PlayState._onHeroVsDoor = function (hero, door) {
    if (this.level < LEVEL_COUNT -1 ) {
    this.sfx.door.play();
    this.game.state.restart(true, false, { level: this.level +1});
    } else if (this.level == LEVEL_COUNT -1) {
    console.log('C\'EST BON !');
    this.win();
    this.sfx.door.stop();
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, false, this);
    }
    // TODO: go to the next level instead
};

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // ancre
    this.anchor.set(0.5);
    
    
    this.animations.add('right', [4,5,6,7], 8, true);
    this.animations.add('die', [8, 9, 10, 11], 8, false);
    this.animations.play('right');

    // proriétées phisiques
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 200;

// hérite des sprites phaser

Spider.prototype = Object. create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

PlayState._spawnEnemyWall = function(x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // ancre et déplacements y
    sprite.anchor.set(side === 'left' ? 1: 0, 1);
    
    // propriétées phisiques
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

Spider.prototype.update = function() {
       
    // checker si collision avec wall et inverser direction si besoin
    if (this.body.touching.right || this.body.blocked.right){
        this.body.velocity.x = -Spider.SPEED; //turn left
        this.scale.x = -1;
    } else if (this.body.touching.left || this.body.blocked.left){
        this.body.velocity.x = Spider.SPEED; //turn right
        this.scale.x = 1;
    }

};


Spider.prototype.die = function () {  
    this.body.enable = false;
    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
    
    //  this.visible = false;
};

PlayState._createHud = function () {
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);

    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');

    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);


    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.position.set(10, 10);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
};

// SPAWN PORTE
PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

// SPAWN CLEF
PlayState._spawnKey = function (x, y) {
    //this.animations.add('key', [0,1,2,3]);
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    // animation clef
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

PlayState.win = function () {

    game.add.image(0, 0, 'bg');
    button = game.add.button(game.world.centerX - 75, 275, 'button1', start, this, 2, 1, 0);
}