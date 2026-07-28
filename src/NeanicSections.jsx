import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import FoundersSection from "./components/FoundersSection";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return isMobile;
}
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

                <ul style={{ paddingLeft: "15px", fontSize: "10.5px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "4.5px" }}>
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
                <ul style={{ paddingLeft: "15px", fontSize: "10.5px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "4.5px" }}>
                    <li>12 Hour Program</li>
                    <li>4 Weekend Sessions</li>
                    <li>Hands-on Learning</li>
                </ul>
            </div>
        )
    },

    {
        icon: "🎓", label: "Intellectual Property Rights", detail: "Learn about patents, trademarks, copyrights, and IP laws. Protect your innovations and understand the legal framework around intellectual property.",
        content: (
            <div>
                <ul style={{ paddingLeft: "15px", fontSize: "10.5px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "4.5px" }}>
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
                <ul style={{ paddingLeft: "15px", fontSize: "10.5px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "4.5px" }}>
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
                <ul style={{ paddingLeft: "15px", fontSize: "10.5px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "4.5px" }}>
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
                <ul style={{ paddingLeft: "15px", fontSize: "10.5px", color: "rgba(15,45,90,0.65)", display: "flex", flexDirection: "column", gap: "4.5px" }}>
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
    const isMobile = useIsMobile();
    const cardPadding = isMobile ? "14px 18px" : "13px 22px";
    return (
        <div
            ref={cardRef}
            style={{
                position: "relative",
                width: isMobile ? "min(100%, 380px)" : 355,
                minHeight: isMobile ? 92 : 78,
            }}
        >
            {/* Invisible spacer that mirrors the real card content below —
                this makes the grid cell reserve exactly the height the
                revealed card needs (no more, no less), instead of a fixed
                height that leaves blank space under shorter cards. */}
            <div aria-hidden="true" style={{ visibility: "hidden", padding: cardPadding, fontFamily: "'Inter', sans-serif" }}>
                <p style={{ fontSize: isMobile ? 14 : 13.5, fontWeight: 700, letterSpacing: "0.02em", marginBottom: isMobile ? 5 : 6, lineHeight: 1.3, overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {card.label}
                </p>
                {card.detail && (
                    <p style={{ fontSize: isMobile ? 11.5 : 10.5, fontWeight: 400, lineHeight: isMobile ? 1.45 : 1.6, margin: 0, marginBottom: showContentInline && card.content ? (isMobile ? 9 : 16) : 0, overflowWrap: "break-word", wordBreak: "break-word" }}>
                        {card.detail}
                    </p>
                )}
                {showContentInline && card.content && (
                    <div style={{ marginTop: 0, transform: isMobile ? "scale(0.98)" : "none", transformOrigin: "top left" }}>
                        {card.content}
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.75, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" }}
                animate={{ 
                    opacity: cardReveal, 
                    scale: 0.75 + cardReveal * 0.25,
                    backdropFilter: `blur(${cardReveal * 18}px)`,
                    WebkitBackdropFilter: `blur(${cardReveal * 18}px)`
                }}
                transition={{ duration: 0 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    padding: isMobile ? "14px 18px" : "13px 22px",
                    borderRadius: 12,
                    background: "var(--color-bg-white)",
                    border: `1px solid ${border}`,
                    boxShadow: glow,
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: cardReveal > 0.5 ? "auto" : "none",
                    cursor: cardReveal > 0.5 && onCardClick ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onCardClick) onCardClick(card);
                }}
                whileHover={onCardClick ? { y: -4, boxShadow: `0 12px 30px ${border}` } : {}}
            >

                <p style={{ fontSize: isMobile ? 14 : 13.5, fontWeight: 700, color, letterSpacing: "0.02em", marginBottom: isMobile ? 5 : 6, lineHeight: 1.3, overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {card.label}
                </p>
                {card.detail && (
                    <p style={{ fontSize: isMobile ? 11.5 : 10.5, fontWeight: 400, color: "rgba(15,45,90,0.6)", lineHeight: isMobile ? 1.45 : 1.6, margin: 0, marginBottom: showContentInline && card.content ? (isMobile ? 9 : 16) : 0, overflowWrap: "break-word", wordBreak: "break-word" }}>
                        {card.detail}
                    </p>
                )}
                {showContentInline && card.content && (
                    <div style={{ marginTop: 0, transform: isMobile ? "scale(0.98)" : "none", transformOrigin: "top left" }}>
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
    const isMobile = useIsMobile();
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
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: isMobile ? 8 : 12,
                        width: isMobile ? "100%" : "min(730px, 94vw)",
                        flexShrink: 0,
                    }}
                >
                    {cards.map((card, i) => {
                        const cardEl = (
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
                        );
                        if (card.label === "Orientation Program") {
                            // The 167px nudge centers this odd 5th card under
                            // the desktop 2-column grid — on mobile's single
                            // column that just shoves it out of alignment
                            // with every other card, so skip it there.
                            return (
                                <div key={card.label} style={{ transform: isMobile ? "none" : "translate(167px, 0px)" }}>
                                    {cardEl}
                                </div>
                            );
                        }
                        return cardEl;
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────
// EXIT ICON — door + arrow "log out" glyph used on the Exit buttons
// ─────────────────────────────────────────────────────────────────
function ExitIcon({ size = 22, color = "#cc1414" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
        </svg>
    );
}

const MEDTECH_HEADING_SCALE = 1.38;
const MEDTECH_HEADING_OFFSET = { x: -138, y: -28 };
const MEDTECH_FOCUSED_HEADING_SCALE = 1;
const MEDTECH_FOCUSED_HEADING_OFFSET = { x: -26, y: -241 };
const MEDTECH_CARDS_SCALE = 1.56;
const MEDTECH_CARDS_OFFSET = { x: -94, y: -248 };

// ─────────────────────────────────────────────────────────────────
// MEDTECH HEADING — isolated + memoized so the high-frequency
// cardReveals updates (during orbital reveal) don't re-render it
// and stutter its Framer transition.
// ─────────────────────────────────────────────────────────────────
const MedTechHeading = React.memo(function MedTechHeading({ inView, isFocused, isOther, isMobile, onSelect }) {
    // The baked pixel offsets/scale below were tuned against a desktop
    // screenshot of the DNA-split layout — on a narrow phone viewport that
    // much negative X offset can push the heading almost entirely off the
    // left edge. Skip the fine desktop positioning on mobile and let the
    // column's own flex centering place it instead.
    const headingScale = isMobile ? 1 : (isFocused ? MEDTECH_FOCUSED_HEADING_SCALE : MEDTECH_HEADING_SCALE);
    const headingBaseX = isMobile ? 0 : (isFocused ? -363 : -257);
    const headingBaseY = isMobile ? 0 : (isFocused ? 58 : -55);
    const headingOffset = isFocused ? MEDTECH_FOCUSED_HEADING_OFFSET : MEDTECH_HEADING_OFFSET;
    const headingX = isMobile ? 0 : headingBaseX + headingOffset.x;
    // Only once MedTech is actually entered (focused) on mobile, lift the
    // heading all the way up to sit right under "Our Training Programs" —
    // before that (or on desktop) it stays untouched.
    const headingY = isMobile ? (isFocused ? -220 : 0) : headingBaseY + headingOffset.y;
    const headingTransition = {
        default: { duration: 1.3, ease: APPLE_EASE },
        scale: { duration: 1.3, ease: "easeInOut" },
    };

    return (
        <motion.div
            animate={{ x: headingX, y: headingY, scale: headingScale }}
            transition={headingTransition}
            style={{ transformOrigin: "top left" }}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", textAlign: isMobile ? "center" : "left", minWidth: 150 }}>
                {isFocused && (
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                        aria-label="Exit MedTech"
                        title="Exit MedTech"
                        style={{
                            marginBottom: 15,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "none",
                            background: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            pointerEvents: "auto",
                        }}
                    >
                        <ExitIcon />
                    </motion.button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13.5 }}>
                    <div style={{ width: 27, height: 2, background: "linear-gradient(90deg,#0055aa,#0088ee)" }} />
                    <span style={{ fontSize: 9.75, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Neanic MedTech</span>
                </div>
                <h2 style={{ fontSize: "clamp(34px, 6vw, 68px)", fontWeight: 900, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em", lineHeight: 0.98, marginBottom: 13.5, background: "linear-gradient(135deg,#060e1c 0%,#003399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Med<br />Tech
                </h2>
                {!(isMobile && isFocused) && (
                    <p style={{ fontSize: 13, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter',sans-serif", lineHeight: 1.65, maxWidth: 240 }}>
                        Advanced diagnostic technologies bridging molecular science and clinical practice.
                    </p>
                )}
                {!isFocused && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.9 : 0 }}
                        style={{ marginTop: 13.5, fontSize: 13.5, fontWeight: 600, color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em" }}>
                        Tap to explore →
                    </motion.span>
                )}
            </div>
        </motion.div>
    );
});

// ─────────────────────────────────────────────────────────────────
// MEDTECH COLUMN
// ─────────────────────────────────────────────────────────────────
function MedTechColumn({ inView, selectedDomain, onSelect, cardReveals, cardRefs, onCardClick }) {
    const isMobile = useIsMobile();
    const isFocused = selectedDomain === "medtech";
    const isOther = selectedDomain === "edtech";

    return (
        <motion.div
            className="dna-column dna-column-med"
            initial={{ opacity: 0, x: isMobile ? -10 : -40, y: isMobile ? 15 : 25 }}
            animate={inView ? { opacity: isOther ? 0 : 1, x: isOther ? (isMobile ? -10 : -36) : 0, scale: isFocused ? 1.02 : 1, y: isFocused ? (isMobile ? 35 : 54) : (isMobile ? 15 : 25) } : {}}
            transition={{
                default: { duration: 1.3, ease: APPLE_EASE },
                scale: { duration: 1.3, ease: "easeInOut" },
                opacity: { duration: 1.5, delay: 0, ease: "easeInOut" },
            }}
            onClick={() => onSelect(isFocused ? null : "medtech")}
            style={{
                display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", gap: 0,
                cursor: isOther ? "default" : "pointer",
                pointerEvents: isOther ? "none" : "auto",
                justifyContent: "flex-start",
                width: isMobile ? "100%" : "auto",
            }}
        >
            <MedTechHeading inView={inView} isFocused={isFocused} isOther={isOther} isMobile={isMobile} onSelect={onSelect} />

            <div style={{ marginTop: isMobile ? 0 : (isFocused ? 24 : 0), transform: isMobile && isFocused ? "translateY(-200px)" : "none" }}>
                <div style={{ transform: isMobile ? "none" : "translate(13px, -76px)" }}>
                    <div style={{ transform: isMobile ? "none" : `translate(${MEDTECH_CARDS_OFFSET.x}px, ${MEDTECH_CARDS_OFFSET.y}px) scale(${MEDTECH_CARDS_SCALE})`, transformOrigin: "top left" }}>
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
                        </div>
                    </div>
                </div>
        </motion.div>
    );
}

const EDTECH_HEADING_SCALE = 1.38;
const EDTECH_HEADING_OFFSET = { x: 137, y: -27 };
const EDTECH_FOCUSED_HEADING_SCALE = 1;
const EDTECH_FOCUSED_HEADING_OFFSET = { x: -19, y: -74 };
const EDTECH_CARDS_SCALE = 1.36;
const EDTECH_CARDS_OFFSET = { x: -25, y: -135 };

// ─────────────────────────────────────────────────────────────────
// EDTECH HEADING — isolated + memoized so the high-frequency
// cardReveals updates (during orbital reveal) don't re-render it
// and stutter its Framer transition.
// ─────────────────────────────────────────────────────────────────
const EdTechHeading = React.memo(function EdTechHeading({ inView, isFocused, isOther, isMobile, onSelect }) {
    // See matching note in MedTechHeading — skip the desktop-tuned offsets
    // on mobile so the heading doesn't get pushed off-screen.
    const headingScale = isMobile ? 1 : (isFocused ? EDTECH_FOCUSED_HEADING_SCALE : EDTECH_HEADING_SCALE);
    const headingBaseX = isMobile ? 0 : (isFocused ? 296 : 255);
    const headingBaseY = isMobile ? 0 : (isFocused ? 248 : -55);
    const headingOffset = isFocused ? EDTECH_FOCUSED_HEADING_OFFSET : EDTECH_HEADING_OFFSET;
    const headingX = isMobile ? 0 : headingBaseX + headingOffset.x;
    const headingY = isMobile ? (isFocused ? 110 : 0) : headingBaseY + headingOffset.y;
    const headingTransition = {
        default: { duration: 1.3, ease: APPLE_EASE },
        scale: { duration: 1.3, ease: "easeInOut" },
    };

    return (
        <motion.div
            animate={{ x: headingX, y: headingY, scale: headingScale }}
            transition={headingTransition}
            style={{ transformOrigin: "top right" }}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end", textAlign: isMobile ? "center" : "right", minWidth: 150 }}>
                {isFocused && (
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                        aria-label="Exit EdTech"
                        title="Exit EdTech"
                        style={{
                            marginBottom: 15,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "none",
                            background: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            pointerEvents: "auto",
                        }}
                    >
                        <ExitIcon />
                    </motion.button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13.5 }}>
                    <span style={{ fontSize: 9.75, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Neanic EdTech</span>
                    <div style={{ width: 27, height: 2, background: "linear-gradient(90deg,#aa44ee,#6622bb)" }} />
                </div>
                <h2 style={{ fontSize: "clamp(34px, 6vw, 68px)", fontWeight: 900, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em", lineHeight: 0.98, marginBottom: 13.5, textAlign: "right", background: "linear-gradient(135deg,#6622bb 0%,#060e1c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Ed<br />Tech
                </h2>
                {!(isMobile && isFocused) && (
                    <p style={{ fontSize: 13, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter',sans-serif", lineHeight: 1.65, maxWidth: 240, textAlign: "right" }}>
                        Building the next generation of scientists, innovators, and healthcare entrepreneurs.
                    </p>
                )}
                {!isFocused && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.9 : 0 }}
                        style={{ marginTop: 13.5, fontSize: 13.5, fontWeight: 600, color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em" }}>
                        ← Tap to explore
                    </motion.span>
                )}
            </div>
        </motion.div>
    );
});

// ─────────────────────────────────────────────────────────────────
// EDTECH COLUMN
// ─────────────────────────────────────────────────────────────────
function EdTechColumn({ inView, selectedDomain, onSelect, cardReveals, cardRefs, onCardClick }) {
    const isMobile = useIsMobile();
    const isFocused = selectedDomain === "edtech";
    const isOther = selectedDomain === "medtech";

    return (
        <motion.div
            id="edtech"
            className="dna-column dna-column-ed"
            initial={{ opacity: 0, x: isMobile ? 10 : 10, y: isMobile ? 15 : 25 }}
            animate={inView ? { opacity: isOther ? 0 : 1, x: isOther ? (isMobile ? 10 : 36) : 0, scale: isFocused ? 1.02 : 1, y: isFocused ? (isMobile ? 170 : 54) : (isMobile ? 15 : 25) } : {}}
            transition={{
                default: { duration: 1.3, ease: APPLE_EASE },
                scale: { duration: 1.3, ease: "easeInOut" },
                opacity: { duration: 1.5, delay: 0, ease: "easeInOut" },
            }}
            onClick={() => onSelect(isFocused ? null : "edtech")}
            style={{
                display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end", gap: 0,
                cursor: isOther ? "default" : "pointer",
                pointerEvents: isOther ? "none" : "auto",
                justifyContent: "flex-start",
                width: isMobile ? "100%" : "auto",
                gridRow: (isMobile && selectedDomain) ? 1 : "auto",
                gridColumn: (isMobile && selectedDomain) ? 1 : "auto",
            }}
        >
            <EdTechHeading inView={inView} isFocused={isFocused} isOther={isOther} isMobile={isMobile} onSelect={onSelect} />

            <div style={{ marginTop: isFocused ? 24 : 0, transform: isMobile && isFocused ? "translateY(90px)" : "none" }}>
                <div style={{ transform: isMobile ? "none" : "translate(-31px, -86px)" }}>
                    <div style={{ transform: isMobile ? "none" : `translate(${EDTECH_CARDS_OFFSET.x}px, ${EDTECH_CARDS_OFFSET.y}px) scale(${EDTECH_CARDS_SCALE})`, transformOrigin: "top right" }}>
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
                        </div>
                    </div>
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
            setSplitDone(s >= 0.36);
            prevScroll.current = s;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [scrollProgress]);

    const showColumns = splitDone;
    const isMobile = useIsMobile();
    const cardsRevealing = Array.isArray(cardReveals) && cardReveals.some((r) => r > 0.03);

    return (
        <section
            id="dna-split"
            ref={ref}
            style={{
                position: "absolute", inset: 0, padding: isMobile ? "110px 6vw 0" : "60px 6vw 0",
                background: "transparent", zIndex: 3,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                opacity: showColumns ? 1 : 0,
                pointerEvents: showColumns ? "auto" : "none",
                transition: "opacity 0.5s ease",
                height: "100vh",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", paddingBottom: "50px" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={showColumns ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: "center", marginBottom: 18 }}
                >
                    <p style={{ fontSize: 7.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", marginBottom: 4.5 }}>One Platform</p>
                    <h2 style={{ fontSize: "clamp(12px, 2.2vw, 21px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter',sans-serif", letterSpacing: "-0.025em" }}>Our Training Programs</h2>
                </motion.div>

                <div className="dna-split-grid" style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 120px 1fr",
                    gap: isMobile ? 32 : 0,
                    alignItems: "center",
                    justifyItems: "center"
                }}>
                    <MedTechColumn
                        inView={showColumns}
                        selectedDomain={selectedDomain}
                        onSelect={setSelectedDomain}
                        cardReveals={selectedDomain === "medtech" ? cardReveals : [0, 0, 0, 0, 0, 0]}
                        cardRefs={selectedDomain === "medtech" ? cardDOMRefs : null}
                        onCardClick={(card) => setActiveModal({ type: "card", cardData: card })}
                    />
                    {!isMobile && <div style={{ width: "100%" }} />}
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

            <AnimatePresence>
                {selectedDomain === "edtech" && !cardsRevealing && (
                    <motion.span
                        key="scroll-hint-edtech"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute", left: isMobile ? "6vw" : "4vw", bottom: isMobile ? "5vh" : "8vh",
                            fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                            color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", pointerEvents: "none", zIndex: 10,
                        }}
                    >
                        scroll to explore
                    </motion.span>
                )}
                {selectedDomain === "medtech" && !cardsRevealing && (
                    <motion.span
                        key="scroll-hint-medtech"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute", right: isMobile ? "6vw" : "4vw", bottom: isMobile ? "5vh" : "8vh",
                            fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                            color: "var(--color-primary)", fontFamily: "'Inter',sans-serif", pointerEvents: "none", zIndex: 10,
                        }}
                    >
                        scroll to explore
                    </motion.span>
                )}
            </AnimatePresence>
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

// Baked shape scale for the Innovation Pipeline cards (width, height).
const PIPELINE_CARD_SCALE = { x: 1.42, y: 1.35 };

function PipelineSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    const [activeStage, setActiveStage] = useState(null);
    const isMobile = useIsMobile();

    return (
        <section id="pipeline" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "linear-gradient(to bottom, #dce9fa, #e8f0fa)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 825, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 9 }}>How We Build</p>
                    <h2 style={{ fontSize: "clamp(21px, 3.5vw, 36px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Innovation Pipeline
                    </h2>
                    <p style={{ fontSize: 12, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", marginTop: 10.5 }}>
                        From breakthrough idea to deployed technology — a rigorous, transparent process.
                    </p>
                </motion.div>

                <div style={{ display: "flex", gap: 0, position: "relative" }}>
                    <div style={{ position: "absolute", left: "calc(50% - 0.75px)", top: 0, bottom: 0, width: 1.5, background: "linear-gradient(to bottom, #0099cc33, #003366)", pointerEvents: "none", zIndex: 0 }}>
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
                                width: 4.5,
                                height: 4.5,
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
                                            width: "44%", padding: "15px 18px", cursor: "pointer",
                                            background: isActive ? "white" : "rgba(255,255,255,0.6)",
                                            borderRadius: 9, border: `1px solid ${isActive ? stage.color + "44" : "rgba(0,80,160,0.08)"}`,
                                            boxShadow: isActive ? `0 8px 32px ${stage.color}18` : "none",
                                            transition: "transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
                                            marginBottom: 15,
                                            transform: isMobile ? "none" : `scale(${PIPELINE_CARD_SCALE.x}, ${PIPELINE_CARD_SCALE.y})`,
                                            transformOrigin: isLeft ? "right center" : "left center",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4.5 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 7.5 }}>
                                                <span style={{ fontSize: 12 }}>{stage.icon}</span>
                                                <span style={{ fontSize: 8.25, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: stage.color, fontFamily: "'Inter', sans-serif" }}>{stage.label}</span>
                                            </div>
                                            <motion.span
                                                animate={{ rotate: isActive ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ display: "inline-block", fontSize: 10, color: stage.color, marginLeft: 8, opacity: 0.6 }}
                                            >
                                                ▼
                                            </motion.span>
                                        </div>
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ fontSize: 9.75, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter', sans-serif", lineHeight: 1.65, margin: 0, overflow: "hidden" }}>
                                                    {stage.desc}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div style={{
                                        position: "absolute", left: "calc(50% - 4.5px)", top: 16.5,
                                        width: 9, height: 9, borderRadius: "50%",
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
            style={{ textAlign: "center", padding: "27px 18px", background: "var(--color-bg-white)", borderRadius: 12, border: "1px solid rgba(0,80,160,0.1)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", lineHeight: 1, letterSpacing: "-0.04em" }}>
                {c.toLocaleString()}{stat.suffix}
            </div>
            <p style={{ fontSize: 11.25, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", margin: "7.5px 0 3px" }}>{stat.label}</p>
            <p style={{ fontSize: 9, color: "rgba(15,45,90,0.45)", fontFamily: "'Inter', sans-serif", margin: 0 }}>{stat.sublabel}</p>
        </motion.div>
    );
}

// Baked shape scale for the Measurable Impact stat cards.
const IMPACT_CARD_SCALE = { x: 1.00, y: 1.15 };

function ImpactSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-15%" });
    return (
        <section id="impact" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "linear-gradient(135deg, #0a1628 0%, #0d2244 50%, #0a1e3a 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 50%, #0088cc 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0044aa 0%, transparent 50%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 825, margin: "0 auto", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.7)", fontFamily: "'Inter', sans-serif", marginBottom: 9 }}>Our Reach</p>
                    <h2 style={{ fontSize: "clamp(21px, 3.5vw, 36px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Measurable Impact
                    </h2>
                    <p style={{ fontSize: 12, color: "rgba(180,210,255,0.6)", fontFamily: "'Inter', sans-serif", marginTop: 10.5 }}>
                        Numbers that reflect the depth and reach of Neanic's work in science and healthcare.
                    </p>
                </motion.div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 15 }}>
                    {IMPACT_STATS.map((stat, i) => (
                        <div key={stat.label} style={{ transform: `scale(${IMPACT_CARD_SCALE.x}, ${IMPACT_CARD_SCALE.y})`, transformOrigin: "center" }}>
                            <StatCard stat={stat} inView={inView} delay={i * 0.1} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
// ─────────────────────────────────────────────────────────────────
// SECTION: PARTNERSHIP OPPORTUNITIES
// ─────────────────────────────────────────────────────────────────
// Baked shape scales for the Partnership section.
const PARTNER_CARD_SCALE = { x: 1.10, y: 1.06 };
const PARTNER_PANEL_SCALE = { x: 1.20, y: 1.43 };

// Baked position offset for the Partnership section's content block.
const PARTNERSHIP_CONTENT_OFFSET = { x: -1, y: -23 };

function PartnershipSection({ setActiveModal }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    const [active, setActive] = useState(0);
    const activeItem = PARTNER_ITEMS[active];
    const isMobile = useIsMobile();

    return (
        <section id="partnership" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "var(--color-bg-blue-tint)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 42 }}>
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: 9 }}>Partner With Us</p>
                    <h2 style={{ fontSize: "clamp(21px, 3.8vw, 39px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em", marginBottom: 12 }}>
                        Partnership Opportunities
                    </h2>
                    <p style={{ fontSize: 12, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7, maxWidth: 465, margin: "0 auto" }}>
                        Collaborate with Neanic Solutions to accelerate innovation in point-of-care diagnostics, biosensing technologies, and translational healthcare research.
                    </p>
                </motion.div>

                <div style={{ transform: `translate(${PARTNERSHIP_CONTENT_OFFSET.x}px, ${PARTNERSHIP_CONTENT_OFFSET.y}px)` }}>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 460px) 1fr", gap: 18, alignItems: "stretch" }} className="partnership-grid">

                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        {PARTNER_ITEMS.map((item, i) => {
                            const isActive = i === active;
                            return (
                              <div key={item.title} style={{ transform: isMobile ? "none" : `scale(${PARTNER_CARD_SCALE.x}, ${PARTNER_CARD_SCALE.y})`, transformOrigin: "top right" }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: i * 0.06 }}
                                    onClick={() => setActive(i)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 13.5,
                                        padding: "15px 16.5px",
                                        borderRadius: 10.5,
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
                                        width: 34.5, height: 34.5, borderRadius: "50%", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: isActive ? "rgba(255,255,255,0.18)" : "rgba(0,102,204,0.08)",
                                        color: isActive ? "#ffffff" : "var(--color-primary)",
                                    }}>
                                        {PARTNER_ICONS[item.icon]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#ffffff" : "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 3 }}>
                                            {item.title}
                                        </p>
                                        <p style={{ fontSize: 9.75, color: isActive ? "rgba(255,255,255,0.85)" : "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>
                                            {item.shortDesc}
                                        </p>
                                    </div>
                                    <div style={{ color: isActive ? "#ffffff" : "rgba(15,45,90,0.3)", flexShrink: 0, transform: isActive ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.3s ease" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </motion.div>
                              </div>
                            );
                        })}
                    </div>

                    <div style={{ transform: isMobile ? "none" : `scale(${PARTNER_PANEL_SCALE.x}, ${PARTNER_PANEL_SCALE.y})`, transformOrigin: "top left" }}>
                    <div style={{
                        position: "relative",
                        borderRadius: 15,
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #0a1628 0%, #0d2244 55%, #060e1c 100%)",
                        padding: "33px 30px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 360,
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
                                <div style={{ display: "flex", alignItems: "center", gap: 13.5, marginBottom: 15 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(80,120,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7fa8ff" }}>
                                        {PARTNER_ICONS[activeItem.icon]}
                                    </div>
                                    <h3 style={{ fontSize: "clamp(16.5px, 2.4vw, 22.5px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em", margin: 0 }}>
                                        {activeItem.title}
                                    </h3>
                                </div>
                                <div style={{ width: 34.5, height: 2.25, background: "linear-gradient(90deg,#4d8dff,#8a5cf5)", borderRadius: 1.5, marginBottom: 16.5 }} />

                                <p style={{ fontSize: 11.25, color: "rgba(210,220,255,0.75)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 19.5, maxWidth: 390 }}>
                                    {activeItem.longDesc}
                                </p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 10.5, marginBottom: 24 }}>
                                    {activeItem.bullets.map((b) => (
                                        <div key={b} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                            <div style={{ width: 15, height: 15, borderRadius: "50%", background: "linear-gradient(135deg,#2f6fed,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </div>
                                            <span style={{ fontSize: 10.5, color: "rgba(220,228,255,0.85)", fontFamily: "'Inter', sans-serif" }}>{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                    </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
                    style={{
                        marginTop: 42,
                        borderRadius: 15,
                        padding: "36px 30px",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #0a1628 0%, #0d2244 55%, #060e1c 100%)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(60,120,255,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(130,60,220,0.12) 0%, transparent 55%)", pointerEvents: "none" }} />
                    <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
                        <h3 style={{ fontSize: "clamp(19px, 3.6vw, 30px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.25 }}>
                            Let's Build the Future of Healthcare Together
                        </h3>
                        <p style={{ fontSize: 13.5, color: "rgba(200,215,255,0.7)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 24 }}>
                            Whether you're a research institution, healthcare provider, industry partner, or funding organization, we're always open to meaningful collaborations that advance accessible, affordable, and impactful healthcare innovation.
                        </p>
                        <button
                            onClick={() => setActiveModal && setActiveModal("contact")}
                            style={{ padding: "10.5px 25.5px", background: "linear-gradient(135deg, #2f6fed 0%, #7c3aed 100%)", border: "none", borderRadius: 7.5, color: "#ffffff", fontSize: 10.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 8px 26px rgba(60,60,220,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 34px rgba(60,60,220,0.45)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(60,60,220,0.35)"; }}
                        >
                            Partner With Us
                        </button>
                    </div>
                </motion.div>
                </div>
            </div>
        </section>
    );
}
// ─────────────────────────────────────────────────────────────────
// SECTION: WHY NEANIC MATTERS
// ─────────────────────────────────────────────────────────────────
const WHY_MATTERS_CARDS_SCALE = 1.32;
const WHY_MATTERS_CARDS_OFFSET = { x: -3, y: -80 };


const WHY_MATTERS_DATA = [
    { label: "Rapid Diagnostics", desc: "Results in under 5 minutes.", bg: "#E6E3FB", stroke: "#8B7FE8" },
    { label: "Accessible Healthcare", desc: "Designed for rural and resource-limited regions.", bg: "#DCEEFB", stroke: "#5FA8E0" },
    { label: "Indigenous Innovation", desc: "Built in India through advanced research.", bg: "#EBE2FA", stroke: "#9B7FE0" },
    { label: "Point-of-Care Technology", desc: "Healthcare delivered closer to patients.", bg: "#FBE3EC", stroke: "#E07FA8" },
    { label: "Affordable Solutions", desc: "Scalable and cost-effective deployment.", bg: "#DFF5E7", stroke: "#5FBE85" },
    { label: "Translational Research", desc: "Converting science into real-world products.", bg: "#DCEEFB", stroke: "#5FA8E0" },
];

// Subtle DNA-helix watermark used inside each Why Neanic Matters card.
function WhyMattersDnaWatermark({ stroke, scale = 1 }) {
    return (
        <svg
            width={130 * scale} height={150 * scale} viewBox="0 0 130 150"
            style={{ position: "absolute", top: 0, right: 0, opacity: 0.28, pointerEvents: "none" }}
        >
            <path d="M100 0 C60 25, 60 45, 100 70 C140 95, 140 115, 100 140" fill="none" stroke={stroke} strokeWidth="2" />
            <path d="M40 0 C80 25, 80 45, 40 70 C0 95, 0 115, 40 140" fill="none" stroke={stroke} strokeWidth="2" />
            {[10, 32, 54, 76, 98, 120].map((y, idx) => {
                const t = (y % 44) / 44;
                const x1 = idx % 2 === 0 ? 40 + t * 60 : 100 - t * 60;
                const x2 = idx % 2 === 0 ? 100 - t * 60 : 40 + t * 60;
                return <line key={y} x1={x1} y1={y} x2={x2} y2={y} stroke={stroke} strokeWidth="1.5" />;
            })}
            {[10, 32, 54, 76, 98, 120].map((y) => (
                <circle key={`c1-${y}`} cx={40} cy={y} r="2.5" fill={stroke} />
            ))}
            {[10, 32, 54, 76, 98, 120].map((y) => (
                <circle key={`c2-${y}`} cx={100} cy={y} r="2.5" fill={stroke} />
            ))}
        </svg>
    );
}

const WHY_MATTERS_HEADING_OFFSET = { x: -12, y: -88 };

function WhyNeanicMattersSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-15%" });
    const isMobile = useIsMobile();
    // The baked scale/offset below were tuned against a desktop screenshot —
    // applying them on mobile too would overflow/crop the cards and can push
    // the heading outside the section's (overflow:hidden) bounds. Skip them
    // on mobile so the section lays out at its natural, unscaled size.
    const headingX = isMobile ? 0 : WHY_MATTERS_HEADING_OFFSET.x;
    const headingY = isMobile ? 0 : WHY_MATTERS_HEADING_OFFSET.y;
    const cardsTransform = isMobile
        ? "none"
        : `translate(${WHY_MATTERS_CARDS_OFFSET.x}px, ${WHY_MATTERS_CARDS_OFFSET.y}px) scale(${WHY_MATTERS_CARDS_SCALE})`;

    return (
        <section id="why-neanic-matters" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "var(--color-bg-cream)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 825, margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, x: headingX, y: headingY } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: "center", marginBottom: 48 }}
                >
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 9 }}>Core Philosophy</p>
                    <h2 style={{ fontSize: "clamp(21px, 3.5vw, 36px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Why Neanic Matters
                    </h2>
                </motion.div>

                <div style={{ transform: cardsTransform, transformOrigin: "top center" }}>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(280px, 100%), 1fr))`, gap: 20 }}>
                        {WHY_MATTERS_DATA.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    background: item.bg,
                                    borderRadius: 16,
                                    padding: "26px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 110,
                                }}
                            >
                                <WhyMattersDnaWatermark stroke={item.stroke} />
                                <h3 style={{ position: "relative", fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>{item.label}</h3>
                                <p style={{ position: "relative", fontSize: 12, color: "rgba(15,45,90,0.6)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
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

// Baked shape scale for the Latest Milestones cards.
const NEWS_CARD_SCALE = { x: 1.24, y: 1.03 };

function NewsSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    const isMobile = useIsMobile();
    return (
        <section id="news" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "var(--color-bg-blue-tint)", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 825, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 42 }}>
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 9 }}>Latest</p>
                    <h2 style={{ fontSize: "clamp(21px, 3.5vw, 36px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Latest Milestones
                    </h2>
                </motion.div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(300px, 100%), 1fr))`, gap: 18 }}>
                    {NEWS_ITEMS.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        // The baked non-uniform scale was tuned for desktop's
                        // 2-column layout — on a single mobile column it would
                        // overflow the viewport width, so skip it there.
                        const cardScaleTransform = isMobile ? "none" : `scale(${NEWS_CARD_SCALE.x}, ${NEWS_CARD_SCALE.y})`;
                        return (
                        <div key={item.title} style={{ transform: cardScaleTransform, transformOrigin: isLeft ? "right center" : "left center", height: "100%" }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12 }}
                                style={{ height: "100%", display: "flex", flexDirection: "column", padding: "21px 21px", background: "var(--color-bg-white)", borderRadius: 10.5, border: "1px solid rgba(0,80,160,0.08)", cursor: "default", transition: "all 0.25s ease" }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,80,160,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                                    <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary)", background: "rgba(0,100,200,0.08)", padding: "2.25px 6px", borderRadius: 3 }}>{item.tag}</span>
                                    <span style={{ fontSize: 9.25, color: "rgba(15,45,90,0.35)", fontFamily: "'Inter', sans-serif" }}>{item.date}</span>
                                </div>
                                <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.4, marginBottom: 7.5 }}>{item.title}</h4>
                                <p style={{ fontSize: 11.25, color: "rgba(15,45,90,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7, margin: 0, flex: 1 }}>{item.excerpt}</p>
                            </motion.div>
                        </div>
                        );
                    })}
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
        <section id="partner-with-us" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "linear-gradient(135deg, #0a1e3a 0%, #0d2244 50%, #060e1c 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 40%, rgba(0,100,200,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 525, margin: "0 auto", textAlign: "center", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }}>
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.55)", fontFamily: "'Inter', sans-serif", marginBottom: 15 }}>Collaborate With Neanic</p>
                    <h2 style={{ fontSize: "clamp(22.5px, 4.5vw, 43.5px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 15 }}>
                        Partner With Us
                    </h2>
                    <p style={{ fontSize: 12, color: "rgba(180,210,255,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 30, maxWidth: 390, margin: "0 auto 30px" }}>
                        We collaborate with hospitals, universities, and healthcare institutions to validate, deploy, and scale diagnostic technologies. Join us in bringing lab-quality precision to the point of care.
                    </p>
                    <button
                        style={{ padding: "10.5px 24px", background: "linear-gradient(135deg, #0066cc, #0044aa)", border: "none", borderRadius: 7.5, color: "#ffffff", fontSize: 10.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 6px 28px rgba(0,80,200,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
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
        <section id="careers" ref={ref} style={{ padding: "clamp(48px, 10vw, 90px) 6vw", background: "linear-gradient(135deg, #060e1c 0%, #0a1e3a 60%, #091428 100%)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 60%, rgba(0,100,200,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 525, margin: "0 auto", textAlign: "center", position: "relative" }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }}>
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(100,180,255,0.55)", fontFamily: "'Inter', sans-serif", marginBottom: 15 }}>Join Us</p>
                    <h2 style={{ fontSize: "clamp(22.5px, 4.5vw, 43.5px)", fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 15 }}>
                        Build Technologies<br />That Matter
                    </h2>
                    <p style={{ fontSize: 12, color: "rgba(180,210,255,0.55)", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 30, maxWidth: 390, margin: "0 auto 30px" }}>
                        We're looking for scientists, engineers, designers, and dreamers who believe that better diagnostics mean better lives. Come shape the future of healthcare.
                    </p>
                    <button
                        style={{ padding: "10.5px 24px", background: "linear-gradient(135deg, #0066cc, #0044aa)", border: "none", borderRadius: 7.5, color: "#ffffff", fontSize: 10.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 6px 28px rgba(0,80,200,0.35)", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
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
// SUPPORTED BY SECTION (auto-sliding logo carousel)
// ─────────────────────────────────────────────────────────────────
const SUPPORTERS = [
    {
        id: "startup-uk",
        render: (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 30 }}>🌱</span>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05, fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif", fontWeight: 700, color: "#e8622c" }}>
                    <span style={{ fontSize: 19 }}>Startup</span>
                    <span style={{ fontSize: 19 }}>Uttarakhand</span>
                </div>
            </div>
        ),
    },
    {
        id: "runway",
        render: (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 800, fontSize: 30, background: "linear-gradient(90deg,#f7941d,#a83fd6,#1a5fd6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        runway
                    </span>
                    <span style={{ fontStyle: "italic", color: "#e8622c", fontSize: 11, fontWeight: 600 }}>incubator</span>
                </div>
                <span style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "#666", fontWeight: 700, marginTop: 2 }}>
                    START YOUR START-UP JOURNEY
                </span>
            </div>
        ),
    },
    {
        id: "awadh",
        render: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.6">
                    <path d="M12 2C8 2 5 5 5 9s3 7 7 13c4-6 7-9 7-13s-3-7-7-7z" />
                    <circle cx="12" cy="9" r="2.1" />
                </svg>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.15 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: "#0d9488", letterSpacing: "0.02em" }}>AWaDH</span>
                    <span style={{ fontWeight: 600, fontSize: 9.5, color: "#0d9488" }}>IIT Ropar-TIF</span>
                </div>
            </div>
        ),
    },
];

const SUPPORTED_BY_HEADING_SCALE = 2.13;
const SUPPORTED_BY_HEADING_OFFSET = { x: 8, y: -104 };
const SUPPORTED_BY_DIVIDER_OFFSET = { x: 0, y: 0 };
const SUPPORTED_BY_CONTENT_SCALE = 2.2;
const SUPPORTED_BY_CONTENT_OFFSET = { x: 572, y: -98 };
const SUPPORTED_BY_TRACK_OFFSET = { x: 9, y: 21 };

function SupportedBySection() {
    const track = [...SUPPORTERS, ...SUPPORTERS, ...SUPPORTERS];
    const isMobile = useIsMobile();
    // These offsets/scales were baked from a desktop screenshot (the content
    // offset alone shifts things 572px sideways) — applying them on mobile
    // would push the whole row off-screen. Fall back to the natural,
    // unscaled layout on small viewports.
    const headingTransform = isMobile ? "none" : `translate(${SUPPORTED_BY_HEADING_OFFSET.x}px, ${SUPPORTED_BY_HEADING_OFFSET.y}px) scale(${SUPPORTED_BY_HEADING_SCALE})`;
    const dividerTransform = isMobile ? "none" : `translate(${SUPPORTED_BY_DIVIDER_OFFSET.x}px, ${SUPPORTED_BY_DIVIDER_OFFSET.y}px)`;
    const contentTransform = isMobile ? "none" : `translate(${SUPPORTED_BY_CONTENT_OFFSET.x}px, ${SUPPORTED_BY_CONTENT_OFFSET.y}px) scale(${SUPPORTED_BY_CONTENT_SCALE})`;
    const trackTransform = isMobile ? "none" : `translate(${SUPPORTED_BY_TRACK_OFFSET.x}px, ${SUPPORTED_BY_TRACK_OFFSET.y}px)`;

    return (
        <section style={{ padding: "clamp(150px, 18vw, 190px) 6vw clamp(42px, 7vw, 66px)", background: "var(--color-bg-blue-tint)", textAlign: "center", overflow: "hidden" }}>
            <div style={{ transform: headingTransform, transformOrigin: "top center" }}>
                <h2 style={{ fontSize: "clamp(19px, 3vw, 27px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                    Supported by
                </h2>
                <div style={{ width: 42, height: 3, borderRadius: 2, background: "rgba(15,45,90,0.2)", margin: "13px auto 0", transform: dividerTransform }} />
            </div>

            <div style={{ height: 20 }} />

            <div style={{ transform: contentTransform, transformOrigin: "top center" }}>
                <div className="supported-by-track-wrap" style={{ position: "relative", overflow: "hidden", transform: trackTransform }}>
                    <div className="supported-by-fade supported-by-fade-l" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg,#EDF6FA,rgba(237,246,250,0))", zIndex: 2, pointerEvents: "none" }} />
                    <div className="supported-by-fade supported-by-fade-r" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(270deg,#EDF6FA,rgba(237,246,250,0))", zIndex: 2, pointerEvents: "none" }} />
                    <div className="supported-by-track" style={{ display: "flex", alignItems: "center", gap: 90, width: "max-content" }}>
                        {track.map((s, i) => (
                            <div key={`${s.id}-${i}`} style={{ flexShrink: 0 }}>
                                {s.render}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .supported-by-track {
                    animation: supportedByScroll 20s linear infinite;
                }
                .supported-by-track-wrap:hover .supported-by-track {
                    animation-play-state: paused;
                }
                @keyframes supportedByScroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-33.3333%); }
                }
            `}</style>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────
// SECTION: SYNCHER OVUWISE (flagship product showcase)
// ─────────────────────────────────────────────────────────────────
const SYNCHER_KEY_FEATURES = [
    { icon: "⚡", title: "Quantitative Digital LH Results", desc: "Precise hormone concentration, not just a Yes/No line." },
    { icon: "⏱️", title: "Results in Less Than 5 Minutes", desc: "Fast electrochemical readout at the point of care." },
    { icon: "🎒", title: "Portable & Point-of-Care", desc: "Reusable digital reader with disposable biosensor strips." },
    { icon: "🎯", title: "High Sensitivity & Clinical Accuracy", desc: "Affordable, scalable, and easy for anyone to operate." },
];

const SYNCHER_APPLICATIONS = [
    "Ovulation Tracking",
    "PCOS Monitoring",
    "Fertility & IVF Clinics",
    "Women's Reproductive Health",
    "Hospitals & Diagnostic Centres",
    "Rural & Primary Healthcare",
    "Community Health Screening",
];

const SYNCHER_STATS = [
    { value: "<5 min", label: "Analysis Time" },
    { value: "Digital", label: "Quantitative Readout" },
    { value: "Portable", label: "Point-of-Care Device" },
    { value: "Reusable", label: "Reader + Disposable Strips" },
];

const SYNCHER_IMAGE_SCALE = 1.35;
const SYNCHER_IMAGE_OFFSET = { x: -14, y: -20 };

function SyncHerOvuWiseSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });
    const isMobile = useIsMobile();

    return (
        <section
            ref={ref}
            id="syncher-ovuwise"
            style={{
                padding: "clamp(56px, 10vw, 110px) 6vw",
                background: "#ffffff",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle at 20% 30%, rgba(0,180,216,0.06) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(0,119,182,0.05) 0%, transparent 50%)",
            }} />

            <div style={{
                maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 1,
                display: "flex", flexDirection: isMobile ? "column" : "row",
                alignItems: "center", gap: isMobile ? 44 : "5vw",
            }}>
                {/* LEFT — all copy flows directly on the page, no card/box */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1, ease: APPLE_EASE }}
                    style={{ flex: "1 1 50%", textAlign: isMobile ? "center" : "left" }}
                >
                    <p style={{ fontSize: 8.25, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: 12 }}>
                        Flagship Product
                    </p>
                    <h2 style={{ fontSize: "clamp(28px, 4.4vw, 46px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>
                        SyncHer OvuWise
                    </h2>
                    <h3 style={{ fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 800, color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em", lineHeight: 1.2, margin: "6px 0 22px" }}>
                        Portable Point-of-Care LH Biosensor
                    </h3>

                    <p style={{ fontSize: 13, lineHeight: 1.85, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif", marginBottom: 8, maxWidth: 500, marginLeft: isMobile ? "auto" : 0, marginRight: isMobile ? "auto" : 0 }}>
                        A portable point-of-care LH biosensor delivering precise digital hormone measurements in under 5 minutes for ovulation tracking, PCOS monitoring, and fertility care.
                    </p>

                    {/* Key features — plain icon + text rows, no boxes */}
                    <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 26 }}>
                        {SYNCHER_KEY_FEATURES.map((f) => (
                            <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 16, justifyContent: isMobile ? "center" : "flex-start" }}>
                                <span style={{
                                    width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
                                    background: "rgba(0,180,216,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21,
                                }}>{f.icon}</span>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 3 }}>{f.title}</div>
                                    <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif" }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Highlight stats — plain text row, no boxes */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", marginTop: 30, justifyContent: isMobile ? "center" : "flex-start" }}>
                        {SYNCHER_STATS.map((s) => (
                            <div key={s.label}>
                                <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--color-primary)", fontFamily: "'Inter', sans-serif" }}>{s.value}</span>
                                <span style={{ fontSize: 10.5, color: "var(--color-text-muted)", fontFamily: "'Inter', sans-serif", marginLeft: 6 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Applications — plain text, no pills */}
                    <p style={{ fontSize: 11.5, lineHeight: 1.9, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif", marginTop: 26, marginBottom: 0 }}>
                        <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Applications: </span>
                        {SYNCHER_APPLICATIONS.join(" · ")}
                    </p>
                </motion.div>

                {/* RIGHT — floating device render, no card */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1, ease: APPLE_EASE, delay: 0.12 }}
                    style={{ flex: "1 1 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", minHeight: isMobile ? 380 : 560 }}
                >
                    <div style={{
                        position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", flex: 1,
                        transform: isMobile ? "none" : `translate(${SYNCHER_IMAGE_OFFSET.x}px, ${SYNCHER_IMAGE_OFFSET.y}px) scale(${SYNCHER_IMAGE_SCALE})`, transformOrigin: "center",
                    }}>
                        <div className="syncher-glow" style={{
                            position: "absolute", width: "78%", height: "78%", borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(0,180,216,0.22) 0%, rgba(0,119,182,0.08) 45%, transparent 72%)",
                            filter: "blur(10px)", zIndex: 0,
                        }} />

                        {[...Array(6)].map((_, i) => (
                            <span key={i} className={`syncher-particle syncher-particle-${i}`} />
                        ))}

                        <img
                            src="/syncher-ovuwise-v2.png"
                            alt="SyncHer OvuWise portable LH biosensor device"
                            className="syncher-device-float"
                            style={{
                                width: "min(120%, 560px)", height: "auto", position: "relative", zIndex: 1,
                                filter: "drop-shadow(0 35px 55px rgba(10,40,80,0.22))",
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes syncherFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-16px); }
                }
                .syncher-device-float {
                    animation: syncherFloat 5.5s ease-in-out infinite;
                }
                @keyframes syncherGlowPulse {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.06); }
                }
                .syncher-glow {
                    animation: syncherGlowPulse 6s ease-in-out infinite;
                }
                .syncher-particle {
                    position: absolute;
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: rgba(0,180,216,0.55);
                    filter: blur(0.5px);
                    z-index: 0;
                    animation: syncherParticleDrift 7s ease-in-out infinite;
                }
                .syncher-particle-0 { top: 15%; left: 12%; animation-delay: 0s; }
                .syncher-particle-1 { top: 65%; left: 8%; animation-delay: 1.1s; width: 4px; height: 4px; }
                .syncher-particle-2 { top: 30%; left: 88%; animation-delay: 2.2s; }
                .syncher-particle-3 { top: 75%; left: 82%; animation-delay: 3.3s; width: 6px; height: 6px; }
                .syncher-particle-4 { top: 8%; left: 60%; animation-delay: 4.1s; width: 4px; height: 4px; }
                .syncher-particle-5 { top: 85%; left: 45%; animation-delay: 5s; }
                @keyframes syncherParticleDrift {
                    0%, 100% { transform: translate(0,0); opacity: 0.4; }
                    50% { transform: translate(8px,-14px); opacity: 0.9; }
                }
            `}</style>
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
            <SyncHerOvuWiseSection />
            <PipelineSection />
            <ImpactSection />
            <WhyNeanicMattersSection />
            <NewsSection />
            <PartnershipSection setActiveModal={setActiveModal} />
            <SupportedBySection />
            <FoundersSection />

            <section className="neanic-cta-section" style={{ padding: "clamp(48px, 8vw, 75px) 6vw", background: "linear-gradient(135deg,#0a1e3a 0%,#060e1c 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <p style={{ fontSize: 11.25, color: "rgba(180,210,255,0.6)", fontFamily: "'Inter',sans-serif", lineHeight: 1.7, marginBottom: 27, maxWidth: 405, marginLeft: "auto", marginRight: "auto" }}>
                        Whether you're a student, institution, or healthcare partner — we'd love to connect.
                    </p>
                    <button
                        onClick={() => setActiveModal("contact")}
                        style={{ padding: "10.5px 27px", background: "linear-gradient(135deg,#0066cc 0%,#0044aa 100%)", border: "none", borderRadius: 7.5, color: "#ffffff", fontSize: 11.25, fontWeight: 700, fontFamily: "'Inter',sans-serif", cursor: "pointer", boxShadow: "0 6px 22px rgba(0,80,200,0.35)", transition: "all 0.25s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,80,200,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,80,200,0.35)"; }}
                    >Get In Touch</button>
                </div>
            </section>
        </>
    );
};