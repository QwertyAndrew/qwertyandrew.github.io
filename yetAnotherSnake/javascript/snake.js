// import stuff here
import { getDirectionInput, pauseGame, isGamePaused } from "./input.js";

// idk how to change export snake speed so i found this solution
// https://stackoverflow.com/questions/48168601/change-the-value-of-imported-variable-in-es6
let snakeSpeed = 5;

// Functions heree
// set speed of the snake depends on difficulty
function setSpeedValue(speedValue) {
    console.log("Snake speed:", speedValue);
    return (snakeSpeed = speedValue);
}

export { snakeSpeed, setSpeedValue };

// list of snake body
let snakeBody = [];

export function SnakeInitial() {
    snakeBody.length = 1;
    snakeBody = [{ x: 21, y: 21 }];
    newSegment = 0;
    pauseGame();
}

// for expansion, but also remember to set to 0 so it doesn't explode
let newSegment = 0;

// update snake position, with direction input
export function updateLoop() {
    if (!isGamePaused) {
        // move the body
        addSegment();
        const inputDirection = getDirectionInput();
        for (let index = snakeBody.length - 2; index >= 0; index--) {
            snakeBody[index + 1] = { ...snakeBody[index] };
        }
    
        // move the head
        snakeBody[0].x += inputDirection.x;
        snakeBody[0].y += inputDirection.y;
    }   
}

// draw snakey
export function render(gameDisplay) {
    snakeBody.forEach((segment) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.x;
        snakeElement.style.gridColumnStart = segment.y;
        snakeElement.classList.add("snake");
        gameDisplay.appendChild(snakeElement);
    });
}

// for expanding the snake when he ate some food
export function expandSnake(amount) {
    newSegment += amount;
}

// check if head is onto something, literally
export function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false;
        return equalPosition(segment, position);
    });
}

// return true if position 1 is the same as position 2
export function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

// get the head
export function getSnakeHead() {
    return snakeBody[0];
}

// using OnSnake to check if the head touches the body
export function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true });
}

// make the snake longer when eat smth
function addSegment() {
    for (let index = 0; index < newSegment; index++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    newSegment = 0;
}