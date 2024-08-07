// Hey so since my spaghetti code is so bad, I put the og code inside GPT so it can fix, here's the result
// It works btw

// Importing stuff
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Dom stuff
const aboutSection = document.querySelector(".aboutSection");
const keySpecsSection = document.querySelector(".keySpecsSection");
const pricingSection = document.querySelector(".pricingSection");
const contactSection = document.querySelector(".contactSection");

const aboutLink = document.querySelector(".aboutLink");
const keySpecsLink = document.querySelector(".keySpecsLink");
const pricingLink = document.querySelector(".pricingLink");
const contactLink = document.querySelector(".contactLink");
const okayButton = document.querySelector(".contactSection > button");

// Variable stuff
let modelObj = null;
let modelObj2 = null;
let modelObj3 = null;
let modelObj4 = null;
let lastTime = document.timeline.currentTime;
let lastTime2 = document.timeline.currentTime;
let lastTime3 = document.timeline.currentTime;
let lastTime4 = document.timeline.currentTime;

// Scene and camera stuff
const scenes = [new THREE.Scene(), new THREE.Scene(), new THREE.Scene(), new THREE.Scene()];
const cameras = scenes.map(() => new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000));
const renderers = scenes.map(() => new THREE.WebGLRenderer({ alpha: true }));

cameras[0].position.set(0, 0, 2);
cameras[1].position.set(0, 0, 1.5);
cameras[2].position.set(0, 0, 1.5);
cameras[3].position.set(0, 0.55, 1.5);

renderers[0].setSize(window.innerWidth, window.innerHeight);
renderers[1].setSize(window.innerWidth, window.innerHeight);
renderers[2].setSize(window.innerWidth, window.innerHeight);
renderers[3].setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderers[0].domElement);
aboutSection.appendChild(renderers[1].domElement);
keySpecsSection.appendChild(renderers[2].domElement);
pricingSection.appendChild(renderers[3].domElement);

// Lighting stuff
// This is the only section where GPT messed up, so I have to use the OG code
const ambientlight = new THREE.AmbientLight( 0xEAEAEA );
const ambientlight2 = new THREE.AmbientLight( 0xEAEAEA );
const ambientlight3 = new THREE.AmbientLight( 0xEAEAEA );
const ambientlight4 = new THREE.AmbientLight( 0xEAEAEA );

scenes[0].add( ambientlight );
scenes[1].add( ambientlight2 );
scenes[2].add( ambientlight3 );
scenes[3].add( ambientlight4 );

const spotLight = new THREE.SpotLight( 0x8984E6, 20, 10 );
const spotLightb = new THREE.SpotLight( 0x0000FF, 50, 10 );
const spotLightc = new THREE.SpotLight( 0x0000FF, 5, 10 );
const spotLightd = new THREE.SpotLight( 0x0000FF, 50, 10 );

spotLight.position.set( 1, 1, 1 );
spotLightb.position.set( 2, 0.5, 2 );
spotLightc.position.set( -1, -1, -1 );
spotLightd.position.set( 2, 0.5, 2 );

scenes[0].add( spotLight );
scenes[1].add( spotLightb );
scenes[2].add( spotLightc );
scenes[3].add( spotLightd );

const spotLight2 = new THREE.SpotLight( 0xFFFDD7, 10, 10 );
const spotLight2b = new THREE.SpotLight( 0xFF0000, 10, 10 );
const spotLight2c = new THREE.SpotLight( 0x00FF00, 5, 10 );
const spotLight2d = new THREE.SpotLight( 0x00FF00, 10, 10 );


spotLight2.position.set( -1, 1, 1 );
spotLight2c.position.set( 1, 1, 1 );
scenes[0].add( spotLight2 );
scenes[1].add( spotLight2b );
scenes[2].add( spotLight2c );
scenes[3].add( spotLight2d );


// Loading 3D models with scale position rotation setting for each
const loader = new GLTFLoader();
const modelUrls = [
    '3dModel/the_chonker_gwa_gwa_cat/scene.gltf',
    '3dModel/the_chonker_gwa_gwa_cat/scene.gltf',
    '3dModel/gwagwaWireframe/gwagwaWireFrame.glb',
    '3dModel/the_chonker_gwa_gwa_cat/scene.gltf'
];

