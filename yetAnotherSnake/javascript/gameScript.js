// IMPORTS
import { updateLoop as updateSnake, render as renderSnake, snakeSpeed, getSnakeHead, snakeIntersection, setSpeedValue, SnakeInitial } from "./snake.js";
import { updateLoop as updateFood, render as renderFood, score, resetScore } from "./food.js";
import { outsideGrid } from "./grid.js";
import { resetInputDirection } from "./input.js"

// VARIABLES
let lastRenderTime = 0;
let gameOver = false;
let victory = false;
let isEndless = false;
let lastAdjustedScore = 0;
let modePicked = "";

// A bunch of constant values, mostly from the html file
const mainScreen = document.getElementsByClassName("main_screen")[0];
const gameTitle = document.getElementsByClassName("title_game")[0];
const subTitle = document.getElementsByClassName("subtitle_game")[0];
const allMenuButtons = document.querySelectorAll('.menu_button_section button');
const startButton = document.getElementsByClassName('start')[0];
const aboutButton = document.getElementsByClassName('about')[0];
const creditButton = document.getElementsByClassName('credit')[0];
const quitButton = document.getElementsByClassName('quit')[0];
const backButton = document.getElementsByClassName("back")[0];

const startScreen = document.getElementsByClassName("start_screen")[0];
const modeName = document.getElementsByClassName("mode_name")[0];

const aboutScreen = document.getElementsByClassName("about_screen")[0];
const aboutBackButton = document.getElementsByClassName("about_back")[0];

const creditScreen = document.getElementsByClassName("credit_screen")[0];
const creditBackButton = document.getElementsByClassName("credit_back")[0];

const loadingScreen = document.getElementsByClassName("loading_screen")[0];
const loadingText = document.getElementsByClassName("loading_text")[0];

const gameDisplay = document.getElementById('gameDisplay');
const scoreText = document.getElementsByClassName("score")[0];
const speedValue = document.getElementsByClassName("current_speed")[0];

const gameOverScreenMode = document.getElementsByClassName("game_over_screen")[0];
const progressText = document.getElementsByClassName("progress")[0];
const gameOverButton = document.querySelectorAll("#game_over_buttons")
const retryButton = document.getElementsByClassName("retry")[0]
const menuButton = document.getElementsByClassName("back_menu")[0];

const winScreen = document.getElementsByClassName("win_screen")[0];
const winText = document.getElementsByClassName("win_text")[0];
const winRetryButton = document.getElementsByClassName("win_retry")[0]
const winMenuButton = document.getElementsByClassName("win_back_menu")[0];

const quitScreen = document.getElementsByClassName('quit_screen')[0];
const finalText = document.getElementsByClassName('final_text')[0];

// dictionaries
const difficultyDictionary = {
    "Easy": 10,
    "Hard": 15,
    "Insane": 20,
    "Endless": 10,
};

const modeStyleDictionary = {
    "EZY": "rgba(217,217,99,1)",
    "HRD": "rgb(62, 208, 184)",
    "INS": "rgb(208, 62, 62)",
    "EDL": "rgb(208, 62, 191)",
};

const winRequirementsDictionary = {
    "Easy": 10,
    "Hard": 20,
    "Insane": 30,
}

const symbolList = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', ':', '\'', '"', ',', '<', '.', '>', '/', '\\', '|', '`', '~', '?'];

// FUNCTIONS
// endless mode, every 5 scores increase by 1
function endlessMode(currentTime) {
    if (gameOver) {
        return [
            canvasShake(0),
            gameOverEvent()
        ];
    }

    window.requestAnimationFrame(endlessMode);

    // Check if the score is a multiple of 5
    if (score % 5 === 0 && score > 0 && score !== lastAdjustedScore) {
        setSpeedValue(snakeSpeed + 1);
        speedValue.innerHTML = "snakeSpeed  =  " + snakeSpeed;

        // Update the lastAdjustedScore so it doesn't go insane for the next frame
        // think of it like a flagged system, but instead of boolean we use score/numbers
        lastAdjustedScore = score;
    }

    // render stuff, from youtube tutorial
    const secondSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondSinceLastRender < 1 / snakeSpeed) return;

    lastRenderTime = currentTime;

    updateLoop();
    render();
}

// main loop, only for EASY, HARD, INSANE
function main(currentTime) {
    if (gameOver) {
        return [
            canvasShake(0),
            gameOverEvent()
        ];
    }

    if (victory) {
        return[
            winEvent()
        ]
    }

    window.requestAnimationFrame(main);
    const secondSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondSinceLastRender < 1 / snakeSpeed) return;

    lastRenderTime = currentTime;

    updateLoop();
    render();
}

