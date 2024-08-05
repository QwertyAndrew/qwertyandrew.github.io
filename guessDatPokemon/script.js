// This is only for testing purposes
// localStorage.clear()

// -----VARIABLES----- //
const UIElements = {
    // intro screen UI
    introScreenUI: document.querySelector(".introScreenUI"),
    playButton: document.querySelector("#playButton"),
    creditButton: document.querySelector("#creditButton"),

    // gameplay screen UI
    gameplayScreenUI: document.querySelector(".gameplayScreenUI"),
    attemptValue: document.querySelector("#attemptValue"),
    scoreValue: document.querySelector("#scoreValue"),
    highscoreValue: document.querySelector("#highscoreValue"),
    pokemonSprite: document.querySelector(".pokemonSprite"),
    blurPokemonSprite: document.querySelector(".blurPokemonSprite"),
    userInputForm: document.querySelector(".userInputForm"),
    submitIndication: document.querySelector(".submitIndication"),

    // final score screen UI when u lose
    finalScoreScene: document.querySelector(".finalScoreScene"),
    displayChosenPokemon: document.querySelector(".displayChosenPokemon"),
    finalStatistic: document.querySelector(".finalStatistic"),
    finalVerdict: document.querySelector(".finalVerdict"),
    finalGuessingGrading: document.querySelector(".finalGuessingGrading"),
    retryButton: document.querySelector("#retryButton"),
    menuButton: document.querySelector("#menuButton"),

    // win screen UI when u win
    winScreenUI: document.querySelector(".winScreenUI"),
    finalWinStatistic: document.querySelector(".finalWinStatistic"),
    finalScoreVerdict: document.querySelector(".finalScoreVerdict"),
    finalWinGrade: document.querySelector(".finalWinGrade"),
    winRetryButton: document.querySelector("#winRetryButton"),
    winMenuButton: document.querySelector("#winMenuButton"),

    // credit screen UI
    creditScreenUI: document.querySelector(".creditScreenUI"),
    creditMenuButton: document.querySelector("#creditMenuButton"),

    // miscellaneous
    checkingIndication: document.querySelector(".checkingIndication")
};

// game-related variables!
let alreadyChosenPokemonID = [];
let attempts = 5;
let scores = 0;
let highscore = localStorage.getItem("highscore") || 0;
let blurValue = 4;
let guessedPokemon = 0;
let potentialPoint = 100;

// all verdict list
const allVerdictList = {
    guessed0: [
        "you kinda suck...", 
        "maybe that's just unlucky, try again",
        "you either got the new pokemon, or not a fan of this series",
        "uhh, wanna binge watching pokemon some day?",
        "it's okay, you tried your best :P",
        "try again?"
    ],

    guessed10: [
        "at least you do know pokemon :/", 
        "at least you're better than me?",
        "off to a good start though, try again",
        "try better next time...",
    ],
    
    guessed100: [
        "you're making huge progress!", 
        "huh, you are a pokemon fan after all!",
        "daaaaaaang, you totally better than me..."
    ],
    
    guessed500: [
        "you are crazy", 
        "you are nuts",
        "yep, you are a pokemon fan, no doubts",
        "hardcore pokemon fan by chance?",
        "so metal, you are a hardcore fan"
    ],
    
    guessed1000: [
        "you're a pokedex machine!", 
        "remember to drink water, please?",
        "how much memory do you have for this game?",
        ":D?!",
        "you are actually insane..."
    ],
    
    guessed1024: [
        "so close!", 
        "legendary!!",
        "you are so close!",
        "superb!",
        "very close, you did so well!"
    ],
    
    score28700: [
        "i noticed you used up the attempts alot of times though, keep in mind, the less the attempts you have, the less score you will get when you guessed it right",
        "score is too low though, but hey you beat the game, be proud :)",
        `score can be higher, eh that's good enough!`,
        "i mean, you can flex with this score to everyone that's for sure!"
    ],
    
    score47150: [
        "ooh, not bad, good score, go flex it to your friends",
        "you totally sure using some attempts there, but not as much as I expected",
        "good score! Could be better!"   
    ],
    
    score65600: [
        "that's high, but that's just average",
        "I can tell you tried to guess multiple first attempt to get good scores!",
        "crazy good actually!"
    ],
    
    score84050: [
        "and the score is high as well?? You are a master!",
        "and the score is super high? Well done!",
        "okay, you are very good at image recognition"
    ],
    
    score102500: [
        "too good to be true...",
        "speechless!",
        "omg ur basically as good as minh almost0 xddd"
    ],
}

