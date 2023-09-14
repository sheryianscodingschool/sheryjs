precision mediump float;

uniform sampler2D uTexture[16];

uniform float time,uIntercept,displaceAmount,scrollType,onMouse,uScroll,uSection;
uniform bool isMulti;
uniform vec2 mousei;
uniform float aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;
varying vec2 vuv;

#define SNOISEHOLDER

void main(){
    vec2 uv=vuv;
    uv=uv*2.-1.;
    uv=mix(uv,uv/1.5,uIntercept);
    uv=uv*.5+.5;
    !isMulti;
}

