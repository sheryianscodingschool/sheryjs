uniform bool uColor,isMulti;
uniform sampler2D uTexture[16];
varying vec2 vUv;
varying float vWave;
uniform float uScroll,uSection,time;
#define SNOISEHOLDER
void main(){
    vec2 uv=vUv;
    gl_FragColor=uColor?mix(texture2D(uTexture[0],vUv),vec4(1.),vWave):texture2D(uTexture[0],vUv);
    isMulti;
}