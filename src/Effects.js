import gsap from "gsap";
import * as THREE from "three";
import {
    init,
    getSize,
    fix,
    setDisplayOld,
    oldDisplay,
    lerp,
    redraw,
} from "./Utils";
import { Expo } from "gsap/all";

// SECTION - Mouse Followerv
var globalMouseFollower = null;
var picchemousefollower = null;

export function mouseFollower(opts = {}) {
    globalMouseFollower = document.createElement("div");
    picchemousefollower = document.createElement("div");
    globalMouseFollower.classList.add("mousefollower");
    picchemousefollower.classList.add("mousefollower");
    picchemousefollower.id = "behindmouse";
    var posx = 0;
    window.addEventListener("mousemove", function (dets) {
        if (opts.skew) {
            diff = gsap.utils.clamp(15, 35, dets.clientX - posx);
            posx = dets.clientX;
            gsap.to(".mousefollower", {
                width: diff + "px",
                ease: opts.ease || Expo.easeOut,
                duration: opts.duration || 1,
            });
        }
        // difference nikaalo
        gsap.to(".mousefollower", {
            opacity: 1,
            top: dets.clientY,
            left: dets.clientX,
            duration: opts.duration || 1,
            ease: opts.ease || Expo.easeOut,
        });
    });
    document.addEventListener("mouseleave", function () {
        gsap.to(".mousefollower", {
            opacity: 0,
            duration: opts.duration || 1,
            ease: opts.ease || Expo.easeOut,
        });
    });
    document.body.appendChild(picchemousefollower);
    document.body.appendChild(globalMouseFollower);
} //!SECTION

// SECTION - Image Masker
export function imageMasker(element = "img", opts = {}) {
    document.querySelectorAll(element).forEach(function (elem) {
        var parent = elem.parentNode;
        var mask = document.createElement("div");

        if (opts.mouseFollower) {
            var circle = document.createElement("div");

            circle.style.width =
                gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * 0.3) +
                "px";
            circle.style.height =
                gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * 0.3) +
                "px";

            circle.textContent = opts.text || "View More";

            circle.classList
                .add("circle")

                .addEventListener("mouseenter", function () {
                    gsap.to(circle, {
                        opacity: 1,
                        ease: Expo.easeOut,
                        duration: 1,
                    });
                });

            mask.addEventListener("mousemove", function (dets) {
                mask.appendChild(circle);
                gsap.to(circle, {
                    top: dets.clientY - mask.getBoundingClientRect().y,
                    left: dets.clientX - mask.getBoundingClientRect().x,
                    ease: Expo.easeOut,
                    duration: 2,
                });
            });

            mask.addEventListener("mouseleave", function () {
                gsap.to(circle, {
                    opacity: 0,
                    ease: Expo.easeOut,
                    duration: 0.8,
                });
            });
        }
        mask.classList.add("mask");
        parent.replaceChild(mask, elem);

        mask.appendChild(elem);
        mask.addEventListener("mouseenter", function () {
            gsap.to(globalMouseFollower, {
                opacity: 0,
                ease: Power1,
            });
        });
        mask.addEventListener("mousemove", function (dets) {
            gsap.to(elem, {
                scale: opts.scale || 1.2,
                ease: opts.ease || Expo.easeOut,
                duration: opts.duration || 1,
            });
        });
        mask.addEventListener("mouseleave", function () {
            gsap.to(globalMouseFollower, {
                opacity: 1,
                ease: Power1,
            });
            gsap.to(this.childNodes[0], {
                scale: 1,
                ease: opts.ease || Expo.easeOut,
                duration: opts.duration || 1,
            });
        });
    });
} //!SECTION

