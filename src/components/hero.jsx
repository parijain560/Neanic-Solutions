import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { DNASplitSection } from "../NeanicSections";

// ─────────────────────────────────────────────────────────────────
// DOMAIN FOCUS HOOK
// ─────────────────────────────────────────────────────────────────
function useDomainFocus(selectedDomain) {
    const focus = useRef(0);
    useEffect(() => {
        const target = selectedDomain === "edtech" ? 1 : selectedDomain === "medtech" ? -1 : 0;
        const tween = gsap.to(focus, { current: target, duration: 1.5, ease: "power3.inOut", overwrite: true });
        return () => tween.kill();
    }, [selectedDomain]);
    return focus;
}

// ─────────────────────────────────────────────────────────────────
// ORBITAL PARTICLE SYSTEM
//
// PHASES (driven by scroll delta after selection):
//   0.000–0.040  → spawn: particles scale up at DNA node
//   0.040–0.100  → orbit: radius expands, particles grow
//   0.100–0.180  → fly:   particles travel toward card DOM slots
//   0.180+       → land:  particles at card position, cards fade in
//
// Card positions are measured from the real DOM via getBoundingClientRect
// and unprojected back into Three.js world space so the particles
// travel to the EXACT pixel where each card will appear.
// ─────────────────────────────────────────────────────────────────
const BASE_ORBIT_ANGLES = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

