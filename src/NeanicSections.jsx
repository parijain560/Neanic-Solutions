import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const APPLE_EASE = [0.65, 0, 0.35, 1];

// ─────────────────────────────────────────────────────────────────
// DOMAIN CARDS DATA
// ─────────────────────────────────────────────────────────────────
export const MEDTECH_CARDS = [
    {
        icon: "🔬",
        label: "Advanced Diagnostics",
        detail: "Point-of-care molecular tests that bring lab-quality precision to remote clinics.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Key Features</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>Rapid 15-minute turnaround times</li>
                    <li>No cold-chain logistics required</li>
                    <li>High sensitivity and specificity matching RT-PCR</li>
                </ul>
            </div>
        )
    },
    { icon: "🧬", label: "Biosensor Technologies", detail: "Microfluidic wearable sensors for real-time biomarker tracking and chronic disease management." },
    { icon: "🩸", label: "Women's Health", detail: "Disrupting traditional gynecology with non-invasive, highly accurate screening kits for cervical cancer." },
    { icon: "🩹", label: "Connected Healthcare", detail: "Integrating diagnostics with digital health to enable smarter clinical decision-making and preventive remote monitoring." },
];

export const EDTECH_CARDS = [
    {
        icon: "🧪",
        label: "Nanotechnology",
        detail: "Explore materials and technologies at the nanoscale. Learn how nanoscience is transforming healthcare, electronics, energy systems, and advanced manufacturing.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Syllabus Highlights</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>12 Hour Program</li>
                    <li>4 Weekend Sessions</li>
                    <li>Hands-on Learning</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🏗️", label: "Biotechnology", detail: "Understand modern biotechnology, genetic engineering, molecular biology, and real-world healthcare applications through practical learning experiences.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Syllabus Highlights</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>12 Hour Program</li>
                    <li>4 Weekend Sessions</li>
                    <li>Industry-Relevant Concepts</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🎓", label: "Intellectual Property Rights", detail: "Learn how innovations are protected through patents, trademarks, copyrights, and licensing frameworks used by researchers and entrepreneurs.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Syllabus Highlights</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>6 Hour Workshop</li>
                    <li>Patent Awareness</li>
                    <li>Innovation Protection</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🎓", label: "Scientific & Technical Writing", detail: "Learn how innovations are protected through patents, trademarks, copyrights, and licensing frameworks used by researchers and entrepreneurs.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Syllabus Highlights</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>6 Hour Workshop</li>
                    <li>Research Communication</li>
                    <li>Publication Readiness</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🚀", label: "Student Learning Program", detail: "A structured 4-week learning journey designed to build technical knowledge, scientific awareness, and professional skills.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Syllabus Highlights</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>12 Hours Total</li>
                    <li>4 Weekends</li>
                    <li>Professional Skill Development</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🚀", label: "Orientation Program", detail: "A focused introductory workshop that exposes students to emerging technologies, research opportunities, and future career pathways.",
        content: (
            <div>
                <h4 style={{ fontSize: "15px", marginBottom: "8px" }}>Syllabus Highlights</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>6 Hour Workshop</li>
                    <li>Technology Awareness</li>
                    <li>Career Guidance</li>
                </ul>
            </div>
        )
    },
];

