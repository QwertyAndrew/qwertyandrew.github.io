# Image Pixel Sorter

A small, web-based tool for row/column pixel sorting images based on a lot of things.

## Installation

There's no need to install anything, as it is web-based and vanilla codes. However if you want to get this repository, you can either cloned it or download it as a ZIP file.

## Usage

```javascript
updateRandomValue()
// Returns an updated random value after the percentage changes

renderImage(img, width, height)
// Renders the image, using img value, the width value from the img, and the height

handleFileSelect(event)
// Check and shows the image when user send an image file

getSortingValue(pixel, mode, enableLogging = false)
// While sorting, this function checks which mode is it to return a specific value
// pixel is the chosen pixel while sort, mode is the chosen sort mode, enableLogging is for debug

applyPixelSort(sortType)
// When row/column sort button pressed, start sorting first and then apply the result
```

## Contributing

Feel free to pull changes and play around!

If you want to add major changes, open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)