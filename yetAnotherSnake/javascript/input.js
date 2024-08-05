// Variables here
let inputDirection = { x: 0, y: 0}
let lastInputDirection = { x: 0, y: 0}
let inputArray = [];

export let isGamePaused = true;

// functions stuff here

// reset everything function
export function resetInputDirection() {
    lastInputDirection = { x: 0, y: 0 };
    inputArray = [];
}

// get the direction input function
export function getDirectionInput() {
    if (!isGamePaused && inputArray.length > 0) {
        console.log(inputArray);
        inputDirection = inputArray[0];
        lastInputDirection = inputDirection;
        inputArray.shift();
    }

    return inputDirection;
}


// stop game
export function pauseGame() {
    isGamePaused = true;
}

// game continue
export function resumeGame() {
    isGamePaused = false;
}

// Main event stuff here
window.addEventListener('keydown', e => {
    // check if its arrow keys
    if (e.key.startsWith('Arrow')) {
        resumeGame();
        if (inputArray.length === 0) {
            // maybe fixed the input buffering?
            switch (e.key) {
                case 'ArrowUp':
                    if (lastInputDirection.x !== 0) break
                    inputArray.push({ x: -1, y: 0})
                    break
                case 'ArrowDown':
                    if (lastInputDirection.x !== 0) break
                    inputArray.push({ x: 1, y: 0})
                    break
                case 'ArrowLeft':
                    if (lastInputDirection.y !== 0) break
                    inputArray.push({ x: 0, y: -1})
                    break
                case 'ArrowRight':
                    if (lastInputDirection.y !== 0) break
                    inputArray.push({ x: 0, y: 1})
                    break
                }
            }
        }
    })
