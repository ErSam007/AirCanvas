import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { HandData } from "@/hooks/useHandTracking";

export type Shape3D = "cube" | "sphere" | "cone" | "cylinder";

interface Props {
  hands: HandData[];
  shape: Shape3D;
  color: string;
}

export function Scene3D({ hands, shape, color }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    mesh: THREE.Mesh;
    material: THREE.MeshStandardMaterial;
    raf: number;
    rotation: { x: number; y: number };
    scale: number;
    lastHand: { x: number; y: number } | null;
    lastPinch: number | null;
  } | null>(null);

  // Init
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x8899ff, 0.6);
    scene.add(ambient);
    const key = new THREE.PointLight(0x22d3ee, 80, 50);
    key.position.set(4, 4, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xe879f9, 60, 50);
    rim.position.set(-4, -2, 3);
    scene.add(rim);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.4,
      roughness: 0.25,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.25,
    });
    const mesh = new THREE.Mesh(buildGeometry(shape), material);
    scene.add(mesh);

    // wireframe overlay
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }),
    );
    mesh.add(wire);

    stateRef.current = {
      renderer,
      scene,
      camera,
      mesh,
      material,
      raf: 0,
      rotation: { x: 0, y: 0 },
      scale: 1,
      lastHand: null,
      lastPinch: null,
    };

    const loop = () => {
      const st = stateRef.current;
      if (!st) return;
      st.mesh.rotation.x += (st.rotation.x - st.mesh.rotation.x) * 0.15;
      st.mesh.rotation.y += (st.rotation.y - st.mesh.rotation.y) * 0.15;
      const target = st.scale;
      st.mesh.scale.x += (target - st.mesh.scale.x) * 0.15;
      st.mesh.scale.y = st.mesh.scale.x;
      st.mesh.scale.z = st.mesh.scale.x;
      // gentle idle drift
      st.mesh.rotation.y += 0.002;
      st.renderer.render(st.scene, st.camera);
      st.raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      const st = stateRef.current;
      if (!st || !mount) return;
      const W = mount.clientWidth;
      const H = mount.clientHeight;
      st.camera.aspect = W / H;
      st.camera.updateProjectionMatrix();
      st.renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      const st = stateRef.current;
      if (st) {
        cancelAnimationFrame(st.raf);
        st.renderer.dispose();
        st.mesh.geometry.dispose();
        st.material.dispose();
        mount.removeChild(st.renderer.domElement);
      }
      stateRef.current = null;
    };
  }, []);

  // Update geometry / color
  useEffect(() => {
    const st = stateRef.current;
    if (!st) return;
    st.mesh.geometry.dispose();
    st.mesh.geometry = buildGeometry(shape);
    // rebuild wireframe
    st.mesh.children.forEach((c) => {
      if (c instanceof THREE.LineSegments) {
        c.geometry.dispose();
        c.geometry = new THREE.EdgesGeometry(st.mesh.geometry);
      }
    });
  }, [shape]);

  useEffect(() => {
    const st = stateRef.current;
    if (!st) return;
    const c = new THREE.Color(color);
    st.material.color = c;
    st.material.emissive = c;
  }, [color]);

  // Drive from hand gestures
  useEffect(() => {
    const st = stateRef.current;
    if (!st) return;
    const right = hands.find((h) => h.handedness === "Right") ?? hands[0];
    if (!right) {
      st.lastHand = null;
      st.lastPinch = null;
      return;
    }
    if (right.gesture === "point") {
      // rotate based on movement
      if (st.lastHand) {
        const dx = right.x - st.lastHand.x;
        const dy = right.y - st.lastHand.y;
        st.rotation.y += dx * 4;
        st.rotation.x += dy * 4;
      }
      st.lastHand = { x: right.x, y: right.y };
      st.lastPinch = null;
    } else if (right.gesture === "pinch") {
      // scale based on pinch distance change
      if (st.lastPinch != null) {
        const delta = right.pinchDist - st.lastPinch;
        st.scale = Math.max(0.3, Math.min(3, st.scale + delta * 4));
      }
      st.lastPinch = right.pinchDist;
      st.lastHand = null;
    } else {
      st.lastHand = null;
      st.lastPinch = null;
    }
  }, [hands]);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}

function buildGeometry(shape: Shape3D): THREE.BufferGeometry {
  switch (shape) {
    case "sphere":
      return new THREE.SphereGeometry(1.2, 48, 32);
    case "cone":
      return new THREE.ConeGeometry(1.2, 2, 48);
    case "cylinder":
      return new THREE.CylinderGeometry(1, 1, 2, 48);
    case "cube":
    default:
      return new THREE.BoxGeometry(1.6, 1.6, 1.6);
  }
}
