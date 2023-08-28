uniform sampler2D uTexture[16];
uniform float uScroll,uSection,time;
uniform bool isMulti;
#define SNOISEHOLDER    
varying vec2 vUv;
void main(){
    vec2 uv=vUv;
    gl_FragColor=texture2D(uTexture[0],vUv);
    isMulti;
}