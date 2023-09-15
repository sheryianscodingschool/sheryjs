precision mediump float;

uniform sampler2D uTexture[16];

uniform float maskVal,time,uIntercept,displaceAmount,scrollType,onMouse,uScroll,uSection,aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;
uniform bool isMulti,masker;
uniform vec2 mousei;
varying vec2 vuv;

#define SNOISEHOLDER

void main(){
    vec2 uv=vuv;
    uv=uv*2.-1.;
    uv=masker?mix(uv,uv/max(1.0,maskVal),uIntercept):uv/max(1.0,maskVal);
    uv=uv*.5+.5;
    !isMulti;
}

