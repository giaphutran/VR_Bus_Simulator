
import {VRButton} from './node_modules/webXR/VRButton.js'
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//add VRButton
document.body.appendChild(VRButton.createButton(renderer));

//tell WebGLRenderer to enable XR rendering
renderer.xr.enabled=true;


// Ground plane for reference
const planeGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
scene.add(plane);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Rectangular prism (BoxGeometry)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the camera
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

//Making the cube turn using arrow keys
function onDocumentKeydown(event){
	var keyCode=event.which;
	//arrow right - turn right
	if (keyCode==39){
		cube.position.x+=0.1;
		cube.rotation.y+=0.1;
	}
	//arrow left - turn left
	if (keyCode==37){
		cube.position.x-=0.1;
		cube.rotation.y=-0.1;
	}

}
document.addEventListener('keydown',onDocumentKeydown,false);

// Animate the prism moving forward
function animate() {
    requestAnimationFrame(animate);

    // Move the prism forward by modifying its z position
    cube.position.z -= 0.05;

	//adjust animation loop for vr
	renderer.setAnimationLoop( function(){renderer.render(scene, camera);});
}


animate();


