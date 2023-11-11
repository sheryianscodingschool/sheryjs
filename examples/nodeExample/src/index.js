import './styles.css'
import Shery from '../.././../src/Shery'
import * as THREE from "three"
import gsap from 'gsap'

Shery.imageEffect('.img', {
    style: 2,
    debug: true,
    config: { "resolutionXY": { "value": 100 }, "distortion": { "value": true }, "mode": { "value": -3 }, "mousemove": { "value": 0 }, "modeA": { "value": 1 }, "modeN": { "value": 0 }, "speed": { "value": 0.77, "range": [-500, 500], "rangep": [-10, 10] }, "frequency": { "value": 50, "range": [-800, 800], "rangep": [-50, 50] }, "angle": { "value": 1.13, "range": [0, 3.141592653589793] }, "waveFactor": { "value": 1.4, "range": [-3, 3] }, "color": { "value": 10212607 }, "pixelStrength": { "value": -3.85, "range": [-20, 100], "rangep": [-20, 20] }, "quality": { "value": 10, "range": [0, 10] }, "contrast": { "value": 1, "range": [-25, 25] }, "brightness": { "value": 1, "range": [-1, 25] }, "colorExposer": { "value": 0.19, "range": [-5, 5] }, "strength": { "value": 0.13, "range": [-40, 40], "rangep": [-5, 5] }, "exposer": { "value": 8, "range": [-100, 100] }, "zindex": { "value": -9996999, "range": [-9999999, 9999999] }, "aspect": { "value": 1.847763391800257 }, "ignoreShapeAspect": { "value": true }, "shapePosition": { "value": { "x": 0, "y": -0.30 } }, "shapeScale": { "value": { "x": 0.49, "y": 0.95 } }, "shapeEdgeSoftness": { "value": 0.5, "range": [0, 0.5], "_gsap": { "id": 2 } }, "shapeRadius": { "value": 2, "range": [0, 2], "_gsap": { "id": 1 } }, "currentScroll": { "value": 0 }, "scrollLerp": { "value": 0.07 }, "gooey": { "value": true }, "infiniteGooey": { "value": true }, "growSize": { "value": 1, "range": [1, 15] }, "durationOut": { "value": 2.46, "range": [0.1, 5] }, "durationIn": { "value": 1.5, "range": [0.1, 5] }, "displaceAmount": { "value": 0.5 }, "masker": { "value": false }, "maskVal": { "value": 1, "range": [1, 5] }, "scrollType": { "value": 0 }, "geoVertex": { "range": [1, 64], "value": 1 }, "noEffectGooey": { "value": false }, "onMouse": { "value": 0 }, "noise_speed": { "value": 1.3, "range": [0, 10] }, "metaball": { "value": 0.14, "range": [0, 2], "_gsap": { "id": 3 } }, "discard_threshold": { "value": 0.54, "range": [0, 1] }, "antialias_threshold": { "value": 0.06, "range": [0, 0.1] }, "noise_height": { "value": 0.5, "range": [0, 2] }, "noise_scale": { "value": 6.11, "range": [0, 100] } },
    gooey: true,
    setUniforms: (uniforms) => {
        gsap.to(uniforms.shapeRadius, { "value": 0.2, duration: 2 })
        gsap.to(document.querySelector('h1'), { "opacity": 1, duration: 2, delay: 1 })
        gsap.to(uniforms.shapeEdgeSoftness, { "value": 0, duration: 2 })
        setTimeout(() => {
            Shery.textAnimate("h1", {
                style: 2,
                multiplier: 0.1,
            })
        }, 1000)
    }
})
Shery.makeMagnet("h1", {
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
})