// for shaking the game board
// we have to use if else for this one because idk whats the wait() function for this one
function getRandomShake(min, max) {
    return Math.random() * (max - min) + min;
}

// camera shake somewhat
function canvasShake(times) {
    if (times < 10) {
        gameDisplay.style.transform = "translate(" + getRandomShake(-snakeSpeed/10,snakeSpeed/10) + "vh, " + getRandomShake(-snakeSpeed/10,snakeSpeed/10) + "vw)";
        console.log(gameDisplay.style.transform);

        setTimeout(function () {
            canvasShake(times + 1);
        }, 10);
    } else {
        gameDisplay.style.transform = "translate(0, 0)";
    }
}

// when you win
function winEvent(){
    speedValue.innerHTML = "100%";
    gameDisplay.style.background = "linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)";
    scoreText.style.color = "#000000";
    speedValue.style.color = "#000000";

    winScreen.style.display = 'flex';

    setTimeout(() => {
        winText.style.letterSpacing = "2vh";
    }, 1);        

    for (let i = 0; i < gameOverButton.length; i++) {
        setTimeout(function (item) {
            return function () {
                item.style.opacity = 1;
                item.style.transform = "translate(0, 0vh)";
            };
        }(gameOverButton[i]), 50 * i);
    }
}

// game over, for easy hard and insane
function gameOverEvent() {
    // change the style of the board
    gameDisplay.style.background = "radial-gradient(circle, rgb(255, 0, 0) 0%, rgb(6, 20, 25) 100%)";
    scoreText.style.color = "#000000";

    // every character from scoreText will become x
    scoreText.innerHTML = "X".repeat(scoreText.innerHTML.length);
    speedValue.style.color = "#000000";
    
    // each characters from speedValue change to random symbols according to a dictionary full of symbols
    let newSpeedValueText = "";
    for (let i = 0; i < speedValue.innerHTML.length; i++) {
        newSpeedValueText += symbolList[Math.floor(Math.random() * symbolList.length)];
    }
    speedValue.innerHTML = newSpeedValueText;

    // change the color of the snake and the food
    const snakeParts = document.getElementsByClassName("snake");
    const foodPart = document.getElementsByClassName("food")[0];
    foodPart.style.backgroundColor = "#000000";

    for (let i = 0; i < snakeParts.length; i++) {
        snakeParts[i].style.backgroundColor = "#000000";
    }

    // game over screen appears 
    gameOverScreenMode.style.display = "flex";

    // check if endless or not
    if (isEndless) {
        progressText.innerHTML = "[ "+score+" ]";
    } else {
        let rawPercent = (score/winRequirementsDictionary[modePicked])*100;
        progressText.innerHTML = rawPercent.toPrecision(2) + "%"
    }

    for (let i = 0; i < gameOverButton.length; i++) {
        setTimeout(function (item) {
            return function () {
                item.style.opacity = 1;
                item.style.transform = "translate(0, 0vh)";
            };
        }(gameOverButton[i]), 50 * i);
    }
}

// update loop
// contains updating snake, food, and checking death
function updateLoop() {
    updateSnake();
    updateFood();
    checkDeath();
    checkWin();
}

// draw thingsssssssss
function render() {
    gameDisplay.innerHTML = '';
    renderSnake(gameDisplay);
    renderFood(gameDisplay);
}

// check if the snake dies or not
function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function checkWin() {
    if (score >= winRequirementsDictionary[modePicked]) {
        victory = true;
    }
}

// preparing the game
function prepareGame() {
    loadingScreen.style.display = "inline";
    subTitle.style.transform = "translate(0, -40vh)";

    // reset loading screen
    loadingText.style.letterSpacing = "";
    modeName.style.letterSpacing = "";

    setTimeout(() => {
        loadingScreen.style.opacity = 1;
        loadingText.style.letterSpacing = "2.5vw";
        modeName.style.letterSpacing = "5vw";
    }, 1);

    setTimeout(() => {
        startScreen.style.display = "none";
        mainScreen.style.display = "none";
        backButton.style.opacity = 1;
        backButton.style.transform = "translate(-10vw, 0)";
    }, 500);

    setTimeout(() => {
        loadingScreen.style.opacity = 0;
        gameDisplay.style.display = "grid";
        scoreText.style.display = "flex";
        speedValue.style.display = "inline";

        // reset everything here
        SnakeInitial();
        resetScore();
        lastRenderTime = 0;
        gameOver = false;
        gameDisplay.innerHTML = '';
        gameDisplay.style.background = "";
        scoreText.style.color = "";
        scoreText.innerHTML = score;
        speedValue.style.color = "";
        gameOverScreenMode.style.display = "none";
        resetInputDirection();

        // if endless then play endless, else play modes
        if (isEndless) {
            window.requestAnimationFrame(endlessMode);
        } else {
            window.requestAnimationFrame(main);
        }

    }, 2500);

    // kick the loading screen outa here
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 3500);
}

