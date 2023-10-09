import gsap from "gsap"
import * as THREE from "three"
import vertex_1 from './shaders/effect1/vertex.glsl'
import fragment_1 from './shaders/effect1/fragment.glsl'
import vertex_2 from './shaders/effect2/vertex.glsl'
import fragment_2 from './shaders/effect2/fragment.glsl'
import vertex_3 from './shaders/effect3/vertex.glsl'
import fragment_3 from './shaders/effect3/fragment.glsl'
import vertex_4 from './shaders/effect4/vertex.glsl'
import fragment_4 from './shaders/effect4/fragment.glsl'
import vertex_5 from './shaders/effect5/vertex.glsl'
import fragment_5 from './shaders/effect5/fragment.glsl'
import vertex_6 from './shaders/effect6/vertex.glsl'
import fragment_6 from './shaders/effect6/fragment.glsl'
import vertex_7 from './shaders/effect7/vertex.glsl'
import fragment_7 from './shaders/effect7/fragment.glsl'

import {
  init,
  getSize,
  fix,
  setDisplayOld,
  oldDisplay,
  lerp,
  redraw,
} from "./Utils"
import { Circ, Expo, Power1 } from "gsap/all"
import { Power2 } from "gsap/all"

// SECTION - Mouse Follower
var globalMouseFollower = null
var picchemousefollower = null

export function mouseFollower(opts = {}) {
  globalMouseFollower = document.createElement("div")
  picchemousefollower = document.createElement("div")
  globalMouseFollower.classList.add("mousefollower")
  picchemousefollower.classList.add("mousefollower")
  picchemousefollower.id = "behindmouse"
  var posx = 0
  var diff = 0
  addEventListener("mousemove", function (dets) {
    if (opts.skew) {
      diff = gsap.utils.clamp(15, 35, dets.clientX - posx)
      posx = dets.clientX
      gsap.to(".mousefollower", {
        width: diff + "px",
        ease: opts.ease || Expo.easeOut,
        duration: opts.duration || 1,
      })
    }
    // difference nikaalo
    gsap.to(".mousefollower", {
      top: dets.clientY,
      left: dets.clientX,
      duration: opts.duration || 1,
      ease: opts.ease || Expo.easeOut,
    })
  })

  addEventListener("mouseenter", function () {
    gsap.to(".mousefollower", {
      opacity: 1,
    })
  })
  addEventListener("mouseleave", function () {
    gsap.to(".mousefollower", {
      opacity: 0,
      duration: opts.duration || 1,
      ease: opts.ease || Expo.easeOut,
    })
  })
  document.body.appendChild(picchemousefollower)
  document.body.appendChild(globalMouseFollower)
} //!SECTION

// SECTION - Image Masker
export function imageMasker(element = "img", opts = {}) {
  document.querySelectorAll(element).forEach(function (elem) {
    var parent = elem.parentNode
    var mask = document.createElement("div")

    if (opts.mouseFollower) {
      var circle = document.createElement("div")

      circle.style.width =
        gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * 0.3) +
        "px"
      circle.style.height =
        gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * 0.3) +
        "px"

      circle.textContent = opts.text || "View More"

      circle.classList.add("circle")

      mask.addEventListener("mousemove", function (dets) {
        mask.appendChild(circle)
        gsap.to(circle, {
          top: dets.clientY - mask.getBoundingClientRect().y,
          left: dets.clientX - mask.getBoundingClientRect().x,
          ease: Expo.easeOut,
          duration: 2,
        })
      })

      mask.addEventListener("mouseleave", function () {
        gsap.to(circle, {
          opacity: 0,
          ease: Expo.easeOut,
          duration: 0.8,
        })
      })


    }
    mask.classList.add("mask")
    parent.replaceChild(mask, elem)

    mask.appendChild(elem)
    mask.addEventListener("mouseenter", function () {
      gsap.to(globalMouseFollower, {
        opacity: 0,
        ease: gsap.EasePower1,
      })
      gsap.to(picchemousefollower, {
        opacity: 0,
        ease: gsap.EasePower1,
      })
      gsap.to(circle, {
        opacity: 1,
        ease: Expo.easeOut,
        duration: 0.8,
      })
    })
    mask.addEventListener("mousemove", function (dets) {
      gsap.to(elem, {
        scale: opts.scale || elem.getBoundingClientRect().width < 450 ? 1.05 : 1.025,
        ease: opts.ease || Expo.easeOut,
        duration: opts.duration || 0.7,
      })
    })
    mask.addEventListener("mouseleave", function () {
      gsap.to(globalMouseFollower, {
        opacity: 1,
        ease: Power1,
      })
      gsap.to(picchemousefollower, {
        opacity: 1,
        ease: Power1,
      })
      gsap.to(this.childNodes[0], {
        scale: 1,
        ease: opts.ease || Expo.easeOut,
        duration: opts.duration || 1,
      })
    })
  })
} //!SECTION

