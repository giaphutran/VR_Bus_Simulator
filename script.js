/*main();
function main() 
{
    // create the context
    const canvas = document.querySelector("canvas");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    })
	
	// create and set the camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);
	
	// create the scene
	const scene = new THREE.Scene();
	
	// Create the upright plane
    const planeWidth = 256;
    const planeHeight =  128;
	const planeGeometry = new THREE.PlaneGeometry(
            planeWidth,
            planeHeight
	);
	
	// Create the cube
	const cubeSize = 4;
	const cubeGeometry = new THREE.BoxGeometry(
		cubeSize,
		cubeSize,
		cubeSize
	);
		
	// Create the Sphere
	const sphereRadius = 3;
	const sphereWidthSegments = 32;
	const sphereHeightSegments = 16;
	const sphereGeometry = new THREE.SphereGeometry(
		sphereRadius,
		sphereWidthSegments,
		sphereHeightSegments
	);
	
	const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 'red'
    });
	
	const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x0088aa, 
      specular: 0x003344, 
      shininess: 100,
      flatShading: true,  // for flat-looking sides
      side: THREE.DoubleSide  // for drawing the inside of the tube
	});
	
	// MATERIALS and TEXTURES
	const textureLoader = new THREE.TextureLoader();
	const planeTextureMap = textureLoader.load('assets/pebbles.jpg');
	const planeMaterial = new THREE.MeshLambertMaterial({
        map: planeTextureMap,
		side: THREE.DoubleSide
    });

	// MESHES
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);
	
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    //scene.add(plane);
	
	//LIGHTS
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(0, 30, 30);
    scene.add(light);
	light.target = plane;
    scene.add(light.target);

	
	// DRAW
	function draw()
	{
		if (resizeGLToDisplaySize(gl)) 
		{
			const canvas = gl.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		cube.rotation.z += 0.01;
		
		sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        sphere.rotation.y += 0.01;

		gl.render(scene, camera);
		requestAnimationFrame(draw);
	}
	
    requestAnimationFrame(draw);
} // closing brace for main() function

function resizeGLToDisplaySize(gl)
{
	const canvas = gl.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width != width || canvas.height != height;
	if (needResize) 
	{
		gl.setSize(width, height, false);
	}
	
	return needResize;
}*/
//import * as THREE from 'three';
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
// 	requestAnimationFrame( animate );

// 	cube.rotation.x += 0.1;
// 	cube.rotation.y += 0.1;

// 	renderer.render( scene, camera );
// }

// animate();


// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground plane for reference
const planeGeometry = new THREE.PlaneGeometry(100, 100);
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

// Animate the prism moving forward
function animate() {
    requestAnimationFrame(animate);

    // Move the prism forward by modifying its z position
    cube.position.z -= 0.05;

    renderer.render(scene, camera);
}

animate();
