
uniform sampler2D uTexture[16];
uniform float maskVal,uIntercept,displaceAmount,scrollType,time,a,b,onMouse,uScroll,uSection;
uniform bool isMulti,masker,noEffectGooey;
uniform vec2 mousei;
uniform float aspect,noise_speed,metaball,discard_threshold,antialias_threshold,noise_height,noise_scale;
uniform vec2 mouse,mousem;
varying vec2 vuv;
#define SNOISEHOLDER
float cnoise(vec2 P){return snoise(vec3(P,1.));}
void main(){
    vec2 uv=(vuv/1.1)+.05;
    uv=uv*2.-1.;
    uv=masker?mix(uv,uv/max(1.,maskVal),uIntercept):uv/max(1.,maskVal);
    uv=uv*.5+.5;
    float time=time*a;
    vec2 surface=vec2(cnoise(uv-(mouse/2.)/7.+.2*time)*.08,cnoise(uv-(mouse/2.)/7.+.2*time)*.08);
    surface=onMouse==0.?surface:onMouse==1.?mix(vec2(0.),surface,uIntercept):mix(surface,vec2(0.),uIntercept);
    uv+=refract(vec2(mousem),surface,b);
    gl_FragColor=texture2D(uTexture[0],uv);
    vec2 uv2= noEffectGooey?vuv:uv;
    !isMulti;
}