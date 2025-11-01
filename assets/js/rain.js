import * as THREE from 'three';

function initRainScene() {
    // Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const canvasContainer = document.getElementById('canvas-container');
    const target = canvasContainer || document.body;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    target.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Rain-themed particles (water droplets)
    const rainParticlesGeometry = new THREE.BufferGeometry();
    const rainParticlesCount = 2000;
    const rainPosArray = new Float32Array(rainParticlesCount * 3);

    for (let i = 0; i < rainParticlesCount * 3; i++) {
        rainPosArray[i] = (Math.random() - 0.5) * 100;
    }

    rainParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(rainPosArray, 3));
    const rainParticlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const rainParticlesMesh = new THREE.Points(rainParticlesGeometry, rainParticlesMaterial);
    scene.add(rainParticlesMesh);

    // Cloud-like spheres
    const cloudGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const cloudGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.4, 16, 16);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6,
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.1,
            transparent: true,
            opacity: 0.1,
            wireframe: false
        });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        cloud.userData.velocity = {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        };
        cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // Data visualization - geometric shapes representing ML pipeline
    const dataVisualization = new THREE.Group();

    // Torus for data pipeline
    const torusGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        wireframe: true,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.x = 3;
    dataVisualization.add(torus);

    scene.add(dataVisualization);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Camera movement
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;

        // Rotate data visualization
        dataVisualization.rotation.x += 0.002;
        dataVisualization.rotation.y += 0.003;

        // Animate rain particles (falling effect)
        const rainPositions = rainParticlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < rainPositions.length; i += 3) {
            rainPositions[i + 1] -= 0.1; // Fall down

            // Reset to top when reaching bottom
            if (rainPositions[i + 1] < -50) {
                rainPositions[i + 1] = 50;
            }
        }
        rainParticlesMesh.geometry.attributes.position.needsUpdate = true;
        rainParticlesMesh.rotation.y += 0.0002;

        // Animate clouds
        cloudGroup.children.forEach(cloud => {
            cloud.position.x += cloud.userData.velocity.x;
            cloud.position.y += cloud.userData.velocity.y;
            cloud.position.z += cloud.userData.velocity.z;

            // Bounce within bounds
            if (Math.abs(cloud.position.x) > 15) cloud.userData.velocity.x *= -1;
            if (Math.abs(cloud.position.y) > 15) cloud.userData.velocity.y *= -1;
            if (Math.abs(cloud.position.z) > 15) cloud.userData.velocity.z *= -1;

            // Pulse effect
            const scale = 1 + Math.sin(Date.now() * 0.001 + cloud.position.x) * 0.1;
            cloud.scale.set(scale, scale, scale);
        });

        // Animate lights
        const time = Date.now() * 0.001;
        pointLight1.position.x = Math.sin(time * 0.5) * 5;
        pointLight1.position.y = Math.cos(time * 0.3) * 5;
        pointLight2.position.x = Math.cos(time * 0.4) * 5;
        pointLight2.position.z = Math.sin(time * 0.6) * 5;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Handle iframe loading
    const demoIframe = document.getElementById('demoIframe');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const fallbackMessage = document.getElementById('fallbackMessage');
    const demoContainer = document.getElementById('demoContainer');

    if (demoIframe && loadingIndicator && fallbackMessage && demoContainer) {
        let loadTimeout;

        // Show loading indicator initially
        loadingIndicator.style.display = 'block';

        // Set a timeout to show fallback if iframe doesn't load
        loadTimeout = setTimeout(() => {
            loadingIndicator.style.display = 'none';
            fallbackMessage.classList.add('show');
        }, 10000); // 10 seconds timeout

        // If iframe loads successfully
        demoIframe.addEventListener('load', () => {
            clearTimeout(loadTimeout);

            // Wait a bit to ensure content is rendered
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                demoContainer.classList.add('iframe-loaded');
            }, 1000);
        });

        // If iframe fails to load
        demoIframe.addEventListener('error', () => {
            clearTimeout(loadTimeout);
            loadingIndicator.style.display = 'none';
            fallbackMessage.classList.add('show');
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRainScene, { once: true });
} else {
    initRainScene();
}