// ─────────────────────────────────────────────────────────────────
// SINGLE CARD — fades in after its particle lands
// cardReveal: 0 = invisible particle placeholder, 1 = fully revealed
// ─────────────────────────────────────────────────────────────────
function DomainCard({ card, color, border, glow, cardReveal, cardRef, onCardClick }) {
    return (
        <div
            ref={cardRef}
            style={{
                position: "relative",
                width: 188,
                minHeight: 160,
            }}
        >
            {/* Ghost placeholder so the grid always occupies space */}
            <div style={{ width: "100%", height: "100%", minHeight: 160 }} />

            {/* Real card fades in once particle arrives */}
            <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: cardReveal, scale: 0.75 + cardReveal * 0.25 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: "absolute",
                    inset: 0,
                    padding: "16px 14px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    border: `1px solid ${border}`,
                    boxShadow: glow,
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: cardReveal > 0.5 ? "auto" : "none",
                    cursor: cardReveal > 0.5 ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "column",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onCardClick) onCardClick(card);
                }}
                whileHover={{ y: -4, boxShadow: `0 12px 30px ${border}` }}
            >
                <div style={{ fontSize: 24, marginBottom: 8, lineHeight: 1 }}>{card.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color, letterSpacing: "0.02em", marginBottom: 5, lineHeight: 1.3 }}>
                    {card.label}
                </p>
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// CARD GRID WRAPPER — lays out 2×2, exposes each card's ref
// ─────────────────────────────────────────────────────────────────
function DomainCardGrid({ cards, color, border, glow, show, cardReveals, cardRefs, onCardClick }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        width: 400,
                        flexShrink: 0,
                    }}
                >
                    {cards.map((card, i) => (
                        <DomainCard
                            key={card.label}
                            card={card}
                            color={color}
                            border={border}
                            glow={glow}
                            cardReveal={cardReveals ? cardReveals[i] : 0}
                            cardRef={cardRefs ? el => { cardRefs.current[i] = el; } : undefined}
                            onCardClick={onCardClick}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────
// MEDTECH COLUMN
// ─────────────────────────────────────────────────────────────────
function MedTechColumn({ inView, selectedDomain, onSelect, cardReveals, cardRefs, onCardClick }) {
    const isFocused = selectedDomain === "medtech";
    const isOther = selectedDomain === "edtech";

    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: isOther ? 0 : 1, x: isOther ? -36 : 0, scale: isFocused ? 1.02 : 1 } : {}}
            transition={{ duration: selectedDomain ? 1.5 : 1.0, delay: selectedDomain ? 0 : 0.2, ease: APPLE_EASE }}
            onClick={() => onSelect(isFocused ? null : "medtech")}
            style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: 28,
                cursor: isOther ? "default" : "pointer",
                pointerEvents: isOther ? "none" : "auto",
                justifyContent: "flex-start",
            }}
        >
            {/* Heading */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#0055aa,#0088ee)" }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0055aa", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Neanic MedTech</span>
                </div>
                <h2 style={{ fontSize: "clamp(32px,4vw,60px)", fontWeight: 900, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 14, background: "linear-gradient(135deg,#060e1c 0%,#003399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Med<br />Tech
                </h2>
                <p style={{ fontSize: 13, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter',sans-serif", lineHeight: 1.7, maxWidth: 210 }}>
                    Advanced diagnostic technologies bridging molecular science and clinical practice.
                </p>
                {!isFocused && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.5 : 0 }}
                        style={{ marginTop: 12, fontSize: 11, color: "#0055aa", fontFamily: "'Inter',sans-serif", letterSpacing: "0.08em" }}>
                        tap to explore →
                    </motion.span>
                )}
            </div>

            {/* Cards — hidden until particles land */}
            <DomainCardGrid
                cards={MEDTECH_CARDS}
                color="#0066cc"
                border="rgba(0,102,204,0.28)"
                glow="0 0 30px rgba(0,102,204,0.18)"
                show={isFocused}
                cardReveals={cardReveals}
                cardRefs={cardRefs}
                onCardClick={onCardClick}
            />
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────
// EDTECH COLUMN
// ─────────────────────────────────────────────────────────────────
function EdTechColumn({ inView, selectedDomain, onSelect, cardReveals, cardRefs, onCardClick }) {
    const isFocused = selectedDomain === "edtech";
    const isOther = selectedDomain === "medtech";

    return (
        <motion.div
            id="edtech"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: isOther ? 0 : 1, x: isOther ? 36 : 0, scale: isFocused ? 1.02 : 1 } : {}}
            transition={{ duration: selectedDomain ? 1.5 : 1.0, delay: selectedDomain ? 0 : 0.3, ease: APPLE_EASE }}
            onClick={() => onSelect(isFocused ? null : "edtech")}
            style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: 28,
                cursor: isOther ? "default" : "pointer",
                pointerEvents: isOther ? "none" : "auto",
                justifyContent: "flex-end",
            }}
        >
            {/* Cards on the LEFT for EdTech */}
            <DomainCardGrid
                cards={EDTECH_CARDS}
                color="#7733cc"
                border="rgba(119,51,204,0.28)"
                glow="0 0 30px rgba(119,51,204,0.18)"
                show={isFocused}
                cardReveals={cardReveals}
                cardRefs={cardRefs}
                onCardClick={onCardClick}
            />

            {/* Heading on the RIGHT */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6622bb", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Neanic EdTech</span>
                    <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#aa44ee,#6622bb)" }} />
                </div>
                <h2 style={{ fontSize: "clamp(32px,4vw,60px)", fontWeight: 900, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 14, textAlign: "right", background: "linear-gradient(135deg,#6622bb 0%,#060e1c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Ed<br />Tech
                </h2>
                <p style={{ fontSize: 13, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter',sans-serif", lineHeight: 1.7, maxWidth: 210, textAlign: "right" }}>
                    Building the next generation of scientists, innovators, and healthcare entrepreneurs.
                </p>
                {!isFocused && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.5 : 0 }}
                        style={{ marginTop: 12, fontSize: 11, color: "#6622bb", fontFamily: "'Inter',sans-serif", letterSpacing: "0.08em" }}>
                        ← tap to explore
                    </motion.span>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────
// DNA SPLIT SECTION
// Exposes card DOM refs + per-card reveal values upward via props
// ─────────────────────────────────────────────────────────────────
export function DNASplitSection({
    scrollProgress,
    selectedDomain,
    setSelectedDomain,
    // These come FROM NeanicHero (particle system pushes reveal values down)
    cardReveals,      // float[4]  0→1 per card
    onCardRefsReady,  // cb(refs) → hero can measure DOM positions
    setActiveModal,   // To open the card modal
}) {
    const ref = useRef(null);
    const [splitDone, setSplitDone] = useState(false);
    const prevScroll = useRef(0);

    // Per-card DOM element refs so the particle system can target them
    const cardDOMRefs = useRef([null, null, null, null, null, null]);

    // Notify hero once the section mounts and card refs exist
    const sectionMounted = useRef(false);
    useEffect(() => {
        if (!sectionMounted.current && onCardRefsReady) {
            sectionMounted.current = true;
            // Small delay so layout is painted
            setTimeout(() => onCardRefsReady(cardDOMRefs), 100);
        }
    }, [onCardRefsReady]);

    useEffect(() => {
        let raf;
        const tick = () => {
            const s = scrollProgress?.current ?? 0;
            setSplitDone(s >= 0.38);
            prevScroll.current = s;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [scrollProgress]);

    const showColumns = splitDone;

    return (
        <section
            id="dna-split"
            ref={ref}
            style={{
                position: "absolute", inset: 0, padding: "80px 6vw 0",
                background: "transparent", zIndex: 3,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                opacity: showColumns ? 1 : 0,
                pointerEvents: showColumns ? "auto" : "none",
                transition: "opacity 0.5s ease",
                height: "100vh",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", paddingBottom: "36px" }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={showColumns ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: "center", marginBottom: 24 }}
                >
                    <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0077bb", fontFamily: "'Inter',sans-serif", marginBottom: 6 }}>One Platform</p>
                    <h2 style={{ fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 800, color: "#060e1c", fontFamily: "'Inter',sans-serif", letterSpacing: "-0.025em" }}>Our Training Programs</h2>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr", gap: 0, alignItems: "center" }}>
                    <MedTechColumn
                        inView={showColumns}
                        selectedDomain={selectedDomain}
                        onSelect={setSelectedDomain}
                        cardReveals={selectedDomain === "medtech" ? cardReveals : [0, 0, 0, 0, 0, 0]}
                        cardRefs={selectedDomain === "medtech" ? cardDOMRefs : null}
                        onCardClick={(card) => setActiveModal({ type: "card", cardData: card })}
                    />
                    <div style={{ width: "100%" }} />
                    <EdTechColumn
                        inView={showColumns}
                        selectedDomain={selectedDomain}
                        onSelect={setSelectedDomain}
                        cardReveals={selectedDomain === "edtech" ? cardReveals : [0, 0, 0, 0, 0, 0]}
                        cardRefs={selectedDomain === "edtech" ? cardDOMRefs : null}
                        onCardClick={(card) => setActiveModal({ type: "card", cardData: card })}
                    />
                </div>
            </div>
        </section>
    );
}
// SECTION: INNOVATION PIPELINE
// ─────────────────────────────────────────────────────────────────
const PIPELINE_STAGES = [
    { label: "Challenge Identification", desc: "Identify critical healthcare, education, and societal challenges requiring innovative technological solutions.", color: "#0099cc", icon: "💡" },
    { label: "Scientific Research", desc: "Conduct interdisciplinary research in biosensors, diagnostics, nanotechnology, biotechnology, and emerging technologies.", color: "#0088bb", icon: "🔬" },
    { label: "Technology Development", desc: "Transform scientific discoveries into functional prototypes, diagnostic platforms, and deployable solutions.", color: "#0077aa", icon: "🧪" },
    { label: "Validation & Testing", desc: "Perform laboratory validation, field trials, clinical evaluations, and performance optimization.", color: "#006699", icon: "📋" },
    { label: "Deployment & Partnerships", desc: "Collaborate with universities, hospitals, industries, and institutions for implementation and adoption.", color: "#005588", icon: "🏥" },
    { label: "Impact & Scale", desc: "Deliver accessible technologies that improve healthcare outcomes, education quality, and societal well-being.", color: "#003366", icon: "🏢" },
];

function PipelineSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    const [activeStage, setActiveStage] = useState(null);

    return (
        <section id="pipeline" ref={ref} style={{ padding: "120px 6vw", background: "linear-gradient(to bottom, #dce9fa, #e8f0fa)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0077bb", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>How We Build</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#060e1c", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Innovation Pipeline
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", marginTop: 14 }}>
                        From breakthrough idea to deployed technology — a rigorous, transparent process.
                    </p>
                </motion.div>

                <div style={{ display: "flex", gap: 0, position: "relative" }}>
                    {/* Vertical spine with animated flowing dots */}
                    <div style={{ position: "absolute", left: "calc(50% - 1px)", top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #0099cc33, #003366)", pointerEvents: "none", zIndex: 0 }}>
                        <style>{`
                            @keyframes flowDown {
                                0%   { top: -10%; opacity: 0; }
                                10%  { opacity: 1; }
                                90%  { opacity: 1; }
                                100% { top: 110%; opacity: 0; }
                            }
                        `}</style>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#0088cc",
                                boxShadow: "0 0 8px 3px rgba(0,136,204,0.55)",
                                animation: `flowDown 4s ease-in-out infinite`,
                                animationDelay: `${i * 1.0}s`,
                                top: "-10%",
                            }} />
                        ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
                        {PIPELINE_STAGES.map((stage, i) => {
                            const isLeft = i % 2 === 0;
                            const isActive = activeStage === i;
                            return (
                                <motion.div key={stage.label}
                                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 1.4, delay: i * 0.22, ease: "easeOut" }}
                                    style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", position: "relative", marginBottom: 0 }}
                                >
                                    <div
                                        onClick={() => setActiveStage(isActive ? null : i)}
                                        style={{
                                            width: "44%", padding: "20px 24px", cursor: "pointer",
                                            background: isActive ? "white" : "rgba(255,255,255,0.6)",
                                            borderRadius: 12, border: `1px solid ${isActive ? stage.color + "44" : "rgba(0,80,160,0.08)"}`,
                                            boxShadow: isActive ? `0 8px 32px ${stage.color}18` : "none",
                                            transition: "all 0.3s ease", marginBottom: 20,
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                            <span style={{ fontSize: 16 }}>{stage.icon}</span>
                                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: stage.color, fontFamily: "'Inter', sans-serif" }}>{stage.label}</span>
                                        </div>
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ fontSize: 13, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter', sans-serif", lineHeight: 1.65, margin: 0, overflow: "hidden" }}>
                                                    {stage.desc}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Center dot */}
                                    <div style={{
                                        position: "absolute", left: "calc(50% - 6px)", top: 22,
                                        width: 12, height: 12, borderRadius: "50%",
                                        background: isActive ? stage.color : "white",
                                        border: `2px solid ${stage.color}`,
                                        boxShadow: isActive ? `0 0 12px ${stage.color}66` : "none",
                                        transition: "all 0.3s ease", zIndex: 2,
                                    }} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────
// SECTION: IMPACT NUMBERS
// ─────────────────────────────────────────────────────────────────
function useCountUp(target, inView, duration = 2000) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!inView) { setCount(0); return; }
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, target, duration]);
    return count;
}

const IMPACT_STATS = [
    { value: 150, suffix: "+", label: "Research Publications", sublabel: "(Dr. Ashish + Dr. Shikha alone account for 218+ papers)" },
    { value: 35, suffix: "+", label: "Patents Filed", sublabel: "Including biosensors, sensing technologies, photocatalysis, device engineering and diagnostic innovations." },
    { value: 50, suffix: "+", label: "Clinical Evaluations", sublabel: "Diagnostic devices validated across patient studies and healthcare environments." },
];

function StatCard({ stat, inView, delay }) {
    const ref = useRef(null);
    const cardInView = useInView(ref, { once: false });
    const c = useCountUp(stat.value, cardInView, 1800);

    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay }}
            style={{ textAlign: "center", padding: "36px 24px", background: "rgba(255,255,255,0.75)", borderRadius: 16, border: "1px solid rgba(0,80,160,0.1)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, color: "#0066cc", fontFamily: "'Inter', sans-serif", lineHeight: 1, letterSpacing: "-0.04em" }}>
                {c.toLocaleString()}{stat.suffix}
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#060e1c", fontFamily: "'Inter', sans-serif", margin: "10px 0 4px" }}>{stat.label}</p>
            <p style={{ fontSize: 12, color: "rgba(15,45,90,0.45)", fontFamily: "'Inter', sans-serif", margin: 0 }}>{stat.sublabel}</p>
        </motion.div>
    );
}

function ImpactSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-15%" });
    return (
        <section id="impact" ref={ref} style={{ padding: "120px 6vw", background: "linear-gradient(135deg, #0a1628 0%, #0d2244 50%, #0a1e3a 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            {/* Background decoration */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 50%, #0088cc 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0044aa 0%, transparent 50%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.7)", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Our Reach</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "white", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Measurable Impact
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(180,210,255,0.6)", fontFamily: "'Inter', sans-serif", marginTop: 14 }}>
                        Numbers that reflect the depth and reach of Neanic's work in science and healthcare.
                    </p>
                </motion.div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                    {IMPACT_STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} inView={inView} delay={i * 0.1} />)}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────
// SECTION: WHY NEANIC MATTERS
// ─────────────────────────────────────────────────────────────────
const WHY_MATTERS_DATA = [
    { label: "Rapid Diagnostics", desc: "Results in under 5 minutes.", icon: "⏱️" },
    { label: "Accessible Healthcare", desc: "Designed for rural and resource-limited regions.", icon: "🌍" },
    { label: "Indigenous Innovation", desc: "Built in India through advanced research.", icon: "🇮🇳" },
    { label: "Point-of-Care Technology", desc: "Healthcare delivered closer to patients.", icon: "🎯" },
    { label: "Affordable Solutions", desc: "Scalable and cost-effective deployment.", icon: "💎" },
    { label: "Translational Research", desc: "Converting science into real-world products.", icon: "🔄" },
];

function WhyNeanicMattersSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-15%" });

    return (
        <section id="why-neanic-matters" ref={ref} style={{ padding: "120px 6vw", background: "#f8fafd", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0077bb", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Core Philosophy</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#060e1c", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Why Neanic Matters
                    </h2>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
                    {WHY_MATTERS_DATA.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            whileHover={{ y: -6, boxShadow: "0 16px 36px rgba(0,80,200,0.12)" }}
                            style={{
                                background: "white",
                                borderRadius: 16,
                                padding: "32px",
                                border: "1px solid rgba(0,100,200,0.08)",
                                boxShadow: "0 4px 14px rgba(0,80,200,0.04)",
                                transition: "all 0.3s ease",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div style={{ fontSize: 32, marginBottom: 16, lineHeight: 1 }}>{item.icon}</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#060e1c", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>{item.label}</h3>
                            <p style={{ fontSize: 14, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}// ─────────────────────────────────────────────────────────────────
// SECTION: NEWS & INSIGHTS
// ─────────────────────────────────────────────────────────────────
const NEWS_ITEMS = [
    { tag: "Research", date: "May 2025", title: "Neanic's biosensor platform achieves 94% sensitivity in pilot trial", excerpt: "Our electrochemical biosensor demonstrated superior performance against gold-standard PCR in a 200-patient clinical study." },
    { tag: "Education", date: "Apr 2025", title: "STEM Innovation Lab launched at 3 partner universities", excerpt: "The Neanic Innovation Lab brings hands-on biotech education to undergraduate science programs across India." },
    { tag: "Partnership", date: "Mar 2025", title: "Strategic collaboration announced with Apollo Hospitals Network", excerpt: "A multi-year agreement to validate and deploy Neanic diagnostic technologies across 12 Apollo facilities." },
];

function NewsSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    return (
        <section id="news" ref={ref} style={{ padding: "120px 6vw", background: "#eef4fc", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 56 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0077bb", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Latest</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#060e1c", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        News & Insights
                    </h2>
                </motion.div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                    {NEWS_ITEMS.map((item, i) => (
                        <motion.div key={item.title}
                            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12 }}
                            style={{ padding: "28px 28px", background: "white", borderRadius: 14, border: "1px solid rgba(0,80,160,0.08)", cursor: "default", transition: "all 0.25s ease" }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,80,160,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0066cc", background: "rgba(0,100,200,0.08)", padding: "3px 8px", borderRadius: 4 }}>{item.tag}</span>
                                <span style={{ fontSize: 11, color: "rgba(15,45,90,0.35)", fontFamily: "'Inter', sans-serif" }}>{item.date}</span>
                            </div>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#060e1c", fontFamily: "'Inter', sans-serif", lineHeight: 1.4, marginBottom: 10 }}>{item.title}</h4>
                            <p style={{ fontSize: 13, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7, margin: 0 }}>{item.excerpt}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────
// SECTION: CAREERS
// ─────────────────────────────────────────────────────────────────
function CareersSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    return (
        <section id="careers" ref={ref} style={{ padding: "120px 6vw", background: "linear-gradient(135deg, #060e1c 0%, #0a1e3a 60%, #091428 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 60%, rgba(0,100,200,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.55)", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>Join Us</p>
                    <h2 style={{ fontSize: "clamp(30px, 4.5vw, 58px)", fontWeight: 800, color: "white", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                        Build Technologies<br />That Matter
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(180,210,255,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
                        We're looking for scientists, engineers, designers, and dreamers who believe that better diagnostics mean better lives. Come shape the future of healthcare.
                    </p>
                    <button
                        style={{ padding: "14px 32px", background: "linear-gradient(135deg, #0066cc, #0044aa)", border: "none", borderRadius: 10, color: "white", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 6px 28px rgba(0,80,200,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,80,200,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,80,200,0.35)"; }}
                    >
                        View Open Roles →
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────
// ROOT SECTIONS EXPORT
// ─────────────────────────────────────────────────────────────────
export const NeanicSections = ({ scrollProgress, setActiveModal, selectedDomain, setSelectedDomain }) => {
    return (
        <>
            <PipelineSection />
            <ImpactSection />
            <WhyNeanicMattersSection />
            <NewsSection />
            <CareersSection />

            <section style={{ padding: "100px 6vw", background: "linear-gradient(135deg,#0a1e3a 0%,#060e1c 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, color: "white", fontFamily: "'Inter',sans-serif", letterSpacing: "-0.02em", marginBottom: 18 }}>Ready to Collaborate?</h2>
                    <p style={{ fontSize: 15, color: "rgba(180,210,255,0.6)", fontFamily: "'Inter',sans-serif", lineHeight: 1.7, marginBottom: 36, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
                        Whether you're a student, institution, or healthcare partner — we'd love to connect.
                    </p>
                    <button
                        onClick={() => setActiveModal("contact")}
                        style={{ padding: "14px 36px", background: "linear-gradient(135deg,#0066cc 0%,#0044aa 100%)", border: "none", borderRadius: 10, color: "white", fontSize: 15, fontWeight: 700, fontFamily: "'Inter',sans-serif", cursor: "pointer", boxShadow: "0 6px 22px rgba(0,80,200,0.35)", transition: "all 0.25s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,80,200,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,80,200,0.35)"; }}
                    >Get In Touch</button>
                </div>
            </section>
        </>
    );
};