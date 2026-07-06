import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Environment, Text } from "@react-three/drei";
import * as THREE from "three";

const FOCUS_AREAS = [
    { id: "robotics", icon: "🌸", title: "Women's Health Diagnostics", short: "Reproductive Health Monitoring", detail: "Quantitative biosensing solutions for ovulation detection, fertility monitoring, and PCOS diagnosis. Designed to provide fast, accurate results that support informed reproductive healthcare decisions." },
    { id: "vlsi", icon: "💉", title: "Drug Screening", short: "Accelerated Preclinical Testing", detail: "Innovative screening platforms that support drug efficacy and safety evaluation through advanced biosensing technologies. Built to accelerate research while improving the reliability of preclinical studies." },
    { id: "nanotech", icon: "🩺", title: "Point-of-Care Diagnostics", short: "Rapid Healthcare, Anywhere", detail: "Affordable, portable, and easy-to-use diagnostic devices designed for hospitals, primary healthcare centers, and community settings. Enabling early diagnosis, timely clinical decision-making, and improved patient outcomes." },
    { id: "biosensing", icon: "⚗️", title: "Biosensors", short: "Advanced Biosensing Technologies", detail: "Development of highly sensitive electrochemical and paper-based biosensors for rapid, accurate, and quantitative biomarker detection. Focused on delivering reliable diagnostic performance for clinical and point-of-care applications." },
    { id: "organchip", icon: "🧬", title: "Organ-on-Chip", short: "Human Tissue Simulation", detail: "Advanced microfluidic platforms that replicate in-vivo cellular environments for disease modelling, drug testing, and preclinical research. Designed to improve prediction accuracy while reducing dependence on conventional laboratory models." },
    { id: "oncology", icon: "🎗️", title: "Oncological Screening", short: "Cancer biomarker detection", detail: "Portable diagnostic readers focusing on early-stage non-invasive detection of specific cancer protein biomarkers." },
];

const CARD_COUNT = FOCUS_AREAS.length;
const ANGLE_STEP = (Math.PI * 2) / CARD_COUNT; // 60deg apart for 6 cards
const RADIUS_XY = 2.3;   // how far cards spread horizontally/vertically
const RADIUS_Z = 2.4;    // how far the ring recedes into depth as it goes "up"
const ROT_Y_FACTOR = 0.85; // how much side cards angle open, like a book

// Shortest signed offset so the ring always takes the short way around on click
function shortestOffset(i, activeIndex) {
    let diff = i - activeIndex;
    const half = CARD_COUNT / 2;
    if (diff > half) diff -= CARD_COUNT;
    if (diff < -half) diff += CARD_COUNT;
    return diff;
}

function GlassCard({ index, activeIndex, data, onSelect }) {
    const groupRef = useRef();
    const isActive = index === activeIndex;

    const target = useMemo(() => {
        const offset = shortestOffset(index, activeIndex);
        const angle = offset * ANGLE_STEP; // 0 = front/bottom, PI = top/back

        const x = Math.sin(angle) * RADIUS_XY;
        const y = -Math.cos(angle) * RADIUS_XY; // front(angle 0) => -R (low), top(angle PI) => +R (high)
        const z = -(1 - Math.cos(angle)) * RADIUS_Z; // front => 0 (closest), top => -2*RADIUS_Z (farthest)
        const rotY = -angle * ROT_Y_FACTOR;

        const dist = Math.abs(offset);
        const scale = isActive ? 1.2 : Math.max(0.55, 1 - dist * 0.16);
        const opacity = isActive ? 1 : Math.max(0.35, 1 - dist * 0.22);

        return { x, y, z, rotY, scale, opacity };
    }, [index, activeIndex, isActive]);

    useFrame(() => {
        const g = groupRef.current;
        if (!g) return;
        g.position.x = THREE.MathUtils.lerp(g.position.x, target.x, 0.09);
        g.position.y = THREE.MathUtils.lerp(g.position.y, target.y, 0.09);
        g.position.z = THREE.MathUtils.lerp(g.position.z, target.z, 0.09);
        g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.rotY, 0.09);
        g.scale.x = g.scale.y = g.scale.z = THREE.MathUtils.lerp(g.scale.x, target.scale, 0.09);
    });

    return (
        <group ref={groupRef} onClick={() => onSelect(index)}>
            <RoundedBox args={[1.5, 1.9, 0.08]} radius={0.14} smoothness={4}>
                <meshPhysicalMaterial
                    thickness={0.35}
                    roughness={isActive ? 0.05 : 0.22}
                    transmission={isActive ? 0.4 : 0.85}
                    ior={1.3}
                    transparent
                    color={isActive ? "#cce6ff" : "#99ccff"}
                />
            </RoundedBox>
            <Text
                position={[0, 0.2, 0.045]}
                fontSize={0.3}
                color={isActive ? "#ffffff" : "#1c1c1c"}
                anchorX="center"
                anchorY="middle"
            >
                {data.icon}
            </Text>
            <Text
                position={[0, -0.3, 0.045]}
                fontSize={isActive ? 0.16 : 0.12}
                color={isActive ? "#ffffff" : "#1c1c1c"}
                anchorX="center"
                anchorY="middle"
                maxWidth={1.3}
                textAlign="center"
            >
                {data.title}
            </Text>
        </group>
    );
}

function Wheel({ activeIndex, onSelect }) {
    return (
        <group position={[0, 1.1, 0]}>
            {FOCUS_AREAS.map((data, i) => (
                <GlassCard
                    key={data.id}
                    index={i}
                    activeIndex={activeIndex}
                    data={data}
                    onSelect={onSelect}
                />
            ))}
        </group>
    );
}

export default function FocusAreaSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = FOCUS_AREAS[activeIndex];

    return (
        <section id="focus-area" className="section focus-area-section">
            <div className="container">
                <span className="section-label">Focus Areas</span>
                <h2>What We Focus On</h2>

                <div style={{ height: "440px", position: "relative" }}>
                    <Canvas camera={{ position: [0, -0.2, 6.5], fov: 40 }}>
                        <ambientLight intensity={0.8} />
                        <pointLight position={[4, 5, 5]} intensity={1} />
                        <pointLight position={[-3, -2, 4]} intensity={0.6} color="#ffffff" />
                        <Environment preset="city" />
                        <Wheel activeIndex={activeIndex} onSelect={setActiveIndex} />
                    </Canvas>
                </div>

                <div className="focus-info-panel" key={active.id}>
                    <h3>{active.icon} {active.title}</h3>
                    <p className="focus-info-short">{active.short}</p>
                    <p className="focus-info-detail">{active.detail}</p>
                </div>
            </div>
        </section>
    );
}