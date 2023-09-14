uniform sampler2D uTexture[16];
uniform float scrollType,displaceAmount,uScroll,uSection,time;
uniform bool isMulti;
uniform vec2 mousei;
uniform float aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;

#define SNOISEHOLDER
varying vec2 vuv;
void main(){
    vec2 uv=vuv;
    gl_FragColor=texture2D(uTexture[0],vuv);
    !isMulti;
}