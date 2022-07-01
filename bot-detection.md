# bot-detection
This was compiled for educational purposes (to help further people in their attempts to block bots on their websites). This is not a full resource and contains only information which I have discovered. (This is seperate from CloudFlare Research)

## Chromedriver/Automated Chromium detections
- Various methods can be used to detect chromedriver & automated Chromium.

- One way I found was to search in the window elements for the infamous `$cdc_` variable found in chromedriver.
```js
Object.getOwnPropertyNames(window).find(element => {
  // Iterate through properties
  if (element.includes('cdc_')) {
    console.log('Chromedriver is being used'); // Chromedriver
  }
}
```

- However, one way to get through this is to edit the binary file and replace the `cdc_` string ([Source](https://stackoverflow.com/questions/33225947/can-a-website-detect-when-you-are-using-selenium-with-chromedriver/41220267#comment84958239_41220267)). 
- Despite the attempts to prevent the detection of this variable, the string must contain three letters followed by an underscore.
```js
// Create a more verbose search for Chromium-based browsers / Chromedriver
if (!!window.chrome) {
  // Normal chromium only has 1 variable containing an _
  let underscore_counter = 0;
  // Search for _'s
  Object.getOwnPropertyNames(window).find(element => {
    if (element.includes('_')) {
      underscore_counter++;
    }
 });
 if (underscore_counter > 1) {
    console.log('Chromedriver has been modified and is being used');
 }
}
```

- The most basic detection method which should not be relied upon.
```js
if (navigator.webdriver) {
  console.log('Bot Detected')
}
```
