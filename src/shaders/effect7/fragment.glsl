
varying vec2 vuv;
uniform float maskVal,time,uIntercept,displaceAmount,scrollType,onMouse,uScroll,uSection,aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;
uniform bool isMulti,masker,noEffectGooey;
uniform vec2 mousei;
uniform float rotation,pattern,scale,density,clustering,gapping,smoothness,styling,circular,mouseMoveEWX,mouseMoveEHY;
uniform bool invert,autorotate,isTexture,mouseMove,gooey;
uniform vec3 color;
uniform sampler2D uTexture[16];

#define SNOISEHOLDER

void main()
{
    vec2 uv=vuv;
    uv=uv*2.-1.;
    uv=masker?mix(uv,uv/max(1.,maskVal),uIntercept):uv/max(1.,maskVal);
    uv=uv*.5+.5;
    vec2 uvx=uv;
    
    uv-=vec2(.5,.5);
    
    vec2 mousenew=vec2(mousei.x,1.-mousei.y);
    float m=mouseMove?smoothstep(mouseMoveEWX,mouseMoveEHY,length(uvx-mousenew)):1.;
    
    float rot=radians((rotation));
    rot-=radians((autorotate?time:0.));
    mat2 rotation_matrix=mat2(cos(rot),-sin(rot),sin(rot),cos(rot));
    uv=rotation_matrix*uv;
    vec2 scaled_uv=(1.-scale+1.)*uv;
    vec2 tile=fract(scaled_uv);
    float tile_dist=min(min(tile.x,1.-tile.x),min(tile.y,1.-tile.y));
    float square_dist=length(floor(scaled_uv));
    
    float edge=sin(time-square_dist*pattern);
    edge=mod(edge*edge,edge/edge);
    
    float value=mix(tile_dist,1.-tile_dist,step(density,edge));
    edge=pow(abs(1.-edge*m),clustering*m)*gapping;
    
    value=smoothstep(edge-smoothness*m,edge,styling*value);
    
    value+=square_dist*circular;
    
    vec4 t=texture2D(uTexture[0],uvx);
    vec4 col=isTexture?texture2D(uTexture[2],uvx):vec4(color,1.);
    if(isMulti&&!gooey){
        float c=(sin((uv.x*7.*snoise(vec3(uv,1.)))+(time))/15.*snoise(vec3(uv,1.)))+.01;
        float blend=uScroll-uSection;
        float blend2=1.-blend;
        vec4 imageA=texture2D(uTexture[0],vec2(uvx.x,uvx.y-(((texture2D(uTexture[0],uvx).r*displaceAmount)*blend)*2.)))*blend2;
        vec4 imageB=texture2D(uTexture[1],vec2(uvx.x,uvx.y+(((texture2D(uTexture[1],uvx).r*displaceAmount)*blend2)*2.)))*blend;
        gl_FragColor=scrollType==0.?mix(texture2D(uTexture[1],uvx),texture2D(uTexture[0],uvx),step((uScroll)-uSection,sin(c)+uvx.y)):imageA.bbra*blend+imageA*blend2+imageB.bbra*blend2+imageB*blend;
        gl_FragColor=invert?mix(gl_FragColor,col,value):mix(col,gl_FragColor,value);
        
    }else{
        gl_FragColor=invert?mix(t,col,value):mix(col,t,value);
        
    }
    
    if(gooey){
        vec2 pos=vec2(vuv.x,vuv.y/aspect);
        vec2 mouse=vec2(mousei.x,(1.-mousei.y)/aspect);
        vec2 interpole=mix(vec2(0),vec2(metaball,noise_height),uIntercept);
        float noise=(snoise(vec3(pos*noise_scale,time*noise_speed))+1.)/2.;
        float val=noise*interpole.y;
        float u=1.-smoothstep(interpole.x,.0,distance(mouse,pos));
        float mouseMetaball=clamp(1.-u,0.,1.);
        val+=mouseMetaball;
        float alpha=smoothstep(discard_threshold-antialias_threshold,discard_threshold,val);
        gl_FragColor=vec4(mix(gl_FragColor,invert?mix(texture2D(uTexture[1],uvx),col,value):mix(col,texture2D(uTexture[1],uvx),value),alpha));
    }
    
}
