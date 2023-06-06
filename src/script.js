import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColor = textureLoader.load("/textures/door/color.jpg");
const doorNormal = textureLoader.load("/textures/door/normal.jpg");
const doorAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorRoughNess = textureLoader.load("/textures/door/roughness.jpg");
const doorMetalNess = textureLoader.load("/textures/door/metalness.jpg");
const doorHeight = textureLoader.load("/textures/door/height.jpg");
const doorAO = textureLoader.load("/textures/door/ambientOcclusion.jpg");

const brickColor = textureLoader.load("/textures/bricks/color.jpg");
const brickNormal = textureLoader.load("/textures/bricks/normal.jpg");
const brickRoughNess = textureLoader.load("/textures/bricks/roughness.jpg");
const brickAO = textureLoader.load("/textures/bricks/ambientOcclusion.jpg");

const grassColor = textureLoader.load("/textures/grass/color.jpg");
const grassNormal = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughNess = textureLoader.load("/textures/grass/roughness.jpg");
const grassAO = textureLoader.load("/textures/grass/ambientOcclusion.jpg");

//?Repeat Textures
grassColor.repeat.set(8, 8);
grassNormal.repeat.set(8, 8);
grassRoughNess.repeat.set(8, 8);
grassAO.repeat.set(8, 8);

grassColor.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassRoughNess.wrapS = THREE.RepeatWrapping;
grassAO.wrapS = THREE.RepeatWrapping;

grassColor.wrapT = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassRoughNess.wrapT = THREE.RepeatWrapping;
grassAO.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColor,
    aoMap: brickAO,
    normalMap: brickNormal,
    roughnessMap: brickRoughNess,
  })
);

//! Set UV2 attributes for aoMapping
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;

house.add(walls);

/** Rooftop */
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColor,
    alphaMap: doorAlpha,
    transparent: true,
    aoMap: doorAO,
    displacementMap: doorHeight,
    displacementScale: 0.1,
    normalMap: doorNormal,
    metalnessMap: doorMetalNess,
    roughnessMap: doorRoughNess,
  })
);

//! Set UV2 attributes for aoMapping
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2 + 0.01;
door.position.y = 1;
// door.rotation.z = Math.PI * 0.5;
house.add(door);

/**
 * Bush
 */
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.4, 0.4, 0.4);
bush1.position.set(1.4, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.2, 0.2, 0.2);
bush2.position.set(1.9, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.3, 0.3, 0.3);
bush3.position.set(-1.9, 0.1, 2.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.4, 0.4, 0.4);
bush4.position.set(-1.5, 0.1, 2.1);

house.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */

const graves = new THREE.Group();
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
scene.add(graves);

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.2, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  //Enable Shadow

  grave.castShadow = true;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColor,
    aoMap: grassAO,
    normalMap: grassNormal,
    roughnessMap: grassRoughNess,
  })
);

//! Set UV2 attributes for aoMapping
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Fog
 */

const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

//! Enable Shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
moonLight.castShadow = true;
doorLight.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

floor.receiveShadow = true;

//!Optimize the shadow

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  camera.position.x = Math.sin(elapsedTime) * 10;
  camera.position.z = Math.cos(elapsedTime) * 10;

  controls.update();

  //Move Ghosts
  const ghost1Angle = elapsedTime * 0.5;

  ghost1.position.x = Math.sin(ghost1Angle) * 4;
  ghost1.position.z = Math.cos(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5);

  const ghost2Angle = -elapsedTime * 0.7;

  ghost2.position.x = Math.sin(ghost2Angle) * 4.5;
  ghost2.position.z = Math.cos(ghost2Angle) * 4.5;
  ghost2.position.y = Math.sin(elapsedTime * 4.5) + Math.sin(elapsedTime * 4);

  const ghost3Angle = elapsedTime * 0.7;

  ghost3.position.x =
    Math.sin(ghost3Angle) * (5 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.y = Math.sin(elapsedTime * 6) + Math.sin(elapsedTime * 3);

  //Camera

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