// -----FUNCTIONS----- //

// function update the values, visually
function updateValues() {
    UIElements.attemptValue.innerHTML = `>attempts: ${attempts}`;
    UIElements.scoreValue.innerHTML = `>scores: ${scores}`;
    UIElements.highscoreValue.innerHTML = `>highscores: ${highscore}`;
}

// indicator flashing incorrect
function indicatorFlashRed() {
    UIElements.checkingIndication.style.opacity = 1;
    UIElements.checkingIndication.style.transition = "";
    UIElements.checkingIndication.style.background = "linear-gradient(0deg, rgb(255, 0, 0) 0%, rgba(0,0,0,0) 100%)";
    
    setTimeout(() => {
        UIElements.checkingIndication.style.transition = "opacity 1s cubic-bezier(0, 0.55, 0.45, 1)";
        UIElements.checkingIndication.style.opacity = 0;
    }, 1);
}

// indicator flashing correct
function indicatorFlashGreen() {
    UIElements.checkingIndication.style.opacity = 1;
    UIElements.checkingIndication.style.transition = "";
    UIElements.checkingIndication.style.background = "linear-gradient(0deg, rgb(0, 255, 0) 0%, rgba(0,0,0,0) 100%)";

    setTimeout(() => {
        UIElements.checkingIndication.style.transition = "opacity 1s cubic-bezier(0, 0.55, 0.45, 1)";
        UIElements.checkingIndication.style.opacity = 0;
    }, 250);
}

// Initialize the game
// "what values do i need to reset for a retry"
function initializeGame() {
    alreadyChosenPokemonID = [];
    attempts = 5;
    scores = 0;
    blurValue = 4;
    guessedPokemon = 0;
    potentialPoint = 100;
}

// reset the values in game
// "what values do i need to reset for a NEXT ROUND?"
function inGameReset() {
    attempts = 5;
    blurValue = 4;
    potentialPoint = 100;
}

// check if input is correct
function checkCorrect(userAnswer, chosenPokemon, chosenPokemonWithSpace) {
    if (userAnswer == chosenPokemon) {
        // is correct
        // reset that submit indication
        UIElements.submitIndication.style.opacity = "";
        UIElements.submitIndication.style.letterSpacing = "";
        UIElements.submitIndication.style.color = "";
        UIElements.submitIndication.style.textShadow = ""

        // disable input instantly
        UIElements.blurPokemonSprite.style.backdropFilter = `blur(0vmin)`
        scores += potentialPoint;

        // if the current score is higher than highscore, update highscore
        if (scores > highscore) {
            highscore = scores;
        }

        guessedPokemon += 1
        updateValues();

        // checking indication style flash green
        indicatorFlashGreen()

        // if all pokemon guessed, 1025 of them
        if (guessedPokemon == 1025) {
            UIElements.gameplayScreenUI.style.display = "none";
            UIElements.winScreenUI.style.display = "flex";

            UIElements.finalWinStatistic.innerHTML = `
                >score: ${scores}
                <br>
                >highScore: ${highscore}
            `;

            giveScoreVerdicts();

            // save highscore in local storage
            localStorage.setItem("highscore", highscore);

        } else {
            // wait for 3 seconds to get a new pokemon
            setTimeout(() => {
                UIElements.pokemonSprite.style.opacity = 0;
                UIElements.pokemonSprite.style.transform = "translateY(5vh)";

                UIElements.userInputForm.style.transition = "all 0.5s cubic-bezier(0.5, 1, 0.89, 1)"
                UIElements.userInputForm.style.transform = "translateY(5vh)";
                UIElements.userInputForm.style.opacity = 0;
            }, 3000);

            setTimeout(() => {
                getRandomPokemon()
            }, 3500);

            setTimeout(() => {
                UIElements.pokemonSprite.style.opacity = 1;
                UIElements.pokemonSprite.style.transform = "translateY(0vh)"

                UIElements.userInputForm.style.transition = "all 1s cubic-bezier(0.5, 1, 0.89, 1)"
                UIElements.userInputForm.style.transform = "translateY(0vh)";
                UIElements.userInputForm.style.opacity = 1;
            }, 4000);
    
            // disable textbox by returning true for the if statement
            return true;
        }

    } else {
        // is not correct\
        blurValue -= 1
        UIElements.blurPokemonSprite.style.backdropFilter = `blur(${blurValue}vmin)`
        attempts -= 1;
        potentialPoint -= 20;

        // if no attempts left = loose gg
        if (attempts <= 0) {
            // reset that submit indication
            UIElements.submitIndication.style.opacity = "";
            UIElements.submitIndication.style.letterSpacing = "";
            UIElements.submitIndication.style.color = "";
            UIElements.submitIndication.style.textShadow = ""

            indicatorFlashRed()

            // make gameplay invisible
            // turn on the final score scene
            UIElements.gameplayScreenUI.style.display = "none";
            UIElements.finalScoreScene.style.display = "flex";

            // change the text from displayChosenPokemon
            // https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
            // i want to captilaize the first letter of a word so
            UIElements.displayChosenPokemon.innerHTML = `It's ${chosenPokemonWithSpace}`

            // display statistic
            UIElements.finalStatistic.innerHTML = `
            >finalScore: ${scores}
            <br>
            >highscore: ${highscore}
            <br>
            >guessedPokemon: ${guessedPokemon} out of 1025 (${Math.round((guessedPokemon/1025*10000) / 100)}%)`
            // save highscore in local storage
            localStorage.setItem("highscore", highscore);

            // verdict system when loosing
            // randomly pick a verdict from a specific list
            giveGuessedVerdicts();
            
        } else {
            // still have attempts? update values and flash red
            updateValues();
            indicatorFlashRed();
        }
    }
}