// cardDOMRefs: React ref holding [el0, el1, el2, el3] DOM nodes
// onCardReveal: callback(index, 0→1) called by the particle system
function OrbitalParticleSystem({
    scrollProgress,
    selectedDomain,
    medNodeRef,
    edNodeRef,
    cardDOMRefs,
    onCardReveal,
}) {
    const { camera, size } = useThree();
    const meshRefs = useRef([null, null, null, null, null, null]);
    const glowRefs = useRef([null, null, null, null, null, null]);

    const anim = useRef({
        phase: "idle",
        orbitAngles: [...BASE_ORBIT_ANGLES],
        orbitRadius: 0,
        particleScale: 0,
        scrollBaseline: 0,
        nodeWorldPos: new THREE.Vector3(),
        // World-space card target positions (computed once per selection)
        cardTargets: [null, null, null, null, null, null],
        cardTargetsReady: false,
        // Per-particle fly progress 0→1
        flyProgress: [0, 0, 0, 0, 0, 0],
        // Per-particle reveal 0→1 (fed back to DOM)
        cardReveal: [0, 0, 0, 0, 0, 0],
        lastDomain: null,
    });

    // ── Unproject a screen-space point into Three.js world at Z=0 ──
    const screenToWorld = useCallback((screenX, screenY, cam, viewportW, viewportH) => {
        // NDC
        const ndc = new THREE.Vector3(
            (screenX / viewportW) * 2 - 1,
            -(screenY / viewportH) * 2 + 1,
            0.5,
        );
        ndc.unproject(cam);
        // Ray from camera
        const dir = ndc.sub(cam.position).normalize();
        // Intersect Z=0 plane
        const t = -cam.position.z / dir.z;
        return new THREE.Vector3(
            cam.position.x + dir.x * t,
            cam.position.y + dir.y * t,
            0,
        );
    }, []);

    // ── Compute card world targets from DOM positions ──
    const computeCardTargets = useCallback(() => {
        const refs = cardDOMRefs?.current;
        if (!refs) return false;
        const cam = camera;
        const W = size.width;
        
        // Use visualViewport height if available, otherwise fallback to size.height
        const H = window.visualViewport ? window.visualViewport.height : size.height;
        
        let allReady = true;
        for (let i = 0; i < 6; i++) {
            const el = refs[i];
            if (!el) { anim.current.cardTargets[i] = null; continue; }
            const rect = el.getBoundingClientRect();
            if (rect.width === 0) { anim.current.cardTargets[i] = null; continue; }
            
            // Adjust top based on visualViewport offset (helps with iOS Safari address bar)
            const visualOffsetTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top - visualOffsetTop + rect.height / 2;
            
            anim.current.cardTargets[i] = screenToWorld(cx, cy, cam, W, H);
        }
        return allReady;
    }, [camera, size, cardDOMRefs, screenToWorld]);

    // Handle viewport resizes to invalidate target cache
    useEffect(() => {
        const handleResize = () => {
            anim.current.cardTargetsReady = false;
        };
        window.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("scroll", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("scroll", handleResize);
        };
    }, []);

    // Reset when domain changes
    useEffect(() => {
        const a = anim.current;
        if (selectedDomain) {
            const nodeRef = selectedDomain === "medtech" ? medNodeRef : edNodeRef;
            if (nodeRef?.current) nodeRef.current.getWorldPosition(a.nodeWorldPos);
            a.scrollBaseline = scrollProgress.current ?? 0;
            a.phase = "orbit";
            a.orbitRadius = 0;
            a.particleScale = 0;
            a.flyProgress = [0, 0, 0, 0, 0, 0];
            a.cardReveal = [0, 0, 0, 0, 0, 0];
            a.cardTargets = [null, null, null, null, null, null];
            a.cardTargetsReady = false;
            a.lastDomain = selectedDomain;
            // Reset card reveals
            for (let i = 0; i < 6; i++) onCardReveal(i, 0);
        } else {
            a.phase = "idle";
            for (let i = 0; i < 6; i++) onCardReveal(i, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDomain]);

    const domainColor = useMemo(
        () => new THREE.Color(selectedDomain === "edtech" ? 0x7733cc : 0x0066cc),
        [selectedDomain],
    );

    const coreMats = useMemo(() =>
        [0, 1, 2, 3, 4, 5].map(() => new THREE.MeshBasicMaterial({ color: domainColor })),
        [domainColor]);

    const glowMats = useMemo(() =>
        [0, 1, 2, 3, 4, 5].map(() => new THREE.MeshBasicMaterial({
            color: domainColor, transparent: true, opacity: 0,
            depthWrite: false, blending: THREE.AdditiveBlending,
        })),
        [domainColor]);

    useFrame((_, delta) => {
        const a = anim.current;

        // ── IDLE: shrink out ─────────────────────────────────────────
        if (!selectedDomain || a.phase === "idle") {
            a.particleScale = THREE.MathUtils.lerp(a.particleScale, 0, 1 - Math.pow(0.005, delta));
            meshRefs.current.forEach(m => { if (m) m.scale.setScalar(Math.max(0, a.particleScale)); });
            glowRefs.current.forEach(g => { if (g) { g.scale.setScalar(Math.max(0, a.particleScale * 2.2)); g.material.opacity = 0; } });
            return;
        }

        // ── Update live node world position (tracks breathing bob) ───
        const nodeRef = selectedDomain === "medtech" ? medNodeRef : edNodeRef;
        if (nodeRef?.current) nodeRef.current.getWorldPosition(a.nodeWorldPos);
        const { x: cx, y: cy, z: cz } = a.nodeWorldPos;

        const targetScroll = scrollProgress.current ?? 0;
        a.smoothScroll = a.smoothScroll === undefined ? targetScroll : THREE.MathUtils.lerp(a.smoothScroll, targetScroll, 1 - Math.pow(0.001, delta));
        const sd = Math.max(0, a.smoothScroll - a.scrollBaseline);

        // Compute card targets lazily once refs are painted
        if (!a.cardTargetsReady) {
            a.cardTargetsReady = computeCardTargets();
        }

        // Phase thresholds (scroll delta)
        // Reduced significantly to load cards with much less scrolling
        const spawnT = THREE.MathUtils.smoothstep(sd, 0.000, 0.015);
        const orbitT = THREE.MathUtils.smoothstep(sd, 0.015, 0.040);
        const flyT = THREE.MathUtils.smoothstep(sd, 0.040, 0.085);

        // Orbit rotation: fast during orbit, slows as fly begins
        const orbitSpeed = 2.0 * (1 - flyT * 0.98);
        a.orbitAngles = a.orbitAngles.map((ang, i) =>
            ang + delta * orbitSpeed * (0.82 + i * 0.09)
        );

        // Orbit radius: expands then collapses toward 0 as particles fly away
        const targetR = (1 - flyT) * (0.6 + orbitT * 1.6);
        a.orbitRadius = THREE.MathUtils.lerp(a.orbitRadius, targetR, 1 - Math.pow(0.001, delta));

        // Particle size: grows during spawn/orbit, held during fly, fade-shrink at destination
        const baseScale = spawnT * (0.12 + orbitT * 0.14);

        meshRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const glow = glowRefs.current[i];
            const target = a.cardTargets[i];

            if (!target && a.cardTargetsReady) {
                mesh.scale.setScalar(0);
                if (glow) glow.scale.setScalar(0);
                if (a.cardReveal[i] !== 0) {
                    a.cardReveal[i] = 0;
                    onCardReveal(i, 0);
                }
                return;
            }

            // Orbit world position
            const ang = a.orbitAngles[i];
            const orbitX = cx + Math.cos(ang) * a.orbitRadius;
            const orbitY = cy + Math.sin(ang) * a.orbitRadius * 0.55;
            const orbitZ = cz + Math.sin(ang) * a.orbitRadius * 0.28;

            // Fly-to target
            let finalX = orbitX, finalY = orbitY, finalZ = orbitZ;

            if (target && flyT > 0) {
                // Smooth ease-in-out for each particle's fly
                const ease = THREE.MathUtils.smoothstep(flyT, i * 0.06, 0.85 + i * 0.04);
                finalX = THREE.MathUtils.lerp(orbitX, target.x, ease);
                finalY = THREE.MathUtils.lerp(orbitY, target.y, ease);
                finalZ = THREE.MathUtils.lerp(orbitZ, target.z, ease);

                // When particle is close, reveal the card and shrink particle
                const arrival = THREE.MathUtils.smoothstep(ease, 0.82, 1.0);
                a.cardReveal[i] = THREE.MathUtils.lerp(a.cardReveal[i], arrival, 1 - Math.pow(0.01, delta));
                onCardReveal(i, a.cardReveal[i]);
            } else {
                if (a.cardReveal[i] !== 0) {
                    a.cardReveal[i] = 0;
                    onCardReveal(i, 0);
                }
            }

            mesh.position.set(finalX, finalY, finalZ);

            // Particle shrinks as card reveals
            const sc = Math.max(0, baseScale * (1 - a.cardReveal[i]));
            mesh.scale.setScalar(sc);

            if (glow) {
                glow.position.copy(mesh.position);
                glow.scale.setScalar(sc * 2.5);
                glow.material.opacity = 0.30 * Math.min(1, sc / 0.08) * (1 - a.cardReveal[i]);
            }
        });
    });

    return (
        <group>
            {[0, 1, 2, 3, 4, 5].map(i => (
                <group key={i}>
                    <mesh ref={el => (meshRefs.current[i] = el)} scale={[0, 0, 0]}>
                        <sphereGeometry args={[0.28, 18, 18]} />
                        <primitive object={coreMats[i]} />
                    </mesh>
                    <mesh ref={el => (glowRefs.current[i] = el)} scale={[0, 0, 0]}>
                        <sphereGeometry args={[0.46, 12, 12]} />
                        <primitive object={glowMats[i]} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────
// DNA SCENE — single rendering
// ─────────────────────────────────────────────────────────────────
export function DNAScene({
    scrollProgress,
    selectedDomain,
    medNodeRef,
    edNodeRef,
    cardDOMRefs,
    onCardReveal,
}) {
    const groupRef = useRef();
    const strandGeoRef = useRef();
    const bridgeGeoRef = useRef();
    const bokehGeoRef = useRef();
    const coreGeoRef = useRef();
    const medGlowRef = useRef();
    const edGlowRef = useRef();
    const focus = useDomainFocus(selectedDomain);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    // Better heuristic for low power device: few cores, coarse pointer, or mobile
    const isLowPowerDevice = typeof navigator !== "undefined" && (
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
        isMobile
    );

    const STRAND_PTS = isLowPowerDevice ? 600 : 1400;
    const BRIDGE_COUNT = isLowPowerDevice ? 40 : 90;
    const BOKEH_COUNT = isLowPowerDevice ? 50 : 140;
    const CORE_PTS = isLowPowerDevice ? 250 : 500;
    const HELIX_R = 1.65;
    const HELIX_H = 24;
    const TURNS = 6;

    const baseStrandPos = useRef(null);

    const strandData = useMemo(() => {
        const pos = new Float32Array(STRAND_PTS * 4 * 3);
        const col = new Float32Array(STRAND_PTS * 4 * 3);
        for (let s = 0; s < 4; s++) {
            const ph = (s % 2) === 1 ? Math.PI : 0;
            for (let i = 0; i < STRAND_PTS; i++) {
                const t = i / STRAND_PTS;
                const ang = t * Math.PI * 2 * TURNS + ph;
                const y = (t - 0.5) * HELIX_H;
                const idx = (s * STRAND_PTS + i) * 3;
                pos[idx] = Math.cos(ang) * HELIX_R;
                pos[idx + 1] = y;
                pos[idx + 2] = Math.sin(ang) * HELIX_R;
                const heat = Math.max(0, 1 - Math.abs(t - 0.48) * 2.6);
                col[idx] = 0.5 + heat * 0.5;
                col[idx + 1] = 0.75 - heat * 0.6;
                col[idx + 2] = 1.0 - heat * 0.7;
            }
        }
        baseStrandPos.current = new Float32Array(pos);
        return { pos, col };
    }, []);

    const bridgeData = useMemo(() => {
        const PTS = BRIDGE_COUNT * 2 * 8;
        const pos = new Float32Array(PTS * 3);
        const col = new Float32Array(PTS * 3);
        for (let h = 0; h < 2; h++) {
            for (let i = 0; i < BRIDGE_COUNT; i++) {
                const t = i / BRIDGE_COUNT;
                const ang = t * Math.PI * 2 * TURNS;
                const y = (t - 0.5) * HELIX_H;
                const heat = Math.max(0, 1 - Math.abs(t - 0.48) * 2.6);
                for (let p = 0; p < 8; p++) {
                    const f = p / 7;
                    const idx = (h * BRIDGE_COUNT * 8 + i * 8 + p) * 3;
                    pos[idx] = Math.cos(ang) * HELIX_R + (Math.cos(ang + Math.PI) * HELIX_R - Math.cos(ang) * HELIX_R) * f;
                    pos[idx + 1] = y;
                    pos[idx + 2] = Math.sin(ang) * HELIX_R + (Math.sin(ang + Math.PI) * HELIX_R - Math.sin(ang) * HELIX_R) * f;
                    col[idx] = 0.45 + heat * 0.55;
                    col[idx + 1] = 0.75 - heat * 0.55;
                    col[idx + 2] = 1.0 - heat * 0.65;
                }
            }
        }
        return { pos, col };
    }, []);

    const coreData = useMemo(() => {
        const pos = new Float32Array(CORE_PTS * 3);
        const col = new Float32Array(CORE_PTS * 3);
        for (let i = 0; i < CORE_PTS; i++) {
            const t = 0.28 + (i / CORE_PTS) * 0.42;
            const ang = t * Math.PI * 2 * TURNS + (Math.random() - 0.5) * 0.8;
            const y = (t - 0.5) * HELIX_H + (Math.random() - 0.5) * 1.2;
            const r = HELIX_R * (0.3 + Math.random() * 0.9);
            const idx = i * 3;
            pos[idx] = Math.cos(ang) * r; pos[idx + 1] = y; pos[idx + 2] = Math.sin(ang) * r;
            col[idx] = 0.85 + Math.random() * 0.15;
            col[idx + 1] = 0.08 + Math.random() * 0.22;
            col[idx + 2] = 0.12 + Math.random() * 0.2;
        }
        return { pos, col };
    }, []);

    const bokehData = useMemo(() => {
        const pos = new Float32Array(BOKEH_COUNT * 3);
        const col = new Float32Array(BOKEH_COUNT * 3);
        for (let i = 0; i < BOKEH_COUNT; i++) {
            const idx = i * 3;
            pos[idx] = (Math.random() - 0.2) * 20;
            pos[idx + 1] = (Math.random() - 0.5) * HELIX_H * 1.3;
            pos[idx + 2] = -3 - Math.random() * 9;
            const v = Math.random();
            if (v < 0.55) { col[idx] = 0.04; col[idx + 1] = 0.58; col[idx + 2] = 1.0; }
            else if (v < 0.82) { col[idx] = 0.12; col[idx + 1] = 0.32; col[idx + 2] = 0.92; }
            else { col[idx] = 0.5; col[idx + 1] = 0.08; col[idx + 2] = 0.82; }
        }
        return { pos, col };
    }, []);

    const mouseRef = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const fn = e => { mouseRef.current.x = e.clientX / window.innerWidth - 0.5; mouseRef.current.y = e.clientY / window.innerHeight - 0.5; };
        window.addEventListener("mousemove", fn);
        return () => window.removeEventListener("mousemove", fn);
    }, []);

    const frozenGroupTransform = useRef(null);

    const strandMat = useMemo(() => new THREE.PointsMaterial({ size: 0.058, vertexColors: true, transparent: true, opacity: 0.94, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }), []);
    const coreMat = useMemo(() => new THREE.PointsMaterial({ size: 0.085, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }), []);
    const bridgeMat = useMemo(() => new THREE.PointsMaterial({ size: 0.038, vertexColors: true, transparent: true, opacity: 0.52, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }), []);
    const bokehMat = useMemo(() => new THREE.PointsMaterial({ size: 0.38, vertexColors: true, transparent: true, opacity: 0.4, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }), []);

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();
        const scroll = scrollProgress.current ?? 0;
        const splitFactor = THREE.MathUtils.smoothstep(scroll, 0.32, 0.38);

        let targetX = 3.2, targetY = 0.0, baseScale = 1.0;
        if (scroll < 0.2) { targetX = 3.2; targetY = 0.0; baseScale = 1.0; }
        else if (scroll < 0.32) { const b = (scroll - 0.2) / 0.12; targetX = THREE.MathUtils.lerp(3.2, 0.0, b); targetY = THREE.MathUtils.lerp(0.0, 0.5, b); baseScale = THREE.MathUtils.lerp(1.0, 0.35, b); }
        else if (scroll < 0.52) { targetX = 0.0; targetY = 0.5; baseScale = 0.35; }
        else { const b = Math.min(1, (scroll - 0.52) / 0.18); targetX = 0.0; targetY = THREE.MathUtils.lerp(0.5, 6.0, b); baseScale = THREE.MathUtils.lerp(0.35, 0.2, b); }

        const focusAbs = Math.abs(focus.current);
        baseScale *= 1 - 0.12 * focusAbs;

        const vw = state.viewport.width || 12;
        const FOCUS_BAND = 0.32;
        const safeScale = Math.max(baseScale, 0.001);
        const medT = Math.max(0, -focus.current);
        const edT = Math.max(0, focus.current);
        const medFocusShiftLocal = (vw * FOCUS_BAND * medT) / safeScale;
        const edFocusShiftLocal = (-vw * FOCUS_BAND * edT) / safeScale;

        if (selectedDomain) {
            if (!frozenGroupTransform.current) {
                frozenGroupTransform.current = {
                    x: groupRef.current?.position.x ?? targetX,
                    y: groupRef.current?.position.y ?? targetY,
                    scale: groupRef.current?.scale.x ?? baseScale,
                };
            }
            if (groupRef.current) {
                const g = groupRef.current, f = frozenGroupTransform.current;
                g.position.x = f.x;
                g.position.y = f.y + Math.sin(t * 0.3) * 0.06;
                g.scale.setScalar(f.scale);
                g.rotation.z = 0;
                g.rotation.x = mouseRef.current.y * 0.015;
                g.rotation.y = mouseRef.current.x * 0.015;
            }
        } else {
            frozenGroupTransform.current = null;
            if (groupRef.current) {
                const g = groupRef.current;
                g.rotation.z = THREE.MathUtils.lerp(0.58, 0.0, splitFactor);
                g.rotation.x = mouseRef.current.y * 0.03;
                g.rotation.y = mouseRef.current.x * 0.03;
                g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, 0.04);
                g.position.y = targetY + Math.sin(t * 0.3) * 0.15;
                g.scale.setScalar(baseScale);
            }
        }

        // ── Strand geometry ───────────────────────────────────────────
        if (strandGeoRef.current && baseStrandPos.current) {
            const pa = strandGeoRef.current.attributes.position;
            const ca = strandGeoRef.current.attributes.color;
            const scrollSpin = scroll * Math.PI * 4;
            for (let s = 0; s < 4; s++) {
                const helixIdx = s < 2 ? 0 : 1;
                const strandIdx = s % 2;
                const ph = strandIdx === 1 ? Math.PI : 0;
                const sideSign = helixIdx === 0 ? -1 : 1;
                const sideFade = sideSign === -1 ? 1 - Math.max(0, focus.current) : 1 - Math.max(0, -focus.current);
                const focusShift = sideSign === -1 ? medFocusShiftLocal : edFocusShiftLocal;
                for (let i = 0; i < STRAND_PTS; i++) {
                    const tN = i / STRAND_PTS;
                    const wave = Math.sin(tN * Math.PI * 10 + t * 1.1) * 0.06;
                    const ang = tN * Math.PI * 2 * TURNS + ph + scrollSpin;
                    const y = (tN - 0.5) * HELIX_H;
                    const forkH = Math.max(0, 0.8 - tN) / 0.8;
                    const curve = Math.pow(forkH, 2);
                    const xBO = sideSign * splitFactor * curve * 17.5;
                    let fx = Math.cos(ang) * (HELIX_R + wave) + xBO, fy = y, fz = Math.sin(ang) * (HELIX_R + wave);
                    if (tN < 0.5) {
                        const blend = (0.5 - tN) / 0.5;
                        const txf = sideSign > 0 ? 17.5 : -17.5;
                        fx = THREE.MathUtils.lerp(fx, txf, blend * splitFactor);
                        fy = THREE.MathUtils.lerp(fy, 0.0, blend * splitFactor);
                        fz = THREE.MathUtils.lerp(fz, 0, blend * splitFactor);
                    }
                    fx += focusShift * splitFactor;
                    pa.setXYZ(s * STRAND_PTS + i, fx, THREE.MathUtils.lerp(9999, fy, sideFade), fz);
                    const heat = Math.max(0, 1 - Math.abs(tN - 0.48) * 2.6);
                    const rB = 0.5 + heat * 0.5, gB = 0.75 - heat * 0.6, bB = 1.0 - heat * 0.7;
                    let rT, gT, bT;
                    if (sideSign === -1) { rT = 0.05 + heat * 0.1; gT = 0.45 - heat * 0.15; bT = 1.0; }
                    else { rT = 0.55 + heat * 0.25; gT = 0.2 - heat * 0.15; bT = 0.9; }
                    ca.setXYZ(s * STRAND_PTS + i, THREE.MathUtils.lerp(rB, rT, splitFactor), THREE.MathUtils.lerp(gB, gT, splitFactor), THREE.MathUtils.lerp(bB, bT, splitFactor));
                }
            }
            pa.needsUpdate = true; ca.needsUpdate = true;
        }

        if (bridgeGeoRef.current) {
            const ba = bridgeGeoRef.current.attributes.position, bca = bridgeGeoRef.current.attributes.color;
            const scrollSpin = scroll * Math.PI * 4;
            for (let h = 0; h < 2; h++) {
                const sideSign = h === 0 ? -1 : 1;
                const sideFade = sideSign === -1 ? 1 - Math.max(0, focus.current) : 1 - Math.max(0, -focus.current);
                const focusShift = sideSign === -1 ? medFocusShiftLocal : edFocusShiftLocal;
                for (let i = 0; i < BRIDGE_COUNT; i++) {
                    const tN = i / BRIDGE_COUNT, ang = tN * Math.PI * 2 * TURNS + scrollSpin, y = (tN - 0.5) * HELIX_H;
                    const forkH = Math.max(0, 0.8 - tN) / 0.8, curve = Math.pow(forkH, 2), xOff = sideSign * splitFactor * curve * 17.5;
                    let lx = Math.cos(ang) * HELIX_R + xOff, lz = Math.sin(ang) * HELIX_R, rx = Math.cos(ang + Math.PI) * HELIX_R + xOff, rz = Math.sin(ang + Math.PI) * HELIX_R, ly = y, ry = y;
                    if (tN < 0.5) { const bl = (0.5 - tN) / 0.5, txf = sideSign > 0 ? 17.5 : -17.5; lx = THREE.MathUtils.lerp(lx, txf, bl * splitFactor); ly = THREE.MathUtils.lerp(ly, 0, bl * splitFactor); rx = THREE.MathUtils.lerp(rx, txf, bl * splitFactor); ry = THREE.MathUtils.lerp(ry, 0, bl * splitFactor); }
                    lx += focusShift * splitFactor; rx += focusShift * splitFactor;
                    const bhy = THREE.MathUtils.lerp(9999, 0, sideFade);
                    for (let p = 0; p < 8; p++) {
                        const f = p / 7, ptIdx = h * BRIDGE_COUNT * 8 + i * 8 + p;
                        ba.setXYZ(ptIdx, lx + (rx - lx) * f, (ly + (ry - ly) * f) + bhy, lz + (rz - lz) * f);
                        const heat = Math.max(0, 1 - Math.abs(tN - 0.48) * 2.6);
                        const rB = 0.45 + heat * 0.55, gB = 0.75 - heat * 0.55, bB = 1.0 - heat * 0.65;
                        let rT, gT, bT;
                        if (sideSign === -1) { rT = 0.05 + heat * 0.1; gT = 0.45 - heat * 0.15; bT = 1.0; } else { rT = 0.55 + heat * 0.25; gT = 0.2 - heat * 0.15; bT = 0.9; }
                        bca.setXYZ(ptIdx, THREE.MathUtils.lerp(rB, rT, splitFactor), THREE.MathUtils.lerp(gB, gT, splitFactor), THREE.MathUtils.lerp(bB, bT, splitFactor));
                    }
                }
            }
            ba.needsUpdate = true; bca.needsUpdate = true;
        }

        if (coreMat) coreMat.opacity = 0.88 * (1 - splitFactor);

        if (groupRef.current) {
            const medFade = 1 - Math.max(0, focus.current), edFade = 1 - Math.max(0, -focus.current);
            if (medNodeRef?.current) { medNodeRef.current.position.x = -17.5 + medFocusShiftLocal; medNodeRef.current.scale.setScalar(splitFactor * medFade); }
            if (edNodeRef?.current) { edNodeRef.current.position.x = 17.5 + edFocusShiftLocal; edNodeRef.current.scale.setScalar(splitFactor * edFade); }
            if (medGlowRef.current) { medGlowRef.current.position.x = -17.5 + medFocusShiftLocal; medGlowRef.current.material.opacity = 0.15 * medFade; }
            if (edGlowRef.current) { edGlowRef.current.position.x = 17.5 + edFocusShiftLocal; edGlowRef.current.material.opacity = 0.15 * edFade; }
        }
    });

    return (
        <>
            <points material={bokehMat}>
                <bufferGeometry ref={bokehGeoRef}>
                    <bufferAttribute attach="attributes-position" array={bokehData.pos} count={BOKEH_COUNT} itemSize={3} />
                    <bufferAttribute attach="attributes-color" array={bokehData.col} count={BOKEH_COUNT} itemSize={3} />
                </bufferGeometry>
            </points>

            {/* ── SINGLE DNA GROUP ── */}
            <group ref={groupRef}>
                <points material={strandMat}>
                    <bufferGeometry ref={strandGeoRef}>
                        <bufferAttribute attach="attributes-position" array={strandData.pos} count={STRAND_PTS * 4} itemSize={3} />
                        <bufferAttribute attach="attributes-color" array={strandData.col} count={STRAND_PTS * 4} itemSize={3} />
                    </bufferGeometry>
                </points>
                <points material={coreMat}>
                    <bufferGeometry ref={coreGeoRef}>
                        <bufferAttribute attach="attributes-position" array={coreData.pos} count={CORE_PTS} itemSize={3} />
                        <bufferAttribute attach="attributes-color" array={coreData.col} count={CORE_PTS} itemSize={3} />
                    </bufferGeometry>
                </points>
                <points material={bridgeMat}>
                    <bufferGeometry ref={bridgeGeoRef}>
                        <bufferAttribute attach="attributes-position" array={bridgeData.pos} count={BRIDGE_COUNT * 16} itemSize={3} />
                        <bufferAttribute attach="attributes-color" array={bridgeData.col} count={BRIDGE_COUNT * 16} itemSize={3} />
                    </bufferGeometry>
                </points>

                {/* MedTech node — ref exposed to OrbitalParticleSystem */}
                <mesh ref={medNodeRef} position={[-17.5, 0, 0]} scale={[0, 0, 0]}>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <meshBasicMaterial color="#0066cc" />
                </mesh>
                <mesh ref={medGlowRef} position={[-17.5, 0, 0]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshBasicMaterial color="#0066cc" transparent opacity={0.15} />
                </mesh>

                {/* EdTech node */}
                <mesh ref={edNodeRef} position={[17.5, 0, 0]} scale={[0, 0, 0]}>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <meshBasicMaterial color="#7733cc" />
                </mesh>
                <mesh ref={edGlowRef} position={[17.5, 0, 0]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshBasicMaterial color="#7733cc" transparent opacity={0.15} />
                </mesh>
            </group>

            {/*
              OrbitalParticleSystem is a SIBLING (not child) of the DNA group.
              It reads node world positions via medNodeRef/edNodeRef,
              orbits in world space, then flies to card DOM positions.
            */}
            <OrbitalParticleSystem
                scrollProgress={scrollProgress}
                selectedDomain={selectedDomain}
                medNodeRef={medNodeRef}
                edNodeRef={edNodeRef}
                cardDOMRefs={cardDOMRefs}
                onCardReveal={onCardReveal}
            />
        </>
    );
}

// ─────────────────────────────────────────────────────────────────
// CAMERA RIG
// ─────────────────────────────────────────────────────────────────
export function CameraRig({ scrollProgress, selectedDomain }) {
    const { camera, size } = useThree();
    const curr = useRef({ x: 0, y: 0, z: 11 });
    const mouse = useRef({ x: 0, y: 0 });
    const focus = useDomainFocus(selectedDomain);

    useEffect(() => {
        const fn = e => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
        window.addEventListener("mousemove", fn);
        return () => window.removeEventListener("mousemove", fn);
    }, []);

    useEffect(() => {
        // Adjust FOV based on viewport width to ensure DNA doesn't clip
        let targetFov = 55;
        if (size.width <= 480) {
            targetFov = 75; // Significantly wider FOV for phones
        } else if (size.width <= 768) {
            targetFov = 65; // Slightly wider for tablets
        } else if (size.width <= 1024) {
            targetFov = 60;
        }
        
        if (camera.fov !== targetFov) {
            camera.fov = targetFov;
            camera.updateProjectionMatrix();
        }
    }, [size, camera]);

    useFrame((_, delta) => {
        const scroll = scrollProgress.current ?? 0;
        const isMobile = size.width <= 768;
        
        // Base distance pushed back on mobile to fit the height of the helix
        const baseTz = isMobile ? 14.5 : 10.5; 
        
        let tz = baseTz;
        if (scroll < 0.2) tz = baseTz - scroll * 2;
        else if (scroll < 0.52) tz = baseTz - 0.6;
        else tz = baseTz - 0.6 + (scroll - 0.52) * 4;
        tz -= Math.abs(focus.current) * 1.2;

        const centerFactor = THREE.MathUtils.smoothstep(scroll, 0.2, 0.32);
        
        // On desktop, DNA starts right-aligned (tx=1.5). On mobile, we keep it centered or slightly shifted.
        const startTx = isMobile ? 0.0 : 1.5;
        const tx = THREE.MathUtils.lerp(startTx, 0.0, centerFactor) + mouse.current.x * (isMobile ? 0.5 : 1.0) + focus.current * 0.6;
        const ty = -mouse.current.y * 0.7;
        
        // LookAt target
        const startLookX = isMobile ? 0.0 : 2.5;
        const lookX = THREE.MathUtils.lerp(startLookX, 0.0, centerFactor) + focus.current * 0.8;

        const lerp = 1 - Math.pow(0.028, delta);
        curr.current.x += (tx - curr.current.x) * lerp;
        curr.current.y += (ty - curr.current.y) * lerp;
        curr.current.z += (tz - curr.current.z) * lerp;
        camera.position.set(curr.current.x, curr.current.y, curr.current.z);
        camera.lookAt(lookX, 0, 0);
    });
    return null;
}

// ─────────────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────────────
const CONTENT_BLOCKS = [
    { threshold: 0.01, type: "logo" },
    { threshold: 0.03, type: "eyebrow" },
    { threshold: 0.07, type: "title" },
    { threshold: 0.12, type: "subtitle" },
    { threshold: 0.18, type: "body" },
    { threshold: 0.24, type: "buttons" },
];

function ScrollRevealContent({ scrollProgress, setActiveModal }) {
    const [visible, setVisible] = useState([]);
    const [opacity, setOpacity] = useState(1);
    const rafRef = useRef();
    useEffect(() => {
        const tick = () => {
            const s = scrollProgress.current ?? 0;
            setVisible(CONTENT_BLOCKS.filter(b => s >= b.threshold).map(b => b.type));
            if (s < 0.25) setOpacity(1);
            else if (s < 0.32) setOpacity(1 - (s - 0.25) / 0.07);
            else setOpacity(0);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [scrollProgress]);
    const show = t => visible.includes(t);

    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", zIndex: 20, padding: "0 6vw", pointerEvents: opacity > 0.1 ? "auto" : "none", opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ maxWidth: 390 }}>
                <motion.img
                    src="/LOGO.png"
                    alt="Neanic Logo"
                    initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                    animate={{ opacity: show("logo") ? 1 : 0, y: show("logo") ? 0 : 16, filter: show("logo") ? "blur(0px)" : "blur(10px)" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        height: "165px",
                        marginLeft: "-18px",
                        marginBottom: "-45px",
                        transform: "translateY(50px)",
                        display: "block",
                        pointerEvents: "none",
                        objectFit: "contain"
                    }}
                />
                <motion.div initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: show("eyebrow") ? 1 : 0, y: show("eyebrow") ? 0 : 12, filter: show("eyebrow") ? "blur(0px)" : "blur(4px)" }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 13.5, pointerEvents: "none" }}>
                    <span style={{ width: 5.25, height: 5.25, borderRadius: "50%", display: "inline-block", background: "#0088cc", boxShadow: "0 0 8px #0088cc99", animation: "pulseDot 2.2s ease-in-out infinite" }} />
                    <span style={{ fontSize: 8.25, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>Biotechnology · Diagnostics · Innovation</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 16, filter: "blur(10px)" }} animate={{ opacity: show("title") ? 1 : 0, y: show("title") ? 0 : 16, filter: show("title") ? "blur(0px)" : "blur(10px)" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ fontSize: "clamp(28.5px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.04, margin: "0 0 12px", fontFamily: "'Inter',sans-serif", background: "linear-gradient(135deg,#060e1c 30%,#003a88 68%,#0099cc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", pointerEvents: "none" }}>Neanic Solutions</motion.h1>
                <motion.p initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: show("subtitle") ? 1 : 0, y: show("subtitle") ? 0 : 14, filter: show("subtitle") ? "blur(0px)" : "blur(6px)" }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }} style={{ fontSize: "clamp(10.5px, 1.45vw, 15px)", color: "var(--color-primary)", fontWeight: 600, lineHeight: 1.4, margin: "0 0 10.5px", fontFamily: "'Inter',sans-serif", whiteSpace: "pre-line", pointerEvents: "none" }}>{"Redefining Healthcare Through\nAdvanced Diagnostic Technologies"}</motion.p>
                <motion.p initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: show("body") ? 1 : 0, y: show("body") ? 0 : 12, filter: show("body") ? "blur(0px)" : "blur(4px)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ fontSize: "clamp(9.75px, 1vw, 11.25px)", color: "rgba(15,45,90,0.6)", lineHeight: 1.8, margin: "0 0 22.5px", fontFamily: "'Inter',sans-serif", maxWidth: 315, pointerEvents: "none" }}>Empowering biotechnology innovation through advanced diagnostic devices, scientific education, and next-generation healthcare solutions.</motion.p>

            </div>
        </div>
    );
}

