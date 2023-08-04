function Shery() {
  var globalMouseFollower = null;
  const lerp = (x, y, a) => x * (1 - a) + y * a;
  return {
    mouseFollower: function (opts = {}) {
      globalMouseFollower = document.createElement("div");
      globalMouseFollower.classList.add("mousefollower");
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
      document.body.appendChild(globalMouseFollower);
    },
    imageMasker: function (element = "img", opts = {}) {
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

          circle.classList.add("circle");

          mask.addEventListener("mouseenter", function () {
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
    },
    makeMagnet: function (element, opts = {}) {
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
          gsap.to(elem, {
            x: lerp(-50, 50, zeroonex),
            y: lerp(-50, 50, zerooney),
            duration: opts.duration || 1,
            ease: opts.ease || Expo.easeOut,
          });
        });

        elem.addEventListener("mouseleave", function (dets) {
          gsap.to(elem, {
            x: 0,
            y: 0,
            duration: opts.duration || 1,
            ease: opts.ease || Expo.easeOut,
          });
        });
      });
    },
    textAnimate: function (element, opts = {}) {
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
    },
    imageEffect: function (element = "img", opts = {}) {
      var isdebug = false;
      document.querySelectorAll(element).forEach(function (elem) {
        // parent setter
        var parent = elem.parentNode;
        var div = document.createElement("div");
        div.classList.add(elem.classList[0]);
        div.id = elem.id;
        div.style.display = "inline-block";
        parent.replaceChild(div, elem);
        div.appendChild(elem);
        // parent setter done
        // image effects
        switch (opts.style || 1) {
          case 1:
            const vertex = /*glsl*/ `
            varying vec2 vuv;
                  void main(){
                    gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
                    vuv = uv;
                  }`;
            const fragment = /*glsl*/ `
            #define PI 3.141592653589793238462643383279502884197
            uniform sampler2D uTexture;
            uniform float uIntercept;
            uniform vec2 uMouse;
            uniform float uTime;
            varying vec2 vuv;
                
            vec2 fade(vec2 t){return t*t*t*(t*(t*6.-15.)+10.);}
            float cnoise(vec2 P){
                  vec4 Pi=floor(P.xyxy)+vec4(0.,0.,1.,1.);
                  vec4 Pf=fract(P.xyxy)-vec4(0.,0.,1.,1.);
                  Pi=mod(Pi,289.);
                  vec4 ix=Pi.xzxz;
                  vec4 iy=Pi.yyww;
                  vec4 fx=Pf.xzxz;
                  vec4 fy=Pf.yyww;
                  vec4 i=mod(((mod(((ix*34.)+1.)*ix,289.)+iy*34.)+1.)*mod(((ix*34.)+1.)*ix,289.)+iy,289.);
                  vec4 gx=vec4(2.)*fract(i*.0243902439)-1.;
                  vec4 gy=abs(gx)-.5;
                  vec4 tx=floor(gx+.5);
                  gx=gx-tx;
                  vec2 g00=vec2(gx.x,gy.x);
                  vec2 g10=vec2(gx.y,gy.y);
                  vec2 g01=vec2(gx.z,gy.z);
                  vec2 g11=vec2(gx.w,gy.w);
                  vec4 norm=vec4(1.79284291400159)-.85373472095314*
                  vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11));
                  g00*=norm.x;
                  g01*=norm.y;
                  g10*=norm.z;
                  g11*=norm.w;
                  float n00=dot(g00,vec2(fx.x,fy.x));
                  float n10=dot(g10,vec2(fx.y,fy.y));
                  float n01=dot(g01,vec2(fx.z,fy.z));
                  float n11=dot(g11,vec2(fx.w,fy.w));
                  vec2 fade_xy=fade(Pf.xy);
                  vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
                  float n_xy=mix(n_x.x,n_x.y,fade_xy.y);
                  return 2.3*n_xy;
            }
            void main(){
                  vec2 uv=vuv;
                  vec2 surface=vec2(cnoise(uv-uMouse/7.+.2*uTime)*.08,cnoise(uv-uMouse/7.+.2*uTime)*.08);
                  uv+=refract(vec2(uMouse.x/600.,uMouse.y/600.),mix(vec2(0.,0.),surface,uIntercept),1./1.333);
                  gl_FragColor=texture2D(uTexture,uv);
            }`;

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            const sizes = {
              width: elem.width,
              height: elem.height,
            };
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(
              sizes.width / -2,
              sizes.width / 2,
              sizes.height / 2,
              sizes.height / -2,
              1,
              2
            );
            camera.position.z = 1;
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(sizes.width, sizes.height);
            elem.style.display = "none";
            elem.parentElement.appendChild(renderer.domElement);

            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(elem.getAttribute("src"));

            texture.needsUpdate = true;
            const planeGeometry = new THREE.PlaneGeometry(
              sizes.width,
              sizes.height
            );
            const planeMaterial = new THREE.ShaderMaterial({
              vertexShader: vertex,
              fragmentShader: fragment,
              uniforms: {
                uTime: {
                  value: 0,
                },
                uTexture: {
                  value: texture,
                },
                uMouse: {
                  value: new THREE.Vector2(mouse.x, mouse.y),
                },
                uIntercept: {
                  value: 0,
                },
              },
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            scene.add(plane);

            renderer.domElement.addEventListener("mousemove", (event) => {
              mouse.x = (event.offsetX / sizes.width) * 2 - 1;
              mouse.y = -((event.offsetY / sizes.height) * 2 - 1);
            });
            renderer.domElement.addEventListener("mouseleave", (event) => {
              mouse.x = (event.offsetX / sizes.width) * 2 - 1;
              mouse.y = -((event.offsetY / sizes.height) * 2 - 1);
            });
            const clock = new THREE.Clock();
            function animate() {
              const elapsedTime = clock.getElapsedTime();
              renderer.domElement.style = elem.style.display;
              renderer.domElement.display = "";
              raycaster.setFromCamera(mouse, camera);
              const intersect = raycaster.intersectObject(plane);
              planeMaterial.uniforms.uIntercept.value = THREE.Math.lerp(
                planeMaterial.uniforms.uIntercept.value,
                intersect.length === 1 ? 1 : 0,
                0.1
              );
              planeMaterial.uniforms.uTime.value = elapsedTime;
              planeMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);
              requestAnimationFrame(animate);
              renderer.render(scene, camera);
            }
            animate();

            return {
              updateTexture: (newTexture) => {
                texture.image = newTexture;
                texture.needsUpdate = true;
              },
            };
            break;
          case 2:
            {
              const vertex = /*glsl*/ `
              varying vec2 vuv;
                    void main(){
                      gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
                      vuv = uv;
                    }`;
              const fragment = /*glsl*/ `
            varying vec2 vuv;
            uniform sampler2D uTexture;
            uniform vec2 mouse;
            uniform float uIntercept;
            uniform vec2 resolution;
            uniform float time;
                  
            uniform bool onMouse;
            uniform bool distortion;
            uniform int mousemove;  
            uniform int mode;
            uniform int modeA;
            uniform int modeN;
            uniform float frequency;
            uniform float angle;
            uniform float speed;
            uniform float waveFactor;
                  
            uniform float contrast;
            uniform float pixelStrength;
                  
            uniform vec3 color;
            uniform float quality;
            uniform float brightness;
            uniform float colorExposer;
            uniform float strength;
            uniform float exposer;
                  
                  
                  
                  
            vec4 minn(vec4 a , vec4 b){
              return vec4(min(a.r,b.r),min(a.g,b.g),min(a.b,b.b),1.0);
            }
            
            vec4 maxx(vec4 a , vec4 b){
              return vec4(max(a.r,b.r),max(a.g,b.g),max(a.b,b.b),1.0);
            }
            
            float mina(vec4 a){
              return min(min(a.r, a.g),a.b);
            }
            
            float maxa(vec4 a){
              return max(max(a.r, a.g),a.b);
            }
            
            mat2 rotate2D(float r) {
              return mat2(cos(r), sin(r), -sin(r), cos(r));
            }
            void main() {
            
                float brightness = clamp(brightness, -1.0,25.0);
                float frequency=clamp(frequency,-999.0,999.0);
                float contrast=clamp(contrast,-50.,50.0);
                float pixelStrength=clamp(pixelStrength,-20.0,999.0); 
                float strength=clamp(strength,-100.,100.);
                float colorExposer=clamp(colorExposer,-5.,5.);
            
                vec2 uv = .5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
                if(mousemove !=0)
                  uv=mix(uv,.5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y+mouse.xy/300.,uIntercept);
                vec3 col = vec3(0);
                vec2 n = vec2(0);
                vec2 q = vec2(0);
                vec2 p = (uv + brightness/10.0);
                float d = dot(p, p);
                float a = -(contrast/100.0);
                mat2 angle = rotate2D(angle);
                
                for(float i = 1.; i <= 10.0; i++) {
                  if(i>quality) break;
                    p *= angle;
                    n *= angle;
                
                    if(mousemove==0)
                    q = p * frequency + time * speed + sin(time) * .0018 * i - pixelStrength * n ;
                    if(mousemove==1)
                    q = p * frequency + time * speed + sin(time) * .0018 * i + mouse - pixelStrength * n ;
                    if(mousemove==2)
                    q = p * frequency + time * speed + sin(time) * .0018 * i - pixelStrength + mouse * n ;
                    if(mousemove==3)
                    q = p * frequency + time * speed + sin(time) * .0018 * i + mouse - pixelStrength + mouse * n ;
                    
                
                    if(modeA==0)
                      a += dot(cos(q) / frequency, vec2(strength));
                    else if(modeA==1)
                      a += dot(sin(q) / frequency, vec2(strength));
                    else if(modeA==2)
                      a += dot(tan(q) / frequency , vec2(strength));
                    else if(modeA==3)
                      a += dot(atan(q) / frequency , vec2(strength));
                
                    if(modeN==0)
                      n -= sin(q);
                    else if(modeN==1)
                      n -= cos(q);
                    else if(modeN==2)
                      n -= tan(q);
                    else if(modeN==3)
                      n -= atan(q);
                
                    if(mousemove !=0)
                        n = mix(n+mouse,n,uIntercept); 
                
                    frequency *= waveFactor;
                }
              
                col = (color*4.5) * (a + colorExposer) +exposer* a + a + d;
              
                vec4 base = distortion? texture2D(uTexture,vuv+a+contrast/100.0):texture2D(uTexture,vuv);
              
                if(onMouse)
                  base = mix( texture2D(uTexture,vuv),base,uIntercept);
              
              
                vec4 blend = vec4(col, 1.0);
              
                vec4 final = mix( base,gl_FragColor,uIntercept);
              
                if (mode == -10)
                   final =	minn(base,blend)-maxx(base,blend)+vec4(1.0);
                if (mode == -9)
                   final =	(maxa(blend)==1.0)?blend:minn(base*base/(1.0-blend),vec4(1.0));
                if (mode == -8)
                   final =	base+blend-2.0*base*blend;
                if (mode == -7)
                   final =	abs(base-blend);
                if (mode == -6)
                   final =	minn(base,blend);
                if (mode == -5)
                   final =	(mina(blend)==0.0)?blend:maxx((1.0-((1.0-base)/blend)),vec4(0.0));
                if (mode == -4)
                   final =	maxa(base)==1.0? blend : minn(base/(1.0-blend),vec4(1.0));
                if (mode == -3)
                   final = (1.0-2.0*blend)*base*base+2.0*base*blend;
                if (mode == -2)
                   final = maxa(base) < 0.5? 2.0 * base * blend : 1.0 - 2.0* (1.0 - base)*(1.0 - blend);
                if (mode == -1)
                   final = base;
                else if(mode==0)
                   final = base + blend ;
                else if(mode==1)
                   final = base * blend ;
                else if(mode==2)
                   final = 1.0 - (1.0 - base)*(1.0 - blend);
                else if(mode==3)
                   final = blend - base ;
                else if(mode==4)
                   final = base / blend ;
                else if(mode==5)
                   final =	maxx(base+blend-1.0,vec4(0.0));
                else if(mode==6)
                final = (base + blend / base)-.55;
                else if(mode==7)
                  final = base + blend *base;
                else if(mode==8)
                  final = mod(base , blend);
                else if(mode==9)
                final = 1.0-(base + blend / base)+.5;
                else if(mode==10)
                  final = blend - base * blend;
                else if(mode==13)
                  final = (base +  blend/2.0);
              
                final = mix(final * brightness,mix(maxx(final,vec4(1.0)), final, contrast), 0.5);
                if(onMouse)
                 final = mix( base , final ,uIntercept);
                
                gl_FragColor=final;
              
              
            }`;

              const raycaster = new THREE.Raycaster();
              const mouse = new THREE.Vector2();

              const sizes = {
                width: elem.width,
                height: elem.height,
              };
              const scene = new THREE.Scene();
              const camera = new THREE.OrthographicCamera(
                sizes.width / -2,
                sizes.width / 2,
                sizes.height / 2,
                sizes.height / -2,
                1,
                2
              );
              camera.position.z = 1;
              const renderer = new THREE.WebGLRenderer();
              renderer.setSize(sizes.width, sizes.height);
              elem.style.display = "none";
              elem.parentElement.appendChild(renderer.domElement);
              const textureLoader = new THREE.TextureLoader();
              const texture = textureLoader.load(elem.getAttribute("src"));
              texture.needsUpdate = true;
              const planeGeometry = new THREE.PlaneGeometry(
                sizes.width,
                sizes.height
              );
              const planeMaterial = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                  time: {
                    value: 0,
                  },
                  resolution: {
                    value: new THREE.Vector2(sizes.width, sizes.height),
                  },
                  uTexture: {
                    value: texture,
                  },
                  mouse: {
                    value: new THREE.Vector2(mouse.x, mouse.y),
                  },
                  uIntercept: {
                    value: 0,
                  },
                  onMouse: {
                    value: false,
                  },
                  distortion: {
                    value: true,
                  },
                  mode: {
                    value: -3,
                  },
                  mousemove: {
                    value: 0,
                  },
                  modeA: {
                    value: 0,
                  },
                  modeN: {
                    value: 0,
                  },
                  speed: {
                    value: 1,
                  },
                  frequency: {
                    value: 50,
                  },
                  angle: {
                    value: 0.5,
                  },
                  waveFactor: {
                    value: 1.4,
                  },
                  color: {
                    value: new THREE.Color(0.33, 0.66, 1),
                  },
                  pixelStrength: {
                    value: 3,
                  },
                  quality: {
                    value: 5,
                  },
                  contrast: {
                    value: 1,
                  },
                  brightness: {
                    value: 1,
                  },
                  colorExposer: {
                    value: 0.182,
                  },
                  strength: {
                    value: 0.2,
                  },
                  exposer: {
                    value: 8,
                  },
                },
              });

              // if (opts.config) planeMaterial.uniforms = opts.config;
              const uniform = planeMaterial.uniforms;
              if (opts.config) {
                Object.keys(opts.config).forEach((key) => {
                  uniform[key].value =
                    key == "color"
                      ? new THREE.Color(opts.config[key].value)
                      : opts.config[key].value;
                });
              }
              if ((opts.debug && !isdebug) || false) {
                isdebug = true;
                const gui = new dat.GUI();
                const debug = {
                  color: '#ffffff',
                  SAVECONFIG: () => {
                    const {
                      time,
                      resolution,
                      uTexture,
                      mouse,
                      uIntercept,
                      ...uniformTrimmed
                    } = uniform;
                    const config = JSON.stringify(uniformTrimmed);
                    navigator.clipboard.writeText(config).then(
                      function () {
                        console.log("Config Copied!");
                      },
                      function (err) {
                        console.error("Could not copy config: ", err);
                      }
                    );
                  },
                };
                gui.add(uniform.onMouse, "value").name("Effect On Hower");

                gui.add(uniform.distortion, "value").name("Distortion Effect");
                gui
                  .add(uniform.mode, "value", {
                    Off: -1,
                    Add: 0,
                    Multiply: 1,
                    Screen: 2,
                    Negitive: 3,
                    Natural: 7,
                    Overlay: -2,
                    SoftLight: -3,
                    ColorDoge: -4,
                    ColorBurn: -5,
                    Avarage: 13,
                    Darken: -6,
                    Diffrance: -7,
                    Exclusion: -8,
                    "Reflact/Glow": -9,
                    Phonix: -10,
                    Substract: 5,
                    Mod: 8,
                    Neon: 6,
                    NeonNegative: 9,
                    Dark: 10,
                  })
                  .name("Blend/Overlay Mode");
                gui
                  .add(uniform.mousemove, "value", {
                    Off: 0,
                    Mode1: 1,
                    Mode2: 2,
                    Mode3: 3,
                  })
                  .name("Mousemove Effect");
                gui
                  .add(uniform.modeA, "value", {
                    sin: 1,
                    cos: 0,
                    tan: 2,
                    atan: 3,
                  })
                  .name("Effect StyleA");
                gui
                  .add(uniform.modeN, "value", {
                    sin: 0,
                    cos: 1,
                    tan: 2,
                    atan: 3,
                  })
                  .name("Effect StyleN");
                gui.add(uniform.speed, "value", -500, 500, 0.001).name("Speed");
                gui
                  .add(uniform.speed, "value", -10, 10, 0.001)
                  .name("Speed Precise");
                gui
                  .add(uniform.frequency, "value", -800, 800, 10)
                  .name("Frequency");
                gui
                  .add(uniform.frequency, "value", -50, 50, 0.0001)
                  .name("Frequency Precise");
                gui
                  .add(uniform.angle, "value", 0, Math.PI, 0.0001)
                  .name("Angle");
                gui
                  .add(uniform.waveFactor, "value", -3, 3, 0.0001)
                  .name("Wave Factor");
                gui
                  .add(uniform.pixelStrength, "value", -20, 100, 0.1)
                  .name("Pixel Strength");
                gui
                  .add(uniform.pixelStrength, "value", -20, 20, 0.0001)
                  .name("Precise Pixel Strength");
                gui.add(uniform.quality, "value", 0, 10, 1).name("Quality");
                gui
                  .add(uniform.contrast, "value", -25, 25, 0.0001)
                  .name("Contrast");
                gui
                  .add(uniform.brightness, "value", -1, 25, 0.0001)
                  .name("Brightness");
                gui
                  .add(uniform.colorExposer, "value", -5, 5, 0.00001)
                  .name("Color Exposer");
                gui
                  .add(uniform.strength, "value", -40, 40, 0.0001)
                  .name("Strength");
                gui
                  .add(uniform.strength, "value", -5, 5, 0.0001)
                  .name("Strength Precise");
                gui
                  .add(uniform.exposer, "value", -100, 100, 0.0001)
                  .name("Exposer");
                gui
                  .addColor(debug, "color")
                  .onChange(() => {
                    uniform.color.value.set(debug.color);
                  })
                  .name("Tint");
                gui.add(debug, "SAVECONFIG");
              }

              const plane = new THREE.Mesh(planeGeometry, planeMaterial);
              scene.add(plane);

              renderer.domElement.addEventListener("mousemove", (event) => {
                mouse.x = (event.offsetX / sizes.width) * 2 - 1;
                mouse.y = -((event.offsetY / sizes.height) * 2 - 1);
              });
              renderer.domElement.addEventListener("mouseleave", (event) => {
                mouse.x = (event.offsetX / sizes.width) * 2 - 1;
                mouse.y = -((event.offsetY / sizes.height) * 2 - 1);
              });
              const clock = new THREE.Clock();
              function animate() {
                const elapsedTime = clock.getElapsedTime();
                renderer.domElement.style = elem.style.display;
                renderer.domElement.display = "";
                raycaster.setFromCamera(mouse, camera);
                const intersect = raycaster.intersectObject(plane);
                planeMaterial.uniforms.uIntercept.value = THREE.Math.lerp(
                  planeMaterial.uniforms.uIntercept.value,
                  intersect.length === 1 ? 1 : 0,
                  0.1
                );
                planeMaterial.uniforms.time.value = elapsedTime;
                planeMaterial.uniforms.mouse.value.set(mouse.x, mouse.y);
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
              }
              animate();

              return {
                updateTexture: (newTexture) => {
                  texture.image = newTexture;
                  texture.needsUpdate = true;
                },
              };
            }
            break;
        }
      });
    },
  };
}