// SECTION - Make Magnet
export function makeMagnet(element, opts = {}) {
    document.querySelectorAll(element).forEach(function (elem) {
        elem.addEventListener("mousemove", function (dets) {
            var bcr = elem.getBoundingClientRect();
            var zeroonex = gsap.utils.mapRange(
                0,
                bcr.width,
                0,
                1,
                dets.clientX - bcr.left
            );
            var zerooney = gsap.utils.mapRange(
                0,
                bcr.height,
                0,
                1,
                dets.clientY - bcr.top
            );

            gsap.to(".mousefollower", {
                scale: 4,
                ease: Power2,
                duration: 0.5,
            });

            gsap.to(elem, {
                x: lerp(-20, 20, zeroonex),
                y: lerp(-20, 20, zerooney),
                duration: opts.duration || 1,
                ease: opts.ease || Expo.easeOut,
            });
        });
        elem.addEventListener("mouseleave", function (dets) {
            gsap.to(".mousefollower", {
                scale: 1,
                ease: Power2,
                duration: 0.5,
            });
            gsap.to(elem, {
                x: 0,
                y: 0,
                duration: opts.duration || 1,
                ease: opts.ease || Expo.easeOut,
            });
        });
    });
} //!SECTION

// SECTION - Text Animate
export function textAnimate(element, opts = {}) {
    var alltexts = document.querySelectorAll(element);
    alltexts.forEach(function (elem) {
        elem.classList.add("sheryelem");
        var clutter = "";
        elem.textContent.split("").forEach(function (char) {
            clutter += `<span>${char}</span>`;
        });
        elem.innerHTML = clutter;
    });
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
                });
            });
            break;
        case 2:
            alltexts.forEach(function (elem, i) {
                var len = elem.childNodes.length - 1;
                for (var i = 0; i < elem.childNodes.length / 2; i++) {
                    elem.childNodes[i].dataset.delay = i;
                }
                for (
                    var i = Math.floor(elem.childNodes.length / 2);
                    i < elem.childNodes.length;
                    i++
                ) {
                    elem.childNodes[i].dataset.delay = len - i;
                }
                elem.childNodes.forEach(function (al) {
                    gsap.from(al, {
                        y: 20,
                        delay: al.dataset.delay * (opts.multiplier || 0.1),
                        opacity: 0,
                        ease: opts.ease || Expo.easeOut,
                    });
                });
            });
            break;
        default:
            console.warn(
                "SheryJS : no such style available for text, mentioned in textanimate()"
            );
    }
} //!SECTION

// SECTION - Hover With Media
export function hoverWithMediaCircle(element, opts) {
    function calculateMedia(indexofelem) {
        var lengthofres = opts.images ? opts.images.length : opts.videos.length;
        return indexofelem % lengthofres;
    }

    var parent = document.body;
    var parentDiv = document.createElement("div");
    parentDiv.classList.add("just-a-white-blend-screen");
    parentDiv.classList.add("movercirc");

    var circle = document.createElement("div");

    // <video preload="auto" muted="" loop="" autoplay="" src="blob:https://cuberto.com/e9ebb315-eef6-42b5-982d-53eb983c272f"></video>
    var media = null;
    document.body.click();
    if (opts.images) {
        var img = document.createElement("img");
        media = img;
    } else if (opts.videos) {
        var vid = document.createElement("video");
        vid.preload = true;
        vid.autoplay = true;
        vid.muted = true;
        media = vid;
    }

    circle.appendChild(media);
    parent.appendChild(parentDiv);
    parent.appendChild(circle);

    circle.classList.add("movercirc");

    document.querySelectorAll(element).forEach(function (elem, index) {
        var prevx = 0;
        var prevy = 0;

        elem.classList.add("hovercircle");
        elem.addEventListener("mouseenter", function (dets) {
            media.setAttribute(
                "src",
                opts.images
                    ? opts.images[calculateMedia(index)]
                    : opts.videos[calculateMedia(index)]
            );
        });

        var timer;
        elem.addEventListener("mousemove", function (dets) {
            var trans = gsap.utils.pipe(
                gsap.utils.clamp(-1, 1),
                gsap.utils.mapRange(-1, 1, 0.8, 1.2)
            );
            var diffx = trans(dets.clientX - prevx);
            var diffy = trans(dets.clientY - prevy);
            prevx = dets.clientX;
            prevy = dets.clientY;

            clearTimeout(timer);
            timer = setTimeout(function () {
                gsap.to(".movercirc", {
                    transform: `translate(-50%,-50%)`,
                });
            }, 500);

            gsap.to(".movercirc", {
                left: dets.clientX,
                top: dets.clientY,
                width: "20vw",
                height: "20vw",
                transform: `translate(-50%,-50%) scale(${(diffx, diffy)})`,
                ease: Circ,
                duration: 0.4,
                opacity: 1,
            });
            circle.classList.add("blend");
        });

        elem.addEventListener("mouseleave", function (dets) {
            gsap.to(".movercirc", {
                width: "0",
                height: "0",
                ease: Power2,
                duration: 0.4,
                opacity: 0,
            });
            circle.classList.remove("blend");
        });
    });
} //!SECTION

