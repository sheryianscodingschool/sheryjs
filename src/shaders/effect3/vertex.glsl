uniform float uFrequencyX, uFrequencyY, uFrequencyZ, time, uIntercept;
uniform int onMouse;
varying vec2 vuv;
void main() {
    vec3 uFrequency = vec3(uFrequencyX / 500., uFrequencyY / 500., uFrequencyZ * 10.0);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.x - time) * uFrequency.z / 1000.0;
    elevation += sin(modelPosition.y * uFrequency.y - time) * uFrequency.z / 1000.0;
    modelPosition.z += elevation;
    modelPosition = onMouse == 0 ? modelPosition : onMouse == 1 ? mix(modelMatrix * vec4(position, 1.0), modelPosition, uIntercept) : mix(modelPosition, modelMatrix * vec4(position, 1.0), uIntercept);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vuv = uv;
}