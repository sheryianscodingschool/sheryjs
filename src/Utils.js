import * as THREE from "three"
import gsap from "gsap"
import ControlKit from "controlkit"

export const lerp = (x, y, a) => x * (1 - a) + y * a

export const fix = () => {
  const s =
    "#controlKit .panel .group-list .group .sub-group-list .sub-group .wrap .wrap";
  const c = "#controlKit .panel .button, #controlKit .picker .button";
  if (document.querySelector(s))
    document.querySelectorAll(s).forEach((e) => (e.style.width = "30%"));
  if (document.querySelector(c)) {
    document.querySelector(c).parentElement.style.float = "none";
    document.querySelector(c).parentElement.style.width = "100% ";
  }
  if (document.querySelector(s + ".color"))
    document.querySelector(s + ".color").parentElement.style.width = "60%";
};

export const redraw = (elemMesh, v) => {
  let newGeometry = new THREE.PlaneGeometry(
    elemMesh.geometry.parameters.width,
    elemMesh.geometry.parameters.height,
    v,
    v
  );
  elemMesh.geometry.dispose();
  elemMesh.geometry = newGeometry;
};

var isdebug = []
export const init = (
  elem,
  vertex,
  fragment,
  uniforms,
  {
    camera,
    renderer,
    width,
    height,
    scene,
    geometry,
    opts,
    effect = 0,
    onDoc = false,
    geoVertex = 1,
    dposition = 1,
    offset = 0,
  } = {}
) => {
  let intersect = 0;
  const o = "#controlKit .options";

  let elemWidth = elem.getBoundingClientRect().width;
  let elemHeight = elem.getBoundingClientRect().height;
  let elemLeft = elem.getBoundingClientRect().left;

  const mouse = new THREE.Vector2();
  const mousem = new THREE.Vector2();

  const src = [elem.getAttribute("src") && elem.getAttribute("src")]
  let t = [elem.getAttribute("src") && new THREE.TextureLoader().load(src[0])];
  const target = opts.target ? document.querySelector(opts.target) : elem;
  const targettop = target.getBoundingClientRect().top;
  const doAction = (newSection) => {
    uniforms.uSection.value = newSection;
    if (t.length > newSection) {
      if (t.length > newSection + 1)
        uniforms.uTexture.value = [t[newSection], t[newSection + 1]];
      else uniforms.uTexture.value = [t[t.length - 1], t[t.length - 1]];
    }
  };
  if (!(elem.nodeName.toLowerCase() === "img")) {
    fragment = fragment.replace(
      "isMulti ;",
      `
      float c = (sin((uv.x*7.0*snoise(vec3(uv,1.0)))+(time))/15.0*snoise(vec3(uv,1.0)))+.01;
      gl_FragColor = mix(texture2D(uTexture[1], uv), texture2D(uTexture[0], uv), step((uScroll)-uSection, sin(c) + uv.y));`
    );
    const scrollProps = { value: 0 };
    if (!opts.slideStyle) {
      if (opts.staticScroll) {
        function handleScroll(deltaY) {
          gsap.to(scrollProps, {
            value: scrollProps.value + deltaY / innerHeight,
            duration: 0.5, // Adjust the duration as needed
            onUpdate: () => {
              if (scrollProps.value < 0) scrollProps.value = 0;
              uniforms.uScroll.value = scrollProps.value;
              const newSection = Math.floor(scrollProps.value);
              if (newSection !== uniforms.uSection.value) {
                if (t.length > newSection + 1) doAction(newSection);
              }
            },
          });
        }

        window.addEventListener("wheel", (e) => {
          const deltaY = e.deltaY;
          handleScroll(deltaY);
        });
        let touchStartY = 0;
        window.addEventListener("touchstart", (e) => {
          touchStartY = e.touches[0].clientY;
        });
        window.addEventListener(
          "touchmove",
          (e) => {
            const deltaY = (touchStartY - e.touches[0].clientY) * 2; // Adjust the multiplier as needed
            touchStartY = e.touches[0].clientY;
            handleScroll(deltaY * 3);
            e.preventDefault();
          },
          { passive: false }
        );
      } else
        window.addEventListener("scroll", () => {
          let scroll =
            Math.max(offset, scrollY / innerHeight - targettop / innerHeight) +
            offset;
          if (scroll < 0) scroll = 0;
          uniforms.uScroll.value = scroll;
          const newSection = Math.floor(scroll);
          if (newSection != uniforms.uSection.value) {
            if (t.length > newSection + 1) doAction(newSection);
          }
        });
    }
    for (let i = 0; i < elem.children.length; i++) {
      src[i] = elem.children[i].getAttribute("src")
      t[i] = new THREE.TextureLoader().load(src[i])
      if (i > 0) {
        elem.children[i].style.display = 'none'
      }
    }
  }
  Object.assign(uniforms, {
    time: { value: 0 },
    mouse: { value: mouse },
    uIntercept: { value: 0 },
    onMouse: { value: 0 },
    uSection: { value: 0 },
    isMulti: { value: !(elem.nodeName.toLowerCase() === "img") },
    uScroll: { value: offset * 3 },
    uTexture: {
      value:
        elem.nodeName.toLowerCase() === "img"
          ? t
          : [t[0], t[1]],
    },
  });

  const setScroll = (x) => {
    if (x >= 0) {
      uniforms.uScroll.value = x;
      doAction(Math.floor(x));
    }
  };

  if (opts.slideStyle && typeof opts.slideStyle === "function")
    opts.slideStyle(setScroll)

  const snoise = `vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex.replace("₹snoise", snoise),
    fragmentShader: fragment.replace("₹snoise", snoise),
    uniforms,
  });

  const elemMesh = new THREE.Mesh(geometry, material);
  elemMesh.scale.set(elemWidth, elemHeight);
  redraw(elemMesh, geoVertex);
  scene.add(elemMesh);

  var geoVertex = { value: 32, range: [1, 64] };
  var debugObj = {
    Mode: [
      "Off",
      "Reflact/Glow",
      "Exclusion",
      "Diffrance",
      "Darken",
      "ColorBurn",
      "ColorDoge",
      "SoftLight",
      "Overlay",
      "Phonix",
      "Add",
      "Multiply",
      "Screen",
      "Negitive",
      "Divide",
      "Substract",
      "Neon",
      "Natural",
      "Mod",
      "NeonNegative",
      "Dark",
      "Avarage",
    ],
    "Mode Active": "Soft Light",
    Trigo: ["Sin", "Cos", "Tan", "Atan"],
    "Trig A": "Cos",
    Trigo: ["Sin", "Cos", "Tan", "Atan"],
    "Trig A": "Cos",
    "Trig N": "Sin",
    Mouse: ["Off", "Mode 1", " Mode 2", " Mode 3"],
    onMouse: ["Always Active", "Active On Hover", "Deactive On Hover"],
    Active: "Always Active",
    "Mouse Active": "Off",
    Offset: { value: offset * 3, range: [-1, 1] },
    Color: "#54A8FF",
    speed: { precise: 1, normal: 1, range: [-500, 500], rangep: [-10, 10] },
    frequency: {
      precise: 1,
      normal: 50,
      range: [-800, 800],
      rangep: [-50, 50],
    },
    pixelStrength: {
      precise: 1,
      normal: 3,
      range: [-20, 100],
      rangep: [-20, 20],
    },
    strength: { precise: 1, normal: 0.2, range: [-40, 40], rangep: [-5, 5] },
    s: 0.6,
    range: [0.1, 1],
    f: 0.6,
    rangef: [1, 10],
  };

  var controlKit = null;
  var panel = null;

  const config = (c) => {
    if (c.color) c.color.value = new THREE.Color(c.color.value);
    Object.assign(uniforms, c);
  };

  if (opts.preset)
    fetch(opts.preset)
      .then((response) => response.json())
      .then((json) => config(json));
  if (opts.config) config(opts.config);

  if ((opts.debug && !isdebug[effect]) || false) {
    isdebug[effect] = true;
    controlKit = new ControlKit();

    panel = controlKit
      .addPanel({
        enable: false,
        label: "Debug Panel",
        fixed: false,
        position: [dposition, 0],
        width: 280,
      })
      .addButton("Save To Clipboard", () => {
        const {
          uScroll,
          isMulti,
          uSection,
          time,
          resolution,
          uTexture,
          mouse,
          uIntercept,
          ...rest
        } = uniforms;
        navigator.clipboard.writeText(JSON.stringify(rest));
      });
    if (!(elem.nodeName.toLowerCase() === "img") && !opts.staticScroll)
      panel.addSlider(debugObj.Offset, "value", "range", {
        label: "Slide Offset",
        step: 0.00001,
        onChange: () => {
          offset = debugObj.Offset.value;
          uniforms.uScroll.value =
            Math.max(offset, scrollY / innerHeight - targettop / innerHeight) +
            offset;
        },
      });
  }

  function setMouseCord(e, i = false) {
    mouse.x = (e.offsetX / elemWidth) * 2 - 1;
    mouse.y = -((e.offsetY / elemHeight) * 2 - 1);
  }

  function getNormalizedMousePosition(event) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const normalizedX = deltaX / centerX;
    const normalizedY = deltaY / centerY;

    mousem.x = normalizedX / 300;
    mousem.y = normalizedY / 300;
  }

  elem.addEventListener("mousemove", (e) => setMouseCord(e, onDoc));

  document.addEventListener("mousemove", (e) => {
    getNormalizedMousePosition(e);
  });

  elem.addEventListener("mouseleave", (e) => {
    intersect = 0;
    setMouseCord(e);
  });

  elem.addEventListener("mouseenter", (e) => {
    intersect = 1;
    setMouseCord(e);
  });

  const fit = () => {
    console.log('hi');
    width = innerWidth;
    height = innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.fov = 2 * Math.atan(height / 2 / 10) * (180 / Math.PI);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    elemLeft = elem.getBoundingClientRect().left;
    elemWidth = elem.getBoundingClientRect().width;
    elemHeight = elem.getBoundingClientRect().height;

    elemMesh.scale.set(
      elem.getBoundingClientRect().width,
      elem.getBoundingClientRect().height
    );

    const size = new THREE.Vector3();
    new THREE.Box3().setFromObject(elemMesh).getSize(size);
    createCroppedTexture(src, size.x / size.y, t)
      .then((texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        elemMesh.material.uniforms.uTexture.value = texture;
        t = texture
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });
  };

  function createCroppedTexture(imageUrls, newAspect, oldTextures = []) {
    return Promise.all(imageUrls.map((imageUrl, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;

          let newWidth, newHeight;
          let xOffset = 0;
          let yOffset = 0;

          if (imgWidth / imgHeight > newAspect) {
            newWidth = imgHeight * newAspect;
            newHeight = imgHeight;
            xOffset = (imgWidth - newWidth) / 2;
          } else {
            newWidth = imgWidth;
            newHeight = imgWidth / newAspect;
            yOffset = (imgHeight - newHeight) / 2;
          }

          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            img,
            xOffset,
            yOffset,
            newWidth,
            newHeight,
            0,
            0,
            newWidth,
            newHeight
          );

          if (oldTextures[index]) {
            oldTextures[index].dispose();
          }

          const newTexture = new THREE.Texture(canvas);
          newTexture.needsUpdate = true;

          resolve(newTexture);
        };

        img.onerror = (error) => {
          reject(error);
        };
      });
    }));
  }

  fit();

  setTimeout(window.dispatchEvent(new Event('resize')), 0)
  addEventListener("resize", fit);

  const clock = new THREE.Clock();
  function animate() {
    if (document.querySelector(o))
      if (parseInt(document.querySelector(o).style.top) < 0)
        document.querySelector(o).style.top = "0px"

    renderer.render(scene, camera);

    Object.assign(uniforms, {
      time: { value: clock.getElapsedTime() },
      mouse: { value: mouse },
      mousem: { value: mousem },
      uIntercept: {
        value: THREE.MathUtils.lerp(
          uniforms.uIntercept.value,
          intersect === 1 ? 1 : 0,
          0.07
        ),
      },
    });


    elemMesh.material.uniforms.time.value = clock.getElapsedTime();
    elemMesh.position.x = elemLeft - width / 2 + elemWidth / 2;
    elemMesh.position.y = -elem.getBoundingClientRect().top + (height / 2) - (elemHeight / 2);

    requestAnimationFrame(animate);
  }
  return {
    debugObj,
    controlKit,
    panel,
    geoVertex,
    animate,
    elemMesh,
    uniforms: elemMesh.material.uniforms,
  };
}