// SECTION - Image Effects
export function imageEffect(element = "img", opts = {}) {
    let width = innerWidth;
    let height = innerHeight;
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, .1, 1000);
    camera.fov = 2 * Math.atan(height / 2 / 10) * (180 / Math.PI);
    camera.position.set(0, 0, 10);
  
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
  
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
    const container = document.createElement("div");
    container.classList.add("_canvas_container");
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
  
    document.querySelectorAll(element).forEach(function (elem) {
      elem.style.opacity = "0";
      switch (opts.style || 1) {
        // STUB - Simple Liquid Distortion Effect
        case 1:
          {
            const vertex = /*glsl*/ `varying vec2 vuv;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`;
            const fragment = /*glsl*/ `
              uniform sampler2D uTexture[16];
              uniform float uIntercept,time,a,b,onMouse,uScroll,uSection;
              uniform bool isMulti;
              varying vec2 vuv;
              ₹snoise
              void main(){
              vec2 uv=vuv;
              vec3 v = vec3(vuv.x*1.0+time*a/10.0,vuv.y,time);
              vec2 surface=vec2(snoise(v)*.08,snoise(v)*.01);
              surface = onMouse == 0. ? surface : onMouse == 1. ? mix( vec2(0.) , surface ,uIntercept) : mix(surface , vec2(0.) ,uIntercept);
              uv +=refract(vec2(.0,.0),surface,b);
              gl_FragColor=texture2D(uTexture[0],uv);
              isMulti ;
              }`;
            var { debugObj, panel, uniforms, animate } = init(
              elem,
              vertex,
              fragment,
              {
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
            );
  
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
                  label: "Wobbleness",
                  step: 0.001,
                });
              fix();
            }
            animate();
          }
          break; //!STUB
  
        // STUB - Dynamic Distortion Effect
        case 2:
          {
            const vertex = /*glsl*/ `varying vec2 vuv;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`;
            const fragment = /*glsl*/ `
              uniform vec2 resolution,mouse;
              uniform float uIntercept,time,frequency, angle, speed, waveFactor,contrast,pixelStrength, quality, brightness, colorExposer, strength,exposer,uScroll,uSection;
              uniform int onMouse, mousemove, mode, modeA, modeN;
              uniform bool distortion, isMulti;
              uniform vec3 color;
              varying vec2 vuv;
              uniform sampler2D uTexture[16];
              float mina(vec4 a){return min(min(a.r, a.g),a.b);}
              float maxa(vec4 a){return max(max(a.r, a.g),a.b);}
              vec4 minn(vec4 a , vec4 b){return vec4(min(a.r,b.r),min(a.g,b.g),min(a.b,b.b),1.0);}
              vec4 maxx(vec4 a , vec4 b){return vec4(max(a.r,b.r),max(a.g,b.g),max(a.b,b.b),1.0);}
              mat2 rotate2D(float r) {return mat2(cos(r), sin(r), -sin(r), cos(r));}
              ₹snoise
  
              vec4 img (vec2 uv,float c){
                return mix(texture2D(uTexture[1], uv), texture2D(uTexture[0], uv), step((uScroll)-uSection, c + uv.y));
              }
        
              void main() {
              float brightness = clamp(brightness, -1.0,25.0);
              float frequency=clamp(frequency,-999.0,999.0);
              float contrast=clamp(contrast,-50.,50.0);
              float pixelStrength=clamp(pixelStrength,-20.0,999.0); 
              float strength=clamp(strength,-100.,100.);
              float colorExposer=clamp(colorExposer,-5.,5.);
              vec2 uv = .5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
              uv=mousemove!=0 ? mix(uv,.5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y+mouse.xy/300.,uIntercept):uv;
              float c = (sin((uv.x*7.0*snoise(vec3(uv,1.0)))+(time))/15.0*snoise(vec3(uv,1.0)))+.01;
              vec3 col = vec3(0);
              vec2 n,q = vec2(0);
              vec2 p = (uv + brightness/10.0);
              float d = dot(p, p);
              float a = -(contrast/100.0);
              mat2 angle = rotate2D(angle);
              
              for(float i = 1.; i <= 10.0; i++) {
              if(i>quality) break;
              p,n *= angle;
              if(mousemove==0) q = p * frequency + time * speed + sin(time) * .0018 * i - pixelStrength * n ;
              if(mousemove==1) q = p * frequency + time * speed + sin(time) * .0018 * i + mouse - pixelStrength * n ;
              if(mousemove==2) q = p * frequency + time * speed + sin(time) * .0018 * i - pixelStrength + mouse * n ;
              if(mousemove==3) q = p * frequency + time * speed + sin(time) * .0018 * i + mouse - pixelStrength + mouse * n ;
              if(modeA==0) a += dot(sin(q) / frequency, vec2(strength));
              else if(modeA==1) a += dot(cos(q) / frequency, vec2(strength));
              else if(modeA==2) a += dot(tan(q) / frequency , vec2(strength));
              else if(modeA==3) a += dot(atan(q) / frequency , vec2(strength));
              if(modeN==0) n -= sin(q);
              else if(modeN==1) n -= cos(q);
              else if(modeN==2) n -= tan(q);
              else if(modeN==3) n -= atan(q);
              n =mousemove !=0 ? mix(n+mouse,n,uIntercept):n;
              frequency *= waveFactor;
              }
              col = (color*4.5) * (a + colorExposer) +exposer* a + a + d;
              vec4 base = distortion? img((vuv+a+contrast/100.0),c):img(vuv,c);
              base = onMouse == 0 ? base : onMouse == 1 ? mix( img(vuv,c),base,uIntercept) : mix( base,img(vuv,c),uIntercept);
              vec4 blend = vec4(col, 1.0);
              vec4 final = mix( base,gl_FragColor,uIntercept);
              if (mode == -10) final = base;
              else if (mode == -1) final =	minn(base,blend)-maxx(base,blend)+vec4(1.0);
              else if (mode == -9) final =	(maxa(blend)==1.0)?blend:minn(base*base/(1.0-blend),vec4(1.0));
              else if (mode == -8) final =	base+blend-2.0*base*blend;
              else if (mode == -7) final =	abs(base-blend);
              else if (mode == -6) final =	minn(base,blend);
              else if (mode == -5) final =	(mina(blend)==0.0)?blend:maxx((1.0-((1.0-base)/blend)),vec4(0.0));
              else if (mode == -4) final =	maxa(base)==1.0? blend : minn(base/(1.0-blend),vec4(1.0));
              else if (mode == -3) final = (1.0-2.0*blend)*base*base+2.0*base*blend;
              else if (mode == -2) final = maxa(base) < 0.5? 2.0 * base * blend : 1.0 - 2.0* (1.0 - base)*(1.0 - blend);
              else if(mode==0) final = base + blend ;
              else if(mode==1) final = base * blend ;
              else if(mode==2) final = 1.0 - (1.0 - base)*(1.0 - blend);
              else if(mode==3) final = blend - base ;
              else if(mode==4) final = base / blend ;
              else if(mode==5) final =	maxx(base+blend-1.0,vec4(0.0));
              else if(mode==6) final = (base + blend / base)-.55;
              else if(mode==7) final = base + blend *base;
              else if(mode==8) final = mod(base , blend);
              else if(mode==9) final = 1.0-(base + blend / base)+.5;
              else if(mode==10) final = blend - base * blend;
              else if(mode==11) final = (base +blend/2.0);
              final = mix(final * brightness,mix(maxx(final,vec4(1.0)), final, contrast), 0.5);
              final = onMouse == 0 ? final : onMouse == 1 ? mix( base , final ,uIntercept) : mix( final , base ,uIntercept) ;
              gl_FragColor=final;          
              }`;
            var { debugObj, controlKit, panel, uniforms, animate } = init(
              elem,
              vertex,
              fragment,
              {
                resolution: {
                  value: new THREE.Vector2(
                    width,
                    height
                  ),
                },
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
                dposition: 350,
              }
            );
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
                });
              controlKit
                .addPanel({
                  enable: false,
                  label: "Debug Panel",
                  width: 350,
                  fixed: false,
                  position: [0, 0],
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
                });
              fix();
            }
            animate();
          }
          break; //!STUB
  
        // STUB - Dynamic 3d Wave/Wobble Effect
        case 3:
          {
            const vertex = /*glsl*/ `
        uniform float uFrequencyX,uFrequencyY,uFrequencyZ,time,uIntercept;
        uniform int onMouse;
        varying vec2 vUv;
        void main(){
        vec3 uFrequency=vec3(uFrequencyX/500.,uFrequencyY/500.,uFrequencyZ*10.0);
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        float elevation = sin(modelPosition.x * uFrequency.x - time) *uFrequency.z/1000.0;
        elevation += sin(modelPosition.y * uFrequency.y - time) *uFrequency.z/1000.0;
        modelPosition.z += elevation;
        modelPosition = onMouse == 0 ? modelPosition : onMouse == 1 ? mix( modelMatrix * vec4(position, 1.0) , modelPosition ,uIntercept) : mix( modelPosition , modelMatrix * vec4(position, 1.0) ,uIntercept) ;
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
        vUv = uv;}`;
            const fragment = /*glsl*/ `
        uniform sampler2D uTexture[16];
        uniform float uScroll,uSection,time;
        uniform bool isMulti;
        ₹snoise
        varying vec2 vUv;void main(){vec2 uv=vUv;gl_FragColor = texture2D(uTexture[0], vUv); isMulti ;
        }`;
            var { debugObj, panel, geoVertex, elemMesh, uniforms, animate } = init(
              elem,
              vertex,
              fragment,
              {
                uFrequencyX: { value: 12, range: [0, 100] },
                uFrequencyY: { value: 12, range: [0, 100] },
                uFrequencyZ: { value: 10, range: [0, 100] },
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
                geoVertex: 32,
                fov: 1.0375,
                size: 0.01744,
                offset: -0.04,
              }
            );
            if (panel) {
              panel
                .addSelect(debugObj, "onMouse", {
                  target: "Active",
                  label: "Effect Mode",
                  onChange: (x) => (uniforms.onMouse.value = x),
                })
                .addSlider(geoVertex, "value", "range", {
                  label: "VertexCount",
                  step: 1,
                  onChange: () => {
                    redraw(elemMesh, geoVertex.value);
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
                });
              fix();
            }
            animate();
          }
          break; //!STUB
  
        // STUB - Wind Distortion Effect
        case 4:
          {
            const vertex = /*glsl*/ `
        varying vec2 vUv;
        varying float vWave;
        uniform float time,uFrequency,uAmplitude,uSpeed,uIntercept,onMouse;
        ₹snoise
        void main(){
        vUv=uv;
        vec3 pos=position;
        float noiseFreq=uFrequency;
        float noiseAmp=uAmplitude/10.0;
        vec3 noisePos=vec3(pos.x*noiseFreq+time*uSpeed,pos.y,pos.z);
        pos.z+=snoise(noisePos)*noiseAmp;
        pos = onMouse == 0. ? pos : onMouse == 1. ? mix( position , pos ,uIntercept) : mix( pos , position ,uIntercept) ;
        vWave=pos.z;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
        }`;
            const fragment = /*glsl*/ `
        uniform bool uColor,isMulti;
        uniform sampler2D uTexture[16];
        varying vec2 vUv;
        varying float vWave;
        uniform float uScroll,uSection,time;
        ₹snoise
        void main() {vec2 uv = vUv; gl_FragColor =uColor? mix(texture2D(uTexture[0], vUv ),vec4(1.0),vWave):texture2D(uTexture[0], vUv ); isMulti ;}`;
  
            var { debugObj, panel, geoVertex, elemMesh, uniforms, animate } = init(
              elem,
              vertex,
              fragment,
              {
                uColor: { value: false },
                uSpeed: { value: 0.6, range: [0.1, 1], rangef: [1, 10] },
                uAmplitude: { value: 1.5, range: [0, 5] },
                uFrequency: { value: 3.5, range: [0, 10] },
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
                geoVertex: 32,
                offset: -0.04,
              }
            );
  
            if (opts.config)
              Object.keys(opts.config).forEach(
                (key) => (uniforms[key].value = opts.config[key].value)
              );
            if (panel) {
              panel
                .addCheckbox(uniforms.uColor, "value", { label: "Color Depth" })
                .addSelect(debugObj, "onMouse", {
                  target: "Active",
                  label: "Effect Mode",
                  onChange: (x) => (uniforms.onMouse.value = x),
                })
                .addSlider(geoVertex, "value", "range", {
                  label: "VertexCount",
                  step: 1,
                  onChange: () => redraw(elemMesh, geoVertex.value),
                })
                .addSlider(debugObj, "s", "range", {
                  label: "Speed",
                  onChange: () => (uniforms.uSpeed.value = debugObj.s),
                  step: 0.01,
                })
                .addSlider(debugObj, "f", "rangef", {
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
                });
              fix();
            }
            animate();
          }
          break; //!STUB
  
        // STUB - MultiImage Effect
        case 5:
          {
            const vertex = /*glsl*/ `varying vec2 vuv;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`;
            const fragment = /*glsl*/ `
        uniform sampler2D uTexture[16];
        uniform float uIntercept,time,a,b,onMouse,uScroll,uSection;
        uniform bool isMulti;
        uniform vec2 mouse,mousem;
        varying vec2 vuv;
        ₹snoise
        float cnoise(vec2 P){return snoise(vec3(P,1.0));}    
        void main() {                  
          vec2 uv = vuv;
          float time = time * a;
          vec2 surface = vec2(cnoise(uv - (mouse/10.0) / 7. + .2 * time) * .08, cnoise(uv - (mouse/10.0) / 7. + .2 * time) * .08);
          surface = onMouse == 0. ? surface : onMouse == 1. ? mix( vec2(0.) , surface ,uIntercept) : mix(surface , vec2(0.) ,uIntercept);
          uv += refract(vec2(mousem),surface,b);
          gl_FragColor=texture2D(uTexture[0], uv);
          isMulti ;
        }`;
            var { debugObj, panel, uniforms, animate } = init(
              elem,
              vertex,
              fragment,
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
                effect: 1,
                opts,
                fov: 0.9,
                onDoc: true,
                offset: -0.04,
              }
            );
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
                  label: "Wobbleness",
                  step: 0.001,
                });
              fix();
            }
            animate();
          }
          break; //!STUB
      }
    });
  } //!SECTION