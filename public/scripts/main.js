// ----- Set up the pixi app and canvas -----
const gameWidth = 1856, gameHeight = 1024;
let app = new PIXI.Application({width: gameWidth, height: gameHeight});
document.body.appendChild(app.view);

// ----- Classes for game objects -----

// Background
let bg = PIXI.Sprite.from('bg.png');
app.stage.addChild(bg);

// Player sprites
const playerDown = PIXI.Texture.from('playerDown.png');
const playerUp = PIXI.Texture.from('playerUp.png');
const playerLeft = PIXI.Texture.from('playerLeft.png');
const playerRight = PIXI.Texture.from('playerRight.png');

// Player object
class Player {
    constructor(sprite, speed) {
        this.sprite = sprite;
        this.speed = speed;
        this.velocity = {x:0, y:0};
    }

    update() {
        // going right
        if (this.velocity.x > 0) {
            this.sprite.texture = playerRight;
        }
        // going left
        else if (this.velocity.x < 0) {
            this.sprite.texture = playerLeft;
        }
        // going down
        else if (this.velocity.y > 0) {
            this.sprite.texture = playerDown;
        }
        // going up
        else if (this.velocity.y < 0) {
            this.sprite.texture = playerUp;
        }

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
    constructor(sprite, text, type) {
        this.sprite = sprite;
        this.text = text;
        this.type = type;
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

        case "1":
            pressed['1'] = true;
            if (isConversing) {
                player.choice = "1";
            }
            break;
        
        case "2":
            pressed['2'] = true;
            if (isConversing) {
                player.choice = "2";
            }
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

        case "1":
            pressed['1'] = false;
            break;

        case "2":
            pressed['2'] = false;
            break;
    }
}

// Set up solid structures
let house1 = new Interactable(PIXI.Sprite.from('house.png'), "This is my house.\n\n\n\n\n[Press X to close dialogue]", "structure");
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
dirtAccessories.sprite.visible = true;

let forest = new NonInteractable(PIXI.Sprite.from('forest.png'));
app.stage.addChild(forest.sprite);
forest.sprite.x = 32;
forest.sprite.y = 564;

let stores = new NonInteractable(PIXI.Sprite.from('stores.png'));
app.stage.addChild(stores.sprite);
stores.sprite.x = 700;
stores.sprite.y = 200;
stores.sprite.visible = false;

let factory = new NonInteractable(PIXI.Sprite.from('factory.png'));
app.stage.addChild(factory.sprite);
factory.sprite.x = 700;
factory.sprite.y = 200;
factory.sprite.visible = false;

let deforestation = new NonInteractable(PIXI.Sprite.from('deforestation.png'));
app.stage.addChild(deforestation.sprite);
deforestation.sprite.x = 80;
deforestation.sprite.y = 564;
deforestation.sprite.visible = false;

let pollution = new NonInteractable(PIXI.Sprite.from('pollution.png'));
app.stage.addChild(pollution.sprite);
pollution.sprite.x = 1050;
pollution.sprite.y = 430;
pollution.sprite.visible = false;

let garden = new NonInteractable(PIXI.Sprite.from('garden.png'));
app.stage.addChild(garden.sprite);
garden.sprite.x = 1345;
garden.sprite.y = 710;
garden.sprite.visible = false;

let parkingLot = new NonInteractable(PIXI.Sprite.from('parkingLot.png'));
app.stage.addChild(parkingLot.sprite);
parkingLot.sprite.x = 1315;
parkingLot.sprite.y = 675;
parkingLot.sprite.visible = false;

// ----- Set up the player -----
const playerDefaultSpeed = 8;
let pressed = {};
let player;
player = new Player(PIXI.Sprite.from('playerDown.png'), playerDefaultSpeed);
app.stage.addChild(player.sprite);
player.sprite.x = 100;
player.sprite.y = 280;
setUpPlayerControls();

// ----- Set up the dialogue box -----
let dialogueBox = PIXI.Sprite.from('dialogueBox.png');
const dialogueText = new PIXI.Text("Dialogue box text", { // set dialogueText.text to change
    fontFamily: 'Arial',
    fontSize: 20,
    fill: 0x000000,
    align: 'center'
});
dialogueText.x = 32;
dialogueText.y = 32;
dialogueBox.addChild(dialogueText);
app.stage.addChild(dialogueBox);
dialogueBox.x = window.scrollX + window.innerWidth/2 - 960/2;
dialogueBox.y = window.scrollY + window.innerHeight - 192 - 20;
dialogueBox.visible = false;

// ----- Set up NPCs -----
let neighbor = new Interactable(PIXI.Sprite.from('neighbor.png'), "Oh, you’re the new town planner aren’t you? I’m so excited to see what you do with our community!\nGreen Town is beautiful because it’s right in the middle of the forest. Don’t you agree?\n\n[Press X to close dialogue]", "npc");
app.stage.addChild(neighbor.sprite);
neighbor.sprite.x = 400;
neighbor.sprite.y = 250;

let forestLady = new Interactable(PIXI.Sprite.from('forestLady.png'), "This forest has been here for a long, long time. Did you know that forests have mother trees?\nThey send carbon and nitrogen to other trees through underground fungal networks.\nNow people are considering cutting down the forest to make space for new developments.\nWhat choice will you make?\n\n[Press 1: Cut down the forest] [Press 2: Preserve the forest]", "npc");
app.stage.addChild(forestLady.sprite);
forestLady.sprite.x = 550;
forestLady.sprite.y = 500;

let oldMan = new Interactable(PIXI.Sprite.from('oldMan.png'), "This dirt field has been empty for a long time now. Some people are saying we should make it a\ncommunity garden to grow fresh local food, but others say we should make it a parking lot to\naccommodate the increasing number of cars. Town planner, what do you think we should do?\n\n[Press 1: Community garden] [Press 2: Parking lot]", "npc");
app.stage.addChild(oldMan.sprite);
oldMan.sprite.x = 1420;
oldMan.sprite.y = 610;

let businessman = new Interactable(PIXI.Sprite.from('businessman.png'), "I want to build a factory for my company here. It would make me a lot of money,\nand create jobs in Green Town. It’d be economically amazing to make this place into an\nindustrial center!\n\n[Press 1: Sounds like a great idea!] [Press 2: Hmm, I'm not sure]", "npc");
app.stage.addChild(businessman.sprite);
businessman.sprite.x = 800;
businessman.sprite.y = 450;

let storeLady = new Interactable(PIXI.Sprite.from('storeLady.png'), "I want to start a small business and open a local shopping center here.\nThe businessman doesn’t even plan to hire people who are citizens of Green Town.\nPlus, the shopping center will be a great place to socialize!\n\n[Press X to close dialogue]", "npc");
app.stage.addChild(storeLady.sprite);
storeLady.sprite.x = 1000;
storeLady.sprite.y = 450;

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
    if (interactable.type === "npc") {
        isConversing = true;
    }

