import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import FoundersSection from "./components/FoundersSection";
import FocusAreaSection from "./FocusAreaSection";
const APPLE_EASE = [0.65, 0, 0.35, 1];

// ─────────────────────────────────────────────────────────────────
// PARTNERSHIP SECTION DATA
// ─────────────────────────────────────────────────────────────────
const PartnerIcon = ({ path }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {path}
    </svg>
);

const PARTNER_ICONS = {
    research: <PartnerIcon path={<><path d="M9 2v6M13 2v4M6 8h9l-1 3H7L6 8z" /><path d="M8 11l-3 8a2 2 0 002 3h8a2 2 0 002-3l-3-8" /></>} />,
    clinical: <PartnerIcon path={<><path d="M6 3v6a4 4 0 008 0V3" /><circle cx="18" cy="15" r="3" /><path d="M14 9v2a4 4 0 004 4" /></>} />,
    industry: <PartnerIcon path={<><path d="M4 8l4-4 4 4M8 4v16M12 20h8M14 12h2M14 16h2M18 12h2M18 16h2" /></>} />,
    licensing: <PartnerIcon path={<><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="11" r="2.5" /><path d="M9 21v-3l3-2 3 2v3" /></>} />,
    public: <PartnerIcon path={<><circle cx="8" cy="8" r="2.5" /><circle cx="16" cy="8" r="2.5" /><path d="M3 20v-2a4 4 0 014-4h2a4 4 0 014 4M13 20v-2a4 4 0 014-4h2a4 4 0 014 4" /></>} />,
    funding: <PartnerIcon path={<><path d="M2 12l4-4 4 4 5-6 5 4" /><path d="M9 17l3-3 3 3M12 14v7" /></>} />,
};