// retrying the game
function retryGame() {
    loadingScreen.style.display = "inline";
    subTitle.style.transform = "translate(0, -40vh)";
    victory = false;

    // reset loading screen
    loadingScreen.style.opacity = "";
    loadingText.style.letterSpacing = "";
    modeName.style.letterSpacing = "";

    let allModes = document.querySelectorAll(".start_screen li");
    for (let i = 0; i < allModes.length; i++) {
        setTimeout(function (item) {
            return function () {
                item.style.opacity = 0;
                item.style.width = '20vw';
            };
        }(allModes[i]), 50 * i);
    }

    setTimeout(() => {
        loadingScreen.style.opacity = 1;
        loadingText.style.letterSpacing = "2.5vw";
        modeName.style.letterSpacing = "5vw";
    }, 1);

    setTimeout(() => {
        startScreen.style.display = "none";
        mainScreen.style.display = "none";
        backButton.style.opacity = 1;
        backButton.style.transform = "translate(-10vw, 0)";

        for (let i = 0; i < gameOverButton.length; i++) {
            gameOverButton[i].style.opacity = 0;
            gameOverButton[i].style.transform = "translate(0, -4vh)";
        }
        winText.style.letterSpacing = "";
    }, 500);

    setTimeout(() => {
        loadingScreen.style.opacity = 0;
        gameDisplay.style.display = "grid";
        scoreText.style.display = "flex";
        speedValue.style.display = "inline";

        // reset everything here
        SnakeInitial();
        resetScore();
        lastRenderTime = 0;
        gameOver = false;
        gameDisplay.innerHTML = '';
        gameDisplay.style.background = "";
        scoreText.style.color = "";
        scoreText.innerHTML = score;
        speedValue.style.color = "";
        if (isEndless) {
            speedValue.innerHTML = 'snakeSpeed = 10';
            setSpeedValue(difficultyDictionary[modePicked])
        } else {
            speedValue.innerHTML = "targetValue = " + winRequirementsDictionary[modePicked];
        }
        gameOverScreenMode.style.display = "none";
        winScreen.style.display = "none"
        resetInputDirection();

        // if endless then play endless, else play modes
        if (isEndless) {
            window.requestAnimationFrame(endlessMode);
        } else {
            window.requestAnimationFrame(main);
        }

    }, 500);

    // kick the loading screen outa here
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 1500);
}

// goes back to menu screen
function backToMenu() {
    loadingScreen.style.display = "inline";
    subTitle.style.transform = "translate(0, -40vh)";
    victory = false;

    // reset loading screen
    loadingText.style.letterSpacing = "";
    modeName.style.letterSpacing = "";
    modeName.innerHTML = "MENU";

    setTimeout(() => {
        loadingScreen.style.opacity = 1;
        loadingText.style.letterSpacing = "2.5vw";
        modeName.style.letterSpacing = "5vw";
    }, 1);

    setTimeout(() => {
        gameDisplay.style.display = "none";
        mainScreen.style.display = "inline";

        for (let i = 0; i < gameOverButton.length; i++) {
            gameOverButton[i].style.opacity = 0;
            gameOverButton[i].style.transform = "translate(0, -4vh)";
        }
        winText.style.letterSpacing = "";
        scoreText.style.display = "none";
        speedValue.style.display = "none";

        for (let i = 0; i < allMenuButtons.length; i++) {
            setTimeout(function (item) {
                return function () {
                    item.style.opacity = 1;
                    item.style.transform = "";
                };
            }(allMenuButtons[i]), 50 * i);
        }

        let allModes = document.querySelectorAll(".start_screen li");
        setTimeout(() => {
        for (let i = 0; i < allModes.length; i++) {
            allModes[i].remove();
        }
        startScreen.style.display = "none";
    }, 500);

    
        gameTitle.style.transform = "";
        subTitle.style.transform = "";
    
        backButton.style.opacity = 0;
        backButton.style.transform = "";
    
        startScreen.style.display = "none";

        gameOverScreenMode.style.display = "none";
        winScreen.style.display = "none"
        resetInputDirection();
    }, 500);

    setTimeout(() => {
        loadingScreen.style.opacity = 0;
    }, 1500);

    // kick the loading screen outa here
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 2000);
}

