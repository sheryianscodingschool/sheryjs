varying vec2 vuv;
void main(){
    gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
    vuv=uv;
}