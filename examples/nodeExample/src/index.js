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
    style:6 ,
    debug:true,
    scrollSnapping:true,
    scrollSpeed:6,
    touchSpeed:6,
    damping:7,
    gooey:true,
})