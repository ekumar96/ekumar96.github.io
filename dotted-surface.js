import * as THREE from 'three';

const container = document.getElementById('contact-wave');
if (container) {
  const SEPARATION = 100;
  const AMOUNTX = 400;
  const AMOUNTY = 600;

  const getSize = () => {
    const rect = container.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 2000, 10000);

  let { width, height } = getSize();
  if (width === 0 || height === 0) {
    width = window.innerWidth;
    height = 600;
  }

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
      positions.push(x, 0, z);
      colors.push(0.11, 0.74, 0.66);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;
  let visible = true;
  let rafId = 0;

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    if (!visible) return;

    const arr = geometry.attributes.position.array;
    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        arr[i * 3 + 1] =
          Math.sin((ix + count) * 0.3) * 20 +
          Math.sin((iy + count) * 0.5) * 20;
        i++;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.1;
  };

  const onResize = () => {
    const sz = getSize();
    if (sz.width === 0 || sz.height === 0) return;
    camera.aspect = sz.width / sz.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sz.width, sz.height);
  };

  window.addEventListener('resize', onResize);

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0 },
  );
  observer.observe(container);

  animate();
}