// SECTION - Make Magnet
export function makeMagnet(element, opts = {}) {
  document.querySelectorAll(element).forEach(function (elem) {
    elem.addEventListener("mousemove", function (dets) {
      var bcr = elem.getBoundingClientRect()
      var zeroonex = gsap.utils.mapRange(
        0,
        bcr.width,
        0,
        1,
        dets.clientX - bcr.left
      )
      var zerooney = gsap.utils.mapRange(
        0,
        bcr.height,
        0,
        1,
        dets.clientY - bcr.top
      )

      gsap.to(".mousefollower", {
        scale: 4,
        ease: Power2,
        duration: 0.5,
      })

      gsap.to(elem, {
        x: lerp(-20, 20, zeroonex),
        y: lerp(-20, 20, zerooney),
        duration: opts.duration || 1,
        ease: opts.ease || Expo.easeOut,
      })
    })
    elem.addEventListener("mouseleave", function (dets) {
      gsap.to(".mousefollower", {
        scale: 1,
        ease: Power2,
        duration: 0.5,
      })
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: opts.duration || 1,
        ease: opts.ease || Expo.easeOut,
      })
    })
  })
} //!SECTION

// SECTION - Text Animate
export function textAnimate(element, opts = {}) {
  var alltexts = document.querySelectorAll(element)
  alltexts.forEach(function (elem) {
    elem.textContent = elem.textContent.trim().replaceAll(' ', ' ')
    elem.classList.add("sheryelem")
    var clutter = ""
    elem.textContent.split("").forEach(function (char) {
      clutter += `<span>${char}</span>`
    })
    elem.innerHTML = clutter
  })
  switch (opts.style || 1) {
    case 1:
      alltexts.forEach(function (elem) {
        gsap.from(elem.childNodes, {
          scrollTrigger: {
            trigger: elem,
            start: "top 80%",
          },
          y: opts.y || 10,
          stagger: opts.delay || 0.1,
          opacity: 0,
          duration: opts.duration || 2,
          ease: opts.ease || Expo.easeOut,
        })
      })
      break
    case 2:
      alltexts.forEach(function (elem, i) {
        var len = elem.childNodes.length - 1
        for (var i = 0; i < elem.childNodes.length / 2; i++) {
          elem.childNodes[i].dataset.delay = i
        }
        for (
          var i = Math.floor(elem.childNodes.length / 2);
          i < elem.childNodes.length;
          i++
        ) {
          elem.childNodes[i].dataset.delay = len - i
        }
        elem.childNodes.forEach(function (al) {
          gsap.from(al, {
            y: 20,
            delay: al.dataset.delay * (opts.multiplier || 0.1),
            opacity: 0,
            ease: opts.ease || Expo.easeOut,
          })
        })
      })
      break
    default:
      console.warn(
        "SheryJS : no such style available for text, mentioned in textanimate()"
      )
  }
} //!SECTION

