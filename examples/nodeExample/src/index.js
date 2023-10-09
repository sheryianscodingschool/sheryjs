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

Shery.imageEffect('#page-1-right', {
    style: 1,
    config: {"noiseDetail":{"value":7.44,"range":[0,100]},"distortionAmount":{"value":0,"range":[0,10]},"scale":{"value":0,"range":[0,100]},"speed":{"value":0,"range":[0,1]},"aspect":{"value":0.9963526653163148},"gooey":{"value":true},"displaceAmount":{"value":0.5},"masker":{"value":false},"maskVal":{"value":1,"range":[1,5]},"scrollType":{"value":0},"geoVertex":{"range":[1,64],"value":1},"noEffectGooey":{"value":true},"infiniteGooey":{"value":true},"onMouse":{"value":0},"noise_speed":{"value":0.2,"range":[0,10]},"metaball":{"value":0.19981698718672167,"range":[0,2]},"discard_threshold":{"value":0.5,"range":[0,1]},"antialias_threshold":{"value":0,"range":[0,0.1]},"noise_height":{"value":0.37,"range":[0,2]},"noise_scale":{"value":10,"range":[0,100]}},
    gooey:true
})