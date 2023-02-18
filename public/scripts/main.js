// ----- Set up the pixi app and canvas -----
const gameWidth = 2400, gameHeight = 1600;
let app = new PIXI.Application({width: gameWidth, height: gameHeight});
document.querySelector("#canvas").appendChild(app.view);
app.renderer.background.color = 0x123456;

// ----- Classes for game objects -----
// Player object
class Player {
    constructor(sprite, speed) {
        this.sprite = sprite;
        this.speed = speed;
        this.velocity = {x:0, y:0};
    }

    update() {
        let x = this.sprite.x + this.velocity.x;
        let y = this.sprite.y + this.velocity.y;

        this.sprite.x = Math.min(Math.max(x, 0), gameWidth-64);
        this.sprite.y = Math.min(Math.max(y, 0), gameHeight-64);
    }

    freeze() {
        this.speed = 0;
    }

    unfreeze() {
        this.speed = playerDefaultSpeed;
    }
}

// Structure
class Structure {
    constructor(sprite) {
        this.sprite = sprite;
    }
}

// ----- Set up the player -----
const playerDefaultSpeed = 8;
let pressed = {};
let player;
player = new Player(PIXI.Sprite.from('test-sprite.png'), playerDefaultSpeed);
app.stage.addChild(player.sprite);
setUpPlayerControls();

// Player control
// Citation: https://medium.com/swlh/a-game-any-web-dev-can-build-in-10-mins-using-pixijs-47f8bcd85700
function setUpPlayerControls() {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
}

function onKeydown(event) {
    switch (event.key) {
        case "ArrowLeft":
        case "a":
            player.velocity.x = -player.speed; 
            pressed.left = true;
            break;

        case "ArrowRight":
        case "d":
            player.velocity.x = player.speed; 
            pressed.right = true;
            break;

        case "ArrowUp":
        case "w":
            player.velocity.y = -player.speed; 
            pressed.up = true;
            break;

        case "ArrowDown": 
        case "s":
            player.velocity.y = player.speed; 
            pressed.down = true;
            break;

        case "e":
            pressed.e = true;
            break;

        case "x":
            pressed.x = true;
            break;
    }
}

function onKeyup(event) {
    switch (event.key) {
        case "ArrowLeft": 
        case "a":
            player.velocity.x = pressed.right ? player.speed:0; 
            pressed.left = false;
            break;

        case "ArrowRight": 
        case "d":
            player.velocity.x = pressed.lef ? -player.speed:0; 
            pressed.right = false;
            break;

        case "ArrowUp": 
        case "w":
            player.velocity.y = pressed.down ? player.speed:0; 
            pressed.up = false;
            break;

        case "ArrowDown": 
        case "s":
            player.velocity.y = pressed.up ? -player.speed:0; 
            pressed.down = false;
            break;

        case "e":
            pressed.e = false;
            break;

        case "x":
            pressed.x = false;
            break;
    }
}

// Set up a building
let building = new Structure(PIXI.Sprite.from('blue_rectangle.jpg'));
app.stage.addChild(building.sprite);
building.sprite.x = 100;
building.sprite.y = 200;

// Set up the dialogue box
let dialogueBox = PIXI.Sprite.from('tan-rectangle.png');
app.stage.addChild(dialogueBox);
dialogueBox.x = window.innerWidth/2 - 1000/2; // TODO length of dialogue box
dialogueBox.y = window.innerHeight - 171 - 20; // TODO height of the dialogue box
dialogueBox.visible = false;

// ----- Collision detection -----
function isColliding(a, b) {
    return a.getBounds().intersects(b.getBounds());
}

// ----- Game loop to actually run the game -----
setInterval(gameLoop, 1000/60);
function gameLoop() {
    player.update();

    if (isColliding(player.sprite, building.sprite) && pressed.e) {
        dialogueBox.visible = true;
        player.freeze();
    }

    if (dialogueBox.visible && pressed.x) {
        dialogueBox.visible = false;
        player.unfreeze();
    }

    // ----- Auto scroll window -----
    // player has exited window right
    if (pressed.right && player.sprite.x > window.innerWidth/2) {
        window.scrollBy(playerDefaultSpeed, 0);
    }
    
    // player has exited window down
    if (pressed.down && player.sprite.y > window.innerHeight/2) {
        window.scrollBy(0, playerDefaultSpeed);
    }

    // player has exited window left
    if (pressed.left && player.sprite.x < window.innerWidth) {
        window.scrollBy(-playerDefaultSpeed, 0);
    }

    // player has exited window up
    if (pressed.up && player.sprite.y < window.innerHeight * 1.5) {
        window.scrollBy(0, -playerDefaultSpeed);
    }
}