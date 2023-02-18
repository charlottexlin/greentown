// citation: https://pixijs.io/guides/basics/getting-started.html
// import * as PIXI from 'pixi.js'

// ----- Set up the pixi app and canvas -----
const gameWidth = 700, gameHeight = 500;
let app = new PIXI.Application({width: gameWidth, height: gameHeight});
document.querySelector("#canvas").appendChild(app.view);
app.renderer.background.color = 0x123456;

// Citation: https://medium.com/swlh/a-game-any-web-dev-can-build-in-10-mins-using-pixijs-47f8bcd85700
// Player class
class Player {
    constructor(sprite, speed) {
        this.sprite = sprite;
        this.speed = speed;
        this.velocity = {x:0, y:0};
        app.stage.addChild(this.sprite);
    }

    update() {
        let x = this.sprite.x + this.velocity.x;
        let y = this.sprite.y + this.velocity.y;

        this.sprite.x = Math.min(Math.max(x, 0), gameWidth-32); // TODO hard coded size of sprite for now
        this.sprite.y = Math.min(Math.max(y, 0), gameHeight-32);
    }
}

// ----- Set up the player -----
function setUpPlayerControls() {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyUp);
}

let pressed = {};
let player;
player = new Player(PIXI.Sprite.from('test-sprite.png'), 10);
setUpPlayerControls();

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

function onKeyUp(event) {
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

// ----- Game loop -----
setInterval(gameLoop, 1000/60);
function gameLoop() {
    player.update();
}