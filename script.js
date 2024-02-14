import {VRButton} from './node_modules/webXR/VRButton.js'
// import {GLTFLoader} from './node_modules/addons/loaders/GLTFLoader.js' not working
function normalize(val, min, max) {
    return Math.max(0, Math.min(1, (val - min) / (max - min)));
}
function normalizeQuadIn(val, min, max) {
    return Math.pow(normalize(val, min, max), 2.0);
}
function zTween(_val, _target, _ratio) {
    return _val + (_target - _val) * Math.min(_ratio, 1.0);
}

//3d model car not working
// const loader = new GLTFLoader();

// loader.load( './3dmodels/mercedes/uploads_files_2787791_Mercedes+Benz+GLS+580.fbx', function ( gltf ) {

// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

// Set up the window
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable VR
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Camera position
camera.position.set(0, 4, 5);
camera.lookAt(0, 0, 0);

// A blue prism for testing and demostration
const geometry0 = new THREE.BoxGeometry(1, 5, 1);
const material0 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const prism = new THREE.Mesh(geometry0, material0);
scene.add(prism);

// Bus (A Rectangular Prism for now)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const bus = new THREE.Mesh(geometry, material);
scene.add(bus);

// A class that hold all the properties about the bus
class Bus_Prop {
    //Constants
    Accel = 5;                          // Acceleration of the bus
    Decel = -10;                        // Deceleration of the bus
    MaxVel = (70 * 1610) / 3600;        // Maximum Velocity of the bus
    MaxTurn = Math.PI * 0.20;           // Maximum angle of wheel turn
    Length = 5.250;                     // Length of the bus
    Width = 2.283;                      // Width of the bus
    WheelTrack = 1.72;                  // Wheel track
    WheelBase = 3.200;                  // Wheel base
    WheelDiam = 0.780;                  // Wheel diameter
    WheelCirc = 0.780 * Math.PI;        // Wheel circumference
    
    //Variables
    time = 0.01;                        // Time elapsed since last update in seconds
    velocity = new THREE.Vector2();     // Current linear velocity vector of the bus
    speed = 0;                          // Current speed of the bus
    accel = 0;                          // Current acceleration of the bus
    pos = new THREE.Vector2();          // Position of the bus
    joyVec = new THREE.Vector2();       // Related to joystick input, not implemented yet
    keys = new Array();                 // An array that holds the keycodes of each key input
    
    // Momentum
    longitMomentum = 0;                 // Longitude momentum of the bus
    lateralMomentum = 0;                // Lateral momentum of the bus
    wAngleInner = 0;                    // Inner wheel angle of the bus
    wAngleOuter = 0;                    // Outer wheel angle of the bus
    wAngleTarg = 0;
    omega = 0;                          // Angular velocity of the bus
    theta = -Math.PI / 2;               // Angle of rotation of the bus

    // Functions related to keyboard input
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
                case 87:// W
                    this.accel += this.Accel;
                    // Simulate wind resistance as the bus reaches top speed
                    this.accel *= normalizeQuadIn(this.speed, this.MaxVel, this.MaxVel - 10);
                    break;
                case 83:// S
                    this.accel += this.Decel;
                    break;
                case 65:// A
                    this.wAngleTarg += this.MaxTurn;
                    break;
                case 68:// D
                    this.wAngleTarg -= this.MaxTurn;
                    break;
            }
        }
    }

    // // Functions related to joystick input
    // onJoystickMove(_vec) {
    //     this.joyVec.x = _vec.x / -40;
    //     this.joyVec.y = _vec.y / -40;
    //     if (Math.abs(this.joyVec.x) > 0.85) {
    //         this.joyVec.y = 0;
    //     }
    //     if (Math.abs(this.joyVec.y) > 0.95) {
    //         this.joyVec.x = 0;
    //     }
    // };
    // readJoyStickInput() {
    //     this.wAngleTarg = this.joyVec.x * this.MaxTurn;
    //     //Accelerating
    //     if (this.joyVec.y >= 0) {
    //         this.accel = this.joyVec.y * this.Accel;
    //         // Simulate wind resistance as we reach top speed
    //         this.accel *= normalizeQuadIn(this.speed, this.MaxVel, this.MaxVel - 10);
    //         this.braking = 0;
    //     }
    //     else {
    //         this.accel = this.joyVec.y * -this.Decel;
    //         this.braking = 1;
    //     }
    // };

    // Functions related to game update
    update() {
        this.accel = 0;
        this.wAngleTarg = 0;

        if (this.keys.length > 0) {
            this.readKeyboardInput();
        }
        // Related to joystick input, not implemented yet
        // else if (this.joyVec.x != 0 || this.joyVec.y != 0) {
        //     this.readJoyStickInput();
        // }

        // Physics
        this.accel *= this.time;
        this.speed += this.accel;
        // if (this.speed < 0) {
        //     this.speed = 0;
        //     this.accel = 0;
        // }
        if (this.speed < -5) {
            this.speed = -5;
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
        // Calculate the XY velocity
        this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
        // Add velocity to position
        this.pos.add(this.velocity);
        
        //console.log(this.pos);        // For debugging

        // Update the bus's position and rotation
        bus.position.x = -this.pos.x;
        bus.position.z = -this.pos.y;
        bus.rotation.y = this.theta; 
        // Update camera view
        camera.position.set(bus.position.x + 5 * Math.sin(this.theta+Math.PI/2), 4, bus.position.z + 5 * Math.cos(this.theta+Math.PI/2));
        camera.lookAt(bus.position);

        //Momentum for the bus body, not sure if we will implement this
        this.longitMomentum = zTween(this.longitMomentum, this.accel / this.time, this.time * 6);
        this.lateralMomentum = this.omega * this.speed;
        if (this.wAngleSign) {
            // Calculate     4 wheel turning radius if angle
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

        return true;
    }
}

// Make an instance of the class, and add event listeners to track key input
const Bus1 = new Bus_Prop();
window.addEventListener("keydown", Bus1.onKeyDown.bind(Bus1));
window.addEventListener("keyup", Bus1.onKeyUp.bind(Bus1));

// Animation loop
function animate() {
    renderer.setAnimationLoop(() => {
        Bus1.update();
        renderer.render(scene, camera);
    });
}

animate();
