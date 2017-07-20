vec3 glowColor = vec3(1.0, 1.0, 1.0);
float coeficient = .9;
float power = 1.0;

varying vec3 vVertexNormal;
varying vec3 vVertexWorldPosition;

void main(){

 vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
 vec3 viewCameraToVertex = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;

 viewCameraToVertex = normalize(viewCameraToVertex);

 // float intensity = 1.0 - sqrt(pow(vVertexNormal.x, 2.0) + pow(vVertexNormal.x, 2.0));
 // float intensity = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);
 float intensity = 1.0 - pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);

 gl_FragColor = vec4(glowColor, intensity);
}