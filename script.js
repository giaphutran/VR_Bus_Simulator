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
const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // Adjusted size for visibility
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

camera.position.set(0, 4, 5);
camera.lookAt(0, 0, 0);

// Cube (Rectangular Prism)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function normalize(val, min, max) {
    return Math.max(0, Math.min(1, (val - min) / (max - min)));
}
function normalizeQuadIn(val, min, max) {
    return Math.pow(normalize(val, min, max), 2.0);
}
function zTween(_val, _target, _ratio) {
    return _val + (_target - _val) * Math.min(_ratio, 1.0);
}

class Cube {
    Accel = 5; // m/s^2
    Decel = -10; // m/s^2
    MaxVel = (70 * 1610) / 3600; // 70m/h ~= 31.3m/s
    MaxTurn = Math.PI * 0.20; // Max angle of wheel turn
    Length = 5.250; // Car length
    Width = 2.283; // Car width
    WheelTrack = 1.72; // Wheel track
    WheelBase = 3.200; // Wheel base
    WheelDiam = 0.780; // Wheel diameter
    WheelCirc = 0.780 * Math.PI; // Wheel circumference
    
    time = 0.01;
    velocity = new THREE.Vector2();
    speed = 0;
    accel = 0;
    pos = new THREE.Vector2();
    joyVec = new THREE.Vector2();
    // Momentim
    longitMomentum = 0;
    lateralMomentum = 0;
    wAngleInner = 0;
    wAngleOuter = 0;
    wAngleTarg = 0;
    keys = new Array();
    braking = 0.0;
    omega = 0;
    theta = -Math.PI / 2;

    onKeyDown(evt) {
        // Add key to list if they don't exist yet
        if (this.keys.indexOf(evt.keyCode) === -1) {
            this.keys.push(evt.keyCode);
        }
    }
    onKeyUp(evt) {
        //Otherwise, remove from keys list
        this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
    }
    readKeyboardInput() {
        for (var i = 0; i < this.keys.length; i++) {
            switch (this.keys[i]) {
                case 87:// Up
                    this.accel += this.Accel;
                    // Simulate wind resistance as we reach top speed
                    this.accel *= normalizeQuadIn(this.speed, this.MaxVel, this.MaxVel - 10);
                    break;
                case 83:// Down
                    this.accel += this.Decel;
                    this.braking = 1;
                    break;
                case 65:// Left
                    this.wAngleTarg += this.MaxTurn;
                    break;
                case 68:// Right
                    this.wAngleTarg -= this.MaxTurn;
                    break;
            }
        }
    }

    update = function (_time) {
        // Update time, skips according to FPS
        // if (this.time.update(_time) === false) {
        //     return false;
        // }
        this.accel = 0;
        this.braking = 0;
        this.wAngleTarg = 0;
        if (this.keys.length > 0) {
            this.readKeyboardInput();
        }
        // else if (this.joyVec.x != 0 || this.joyVec.y != 0) {
        //     this.readJoyStickInput();
        // }
        ///////////////// PHYSICS, YO! /////////////////
        this.accel *= this.time;
        this.speed += this.accel;
        if (this.speed < 0) {
            this.speed = 0;
            this.accel = 0;
        }
        this.frameDist = this.speed * this.time;
        // Limit turn angle as speed increases
        this.wAngleTarg *= normalizeQuadIn(this.speed, this.MaxVel + 10.0, 3.0);
        this.wAngleInner = zTween(this.wAngleInner, this.wAngleTarg, this.time * 2);
        this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
        // Theta is based on speed, wheelbase & wheel angle
        this.omega = this.wAngleInner * this.speed / this.WheelBase;
        this.theta += this.omega * this.time;
        // Calc this frame's XY velocity
        this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
        // Add velocity to total position
        this.pos.add(this.velocity);
        
        //console.log(this.pos);
        

        // Fake some momentum
        this.longitMomentum = zTween(this.longitMomentum, this.accel / this.time, this.time * 6);
        this.lateralMomentum = this.omega * this.speed;
        if (this.wAngleSign) {
            // Calculate 4 wheel turning radius if angle
            this.radFrontIn = this.WheelBase / Math.sin(this.wAngleInner);
            this.radBackIn = this.WheelBase / Math.tan(this.wAngleInner);
            this.radBackOut = this.radBackIn + (this.WheelTrack * this.wAngleSign);
            this.wAngleOuter = Math.atan(this.WheelBase / this.radBackOut);
            this.radFrontOut = this.WheelBase / Math.sin(this.wAngleOuter);
        }
        else {
            // Otherwise, just assign a very large radius.
            this.radFrontOut = 100;
            this.radBackOut = 100;
            this.radBackIn = 100;
            this.radFrontIn = 100;
            this.wAngleOuter = 0;
        }

        cube.position.x = -this.pos.x;
        cube.position.z = -this.pos.y;
        cube.rotation.y = this.theta;
        return true;
    }
}

// const keyStates = {};

// window.addEventListener('keydown', (event) => keyStates[event.key] = true);
// window.addEventListener('keyup', (event) => keyStates[event.key] = false);

// function moveCube() {
//     if (keyStates['w'] || keyStates['ArrowUp']) {
//         speed -= 0.02;
//     }
//     if (keyStates['a'] || keyStates['ArrowLeft']) {
//         cube.position.x -= 0.1;

// 		//cube.rotation.y+=0.03;
		
//     }
//     if (keyStates['s'] || keyStates['ArrowDown']) {
//         speed += 0.02;
//     }
//     if (keyStates['d'] || keyStates['ArrowRight']) {
//         cube.position.x += 0.1;
//     }
    
// }
const Cube1 = new Cube();
window.addEventListener("keydown", Cube1.onKeyDown.bind(Cube1));
window.addEventListener("keyup", Cube1.onKeyUp.bind(Cube1));


function animate() {
    renderer.setAnimationLoop(() => {
        Cube1.update();
        //moveCube();
        renderer.render(scene, camera);
    });
}

animate();

