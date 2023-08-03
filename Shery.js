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
                        duration: opts.duration || 1
                    })
                }
                // difference nikaalo
                gsap.to(".mousefollower", {
                    opacity: 1,
                    top: dets.clientY,
                    left: dets.clientX,
                    duration: opts.duration || 1,
                    ease: opts.ease || Expo.easeOut
                })
            })
            document.addEventListener("mouseleave", function () {
                gsap.to(".mousefollower", {
                    opacity: 0,
                    duration: opts.duration || 1,
                    ease: opts.ease || Expo.easeOut
                })
            })
            document.body.appendChild(globalMouseFollower);
        },
        imageMasker: function (element = "img", opts = {}) {
            document.querySelectorAll(element)
                .forEach(function (elem) {
                    var parent = elem.parentNode;
                    var mask = document.createElement('div');

                    if (opts.mouseFollower) {
                        var circle = document.createElement('div');

                        circle.style.width = gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * .3) + 'px';
                        circle.style.height = gsap.utils.clamp(50, 70, elem.getBoundingClientRect().width * .3) + 'px';

                        circle.textContent = opts.text || "View More";

                        circle.classList.add("circle");

                        mask.addEventListener("mouseenter", function () {
                            gsap.to(circle, {
                                opacity: 1,
                                ease: Expo.easeOut,
                                duration: 1
                            })
                        })

                        mask.addEventListener("mousemove", function (dets) {
                            mask.appendChild(circle);
                            gsap.to(circle, {
                                top: dets.clientY - mask.getBoundingClientRect().y,
                                left: dets.clientX - mask.getBoundingClientRect().x,
                                ease: Expo.easeOut,
                                duration: 2
                            })
                        })

                        mask.addEventListener("mouseleave", function () {
                            gsap.to(circle, {
                                opacity: 0,
                                ease: Expo.easeOut,
                                duration: .8
                            })
                        })
                    }
                    mask.classList.add("mask");
                    parent.replaceChild(mask, elem);

                    mask.appendChild(elem);
                    mask.addEventListener("mouseenter", function () {
                        gsap.to(globalMouseFollower, {
                            opacity: 0,
                            ease: Power1
                        })
                    })
                    mask.addEventListener("mousemove", function (dets) {
                        gsap.to(elem, {
                            scale: opts.scale || 1.2,
                            ease: opts.ease || Expo.easeOut,
                            duration: opts.duration || 1
                        })
                    })
                    mask.addEventListener("mouseleave", function () {
                        gsap.to(globalMouseFollower, {
                            opacity: 1,
                            ease: Power1
                        })
                        gsap.to(this.childNodes[0], {
                            scale: 1,
                            ease: opts.ease || Expo.easeOut,
                            duration: opts.duration || 1
                        })
                    })
                })
        },
        makeMagnet: function (element, opts = {}) {
            document.querySelectorAll(element)
                .forEach(function (elem) {
                    elem.addEventListener("mousemove", function (dets) {
                        var bcr = elem.getBoundingClientRect();
                        var zeroonex = gsap.utils.mapRange(0, bcr.width, 0, 1, dets.clientX - bcr.left);
                        var zerooney = gsap.utils.mapRange(0, bcr.height, 0, 1, dets.clientY - bcr.top);
                        gsap.to(elem, {
                            x: lerp(-50, 50, zeroonex),
                            y: lerp(-50, 50, zerooney),
                            duration: opts.duration || 1,
                            ease: opts.ease || Expo.easeOut
                        })
                    })

                    elem.addEventListener("mouseleave", function (dets) {
                        gsap.to(elem, {
                            x: 0,
                            y: 0,
                            duration: opts.duration || 1,
                            ease: opts.ease || Expo.easeOut
                        })
                    })
                })
        },
        textAnimate: function (element, opts = {}) {
            var alltexts = document.querySelectorAll(element);
            alltexts.forEach(function (elem) {
                elem.classList.add("sheryelem")
                var clutter = "";
                elem
                    .textContent
                    .split("")
                    .forEach(function (char) {
                        clutter += `<span>${char}</span>`
                    })
                elem.innerHTML = clutter;
            })
            switch (opts.style || 1) {
                case 1:
                    alltexts.forEach(function (elem) {
                        gsap.from(elem.childNodes, {
                            scrollTrigger: {
                                trigger: elem,
                                start: "top 80%"
                            },
                            y: opts.y || 10,
                            stagger: opts.delay || .1,
                            opacity: 0,
                            duration: opts.duration || 2,
                            ease: opts.ease || Expo.easeOut
                        })
                    })
                    break;
                case 2:
                    alltexts.forEach(function (elem, i) {
                        var len = elem.childNodes.length - 1;
                        for (var i = 0; i < elem.childNodes.length / 2; i++) {
                            elem.childNodes[i].dataset.delay = i;
                        }
                        for (var i = Math.floor(elem.childNodes.length / 2); i < elem.childNodes.length; i++) {
                            elem.childNodes[i].dataset.delay = len - i;
                        }
                        elem.childNodes.forEach(function(al){
                            gsap.from(al, {
                                y: 20,
                                delay: al.dataset.delay*(opts.multiplier||.1),
                                opacity: 0,
                                ease: opts.ease||Expo.easeOut
                            });
                        })
                    })
                    break;
                default:
                    console.warn("SheryJS : no such style available for text, mentioned in textanimate()")
            }



        }
    }
};