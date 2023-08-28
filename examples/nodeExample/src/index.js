import './styles.css'
import Shery from '../.././../src/Shery'

Shery.mouseFollower()

Shery.hoverWithMediaCircle('#cta', {
    images: ['https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80']
})


Shery.imageMasker('#cts', { 
    mouseFollower: true,
    text: 'Shery',
    duration: 1
})


Shery.makeMagnet('#left-main-nav img, #left-main-nav a, #right-main-nav a')

Shery.textAnimate('#left-main-nav h4', { style: 1 })

Shery.imageEffect('#page-1-right',{
    style:2,
    config:{"distortion":{"value":true},"mode":{"value":7},"mousemove":{"value":0},"modeA":{"value":0},"modeN":{"value":2},"speed":{"value":10,"range":[-500,500],"rangep":[-10,10]},"frequency":{"value":800,"range":[-800,800],"rangep":[-50,50]},"angle":{"value":0,"range":[0,3.141592653589793]},"waveFactor":{"value":0,"range":[-3,3]},"color":{"value":0},"pixelStrength":{"value":-20,"range":[-20,100],"rangep":[-20,20]},"quality":{"value":1.54,"range":[0,10]},"contrast":{"value":1,"range":[-25,25]},"brightness":{"value":1,"range":[-1,25]},"colorExposer":{"value":0.18,"range":[-5,5]},"strength":{"value":-5,"range":[-40,40],"rangep":[-5,5]},"exposer":{"value":1,"range":[-100,100]},"onMouse":{"value":2},"geoVertex":{"value":1,"range":[1,64]}},
    staticScroll:true,
    debug:true
})