// SECTION - Hover With Media
export function hoverWithMediaCircle(element, opts) {
  function calculateMedia(indexofelem) {
    var lengthofres = opts.images ? opts.images.length : opts.videos.length
    return indexofelem % lengthofres
  }

  var parent = document.body
  var parentDiv = document.createElement("div")
  parentDiv.classList.add("just-a-white-blend-screen")
  parentDiv.classList.add("movercirc")

  var circle = document.createElement("div")

  // <video preload="auto" muted="" loop="" autoplay="" src="blob:https://cuberto.com/e9ebb315-eef6-42b5-982d-53eb983c272f"></video>
  var media = null
  document.body.click()
  if (opts.images) {
    var img = document.createElement("img")
    media = img
  } else if (opts.videos) {
    var vid = document.createElement("video")
    vid.preload = true
    vid.autoplay = true
    vid.muted = true
    media = vid
  }

  circle.appendChild(media)
  parent.appendChild(parentDiv)
  parent.appendChild(circle)

  circle.classList.add("movercirc")

  document.querySelectorAll(element).forEach(function (elem, index) {
    var prevx = 0
    var prevy = 0

    elem.classList.add("hovercircle")
    elem.addEventListener("mouseenter", function (dets) {
      media.setAttribute(
        "src",
        opts.images
          ? opts.images[calculateMedia(index)]
          : opts.videos[calculateMedia(index)]
      )
    })

    var timer
    elem.addEventListener("mousemove", function (dets) {
      var trans = gsap.utils.pipe(
        gsap.utils.clamp(-1, 1),
        gsap.utils.mapRange(-1, 1, 0.8, 1.2)
      )
      var diffx = trans(dets.clientX - prevx)
      var diffy = trans(dets.clientY - prevy)
      prevx = dets.clientX
      prevy = dets.clientY

      clearTimeout(timer)
      timer = setTimeout(function () {
        gsap.to(".movercirc", {
          transform: `translate(-50%,-50%)`,
        })
      }, 500)

      gsap.to(".movercirc", {
        left: dets.clientX,
        top: dets.clientY,
        width: "20vw",
        height: "20vw",
        transform: `translate(-50%,-50%) scale(${(diffx, diffy)})`,
        ease: Circ,
        duration: 0.4,
        opacity: 1,
      })
      circle.classList.add("blend")
    })

    elem.addEventListener("mouseleave", function (dets) {
      gsap.to(".movercirc", {
        width: "0",
        height: "0",
        ease: Power2,
        duration: 0.4,
        opacity: 0,
      })
      circle.classList.remove("blend")
    })
  })
} //!SECTION

