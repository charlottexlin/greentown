// ----- Set up the pixi app and canvas -----
const gameWidth = 1000, gameHeight = 600;
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
}

// Structure
class Structure {
    constructor(sprite) {
        this.sprite = sprite;
    }
}

// ----- Set up the player -----
let pressed = {};
let player;
player = new Player(PIXI.Sprite.from('test-sprite.png'), 8);
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
            pressed['left'] = true;
            break;

        case "ArrowRight":
        case "d":
            player.velocity.x = player.speed; 
            pressed['right'] = true;
            break;

        case "ArrowUp":
        case "w":
            player.velocity.y = -player.speed; 
            pressed['up'] = true;
            break;

        case "ArrowDown": 
        case "s":
            player.velocity.y = player.speed; 
            pressed['down'] = true;
            break;
    }
}

function onKeyup(event) {
    switch (event.key) {
        case "ArrowLeft": 
        case "a":
            player.velocity.x = pressed['right'] ? player.speed:0; 
            pressed['left'] = false;
            break;

        case "ArrowRight": 
        case "d":
            player.velocity.x = pressed['left'] ? -player.speed:0; 
            pressed['right'] = false;
            break;

        case "ArrowUp": 
        case "w":
            player.velocity.y = pressed['down'] ? player.speed:0; 
            pressed['up'] = false;
            break;

        case "ArrowDown": 
        case "s":
            player.velocity.y = pressed['up'] ? -player.speed:0; 
            pressed['down'] = false;
            break;
    }
}

// Set up a building
let building = new Structure(PIXI.Sprite.from('blue_rectangle.jpg'));
app.stage.addChild(building.sprite);
building.sprite.x = 100;
building.sprite.y = 200;

// ----- Collision detection -----
// Citation: https://codepen.io/hsiangfeng/embed/RwNLBWP?height=265&theme-id=default&default-tab=js,result
function isColliding(a, b) {
  const ab = a.getBounds();
  const bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// ----- Game loop to actually run the game -----
setInterval(gameLoop, 1000/60);
function gameLoop() {
    player.update();

    if (isColliding(player.sprite, building.sprite)) {
        player.speed = -player.speed;
    }
}