// get random pokemon
async function getRandomPokemon() {
    // Get a random PokeID
    // 1026? Because i want between 1 to 1025
    // max can be below, but not equal to max so i have to increase by 1
    let pokeID = Math.floor(Math.random() * 1025) + 1;
    let PokemonNameFromPokeID;
    let PokemonImageFromPokeID;

    // // if the pokeID is already in the list, repeat
    while (alreadyChosenPokemonID.includes(pokeID)) {
        pokeID = Math.floor(Math.random() * 1025) + 1;
    }

    // Check the chosen random pokemon in the localStorage using PokeID
    // if they exist then use the info from it
    if (localStorage.getItem(`pokeID${pokeID}_name`)) {
        // set the empty vars above to this info
        PokemonNameFromPokeID = JSON.parse(localStorage.getItem(`pokeID${pokeID}_name`))
        PokemonImageFromPokeID = JSON.parse(localStorage.getItem(`pokeID${pokeID}_image`))
    } else {
        // If not, use the API
        let pokeAPIURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}`

        // "Could u pls wait for this fetch to complete before running the next line thanks :D"
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
        const rawdata = await fetch(pokeAPIURL);
        const data = await rawdata.json();

        const imageURL = data.sprites.other.showdown.front_default || data.sprites.front_default

        // I want name of the pokemon, showdown sprite or official art
        // The name and image already assigned with an ID, it should work :/
        localStorage.setItem(
            `pokeID${pokeID}_name`, JSON.stringify(data.species.name)
        );

        localStorage.setItem(
            // get the gif file or official art
            `pokeID${pokeID}_image`, JSON.stringify(imageURL)
        )

        // set the empty vars above to this info
        PokemonNameFromPokeID = data.species.name
        // get the gif file or official art
        PokemonImageFromPokeID = imageURL
    }

    // put the chosen pokeID inside the alreadyChosenPokemonID list
    alreadyChosenPokemonID.push(pokeID);

    // set sprite, idk why it loads so slow, its pain
    UIElements.pokemonSprite.setAttribute("src", PokemonImageFromPokeID)

    // clear the answer area first
    UIElements.userInputForm.innerHTML = "";

    inGameReset()
    UIElements.blurPokemonSprite.style.backdropFilter = `blur(${blurValue}vmin)`
    updateValues();

    // set textbox
    for (let i = 0; i < PokemonNameFromPokeID.length; i++) {
        // if pokemon has a space in it's name
        if (PokemonNameFromPokeID[i] == "-") {
            let textboxDivider = document.createElement("div");
            textboxDivider.className = "textboxDivider";
            UIElements.userInputForm.appendChild(textboxDivider);

        // if pokemon does not have a space in it's name
        } else {
            let textBox = document.createElement("input");
            textBox.setAttribute("maxlength", "1");
            textBox.id = i;

            // function for each textbox
            // input function
            // omg took me AWHILE TO REALISED TRY CATCH FUNCTION EXIST AAAAAAAAAA
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
            textBox.addEventListener('input', (event) => {
                // put the inputs into an array, and check if every input is empty or not.
                // remove white space, or spacebar, because that doesn't count
                // returns true (all filled) or false (not filled)
                const allInputsFilledBoolean = Array.from(UIElements.userInputForm.children).filter(child => child.tagName.toLowerCase() === 'input').every(input => input.value !== "");

                try {
                    // reset rotation for the textbox
                    textBox.style.rotate = "0deg"

                    // if all inputs are filled, make enterIndication opaque
                    if (allInputsFilledBoolean) {
                        UIElements.submitIndication.style.opacity = 1;
                        UIElements.submitIndication.style.letterSpacing = "0.2vw";
                        UIElements.submitIndication.style.color = "var(--accent)";
                        UIElements.submitIndication.style.textShadow = "0px 0px 2vmin var(--accent)"

                    } else {
                        UIElements.submitIndication.style.opacity = "";
                        UIElements.submitIndication.style.letterSpacing = "";
                        UIElements.submitIndication.style.color = "";
                        UIElements.submitIndication.style.textShadow = ""
                    }

                    // is the input not backspace and next textbox IS a divider?
                    if (event.inputType !== 'deleteContentBackward' && textBox.nextElementSibling.className == "textboxDivider") {
                        // Switch to the next NEXT input, if not the last
                        textBox.nextElementSibling.nextElementSibling.focus();
                    }
                    else if (event.inputType !== 'deleteContentBackward' && textBox.nextElementSibling){
                        // Switch to the next input, if not the last
                        textBox.nextElementSibling.focus();
                    }
                } catch (error) {
                    UIElements.userInputForm.style.transition = "all 0s cubic-bezier(0.5, 1, 0.89, 1)";
                    UIElements.userInputForm.style.transform = "translateX(0.5vw)"
                    setTimeout(() => {
                        UIElements.userInputForm.style.transition = "all 1s cubic-bezier(0.5, 1, 0.89, 1)";
                        UIElements.userInputForm.style.transform = "translateX(0vw)"
                    }, 1);
                }
            });            

            // INPUT detected
            textBox.addEventListener("keydown", (event) => {
                try {
                    // is it backspace key?
                    if (event.key === "Backspace") {
                        // is the current textbox has something?
                        if (textBox.value.length > 0) {
                            textBox.rotate = "0deg";
                            return; // let the backspace remove it!
                        }
    
                        // if the previous textbox is a space/divider
                        else if (textBox.previousElementSibling.className == "textboxDivider") {
                            // remove the character from the previous PREVIOUS textbox first
                            const previousTextBox = textBox.previousElementSibling.previousElementSibling;
                            previousTextBox.value = "";
                            // then move the focus to the previous textbox
                            previousTextBox.focus();
                            previousTextBox.style.rotate = "0deg";
                        }
                        else if (textBox.previousElementSibling) {
                            // remove the character from the previous textbox first
                            const previousTextBox = textBox.previousElementSibling;
                            previousTextBox.value = "";
                            // then move the focus to the previous textbox
                            previousTextBox.focus();
                            previousTextBox.style.rotate = "0deg";
                        }
                    // is it enter key?
                    } else if (event.key === "Enter") {
                        // get array from the form
                        // filter ONLY the input
                        // set all char lower case
                        // join them together as a string
                        let userAnswer = Array.from(UIElements.userInputForm.children).filter(child => child.tagName.toLowerCase() === 'input').map(input => input.value.toLowerCase()).join('');

                        UIElements.userInputForm.style.transition = "all 0s cubic-bezier(0.5, 1, 0.89, 1)";
                        UIElements.userInputForm.style.transform = "translateY(2.5vh)";

                        setTimeout(() => {
                            UIElements.userInputForm.style.transition = "all 0.5s cubic-bezier(0.5, 1, 0.89, 1)";
                            UIElements.userInputForm.style.transform = ""
                        }, 1);

                        // check if the input is enough
                        if (userAnswer.length != PokemonNameFromPokeID.replace('-','').length) {
                            // not enough
                            console.log(userAnswer.length, PokemonNameFromPokeID.replace('-','').length)
                            Array.from(UIElements.userInputForm.children).forEach(textBox => {
                                if (textBox.value == "") {
                                    textBox.style.transition = "background-color 0s cubic-bezier(0, 0.55, 0.45, 1), rotate 0.5s cubic-bezier(0, 0.55, 0.45, 1)";
                                    textBox.style.rotate = `${Math.random() * (45 - (-45)) + (-45)}deg`
                                    textBox.style.backgroundColor = "rgb(255,0,0)"

                                    setTimeout(() => {
                                        textBox.style.transition = "all 0.5s cubic-bezier(0, 0.55, 0.45, 1)";
                                        textBox.style.backgroundColor = ""
                                    }, 1);
                                }
                            });

                        } else if (checkCorrect(userAnswer, PokemonNameFromPokeID.replace('-',''), PokemonNameFromPokeID.replace('-',' '))) {
                            // also make the chosenpokemonname with no -
                            // if checkCorrect returns true (means it is correct)
                            // Disable all hitboxes.
                           
                            Array.from(UIElements.userInputForm.children).forEach(input => {
                                if (input.tagName.toLowerCase() === 'input') {
                                    input.disabled = true;
                                }
                            });
                        }
                    }
                } catch (error) {
                    UIElements.userInputForm.style.transition = "all 0s cubic-bezier(0.5, 1, 0.89, 1)";
                    UIElements.userInputForm.style.transform = "translateX(-0.5vw)"
                    setTimeout(() => {
                        UIElements.userInputForm.style.transition = "all 1s cubic-bezier(0.5, 1, 0.89, 1)";
                        UIElements.userInputForm.style.transform = "translateX(0vw)"
                    }, 1);
                }
            });

            UIElements.userInputForm.appendChild(textBox)
        }
    }

    // submit indication

    console.log(`for the cheaters: ${PokemonNameFromPokeID.replace('-','')}`)
    // to make life easy, automatically focus on the first input
    UIElements.userInputForm.querySelector('input').focus();
}

// Give the verdicts for the amount of guesses after you lost
function giveGuessedVerdicts() {
    // https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
    if (guessedPokemon == 0) {
        UIElements.finalVerdict.innerHTML = `
        >verdict:
        <br>
        ${allVerdictList.guessed0[(Math.floor(Math.random() * allVerdictList.guessed0.length))]}
        `

        UIElements.finalGuessingGrading.innerHTML = "NULL";
    } else if (guessedPokemon <= 10) {
        UIElements.finalVerdict.innerHTML = `
        >verdict:
        <br>
        ${allVerdictList.guessed10[(Math.floor(Math.random() * allVerdictList.guessed10.length))]}
        `

        UIElements.finalGuessingGrading.innerHTML = "D";
    } else if (guessedPokemon <= 100) {
        UIElements.finalVerdict.innerHTML = `
        >verdict:
        <br>
        ${allVerdictList.guessed100[(Math.floor(Math.random() * allVerdictList.guessed100.length))]}
        `

        UIElements.finalGuessingGrading.innerHTML = "C";
    } else if (guessedPokemon <= 500) {
        UIElements.finalVerdict.innerHTML = `
        >verdict:
        <br>
        ${allVerdictList.guessed500[(Math.floor(Math.random() * allVerdictList.guessed500.length))]}
        `

        UIElements.finalGuessingGrading.innerHTML = "C+";
    } else if (guessedPokemon <= 1000) {
        UIElements.finalVerdict.innerHTML = `
        >verdict:
        <br>
        ${allVerdictList.guessed1000[(Math.floor(Math.random() * allVerdictList.guessed1000.length))]}
        `

        UIElements.finalGuessingGrading.innerHTML = "B";
    } else if (guessedPokemon <= 1024) {
        UIElements.finalVerdict.innerHTML = `
        >verdict:
        <br>
        ${allVerdictList.guessed1024[(Math.floor(Math.random() * allVerdictList.guessed1024.length))]}
        `

        UIElements.finalGuessingGrading.innerHTML = "B+";
    }
}

// Give the verdicts for scores after you actually beat the game
function giveScoreVerdicts() {
    if (scores < 28700) {
        UIElements.finalScoreVerdict.innerHTML = `>${allVerdictList.score28700[Math.floor(Math.random() * allVerdictList.score28700.length)]}`
        UIElements.finalWinGrade.innerHTML = "A";
    } else if (scores < 47150) {
        UIElements.finalScoreVerdict.innerHTML = `>${allVerdictList.score47150[Math.floor(Math.random() * allVerdictList.score47150.length)]}`
        UIElements.finalWinGrade.innerHTML = "A+";
    } else if (scores < 65600) {
        UIElements.finalScoreVerdict.innerHTML = `>${allVerdictList.score65600[Math.floor(Math.random() * allVerdictList.score65600.length)]}`
        UIElements.finalWinGrade.innerHTML = "S";
    } else if (scores < 84050) {
        UIElements.finalScoreVerdict.innerHTML = `>${allVerdictList.score84050[Math.floor(Math.random() * allVerdictList.score84050.length)]}`
        UIElements.finalWinGrade.innerHTML = "S+";
    } else if (scores <= 102500) {
        UIElements.finalScoreVerdict.innerHTML = `>${allVerdictList.score102500[Math.floor(Math.random() * allVerdictList.score102500.length)]}`
        UIElements.finalWinGrade.innerHTML = "S++";
    }
}

// -----MAIN ACTIONS----- //
// play button functionality
UIElements.playButton.addEventListener("click", () => {
    UIElements.introScreenUI.style.opacity = "0";
    UIElements.introScreenUI.style.transform = "translateY(10vh)"

    // reset all data for a retry
    initializeGame()

    getRandomPokemon()
    
    setTimeout(() => {
        UIElements.introScreenUI.style.display = "none"
        UIElements.gameplayScreenUI.style.display = "block";
    }, 500);
})

// credit button functionality
UIElements.creditButton.addEventListener("click", () => {
    UIElements.introScreenUI.style.opacity = "0";
    UIElements.introScreenUI.style.transform = "translateY(10vh)"

    setTimeout(() => {
        UIElements.introScreenUI.style.display = "none";
        UIElements.creditScreenUI.style.display = "flex";

        UIElements.introScreenUI.style.opacity = "1";
        UIElements.introScreenUI.style.transform = "translateY(0vh)"
    }, 500);
})

// back to menu from credit screen UI functionality
UIElements.creditMenuButton.addEventListener("click", () => {
    UIElements.creditScreenUI.style.opacity = "0";
    UIElements.creditScreenUI.style.transform = "translateY(10vh)"

    setTimeout(() => {
        UIElements.creditScreenUI.style.display = "none";
        UIElements.introScreenUI.style.display = "flex";

        UIElements.creditScreenUI.style.opacity = "1";
        UIElements.creditScreenUI.style.transform = "translateY(0vh)"
    }, 500);
})

// retry button (lose screen) functionality
UIElements.retryButton.addEventListener("click", () => {
    UIElements.finalScoreScene.style.opacity = "0";
    UIElements.finalScoreScene.style.transform = "translateY(10vh)"
    getRandomPokemon()

    setTimeout(() => {
        UIElements.finalScoreScene.style.display = "none";
        UIElements.finalScoreScene.style.opacity = "1";
        UIElements.finalScoreScene.style.transform = "translateY(0vh)"

        // reset all data for a retry
        initializeGame()

        updateValues()

        UIElements.gameplayScreenUI.style.display = "block";
    }, 500);
})

// menu button (lose screen) functionality
UIElements.menuButton.addEventListener("click", () => {
    UIElements.finalScoreScene.style.opacity = "0";
    UIElements.finalScoreScene.style.transform = "translateY(10vh)"

    setTimeout(() => {
        UIElements.finalScoreScene.style.display = "none";
        UIElements.introScreenUI.style.display = "flex";
        UIElements.introScreenUI.style.opacity = '1';
        UIElements.introScreenUI.style.transform = "translateY(0vh)";

        UIElements.finalScoreScene.style.opacity = "1";
        UIElements.finalScoreScene.style.transform = "translateY(0vh)"
    }, 500);
})

// retry button (win screen) functionality
UIElements.winRetryButton.addEventListener("click", () => {
    UIElements.winScreenUI.style.opacity = "0";
    UIElements.winScreenUI.style.transform = "translateY(10vh)"

    setTimeout(() => {
        UIElements.winScreenUI.style.display = "none";
        UIElements.winScreenUI.style.opacity = "1";
        UIElements.winScreenUI.style.transform = "translateY(0vh)"

        // reset all data for a retry
        initializeGame()
        updateValues()
    
        getRandomPokemon()
        UIElements.gameplayScreenUI.style.display = "block";
    }, 500);
})

// menu button (win screen) functionality
UIElements.winMenuButton.addEventListener("click", () => {
    UIElements.winScreenUI.style.opacity = "0";
    UIElements.winScreenUI.style.transform = "translateY(10vh)"

    setTimeout(() => {
        UIElements.winScreenUI.style.display = "none";
        UIElements.winScreenUI.style.opacity = "1";
        UIElements.winScreenUI.style.transform = "translateY(0vh)"

        UIElements.introScreenUI.style.display = "flex";
        UIElements.introScreenUI.style.opacity = '1';
        UIElements.introScreenUI.style.transform = "translateY(0vh)";
    }, 500);
})