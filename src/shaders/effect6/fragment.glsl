
uniform sampler2D uTexture[16];
uniform float time,uScroll,uSection,isMulti;
varying vec2 vuv;
#define SNOISEHOLDER
float cnoise(vec2 P){return snoise(vec3(P,1.));}
void main(){
    vec2 uv=vuv;
    gl_FragColor=texture2D(uTexture[0],uv);
    isMulti;
}