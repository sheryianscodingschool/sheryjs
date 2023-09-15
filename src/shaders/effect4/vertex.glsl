varying vec2 vuv;
varying float vWave;
uniform float time,uFrequency,uAmplitude,uSpeed,uIntercept,scrollType,onMouse;
#define SNOISEHOLDER 
void main(){
    vuv=uv;
    vec3 pos=position;
    float noiseFreq=uFrequency;
    float noiseAmp=uAmplitude/10.;
    vec3 noisePos=vec3(pos.x*noiseFreq+time*uSpeed,pos.y,pos.z);
    pos.z+=snoise(noisePos)*noiseAmp;
    pos=onMouse==0.?pos:onMouse==1.?mix(position,pos,uIntercept):mix(pos,position,uIntercept);
    vWave=pos.z;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}