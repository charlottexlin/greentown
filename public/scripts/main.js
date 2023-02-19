// ----- Set up the pixi app and canvas -----
const gameWidth = 1856, gameHeight = 1024;
let app = new PIXI.Application({width: gameWidth, height: gameHeight, backgroundAlpha: 0 });
document.querySelector("#canvas").appendChild(app.view);

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

// Interactable environmental object
class Interactable {
    constructor(sprite, text) {
        this.sprite = sprite;
        this.text = text;
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
let building = new Interactable(PIXI.Sprite.from('blue_rectangle.jpg'), "this is a building");
app.stage.addChild(building.sprite);
building.sprite.x = 100;
building.sprite.y = 200;

// ----- Set up the dialogue box -----
let dialogueBox = PIXI.Sprite.from('dialogueBox.png');
const dialogueText = new PIXI.Text("Dialogue box text", { // set dialogueText.text to change
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0x000000,
    align: 'center',
});
const closeText = new PIXI.Text("[Press X to close dialogue]", {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0x000000,
    align: 'center',
});
closeText.x = 32;
closeText.y = 136;
dialogueText.x = 32;
dialogueText.y = 32;
dialogueBox.addChild(dialogueText);
dialogueBox.addChild(closeText);
app.stage.addChild(dialogueBox);
dialogueBox.x = window.innerWidth/2 - 960/2;
dialogueBox.y = window.innerHeight - 192 - 20;
dialogueBox.visible = false;

// ----- Collision detection -----
function isColliding(other) {
    if (player.sprite.getBounds().intersects(other.sprite.getBounds())){
        if(pressed.left)
        {
            if(player.sprite.x > other.sprite.x)
            {
                player.velocity.x = 0;
            }
        }
        else if(pressed.right)
        {
            if(player.sprite.x < other.sprite.x)
            {
                player.velocity.x = 0;
            }
        }
        if(pressed.down)
        {
            if(player.sprite.y < other.sprite.y)
            {
                player.velocity.y = 0;
            }
        }
        else if(pressed.up)
        {
            if(player.sprite.y > other.sprite.y)
            {
                player.velocity.y = 0;
            }
        }
    }
}

// ----- Setting dialogue ------
function checkInteraction(interactable, text) {
    if (isColliding(interactable) && pressed.e) {
        dialogueBox.visible = true;
        dialogueText.text = text;
        player.freeze();
    }
    if (dialogueBox.visible && pressed.x) {
        dialogueBox.visible = false;
        player.unfreeze();
    }
}

// ----- Game loop to actually run the game -----
app.ticker.add(() => {
    // Allow player to interact with environmental objects
    checkInteraction(building, building.text);

    // Allow player to move
    player.update();

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
});