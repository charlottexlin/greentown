// ----- Set up the pixi app and canvas -----
const gameWidth = 1856, gameHeight = 1024;
let app = new PIXI.Application({width: gameWidth, height: gameHeight});
document.body.appendChild(app.view);

// ----- Classes for game objects -----

// Background
let bg = PIXI.Sprite.from('bg.png');
app.stage.addChild(bg);

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

class NonInteractable {
    constructor(sprite) {
        this.sprite = sprite;
    }
}

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

// Set up solid structures
let house1 = new Interactable(PIXI.Sprite.from('house.png'), "This is my house.");
app.stage.addChild(house1.sprite);
house1.sprite.x = 64;
house1.sprite.y = 64;

let house2 = new NonInteractable(PIXI.Sprite.from('house.png'));
app.stage.addChild(house2.sprite);
house2.sprite.x = 800;
house2.sprite.y = 520;

let house3 = new NonInteractable(PIXI.Sprite.from('house.png'));
app.stage.addChild(house3.sprite);
house3.sprite.x = 1620;
house3.sprite.y = 40;

let house4 = new NonInteractable(PIXI.Sprite.from('house.png'));
app.stage.addChild(house4.sprite);
house4.sprite.x = 1170;
house4.sprite.y = 600;

let dirtAccessories = new NonInteractable(PIXI.Sprite.from('dirtAccessories.png'));
app.stage.addChild(dirtAccessories.sprite);
dirtAccessories.sprite.x = 1300;
dirtAccessories.sprite.y = 680;

let forest = new NonInteractable(PIXI.Sprite.from('forest.png'));
app.stage.addChild(forest.sprite);
forest.sprite.x = 32;
forest.sprite.y = 564;

let stores = new NonInteractable(PIXI.Sprite.from('stores.png'));
app.stage.addChild(stores.sprite);
stores.sprite.x = 700;
stores.sprite.y = 200;

// ----- Set up the player -----
const playerDefaultSpeed = 8;
let pressed = {};
let player;
player = new Player(PIXI.Sprite.from('test-sprite.png'), playerDefaultSpeed);
app.stage.addChild(player.sprite);
player.sprite.x = 100;
player.sprite.y = 280;
setUpPlayerControls();

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
function checkCollision(other) {
    if (player.sprite.getBounds().intersects(other.sprite.getBounds())){
        if(pressed.left)
        {
            if(player.sprite.x > other.sprite.x + other.sprite.width - player.sprite.width/2)
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
            if(player.sprite.y > other.sprite.y + other.sprite.height - player.sprite.height/2)
            {
                player.velocity.y = 0;
            }
        }
        return true;
    }
    return false;
}

// ----- Setting dialogue ------
function checkInteraction(interactable, text) {
    if (checkCollision(interactable) && pressed.e) {
        dialogueBox.visible = true;
        dialogueText.text = text;
        player.freeze();
    }
    if (dialogueBox.visible && pressed.x) {
        dialogueBox.visible = false;
        player.unfreeze();
    }
}

let isColliding = false;

// ----- Game loop to actually run the game -----
app.ticker.add(() => {
    isColliding = false;
    // Allow player to interact with environmental objects
    isColliding = isColliding || checkInteraction(house1, house1.text);
    isColliding = isColliding || checkCollision(house2);
    isColliding = isColliding || checkCollision(house3);
    isColliding = isColliding || checkCollision(house4);
    isColliding = isColliding || checkCollision(forest);
    isColliding = isColliding || checkCollision(stores);

    // Allow player to move
    player.update();

    // ----- Auto scroll window -----
    // player has exited window right
    if (!isColliding) {
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
});