// Import stuff
import { onSnake, expandSnake } from './snake.js';
import { randomGridPosition } from './grid.js';

// variables here
let food = getRandomFoodPosition();
const expansionRate = 2;
const scoreNumber = document.getElementsByClassName("score")[0];

// same situation https://stackoverflow.com/questions/48168601/change-the-value-of-imported-variable-in-es6
let score = 0;

// functions stuff here
function updateLoop() {
    if (onSnake(food)) {
        expandSnake(expansionRate);
        food = getRandomFoodPosition();
        score += 1;
        scoreNumber.innerHTML = score;
    }
}

function resetScore() {
    score = 0;
}

export { score, updateLoop, resetScore };

export function render(gameDisplay) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.x;
    foodElement.style.gridColumnStart = food.y;
    foodElement.classList.add("food");
    gameDisplay.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}