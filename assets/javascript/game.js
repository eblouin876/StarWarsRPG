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
    makeCard(sceneName) {
        let id = this.name.replace(/\s+/g, '');
        id = id.toLowerCase();
        var locationDiv = $(`#${sceneName}`)
        locationDiv.append(`<div class="card" style="width: 18rem; float: left; margin: 1rem;" id="${id}-card-${sceneName}"></div>`);
        let newCard = $(`#${id}-card-${sceneName}`);
        newCard.append(`<img src="${this.picture}" class="card-img-top" alt="${this.name}" id="${id}-image-${sceneName}">`);
        newCard.append(`<div class="card-body text-center" id="${id}-card-body-${sceneName}"></div>`);
        let cardBody = $(`#${id}-card-body-${sceneName}`);
        cardBody.append(`<h5 class="card-title" style="font-size: 1.5rem;">${this.name}</h5>`);
        cardBody.append(`<h3 class="card-title d-none" id="${id}-card-hp-${sceneName}">Health: ${this.hp}</h3>`);
        cardBody.append(`<p class="card-text d-none d-md-block" style="margin: 1rem;">${this.story}</p>`);
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
        this.scene;
        this.newGame();
    }


    // Initiates the scene
    setScene(sceneName) {
        $('body').empty();
        $('body').append(`<div class='container'><div class='row'><div class="col-12" id="${sceneName}"></div></div></div>`);
        this.scene = $(`#${sceneName}`);

        // Set sthe stat scene
        if (sceneName === "start-scene") {
            $('body').removeAttr("class", "fight")
            $('body').removeAttr("class", "stars")
            this.scene.append("<h1 class='play-text'>Click here to begin</h1>")
            this.scene.on('click', function () {
                game.setScene("intro-scene")
            })
        }

        // Set the intro scene
        if (sceneName === "intro-scene") {
            $('body').attr("class", "stars")
            $('body').append(`<audio controls preload="none" style="display: none;" id="audio"> <source src="assets/audio/theme.mp3" type="audio/mpeg"></audio>`)
            this.scene.append(`<p class="scroll-text" id="${sceneName}-text">Welcome to the game. Instructions and story go here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla finibus lobortis. Vestibulum gravida nibh eget ante euismod gravida. Morbi at nibh volutpat, vulputate felis ut, maximus ipsum. Mauris lorem diam, ullamcorper et purus a, accumsan feugiat lacus. Sed et nunc venenatis turpis consectetur hendrerit ac ac augue. Suspendisse ornare risus ut mollis iaculis. Praesent ultricies sodales ante. Vivamus sem diam, consequat vitae lorem eu, fringilla pretium nibh.

            In scelerisque, nulla non egestas euismod, magna tellus condimentum lorem, nec blandit sem mauris et metus. Proin eu tempor odio, sed molestie lacus. Donec nec lacus sit amet justo finibus sagittis aliquam sed lorem. Nunc dui neque, cursus ac orci ut, fringilla mollis dolor. Pellentesque interdum iaculis lectus, eu rhoncus lacus mattis sed. Nullam sed lacinia lacus. Pellentesque vel ligula vitae tellus porta dignissim. Interdum et malesuada fames ac ante ipsum primis in faucibus.
            
            Praesent elit felis, luctus at cursus eget, maximus id elit. Nunc a finibus sem, a pharetra libero. Sed viverra a sem a blandit. Donec nec sapien congue, egestas tellus eu, tristique tortor. Proin at erat quam. Curabitur laoreet sodales magna, non cursus enim sagittis quis. Nam bibendum ligula non pulvinar rhoncus. Maecenas sagittis consequat nisl ut ultricies.
            
            </p>`)
            $("audio").trigger('play')
            $(`#${sceneName}-text`).animate({
                bottom: 0
            }, 25000, function () {
                game.setScene("choose-character-scene")
            })

        }
        // Set the scene to choose a character
        if (sceneName === "choose-character-scene") {
            $('body').attr("class", "stars")
            for (let i = 0; i < this.characters.length; i++) {
                $(`#${sceneName}`).append(`<div class='row'><div class='col-12' id='${sceneName}'></div></div>`)
                this.characters[i].makeCard(sceneName);
            }
        }


        // Set the scene to choose an opponent
        if (sceneName === "choose-opponent-scene") {
            $('body').attr("class", "stars")
            let livingEnemies = [];
            this.opponents.forEach(function (opponent) {
                if (opponent.alive === true) {
                    livingEnemies.push(opponent);
                }
            })
            if (livingEnemies.length > 0) {
                for (let i = 0; i < this.opponents.length; i++) {
                    if (this.opponents[i].alive === true) {
                        this.opponents[i].makeCard(sceneName);
                        let opponentID = this.opponents[i].name.replace(/\s+/g, '').toLowerCase();
                        $(`#${opponentID}-card-button-${sceneName}`).text("Fight");
                    }
                }
            } else {
                alert("You won!");
            }
        }

        // Set the scene to fight
        if (sceneName === "fight-scene") {
            $('body').removeAttr("class", "stars")
            $('body').attr("class", "fight")
            this.currentOpponent.makeCard(sceneName);
            this.player.makeCard(sceneName);
            let playerID = this.player.name.replace(/\s+/g, '').toLowerCase();
            let opponentID = this.currentOpponent.name.replace(/\s+/g, '').toLowerCase();
            $(`#${playerID}-card-button-${sceneName}`).attr('class', 'd-none');
            $(`#${opponentID}-card-button-${sceneName}`).text("Attack");
            $(`#${opponentID}-card-button-${sceneName}`).attr('onclick', `game.attack()`);
            $(`#${playerID}-card-hp-${sceneName}`).removeAttr('class', 'd-none');
            $(`#${opponentID}-card-hp-${sceneName}`).removeAttr('class', 'd-none');
        }

        // Set the sceen to win/lose
        if (sceneName === "win-lose-scene") {
            $('body').removeAttr("class", "fight")
            $('body').removeAttr("class", "stars")
            if (this.player.alive === true) {
                // Display victory video
                alert("victory video");
            } else {
                // Display loss video
                alert("loss video");
            }
            $(`#${sceneName}`).append(`<h1 class="play-text">Press N for new game<h1>`)
            $(document).on("keyup", function (event) {
                if (event.key.toLowerCase() === "n") {
                    // Have to refer to it as game because that's what the DOM sees
                    game.newGame()
                }
            })
        }
    }

    // Handles picking a character, both in the choose character and choose opponent
    chooseCharacter(name) {
        // Choose a character to play
        if (this.scene[0] === $("#choose-character-scene")[0]) {
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
            this.setScene("choose-opponent-scene");
        } else if (this.scene[0] === $("#choose-opponent-scene")[0]) {
            // Choose an opponent to play
            for (let i = 0; i < this.characters.length; i++) {
                if (name === this.characters[i].name) {
                    this.currentOpponent = this.characters[i];
                }
            }
            this.setScene("fight-scene");
        }
    }

    // Handlse the function of your character attacking the current opponent
    attack() {
        this.currentOpponent.hp -= this.player.attack;
        this.player.attack += this.player.counterAttack;
        this.player.hp -= this.currentOpponent.counterAttack;

        if (this.currentOpponent.hp <= 0 && this.player.hp <= 0) {
            alert("Killed each other");
            this.currentOpponent.alive = false;
            this.player.alive = false;
            this.setScene("win-lose-scene");
        } else if (this.currentOpponent.hp <= 0) {
            alert(`You killed ${this.currentOpponent.name}`);
            this.currentOpponent.alive = false;
            this.setScene("choose-opponent-scene");
        } else if (this.currentOpponent.hp >= 0 && this.player.hp <= 0) {
            alert(`${this.currentOpponent.name} killed you`);
            this.player.alive = false;
            this.setScene("win-lose-scene");
        } else {
            this.setScene("fight-scene");
        }
    }

    // Initiates a new game
    newGame() {
        this.setScene("start-scene");
        this.characters = [this.darthMaul, this.hanSolo, this.yoda, this.palpatine];
        this.opponents = [];
    }
}



let game = new StarWarsRPG();