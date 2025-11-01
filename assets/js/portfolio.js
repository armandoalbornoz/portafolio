const MAX_DEVICE_PIXEL_RATIO = 1.5;
const SMALL_VIEWPORT_WIDTH = 760;
const SMALL_VIEWPORT_HEIGHT = 600;

let threeModulePromise;

function loadThreeModule() {
    if (!threeModulePromise) {
        threeModulePromise = import('three');
    }
    return threeModulePromise;
}

function shouldDisableThreeScene() {
    if (typeof window === 'undefined') {
        return false;
    }

    const supportsMatchMedia = typeof window.matchMedia === 'function';
    const prefersReducedMotion = supportsMatchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    return prefersReducedMotion;
}

async function initPortfolioScene() {
    const canvasContainer = document.getElementById('canvas-container');

    if (!canvasContainer) {
        return;
    }

    const threeEnabled = !shouldDisableThreeScene();
    const body = document.body;
    if (body) {
        body.classList.toggle('reduced-visuals', !threeEnabled);
    }

    if (!threeEnabled) {
        canvasContainer.classList.add('three-disabled');
    } else {
        canvasContainer.classList.remove('three-disabled');
        try {
            const THREE = await loadThreeModule();

        // Three.js Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO));
        canvasContainer.appendChild(renderer.domElement);

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

    const pointLight3 = new THREE.PointLight(0x3b82f6, 1.5);
    pointLight3.position.set(0, 0, -5);
    scene.add(pointLight3);

    // Floating orbs in background
    const orbsGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const orbGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 16, 16);
        const orbMaterial = new THREE.MeshStandardMaterial({
            color: [0x8b5cf6, 0xec4899, 0x3b82f6][Math.floor(Math.random() * 3)],
            emissive: [0x8b5cf6, 0xec4899, 0x3b82f6][Math.floor(Math.random() * 3)],
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.15
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        orb.userData.velocity = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        orbsGroup.add(orb);
    }
    scene.add(orbsGroup);

    // Create different 3D shapes for each section
    const shapes = [];

    // Shape 1: Icosahedron (Hero Section) - Geometric precision
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 1);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 3;
    sphere.visible = false;
    sphere.userData.maxOpacity = 0.5;
    scene.add(sphere);
    shapes.push(sphere);

    // Shape 2: Torus Knot (About Section) - Mathematical beauty
    const torusKnotGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const torusKnotMaterial = new THREE.MeshStandardMaterial({
        color: 0xdbde33,
        wireframe: false,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xdbde33,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.position.x = 3;
    torusKnot.visible = false;
    torusKnot.userData.maxOpacity = 0.6;
    scene.add(torusKnot);
    shapes.push(torusKnot);

    // Shape 3: Octahedron (Experience Section) - Research & Analysis
    const octaGeometry = new THREE.OctahedronGeometry(2, 0);
    const octaMaterial = new THREE.MeshStandardMaterial({
        color: 0x50cc00,
        wireframe: true,
        emissive: 0x50cc00,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0,
        depthWrite: false
    });
    const octa = new THREE.Mesh(octaGeometry, octaMaterial);
    octa.position.x = 3;
    octa.visible = false;
    octa.userData.maxOpacity = 0.8;
    scene.add(octa);
    shapes.push(octa);

    // Shape 4: Abstract Network (Projects Section) - Interconnected systems
    const boxGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const size = Math.random() * 0.4 + 0.2;
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x944e10,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0xa855f7,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2;
        box.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.5,
            (Math.random() - 0.5) * 2
        );
        box.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        boxGroup.add(box);
    }
    boxGroup.position.x = 3;
    boxGroup.userData.opacity = 0.8 ;
    boxGroup.userData.maxOpacity = 0.8;
    boxGroup.visible = false;
    scene.add(boxGroup);
    shapes.push(boxGroup);

    // Shape 5: Dodecahedron (Contact Section) - Perfect symmetry
    const dodecaGeometry = new THREE.DodecahedronGeometry(2, 0);
    const dodecaMaterial = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        wireframe: true,
        emissive: 0x6366f1,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    const dodeca = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodeca.position.x = 3;
    dodeca.visible = false;
    dodeca.userData.maxOpacity = 0.8;
    scene.add(dodeca);
    shapes.push(dodeca);

    // Background particles
    const particlesCount = window.innerWidth > 1600 ? 600 : window.innerWidth > 1200 ? 450 : 280;
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleColors = new Float32Array(particlesCount * 3);
    const particleData = [];
    const whitePalette = [new THREE.Color(0xffffff), new THREE.Color(0xf5f5f5), new THREE.Color(0xdcdfe3)];

    const particlesGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < particlesCount; i++) {
        const index = i * 3;
        const basePosition = new THREE.Vector3(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 80
        );
        const paletteColor = whitePalette[Math.floor(Math.random() * whitePalette.length)];
        const baseColor = paletteColor.clone();
        const offset = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 0.7;

        particlePositions[index] = basePosition.x;
        particlePositions[index + 1] = basePosition.y;
        particlePositions[index + 2] = basePosition.z;

        particleColors[index] = baseColor.r * 0.35;
        particleColors[index + 1] = baseColor.g * 0.35;
        particleColors[index + 2] = baseColor.b * 0.35;

        particleData.push({ basePosition, baseColor, offset, speed });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.012,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Fire sprite helpers
    function createFireTexture() {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(
            size * 0.5,
            size * 0.5,
            0,
            size * 0.5,
            size * 0.5,
            size * 0.5
        );
        gradient.addColorStop(0, 'rgba(61, 2, 65, 1)');
        gradient.addColorStop(0.2, 'rgba(39, 1, 85, 0.9)');
        gradient.addColorStop(0.45, 'rgba(55, 1, 1, 0.64)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
    }

    const fireTexture = createFireTexture();
    const fireGroup = new THREE.Group();
    const fireSprites = [];
    const fireCount = 140;

    for (let i = 0; i < fireCount; i++) {
        const material = new THREE.SpriteMaterial({
            map: fireTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: 0xffffff,
            opacity: 0.55 + Math.random() * 0.25
        });

        const sprite = new THREE.Sprite(material);
        const scale = 0.6 + Math.random() * 1.4;
        sprite.scale.set(scale, scale, scale);
        sprite.position.set(
            (Math.random() - 0.5) * 40,
            -2 + Math.random() * 8,
            (Math.random() - 0.5) * 25
        );

        sprite.userData = {
            verticalSpeed: 0.2 + Math.random() * 0.35,
            horizontalDrift: (Math.random() - 0.5) * 0.15,
            swaySpeed: 0.5 + Math.random() * 0.7,
            swayOffset: Math.random() * Math.PI * 2,
            baseOpacity: material.opacity,
            coolingFactor: 0.5 + Math.random() * 0.5
        };

        fireSprites.push(sprite);
        fireGroup.add(sprite);
    }

    fireGroup.position.z = -8;
    scene.add(fireGroup);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll-based shape transitions
    function updateShapesOnScroll() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = scrollPosition / (documentHeight - windowHeight);

        const sectionIndex = Math.floor(scrollPercentage * 6);

        shapes.forEach((shape, index) => {
            const isActiveSection = index === sectionIndex;
            const maxOpacity = shape.userData.maxOpacity || 0.4;
            const targetOpacity = isActiveSection ? maxOpacity : 0;
            const targetScale = isActiveSection ? 1 : 0.8;

            if (targetOpacity > 0.01) {
                shape.visible = true;
            }

            if (shape.material) {
                const currentOpacity = shape.material.opacity;
                shape.material.opacity += (targetOpacity - currentOpacity) * 0.1;

                if (shape.material.opacity < 0.01) {
                    shape.visible = false;
                    shape.material.opacity = 0;
                }
            } else if (shape.children.length > 0) {
                const currentOpacity = shape.userData.opacity || 0;
                shape.userData.opacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;

                shape.children.forEach(child => {
                    if (child.material) {
                        child.material.opacity = shape.userData.opacity;
                    }
                });

                if (shape.userData.opacity < 0.01) {
                    shape.visible = false;
                    shape.userData.opacity = 0;
                }
            }

            const currentScale = shape.scale.x;
            const newScale = currentScale + (targetScale - currentScale) * 0.1;
            shape.scale.set(newScale, newScale, newScale);
        });

        const colors = [0xffffff, 0xf5f5ff, 0xe0e7ff, 0xc7d2fe, 0xa5b4fc, 0x818cf8];
        particlesMaterial.color.setHex(colors[Math.min(sectionIndex, colors.length - 1)]);

        const scrollOffset = scrollPercentage * 10;
        shapes.forEach((shape, index) => {
            if (shape.visible) {
                shape.position.y = Math.sin(scrollOffset + index) * 0.5;
            }
        });
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.3;
        targetY = mouseY * 0.3;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;

        shapes.forEach((shape, index) => {
            shape.rotation.x += 0.003 * (index + 1);
            shape.rotation.y += 0.005 * (index + 1);
        });

        const time = Date.now() * 0.001;

        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        const positionsAttr = particlesMesh.geometry.getAttribute('position');
        const colorsAttr = particlesMesh.geometry.getAttribute('color');
        for (let i = 0; i < particlesCount; i++) {
            const base = particleData[i];
            const wave = (Math.sin(time * base.speed + base.offset) + 1) / 2;
            const idx = i * 3;

            particlePositions[idx] = base.basePosition.x + Math.sin(time * 0.18 + base.offset) * 0.6;
            particlePositions[idx + 1] = base.basePosition.y + (wave - 0.5) * 1.4;
            particlePositions[idx + 2] = base.basePosition.z + Math.cos(time * 0.22 + base.offset) * 0.6;

            const intensity = 0.2 + wave * 0.4;
            particleColors[idx] = base.baseColor.r * intensity;
            particleColors[idx + 1] = base.baseColor.g * intensity;
            particleColors[idx + 2] = base.baseColor.b * intensity;
        }
        positionsAttr.needsUpdate = true;
        colorsAttr.needsUpdate = true;

        fireSprites.forEach((sprite, index) => {
            const {
                verticalSpeed,
                horizontalDrift,
                swaySpeed,
                swayOffset,
                baseOpacity,
                coolingFactor
            } = sprite.userData;

            sprite.position.y += verticalSpeed * 0.01;
            sprite.position.x += horizontalDrift * 0.01;
            sprite.position.x += Math.sin(time * swaySpeed + swayOffset) * 0.004;
            sprite.position.z += Math.cos(time * swaySpeed * 1.1 + swayOffset) * 0.002;

            const flicker = (Math.sin(time * 3 + swayOffset + index * 0.2) + 1) / 2;
            sprite.material.opacity = baseOpacity * (0.4 + flicker * 0.6);
            sprite.material.color.setScalar(0.8 + flicker * coolingFactor * 0.4);

            if (sprite.position.y > 6) {
                sprite.position.y = -2 - Math.random() * 2;
                sprite.position.x = (Math.random() - 0.5) * 40;
                sprite.position.z = (Math.random() - 0.5) * 25;
                sprite.userData.horizontalDrift = (Math.random() - 0.5) * 0.15;
                sprite.userData.swayOffset = Math.random() * Math.PI * 2;
            }
        });

        // Animate floating orbs
        orbsGroup.children.forEach(orb => {
            orb.position.x += orb.userData.velocity.x;
            orb.position.y += orb.userData.velocity.y;
            orb.position.z += orb.userData.velocity.z;

            // Bounce orbs within bounds
            if (Math.abs(orb.position.x) > 15) orb.userData.velocity.x *= -1;
            if (Math.abs(orb.position.y) > 15) orb.userData.velocity.y *= -1;
            if (Math.abs(orb.position.z) > 15) orb.userData.velocity.z *= -1;

            // Pulse effect
            const scale = 1 + Math.sin(Date.now() * 0.001 + orb.position.x) * 0.2;
            orb.scale.set(scale, scale, scale);
        });

        // Animate lights
        pointLight1.position.x = Math.sin(time * 0.5) * 5;
        pointLight1.position.y = Math.cos(time * 0.3) * 5;
        pointLight2.position.x = Math.cos(time * 0.4) * 5;
        pointLight2.position.z = Math.sin(time * 0.6) * 5;
        pointLight3.intensity = 1.5 + Math.sin(time * 2) * 0.5;

        updateShapesOnScroll();

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
        } catch (error) {
            console.error('Failed to load Three.js, falling back to static background.', error);
            canvasContainer.classList.add('three-disabled');
        }
    }

    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Section scroll animations
    const sections = document.querySelectorAll('.about-section, .skills-section, .experience-section, .projects-section, .contact-section');

    const isElementInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top < viewHeight * 0.95 && rect.bottom > viewHeight * 0.05;
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when scrolling away for re-animation
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-20px 0px -80px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
        if (isElementInViewport(section)) {
            section.classList.add('visible');
        }
    });

    const getNavOffset = () => {
        const rootStyles = getComputedStyle(document.documentElement);
        const offsetVar = parseFloat(rootStyles.getPropertyValue('--nav-offset'));
        if (!Number.isNaN(offsetVar)) {
            return offsetVar;
        }
        const navEl = document.querySelector('nav');
        return navEl ? navEl.getBoundingClientRect().height : 0;
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') {
                return;
            }

            const target = document.querySelector(hash);
            if (!target) {
                return;
            }

            event.preventDefault();

            const navOffset = getNavOffset();
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: 'smooth'
            });

            if (window.history && typeof window.history.pushState === 'function') {
                window.history.pushState(null, '', hash);
            } else {
                window.location.hash = hash;
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .about-content, .education-card, .experience-card, .skill-category');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
        if (isElementInViewport(el)) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });

    window.addEventListener('load', () => {
        animatedElements.forEach(el => {
            if (isElementInViewport(el)) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });

    // Coming Soon Modal functionality
    const modal = document.getElementById('coming-soon-modal');

    function openModal() {
        if (!modal) {
            return;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) {
            return;
        }
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Handle coming soon links
    document.querySelectorAll('a[href="#coming-soon"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });
    });

    // Modal close triggers
    document.querySelectorAll('[data-modal-close]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            closeModal();
        });
    });

    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', (event) => {
            if (event.target.id === 'coming-soon-modal') {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const copyEmailBtn = document.querySelector('.copy-email-btn');
    if (copyEmailBtn) {
        const feedbackEl = document.querySelector('.copy-feedback');

        const showFeedback = (message) => {
            if (!feedbackEl) {
                return;
            }
            feedbackEl.textContent = message;
            feedbackEl.classList.add('visible');
            if (feedbackEl.dataset.timeoutId) {
                clearTimeout(Number(feedbackEl.dataset.timeoutId));
            }
            const timeoutId = window.setTimeout(() => {
                feedbackEl.textContent = '';
                feedbackEl.classList.remove('visible');
                delete feedbackEl.dataset.timeoutId;
            }, 2000);
            feedbackEl.dataset.timeoutId = String(timeoutId);
        };

        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.dataset.email;
            if (!email) {
                return;
            }

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                copyEmailBtn.classList.add('copied');
                showFeedback('Copied!');
                setTimeout(() => copyEmailBtn.classList.remove('copied'), 1500);
            } catch (error) {
                console.error('Failed to copy email:', error);
                showFeedback('Press Ctrl+C to copy');
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPortfolioScene().catch(error => console.error('Failed to initialise portfolio scene', error));
    }, { once: true });
} else {
    initPortfolioScene().catch(error => console.error('Failed to initialise portfolio scene', error));
}