export const PARTNER_ITEMS = [
    {
        icon: "research",
        title: "Research Collaboration",
        image: "/research.png",
        shortDesc: "Advance next-generation diagnostics through interdisciplinary scientific research.",
        longDesc: "Partner with Neanic Solutions to develop innovative biosensors, paper-based microfluidics, organ-on-chip platforms, and point-of-care diagnostic technologies. We actively collaborate with researchers, academic institutions, and innovation partners to translate scientific discoveries into impactful healthcare solutions.",
        bullets: [
            "Joint research projects",
            "Biosensor & microfluidics development",
            "Organ-on-Chip research",
            "Grant-funded collaborative programs",
        ],
        cta: "Let's Collaborate",
    },
    {
        icon: "clinical",
        title: "Clinical Validation",
        image: "/clinical.png",
        shortDesc: "Evaluate diagnostic technologies through clinical studies and real-world testing.",
        longDesc: "We collaborate with hospitals, diagnostic laboratories, and healthcare institutions to validate diagnostic technologies in clinical settings. Our focus is on ensuring accuracy, reliability, and real-world performance before large-scale deployment.",
        bullets: [
            "Clinical performance studies",
            "Diagnostic validation",
            "Healthcare institution partnerships",
            "Field evaluation programs",
        ],
        cta: "Start a Clinical Study",
    },
    {
        icon: "industry",
        title: "Industry Partnerships",
        image: "/industry.png",
        shortDesc: "Transform research innovations into scalable healthcare solutions.",
        longDesc: "Neanic partners with healthcare companies, manufacturers, and technology organizations to commercialize affordable point-of-care diagnostic devices and biosensor technologies for wider healthcare adoption.",
        bullets: [
            "Product co-development",
            "Manufacturing partnerships",
            "Commercialization support",
            "Technology integration",
        ],
        cta: "Explore Industry Partnership",
    },
    {
        icon: "licensing",
        title: "Technology Licensing",
        image: "/technology.png",
        shortDesc: "Enable broader adoption of innovative diagnostic technologies.",
        longDesc: "Our proprietary biosensor platforms and diagnostic technologies are available for licensing and collaborative development. We work with industry partners to accelerate technology translation and product deployment.",
        bullets: [
            "Diagnostic technology licensing",
            "Joint product development",
            "Platform integration",
            "Commercial technology transfer",
        ],
        cta: "License Our Technology",
    },
    {
        icon: "public",
        title: "Public Health Initiatives",
        image: "/publivHealth.png",
        shortDesc: "Improve healthcare accessibility through collaborative programs.",
        longDesc: "Neanic supports decentralized healthcare by developing affordable, rapid, and accessible diagnostic solutions for primary healthcare centers, community clinics, and underserved regions.",
        bullets: [
            "Community healthcare programs",
            "Preventive screening initiatives",
            "Rural healthcare deployment",
            "Government healthcare collaborations",
        ],
        cta: "Partner on Public Health",
    },
    {
        icon: "funding",
        title: "Innovation & Funding",
        image: "/innovationandFunding.png",
        shortDesc: "Support breakthrough healthcare technologies through strategic partnerships.",
        longDesc: "We welcome collaborations with government agencies, innovation programs, CSR initiatives, incubators, and funding organizations to accelerate the development and deployment of next-generation diagnostic technologies.",
        bullets: [
            "Government innovation programs",
            "CSR collaborations",
            "Research funding",
            "Strategic innovation partnerships",
        ],
        cta: "Discuss Funding Options",
    },
];
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
        detail: "Explore the science of the very small. Learn cutting-edge concepts and real-world applications of nanomaterials and nanosystems.",
        content: (
            <div>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>12 Hour Program</li>
                    <li>4 Weekend Sessions</li>
                    <li>Hands-on Learning</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🏗️", label: "Biotechnology", detail: "Understand living systems and their applications. Gain knowledge in genetic engineering, bioinformatics, and bioprocess technologies.",
        content: (
            <div>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>12 Hour Program</li>
                    <li>4 Weekend Sessions</li>
                    <li>Industry-Relevant Concepts</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🎓", label: "Intellectual Property Rights", detail: "Learn about patents, trademarks, copyrights, and IP laws. Protect your innovations and understand the legal framework around intellectual property.",
        content: (
            <div>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>6 Hour Workshop</li>
                    <li>Patent Awareness</li>
                    <li>Innovation Protection</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🎓", label: "Scientific & Technical Writing", detail: "Develop the ability to write research papers, technical documents, and reports with clarity, precision, and professionalism.",
        content: (
            <div>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>6 Hour Workshop</li>
                    <li>Research Communication</li>
                    <li>Publication Readiness</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🚀", label: "Student Learning Program", detail: "Empowering students with foundational knowledge, hands-on learning, and project-based training to build future-ready skills.",
        content: (
            <div>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>12 Hours Total</li>
                    <li>4 Weekends</li>
                    <li>Professional Skill Development</li>
                </ul>
            </div>
        )
    },
    {
        icon: "🚀", label: "Orientation Program", detail: "Get introduced to emerging technologies, research opportunities, and career paths through expert-led orientation sessions.",
        content: (
            <div>
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
function DomainCard({ card, color, border, glow, cardReveal, cardRef, onCardClick, showContentInline }) {
    return (
        <div
            ref={cardRef}
            style={{
                position: "relative",
                width: 390,
                minHeight: showContentInline ? 220 : 180,
            }}
        >
            <div style={{ width: "100%", height: "100%", minHeight: showContentInline ? 220 : 210 }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: cardReveal, scale: 0.75 + cardReveal * 0.25 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: "absolute",
                    inset: 0,
                    padding: "28px 26px",
                    borderRadius: 16,
                    background: "var(--color-bg-white)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    border: `1px solid ${border}`,
                    boxShadow: glow,
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: cardReveal > 0.5 ? "auto" : "none",
                    cursor: cardReveal > 0.5 && onCardClick ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "column",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onCardClick) onCardClick(card);
                }}
                whileHover={onCardClick ? { y: -4, boxShadow: `0 12px 30px ${border}` } : {}}
            >

                <p style={{ fontSize: 15, fontWeight: 700, color, letterSpacing: "0.02em", marginBottom: 8, lineHeight: 1.3 }}>
                    {card.label}
                </p>
                {card.detail && (
                    <p style={{ fontSize: 12.5, fontWeight: 400, color: "rgba(15,45,90,0.6)", lineHeight: 1.6, margin: 0, marginBottom: showContentInline && card.content ? 16 : 0 }}>
                        {card.detail}
                    </p>
                )}
                {showContentInline && card.content && (
                    <div style={{ marginTop: 0 }}>
                        {card.content}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// CARD GRID WRAPPER — lays out 2×2, exposes each card's ref
// ─────────────────────────────────────────────────────────────────
function DomainCardGrid({ cards, color, border, glow, show, cardReveals, cardRefs, onCardClick, showContentInline }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="dna-card-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 22,
                        width: "min(820px, 92vw)",
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
                            showContentInline={showContentInline}
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
            className="dna-column dna-column-med"
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 200 }}>
                {isFocused && (
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                        style={{
                            marginBottom: 16,
                            padding: "4px 14px",
                            borderRadius: 20,
                            border: "1px solid rgba(0,136,238,0.3)",
                            background: "rgba(255,255,255,0.8)",
                            color: "var(--color-primary)",
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            pointerEvents: "auto",
                        }}
                    >
                        ✕ Exit MedTech
                    </motion.button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#0055aa,#0088ee)" }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Neanic MedTech</span>
                </div>
                <h2 style={{ fontSize: "clamp(32px,4vw,60px)", fontWeight: 900, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 14, background: "linear-gradient(135deg,#060e1c 0%,#003399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Med<br />Tech
                </h2>
                <p style={{ fontSize: 13, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter',sans-serif", lineHeight: 1.7, maxWidth: 210 }}>
                    Advanced diagnostic technologies bridging molecular science and clinical practice.
                </p>
                {!isFocused && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.5 : 0 }}
                        style={{ marginTop: 12, fontSize: 11, color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.08em" }}>
                        tap to explore →
                    </motion.span>
                )}
            </div>

            <DomainCardGrid
                cards={MEDTECH_CARDS}
                color="#0066cc"
                border="rgba(0,102,204,0.28)"
                glow="0 0 30px rgba(0,102,204,0.18)"
                show={isFocused}
                cardReveals={cardReveals}
                cardRefs={cardRefs}
                onCardClick={undefined}
                showContentInline={true}
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
            className="dna-column dna-column-ed"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: isOther ? 0 : 1, x: isOther ? 36 : 0, scale: isFocused ? 1.02 : 1, y: isFocused ? 29 : 0 } : {}}
            transition={{ duration: selectedDomain ? 1.5 : 1.0, delay: selectedDomain ? 0 : 0.3, ease: APPLE_EASE }}
            onClick={() => onSelect(isFocused ? null : "edtech")}
            style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: 28,
                cursor: isOther ? "default" : "pointer",
                pointerEvents: isOther ? "none" : "auto",
                justifyContent: "flex-end"
            }}
        >
            <DomainCardGrid
                cards={EDTECH_CARDS}
                color="#7733cc"
                border="rgba(119,51,204,0.28)"
                glow="0 0 30px rgba(119,51,204,0.18)"
                show={isFocused}
                cardReveals={cardReveals}
                cardRefs={cardRefs}
                onCardClick={undefined}
                showContentInline={true}
            />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 200 }}>
                {isFocused && (
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                        style={{
                            marginBottom: 16,
                            padding: "4px 14px",
                            borderRadius: 20,
                            border: "1px solid rgba(170,68,238,0.3)",
                            background: "rgba(255,255,255,0.8)",
                            color: "var(--color-primary)",
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            pointerEvents: "auto",
                        }}
                    >
                        ✕ Exit EdTech
                    </motion.button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Neanic EdTech</span>
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
                        style={{ marginTop: 12, fontSize: 11, color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.08em" }}>
                        ← tap to explore
                    </motion.span>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────
// DNA SPLIT SECTION
// ─────────────────────────────────────────────────────────────────
export function DNASplitSection({
    scrollProgress,
    selectedDomain,
    setSelectedDomain,
    cardReveals,
    onCardRefsReady,
    setActiveModal,
}) {
    const ref = useRef(null);
    const [splitDone, setSplitDone] = useState(false);
    const prevScroll = useRef(0);

    const cardDOMRefs = useRef([null, null, null, null, null, null]);

    const sectionMounted = useRef(false);
    useEffect(() => {
        if (!sectionMounted.current && onCardRefsReady) {
            sectionMounted.current = true;
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={showColumns ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: "center", marginBottom: 24 }}
                >
                    <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", marginBottom: 6 }}>One Platform</p>
                    <h2 style={{ fontSize: "clamp(16px,2.2vw,28px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter',sans-serif", letterSpacing: "-0.025em" }}>Our Training Programs</h2>
                </motion.div>

                <div className="dna-split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr", gap: 0, alignItems: "center" }}>
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
        <section id="pipeline" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "linear-gradient(to bottom, #dce9fa, #e8f0fa)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>How We Build</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Innovation Pipeline
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", marginTop: 14 }}>
                        From breakthrough idea to deployed technology — a rigorous, transparent process.
                    </p>
                </motion.div>

                <div style={{ display: "flex", gap: 0, position: "relative" }}>
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
            style={{ textAlign: "center", padding: "36px 24px", background: "var(--color-bg-white)", borderRadius: 16, border: "1px solid rgba(0,80,160,0.1)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", lineHeight: 1, letterSpacing: "-0.04em" }}>
                {c.toLocaleString()}{stat.suffix}
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", margin: "10px 0 4px" }}>{stat.label}</p>
            <p style={{ fontSize: 12, color: "rgba(15,45,90,0.45)", fontFamily: "'Inter', sans-serif", margin: 0 }}>{stat.sublabel}</p>
        </motion.div>
    );
}

function ImpactSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-15%" });
    return (
        <section id="impact" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "linear-gradient(135deg, #0a1628 0%, #0d2244 50%, #0a1e3a 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 50%, #0088cc 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0044aa 0%, transparent 50%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.7)", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Our Reach</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
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
// SECTION: PARTNERSHIP OPPORTUNITIES
// ─────────────────────────────────────────────────────────────────
function PartnershipSection({ setActiveModal }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    const [active, setActive] = useState(0);
    const activeItem = PARTNER_ITEMS[active];

    return (
        <section id="partnership" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "var(--color-bg-blue-tint)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 56 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: 12 }}>Partner With Us</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.8vw, 52px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em", marginBottom: 16 }}>
                        Partnership Opportunities
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>
                        Collaborate with Neanic Solutions to accelerate innovation in point-of-care diagnostics, biosensing technologies, and translational healthcare research.
                    </p>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 460px) 1fr", gap: 24, alignItems: "stretch" }} className="partnership-grid">

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {PARTNER_ITEMS.map((item, i) => {
                            const isActive = i === active;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: i * 0.06 }}
                                    onClick={() => setActive(i)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 18,
                                        padding: "20px 22px",
                                        borderRadius: 14,
                                        cursor: "pointer",
                                        background: isActive
                                            ? "linear-gradient(135deg, #2f6fed 0%, #7c3aed 100%)"
                                            : "var(--color-bg-white)",
                                        border: isActive ? "none" : "1px solid rgba(0,80,160,0.08)",
                                        boxShadow: isActive ? "0 10px 30px rgba(60,60,220,0.25)" : "none",
                                        transition: "background 0.3s ease, box-shadow 0.3s ease",
                                    }}
                                >
                                    <div style={{
                                        width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: isActive ? "rgba(255,255,255,0.18)" : "rgba(0,102,204,0.08)",
                                        color: isActive ? "#ffffff" : "var(--color-primary)",
                                    }}>
                                        {PARTNER_ICONS[item.icon]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 16, fontWeight: 700, color: isActive ? "#ffffff" : "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>
                                            {item.title}
                                        </p>
                                        <p style={{ fontSize: 13, color: isActive ? "rgba(255,255,255,0.85)" : "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>
                                            {item.shortDesc}
                                        </p>
                                    </div>
                                    <div style={{ color: isActive ? "#ffffff" : "rgba(15,45,90,0.3)", flexShrink: 0, transform: isActive ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.3s ease" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div style={{
                        position: "relative",
                        borderRadius: 20,
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #0a1628 0%, #0d2244 55%, #060e1c 100%)",
                        padding: "44px 40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 480,
                    }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeItem.image}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `linear-gradient(to right, rgba(6,14,28,0.98) 0%, rgba(8,18,36,0.92) 38%, rgba(10,22,40,0.55) 62%, rgba(10,22,40,0.15) 100%), url(${activeItem.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center right",
                                    pointerEvents: "none",
                                }}
                            />
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                style={{ position: "relative", zIndex: 1 }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
                                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(80,120,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7fa8ff" }}>
                                        {PARTNER_ICONS[activeItem.icon]}
                                    </div>
                                    <h3 style={{ fontSize: "clamp(22px,2.4vw,30px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em", margin: 0 }}>
                                        {activeItem.title}
                                    </h3>
                                </div>
                                <div style={{ width: 46, height: 3, background: "linear-gradient(90deg,#4d8dff,#8a5cf5)", borderRadius: 2, marginBottom: 22 }} />

                                <p style={{ fontSize: 15, color: "rgba(210,220,255,0.75)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 26, maxWidth: 520 }}>
                                    {activeItem.longDesc}
                                </p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                                    {activeItem.bullets.map((b) => (
                                        <div key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#2f6fed,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </div>
                                            <span style={{ fontSize: 14, color: "rgba(220,228,255,0.85)", fontFamily: "'Inter', sans-serif" }}>{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
                    style={{
                        marginTop: 56,
                        borderRadius: 20,
                        padding: "48px 40px",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #0a1628 0%, #0d2244 55%, #060e1c 100%)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(60,120,255,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(130,60,220,0.12) 0%, transparent 55%)", pointerEvents: "none" }} />
                    <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
                        <h3 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.25 }}>
                            Let's Build the Future of Healthcare Together
                        </h3>
                        <p style={{ fontSize: 15, color: "rgba(200,215,255,0.7)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 32 }}>
                            Whether you're a research institution, healthcare provider, industry partner, or funding organization, we're always open to meaningful collaborations that advance accessible, affordable, and impactful healthcare innovation.
                        </p>
                        <button
                            onClick={() => setActiveModal && setActiveModal("contact")}
                            style={{ padding: "14px 34px", background: "linear-gradient(135deg, #2f6fed 0%, #7c3aed 100%)", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 8px 26px rgba(60,60,220,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 34px rgba(60,60,220,0.45)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(60,60,220,0.35)"; }}
                        >
                            Partner With Us
                        </button>
                    </div>
                </motion.div>
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
        <section id="why-neanic-matters" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "var(--color-bg-cream)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Core Philosophy</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
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
                                background: "var(--color-bg-white)",
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
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>{item.label}</h3>
                            <p style={{ fontSize: 14, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}// ─────────────────────────────────────────────────────────────────
// SECTION: INSIGHTS
// ─────────────────────────────────────────────────────────────────
const NEWS_ITEMS = [
    { tag: "Research", date: "2025", title: "Functional Prototype Successfully Developed", excerpt: "Neanic has successfully developed and validated its point-of-care biosensor prototype, demonstrating high accuracy, rapid detection, and strong correlation with standard laboratory methods." },
    { tag: "VALIDATION", date: "2025", title: "Clinical Validation Underway", excerpt: "The biosensor has been evaluated on over 50 patient samples at SGPGI, Lucknow and continues to undergo clinical validation to ensure reliability for real-world healthcare applications." },
    { tag: "INTELLECTUAL PROPERTY", date: "2025", title: "Patent Published for Biosensor Technology", excerpt: "Neanic's innovative biosensor technology has reached an important milestone with the publication of its patent application, strengthening the company's intellectual property portfolio." },
    { tag: "COMMERCIALIZATION", date: "2026", title: "Commercialization Roadmap Announced", excerpt: "Neanic has outlined a phased commercialization strategy covering manufacturing scale-up, clinical trials, portable reader development, and market launch of its point-of-care diagnostic platform." },
    { tag: "VISION", date: "2026", title: "Five-Year Growth Strategy Released", excerpt: "Neanic unveiled its 2026–2031 strategic roadmap focused on expanding affordable diagnostic technologies across healthcare, food safety, and environmental monitoring while scaling manufacturing and entering global markets." },
    { tag: "RESEARCH TEAM", date: "2026", title: "Built by Leading Researchers", excerpt: "Neanic's interdisciplinary research team brings decades of expertise in biosensors, materials science, microfluidics, patents, and scientific publications to accelerate healthcare innovation." },
];

function NewsSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    return (
        <section id="news" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "var(--color-bg-blue-tint)", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 56 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Latest</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Latest Milestones
                    </h2>
                </motion.div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                    {NEWS_ITEMS.map((item, i) => (
                        <motion.div key={item.title}
                            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12 }}
                            style={{ padding: "28px 28px", background: "var(--color-bg-white)", borderRadius: 14, border: "1px solid rgba(0,80,160,0.08)", cursor: "default", transition: "all 0.25s ease" }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,80,160,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary)", background: "rgba(0,100,200,0.08)", padding: "3px 8px", borderRadius: 4 }}>{item.tag}</span>
                                <span style={{ fontSize: 11, color: "rgba(15,45,90,0.35)", fontFamily: "'Inter', sans-serif" }}>{item.date}</span>
                            </div>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.4, marginBottom: 10 }}>{item.title}</h4>
                            <p style={{ fontSize: 13, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7, margin: 0 }}>{item.excerpt}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
// ─────────────────────────────────────────────────────────────────
// SECTION: PARTNER WITH US
// ─────────────────────────────────────────────────────────────────
function PartnerWithUsSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    return (
        <section id="partner-with-us" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "linear-gradient(135deg, #0a1e3a 0%, #0d2244 50%, #060e1c 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 40%, rgba(0,100,200,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.55)", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>Collaborate With Neanic</p>
                    <h2 style={{ fontSize: "clamp(30px, 4.5vw, 58px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                        Partner With Us
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(180,210,255,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
                        We collaborate with hospitals, universities, and healthcare institutions to validate, deploy, and scale diagnostic technologies. Join us in bringing lab-quality precision to the point of care.
                    </p>
                    <button
                        style={{ padding: "14px 32px", background: "linear-gradient(135deg, #0066cc, #0044aa)", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 6px 28px rgba(0,80,200,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,80,200,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,80,200,0.35)"; }}
                    >
                        Become a Partner →
                    </button>
                </motion.div>
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
        <section id="careers" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "linear-gradient(135deg, #060e1c 0%, #0a1e3a 60%, #091428 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 60%, rgba(0,100,200,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.55)", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>Join Us</p>
                    <h2 style={{ fontSize: "clamp(30px, 4.5vw, 58px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                        Build Technologies<br />That Matter
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(180,210,255,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
                        We're looking for scientists, engineers, designers, and dreamers who believe that better diagnostics mean better lives. Come shape the future of healthcare.
                    </p>
                    <button
                        style={{ padding: "14px 32px", background: "linear-gradient(135deg, #0066cc, #0044aa)", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 6px 28px rgba(0,80,200,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
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
            <FocusAreaSection />
            <PipelineSection />
            <ImpactSection />
            <WhyNeanicMattersSection />
            <NewsSection />
            <PartnershipSection setActiveModal={setActiveModal} />
            <FoundersSection />

            <section className="neanic-cta-section" style={{ padding: "clamp(64px,8vw,100px) 6vw", background: "linear-gradient(135deg,#0a1e3a 0%,#060e1c 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <p style={{ fontSize: 15, color: "rgba(180,210,255,0.6)", fontFamily: "'Inter',sans-serif", lineHeight: 1.7, marginBottom: 36, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
                        Whether you're a student, institution, or healthcare partner — we'd love to connect.
                    </p>
                    <button
                        onClick={() => setActiveModal("contact")}
                        style={{ padding: "14px 36px", background: "linear-gradient(135deg,#0066cc 0%,#0044aa 100%)", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 15, fontWeight: 700, fontFamily: "'Inter',sans-serif", cursor: "pointer", boxShadow: "0 6px 22px rgba(0,80,200,0.35)", transition: "all 0.25s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,80,200,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,80,200,0.35)"; }}
                    >Get In Touch</button>
                </div>
            </section>
        </>
    );
};