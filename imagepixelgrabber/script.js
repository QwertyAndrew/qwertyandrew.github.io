// VARIABLES
let imageDataValue = null;
let originalImageData = null;
let cropMode = 'center';
let lastImage = null;

let chanceInput = document.getElementById('chanceValue');
let randomValue = 0.35

const screenA = document.getElementsByClassName('screenA')[0];
const screenB = document.getElementsByClassName('screenB')[0];
const centerCrop = document.getElementById('CenterCrop');
const noCrop = document.getElementById('NoCrop');
const RowSort = document.getElementById('RowSort');
const ColumnSort = document.getElementById('ColumnSort');

// SUB FUNCTIONS
function updateRandomValue() {
    randomValue = parseInt(chanceInput.value) / 100;
}

function cropAndResizeImage(img, width, height) {
    // Clear image data first just in case :/
    imageDataValue = null;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // Disable image smoothing for nearest-neighbor resampling
    ctx.imageSmoothingEnabled = false;

    if (cropMode === 'center') {
        // Center crop
        const cropSize = Math.min(img.width, img.height);
        const cropX = (img.width - cropSize) / 2;
        const cropY = (img.height - cropSize) / 2;

        // Draw the cropped and resized image
        ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, width, height);
    } else {
        // No crop
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
    }

    // Store the image data
    imageDataValue = ctx.getImageData(0, 0, canvas.width, canvas.height);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Store the original image data
}

function handleFileSelect(event) {
    let file;
    file = event.target.files[0];
    
    if (file && file.type.match('image.*')) {
        screenA.style.display = "none";
        screenB.style.display = "flex";

        // Read the file
        const reader = new FileReader();

        // When done reading, load the function
        reader.onload = function(e) {
            // Create the image 
            const img = new Image();
            lastImage = img;
            img.src = e.target.result;
            img.onload = function() {
                cropAndResizeImage(img, 1920, 1920);
            }
        };
        reader.readAsDataURL(file);
    }
}

function exportPixelData() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const data = imageData.data;
    let pixels = '[';
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        pixels += `[${r}, ${g}, ${b}, ${a}], `;
    }
      // Remove the last comma and space then close the array
    pixels = pixels.slice(0, -2) + ']';

    const blob = new Blob([pixels], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'pixelData.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function sortPixelsByRows(imageData, sortChance = 1.0) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sortedData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        // Extract row pixels
        let rowPixels = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            rowPixels.push({ r, g, b, a });
        }

        // Sort row pixels by brightness
        rowPixels.sort((a, b) => {
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

function sortPixelsByColumns(imageData, sortChance = 1.0) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sortedData = new Uint8ClampedArray(data.length);

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
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.putImageData(sortedImageData, 0, 0);
}

// MAIN FUNCTION
document.getElementById('browseLink').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('browseLink2').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
document.getElementById('exportButton').addEventListener('click', exportPixelData, false);

// Add event listeners for crop buttons
centerCrop.addEventListener('click', function() {
    cropMode = 'center';
    if (lastImage) {
        cropAndResizeImage(lastImage, 1920, 1920);
    }
});

noCrop.addEventListener('click', function() {
    cropMode = 'noCrop';
    if (lastImage) {
        cropAndResizeImage(lastImage, 1920, 1920);
    }
});

RowSort.addEventListener('click', function() {
    applyPixelSort('rows');
}, false);

ColumnSort.addEventListener('click', function() {
    applyPixelSort('columns');
}, false);

chanceInput.addEventListener('input', updateRandomValue);

// The pixel sort and dynamic cropping was ChatGPT because I'm really dumb
// But the compress and export made by me (it just Python version but ported)

// FYI, try to change the 64 resolution to 1K - 4k resolution, it can be useful lol.