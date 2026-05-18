// Mouse-reactive particle torus for the hero.

import * as THREE from "three";

const mount = document.getElementById("hero-torus");
if (mount) {
    initTorus(mount);
}

function initTorus(mount) {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
        mount.style.background =
            "radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 70%)";
        return;
    }

    const PARTICLE_COUNT = 10000;

    const scene = new THREE.Scene();
    const w0 = mount.clientWidth || 1;
    const h0 = mount.clientHeight || 1;
    const camera = new THREE.PerspectiveCamera(75, w0 / h0, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
    renderer.setSize(w0, h0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // TorusKnot(radius, tube, tubularSegments, radialSegments, p, q)
    const torusKnot = new THREE.TorusKnotGeometry(2.0, 0.5, 200, 32, 3, 4);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const knotPos = torusKnot.attributes.position;
    const vertexCount = knotPos.count;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const v = i % vertexCount;
        const x = knotPos.getX(v);
        const y = knotPos.getY(v);
        const z = knotPos.getZ(v);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;
    }
    torusKnot.dispose();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // rgb(29, 189, 168) = --light-hue from general.css
    const material = new THREE.PointsMaterial({
        size: 0.025,
        color: new THREE.Color("rgb(29, 189, 168)"),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = { x: 10, y: 10 }; // start far → no initial force
    const onMouseMove = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    resizeObserver.observe(mount);

    let visible = true;
    const visibilityObserver = new IntersectionObserver(
        (entries) => {
            visible = entries[0].isIntersecting;
        },
        { threshold: 0 }
    );
    visibilityObserver.observe(mount);

    const onTabVisibility = () => {
        visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onTabVisibility);

    const startTime = performance.now();
    let rafId = 0;
    let mouseWorldX = 0;
    let mouseWorldY = 0;

    const animate = () => {
        rafId = requestAnimationFrame(animate);
        if (!visible) return;

        const t = (performance.now() - startTime) / 1000;
        mouseWorldX = mouse.x * 4;
        mouseWorldY = mouse.y * 4;

        // Per particle: mouse repulse if close, spring back to origin, damping.
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            const dx = positions[ix] - mouseWorldX;
            const dy = positions[iy] - mouseWorldY;
            const dz = positions[iz];
            const dist2 = dx * dx + dy * dy + dz * dz;

            if (dist2 < 2.25) {
                const dist = Math.sqrt(dist2);
                const force = (1.5 - dist) * 0.01;
                const invDist = 1 / Math.max(dist, 0.001);
                velocities[ix] += dx * invDist * force;
                velocities[iy] += dy * invDist * force;
                velocities[iz] += dz * invDist * force;
            }

            velocities[ix] += (originalPositions[ix] - positions[ix]) * 0.001;
            velocities[iy] += (originalPositions[iy] - positions[iy]) * 0.001;
            velocities[iz] += (originalPositions[iz] - positions[iz]) * 0.001;

            velocities[ix] *= 0.95;
            velocities[iy] *= 0.95;
            velocities[iz] *= 0.95;

            positions[ix] += velocities[ix];
            positions[iy] += velocities[iy];
            positions[iz] += velocities[iz];
        }
        geometry.attributes.position.needsUpdate = true;

        points.rotation.y = t * 0.1;
        points.rotation.x = Math.sin(t * 0.1) * 0.18;
        renderer.render(scene, camera);
    };
    animate();

    /*
      Cleanup on page unload — frees GPU resources cleanly. Without
      forceContextLoss(), Chrome occasionally leaks WebGL contexts
      across HMR / nav.
    */
    window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", onMouseMove);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        document.removeEventListener("visibilitychange", onTabVisibility);
        renderer.forceContextLoss();
        renderer.dispose();
        geometry.dispose();
        material.dispose();
    });
}
