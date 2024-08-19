import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { memo, useEffect, useRef } from 'react';
import './index.css';

export default memo(function Canvas() {
  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const particlesCount = 200;

  /**
   * TextureLoader
   */
  const textureLoader = new THREE.TextureLoader();
  const circleTexture = textureLoader.load(
    './textures/particles/circle-mark.png'
  );
  const xTexture = textureLoader.load('./textures/particles/x-mark.png');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    /**
     * Camera
     */
    //Camera Group
    const cameraGroup = new THREE.Group();

    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 5;
    cameraGroup.add(camera);
    scene.add(cameraGroup);

    /**
     * Particles
     */

    //Material
    const particlesCircleMaterial = new THREE.PointsMaterial({
      alphaMap: circleTexture,
      transparent: true,
      size: 0.1,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    const particlesXMaterial = new THREE.PointsMaterial({
      alphaMap: xTexture,
      transparent: true,
      size: 0.1,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    //Points
    const circleParticles = new THREE.Points(
      generatePoints(particlesCount),
      particlesCircleMaterial
    );
    const xParticles = new THREE.Points(
      generatePoints(particlesCount),
      particlesXMaterial
    );
    scene.add(circleParticles, xParticles);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer?.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    /**
     * Animate
     */
    let requestId: number | null = null;

    const tick = () => {
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      requestId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (requestId) {
        window.cancelAnimationFrame(requestId);
      }
      scene?.clear();
      renderer?.dispose();
      controls?.dispose();
    };
  });

  return <canvas className='webgl' id='webgl' ref={canvasRef} />;
});

function generatePoints(count: number) {
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return geometry;
}