// MAIN FUNCTION
// start button function
startButton.onclick = function () {
    for (let i = 0; i < allMenuButtons.length; i++) {
        setTimeout(function (item) {
            return function () {
                item.style.opacity = 0;
                item.style.transform = "translate(0, 1vh)";
            };
        }(allMenuButtons[i]), 50 * i);
    }

    gameTitle.style.transform = "translate(0, -25vh)";
    subTitle.style.transform = "translate(0, -30vh)";

    backButton.style.opacity = 1;
    backButton.style.transform = "translate(0, 0)";

    startScreen.style.display = "flex";

    // create modes
    for (let i = 0; i < Object.keys(difficultyDictionary).length; i++) {
        let modes = document.createElement("li");
        modes.className = Object.keys(difficultyDictionary)[i];
        modes.id = 'modeButton';
        modes.innerHTML = Object.keys(difficultyDictionary)[i];
        modes.addEventListener('click', function () {
            if (modes.className !== "Endless") {
                isEndless = false;
                modePicked = modes.className;
                setSpeedValue(difficultyDictionary[modes.className]);
                speedValue.innerHTML = "targetValue  =  " + winRequirementsDictionary[modePicked];
                modeName.innerHTML = Object.keys(modeStyleDictionary)[i];
                modeName.style.color = Object.values(modeStyleDictionary)[i];
                loadingText.style.color = Object.values(modeStyleDictionary)[i];
                prepareGame();
            } else {
                setSpeedValue(difficultyDictionary[modes.className]);
                isEndless = true;
                speedValue.innerHTML = "snakeSpeed  =  " + snakeSpeed;
                modeName.innerHTML = Object.keys(modeStyleDictionary)[i];
                modeName.style.color = Object.values(modeStyleDictionary)[i];
                modePicked = modes.className;
                loadingText.style.color = Object.values(modeStyleDictionary)[i];
                prepareGame();
            }
        });

        startScreen.appendChild(modes);

        // stagger effect taken from my portfolio reflection menu
        setTimeout(function (item) {
            return function () {
                item.style.transition = "all 0.75s cubic-bezier(0.230, 1.000, 0.320, 1.000)";
                item.style.opacity = 1;
                item.style.width = Math.random() * (60 - 50) + 50 + "%";
            };
        }(modes), 50 * i);
    }
};

backButton.onclick = function () {
    let allModes = document.querySelectorAll(".start_screen li");

    backButton.style.opacity = 1;
    backButton.style.transform = "translate(-10vw, 0)";
    gameTitle.style.transform = "translate(0, 0vh)";
    subTitle.style.transform = "translate(0, -7.5vh)";

    for (let i = 0; i < allModes.length; i++) {
        setTimeout(function (item) {
            return function () {
                item.style.opacity = 0;
                item.style.width = '20vw';
            };
        }(allModes[i]), 50 * i);
    }

    for (let i = 0; i < allMenuButtons.length; i++) {
        setTimeout(function (item) {
            return function () {
                item.style.opacity = 1;
                item.style.transform = "translate(0, 0vh)";
            };
        }(allMenuButtons[i]), 50 * i);
    }

    setTimeout(() => {
        for (let i = 0; i < allModes.length; i++) {
            allModes[i].remove();
        }
        startScreen.style.display = "none";
    }, 500);
};

retryButton.onclick = function () {
    retryGame();
    setTimeout(() => {
        const foodPart = document.getElementsByClassName("food")[0];
        foodPart.style.backgroundColor = "";
        
        const snakeParts = document.getElementsByClassName("snake");
        for (let i = 0; i < snakeParts.length; i++) {
            snakeParts[i].style.backgroundColor = "";
        }
    }, 1500);
}

winRetryButton.onclick = function () {
    retryGame();
}

menuButton.onclick = function () {
    backToMenu();
}

winMenuButton.onclick = function() {
    backToMenu();
}

creditButton.onclick = function () {
    creditScreen.style.display = "flex";
    setTimeout(() => {
        creditScreen.style.opacity = 1;
    }, 1);
};

creditBackButton.onclick = function() {
    creditScreen.style.opacity = 0;
    setTimeout(() => {
        creditScreen.style.display = "none";
    }, 500);
}

aboutButton.onclick = function () {
    aboutScreen.style.display = "flex";
    setTimeout(() => {
        aboutScreen.style.opacity = 1;
    }, 1);
};

aboutBackButton.onclick = function () {
    aboutScreen.style.opacity = 0;
    setTimeout(() => {
        aboutScreen.style.display = "none";
    }, 500);
}

quitButton.onclick = function() {
    quitScreen.style.display = "flex";
    setTimeout(() => {
        quitScreen.style.opacity = 1;
    }, 1);

    setTimeout(() => {
        finalText.style.opacity = 1;
        mainScreen.style.display = "none";
    }, 4000);
}


