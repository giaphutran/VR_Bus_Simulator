
// import { RED_GREEN_RGTC2_Format } from 'three';
// import {VRButton} from './node_modules/webXR/VRButton.js'
// // Scene setup
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// //add VRButton
// document.body.appendChild(VRButton.createButton(renderer));

// //tell WebGLRenderer to enable XR rendering
// renderer.xr.enabled=true;


// // Ground plane for reference
// const planeGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
// const planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
// scene.add(plane);

// // Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 1, 0);
// scene.add(directionalLight);

// // Rectangular prism (BoxGeometry)
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// // Position the camera
// camera.position.set(0, 2, 5);
// camera.lookAt(0, 0, 0);

// //Making the cube move
// //Track key states
// const keyStates={
// 	'W':false,
// 	'A':false,
// 	'S':false,
// 	'D':false
// };
// //Update key states on key events
// //listen to both keydown and keyup to update key states
// function onKeyDown(event){
// 	const key=event.key.toUpperCase();
// 	if(key in keyStates){
// 		keyStates[key]=true;
// 	}
// }
// function onKeyUp(event){
// 	const key=event.key.toUpperCase();
// 	if (key in keyStates){
// 		keyStates[key]=false;
// 	}
// }

// //Move cube based on key state
// function moveCube(){
// 	if (keyStates['W']){
// 		cube.position.z-=0.1;
// 	}
// 	if (keyStates['A']){
// 		cube.position.x-=0.1;
// 	}
// 	if (keyStates['S']){
// 		cube.position.z+=0.1;
// 	}
// 	if (keyStates['D']){
// 		cube.position.x+=0.1;
// 	}
// }
// document.addEventListener('keydown',onKeyDown,false);
// document.addEventListener('keyup',onKeyUp,false);


// // Animate the prism moving forward
// function animate() {
//     requestAnimationFrame(animate);

	
//     // Move the prism forward by modifying its z position
//     //cube.position.z -= 0.05;

// 	//adjust animation loop for vr
// 	renderer.setAnimationLoop( function(){
// 		renderer.render(scene, camera);
// 		moveCube();
// 		}
		
// 		);
	
// }


// animate();

// Import statements might need to be adjusted based on your project setup
import {VRButton} from './node_modules/webXR/VRButton.js'

//setting up window
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable VR
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(100, 100); // Adjusted size for visibility
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Cube (Rectangular Prism)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

const keyStates = {};

window.addEventListener('keydown', (event) => keyStates[event.key] = true);
window.addEventListener('keyup', (event) => keyStates[event.key] = false);

function moveCube() {
    if (keyStates['w'] || keyStates['ArrowUp']) {
        cube.position.z -= 0.04;
    }
    if (keyStates['a'] || keyStates['ArrowLeft']) {
        cube.position.x -= 0.1;
		cube.position.z+=0.03;
		cube.rotation.y+=0.03;
		
    }
    if (keyStates['s'] || keyStates['ArrowDown']) {
        cube.position.z += 0.1;
    }
    if (keyStates['d'] || keyStates['ArrowRight']) {
        cube.position.x += 0.1;
    }
}

function animate() {
    renderer.setAnimationLoop(() => {
        moveCube();
        renderer.render(scene, camera);
    });
}

animate();