// SECTION - Image Effects
export function imageEffect(element = "img", opts = {}) {
  let width = innerWidth
  let height = innerHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, width / height, .1, 1000)
  camera.fov = 2 * Math.atan(height / 2 / 10) * (180 / Math.PI)
  camera.position.set(0, 0, 10)

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const container = document.createElement("div")
  container.classList.add("_canvas_container")
  container.appendChild(renderer.domElement)
  document.body.appendChild(container)

  document.querySelectorAll(element).forEach(function (elem) {
    elem.style.opacity = "0"
    switch (opts.style || 1) {
      // STUB - Simple Liquid Distortion Effect
      case 1: {
        var { debugObj, panel, uniforms, animate } = init(
          elem,
          vertex_1,
          fragment_1, {
          a: { value: 2, range: [0, 30] },
          b: { value: 0.7, range: [-1, 1] },
        },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 1,
            opts,
            offset: -0.04,
          }
        )

        if (panel) {
          panel
            .addSelect(debugObj, "onMouse", {
              target: "Active",
              label: "Effect Mode",
              onChange: (x) => (uniforms.onMouse.value = x),
            })
            .addSlider(uniforms.a, "value", "range", {
              label: "Speed",
              step: 0.001,
            })
            .addSlider(uniforms.b, "value", "range", {
              label: "Wobbliness",
              step: 0.001,
            })
          fix()
        }
        animate()
      }
        break //!STUB

      // STUB - Dynamic Distortion Effect
      case 2: {
        var { debugObj, controlKit, panel, uniforms, animate } = init(
          elem,
          vertex_2,
          fragment_2,
          {
            resolutionXY: { value: 100 },
            distortion: { value: true },
            mode: { value: -3 },
            mousemove: { value: 0 },
            modeA: { value: 1 },
            modeN: { value: 0 },
            speed: { value: 1, range: [-500, 500], rangep: [-10, 10] },
            frequency: { value: 50, range: [-800, 800], rangep: [-50, 50] },
            angle: { value: 0.5, range: [0, Math.PI] },
            waveFactor: { value: 1.4, range: [-3, 3] },
            color: { value: new THREE.Color(0.33, 0.66, 1) },
            pixelStrength: { value: 3, range: [-20, 100], rangep: [-20, 20] },
            quality: { value: 5, range: [0, 10] },
            contrast: { value: 1, range: [-25, 25] },
            brightness: { value: 1, range: [-1, 25] },
            colorExposer: { value: 0.182, range: [-5, 5] },
            strength: { value: 0.2, range: [-40, 40], rangep: [-5, 5] },
            exposer: { value: 8, range: [-100, 100] },
          },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 2,
            opts,
            dposition: 380,
          }
        )
        if (panel) {
          panel
            .addCheckbox(uniforms.distortion, "value", {
              label: "Distortion Effect",
            })
            .addSelect(debugObj, "onMouse", {
              target: "Active",
              label: "Effect Mode",
              onChange: (x) => (uniforms.onMouse.value = x),
            })
            .addSelect(debugObj, "Mode", {
              target: "Mode Active",
              label: "Blend/Overlay Mode",
              onChange: (x) => (uniforms.mode.value = x - 10),
            })
            .addSelect(debugObj, "Mouse", {
              target: "Mouse Active",
              label: "Mousemove Effect",
              onChange: (x) => (uniforms.mousemove.value = x),
            })
            .addSelect(debugObj, "Trigo", {
              target: "Trig A",
              label: "Effect StyleA",
              onChange: (x) => (uniforms.modeA.value = x),
            })
            .addSelect(debugObj, "Trigo", {
              target: "Trig N",
              label: "Effect StyleN",
              onChange: (x) => (uniforms.modeN.value = x),
            })
            .addColor(debugObj, "Color", {
              colorMode: "hex",
              onChange: (x) => uniforms.color.value.set(x),
            })
          controlKit
            .addPanel({
              enable: false,
              label: "Controls Panel",
              width: 350,
              fixed: false,
              position: [10, 10],
            })
            .addSlider(debugObj.speed, "normal", "range", {
              label: "Speed",
              step: 0.00001,
              onChange: () => (uniforms.speed.value = debugObj.speed.normal),
            })
            .addSlider(debugObj.speed, "precise", "rangep", {
              label: "Speed Precise",
              step: 0.00001,
              onChange: () => (uniforms.speed.value = debugObj.speed.precise),
            })
            .addSlider(debugObj.frequency, "normal", "range", {
              label: "Frequency",
              step: 0.00001,
              onChange: () =>
                (uniforms.frequency.value = debugObj.frequency.normal),
            })
            .addSlider(debugObj.frequency, "precise", "rangep", {
              label: "Frequency Precise",
              step: 0.00001,
              onChange: () =>
                (uniforms.frequency.value = debugObj.frequency.precise),
            })
            .addSlider(debugObj.Resolution_XY, "value", "range", {
              label: "Resolution",
              step: 0.00001,
              onChange: () => {
                uniforms.resolutionXY.value = debugObj.Resolution_XY.value
              }
            })
            .addSlider(debugObj.Resolution_XY, "precise", "rangep", {
              label: "Resolution Precise",
              step: 0.00001,
              onChange: () => {
                uniforms.resolutionXY.value = debugObj.Resolution_XY.precise
              }
            })
            .addSlider(uniforms.angle, "value", "range", {
              label: "Angle",
              step: 0.00001,
            })
            .addSlider(uniforms.waveFactor, "value", "range", {
              label: "Wave Factor",
              step: 0.00001,
            })
            .addSlider(debugObj.pixelStrength, "normal", "range", {
              label: "Pixel Strength",
              step: 0.00001,
              onChange: () =>
              (uniforms.pixelStrength.value =
                debugObj.pixelStrength.normal),
            })
            .addSlider(debugObj.pixelStrength, "precise", "rangep", {
              label: "Precise Pixel",
              step: 0.00001,
              onChange: () =>
              (uniforms.pixelStrength.value =
                debugObj.pixelStrength.normal),
            })
            .addSlider(uniforms.quality, "value", "range", {
              label: "Quality",
              step: 0.00001,
            })
            .addSlider(uniforms.contrast, "value", "range", {
              label: "Contrast",
              step: 0.00001,
            })
            .addSlider(uniforms.brightness, "value", "range", {
              label: "Brightness",
              step: 0.00001,
            })
            .addSlider(uniforms.colorExposer, "value", "range", {
              label: "Color Exposer",
              step: 0.00001,
            })
            .addSlider(debugObj.strength, "normal", "range", {
              label: "Strength",
              step: 0.00001,
              onChange: (x) =>
                (uniforms.strength.value = debugObj.strength.normal),
            })
            .addSlider(debugObj.strength, "precise", "rangep", {
              label: "Strength Precise",
              step: 0.00001,
              onChange: (x) =>
                (uniforms.strength.value = debugObj.strength.precise),
            })
            .addSlider(uniforms.exposer, "value", "range", {
              label: "Exposer",
              step: 0.00001,
            })
          fix()
        }
        animate()
      }
        break //!STUB

      // STUB - Dynamic 3d Wave/Wobble Effect
      case 3: {
        var { debugObj, panel, elemMesh, uniforms, animate } = init(
          elem,
          vertex_3,
          fragment_3,
          {
            uFrequencyX: { value: 12, range: [0, 100] },
            uFrequencyY: { value: 12, range: [0, 100] },
            uFrequencyZ: { value: 10, range: [0, 100] },
            geoVertex: { value: 32, range: [1, 64] }
          },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 3,
            opts,
            fov: 1.0375,
            size: 0.01744,
            offset: -0.04,
          }
        )
        if (panel) {
          panel
            .addSelect(debugObj, "onMouse", {
              target: "Active",
              label: "Effect Mode",
              onChange: (x) => (uniforms.onMouse.value = x),
            })
            .addSlider(uniforms.geoVertex, "value", "range", {
              label: "VertexCount",
              step: 1,
              onChange: () => {
                redraw(elemMesh, uniforms.geoVertex.value)
              },
            })
            .addSlider(uniforms.uFrequencyX, "value", "range", {
              label: "FrequencyX",
              step: 0.01,
            })
            .addSlider(uniforms.uFrequencyY, "value", "range", {
              label: "FrequencyY",
              step: 0.01,
            })
            .addSlider(uniforms.uFrequencyZ, "value", "range", {
              label: "FrequencyZ",
              step: 0.01,
            })
          fix()
        }
        animate()
      }
        break //!STUB

      // STUB - Wind Distortion Effect
      case 4: {
        var { debugObj, panel, elemMesh, uniforms, animate } = init(
          elem,
          vertex_4,
          fragment_4,
          {
            uColor: { value: false },
            uSpeed: { value: 0.6, range: [0.1, 1], rangep: [1, 10] },
            uAmplitude: { value: 1.5, range: [0, 5] },
            uFrequency: { value: 3.5, range: [0, 10] },
            geoVertex: { value: 32, range: [1, 64] }
          },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 4,
            opts,
            offset: -0.04,
          }
        )

        if (opts.config)
          Object.keys(opts.config).forEach(
            (key) => (uniforms[key].value = opts.config[key].value)
          )
        if (panel) {
          panel
            .addCheckbox(uniforms.uColor, "value", { label: "Color Depth" })
            .addSelect(debugObj, "onMouse", {
              target: "Active",
              label: "Effect Mode",
              onChange: (x) => (uniforms.onMouse.value = x),
            })
            .addSlider(uniforms.geoVertex, "value", "range", {
              label: "VertexCount",
              step: 1,
              onChange: () => redraw(elemMesh, uniforms.geoVertex.value),
            })
            .addSlider(debugObj, "s", "range", {
              label: "Speed",
              onChange: () => (uniforms.uSpeed.value = debugObj.s),
              step: 0.01,
            })
            .addSlider(debugObj, "f", "rangep", {
              label: "FastForward",
              onChange: () => (uniforms.uSpeed.value = debugObj.f),
              step: 0.01,
            })
            .addSlider(uniforms.uAmplitude, "value", "range", {
              label: "Amplitude",
              step: 0.01,
            })
            .addSlider(uniforms.uFrequency, "value", "range", {
              label: "Frequency",
              step: 0.01,
            })
          fix()
        }
        animate()
      }
        break //!STUB

      // STUB - MultiImage Effect
      case 5: {
        var { debugObj, panel, uniforms, animate } = init(
          elem,
          vertex_5,
          fragment_5,

          {
            a: { value: 2, range: [0, 30] },
            b: { value: 1 / 1.333, range: [-1, 1] },
          },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 5,
            opts,
            fov: 0.9,
            onDoc: true,
            offset: -0.04,
          }
        )
        if (panel) {
          panel
            .addSelect(debugObj, "onMouse", {
              target: "Active",
              label: "Effect Mode",
              onChange: (x) => (uniforms.onMouse.value = x),
            })
            .addSlider(uniforms.a, "value", "range", {
              label: "Speed",
              step: 0.001,
            })
            .addSlider(uniforms.b, "value", "range", {
              label: "Wobbliness",
              step: 0.001,
            })
          fix()
        }
        animate()
      }
        break //!STUB

      // STUB - Perlin Noise Effect
      case 6: {
        var { debugObj, panel, uniforms, animate } = init(
          elem,
          vertex_6,
          fragment_6,
          {
            "noiseDetail": { "value": 7.44, "range": [0, 100] },
            "distortionAmount": { "value": 2.98, "range": [0, 10] },
            "scale": { "value": 36.36, "range": [0, 100] },
            "speed": { "value": 0.79, "range": [0, 1] }
          },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 6,
            opts,
          }
        )

        if (panel) {
          panel
            .addSlider(uniforms.speed, "value", "range", {
              label: "speed",
              step: 0.001,
            })
            .addSlider(uniforms.scale, "value", "range", {
              label: "scale",
              step: 0.001,
            })
            .addSlider(uniforms.distortionAmount, "value", "range", {
              label: "Amount",
              step: 0.001,
            })
            .addSlider(uniforms.noiseDetail, "value", "range", {
              label: "noiseDetail",
              step: 0.001,
            })

          fix()
        }
        animate()
      }
        break //!STUB

      // STUB - Cyber Cube Effect
      case 7: {
        var { debugObj, panel, uniforms, animate } = init(
          elem,
          vertex_7,
          fragment_7,
          {
            invert: { value: false },
            isTexture: { value: false },
            autorotate: { value: true },
            mouseMove: { value: true },
            color: { value: new THREE.Color(0xffffff) },
            mouseMoveEWX: { value: 0, range: [0, 1] },
            mouseMoveEHY: { value: 0.07, range: [0, 1] },
            smoothness: { value: 1.44, range: [0, 3] },
            circular: { value: 0, range: [-.1, .1] },
            styling: { value: .82, range: [-3, 3] },
            clustering: { value: 5.0, range: [0, 5] },
            gapping: { value: .63, range: [0, 1] },
            rotation: { value: 60, range: [0, 90] },
            density: { value: .07, range: [0, 1] },
            scale: { value: 42, range: [0, 100] },
            pattern: { value: 5.58, range: [0, 15] },
          },
          {
            camera,
            renderer,
            width,
            height,
            scene,
            geometry,
            effect: 7,
            opts,
          }
        )

        if (panel) {
          panel
            .addCheckbox(uniforms.invert, "value", {
              label: "Invert",
            })
            .addCheckbox(uniforms.autorotate, "value", {
              label: "Auto Rotate",
            })
            .addCheckbox(uniforms.mouseMove, "value", {
              label: "Mouse Effect",
            })
            .addSlider(uniforms.mouseMoveEWX, 'value', 'range', {
              label: 'EWX',
              step: 0.001,
            })
            .addSlider(uniforms.mouseMoveEHY, 'value', 'range', {
              label: 'EHY',
              step: 0.001,
            })
            .addSlider(uniforms.rotation, 'value', 'range', {
              label: 'Rotation',
              step: 0.001,
            })
            .addSlider(uniforms.scale, 'value', 'range', {
              label: 'Scale',
              step: 0.001,
            })
            .addSlider(uniforms.pattern, 'value', 'range', {
              label: 'Pattern',
              step: 0.001,
            })
            .addSlider(uniforms.density, 'value', 'range', {
              label: 'Density',
              step: 0.001,
            })
            .addSlider(uniforms.clustering, 'value', 'range', {
              label: 'Clustering',
              step: 0.001,
            })
            .addSlider(uniforms.gapping, 'value', 'range', {
              label: 'Gapping',
              step: 0.001,
            })
            .addSlider(uniforms.smoothness, 'value', 'range', {
              label: 'Smoothness',
              step: 0.001,
            })
            .addSlider(uniforms.styling, 'value', 'range', {
              label: 'Styling',
              step: 0.001,
            })
            .addSlider(uniforms.circular, 'value', 'range', {
              label: 'Ring Contrast',
              step: 0.001,
            })
            .addColor(debugObj, "Color", {
              colorMode: "hex",
              onChange: (x) => uniforms.color.value.set(x),
            })
            .addStringInput(debugObj, 'backgroundImage', {
              label: 'Effect Background Image Source',
              onChange: () => {
                if (debugObj.backgroundImage == '') {
                  uniforms.isTexture.value = false
                } else {
                  uniforms.isTexture.value = true
                }
                uniforms.uTexture.value[2] = new THREE.TextureLoader().load(debugObj.backgroundImage)
              }
            })

          fix()
        }
        animate()
      }
        break //!STUB
    }
  })
} //!SECTION