    dialogueBox.x = window.scrollX + window.innerWidth/2 - 960/2;
    dialogueBox.y = window.scrollY + window.innerHeight - 192 - 20;

    const collision = checkCollision(interactable);
    if (collision && pressed.e) {
        dialogueBox.visible = true;
        dialogueText.text = text;
        player.freeze();
    }
    if (dialogueBox.visible && (pressed.x || (isConversing && (pressed["1"] || pressed["2"])))) {
        dialogueBox.visible = false;
        player.unfreeze();
    }
    return collision;
}

let isColliding = false;
const interacted = {};
let isConversing = false;

// ----- Game loop to actually run the game -----
app.ticker.add(() => {
    isColliding = false;
    isConversing = false;

    // Allow player to interact with NPCs
    const forestLadyCollide = checkInteraction(forestLady, forestLady.text);
    const neighborCollide = checkInteraction(neighbor, neighbor.text);
    const oldManCollide = checkInteraction(oldMan, oldMan.text);
    const businessmanCollide = checkInteraction(businessman, businessman.text);
    const storeLadyCollide = checkInteraction(storeLady, storeLady.text);

    // Allow player to interact with environmental objects
    isColliding = isColliding || checkInteraction(house1, house1.text);
    isColliding = isColliding || checkCollision(house2);
    isColliding = isColliding || checkCollision(house3);
    isColliding = isColliding || checkCollision(house4);
    isColliding = isColliding || checkCollision(forest);
    isColliding = isColliding || checkCollision(deforestation);
    isColliding = isColliding || forestLadyCollide;
    isColliding = isColliding || neighborCollide;
    isColliding = isColliding || oldManCollide;
    isColliding = isColliding || businessmanCollide;
    isColliding = isColliding || storeLadyCollide;
    
    if (stores.sprite.visible) {
        isColliding = isColliding || checkCollision(stores);
    }
    if (factory.sprite.visible) {
        isColliding = isColliding || checkCollision(factory);
    }

    // NPC interaction markers
    if (forestLadyCollide) {
        if (!interacted.forestLady) {
            forestLadyInteract(player.choice);
        } else {
            if (interacted.forestLady === "deforestation") {
                checkInteraction(forestLady, "I’m sad to see all the trees gone. Trees are important for the environment because they store carbon,\nwhich contributes to climate change. Every year, forests absorb 2.4 billion metric tons of carbon.\nI wonder how the mother tree and all the little creatures that lived in that forest feel now.\n\n[Press X to close dialogue]");
            }
            else if (interacted.forestLady === "forest") {
                checkInteraction(forestLady, "I’m glad you chose to save the forest. Trees are important for the environment because they store carbon,\nwhich contributes to climate change. Every year, forests absorb 2.4 billion metric tons of carbon.\nI am sure the mother tree and all the little creatures that live in the forest are happy, too.\n\n[Press X to close dialogue]");
            }
        }
        player.choice = "";
    }

    if (neighborCollide) {
        if (!interacted.neighborCollide) {
            if (interacted.forestLady === "deforestation") {
                interacted.neighbor = "deforestation";
                checkInteraction(neighbor, "It's too bad the forest was cut down. It was such a nice place to talk walks.\n\n[Press X to close dialogue]");
            }
        }
    }

    if (oldManCollide) {
        if (!interacted.oldMan) {
            oldManInteract(player.choice);
        } else {
            if (interacted.oldMan === "garden") {
                checkInteraction(oldMan, "The whole community loves the garden! Now that we grow our own fruits and vegetables,\nwe don’t have to spend as much money on importing produce. Plus, those big produce trucks won’t\npollute the environment driving here. We try to garden as sustainably as possible,\nby always taking care of the soil and never using pesticides.\n\n[Press X to close dialogue]");
            }
            else if (interacted.oldMan === "parkingLot") {
                checkInteraction(oldMan, "The air in this area isn’t as clean anymore because of all the cars now. We also have to import\nour produce, which isn’t just more expensive, but also increases carbon emissions because of\nthe transportation.\n\n[Press X to close dialogue]");
            }
        }
        player.choice = "";
    }

    if (businessmanCollide) {
        if (interacted.businessman === "next") {
            checkInteraction(businessman, "You’re the town planner aren’t you? It’s up to you whether we build my factory or not.\nWhat do you think?\n\n[Press 1: Build factory] [Press 2: Build shopping center]");
            businessmanInteract(player.choice);
        }
        if (!interacted.businessman) {
            businessmanInteract("initial");
        } else {
            if (interacted.businessman === "factory") {
                checkInteraction(businessman, "This is great, I’m making so much money! Huh, Green Town? Who cares about the residents here?\nTheir demands for higher wages are too annoying, so I don’t want to hire them.\n\n[Press X to close dialogue]");
            }
            else if (interacted.businessman === "stores") {
                checkInteraction(businessman, "Hmph, I’ll just find another town to build my factory in.\n\n[Press X to close dialogue]");
            }
        }
        player.choice = "";
    }

    if (storeLadyCollide) {
        if (interacted.businessman) {
            if (interacted.businessman === "factory") {
                checkInteraction(storeLady, "The factory has polluted the river. So many people depended on it for fresh water,\nso this is really bad. Plus, I don’t know where I can start my small business now.\n\n[Press X to close dialogue]");
            }
            else if (interacted.businessman === "stores") {
                checkInteraction(storeLady, "This is wonderful! This storefront will be perfect for my small business.\nA factory would’ve polluted the river that so many people rely on for fresh water,\nso you definitely made the right choice.\n\n[Press X to close dialogue]");
            }
        }
        player.choice = "";
    }

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

// NPC interactions
function forestLadyInteract(choice) {
    if (choice == "1") {
        interacted.forestLady = "deforestation";
        forest.sprite.visible = false;
        deforestation.sprite.visible = true;
    }
    else if (choice == "2") {
        interacted.forestLady = "forest";
    }
}

function oldManInteract(choice) {
    if (choice == "1") {
        interacted.oldMan = "garden";
        dirtAccessories.sprite.visible = false;
        garden.sprite.visible = true;
    }
    else if (choice == "2") {
        interacted.oldMan = "parkingLot";
        dirtAccessories.sprite.visible = false;
        parkingLot.sprite.visible = true;
    }
}

function businessmanInteract(choice) {
    if (choice == "initial" && player.choice == "1" || player.choice == "2") {
        interacted.businessman = "next";
    }
    if (choice == "1") {
        interacted.businessman = "factory";
        factory.sprite.visible = true;
        stores.sprite.visible = false;
        pollution.sprite.visible = true;
    }
    else if (choice == "2") {
        interacted.businessman = "stores";
        factory.sprite.visible = false;
        stores.sprite.visible = true;
        pollution.sprite.visible = false;
    }
}