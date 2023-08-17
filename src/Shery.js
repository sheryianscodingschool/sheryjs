function Shery() {
  var globalMouseFollower = null
  var isdebug = []
  const lerp = (x, y, a) => x * (1 - a) + y * a

  //ANCHOR - Geometry Redraw 
  function redraw(plane, v) {
    let newGeometry = new THREE.PlaneGeometry(plane.geometry.parameters.width, plane.geometry.parameters.height, v, v)
    plane.geometry.dispose()
    plane.geometry = newGeometry
  }

  //ANCHOR - DubugUi Fix 
  function fix() {
    const s = '#controlKit .panel .group-list .group .sub-group-list .sub-group .wrap .wrap'
    const c = '#controlKit .panel .button, #controlKit .picker .button'
    if (document.querySelector(s))
      document.querySelectorAll(s).forEach(e => e.style.width = '30%')
    if (document.querySelector(c)) {
      document.querySelector(c).parentElement.style.float = 'none'
      document.querySelector(c).parentElement.style.width = '100% '
    }
    if (document.querySelector(s + '.color'))
      document.querySelector(s + '.color').parentElement.style.width = '60%'
  }
  //SECTION Three.js Effect Init 
  function init(elem, vertex, fragment, uniforms, { opts, effect = 0, aspect = 1, onDoc = false, size = .01744, geoVertex = 1, fov = 1, dposition = 1, offset = 0 } = {}) {
    let intersect = 0
    const o = '#controlKit .options'
    const mouse = new THREE.Vector2()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 2)
    camera.position.z = 1
    const t = []
    const target = opts.target ? document.querySelector(opts.target) : elem
    const targettop = target.getBoundingClientRect().top
    const doAction = (newSection) => {
      uniforms.uSection.value = newSection
      if (t.length > newSection) {
        if (t.length > newSection + 1)
          uniforms.uTexture.value = [t[newSection], t[newSection + 1]]
        else
          uniforms.uTexture.value = [t[t.length - 1], t[t.length - 1]]
      }

    }
    if (!(elem.nodeName.toLowerCase() === 'img')) {
      fragment = fragment.replace('isMulti ;', `
      float c = (sin((uv.x*7.0*snoise(vec3(uv,1.0)))+(time))/15.0*snoise(vec3(uv,1.0)))+.01;
      gl_FragColor = mix(texture2D(uTexture[1], uv), texture2D(uTexture[0], uv), step((uScroll)-uSection, sin(c) + uv.y));`)
      const scrollProps = { value: 0 };
      if (!opts.slideStyle) {
        if (opts.staticScroll) {
          function handleScroll(deltaY) {
            gsap.to(scrollProps, {
              value: scrollProps.value + deltaY / innerHeight,
              duration: 0.5, // Adjust the duration as needed
              onUpdate: () => {
                if (scrollProps.value < 0) scrollProps.value = offset
                uniforms.uScroll.value = scrollProps.value;
                const newSection = Math.floor(scrollProps.value);
                if (newSection !== uniforms.uSection.value) {
                  if (t.length > newSection + 1) doAction(newSection);
                }
              },
            });
          }

          window.addEventListener('wheel', e => {
            const deltaY = e.deltaY;
            handleScroll(deltaY);
          });
          let touchStartY = 0;
          window.addEventListener('touchstart', e => {
            touchStartY = e.touches[0].clientY;
          });
          window.addEventListener('touchmove', e => {
            const deltaY = (touchStartY - e.touches[0].clientY) * 2; // Adjust the multiplier as needed
            touchStartY = e.touches[0].clientY;
            handleScroll(deltaY * 3);
            e.preventDefault();
          }, { passive: false });
        }
        else
          window.addEventListener('scroll', () => {
            let scroll = Math.max(offset, (scrollY / innerHeight) - (targettop / innerHeight)) + offset
            if (scroll < 0) scroll = offset
            uniforms.uScroll.value = scroll
            const newSection = Math.floor(scroll)
            if (newSection != uniforms.uSection.value) {
              if (t.length > newSection + 1) doAction(newSection)
            }
          })
      }
      for (let i = 0; i < elem.children.length; i++) {
        t[i] = new THREE.TextureLoader().load(elem.children[i].getAttribute("src"))
      }
    }

    Object.assign(uniforms, {
      time: { value: 0 },
      mouse: { value: mouse },
      uIntercept: { value: 0 },
      onMouse: { value: 0 },
      uSection: { value: 0 },
      isMulti: { value: (!(elem.nodeName.toLowerCase() === 'img')) },
      uScroll: { value: offset * 3 },
      uTexture: { value: (elem.nodeName.toLowerCase() === 'img') ? [new THREE.TextureLoader().load(elem.getAttribute("src"))] : [t[0], t[1]] },
    })

    const setScroll = (x) => uniforms.uScroll.value = x


    if (opts.slideStyle && typeof opts.slideStyle === 'function')
      opts.slideStyle(setScroll, doAction)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    const styles = window.getComputedStyle(elem);
    renderer.domElement.style.cssText = styles.cssText !== '' ? styles.cssText : Object.values(styles).reduce((css, propertyName) => `${css}${propertyName}:${styles.getPropertyValue(propertyName)};`);
    renderer.setSize(elem.getBoundingClientRect().width, elem.getBoundingClientRect().height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    elem.style.visibility = "hidden"
    elem.parentElement.appendChild(renderer.domElement)

    const parent = elem.parentElement;
    elem.remove();
    parent.appendChild(elem)


    const snoise = `vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size, geoVertex, geoVertex), new THREE.ShaderMaterial({ vertexShader: vertex.replace('₹snoise', snoise), fragmentShader: fragment.replace('₹snoise', snoise), uniforms, }))
    scene.add(plane)

    var geoVertex = { value: 32, range: [1, 64] }
    var debugObj = {
      "Mode": ["Off", "Reflact/Glow", "Exclusion", "Diffrance", "Darken", "ColorBurn", "ColorDoge", "SoftLight", "Overlay", "Phonix", "Add", "Multiply", "Screen", "Negitive", "Divide", "Substract", "Neon", "Natural", "Mod", "NeonNegative", "Dark", "Avarage"],
      "Mode Active": "Soft Light",
      "Trigo": ["Sin", "Cos", "Tan", "Atan"],
      "Trig A": "Cos",
      "Trigo": ["Sin", "Cos", "Tan", "Atan"],
      "Trig A": "Cos",
      "Trig N": "Sin",
      "Mouse": ["Off", "Mode 1", " Mode 2", " Mode 3"],
      "onMouse": ["Always Active", "Active On Hover", "Deactive On Hover"],
      "Active": "Always Active",
      "Mouse Active": "Off",
      "Offset": { "value": offset * 3, "range": [-1, 1] },
      "Color": "#54A8FF",
      "speed": { "precise": 1, "normal": 1, "range": [-500, 500], "rangep": [-10, 10] },
      "frequency": { "precise": 1, "normal": 50, "range": [-800, 800], "rangep": [-50, 50] },
      "pixelStrength": { "precise": 1, "normal": 3, range: [-20, 100], "rangep": [-20, 20] },
      "strength": { "precise": 1, "normal": 0.2, "range": [-40, 40], "rangep": [-5, 5] },
      "s": .6, range: [.1, 1],
      "f": .6, rangef: [1, 10]
    }

    var controlKit = null
    var panel = null

    const config = c => {
      if (c.color) c.color.value = new THREE.Color(c.color.value)
      Object.assign(uniforms, c)
    }

    if (opts.preset) fetch(opts.preset).then(response => response.json()).then(json => config(json))
    if (opts.config) config(opts.config)
    if (uniforms.uFrequencyZ) {
      camera.fov = 1 + uniforms.uFrequencyZ.value / 400
      camera.updateProjectionMatrix()
    }

    if ((opts.debug && !isdebug[effect]) || false) {
      isdebug[2] = true
      controlKit = new ControlKit()
      panel = controlKit.addPanel({ label: "Debug Panel", fixed: false, position: [dposition, 0], width: 280 })
        .addButton('Save To Clipboard', () => { const { uScroll, isMulti, uSection, time, resolution, uTexture, mouse, uIntercept, ...rest } = uniforms; navigator.clipboard.writeText(JSON.stringify(rest)) })
        .addSlider(debugObj.Offset, "value", "range", { label: "Slide Offset", step: 0.00001, onChange: () => { offset = debugObj.Offset.value; uniforms.uScroll.value = Math.max(offset, (scrollY / innerHeight) - (targettop / innerHeight)) + offset } })
    }

    function setMouseCord(e, i = false) {
      if (i) {
        mouse.x = (e.x / elem.getBoundingClientRect().width) * 2 - 1
        mouse.y = -((e.y / elem.getBoundingClientRect().height) * 2 - 1)
      } else {
        mouse.x = (e.offsetX / elem.getBoundingClientRect().width) * 2 - 1
        mouse.y = -((e.offsetY / elem.getBoundingClientRect().height) * 2 - 1)
      }
    }

    (onDoc ? document : renderer).domElement.addEventListener("mousemove", (e) => setMouseCord(e, onDoc))

    renderer.domElement.addEventListener("mouseleave", e => {
      intersect = 0
      setMouseCord(e)
    })

    renderer.domElement.addEventListener("mouseenter", e => {
      intersect = 1
      setMouseCord(e)
    })

    window.addEventListener('resize', () => {
      renderer.setSize(elem.getBoundingClientRect().width, elem.getBoundingClientRect().height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const clock = new THREE.Clock()
    function animate() {
      renderer.domElement.style.cssText = styles.cssText !== '' ? styles.cssText : Object.values(styles).reduce((css, propertyName) => propertyName != 'visibility' ? `${css}${propertyName}:${styles.getPropertyValue(propertyName)};` : `${css}visibility:'visible';`);
      if (renderer.domElement.width == 0 || renderer.domElement.height == 0)
        renderer.setSize(elem.getBoundingClientRect().width, elem.getBoundingClientRect().height)
      if (document.querySelector(o))
        if (parseInt(document.querySelector(o).style.top) < 0)
          document.querySelector(o).style.top = '0px'
      Object.assign(uniforms, {
        time: { value: clock.getElapsedTime() },
        mouse: { value: mouse },
        uIntercept: { value: THREE.Math.lerp(uniforms.uIntercept.value, intersect === 1 ? 1 : 0, 0.07) },
      })
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    return { debugObj, controlKit, panel, geoVertex, animate, plane, uniforms: plane.material.uniforms }
  }
  //!SECTION

  return {
    // SECTION - Mouse Followerv
    mouseFollower: function (opts = {}) {
      globalMouseFollower = document.createElement("div")
      globalMouseFollower.classList.add("mousefollower")
      var posx = 0
      window.addEventListener("mousemove", function (dets) {
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
          opacity: 1,
          top: dets.clientY,
          left: dets.clientX,
          duration: opts.duration || 1,
          ease: opts.ease || Expo.easeOut,
        })
      })
      document.addEventListener("mouseleave", function () {
        gsap.to(".mousefollower", {
          opacity: 0,
          duration: opts.duration || 1,
          ease: opts.ease || Expo.easeOut,
        })
      })
      document.body.appendChild(globalMouseFollower)
    },//!SECTION 

    // SECTION - Image Masker 
    imageMasker: function (element = "img", opts = {}) {
      document.querySelectorAll(element).forEach(function (elem) {
        var parent = elem.parentNode
        var mask = document.createElement("div")

        if (opts.mouseFollower) {
          var circle = document.createElement("div")

          circle.style.width = gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * 0.3) + "px"
          circle.style.height = gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * 0.3) + "px"

          circle.textContent = opts.text || "View More"

          circle.classList.add("circle")

            .addEventListener("mouseenter", function () {
              gsap.to(circle, {
                opacity: 1,
                ease: Expo.easeOut,
                duration: 1,
              })
            })


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
            ease: Power1,
          })
        })
        mask.addEventListener("mousemove", function (dets) {
          gsap.to(elem, {
            scale: opts.scale || 1.2,
            ease: opts.ease || Expo.easeOut,
            duration: opts.duration || 1,
          })
        })
        mask.addEventListener("mouseleave", function () {
          gsap.to(globalMouseFollower, {
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
    }, //!SECTION 

    // SECTION - Make Magnet 
    makeMagnet: function (element, opts = {}) {
      document.querySelectorAll(element).forEach(function (elem) {
        elem.addEventListener("mousemove", function (dets) {
          var bcr = elem.getBoundingClientRect()
          var zeroonex = gsap.utils.mapRange(0, bcr.width, 0, 1, dets.clientX - bcr.left)
          var zerooney = gsap.utils.mapRange(0, bcr.height, 0, 1, dets.clientY - bcr.top)
          gsap.to(elem, {
            x: lerp(-50, 50, zeroonex),
            y: lerp(-50, 50, zerooney),
            duration: opts.duration || 1,
            ease: opts.ease || Expo.easeOut,
          })
        })
        elem.addEventListener("mouseleave", function (dets) {
          gsap.to(elem, { x: 0, y: 0, duration: opts.duration || 1, ease: opts.ease || Expo.easeOut, })
        })
      })
    }, //!SECTION 

    // SECTION - Text Animate 
    textAnimate: function (element, opts = {}) {
      var alltexts = document.querySelectorAll(element)
      alltexts.forEach(function (elem) {
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
    }, //!SECTION 

    // SECTION - Hover With Media 
    hoverWithMediaCircle: function (element, opts) {
      function calculateMedia(indexofelem) {
        var lengthofres = opts.images ? opts.images.length : opts.videos.length;
        return (indexofelem % lengthofres);
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
      }
      else if (opts.videos) {
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

      document.querySelectorAll(element)
        .forEach(function (elem, index) {

          var prevx = 0;
          var prevy = 0;


          elem.classList.add("hovercircle");
          elem.addEventListener("mouseenter", function (dets) {
            media.setAttribute("src", opts.images ? opts.images[calculateMedia(index)] : opts.videos[calculateMedia(index)]);
          })

          var timer;
          elem.addEventListener("mousemove", function (dets) {

            var trans = gsap.utils.pipe(
              gsap.utils.clamp(-1, 1),
              gsap.utils.mapRange(-1, 1, .8, 1.2)
            )
            var diffx = trans(dets.clientX-prevx);
            var diffy = trans(dets.clientY-prevy);
            prevx = dets.clientX;
            prevy = dets.clientY;

            clearTimeout(timer);
            timer = setTimeout(function(){
              gsap.to(".movercirc", {
                transform: `translate(-50%,-50%)`,
              })
            }, 500);

            gsap.to(".movercirc", {
              left: dets.clientX,
              top: dets.clientY,
              width: "15vw",
              height: "15vw",
              transform: `translate(-50%,-50%) scale(${diffx, diffy})`,
              ease: Circ,
              duration: .4,
              opacity: 1
            })
            circle.classList.add('blend')
          })

          elem.addEventListener("mouseleave", function (dets) {
            gsap.to(".movercirc", {
              width: "0",
              height: "0",
              ease: Power2,
              duration: .4,
              opacity: 0
            })
            circle.classList.remove('blend')
          })
        });
    }, //!SECTION 

    // SECTION - Image Effects 
    imageEffect: function (element = "img", opts = {}) {
      document.querySelectorAll(element).forEach(function (elem) {
        if (!(elem.nodeName.toLowerCase() === 'img')) {
          Array.from(elem.children).forEach((e, i) => {
            if (i != 0) e.style.display = 'none'
          })
        }

        switch (opts.style || 1) {
          // STUB - Simple Liquid Distortion Effect 
          case 1: {
            const vertex = /*glsl*/ `varying vec2 vuv;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`
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
            }`

            var { debugObj, panel, uniforms, animate } = init(elem, vertex, fragment, {
              a: { value: 2, range: [0, 30] },
              b: { value: .7, range: [-1, 1] },
            }, { effect: 1, opts, offset: -.04 })

            if (panel) {
              panel.addSelect(debugObj, "onMouse", { target: 'Active', label: 'Effect Mode', onChange: x => uniforms.onMouse.value = x })
                .addSlider(uniforms.a, "value", "range", { label: "Speed", step: .001 })
                .addSlider(uniforms.b, "value", "range", { label: "Wobbleness", step: .001 })
              fix()
            }
            animate()

          }
            break//!STUB 

          // STUB - Dynamic Distortion Effect 
          case 2: {
            const vertex = /*glsl*/ `varying vec2 vuv;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`
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
            }`
            var { debugObj, controlKit, panel, uniforms, animate } = init(elem, vertex, fragment, {
              resolution: { value: new THREE.Vector2(elem.getBoundingClientRect().width, elem.getBoundingClientRect().height) },
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
            }, { effect: 2, opts, dposition: 350 })
            if (panel) {
              panel.addCheckbox(uniforms.distortion, "value", { label: "Distortion Effect" })
                .addSelect(debugObj, "onMouse", { target: 'Active', label: 'Effect Mode', onChange: x => uniforms.onMouse.value = x })
                .addSelect(debugObj, 'Mode', { target: "Mode Active", label: 'Blend/Overlay Mode', onChange: x => uniforms.mode.value = x - 10 })
                .addSelect(debugObj, 'Mouse', { target: "Mouse Active", label: 'Mousemove Effect', onChange: x => uniforms.mousemove.value = x })
                .addSelect(debugObj, 'Trigo', { target: "Trig A", label: 'Effect StyleA', onChange: x => uniforms.modeA.value = x })
                .addSelect(debugObj, 'Trigo', { target: "Trig N", label: 'Effect StyleN', onChange: x => uniforms.modeN.value = x })
                .addColor(debugObj, 'Color', { colorMode: 'hex', onChange: x => uniforms.color.value.set(x) })
              controlKit.addPanel({ label: "Debug Panel", width: 350, fixed: false, position: [0, 0], })
                .addSlider(debugObj.speed, "normal", "range", { label: "Speed", step: 0.00001, onChange: () => uniforms.speed.value = debugObj.speed.normal })
                .addSlider(debugObj.speed, "precise", "rangep", { label: "Speed Precise", step: 0.00001, onChange: () => uniforms.speed.value = debugObj.speed.precise })
                .addSlider(debugObj.frequency, "normal", "range", { label: "Frequency", step: 0.00001, onChange: () => uniforms.frequency.value = debugObj.frequency.normal })
                .addSlider(debugObj.frequency, "precise", "rangep", { label: "Frequency Precise", step: 0.00001, onChange: () => uniforms.frequency.value = debugObj.frequency.precise })
                .addSlider(uniforms.angle, "value", "range", { label: "Angle", step: 0.00001 })
                .addSlider(uniforms.waveFactor, "value", "range", { label: "Wave Factor", step: 0.00001 })
                .addSlider(debugObj.pixelStrength, "normal", "range", { label: "Pixel Strength", step: 0.00001, onChange: () => uniforms.pixelStrength.value = debugObj.pixelStrength.normal })
                .addSlider(debugObj.pixelStrength, "precise", "rangep", { label: "Precise Pixel", step: 0.00001, onChange: () => uniforms.pixelStrength.value = debugObj.pixelStrength.normal })
                .addSlider(uniforms.quality, "value", "range", { label: "Quality", step: 0.00001 })
                .addSlider(uniforms.contrast, "value", "range", { label: "Contrast", step: 0.00001 })
                .addSlider(uniforms.brightness, "value", "range", { label: "Brightness", step: 0.00001 })
                .addSlider(uniforms.colorExposer, "value", "range", { label: "Color Exposer", step: 0.00001 })
                .addSlider(debugObj.strength, "normal", "range", { label: "Strength", step: 0.00001, onChange: x => uniforms.strength.value = debugObj.strength.normal })
                .addSlider(debugObj.strength, "precise", "rangep", { label: "Strength Precise", step: 0.00001, onChange: x => uniforms.strength.value = debugObj.strength.precise })
                .addSlider(uniforms.exposer, "value", "range", { label: "Exposer", step: 0.00001 })
              fix()
            }
            animate()
          }
            break//!STUB 

          // STUB - Dynamic 3d Wave/Wobble Effect 
          case 3: {
            const vertex = /*glsl*/ `
            uniform float uFrequencyX,uFrequencyY,uFrequencyZ,time,uIntercept;
            uniform int onMouse;
            varying vec2 vUv;
            void main(){
            vec3 uFrequency=vec3(uFrequencyX/.01744,uFrequencyY/.01744,uFrequencyZ);
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float elevation = sin(modelPosition.x * uFrequency.x - time) *uFrequency.z/1000.0;
            elevation += sin(modelPosition.y * uFrequency.y - time) *uFrequency.z/1000.0;
            modelPosition.z += elevation;
            modelPosition = onMouse == 0 ? modelPosition : onMouse == 1 ? mix( modelMatrix * vec4(position, 1.0) , modelPosition ,uIntercept) : mix( modelPosition , modelMatrix * vec4(position, 1.0) ,uIntercept) ;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
            vUv = uv;}`
            const fragment = /*glsl*/ `
            uniform sampler2D uTexture[16];
            uniform float uScroll,uSection,time;
            uniform bool isMulti;
            ₹snoise
            varying vec2 vUv;void main(){vec2 uv=vUv;gl_FragColor = texture2D(uTexture[0], vUv); isMulti ;
            }`
            var { debugObj, panel, geoVertex, plane, uniforms, animate } = init(elem, vertex, fragment, {
              uFrequencyX: { value: 25, range: [0, 100] },
              uFrequencyY: { value: 25, range: [0, 100] },
              uFrequencyZ: { value: 15, range: [0, 100] },
            }, { effect: 3, opts, geoVertex: 32, fov: 1.0375, size: .01744, offset: -.04 })
            if (panel) {
              panel.addSelect(debugObj, "onMouse", { target: 'Active', label: 'Effect Mode', onChange: x => uniforms.onMouse.value = x })
                .addSlider(geoVertex, "value", "range", { label: "VertexCount", step: 1, onChange: () => { redraw(plane, geoVertex.value) } })
                .addSlider(uniforms.uFrequencyX, "value", "range", { label: "FrequencyX", step: 0.01 })
                .addSlider(uniforms.uFrequencyY, "value", "range", { label: "FrequencyY", step: 0.01 })
                .addSlider(uniforms.uFrequencyZ, "value", "range", { label: "FrequencyZ", onChange: () => { camera.fov = 1 + uniforms.uFrequencyZ.value / 400; camera.updateProjectionMatrix() }, step: 0.01 })
              fix()
            }
            animate()
          }
            break//!STUB 

          // STUB - Wind Distortion Effect 
          case 4: {
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
            }`
            const fragment = /*glsl*/ `
            uniform bool uColor,isMulti;
            uniform sampler2D uTexture[16];
            varying vec2 vUv;
            varying float vWave;
            uniform float uScroll,uSection,time;
            ₹snoise
            void main() {vec2 uv = vUv; gl_FragColor =uColor? mix(texture2D(uTexture[0], vUv ),vec4(1.0),vWave):texture2D(uTexture[0], vUv ); isMulti ;}`

            var { debugObj, panel, geoVertex, plane, uniforms, animate } = init(elem, vertex, fragment, {
              uColor: { value: false },
              uSpeed: { value: .6, range: [.1, 1], rangef: [1, 10] },
              uAmplitude: { value: 1.5, range: [0, 5] },
              uFrequency: { value: 3.5, range: [0, 10] },
            }, { effect: 4, opts, geoVertex: 16, fov: 25, size: .4, aspect: 1, offset: -.04 })

            if (opts.config) Object.keys(opts.config).forEach((key) => uniforms[key].value = opts.config[key].value)
            if (panel) {
              panel.addCheckbox(uniforms.uColor, "value", { label: "Color Depth" })
                .addSelect(debugObj, "onMouse", { target: 'Active', label: 'Effect Mode', onChange: x => uniforms.onMouse.value = x })
                .addSlider(geoVertex, "value", "range", { label: "VertexCount", step: 1, onChange: () => redraw(plane, geoVertex.value) })
                .addSlider(debugObj, "s", "range", { label: "Speed", onChange: () => uniforms.uSpeed.value = obj.s, step: 0.01 })
                .addSlider(debugObj, "f", "rangef", { label: "FastForward", onChange: () => uniforms.uSpeed.value = obj.f, step: 0.01 })
                .addSlider(uniforms.uAmplitude, "value", "range", { label: "Amplitude", step: 0.01 })
                .addSlider(uniforms.uFrequency, "value", "range", { label: "Frequency", step: 0.01 })
              fix()
            }
            animate()
          }
            break //!STUB 

          // STUB - MultiImage Effect 
          case 5: {
            const vertex = /*glsl*/ `varying vec2 vuv;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`
            const fragment = /*glsl*/ `
            uniform sampler2D uTexture[16];
            uniform float uIntercept,time,a,b,onMouse,uScroll,uSection;
            uniform bool isMulti;
            uniform vec2 mouse;
            varying vec2 vuv;
            ₹snoise
            float cnoise(vec2 P){return snoise(vec3(P,1.0));}    
            void main() {                  
              vec2 uv = vuv;
              float time = time * a;
              vec2 surface = vec2(cnoise(uv - mouse / 7. + .2 * time) * .08, cnoise(uv - mouse / 7. + .2 * time) * .08);
              surface = onMouse == 0. ? surface : onMouse == 1. ? mix( vec2(0.) , surface ,uIntercept) : mix(surface , vec2(0.) ,uIntercept);
              uv += refract(vec2(mouse.x / 300., mouse.y / 300.),surface,b);
              gl_FragColor=texture2D(uTexture[0], uv);
              isMulti ;
            }`
            var { debugObj, panel, uniforms, animate } = init(elem, vertex, fragment, {
              a: { value: 2, range: [0, 30] },
              b: { value: 1. / 1.333, range: [-1, 1] },
            }, { effect: 1, opts, fov: .9, onDoc: true, offset: -.04 })
            if (panel) {
              panel.addSelect(debugObj, "onMouse", { target: 'Active', label: 'Effect Mode', onChange: x => uniforms.onMouse.value = x })
                .addSlider(uniforms.a, "value", "range", { label: "Speed", step: .001 })
                .addSlider(uniforms.b, "value", "range", { label: "Wobbleness", step: .001 })
              fix()
            }
            animate()
          }
            break//!STUB 
        }
      })
    }, //!SECTION 
  }
}