export class ScrollPos {
  constructor() {
    this.acceleration = 0
    this.maxAcceleration = 5
    this.maxSpeed = 20
    this.velocity = 0
    this.dampen = 0.97
    this.speed = 8
    this.touchSpeed = 8
    this.scrollPos = 0
    this.velocityThreshold = 1
    this.snapToTarget = false
    this.mouseDown = false
    this.lastDelta = 0

    document.addEventListener("touchstart", e => e.preventDefault(), { passive: false })

    window.addEventListener("touchend", () => this.lastDelta = 0)

    window.addEventListener("touchmove", e => {
      // e.preventDefault();
      let delta = this.lastDelta - e.targetTouches[0].clientY
      this.accelerate(Math.sign(delta) * this.touchSpeed)
      this.lastDelta = e.targetTouches[0].clientY
    })

    window.addEventListener("wheel", e => {
      this.accelerate(Math.sign(e.deltaY) * this.speed)
    })


    window.addEventListener("mousemove", e => {
      if (this.mouseDown) {
        let delta = this.lastDelta - e.clientY
        this.accelerate(Math.sign(delta) * this.touchSpeed * 0.4)
        this.lastDelta = e.clientY
      }
    })

    window.addEventListener("mouseup", () => {
      this.lastDelta = 0
      this.mouseDown = false
    })

  }
  accelerate(amount) {
    if (this.acceleration < this.maxAcceleration) {
      this.acceleration += amount
    }
  }
  update() {
    this.velocity += this.acceleration
    if (Math.abs(this.velocity) > this.velocityThreshold) {
      this.velocity *= this.dampen
      this.scrollPos += this.velocity
      this.scrollPos = this.scrollPos >= 0 ? this.scrollPos : 0 // added by ankur
    } else {
      this.velocity = 0
    }
    if (Math.abs(this.velocity) > this.maxSpeed) {
      this.velocity = Math.sign(this.velocity) * this.maxSpeed
    }
    this.acceleration = 0
  }
  snap(snapTarget, dampenThreshold = 100, velocityThresholdOffset = 1.5) {
    if (Math.abs(snapTarget - this.scrollPos) < dampenThreshold) {
      this.velocity *= this.dampen
    }
    if (Math.abs(this.velocity) < this.velocityThreshold + velocityThresholdOffset) {
      this.scrollPos += (snapTarget - this.scrollPos) * 0.1
    }
  }
  project(steps = 1) {
    if (steps === 1) return this.scrollPos + this.velocity * this.dampen
    var scrollPos = this.scrollPos
    var velocity = this.velocity

    for (var i = 0; i < steps; i++) {
      velocity *= this.dampen
      scrollPos += velocity
    }
    return scrollPos
  }
}