precision mediump float;
varying vec2 vuv;
void main(){
    vec2 st=vuv/vec2(400.,400.);// Adjust the size accordingly
    vec3 color=vec3(0.);
    
    // Define the shape of digit 7
    float digit7=step(.15,st.x)*step(st.x,.2)*step(.05,st.y)*step(st.y,1.);
    
    color=mix(color,vec3(0.,1.,1.),digit7);
    
    gl_FragColor=vec4(color,1.);
}