function ScrollHint({ visible }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.4 } }} transition={{ delay: 1.2, duration: 1 }} style={{ position: "absolute", bottom: 21, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4.5, zIndex: 20, pointerEvents: "none" }}>
                    <span style={{ fontSize: 7.5, color: "var(--color-text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Inter',sans-serif" }}>scroll to explore</span>
                    <motion.div animate={{ scaleY: [1, 0.3, 1], opacity: [0.35, 0.85, 0.35] }} transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }} style={{ width: 0.75, height: 27, background: "linear-gradient(to bottom,rgba(0,120,200,0.45),transparent)" }} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const STAGES = ["Discover", "Exploring", "Inside", "Ascending", "Beyond"];
function StageIndicator({ stage }) {
    return (
        <div style={{ position: "fixed", right: 16.5, top: "50%", transform: "translateY(-50%)", zIndex: 50, display: "flex", flexDirection: "column", gap: 7.5, pointerEvents: "none" }}>
            {STAGES.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 5.25, justifyContent: "flex-end" }}>
                    {i === stage && <motion.span key={s} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: 6.75, color: "var(--color-text-muted)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.14em", textTransform: "uppercase" }}>{s}</motion.span>}
                    <div style={{ height: 1.5, borderRadius: 0.75, width: i === stage ? 20 : 5, background: i === stage ? "#0088cc" : "rgba(0,120,200,0.18)", boxShadow: i === stage ? "0 0 5px #0088cc55" : "none", transition: "all 0.35s ease" }} />
                </div>
            ))}
        </div>
    );
}

