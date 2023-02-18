// citation: https://pixijs.io/guides/basics/getting-started.html
// import * as PIXI from 'pixi.js'

// ----- Set up the pixi app and canvas -----
let app = new PIXI.Application({width: 600, height: 500});
document.querySelector("#canvas").appendChild(app.view);
app.renderer.background.color = 0x123456;

// Player class
class Player {
    constructor(sprite, speed) {
        this.sprite = sprite;
        this.speed = speed;
        //this.velocity = {x:0, y:0};
        app.stage.addChild(this.sprite);
    }

    move(xMove, yMove) {
        this.sprite.x = xMove;
        this.sprite.y = yMove;
    }
}

// ----- Set up the player -----
function setUpPlayerControls() {
    window.addEventListener("keydown", onKeydown);
    // window.addEventListener("keyup", onKeyup);
}

let pressed = {};
let player;
player = new Player(PIXI.Sprite.from('test-sprite.png'), 1);
setUpPlayerControls();

// Citation: https://medium.com/swlh/a-game-any-web-dev-can-build-in-10-mins-using-pixijs-47f8bcd85700
function onKeydown(event) {
    switch (event.key) {
        case "ArrowLeft":
        case "a":
            player.move(-player.speed, 0);
            pressed['left'] = true;
            break;

        case "ArrowRight":
        case "d":
            player.move(player.speed, 0);
            pressed['right'] = true;
            break;

        case "ArrowUp":
        case "w":
            player.move(0, player.speed);
            pressed['up'] = true;
            break;

        case "ArrowDown": 
        case "s":
            player.move(0, -player.speed);
            pressed['down'] = true;
            break;
    }
}

/*
// ----- Run the game -----
function gameLoop() {
}

setInterval(gameLoop, 1000/60);
*/