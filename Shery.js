function Shery() {
  var globalMouseFollower = null;
  const lerp = (x, y, a) => x * (1 - a) + y * a;
  return {
    // SECTION - Mouse Followerv
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
    },//!SECTION 

    // SECTION - Image Masker 
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
    }, //!SECTION 

    // SECTION - Make Magnet 
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
    }, //!SECTION 

    // SECTION - Text Animate 
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
    }, //!SECTION 

    // SECTION - Image Effects 
    imageEffect: function (element = "img", opts = {}) {
      var isdebug1 = false;
      var isdebug2 = false;
      var isdebug3 = false;
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

          // STUB - Simple Liquid Distortion Effect 
          case 1: {
            const vertex = /*glsl*/ `
            varying vec2 vuv;
                  void main(){
                    gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
                    vuv = uv;
                  }`;
            const fragment = /*glsl*/ `
            #define PI 3.141592653589793238462643383279502884197
            uniform sampler2D uTexture;
            uniform float uIntercept,uTime;
            uniform vec2 uMouse;
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

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(elem.width / -2, elem.width / 2, elem.height / 2, elem.height / -2, 1, 2);
            camera.position.z = 1;
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(elem.width, elem.height);
            elem.style.display = "none";
            elem.parentElement.appendChild(renderer.domElement);

            const plane = new THREE.Mesh(
              new THREE.PlaneGeometry(elem.width, elem.height),
              new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                  uTime: { value: 0, },
                  uTexture: { value: new THREE.TextureLoader().load(elem.getAttribute("src")), },
                  uMouse: { value: new THREE.Vector2(mouse.x, mouse.y), },
                  uIntercept: { value: 0, },
                },
              }));
            scene.add(plane);

            renderer.domElement.addEventListener("mousemove", (event) => {
              mouse.x = (event.offsetX / elem.width) * 2 - 1;
              mouse.y = -((event.offsetY / elem.height) * 2 - 1);
            });
            renderer.domElement.addEventListener("mouseleave", (event) => {
              mouse.x = (event.offsetX / elem.width) * 2 - 1;
              mouse.y = -((event.offsetY / elem.height) * 2 - 1);
            });

            window.addEventListener('resize', () => renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)))

            const clock = new THREE.Clock();
            function animate() {
              renderer.domElement.style = elem.style.display;
              renderer.domElement.display = "";
              raycaster.setFromCamera(mouse, camera);
              const intersect = raycaster.intersectObject(plane);
              plane.material.uniforms.uIntercept.value = THREE.Math.lerp(plane.material.uniforms.uIntercept.value, intersect.length === 1 ? 1 : 0, 0.1);
              plane.material.uniforms.uTime.value = clock.getElapsedTime();
              plane.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
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
            break;//!STUB 

          // STUB - Dynamic Distortion Effect 
          case 2: {
            const vertex = /*glsl*/ `
            varying vec2 vuv;
            void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);vuv = uv;}`;

            const fragment = /*glsl*/ `
            uniform vec2 resolution,mouse;
            uniform float uIntercept,time,frequency, angle, speed, waveFactor,contrast,pixelStrength, quality, brightness, colorExposer, strength, exposer;
            uniform int mousemove, mode, modeA, modeN;
            uniform bool onMouse,distortion;
            uniform vec3 color;
            varying vec2 vuv;
            uniform sampler2D uTexture;

            float mina(vec4 a){return min(min(a.r, a.g),a.b);}
            float maxa(vec4 a){return max(max(a.r, a.g),a.b);}
            vec4 minn(vec4 a , vec4 b){return vec4(min(a.r,b.r),min(a.g,b.g),min(a.b,b.b),1.0);}
            vec4 maxx(vec4 a , vec4 b){return vec4(max(a.r,b.r),max(a.g,b.g),max(a.b,b.b),1.0);}
            mat2 rotate2D(float r) {return mat2(cos(r), sin(r), -sin(r), cos(r));}
            
            void main() {
                float brightness = clamp(brightness, -1.0,25.0);
                float frequency=clamp(frequency,-999.0,999.0);
                float contrast=clamp(contrast,-50.,50.0);
                float pixelStrength=clamp(pixelStrength,-20.0,999.0); 
                float strength=clamp(strength,-100.,100.);
                float colorExposer=clamp(colorExposer,-5.,5.);
            
                vec2 uv = .5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
                uv=mousemove!=0 ? mix(uv,.5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y+mouse.xy/300.,uIntercept):uv;
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
                  if(modeA==0)   a += dot(cos(q) / frequency, vec2(strength));
                  else if(modeA==1)   a += dot(sin(q) / frequency, vec2(strength));
                  else if(modeA==2)   a += dot(tan(q) / frequency , vec2(strength));
                  else if(modeA==3)   a += dot(atan(q) / frequency , vec2(strength));
                  if(modeN==0)   n -= sin(q);
                  else if(modeN==1)   n -= cos(q);
                  else if(modeN==2)   n -= tan(q);
                  else if(modeN==3)   n -= atan(q);
                  n =mousemove !=0 ? mix(n+mouse,n,uIntercept):n;
                  frequency *= waveFactor;
                }
                col = (color*4.5) * (a + colorExposer) +exposer* a + a + d;
                vec4 base = distortion? texture2D(uTexture,vuv+a+contrast/100.0):texture2D(uTexture,vuv);
                base =onMouse? mix( texture2D(uTexture,vuv),base,uIntercept):base;
                vec4 blend = vec4(col, 1.0);
                vec4 final = mix( base,gl_FragColor,uIntercept);
                if (mode == -1) final = base;
                else if (mode == -10) final =	minn(base,blend)-maxx(base,blend)+vec4(1.0);
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
                else if(mode==13) final = (base +  blend/2.0);
                final = mix(final * brightness,mix(maxx(final,vec4(1.0)), final, contrast), 0.5);
                final =onMouse? mix( base , final ,uIntercept):final;
                gl_FragColor=final;          
            }`;
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(elem.width / -2, elem.width / 2, elem.height / 2, elem.height / -2, 1, 2);
            camera.position.z = 1;
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(elem.width, elem.height);
            elem.style.display = "none";
            elem.parentElement.appendChild(renderer.domElement);
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(elem.width, elem.height), new THREE.ShaderMaterial({
              vertexShader: vertex,
              fragmentShader: fragment,
              uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(elem.width, elem.height) },
                uTexture: { value: new THREE.TextureLoader().load(elem.getAttribute("src")) },
                mouse: { value: new THREE.Vector2(mouse.x, mouse.y) },
                uIntercept: { value: 0 },
                onMouse: { value: false },
                distortion: { value: true },
                mode: { value: -3 },
                mousemove: { value: 0 },
                modeA: { value: 0 },
                modeN: { value: 0 },
                speed: { value: 1 },
                frequency: { value: 50 },
                angle: { value: 0.5 },
                waveFactor: { value: 1.4 },
                color: { value: new THREE.Color(0.33, 0.66, 1) },
                pixelStrength: { value: 3 },
                quality: { value: 5 },
                contrast: { value: 1 },
                brightness: { value: 1 },
                colorExposer: { value: 0.182 },
                strength: { value: 0.2 },
                exposer: { value: 8 },
              },
            }));
            scene.add(plane);
            const uniform = plane.material.uniforms;
            if (opts.config) Object.keys(opts.config).forEach((key) => { uniform[key].value = key == "color" ? new THREE.Color(opts.config[key].value) : opts.config[key].value; });
            if ((opts.debug && !isdebug2) || false) {
              isdebug2 = true;
              const gui = new dat.GUI();
              const debug = {
                color: '#ffffff',
                SAVECONFIG: () => {
                  const { time, resolution, uTexture, mouse, uIntercept, ...rest } = uniform;
                  navigator.clipboard.writeText(JSON.stringify(rest))
                }
              };
              gui.add(uniform.onMouse, "value").name("Effect On Hower");
              gui.add(uniform.distortion, "value").name("Distortion Effect");
              gui.add(uniform.mode, "value", { Off: -1, Add: 0, Multiply: 1, Screen: 2, Negitive: 3, Natural: 7, Overlay: -2, SoftLight: -3, ColorDoge: -4, ColorBurn: -5, Avarage: 13, Darken: -6, Diffrance: -7, Exclusion: -8, "Reflact/Glow": -9, Phonix: -10, Substract: 5, Mod: 8, Neon: 6, NeonNegative: 9, Dark: 10, }).name("Blend/Overlay Mode");
              gui.add(uniform.mousemove, "value", { Off: 0, Mode1: 1, Mode2: 2, Mode3: 3, }).name("Mousemove Effect");
              gui.add(uniform.modeA, "value", { sin: 1, cos: 0, tan: 2, atan: 3, }).name("Effect StyleA");
              gui.add(uniform.modeN, "value", { sin: 0, cos: 1, tan: 2, atan: 3, }).name("Effect StyleN");
              gui.add(uniform.speed, "value", -500, 500, 0.001).name("Speed");
              gui.add(uniform.speed, "value", -10, 10, 0.001).name("Speed Precise");
              gui.add(uniform.frequency, "value", -800, 800, 10).name("Frequency");
              gui.add(uniform.frequency, "value", -50, 50, 0.0001).name("Frequency Precise");
              gui.add(uniform.angle, "value", 0, Math.PI, 0.0001).name("Angle");
              gui.add(uniform.waveFactor, "value", -3, 3, 0.0001).name("Wave Factor");
              gui.add(uniform.pixelStrength, "value", -20, 100, 0.1).name("Pixel Strength");
              gui.add(uniform.pixelStrength, "value", -20, 20, 0.0001).name("Precise Pixel Strength");
              gui.add(uniform.quality, "value", 0, 10, 1).name("Quality");
              gui.add(uniform.contrast, "value", -25, 25, 0.0001).name("Contrast");
              gui.add(uniform.brightness, "value", -1, 25, 0.0001).name("Brightness");
              gui.add(uniform.colorExposer, "value", -5, 5, 0.00001).name("Color Exposer");
              gui.add(uniform.strength, "value", -40, 40, 0.0001).name("Strength");
              gui.add(uniform.strength, "value", -5, 5, 0.0001).name("Strength Precise");
              gui.add(uniform.exposer, "value", -100, 100, 0.0001).name("Exposer");
              gui.addColor(debug, "color").onChange(() => { uniform.color.value.set(debug.color); }).name("Tint");
              gui.add(debug, "SAVECONFIG");
            }
            renderer.domElement.addEventListener("mousemove", (event) => {
              mouse.x = (event.offsetX / elem.width) * 2 - 1;
              mouse.y = -((event.offsetY / elem.height) * 2 - 1);
            });
            renderer.domElement.addEventListener("mouseleave", (event) => {
              mouse.x = (event.offsetX / elem.width) * 2 - 1;
              mouse.y = -((event.offsetY / elem.height) * 2 - 1);
            });

            window.addEventListener('resize', () => renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)))

            const clock = new THREE.Clock();
            function animate() {
              const elapsedTime = clock.getElapsedTime();
              renderer.domElement.display = "";
              raycaster.setFromCamera(mouse, camera);
              uniform.uIntercept.value = THREE.Math.lerp(uniform.uIntercept.value, raycaster.intersectObject(plane).length === 1 ? 1 : 0, 0.1);
              uniform.time.value = elapsedTime;
              uniform.mouse.value.set(mouse.x, mouse.y);
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
            break;//!STUB 

          // STUB - Dynamic 3d Wave/Wobble Effect 
          case 3: {
            const vertex = /*glsl*/ `
            uniform vec3 uFrequency;
            uniform float uTime;
            varying vec2 vUv;
            void main(){
                vec3 uFrequency=vec3(uFrequency.xy/.01744,uFrequency.z);
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                float elevation = sin(modelPosition.x * uFrequency.x - uTime) *uFrequency.z/1000.0;
                elevation += sin(modelPosition.y * uFrequency.y - uTime) *uFrequency.z/1000.0;
                modelPosition.z += elevation;
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                gl_Position = projectedPosition;
                vUv = uv;
            }`
            const fragment = /*glsl*/ `
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main(){vec4 textureColor = texture2D(uTexture, vUv);gl_FragColor = textureColor;}`

            const scene = new THREE.Scene()
            new THREE.TextureLoader().load(elem.getAttribute('src'), texture => {
              const mesh = new THREE.Mesh(new THREE.PlaneGeometry(.01744, .01744, 150, 150), new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                  uFrequency: { value: new THREE.Vector3(25, 25, 15) },
                  uTime: { value: 0 },
                  uTexture: { value: new THREE.TextureLoader().load(elem.getAttribute('src')) }
                }
              }))
              scene.add(mesh)
              const uniform = mesh.material.uniforms;
              if (opts.config) Object.keys(opts.config).forEach((key) => uniform[key].value = opts.config[key].value);
              if ((opts.debug && !isdebug3) || false) {
                isdebug3 = true;
                const gui = new dat.GUI();
                const debug = {
                  SAVECONFIG: () => {
                    const { uTime, uTexture, ...rest } = uniform;
                    navigator.clipboard.writeText(JSON.stringify(rest))
                  },
                };
                gui.add(uniform.uFrequency.value, 'x').min(0).max(100).step(0.01).name('frequencyX')
                gui.add(uniform.uFrequency.value, 'y').min(0).max(100).step(0.01).name('frequencyY')
                gui.add(uniform.uFrequency.value, 'z').min(0).max(100).step(0.01).name('frequencyZ').onChange((x) => {
                  camera.fov = 1 + x / 400
                  camera.updateProjectionMatrix();
                })
                gui.add(debug, "SAVECONFIG");

              }
              const camera = new THREE.PerspectiveCamera(1 + .0375, 1, 0.1, 100)
              camera.position.z = 1
              scene.add(camera)

              const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
              renderer.setSize(elem.width, elem.height)
              renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
              elem.style.display = 'none'
              elem.parentElement.appendChild(renderer.domElement)

              window.addEventListener('resize', () => renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)))

              const clock = new THREE.Clock()
              const tick = () => {
                uniform.uTime.value = clock.getElapsedTime()
                renderer.render(scene, camera)
                window.requestAnimationFrame(tick)
              }
              tick()
            })

          }
            break;//!STUB
        }
      });
    }, //!SECTION
  };
}