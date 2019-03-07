// Make a new character
class Character {
    constructor(name, story, hp, attack, counterAttack, picture, sound) {
        this.name = name;
        this.story = story;
        this.hp = hp;
        this.attack = attack;
        this.counterAttack = counterAttack;
        this.picture = picture;
        this.player = false;
        this.alive = true;
        this.sound = sound;
    }
    makeCard(sceneName) {
        let id = this.name.replace(/\s+/g, '');
        id = id.toLowerCase();
        var locationDiv = $(`#${sceneName}`)
        locationDiv.append(`<div class="card" style="border: none; width: 18rem; display: inline-block; margin: 1rem; background-color: transparent;" id="${id}-card-${sceneName}"></div>`);
        let newCard = $(`#${id}-card-${sceneName}`);
        newCard.append(`<audio controls preload="auto" style="display: none;" id="${id}-attack-sound"> <source src='${this.sound}' type="audio/mpeg"></audio>`)
        newCard.append(`<img src="${this.picture}" class="card-img-top" alt="${this.name}" id="${id}-image-${sceneName}">`);
        newCard.append(`<div class="card-body text-center" style="background-color: white;" id="${id}-card-body-${sceneName}"></div>`);
        let cardBody = $(`#${id}-card-body-${sceneName}`);
        cardBody.append(`<h5 class="card-title" style="font-size: 1.5rem;">${this.name}</h5>`);
        cardBody.append(`<h3 class="card-title d-none" id="${id}-card-hp-${sceneName}">Health: ${this.hp}</h3>`);
        cardBody.append(`<p class="card-text d-none d-md-block" style="margin: 1rem;">${this.story}</p>`);
        cardBody.append(`<button type="button" class="btn btn-danger" id="${id}-card-button-${sceneName}" onclick="game.chooseCharacter('${this.name}')">Play as ${this.name}</button>`);
    }

    attackSound() {
        let id = this.name.replace(/\s+/g, '');
        id = id.toLowerCase();
        $(`#${id}-attack-sound`).trigger('play')
    }
}

class StarWarsRPG {
    constructor() {
        this.player;
        this.opponents = [];
        this.currentOpponent;
        this.scene;
        this.newGame();
    }


    // Initiates the scene
    setScene(sceneName) {
        $('body').empty();
        $('body').append(`<div style="text-align: center;" id="${sceneName}"></div>`);
        this.scene = $(`#${sceneName}`);

        // Set sthe start scene
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
            this.scene.append(`<p class="scroll-text" id="${sceneName}-text">Welcome to Star Wars RPG. In this game you will choose one of the characters to play as. Each character has different strengths and weaknesses, so you must pick carefully. The power of attacks and counter attacks vary each time, but there is a small range that you can use to build your strategy. As your character defeats more enemies, their power grows. But be careful - there is no way for your character to recover their health! Once you choose your character, you will pick your first opopnent. To win the game, defeat all of your opponents. Good luck, and may the force be with you!</p>`)
            $("audio").trigger('play')
            $(`#${sceneName}-text`).animate({
                bottom: 1000
            }, 27000, function () {
                game.setScene("choose-character-scene")
            })

        }
        // Set the scene to choose a character
        if (sceneName === "choose-character-scene") {
            $('body').attr("class", "stars")
            $('body').prepend("<h1 class='title-text'>Choose a character to play</h1>")
            for (let i = 0; i < this.characters.length; i++) {
                this.characters[i].makeCard(sceneName);
            }
        }


        // Set the scene to choose an opponent
        if (sceneName === "choose-opponent-scene") {
            $('body').prepend("<h1 class='title-text'>Choose an opponent to fight</h1>")
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
                        $(`#${opponentID}-card-button-${sceneName}`).text(`Fight ${this.opponents[i].name}`);
                    }
                }
            } else {
                this.setScene("win-lose-scene")
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
            $('body').attr("class", "stars")
            if (this.player.alive === true) {
                // Display victory video
                $("body").empty()
                $("body").append('<div class="row"><div class="col-12 text-center"><iframe style="width:100vw; height:100vh" src="https://www.youtube.com/embed/GlCFPo6YYbU?controls=0&amp;start=120&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>')
            } else {
                // Display loss video
                $("body").empty()
                $("body").append('<div class="row"><div class="col-12 text-center"><iframe style="width:100vw; height:100vh" src="https://www.youtube.com/embed/FSWiMoO8zNE?controls=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>')
            }
            setTimeout(function () {
                game.newGame()
            }, 9000)
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
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        this.currentOpponent.hp -= getRandomInt(this.player.attack - 5, this.player.attack + 5)
        this.player.attack += getRandomInt(this.player.counterAttack - 5, this.player.counterAttack + 5)
        if (this.currentOpponent.hp > 0) {
            this.player.hp -= getRandomInt(this.currentOpponent.attack - 5, this.currentOpponent.attack + 5)
        }

        if (this.currentOpponent.hp <= 0 && this.player.hp >= 0) {
            this.currentOpponent.alive = false;
            this.setScene("choose-opponent-scene");
            this.player.attackSound()

        } else if (this.currentOpponent.hp >= 0 && this.player.hp <= 0) {
            this.player.alive = false;
            this.setScene("win-lose-scene");
            this.player.attackSound()

        } else {
            this.setScene("fight-scene");
            this.player.attackSound()
        }
    }

    // Initiates a new game
    newGame() {
        this.setScene("start-scene");
        this.darthMaul = new Character("Darth Maul", "Besides his tremendous combat prowess, he is also a sinister schemer (taken from his time training with his master Darth Sidious). He also likes messing with people’s minds", 100, 16, 18, "assets/images/darth-maul.png", "assets/audio/jedi-sound.mp3");
        this.hanSolo = new Character("Han Solo", "The thing is, Han Solo isn’t a simple smuggler, he is an awesome space cowboy with wits, skills, his charming smile, and an awesome spaceship.", 120, 15, 17, "assets/images/han-solo.png", "assets/audio/solo-sound.mp3");
        this.yoda = new Character("Master Yoda", "Yoda isn’t simply an old, short? (well, at least compares to human’s standard), green-skin goblin-like being. He is probably the most powerful Jedi ever lived and also a great mentor. ", 90, 24, 24, "assets/images/yoda.png", "assets/audio/jedi-sound.mp3");
        this.palpatine = new Character("Emperor Palpatine", "Originally, he was the Senator Sheev Palpatine, a “simple” politician of Naboo. Yet, no one knew that such a “simple” politician was actually a Sith Lord Darth Sidious, a true terrific figure and the true master of the Dark Side.", 110, 22, 22, "assets/images/emperor-palpatine.png", "assets/audio/jedi-sound.mp3");
        this.characters = [this.darthMaul, this.hanSolo, this.yoda, this.palpatine];
        this.opponents = [];
    }
}



let game = new StarWarsRPG();