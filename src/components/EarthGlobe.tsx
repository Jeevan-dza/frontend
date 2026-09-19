import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SATELLITE_CONSTELLATION, GROUND_TARGETS, latLngToVector3, Satellite } from '../data/satellites';

// Atmospheric Glow Shader (Fresnel Cyan Rim)
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 glowColor;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = 1.0 - max(0.0, dot(viewDir, vNormal));
      float intensity = pow(fresnel, 2.8) * 1.5;
      gl_FragColor = vec4(glowColor, intensity * 0.85);
    }
  `
};

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const EarthGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSatCount, setActiveSatCount] = useState<number>(SATELLITE_CONSTELLATION.length);

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setWebGLSupported(false);
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    let cameraDistance = 3.6;
    let targetCameraDistance = 3.6;
    camera.position.set(0, 0.4, cameraDistance);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('/textures/earth_atmos_2048.jpg', () => {
      setIsLoading(false);
    });
    earthMap.colorSpace = THREE.SRGBColorSpace;

    const normalMap = textureLoader.load('/textures/earth_normal_2048.jpg');
    const specularMap = textureLoader.load('/textures/earth_specular_2048.jpg');
    const cloudsMap = textureLoader.load('/textures/earth_clouds_1024.png');

    // Hierarchy Groups
    const earthGroup = new THREE.Group();
    // Default orientation tilted slightly for pleasing perspective showing India / Indian Ocean
    earthGroup.rotation.x = 0.25;
    earthGroup.rotation.y = -1.6;
    scene.add(earthGroup);

    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    // 1. Earth Sphere Mesh
    const earthGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.65, 0.65),
      specularMap: specularMap,
      specular: new THREE.Color(0x184466),
      shininess: 18,
      color: 0xdae6f0
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // 2. Cloud Sphere Layer
    const cloudGeometry = new THREE.SphereGeometry(1.014, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(cloudMesh);

    // 3. Cyan Atmospheric Glow Shell
    const atmoGeometry = new THREE.SphereGeometry(1.15, 48, 48);
    const atmoMaterial = new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(0x06b6d4) }
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    scene.add(atmoMesh);

    // 4. Ground Target Markers on Earth Surface
    const groundPulseMeshes: { ring: THREE.Mesh; initialScale: number }[] = [];
    GROUND_TARGETS.forEach(target => {
      const [x, y, z] = latLngToVector3(target.lat, target.lng, 1.002);

      // Core point
      const pointGeo = new THREE.SphereGeometry(0.016, 16, 16);
      const pointMat = new THREE.MeshBasicMaterial({ color: target.color });
      const pointMesh = new THREE.Mesh(pointGeo, pointMat);
      pointMesh.position.set(x, y, z);
      earthGroup.add(pointMesh);

      // Expanding pulse ring
      const ringGeo = new THREE.RingGeometry(0.02, 0.035, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: target.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.lookAt(x * 2, y * 2, z * 2);
      earthGroup.add(ringMesh);

      groundPulseMeshes.push({ ring: ringMesh, initialScale: 1 });
    });

    // 5. 3D Satellite Orbits & Satellite Models
    interface SatVisual {
      sat: Satellite;
      mesh: THREE.Group;
      beamLine: THREE.Line;
      beamPositions: Float32Array;
      angle: number;
      orbitCurve: THREE.CatmullRomCurve3;
    }
    const satVisuals: SatVisual[] = [];

    SATELLITE_CONSTELLATION.forEach((sat) => {
      // Calculate 3D orbital path ring
      const segments = 128;
      const points: THREE.Vector3[] = [];
      const tiltQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(...sat.tiltAxis).normalize(),
        (sat.inclinationDeg * Math.PI) / 180
      );

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const pt = new THREE.Vector3(
          Math.cos(theta) * sat.orbitRadius,
          0,
          Math.sin(theta) * sat.orbitRadius
        );
        pt.applyQuaternion(tiltQuat);
        points.push(pt);
      }

      const orbitCurve = new THREE.CatmullRomCurve3(points, true);
      const curvePoints = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(sat.color),
        transparent: true,
        opacity: 0.38
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      spaceGroup.add(orbitLine);

      // Satellite model (Core + Solar Panels)
      const satGroup = new THREE.Group();

      // Main satellite body
      const bodyGeo = new THREE.BoxGeometry(0.03, 0.024, 0.024);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.85,
        roughness: 0.2
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(bodyMesh);

      // Glowing sensor / radar orb
      const beaconGeo = new THREE.SphereGeometry(0.015, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: sat.color });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      satGroup.add(beaconMesh);

      // Solar panels (left and right wings)
      const panelGeo = new THREE.BoxGeometry(0.08, 0.018, 0.003);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.9,
        roughness: 0.1
      });
      const leftPanel = new THREE.Mesh(panelGeo, panelMat);
      leftPanel.position.set(-0.055, 0, 0);
      satGroup.add(leftPanel);

      const rightPanel = new THREE.Mesh(panelGeo, panelMat);
      rightPanel.position.set(0.055, 0, 0);
      satGroup.add(rightPanel);

      spaceGroup.add(satGroup);

      // Downlink pulse beam to Earth center
      const beamGeo = new THREE.BufferGeometry();
      const beamPositions = new Float32Array(6); // 2 vertices * 3 coordinates
      beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
      const beamMat = new THREE.LineDashedMaterial({
        color: new THREE.Color(sat.color),
        dashSize: 0.05,
        gapSize: 0.04,
        transparent: true,
        opacity: 0.4
      });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      beamLine.computeLineDistances();
      spaceGroup.add(beamLine);

      satVisuals.push({
        sat,
        mesh: satGroup,
        beamLine,
        beamPositions,
        angle: sat.initialAngle,
        orbitCurve
      });
    });

    // 6. Lighting
    // Ambient light with technical deep blue tint
    const ambientLight = new THREE.AmbientLight(0x0c1e3d, 1.4);
    scene.add(ambientLight);

    // Primary Sun Light (warm white)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
    sunLight.position.set(5, 3.5, 4);
    scene.add(sunLight);

    // Cyber Cyan Rim Light (back-side rim illumination)
    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    cyanRimLight.position.set(-5, -2, -3.5);
    scene.add(cyanRimLight);

    // Subtle Aerospace Blue Fill
    const fillLight = new THREE.DirectionalLight(0x1d4ed8, 0.9);
    fillLight.position.set(0, -4, 2);
    scene.add(fillLight);

    // 7. Interactive Controls & Physics (Drag with Inertia, Wheel Zoom)
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    const baseAutoRotationSpeed = 0.0018;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      velocityX = 0;
      velocityY = 0;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;

      velocityX = deltaX * 0.0035;
      velocityY = deltaY * 0.0035;

      earthGroup.rotation.y += velocityX;
      earthGroup.rotation.x = Math.max(
        -0.85,
        Math.min(0.85, earthGroup.rotation.x + velocityY)
      );

      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Safe ignore
      }
    };

    // Zooming with clamped range
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.0015;
      targetCameraDistance = Math.max(2.4, Math.min(4.4, targetCameraDistance + zoomFactor));
    };

    const domElem = renderer.domElement;
    domElem.style.touchAction = 'none';
    domElem.style.cursor = 'grab';
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Damping & Auto-rotation
      if (isDragging) {
        domElem.style.cursor = 'grabbing';
      } else {
        domElem.style.cursor = 'grab';
        velocityX *= 0.93;
        velocityY *= 0.93;

        earthGroup.rotation.y += velocityX + baseAutoRotationSpeed;
        earthGroup.rotation.x = Math.max(
          -0.85,
          Math.min(0.85, earthGroup.rotation.x + velocityY)
        );
      }

      // Independent subtle cloud drift
      cloudMesh.rotation.y += 0.0006;

      // Smooth camera zoom lerp
      cameraDistance += (targetCameraDistance - cameraDistance) * 0.08;
      camera.position.z = cameraDistance;

      // Pulse ground target markers
      const pulsePhase = (elapsedTime * 2.5) % 1;
      groundPulseMeshes.forEach(item => {
        const currentScale = 1 + pulsePhase * 1.6;
        item.ring.scale.set(currentScale, currentScale, currentScale);
        (item.ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.85 - pulsePhase);
      });

      // Orbit satellites & update downlinks
      satVisuals.forEach(item => {
        item.angle = (item.angle + delta * (item.sat.speed * 0.45)) % 1;
        const satPos = item.orbitCurve.getPointAt(item.angle);
        item.mesh.position.copy(satPos);

        // Orient satellite forward along tangent
        const nextPos = item.orbitCurve.getPointAt((item.angle + 0.01) % 1);
        item.mesh.lookAt(nextPos);

        // Update downlink beam coordinates
        const positions = item.beamPositions;
        positions[0] = satPos.x;
        positions[1] = satPos.y;
        positions[2] = satPos.z;

        // Beam points toward nearest earth surface point
        const earthTarget = satPos.clone().normalize().multiplyScalar(1.0);
        positions[3] = earthTarget.x;
        positions[4] = earthTarget.y;
        positions[5] = earthTarget.z;

        const posAttr = item.beamLine.geometry.attributes.position as THREE.BufferAttribute;
        posAttr.needsUpdate = true;
        item.beamLine.computeLineDistances();
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup & Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);

      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }

      // Dispose Three.js resources
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthMap.dispose();
      normalMap.dispose();
      specularMap.dispose();

      cloudGeometry.dispose();
      cloudMaterial.dispose();
      cloudsMap.dispose();

      atmoGeometry.dispose();
      atmoMaterial.dispose();

      satVisuals.forEach(v => {
        v.beamLine.geometry.dispose();
        (v.beamLine.material as THREE.Material).dispose();
      });

      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden select-none"
      ref={containerRef}
      style={{ filter: 'drop-shadow(0 0 50px rgba(6, 182, 212, 0.28))' }}
    >
      {/* Loading Spinner */}
      {isLoading && webGLSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-[11px] font-mono text-cyan-300 tracking-wider">
            INITIALIZING 3D ORBITAL MATRIX...
          </span>
        </div>
      )}

      {/* Fallback when WebGL is unavailable */}
      {!webGLSupported && (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
          <img
            src="/textures/earth_atmos_2048.jpg"
            alt="Earth Globe"
            className="w-72 h-72 rounded-full object-cover shadow-[0_0_60px_rgba(6,182,212,0.4)] border border-cyan-500/30"
          />
          <span className="mt-4 text-xs font-mono text-cyan-300/80 bg-slate-900/80 px-3 py-1 rounded border border-cyan-500/20">
            WebGL acceleration unavailable — Static Telemetry Active
          </span>
        </div>
      )}

      {/* HUD Telemetry overlay chips */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400/90 bg-slate-900/85 border border-cyan-500/30 px-3 py-2 rounded-lg backdrop-blur-md shadow-lg pointer-events-none hidden sm:block">
        <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          ORBIT ELEVATION: 693.4 KM [SSO]
        </div>
        <div className="text-slate-300">INCLINATION: 98.18° • REVISIT: 6D</div>
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-emerald-400/90 bg-slate-900/85 border border-emerald-500/30 px-3 py-2 rounded-lg backdrop-blur-md shadow-lg pointer-events-none hidden sm:block text-right">
        <div className="flex items-center justify-end gap-1.5 font-bold text-emerald-300 mb-0.5">
          DOWNLINK FREQ: 8.4 GHz (X-BAND)
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="text-slate-300">DATA RATE: 520 Mbps CONTINUOUS</div>
      </div>

      {/* Interactive Drag & Zoom Controls Hint */}
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-cyan-400/60 bg-slate-900/60 border border-cyan-500/10 px-2.5 py-1 rounded-md backdrop-blur-xs pointer-events-none hidden md:flex items-center gap-1.5">
        <span>DRAG TO ROTATE</span>
        <span className="text-slate-500">•</span>
        <span>SCROLL TO ZOOM</span>
      </div>
    </div>
  );
};
