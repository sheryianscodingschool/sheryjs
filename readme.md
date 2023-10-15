# Shery.js - Add Life to Your Web Experience

![Shery.js Logo](https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/media/banner.png)

Shery.js is a fantastic JavaScript library designed to make your web projects pop with eye-catching effects and mesmerizing 3D features. Whether you're a developer looking to jazz up your website or a designer wanting to add that extra flair, Shery.js has got you covered. This GitHub readme will walk you through the key aspects of using Shery.js in your web development journey.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
   - Required Libraries
4. [Cool Effects](#cool-effects)
   - Mouse Follower
   - Image Masker / Mask Zoomer
   - Make Magnet
   - Text Animate
   - Hover With Media Circle
5. [3D Image Effects](#3d-image-effects)
   - Simple Liquid Distortion Effect
   - Dynamic Distortion Effect
   - Dynamic 3D Wave/Wobble Effect
   - Dynamic 3D Wind Effect
   - Dynamic Perlin Noise Effect
   - Dynamin Cyber Squares Effect
6. [Dynamic Gooey Effect](#dynamic-gooey-effect)
7. [Dynamic Zoom Effect](#dynamic-zoom-effect)
8. [Multiple Image (Scroll Effect)](#multiple-image-scroll-effect)
   - Custom Scroll Trigger Callback
9. [Debug Usage](#debug-usage)
   - Preset Usage
10. [Callback Usage](#callback-usage)
11. [Examples](#examples)
12. [Contributing](#contributing)
13. [License](#license)

## Introduction

Shery.js is designed to make it easy for developers to incorporate cool visual effects into their web applications without the need for complex and time-consuming coding. The library leverages the power of Three.js to create stunning 3D effects and animations, and also provides simpler 2D effects for added versatility.

## Installation

To use Shery.js in your project, you can include it in your HTML file via a CDN or import it in js by using node.

When using node or browserify install

```bash
npm install sheryjs
```

and require

```javascript
import Shery from "sheryjs";
```

To understand clearly see this [Example](/examples/nodeExample/).

Alternatively use the standalone version found in ./dist locally

```html
<link rel="stylesheet" href="Shery.css" />
```

```html
<script type="text/javascript" src="Shery.js"></script>
```

 or use CDN version any one **only** `CSS`.

```html
<link rel="stylesheet" href="https://unpkg.com/sheryjs/dist/Shery.css" />
```

**OR**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/dist/Shery.css" />
```

**OR**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sheryjs/dist/Shery.css" />
```

---

Use **only** one `JAVASCRIP CDN`

```html
<script  type="text/javascript"  src="https://unpkg.com/sheryjs/dist/Shery.js"></script>
```

**OR**

```html
<script  type="text/javascript"  src="https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/dist/Shery.js"></script>
```

**OR**

```html
<script  type="text/javascript"  src="https://cdn.jsdelivr.net/npm/sheryjs/dist/Shery.js"></script>
```

## Getting Started

Once you have included Shery.js in your project, you can start using its effects and Three.js functionalities. The library provides a straightforward API to make implementation easier.

```javascript
// Example code to initialize Shery.js and use a cool effect.

import Shery from "sheryjs"; /*Don't use if using CDN*/

Shery.mouseFollower();
```

### Required Libraries

To successfully run with CDN, you'll need some libraries.

```html
<!--  Gsap is needed for Basic Effects -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- Scroll Trigger is needed for Scroll Effects -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<!-- Three.js is needed for 3d Effects -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.155.0/three.min.js"></script>

<!-- ControlKit is needed for Debug Panel -->
<script src="https://cdn.jsdelivr.net/gh/automat/controlkit.js@master/bin/controlKit.min.js"></script>
```

## Cool Effects

These are effects are implemented with the help of Gsap and Css to offer a unique experience with single function.

### Mouse Follower

The feature creates smooth mouse follower, creating an engaging user experience.

```javascript
Shery.mouseFollower({
  //Parameters are optional.
  skew: true,
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 1,
});
```

### Mask Zoomer

The mask zoomer effect enables zooming into an image on mouse hover with a smooth mask transition, directing the user's focus to the targeted content.

```javascript
Shery.imageMasker(".mask-target" /* Element to target.*/, {
  //Parameters are optional.
  mouseFollower: true,
  text: "Shery",
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 1,
});
```

### Make Magnet

The magnet mouse attractor effect draws elements towards the cursor, as if they are magnetically attracted, offering a unique and interactive experience.

```javascript
Shery.makeMagnet(".magnet-target" /* Element to target.*/, {
  //Parameters are optional.
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 1,
});
```

### Text Animate

The text animate effect animates text with cool animation , with many preset animation, offering a unique experience.

```javascript
Shery.textAnimate(".text-target" /* Element to target.*/, {
  //Parameters are optional.
  style: 1,
  y: 10,
  delay: 0.1,
  duration: 2,
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  multiplier: 0.1,
});
```

### Hover With Media Circle

The hover with media circle effect creates a circular media element (image or video) which follows the cursor's movement when hovering over specified elements with blending effect. This effect provides an engaging way to showcase media content associated with the hovered elements.

```javascript
Shery.hoverWithMediaCircle(".hover-target" /* Element to target.*/, {
  images: ["image1.jpg", "image2.jpg", "image3.jpg"] /*OR*/,
  //videos: ["video1.mp4", "video2.mp4"],
});
```

## 3D Image Effects

These are effects are implemented with the help of Three.js to offer a unique experience with single function.

```html
<img class="img" src="example.img" />//Must provide a class to image.
```

```javascript
Shery.imageEffect(".img", {
  style: 2, //Select Style
  debug: true, // Debug Panel
  config: {
    /* Config made from debug panel */
  },
  preset: "./presets/wigglewobble.json",
});
```

### Simple Liquid Distortion Effect

![Simple Liquid Distortion Effect](./media/effect1.gif)

The simple liquid distortion effect applies a mesmerizing distortion effect to image, giving the illusion of a liquid-like behavior.

```javascript
Shery.imageEffect(".img", {
  style: 1 /*OR 5 for different variant */,
  debug: true,
});
```

### Dynamic Distortion Effect

![Dynamic Distortion Effect](./media/effect2.gif)

The dynamic distortion effect creates a more advanced and reactive distortion animation, providing an engaging visual experience with a debug panel.

```javascript
Shery.imageEffect(".img", {
  style: 2,
  debug: true,
});
```

### Dynamic 3D Wave/Wobble Effect

![Dynamic 3D Wave/Wobble Effect](./media/effect3.gif)

Bring your web application to life with the dynamic 3D wave/wobble effect, making elements appear to ripple like waves or wobble like gelatin.

```javascript
Shery.imageEffect(".img", {
  style: 3,
  debug: true,
});
```

### Dynamic 3D Wind Effect

![Dynamic 3D Wind Effect](./media/effect4.gif)

The dynamic 3D wind effect adds a subtle and natural swaying motion to elements, simulating the movement caused by wind.

```javascript
Shery.imageEffect(".img", {
  style: 4,
  debug: true,
});
```

### Dynamic Perlin Noise Effect

![Dynamic Perlin Noise Effect](./media/effect6.gif)

The dynamic perlin noise effect adds a perlin noise to your image, can be used to create many type of noise related effects.

```javascript
Shery.imageEffect(".img", {
  style: 6,
  debug: true,
});
```

### Dynamic Cyber Squares Effect

![Dynamic Cyber Squares Effect](./media/effect7.gif)

The dynamic cyber square effect adds a Cyber retro square patterns to your image, can be used to create many type of different square partern effects.

```javascript
Shery.imageEffect(".img", {
  style: 6,
  debug: true,
});
```

## Multiple Image Scroll Effect

![Multi](https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/media/multi.gif)

All 3D effects in this library supports multi image with wave scroll effect which increases the productivity and usability of effect, offering a unique and interactive experience.

To use this you just need to give a div with images you want.

```html
<div class="images">
  <img src="image1" />
  <img src="image2" />
  <img src="image3" />
</div>
```

```javascript
Shery.imageEffect(".images", {
  style: 3,
  /*optional parameters
  these parameter dose not applies to custom scroll trigger callback */
  scrollSnapping: true,
  scrollSpeed: 6,
  touchSpeed: 6,
  damping: 7,
});
```

### Custom Scroll Trigger Callback

To implement the GSAP ScrollTrigger or any other scroll library, as well as vanilla JavaScript and to achieve them full potential of Multiple Image Scroll Effect, you can define your custom scroll behavior using the callback parameter `slideStyle` within the **Multiple Image Scroll Effect**.

To define your specific scroll behavior, utilize the `slideStyle` callback in the following manner: `slideStyle: (setScroll) => {}`. This empowers you to establish your own scrolling conditions using the `setScroll()` function within the callback. To successfully implement this approach, adhere to the following steps:

1. Enable the `slideStyle` option for your chosen visual style effect.
2. Invoke the callback, passing in the `setScroll` parameter.
3. Within the callback function, you can dynamically update the scroll position, ranging from 0 to the position of the last image.
4. Employ a scroll event listener within this context to keep track of changes in the scrolling behavior. You can select any suitable method, such as GSAP or other libraries.
5. Inside the event listener, utilize the `setScroll` function and provide the parameter `window.scrollY / innerHeight` to obtain the current scroll position relative to the window height. You can customize this calculation as needed, possibly integrating the progress from GSAP or similar methods.
6. By following these steps, you will successfully implement your own personalized scroll-triggering mechanism.

```html
<!-- Here is the code snippet demonstrating this process: -->

<div class="images">
  <img src="image1" />
  <img src="image2" />
  <img src="image3" />
</div>
```

```javascript
Shery.imageEffect(".images", {
  style: 5,
  slideStyle: (setScroll) => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY / innerHeight); //Updating the scroll
    });
  },
});
```

By adhering to these instructions, you can create and control your unique scroll-triggered effects in the **Multiple Image Scroll Effect** using the specified callback mechanism.

## Dynamic Gooey Effect

![Gooey](https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/media/gooey.gif)

This is very dynamic gooey effect can be applied to any of the above effect with a single param `gooey:true` and can be tweaked in debug mode.

```html
<div class="images">
  <img src="front_image" />
  <img src="gooey_image" />
</div>
```

```javascript
Shery.imageEffect(".images", {
  style: 6,
  debug: true,
  gooey: true,
});
```

## Dynamic Zoom Effect

![Zoomer](https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/media/zoomer.gif)

This is very dynamic zoom effect can be applied to any of the above effect with a single tick in debug panel `image zoomer` and can be tweaked in debug mode.

```javascript
Shery.imageEffect(".image", {
  style: 6,
  debug: true,
});
```

## Debug Usage

![Debug](https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/media/debug.png)

To customize any of the 3d effects provided by Shery.js, simply enable debug mode with parameter `{debug:true}` for effects which supports it.

To save/use the tweak from your debug you need to click on `SAVE TO CLIPBOARD` and the paste that config in config parameter.

```html
<img class="img" src="example.img" />
```

```javascript
Shery.imageEffect(".img", {
  style: 3,
  debug: true,
  config: {
    uFrequencyX: { value: 100, range: [0, 100] },
    uFrequencyY: { value: 44.86, range: [0, 100] },
    uFrequencyZ: { value: 100, range: [0, 100] },
    uTime: { value: 37.14299999999965 },
  },
});
```

### Preset Usage

Create your own preset or use someone elses with the help of preset option `{preset:'./presets/wigglewobble.json'}` you can create your own preset with the help of debug panel like :-

1. Enable [debug panel](#debug-usage) for your chosen style effect.
2. Do your customization's in debug panel.
3. Now click on **SAVE TO CLIPBOARD** button in debug panel.
4. Now create an new **_.json_** file.
5. Paste the copied config there.
6. And you created a new preset you can use it later or share it and help community.

```javascript
Shery.imageEffect("img", {
  style: 2,
  preset: "./presets/wigglewobble.json",
});
```

### Callback Usage

Create your own animation or condition for change values of `uniforms` which are variable which you change from debug panel you can use this by option `setUniforms: (uniforms) => {}` you can console log the uniforms to get list of uniforms.

```javascript
Shery.imageEffect('img', {
    style: 2,
    setUniforms: (uniforms) => {
       uniforms.maskVal.value = 3 // Syntax -> uniforms.uniform_name.value = your
    }
})
```

## Examples

For detailed usage examples and demos of each effect, check out the [examples](/examples/) directory in the Shery.js repository.

## Meet the Visionaries Behind Shery.js 🌟

In the heart of the dynamic world of web development, the creators of Shery.js are making waves with their unique visions and unwavering determination.

### 🚀 Harsh Vandana Sharma - [@asynchronousJavascriptor](https://github.com/asynchronousJavascriptor)

![Harsh Sharma](https://media.licdn.com/dms/image/C4E03AQFS_A05xqS99w/profile-displayphoto-shrink_800_800/0/1627712637084?e=1698278400&v=beta&t=I0GoS7x-ZeImxYIOlNQHnnDVO9pmrOxJyVysA4z6QgE)

A Tech Enthusiast and full-time learner, Harsh Sharma is not just a developer but a trailblazer with a mission. Hailing from the city of Bhopal, he's the visionary behind the awe-inspiring startup, **Sheryians Coding School**. With Sheryians, Harsh is defying conventions and making the impossible possible. He's on a quest to empower non-graduates to achieve their dreams by helping them secure tech jobs in the most remarkable way.

Connect with him: [Harsh&#39;s Linkedin Profile](https://www.linkedin.com/in/harsh-sharma-924629147/)
Step into his world: [Harsh&#39;s GitHub Profile](https://github.com/asynchronousJavascriptor)

### 🎮 Aayush Chouhan - [@aayushchouhan24](https://github.com/aayushchouhan24)

![Aayush Chouhan](https://media.licdn.com/dms/image/D4D03AQErH7fb8TgbXg/profile-displayphoto-shrink_800_800/0/1692557398040?e=1698278400&v=beta&t=hsQCaNR7LeeHRywyrpDfs1HsUj0XLHF8l1pWXDmFD5g)

A lover of technology, computers, and the thrill of gaming, Aayush Chouhan is a true explorer in the realm of cyberspace. From his early days in game penetration testing to becoming a multifaceted developer, Aayush has always been drawn to the frontier of innovation. Starting with his foray into freelancing, he's honed his skills in programming languages and ventured into the intricate worlds of Web and Android development. His journey took an exciting turn as he embraced Three.js, diving into the captivating world of 3D graphics.

Connect with him: [Aayush&#39;s Linkedin Profile](https://www.linkedin.com/in/aayushchouhan24/)
Dive into his journey: [Aayush&#39;s GitHub Profile](https://github.com/aayushchouhan24)

## Contributing

We welcome contributions from the community to enhance and expand [Shery.js](https://github.com/your-repo-link). If you encounter bugs, have feature suggestions, or want to contribute code, please check out our [contribution guidelines](contribution.md) for more information.

## License

Shery.js is released under the [MIT License](license.md). Feel free to use it in both personal and commercial projects.
