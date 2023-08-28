varying vec2 vuv;
void main(){
    vuv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);
}