export function Navbar({ setActiveModal }) {
    return (
        <motion.nav initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "15px 6vw", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 30, borderBottom: "1px solid rgba(0,80,160,0.07)", backdropFilter: "blur(10px)", background: "rgba(236,245,255,0.55)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 21, height: 21, borderRadius: 5.25, background: "linear-gradient(135deg,#0066cc,#003388)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,80,200,0.2)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L7 12.5M3.5 4Q7 1.5 10.5 4M3.5 10Q7 12.5 10.5 10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" /></svg>
                </div>
                <span style={{ fontSize: 11.25, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter',sans-serif" }}>Neanic</span>
            </div>
            <div style={{ display: "flex", gap: 21 }}>
                {[{ label: "About", id: "why-neanic-matters" }, { label: "Research", id: "pipeline" }, { label: "Education", id: "edtech" }, { label: "Milestones", id: "news" }, { label: "Contact", modal: "contact" }].map(({ label, id, modal }) => (
                    <a key={label} style={{ fontSize: 9, color: "rgba(10,40,90,0.55)", textDecoration: "none", fontFamily: "'Inter',sans-serif", fontWeight: 450, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#0055bb"} onMouseLeave={e => e.currentTarget.style.color = "rgba(10,40,90,0.55)"} onClick={() => {
                        if (modal) {
                            setActiveModal(modal);
                        } else if (id === "edtech") {
                            const scrollH = document.documentElement.scrollHeight - window.innerHeight;
                            window.scrollTo({ top: scrollH * 0.385, behavior: "smooth" });
                        } else {
                            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                        }
                    }}>{label}</a>
                ))}
            </div>
        </motion.nav>
    );
}

export function Footer({ setActiveModal }) {
    return (
        <footer style={{ background: "#060e1c", padding: "60px 6vw 30px", position: "relative", overflow: "hidden" }}>
            <div style={{ maxWidth: 825, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36, marginBottom: 48 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 7.5, marginBottom: 15 }}>
                            <img src="/LOGO.png" alt="Neanic Solutions" style={{ height: 75, objectFit: "contain", transform: "translateY(15px)" }} />
                            <span style={{ fontSize: 12.75, fontWeight: 800, color: "white", fontFamily: "'Inter',sans-serif" }}>Neanic Solutions</span>
                        </div>
                        <p style={{ fontSize: 9.75, color: "rgba(180,200,240,0.5)", fontFamily: "'Inter',sans-serif", lineHeight: 1.8, maxWidth: 210 }}>Bridging molecular science and accessible healthcare.</p>
                    </div>
                    {[
                        { title: "Solutions", links: ["MedTech", "EdTech", "Innovation Pipeline", "Partnership Opportunities"] },
                        { title: "Company", links: ["About", "Founders", "Latest Milestones", "Careers"] },
                        { title: "Connect", links: ["📧 nanoashish@gmail.com"] }
                    ].map(col => (
                        <div key={col.title}>
                            <p style={{ fontSize: 8.25, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(100,160,255,0.5)", fontFamily: "'Inter',sans-serif", marginBottom: 12 }}>{col.title}</p>
                            {col.links.map(link => (
                                <p key={link} style={{ fontSize: 9.75, color: "rgba(180,200,240,0.45)", fontFamily: "'Inter',sans-serif", marginBottom: 6, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "rgba(180,200,240,0.85)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(180,200,240,0.45)"} onClick={() => {
                                    if (link === "📧 nanoashish@gmail.com") {
                                        window.location.href = "mailto:nanoashish@gmail.com";
                                    } else if (["MedTech", "EdTech"].includes(link)) {
                                        const scrollH = document.documentElement.scrollHeight - window.innerHeight;
                                        window.scrollTo({ top: scrollH * 0.385, behavior: "smooth" });
                                    } else if (link === "Innovation Pipeline") {
                                        document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" });
                                    } else if (link === "Partnership Opportunities") {
                                        document.getElementById("partnership")?.scrollIntoView({ behavior: "smooth" });
                                    } else if (link === "About") {
                                        document.getElementById("why-neanic-matters")?.scrollIntoView({ behavior: "smooth" });
                                    } else if (link === "Latest Milestones") {
                                        document.getElementById("news")?.scrollIntoView({ behavior: "smooth" });
                                    } else if (["Careers", "Founders"].includes(link)) {
                                        document.getElementById("founders")?.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}>{link}</p>
                            ))}
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 21, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 9 }}>
                    <p style={{ fontSize: 9, color: "rgba(180,200,240,0.3)", fontFamily: "'Inter',sans-serif", margin: 0 }}>© 2025 Neanic Solutions. All rights reserved.</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 8.25, color: "rgba(180,200,240,0.4)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.05em" }}>
                        <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "rgba(180,200,240,0.85)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(180,200,240,0.4)"}>Privacy Policy</span>
                        <span>•</span>
                        <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "rgba(180,200,240,0.85)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(180,200,240,0.4)"} onClick={() => document.getElementById("founders")?.scrollIntoView({ behavior: "smooth" })}>Careers</span>
                        <span>•</span>
                        <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "rgba(180,200,240,0.85)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(180,200,240,0.4)"} onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })}>Research</span>
                        <span>•</span>
                        <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "rgba(180,200,240,0.85)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(180,200,240,0.4)"} onClick={() => setActiveModal("contact")}>Contact</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ─────────────────────────────────────────────────────────────────
// ROOT HERO COMPONENT
// Owns:  cardDOMRefs (from DNASplitSection DOM)
//        cardReveals state (fed by OrbitalParticleSystem via onCardReveal)
// Both threaded down into Canvas AND into DNASplitSection.
// ─────────────────────────────────────────────────────────────────
export default function NeanicHero({ setActiveModal, scrollProgress: propScrollProgress, selectedDomain, setSelectedDomain }) {
    const localScrollProgress = useRef(0);
    const scrollProgress = propScrollProgress || localScrollProgress;
    const [stage, setStage] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [splitRevealed, setSplitRevealed] = useState(false);

    // Card DOM refs — populated by DNASplitSection once it mounts
    const cardDOMRefs = useRef([null, null, null, null]);
    const handleCardRefsReady = useCallback((refs) => {
        cardDOMRefs.current = refs.current;
    }, []);

    // Per-card reveal values 0→1 driven by particle arrival
    const [cardReveals, setCardReveals] = useState([0, 0, 0, 0, 0, 0]);
    const cardRevealsRef = useRef([0, 0, 0, 0, 0, 0]);

    // Called every frame by OrbitalParticleSystem (inside Canvas)
    // We batch-update React state at ~10fps to avoid flooding reconciler
    const revealFlushTimer = useRef(null);
    const onCardReveal = useCallback((index, value) => {
        cardRevealsRef.current[index] = value;
        if (!revealFlushTimer.current) {
            revealFlushTimer.current = setTimeout(() => {
                setCardReveals([...cardRevealsRef.current]);
                revealFlushTimer.current = null;
            }, 32); // ~30fps flush
        }
    }, []);

    // Also expose medNodeRef / edNodeRef here so DNAScene and
    // OrbitalParticleSystem share the same refs
    const medNodeRef = useRef();
    const edNodeRef = useRef();

    useEffect(() => {
        const onScroll = () => {
            const scrollH = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollH <= 0) return;
            const p = Math.min(window.scrollY / scrollH, 1);
            scrollProgress.current = p;
            setScrolled(window.scrollY > 20);
            setSplitRevealed(p >= 0.38);
            if (p < 0.2) setStage(0);
            else if (p < 0.4) setStage(1);
            else if (p < 0.6) setStage(2);
            else if (p < 0.8) setStage(3);
            else setStage(4);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [scrollProgress]);

    return (
        <>
            <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%;}
    body{background:var(--color-bg-white);overflow-x:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%;}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.55;}}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:var(--color-bg-white);}
        ::-webkit-scrollbar-thumb{background:#aac8ee;border-radius:2px;}
      `}</style>

            <div id="about" style={{ height: "800vh", background: "transparent" }}>
                <div style={{ position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden", background: "transparent" }}>

                    <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to right,rgba(232,242,252,0.97) 0%,rgba(232,242,252,0.72) 32%,rgba(232,242,252,0.1) 52%,transparent 68%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 97.5, zIndex: 2, background: "linear-gradient(to top,rgba(226,238,250,1),transparent)", pointerEvents: "none" }} />

                    {/* ── CANVAS: single DNAScene + OrbitalParticleSystem ── */}
                    <Canvas camera={{ position: [0, 0, 11], fov: 55 }} style={{ position: "absolute", inset: 0, zIndex: 1 }} gl={{ antialias: true, alpha: true }}>
                        <CameraRig scrollProgress={scrollProgress} selectedDomain={selectedDomain} />
                        <DNAScene
                            scrollProgress={scrollProgress}
                            selectedDomain={selectedDomain}
                            medNodeRef={medNodeRef}
                            edNodeRef={edNodeRef}
                            cardDOMRefs={cardDOMRefs}
                            onCardReveal={onCardReveal}
                        />
                    </Canvas>

                    <ScrollRevealContent scrollProgress={scrollProgress} setActiveModal={setActiveModal} />

                    {/* DNASplitSection: exposes card DOM refs so particles can target them */}
                    <DNASplitSection
                        scrollProgress={scrollProgress}
                        selectedDomain={selectedDomain}
                        setSelectedDomain={setSelectedDomain}
                        cardReveals={cardReveals}
                        onCardRefsReady={handleCardRefsReady}
                        setActiveModal={setActiveModal}
                    />

                    <StageIndicator stage={stage} />
                    <ScrollHint visible={!splitRevealed && !selectedDomain} />
                </div>
            </div>
        </>
    );
}