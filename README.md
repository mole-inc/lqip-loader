# lqip-loader: low quality images placeholders for webpack

[![Downloads](https://badgen.net/npm/dm/@mole-inc/lqip-loader)](https://www.npmjs.com/package/@mole-inc/lqip-loader)
[![Version](https://badgen.net/npm/v/@mole-inc/lqip-loader)](https://www.npmjs.com/package/@mole-inc/lqip-loader)
[![License](https://badgen.net/npm/license/@mole-inc/lqip-loader)](https://www.npmjs.com/package/@mole-inc/lqip-loader)

## Installation

```
npm install --save-dev @mole-inc/lqip-loader
```

## Usage Example

Generating Base64 & dominant colours palette for a jpeg image imported in your JS bundle:

PS: The large image file will be emitted & only 400byte of Base64 (if set to true in the loader options) will be bundled.

webpack.config.js:
```js
{
  /**
   * OPTION A:
   * default file-loader fallback
   **/
  test: /\.jpe?g$/,
  loaders: [
    {
      loader: '@mole-inc/lqip-loader',
      options: {
        path: '/media', // your image going to be in media folder in the output dir
        name: '[name].[ext]', // you can use [hash].[ext] too if you wish,
        base64: true, // default: true, gives the base64 encoded image
        palette: true // default: false, gives the dominant colours palette
      }
    }
  ]

  /**
   * OPTION B:
   * Chained with your own url-loader or file-loader
   **/
  test: /\.(png|jpe?g)$/,
  loaders: [
    {
      loader: '@mole-inc/lqip-loader',
      options: {
        base64: true,
        palette: false
      }
    },
    {
      loader: 'url-loader',
      options: {
        limit: 8000
      }
    }
  ]
}
```

your-app-module.js:
```js
import banner from './images/banner.jpg';

console.log(banner.preSrc);
// outputs: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhY.... 

// the object will have palette property, array will be sorted from most dominant colour to the least
console.log(banner.palette) // [ '#628792', '#bed4d5', '#5d4340', '#ba454d', '#c5dce4', '#551f24' ]
 
console.log(banner.src) // that's the original image URL to load later!

```

## Important

To save memory and improve GPU performance, browsers (including Chrome started from 61.0.3163.38) will now render a 
slightly more crisp or pixelated Base64 encoded images.
<p align="center">
  <img src="https://user-images.githubusercontent.com/5052316/31105257-7986782c-a82e-11e7-972b-cabcf97f13c0.png" width="500px" />
  <br />
  Older Chrome to the left, Chrome v61 to the right.
</p>

If you want the blur to be smooth really bad, here's a fix! 
```css
img {
  filter: blur(25px);
}
```

More history about the issue can be [found here](https://bugs.chromium.org/p/chromium/issues/detail?id=771110#c3) and [here](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/6L_3ZZeuA0M).

alternatively, you can fill the container with a really cheap colour or gradient from the amazing palette we provide.

## Inspired by

- [Medium web app](https://medium.com/cucumbertown-magazine/the-beginners-guide-to-composition-in-food-photography-how-to-transform-your-food-photos-from-good-39613ab78bf2)
- [Instagram native mobile app](https://www.instagram.com/)
- [Polymer shop project](https://shop.polymer-project.org/)

## Remarkable Mentions

- Essential Image Optimization, An [eBook by Addy Osmani](https://images.guide/)

## Notes, Credits & License

This is a maintained fork of [zouhir/lqip-loader](https://github.com/zouhir/lqip-loader).  
Original [lqip-loader](https://github.com/zouhir/lqip-loader) is released under The MIT License by [Zouhir Chahoud](https://zouhir.org/).

Please see LICENSE file