// List that stores object, pretty cool GPT
const modelSettings = [
    { scale: [1.75, 1.75, 1.75], position: [0, -0.25, 0], rotation: [0, 0, 0] },
    { scale: [1.5, 1.5, 1.5], position: [0.6, 0, 0], rotation: [0.1, 0, -0.5] },
    { scale: [1.25, 1.25, 1.25], position: [-0.45, 0, 0], rotation: [0, 0, 0] },
    { scale: [0.3, 0.25, 0.25], position: [0, 0, 0], rotation: [0, 0, 0] }
];

modelUrls.forEach((url, index) => {
    loader.load(url, function(gltf) {
        const model = gltf.scene;
        model.scale.set(...modelSettings[index].scale);
        model.position.set(...modelSettings[index].position);
        model.rotation.set(...modelSettings[index].rotation);
        scenes[index].add(model);

        if (index === 0) modelObj = model;
        if (index === 1) modelObj2 = model;
        if (index === 2) modelObj3 = model;
        if (index === 3) modelObj4 = model;

        renderers[index].render(scenes[index], cameras[index]);
    });
});

// Bunch of event listeners here
// Even though this is GPT rewritten my spagetti code, I did not know this works too wow
// The more you know :D
const linkHandlers = [
    { link: aboutLink, section: aboutSection },
    { link: keySpecsLink, section: keySpecsSection },
    { link: pricingLink, section: pricingSection },
    { link: contactLink, section: contactSection }
];

linkHandlers.forEach(({ link, section }) => {
    link.addEventListener("click", () => section.scrollIntoView());
});

contactLink.addEventListener("click", () => {
    contactSection.classList.add("isContactOpen");
    document.body.classList.add("isNotScrollable");
});

okayButton.addEventListener("click", () => {
    contactSection.classList.remove("isContactOpen");
    document.body.classList.remove("isNotScrollable");
});

window.addEventListener("resize", () => {
    renderers.forEach(renderer => renderer.setSize(window.innerWidth, window.innerHeight));
    cameras.forEach(camera => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});

// Animation stuff
// For that cat spinning
// Using list to store functions and then do a for each loop? Holy moly this is pretty good
const animateFunctions = [
    function animate1() {
        requestAnimationFrame(animate1);
        if (document.timeline.currentTime - lastTime > 1000 / 60) {
            renderers[0].render(scenes[0], cameras[0]);
            modelObj.rotation.y -= 0.01;
            lastTime = document.timeline.currentTime;
        }
    },
    function animate2() {
        requestAnimationFrame(animate2);
        if (document.timeline.currentTime - lastTime2 > 1000 / 60) {
            const maxRotation = -Math.PI / 10;
            const oscillationAngle = Math.sin(document.timeline.currentTime / 2000);
            const mappedRotation = -Math.PI / 1.5 + oscillationAngle * maxRotation;
            modelObj2.rotation.y = mappedRotation;
            renderers[1].render(scenes[1], cameras[1]);
            lastTime2 = document.timeline.currentTime;
        }
    },
    function animate3() {
        requestAnimationFrame(animate3);
        if (document.timeline.currentTime - lastTime3 > 1000 / 60) {
            modelObj3.rotation.y += 0.01;
            modelObj3.rotation.x += 0.01;
            modelObj3.rotation.z += 0.01;
            renderers[2].render(scenes[2], cameras[2]);
            lastTime3 = document.timeline.currentTime;
        }
    },
    function animate4() {
        requestAnimationFrame(animate4);
        if (document.timeline.currentTime - lastTime4 > 1000 / 60) {
            modelObj4.rotation.y -= 0.1;
            renderers[3].render(scenes[3], cameras[3]);
            lastTime4 = document.timeline.currentTime;
        }
    }
];

// Wow GPT really cleans my code from 274 lines to 200-ish lines
animateFunctions.forEach(func => func());

// If this is not allowed, just tell me so I can revert back to my old spaghetti bolognese code thx bye