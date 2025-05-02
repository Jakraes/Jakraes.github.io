const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 40;
camera.position.x = -12;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('sphere-container').appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 0);

const dotTexture = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/sprites/disc.png'
);

const radius = 30;
const dotCount = 4000;

const geometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

for (let i = 0; i < dotCount; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = 2 * Math.PI * Math.random();

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);

    positions.push(x, y, z);

    const brightness = (z + radius) / (2 * radius);
    const dimColor = new THREE.Color("#ffffff").multiplyScalar(0.5 + brightness * 0.5);
    colors.push(dimColor.r, dimColor.g, dimColor.b);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.2,
    map: dotTexture,
    transparent: true,
    vertexColors: true,
    alphaTest: 0.493,
});

const sphere = new THREE.Points(geometry, material);

sphere.rotation.x = Math.PI / 5;
sphere.rotation.y = Math.PI / 5;

scene.add(sphere);

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.001;
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});