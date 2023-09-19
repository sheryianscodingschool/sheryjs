uniform sampler2D uTexture[16];
uniform float scrollType,displaceAmount,uScroll,uSection,time;
uniform bool isMulti,masker,noEffectGooey,uColor;
uniform vec2 mousei;
varying float vWave;
uniform float uIntercept,maskVal,aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;

#define SNOISEHOLDER
varying vec2 vuv;
void main(){
    vec2 uv=vuv;
    uv=uv*2.-1.;
    uv=masker?mix(uv,uv/max(1.,maskVal),uIntercept):uv/max(1.,maskVal);
    uv=uv*.5+.5;
    gl_FragColor=texture2D(uTexture[0],uv);
    vec2 uv2=noEffectGooey?vuv:uv;
    !isMulti;
    gl_FragColor=uColor?mix(gl_FragColor,vec4(1.),vWave):gl_FragColor;   
}