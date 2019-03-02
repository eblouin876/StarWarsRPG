// Make a new character
class Character {
    constructor(name, story, hp, attack, counterAttack, picture) {
        this.name = name;
        this.story = story;
        this.hp = hp;
        this.attack = attack;
        this.counterAttack = counterAttack;
        this.picture = picture;
        this.player = false;
        this.alive = true;
    }
    makeCard(locationDiv, sceneName) {
        let id = this.name.replace(/\s+/g, '');
        id = id.toLowerCase();
        locationDiv.append(`<div class="card" style="width: 18rem; float: left; margin: 1rem;" id="${id}-card-${sceneName}"></div>`);
        let newCard = $(`#${id}-card-${sceneName}`);
        newCard.append(`<img src="${this.picture}" class="card-img-top" alt="${this.name}" id="${id}-image-${sceneName}">`);
        newCard.append(`<div class="card-body text-center" id="${id}-card-body-${sceneName}"></div>`);
        let cardBody = $(`#${id}-card-body-${sceneName}`);
        cardBody.append(`<h5 class="card-title" style="font-size: 1.5rem;">${this.name}</h5>`);
        cardBody.append(`<h3 class="card-title d-none" id="${id}-card-hp-${sceneName}">Health: ${this.hp}</h3>`);
        cardBody.append(`<p class="card-text" style="margin: 1rem;">${this.story}</p>`);
        cardBody.append(`<button type="button" class="btn btn-danger" id="${id}-card-button-${sceneName}" onclick="game.chooseCharacter('${this.name}')">Play as ${this.name}</button>`);
    }
}

class StarWarsRPG {
    constructor() {
        this.darthMaul = new Character("Darth Maul", "Besides his tremendous combat prowess, he is also a sinister schemer (taken from his time training with his master Darth Sidious). He also likes messing with people’s minds", 100, 18, 18, "assets/images/darth-maul.jpg");
        this.hanSolo = new Character("Han Solo", "The thing is, Han Solo isn’t a simple smuggler, he is an awesome space cowboy with wits, skills, his charming smile, and an awesome spaceship.", 120, 20, 20, "assets/images/han-solo.png");
        this.yoda = new Character("Master Yoda", "Yoda isn’t simply an old, short? (well, at least compares to human’s standard), green-skin goblin-like being. He is probably the most powerful Jedi ever lived and also a great mentor. ", 90, 24, 24, "assets/images/yoda.jpg");
        this.palpatine = new Character("Emperor Palpatine", "Originally, he was the Senator Sheev Palpatine, a “simple” politician of Naboo. Yet, no one knew that such a “simple” politician was actually a Sith Lord Darth Sidious, a true terrific figure and the true master of the Dark Side.", 115, 22, 22, "assets/images/emperor-palpatine.jpg");
        this.characters = [this.darthMaul, this.hanSolo, this.yoda, this.palpatine];
        this.player;
        this.opponents = [];
        this.currentOpponent;
        this.scene = $("#start-scene");
        this.setScene(this.scene);


    }


    // Changes what is displayed in the window
    changeVisual(scene) {
        $("#start-scene").addClass("d-none");
        $("#choose-character-scene").addClass("d-none");
        $("#choose-opponent-scene").addClass("d-none");
        $("#fight-scene").addClass("d-none");
        $("#win-lose-scene").addClass("d-none");
        scene.removeClass("d-none");
    }

    resetScenes() {
        $("#choose-character-scene").empty();
        $("#choose-opponent-scene").empty();
        $("#fight-scene").empty();
        $("#win-lose-scene").empty();
    }

