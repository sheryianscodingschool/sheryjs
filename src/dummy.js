class ScrollPos {
    constructor() {
        this.acceleration = 0;
        this.maxAcceleration = 5;
        this.maxSpeed = 20;
        this.velocity = 0;
        this.dampen = 0.97;
        this.speed = 8;
        this.touchSpeed = 8;
        this.scrollPos = 0;
        this.velocityThreshold = 1;
        this.snapToTarget = false;
        this.mouseDown = false;
        this.lastDelta = 0;

        // document.addEventListener("touchstart", e => e.preventDefault(), { passive: false });

        window.addEventListener("touchend", () => this.lastDelta = 0)

        window.addEventListener("touchmove", e => {
            // e.preventDefault();
            let delta = this.lastDelta - e.targetTouches[0].clientY;
            this.accelerate(Math.sign(delta) * this.touchSpeed);
            this.lastDelta = e.targetTouches[0].clientY;
        })

        window.addEventListener("wheel", e => {
            // e.preventDefault();
            this.accelerate(Math.sign(e.deltaY) * this.speed);
        });

        window.addEventListener("mousedown", () => this.mouseDown = true)

        window.addEventListener("mousemove", e => {
            if (this.mouseDown) {
                let delta = this.lastDelta - e.clientY;
                this.accelerate(Math.sign(delta) * this.touchSpeed * 0.4);
                this.lastDelta = e.clientY;
            }
        })

        window.addEventListener("mouseup", () => {
            this.lastDelta = 0;
            this.mouseDown = false;
        })

    }
    accelerate(amount) {
        if (this.acceleration < this.maxAcceleration) {
            this.acceleration += amount;
        }
    }
    update() {
        this.velocity += this.acceleration;
        if (Math.abs(this.velocity) > this.velocityThreshold) {
            this.velocity *= this.dampen;
            this.scrollPos += this.velocity;
        } else {
            this.velocity = 0;
        }
        if (Math.abs(this.velocity) > this.maxSpeed) {
            this.velocity = Math.sign(this.velocity) * this.maxSpeed;
        }
        this.acceleration = 0;
    }
    snap(snapTarget, dampenThreshold = 100, velocityThresholdOffset = 1.5) {
        if (Math.abs(snapTarget - this.scrollPos) < dampenThreshold) {
            this.velocity *= this.dampen;
        }
        if (Math.abs(this.velocity) < this.velocityThreshold + velocityThresholdOffset) {
            this.scrollPos += (snapTarget - this.scrollPos) * 0.1;
        }
    }
    project(steps = 1) {
        if (steps === 1) return this.scrollPos + this.velocity * this.dampen
        var scrollPos = this.scrollPos;
        var velocity = this.velocity;

        for (var i = 0; i < steps; i++) {
            velocity *= this.dampen;
            scrollPos += velocity;
        }
        return scrollPos;
    }
}

var mouseWheel = new ScrollPos();
const scrollPerImage = 500;

const KEYBOARD_ACCELERATION = 25;

window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 33:
        case 38:
            mouseWheel.acceleration -= KEYBOARD_ACCELERATION;
            mouseWheel.update()
            break;
        case 34:
        case 40:
            mouseWheel.acceleration += KEYBOARD_ACCELERATION;
            mouseWheel.update()
            break;
    }
})

window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 33:
        case 38:
            mouseWheel.acceleration -= KEYBOARD_ACCELERATION;
            mouseWheel.update()
            break;
        case 34:
        case 40:
            mouseWheel.acceleration += KEYBOARD_ACCELERATION;
            mouseWheel.update()
            break;
    }
})

const folder = "Ragnar";
const root = `https://mwmwmw.github.io/files/Ragnar/A.jpg`;
const files = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ext = "jpg";
const IMAGE_SIZE = 512;

let imageContainer = document.getElementById("images");
let canvas = document.createElement("canvas");
canvas.width = IMAGE_SIZE;
canvas.height = IMAGE_SIZE;
let ctx = canvas.getContext("2d");

function resizeImage(image, size = IMAGE_SIZE) {
    let { width, height } = image;
    ctx.drawImage(image, 0, 0, width, height, 0, 0, size, size);
    return ctx.getImageData(0, 0, size, size);
}

function makeThreeTexture(image) {
    let tex = new THREE.Texture(image);
    tex.needsUpdate = true;
    return tex
}

function loadImages() {
    let promises = [];
    for (var i = 0; i < files.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                let img = document.createElement("img");
                img.crossOrigin = "anonymous";
                img.src = `${root}/${files[i]}.${ext}`;
                img.onload = image => {
                    return resolve(image.target);
                };
            }).then(resizeImage)
                .then(makeThreeTexture)
        );
    }
    return Promise.all(promises);
}

loadImages().then((images) => {
    document.getElementById("loading").style = "display: none;";
    init(images);
});

const renderer = new THREE.WebGLRenderer({ antialias: false });
document.body.appendChild(renderer.domElement);

function init(textures) {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 0, 10);

    scene.add(camera);

    let geometry = new THREE.PlaneGeometry(4.75, 7, 4, 4);

    let material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            blend: { value: 0.0 },
            tex1: { type: "t", value: textures[1] },
            tex2: { type: "t", value: textures[0] }
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
    });

    let mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    var tex1 = textures[1];
    var tex2 = textures[0];

    function updateTexture(pos) {
        if (tex2 != textures[Math.floor(pos / scrollPerImage)]) {
            tex2 = textures[Math.floor(pos / scrollPerImage)]
            material.uniforms.tex2.value = tex2;
        }
        if (tex1 != textures[Math.floor(pos / scrollPerImage) + 1]) {
            tex1 = textures[Math.floor(pos / scrollPerImage) + 1]
            material.uniforms.tex1.value = tex1;
        }
    }



    function draw() {
        requestAnimationFrame(draw);

        mouseWheel.update();
        let scrollTarget = (Math.floor((mouseWheel.scrollPos + scrollPerImage * 0.5) / scrollPerImage)) * scrollPerImage;
        mouseWheel.snap(scrollTarget);
      

        let { scrollPos, velocity } = mouseWheel;

        if (scrollPos < 0) {
            scrollPos = 0;
        }
        if (scrollPos > scrollPerImage * textures.length - 1) {
            scrollPos = scrollPerImage * textures.length - 1;
        }

        if (scrollPos > 0 && scrollPos < scrollPerImage * textures.length - 1) {
            updateTexture(scrollPos);
            material.uniforms.blend.value =
                (scrollPos % scrollPerImage) / scrollPerImage;
        }

        mouseWheel.scrollPos = scrollPos;

        material.uniforms.time.value += 0.1;

        renderer.render(scene, camera);
    }

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", resize);

    resize();
    draw();

}
