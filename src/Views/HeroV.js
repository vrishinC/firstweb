import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D "V" mark, meant to run full-bleed as a page background.
 * - Both legs pivot from a single shared vertex, so it reads as one
 *   connected object at every rotation angle instead of two floating bars.
 * - Spins continuously on its own Y-axis (vertical plane), in place.
 * - Surrounded by tilted, Saturn-style rings.
 * - The whole mark tilts toward the user's cursor.
 */
function HeroV({ className }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        // ---- Scene / camera / renderer ----
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 11);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // sceneGroup receives the cursor tilt; vMesh spins independently inside it
        const sceneGroup = new THREE.Group();
        const vMesh = new THREE.Group();
        const ringsGroup = new THREE.Group();
        sceneGroup.add(vMesh, ringsGroup);
        scene.add(sceneGroup);

        // shift right-of-center so it sits behind the right side of the page,
        // clear of the headline on the left, and down so it sits nearer
        // vertical center rather than hanging in the upper half
        sceneGroup.position.x = 2.2;
        sceneGroup.position.y = -8;

        const edgeColor = new THREE.Color("#f2eadc");
        const faceColor = new THREE.Color("#0c0a08");
        const glowColor = new THREE.Color("#e08a3e");
        const ringColor = new THREE.Color("#d99a5c");

        // ---- Build one leg of the V. Both legs pivot from the SAME shared
        // vertex (the group origin), so their bases always coincide exactly —
        // no gap, regardless of rotation. ----
        function buildLeg(rotationZ) {
            const legGroup = new THREE.Group();
            const length = 6.2;
            const w = 0.46;
            const bevel = 0.2;

            const shape = new THREE.Shape();
            shape.moveTo(-w / 2 + bevel, 0);
            shape.lineTo(w / 2 - bevel, 0);
            shape.lineTo(w / 2, bevel);
            shape.lineTo(w / 2, length - bevel);
            shape.lineTo(w / 2 - bevel, length);
            shape.lineTo(-w / 2 + bevel, length);
            shape.lineTo(-w / 2, length - bevel);
            shape.lineTo(-w / 2, bevel);
            shape.closePath();

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 0.32,
                bevelEnabled: true,
                bevelThickness: 0.04,
                bevelSize: 0.04,
                bevelSegments: 1,
                curveSegments: 1,
            });
            // center depth only, keep the base of the shape (y = 0) as the pivot —
            // this is the point that must land on the shared vertex
            geometry.translate(0, 0, -0.16);

            const material = new THREE.MeshStandardMaterial({
                color: faceColor,
                metalness: 0.55,
                roughness: 0.35,
            });
            const mesh = new THREE.Mesh(geometry, material);

            const edges = new THREE.EdgesGeometry(geometry, 20);
            const lineMat = new THREE.LineBasicMaterial({
                color: edgeColor,
                transparent: true,
                opacity: 0.9,
            });
            const wireframe = new THREE.LineSegments(edges, lineMat);

            legGroup.add(mesh, wireframe);
            legGroup.rotation.z = rotationZ;
            // no position offset — both legs pivot from vMesh's own origin,
            // which is what guarantees they actually touch

            const tipGeo = new THREE.SphereGeometry(0.06, 12, 12);
            const tipMat = new THREE.MeshBasicMaterial({ color: glowColor });
            const tip = new THREE.Mesh(tipGeo, tipMat);
            tip.position.set(0, length, 0.16);
            legGroup.add(tip);

            const glowLight = new THREE.PointLight(glowColor, 5, 4, 2);
            glowLight.position.copy(tip.position);
            legGroup.add(glowLight);

            return legGroup;
        }

        vMesh.add(buildLeg(0.4), buildLeg(-0.4));

        // Each leg's vertex sits at local y = 0 and extends up to y = length,
        // so the V's own vertical midpoint is at y = length / 2, not at its
        // vertex. Shift vMesh down by that midpoint, then by the rings'
        // y-offset, so the V is centered inside the ring system rather than
        // hanging with its vertex near the rings' center.
        const legLength = 6.2;
        const ringsCenterY = -0.6;
        vMesh.position.y = ringsCenterY - legLength / 2;

        // ---- Planet-style rings: several concentric bands, all sharing one tilt ----
        function buildRingBand(radius, bandWidth, opacity) {
            const geo = new THREE.RingGeometry(radius, radius + bandWidth, 96, 1);
            const mat = new THREE.MeshBasicMaterial({
                color: ringColor,
                transparent: true,
                opacity,
                side: THREE.DoubleSide,
            });
            return new THREE.Mesh(geo, mat);
        }
        function buildRingLine(radius, opacity) {
            const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
            const points = curve.getPoints(96).map((p) => new THREE.Vector3(p.x, p.y, 0));
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity });
            return new THREE.LineLoop(geo, mat);
        }

        ringsGroup.add(
            buildRingBand(3.6, 0.7, 0.05),
            buildRingBand(4.6, 0.5, 0.06),
            buildRingLine(3.6, 0.28),
            buildRingLine(4.3, 0.18),
            buildRingLine(5.1, 0.12)
        );

        // shared "planet ring" tilt — flat plane rotated into an angled ellipse
        ringsGroup.position.y = -0.6;
        ringsGroup.rotation.x = 1.22;
        ringsGroup.rotation.z = 0.32;

        // ---- Lighting ----
        scene.add(new THREE.AmbientLight(0x332a22, 0.6));
        const rim = new THREE.DirectionalLight(0xffffff, 0.4);
        rim.position.set(-3, 2, 4);
        scene.add(rim);

        // ---- Mouse tracking (page-wide, so tilt feels responsive anywhere in the hero) ----
        const targetTilt = { x: 0, y: 0 };
        const currentTilt = { x: 0, y: 0 };

        const handlePointerMove = (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            targetTilt.x = nx;
            targetTilt.y = ny;
        };
        window.addEventListener("pointermove", handlePointerMove);

        // ---- Animation loop ----
        let frameId;
        const clock = new THREE.Clock();
        const animate = () => {
            const delta = clock.getDelta();

            // continuous spin on the V's own local Y-axis — turns left-to-right
            // in place, like a turntable, rather than tumbling front-to-back.
            vMesh.rotation.y -= delta * 0.6;

            // smooth cursor-driven tilt on the whole group
            currentTilt.x += (targetTilt.x - currentTilt.x) * 0.04;
            currentTilt.y += (targetTilt.y - currentTilt.y) * 0.04;
            sceneGroup.rotation.y = currentTilt.x * 0.5;
            sceneGroup.rotation.z = currentTilt.y * -0.18;

            // gentle ambient bob
            const t = clock.getElapsedTime();
            sceneGroup.position.y = Math.sin(t * 0.4) * 0.1;

            // slow independent drift of the ring system
            ringsGroup.rotation.y += delta * 0.05;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // ---- Resize handling ----
        const handleResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(mount);

        // ---- Cleanup ----
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("pointermove", handlePointerMove);
            resizeObserver.disconnect();
            renderer.dispose();
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else obj.material.dispose();
                }
            });
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className={className} aria-hidden="true" />;
}

export default HeroV;