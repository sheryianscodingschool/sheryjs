float c=sin((sin(
            (uv.x+(time+uScroll*10.+snoise(vec3(uv,1.)))*.1)*
            (10.+uv.y)+
            snoise(vec3(uv,uScroll*10.)))
            /30.+(snoise(vec3(uv,1.))/10.)
        )+uv.y);
        