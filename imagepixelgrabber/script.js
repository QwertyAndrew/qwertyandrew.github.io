// Woo time to comments

// VARIABLES
let originalImageData = null;
let randomValue = 0.35
let sortedMode = null;

let chanceInput = document.getElementById('chanceValue');
const screenA = document.getElementsByClassName('screenA')[0];
const screenB = document.getElementsByClassName('screenB')[0];
const RowSort = document.getElementById('RowSort');
const ColumnSort = document.getElementById('ColumnSort');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// SUB FUNCTIONS
// This is for updating the random value thing, convert from percentage to 0 - 1
function updateRandomValue() {
    randomValue = parseInt(chanceInput.value) / 100;
}

// Render image, literally
// It doesn't save to a server, it just render again using Canvas API
function renderImage(img, width, height) {
    // Make canvas
    canvas.width = width;
    canvas.height = height;

    // True for smoother render, false for pixel-ly render
    ctx.imageSmoothingEnabled = true;

    // Render image
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

    // Store the original image data
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); 
}

// When user send an image file
function handleFileSelect(event) {
    let file;
    file = event.target.files[0];
    
    // If it is an image, go for it
    if (file && file.type.match('image.*')) {
        screenA.style.display = "none";
        screenB.style.display = "flex";

        // Read the file
        const reader = new FileReader();

        // When done reading, load the function
        reader.onload = function(e) {
            // Create the image 
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                renderImage(img, img.width, img.height);
            }
        };
        reader.readAsDataURL(file);
    }
}

// Exporting the image
function exportImage() {
    canvas.toBlob(function(blob) {
        // Turn image into a URL
        const url = URL.createObjectURL(blob);

        // Create an invisible link with the URL
        const link = document.createElement('a');
        link.href = url;

        // Naming, based on what sorted
        link.download = sortedMode + "_" + chanceInput.value + '%.png';
        document.body.appendChild(link);

        // Link clicked automatically to download
        link.click();
        document.body.removeChild(link);
    }, 'image/png');
}

// Row sorting
function sortPixelsByRows(imageData, sortChance = 1.0) {
    // Get the width height
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sortedData = new Uint8ClampedArray(data.length);
    sortedMode = "rowSorted"

    // For each row...
    for (let y = 0; y < height; y++) {
        // Make an empty array first
        let rowPixels = [];

        // For each pixels in that row...
        for (let x = 0; x < width; x++) {
            // Grab the index, and data information from the pixel
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            rowPixels.push({ r, g, b, a });
        }
        // Okay we got the original pixel array
        // Sort row pixels by brightness

        rowPixels.sort((a, b) => {
            // There is a chance that the pixel skipped the sorting progress
            if (Math.random() < sortChance) {
                // Sort row pixels by brightness
                const brightnessA = 0.3 * a.r + 0.59 * a.g + 0.11 * a.b;
                const brightnessB = 0.3 * b.r + 0.59 * b.g + 0.11 * b.b;
                return brightnessA - brightnessB;
            }
        });
        
        // Place sorted row pixels back
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const pixel = rowPixels[x];
            sortedData[index] = pixel.r;
            sortedData[index + 1] = pixel.g;
            sortedData[index + 2] = pixel.b;
            sortedData[index + 3] = pixel.a;
        }
    }

    // Return new ImageData with sorted pixels
    return new ImageData(sortedData, width, height);
}

// Column sorting, basically like row but now it is vertical
function sortPixelsByColumns(imageData, sortChance = 1.0) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sortedData = new Uint8ClampedArray(data.length);
    sortedMode = "columnSorted"

    for (let x = 0; x < width; x++) {
        // Extract column pixels
        let columnPixels = [];
        for (let y = 0; y < height; y++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            columnPixels.push({ r, g, b, a });
        }

        // Sort column pixels by brightness
        columnPixels.sort((a, b) => {
            if (Math.random() < sortChance) {
                // Sort row pixels by brightness
                const brightnessA = 0.3 * a.r + 0.59 * a.g + 0.11 * a.b;
                const brightnessB = 0.3 * b.r + 0.59 * b.g + 0.11 * b.b;
                return brightnessA - brightnessB;
            }
        });


        // Place sorted column pixels back
        for (let y = 0; y < height; y++) {
            const index = (y * width + x) * 4;
            const pixel = columnPixels[y];
            sortedData[index] = pixel.r;
            sortedData[index + 1] = pixel.g;
            sortedData[index + 2] = pixel.b;
            sortedData[index + 3] = pixel.a;
        }
    }

    // Return new ImageData with sorted pixels
    return new ImageData(sortedData, width, height);
}

// Plays when sort buttons clicked
function applyPixelSort(sortType) {
    if (!originalImageData) {
        alert('No image data available');
        return;
    }

    let sortedImageData;
    if (sortType === 'rows') {
        sortedImageData = sortPixelsByRows(originalImageData, randomValue);
    } else if (sortType === 'columns') {
        sortedImageData = sortPixelsByColumns(originalImageData, randomValue);
    }

    // Draw the sorted image data onto the canvas
    ctx.putImageData(sortedImageData, 0, 0);
}

// MAIN FUNCTION
// When browse link clicked
document.getElementById('browseLink').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

// When the second browse link clicked
document.getElementById('browseLink2').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

// When a file put in
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

// When save image button clicked
document.getElementById('exportButton').addEventListener('click', exportImage, false);

// When row/column sorts clicked
RowSort.addEventListener('click', function() {
    applyPixelSort('rows');
}, false);

ColumnSort.addEventListener('click', function() {
    applyPixelSort('columns');
}, false);

// When chance input changes
chanceInput.addEventListener('input', updateRandomValue);

// The pixel sort was made with help on ChatGPT, because I am stupid with math
// But the image importation was made by me (it is literally ported from the Python code I wrote back in 2022)