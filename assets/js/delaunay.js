import { loadWithFallback } from './module-loader.js';

const THREE_FALLBACK_URL = 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
const D3_FALLBACK_URL = 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const D3_DELAUNAY_FALLBACK_URL = 'https://cdn.jsdelivr.net/npm/d3-delaunay@6.0.2/+esm';

async function initDelaunayPage() {
    let THREE;
    let d3;
    let Delaunay;

    try {
        const [threeModule, d3Module, d3DelaunayModule] = await Promise.all([
            loadWithFallback('three', THREE_FALLBACK_URL),
            loadWithFallback('d3', D3_FALLBACK_URL),
            loadWithFallback('d3-delaunay', D3_DELAUNAY_FALLBACK_URL)
        ]);

        THREE = threeModule?.default ?? threeModule;
        d3 = d3Module?.default ?? d3Module;
        const d3DelaunayNamespace = d3DelaunayModule?.default ?? d3DelaunayModule;
        Delaunay = d3DelaunayNamespace?.Delaunay ?? d3?.Delaunay;
    } catch (error) {
        console.error('Failed to load interactive modules for Delaunay page.', error);
        return;
    }

    if (!THREE || !d3 || !Delaunay) {
        console.error('Missing required modules to initialise Delaunay page.');
        return;
    }

    const backgroundCanvas = document.getElementById('three-background');
    const svgElement = document.getElementById('delaunay-canvas');
    const controlContainer = document.querySelector('.control-buttons');
    const toggleVoronoiButton = document.getElementById('toggleVoronoi');

    if (!svgElement) {
        return;
    }

    // --- Background squares ---------------------------------------------------
    if (backgroundCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 45;

        const renderer = new THREE.WebGLRenderer({
            canvas: backgroundCanvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const squareGeometry = new THREE.PlaneGeometry(1, 1);
        const squares = [];

        const makeSquare = (color, count, scaleRange, opacityRange) => {
            for (let i = 0; i < count; i++) {
                const material = new THREE.MeshBasicMaterial({
                    color,
                    transparent: true,
                    opacity: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
                    side: THREE.DoubleSide
                });
                const mesh = new THREE.Mesh(squareGeometry, material);
                mesh.scale.setScalar(scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]));
                mesh.position.set(
                    (Math.random() - 0.5) * 90,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 90
                );
                mesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                mesh.userData = {
                    drift: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02
                    ),
                    baseOpacity: material.opacity,
                    speed: 0.003 + Math.random() * 0.005
                };
                squares.push(mesh);
                scene.add(mesh);
            }
        };

        makeSquare(0x8b5cf6, 260, [0.8, 1.5], [0.18, 0.35]);
        makeSquare(0xec4899, 90, [1, 2.2], [0.08, 0.18]);

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = ((event.clientX / window.innerWidth) * 2 - 1) * 6;
            mouseY = ((event.clientY / window.innerHeight) * 2 - 1) * 6;
        });

        function animateSquares() {
            requestAnimationFrame(animateSquares);

            camera.position.x += (mouseX - camera.position.x) * 0.03;
            camera.position.y += (-mouseY - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            const time = Date.now() * 0.001;
            squares.forEach((square, index) => {
                const { drift, baseOpacity, speed } = square.userData;
                square.rotation.x += speed;
                square.rotation.y += speed * 0.7;
                square.position.add(drift);

                if (square.position.x > 50 || square.position.x < -50) drift.x *= -1;
                if (square.position.y > 35 || square.position.y < -35) drift.y *= -1;
                if (square.position.z > 60 || square.position.z < -60) drift.z *= -1;

                square.material.opacity = baseOpacity + Math.sin(time + index) * 0.05;
            });

            renderer.render(scene, camera);
        }

        animateSquares();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            recalcSvgSize();
            updateTriangulation();
        });
    } else {
        window.addEventListener('resize', () => {
            recalcSvgSize();
            updateTriangulation();
        });
    }

    // --- D3 Delaunay triangulation ------------------------------------------
    const svg = d3.select(svgElement);
    const container = svgElement.parentElement;
    let width = 0;
    let height = 600;

    const degreeSymbol = '\u00B0';

    function recalcSvgSize() {
        if (!container) {
            return;
        }
        width = Math.max(container.clientWidth - 80, 320);
        svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);
    }

    recalcSvgSize();

    let points = [];
    let showVoronoi = false;

    function updateTriangulation() {
        svg.selectAll('*').remove();

        if (points.length < 3) {
            drawPoints();
            updateStats(points.length, 0, 0, 0);
            return;
        }

        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi([0, 0, width, height]);
        const triangles = [...delaunay.trianglePolygons()];

        const angles = [];
        triangles.forEach((triangle) => {
            for (let i = 0; i < 3; i++) {
                const p1 = triangle[i];
                const p2 = triangle[(i + 1) % 3];
                const p3 = triangle[(i + 2) % 3];

                const v1 = [p1[0] - p2[0], p1[1] - p2[1]];
                const v2 = [p3[0] - p2[0], p3[1] - p2[1]];
                const dot = v1[0] * v2[0] + v1[1] * v2[1];
                const len1 = Math.hypot(v1[0], v1[1]);
                const len2 = Math.hypot(v2[0], v2[1]);
                const ratio = Math.max(-1, Math.min(1, dot / (len1 * len2)));
                angles.push(Math.acos(ratio) * 180 / Math.PI);
            }
        });

        if (showVoronoi) {
            svg.append('g')
                .selectAll('path')
                .data(points)
                .join('path')
                .attr('d', (_, i) => voronoi.renderCell(i))
                .attr('fill', 'none')
                .attr('stroke', 'rgba(236, 72, 153, 0.35)')
                .attr('stroke-width', 2);
        }

        const triangleGroup = svg.append('g')
            .selectAll('polygon')
            .data(triangles)
            .join('polygon')
            .attr('points', (d) => d.map((p) => p.join(',')).join(' '))
            .attr('fill', 'none')
            .attr('stroke', (_, i) => {
                const hue = (i * 137.5) % 360;
                return `hsla(${hue}, 80%, 60%, 0.7)`;
            })
            .attr('stroke-width', 2.5)
            .style('opacity', 0);

        triangleGroup.transition()
            .duration(500)
            .delay((_, i) => i * 18)
            .style('opacity', 1);

        drawPoints();

        const minAngle = Math.min(...angles);
        const avgAngle = angles.reduce((sum, angle) => sum + angle, 0) / angles.length;

        updateStats(points.length, triangles.length, minAngle, avgAngle);
    }

    function drawPoints() {
        const group = svg.append('g');

        points.forEach((point, index) => {
            const pointGroup = group.append('g').style('opacity', 0);

            pointGroup.append('circle')
                .attr('cx', point[0])
                .attr('cy', point[1])
                .attr('r', 10)
                .attr('fill', 'rgba(139, 92, 246, 0.3)');

            pointGroup.append('circle')
                .attr('cx', point[0])
                .attr('cy', point[1])
                .attr('r', 6)
                .attr('fill', '#8b5cf6');

            pointGroup.append('circle')
                .attr('cx', point[0] - 2)
                .attr('cy', point[1] - 2)
                .attr('r', 2.5)
                .attr('fill', '#ffffff');

            pointGroup.transition()
                .duration(300)
                .delay(index * 25)
                .style('opacity', 1);
        });
    }

    function updateStats(pointCount, triangleCount, minAngle, avgAngle) {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((element) => element.classList.add('updated'));
        setTimeout(() => statValues.forEach((element) => element.classList.remove('updated')), 250);

        const minAngleNode = document.getElementById('minAngle');
        const avgAngleNode = document.getElementById('avgAngle');

        document.getElementById('pointCount').textContent = pointCount;
        document.getElementById('triangleCount').textContent = triangleCount;
        if (minAngleNode) {
            minAngleNode.textContent = minAngle ? `${Math.round(minAngle)}${degreeSymbol}` : `0${degreeSymbol}`;
        }
        if (avgAngleNode) {
            avgAngleNode.textContent = avgAngle ? `${Math.round(avgAngle)}${degreeSymbol}` : `0${degreeSymbol}`;
        }
    }

    svg.on('click', (event) => {
        const [x, y] = d3.pointer(event);
        points.push([x, y]);
        updateTriangulation();
    });

    function loadExample() {
        points = [
            [width * 0.3, height * 0.3],
            [width * 0.7, height * 0.3],
            [width * 0.5, height * 0.7],
            [width * 0.2, height * 0.6],
            [width * 0.8, height * 0.6],
            [width * 0.4, height * 0.5],
            [width * 0.6, height * 0.5],
            [width * 0.35, height * 0.4],
            [width * 0.65, height * 0.4]
        ];
        updateTriangulation();
    }

    function addRandomPoints(count) {
        const margin = 60;
        for (let i = 0; i < count; i++) {
            points.push([
                margin + Math.random() * (width - margin * 2),
                margin + Math.random() * (height - margin * 2)
            ]);
        }
        updateTriangulation();
    }

    function clearPoints() {
        points = [];
        updateTriangulation();
    }

    function toggleVoronoi() {
        showVoronoi = !showVoronoi;
        if (toggleVoronoiButton) {
            const label = showVoronoi ? 'Hide Voronoi' : 'Show Voronoi';
            toggleVoronoiButton.querySelector('span').textContent = label;
            toggleVoronoiButton.classList.toggle('active', showVoronoi);
        }
        updateTriangulation();
    }

    if (controlContainer) {
        controlContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) {
                return;
            }

            if (button.dataset.action === 'load-example') {
                loadExample();
            } else if (button.dataset.action === 'clear') {
                clearPoints();
            } else if (button.dataset.action === 'toggle-voronoi') {
                toggleVoronoi();
            } else if (button.dataset.addCount) {
                const count = parseInt(button.dataset.addCount, 10);
                if (!Number.isNaN(count)) {
                    addRandomPoints(count);
                }
            }
        });
    }

    loadExample();
}

const startDelaunayPage = () => initDelaunayPage().catch((error) => {
    console.error('Failed to initialise Delaunay page.', error);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDelaunayPage, { once: true });
} else {
    startDelaunayPage();
}
