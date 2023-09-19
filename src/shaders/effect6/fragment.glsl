precision mediump float;

uniform sampler2D uTexture[16];

uniform float maskVal,time,uIntercept,displaceAmount,scrollType,onMouse,uScroll,uSection,aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;
uniform bool isMulti,masker,noEffectGooey;
uniform vec2 mousei;
varying vec2 vuv;

uniform float noiseDetail;
uniform float distortionAmount;
uniform float scale,speed;

#define SNOISEHOLDER

void main(){
    vec2 uv=vuv;
    uv=uv*2.-1.;
    uv=masker?mix(uv,uv/max(1.,maskVal),uIntercept):uv/max(1.,maskVal);
    uv=uv*.5+.5;
    
    float x=uv.x*scale*(noiseDetail/100.)*sin(time)*speed;
    float y=uv.y*scale*(noiseDetail/100.)*cos(time)*speed;
    uv+=snoise(vec3(x,y,0.))*(distortionAmount/100.);
    gl_FragColor=texture2D(uTexture[0],uv);
    vec2 uv2=noEffectGooey?vuv:uv;
    !isMulti;
}