    // Initiates the scene
    setScene(sceneID, sceneName) {
        this.scene = sceneID;
        this.resetScenes();
        this.changeVisual(this.scene);
        var startScene = $("#start-scene");
        var chooseCharScene = $("#choose-character-scene");
        var chooseOppScene = $("#choose-opponent-scene");
        var fightScene = $("#fight-scene");
        var winLoseScene = $("#win-lose-scene");
        // Set the scene to choose a character
        if (sceneID[0] === chooseCharScene[0]) {
            for (let i = 0; i < this.characters.length; i++) {
                this.characters[i].makeCard(sceneID, sceneName);
            }
        }

        // Set the scene to choose an opponent
        if (sceneID[0] === chooseOppScene[0]) {
            let livingEnemies = [];
            this.opponents.forEach(function (opponent) {
                if (opponent.alive === true) {
                    livingEnemies.push(opponent);
                }
            })
            if (livingEnemies.length > 0) {
                for (let i = 0; i < this.opponents.length; i++) {
                    if (this.opponents[i].alive === true) {
                        this.opponents[i].makeCard(sceneID, sceneName);
                        let opponentID = this.opponents[i].name.replace(/\s+/g, '').toLowerCase();
                        $(`#${opponentID}-card-button-${sceneName}`).text("Fight");
                    }
                }
            } else {
                alert("You won!");
            }
        }

        // Set the scene to fight
        if (sceneID[0] === fightScene[0]) {
            this.player.makeCard(sceneID, sceneName);
            this.currentOpponent.makeCard(sceneID, sceneName);
            let playerID = this.player.name.replace(/\s+/g, '').toLowerCase();
            let opponentID = this.currentOpponent.name.replace(/\s+/g, '').toLowerCase();
            $(`#${playerID}-card-button-${sceneName}`).attr('class', 'd-none');
            $(`#${opponentID}-card-button-${sceneName}`).text("Attack");
            $(`#${opponentID}-card-button-${sceneName}`).attr('onclick', `game.attack()`);
            $(`#${playerID}-card-hp-${sceneName}`).removeAttr('class', 'd-none');
            $(`#${opponentID}-card-hp-${sceneName}`).removeAttr('class', 'd-none');
        }

        // Set the sceen to win/lose
        if (sceneID[0] === winLoseScene[0]) {
            if (this.player.alive === true) {
                // Display victory video
                alert("victory video");
            } else {
                // Display loss video
                alert("loss video");
            }
            winLoseScene.append(`<h1>Press Y to play again<h1>`)
            $(document).on("keyup", function (event) {
                if (event.key.toLowerCase() === "y") {
                    // Have to refer to it as game because that's what the DOM sees
                    game.newGame()
                }
            })
        }
    }

    chooseCharacter(name) {
        // Choose a character to play
        let chooseCharacterScene = $("#choose-character-scene");
        let chooseOpponentScene = $("#choose-opponent-scene");
        if (this.scene[0] === chooseCharacterScene[0]) {
            for (let i = 0; i < this.characters.length; i++) {
                if (name === this.characters[i].name) {
                    this.player = this.characters[i];
                }
            }

            for (let i = 0; i < this.characters.length; i++) {
                if (this.characters[i] !== this.player) {
                    this.opponents.push(this.characters[i]);
                }
            }
            this.setScene($("#choose-opponent-scene"), "opponent-scene")
        } else if (this.scene[0] === chooseOpponentScene[0]) {
            // Choose an opponent to play
            for (let i = 0; i < this.characters.length; i++) {
                if (name === this.characters[i].name) {
                    this.currentOpponent = this.characters[i];
                }
            }
            this.setScene($("#fight-scene"), "fight-scene");
        }
    }

    attack() {
        this.currentOpponent.hp -= this.player.attack;
        this.player.attack += this.player.counterAttack;
        this.player.hp -= this.currentOpponent.counterAttack;

        if (this.currentOpponent.hp <= 0 && this.player.hp <= 0) {
            alert("Killed each other");
            this.currentOpponent.alive = false;
            this.player.alive = false;
            this.setScene($("#win-lose-scene"), "win-lose-scene");
        } else if (this.currentOpponent.hp <= 0) {
            alert(`You killed ${this.currentOpponent.name}`);
            this.currentOpponent.alive = false;
            this.setScene($("#choose-opponent-scene"), "opponent-scene");
        } else if (this.currentOpponent.hp >= 0 && this.player.hp <= 0) {
            alert(`${this.currentOpponent.name} killed you`);
            this.player.alive = false;
            this.setScene($("#win-lose-scene"), "win-lose-scene");
        } else {
            this.setScene($("#fight-scene"), "fight-scene");
        }
    }

    newGame() {
        this.setScene($("#choose-character-scene"), "choose-scene");
        this.characters = [this.darthMaul, this.hanSolo, this.yoda, this.palpatine];
        this.opponents = [];
    }
}



let game = new StarWarsRPG();
document.onclick = function () {
    game.newGame();
    document.onclick = function () {}
}