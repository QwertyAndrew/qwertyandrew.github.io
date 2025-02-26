// Woo time to comments

// VARIABLES
let originalImageData = null;
let randomValue = 0.35
let rowOrColumn = null;
let sortingMode = 'hue';

let chanceInput = document.getElementById('chanceValue');
const screenA = document.getElementsByClassName('screenA')[0];
const screenB = document.getElementsByClassName('screenB')[0];
const screenC = document.getElementsByClassName("screenC")[0];
const screenCText = document.getElementsByClassName("warningText")[0];

// Much useful and clean
const modeButtons = {
    'hue': document.getElementById('HueMode'),
    'saturation': document.getElementById('SatMode'),
    'lightness': document.getElementById('LightMode'),
    'red': document.getElementById('RedMode'),
    'green': document.getElementById('GreenMode'),
    'blue': document.getElementById('BlueMode'),
    'intensity': document.getElementById('IntenseMode'),
    'value': document.getElementById('ValueMode'),
    'luminance': document.getElementById('LuminanceMode'),
    'distanceFromBlack': document.getElementById('DistanceFromBlackMode'),
    'redGreenDifference': document.getElementById('RedGreenDiffMode'),
    'blueRedDifference': document.getElementById('BlueRedDiffMode'),
    'colorfulness': document.getElementById('ColorfulnessMode'),
    'random': document.getElementById('RandomMode'),
};

let previousMode = modeButtons['hue'];

const RowSort = document.getElementById('RowSort');
const ColumnSort = document.getElementById('ColumnSort');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// SUB FUNCTIONS
// This is for updating the random value thing, convert from percentage to 0 - 1
function updateRandomValue() {
    randomValue = parseInt(chanceInput.value) / 100;
}

// Function to update the selected mode button
function updateModeSelection(newMode) {
    if (previousMode) {
        previousMode.classList.remove("modeSelected");
    }
    newMode.classList.add("modeSelected");
    previousMode = newMode;
}

// Basic show/hide screen c function
function showScreenC(text) {
    screenC.classList.add('showScreenC');
    screenCText.classList.add("showScreenCText");
    screenCText.innerHTML = text;
}

function hideScreenC() {
    screenC.classList.remove('showScreenC');
    screenCText.classList.remove("showScreenCText");
}

// RGB to HSL
// Source: https://gist.github.com/mjackson/5311256
// And of course ChatGPT because this is so math-y
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        // It's achromatic
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, l];
}

// RGB to HSV
// no clue about this one so i googled up
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h, s, v = max;

    if (max === 0) {
        s = 0;
    } else {
        s = delta / max;
    }

    if (delta === 0) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
            case g: h = (b - r) / delta + 2; break;
            case b: h = (r - g) / delta + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
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

    if (file && file.type.match('image.*')) {
        showScreenC("Adding image...")

        setTimeout(() => {
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
                        hideScreenC()
                    }
                };
                reader.readAsDataURL(file);
            }
        }, 100);
    }
}

// Exporting the image
function exportImage() {
    showScreenC("Exporting...");

    canvas.toBlob(function(blob) {
        // Turn image into a URL
        const url = URL.createObjectURL(blob);

        // Create an invisible link with the URL
        const link = document.createElement('a');
        link.href = url;

        // Naming, based on what sorted
        link.download = rowOrColumn + "_" + sortingMode + "_" + chanceInput.value + '%.png';
        document.body.appendChild(link);

        // Link clicked automatically to download
        link.click();
        document.body.removeChild(link);
        hideScreenC();
    }, 'image/png');
}

function getSortingValue(pixel, mode, enableLogging = false) {
    const [h, s, l] = rgbToHsl(pixel.r, pixel.g, pixel.b);
    if (enableLogging) {
        console.log(mode);
    }

    switch (mode) {
        case 'hue': 
            return h;
        case 'saturation': 
            return s;
        case 'lightness': 
            return l;
        case 'red': 
            return pixel.r;
        case 'green': 
            return pixel.g;
        case 'blue': 
            return pixel.b;
        case 'intensity': 
            return pixel.r + pixel.g + pixel.b;
        case 'value': 
            return rgbToHsv(pixel.r, pixel.g, pixel.b)[2];
        case 'luminance': 
            return 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b;
        case 'distanceFromBlack': 
            return Math.sqrt(pixel.r * pixel.r + pixel.g * pixel.g + pixel.b * pixel.b);
        case 'redGreenDifference': 
            return pixel.r - pixel.g;
        case 'blueRedDifference': 
            return pixel.b - pixel.r;
        case 'colorfulness': {
            const mean = (pixel.r + pixel.g + pixel.b) / 3;
            return Math.sqrt(
                (pixel.r - mean) * (pixel.r - mean) +
                (pixel.g - mean) * (pixel.g - mean) +
                (pixel.b - mean) * (pixel.b - mean)
            );
        }
        case 'random': 
            return Math.random();
        default: 
            return h;
    }
}


function sortPixelsByRows(imageData, sortChance = 1.0, mode) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sortedData = new Uint8ClampedArray(data.length);
    rowOrColumn = "row";

    for (let y = 0; y < height; y++) {
        let rowPixels = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            rowPixels.push({ r, g, b, a });
        }

        rowPixels.sort((a, b) => {
            if (Math.random() < sortChance) {
                return getSortingValue(a, mode) - getSortingValue(b, mode);
            }
            return 0;
        });
        

        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const pixel = rowPixels[x];
            sortedData[index] = pixel.r;
            sortedData[index + 1] = pixel.g;
            sortedData[index + 2] = pixel.b;
            sortedData[index + 3] = pixel.a;
        }
    }

    return new ImageData(sortedData, width, height);
}

function sortPixelsByColumns(imageData, sortChance = 1.0, mode) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const sortedData = new Uint8ClampedArray(data.length);
    rowOrColumn = "column";

    for (let x = 0; x < width; x++) {
        let columnPixels = [];
        for (let y = 0; y < height; y++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            columnPixels.push({ r, g, b, a });
        }

        columnPixels.sort((a, b) => {
            if (Math.random() < sortChance) {
                return getSortingValue(a, mode) - getSortingValue(b, mode);
            }
            return 0;
        });

        for (let y = 0; y < height; y++) {
            const index = (y * width + x) * 4;
            const pixel = columnPixels[y];
            sortedData[index] = pixel.r;
            sortedData[index + 1] = pixel.g;
            sortedData[index + 2] = pixel.b;
            sortedData[index + 3] = pixel.a;
        }
    }

    return new ImageData(sortedData, width, height);
}

function applyPixelSort(sortType) {
    if (!originalImageData) {
        alert('No image data available');
        return;
    }

    showScreenC(`Processing ${sortingMode} sort...`);

    setTimeout(function() {
        let sortedImageData;
        if (sortType === 'rows') {
            sortedImageData = sortPixelsByRows(originalImageData, randomValue, sortingMode);
        } else if (sortType === 'columns') {
            sortedImageData = sortPixelsByColumns(originalImageData, randomValue, sortingMode);
        }

        ctx.putImageData(sortedImageData, 0, 0);
        hideScreenC();
    }, 100);
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

// Event listeners for sorting mode buttons
for (const [mode, button] of Object.entries(modeButtons)) {
    button.addEventListener('click', () => {
        updateModeSelection(button);
        sortingMode = mode;
    });
}

// The pixel sort was made with help on ChatGPT, because I am stupid with math
// But the image importation was made by me (it is literally ported from the Python code I wrote back in 2022)