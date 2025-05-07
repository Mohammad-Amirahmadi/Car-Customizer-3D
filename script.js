import * as THREE from "three";
import {
    WebGLRenderer
} from "three";
import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";
import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("canvas.threeD");
const colorPicker = document.getElementById("colorPicker");

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const gridhelper = new THREE.GridHelper(100, 100);
scene.add(gridhelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
    70,
    sizes.width / sizes.height,
    0.1,
    2000
);
camera.position.set(1, 2, 5);
scene.add(camera);

const renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

let carBodyMaterials = [];

const gltfloader = new GLTFLoader();
gltfloader.load(
    './models/2019_lbworks_bmw_i8_ver.2.glb',
    (gltf) => {
        const carModel = gltf.scene;
        carModel.scale.set(100, 100, 100);
        scene.add(carModel);

        carModel.traverse((child) => {
            if (child.isMesh && child.material) {
                const materialName = child.material.name;

                if (
                    materialName.includes("Paint_Material") ||
                    materialName.includes("bBMW_LBi8RewardRecycled_2017Paint_Material1_0")
                ) {
                    const newMaterial = new THREE.MeshPhysicalMaterial({
                        color: child.material.color,
                        metalness: 0.5,
                        roughness: 0.3,
                        clearcoat: 0.8,
                        clearcoatRoughness: 0.1,
                        reflectivity: 0.7,
                    });

                    child.material = newMaterial;
                    carBodyMaterials.push(newMaterial);
                }
            }
        });
    },
    undefined,
    (error) => {
        console.log('Error loading model:', error);
    }
);

colorPicker.addEventListener("input", (e) => {
    const newColor = e.target.value;
    carBodyMaterials.forEach((material) => {
        material.color.set(newColor);
    });
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
