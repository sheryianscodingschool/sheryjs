uniform bool uColor,isMulti,masker;
uniform sampler2D uTexture[16];
uniform vec2 mousei;
uniform float maskVal,aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;

varying vec2 vuv;
varying float vWave;
uniform float uScroll,uSection,time,scrollType,uIntercept;
#define SNOISEHOLDER
void main(){
    vec2 uv=vuv;
    uv=uv*2.-1.;
    uv=masker?mix(uv,uv/max(1.,maskVal),uIntercept):uv/max(1.,maskVal);
    uv=uv*.5+.5;
    gl_FragColor=uColor?mix(texture2D(uTexture[0],vuv),vec4(1.),vWave):texture2D(uTexture[0],vuv);
    !isMulti;
}