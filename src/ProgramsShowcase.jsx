import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { MEDTECH_CARDS, EDTECH_CARDS } from "./NeanicSections";

const EASE = "cubic-bezier(0.65,0,0.35,1)";
const DURATION = 620;

// Real "Key Technical Frontiers" copy — the same facts already shown in the
// site's Healthcare Diagnostics modal (App.jsx), brought inline here so a
// visitor gets the full picture without leaving the expanded card.
const MEDTECH_FRONTIERS = [
    {
        label: "Electrochemical Biosensing",
        detail: "Extremely low Limit of Detection (LOD) sensors (e.g., 0.03 mIU/mL LOD for LH) for quantitative point-of-care analysis.",
    },
    {
        label: "Organ-on-Chip Platforms",
        detail: "Advanced microfluidic networks replicating in-vivo cellular environments for accelerated preclinical drug testing.",
    },
    {
        label: "Oncological Screening",
        detail: "Portable diagnostic readers focusing on early-stage non-invasive detection of specific cancer protein biomarkers.",
    },
];

// Real "Our Key Offerings" copy — the same facts already shown in the
// site's Educational Technologies modal (App.jsx), brought inline here.
const EDTECH_FRONTIERS = [
    {
        label: "Hands-on Robotics Bootcamps",
        detail: "Practical microcontroller design, sensor calibration, motor drives, and real-time obstacle avoidance programming.",
    },
    {
        label: "VLSI Design & Basics",
        detail: "Conceptual insights into silicon chip layouts, CMOS technology, logic gates routing, and EDA design software.",
    },
    {
        label: "Nanotechnology & Thin Films",
        detail: "Exposure to synthesis methods, microfluidic diagnostics, and structural analysis of functional nanomaterials.",
    },
];

// ─────────────────────────────────────────────────────────────────
// One info tile inside an expanded panel — reuses the real
// MEDTECH_CARDS / EDTECH_CARDS content that already powers the
// DNA-split cinematic section, so nothing here is invented copy.
// ─────────────────────────────────────────────────────────────────
function InfoTile({ item, accent, tint }) {
    return (
        <div
            style={{
                background: tint,
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: accent, fontFamily: "'Inter',sans-serif" }}>
                    {item.label}
                </span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(15,45,90,0.65)", margin: 0, fontFamily: "'Inter',sans-serif" }}>
                {item.detail}
            </p>
            {item.content}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// "Key Technical Frontiers" checklist — visually distinct (checkmark
// list in a tinted panel) from the InfoTile grid above it, so two
// real content sets can sit in one card without reading as clutter.
// ─────────────────────────────────────────────────────────────────
function FrontiersList({ frontiers, tint }) {
    return (
        <div style={{ background: tint, borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {frontiers.map((f) => (
                    <div key={f.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--color-accent-green)", fontSize: 14, fontWeight: 800, lineHeight: 1.6, flexShrink: 0 }}>✓</span>
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "rgba(15,45,90,0.72)", fontFamily: "'Inter',sans-serif" }}>
                            <strong style={{ color: "var(--color-text-primary)" }}>{f.label}:</strong> {f.detail}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// A single program card. Rest state sits in the two-column grid;
// on click it FLIPs (measure → fixed at that exact rect → transition
// to a near-fullscreen overlay) into the detail view, matching the
// container-transform animation validated in the design prototype.
// While it's expanded/expanding/closing, an invisible placeholder
// holds its grid slot so the layout doesn't jump.
// ─────────────────────────────────────────────────────────────────
function ProgramCard({
    id,
    expandedId,
    onOpen,
    onClose,
    eyebrow,
    heading,
    headingGradient,
    accent,
    accentDark,
    tint,
    border,
    summary,
    items,
    frontiers,
    ctaLabel,
    onCta,
    number,
    isMobile,
}) {
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const [rect, setRect] = useState(null); // measured origin rect, non-null while animating open/closed
    const [phase, setPhase] = useState("rest"); // rest | opening | open | closing
    const rafRef = useRef([]);
    // Mobile-only: MedTech's and EdTech's summary text run to different
    // lengths, so a single shared mobile height (picked to fit whichever
    // is longer) always left the shorter card with extra blank space
    // below "Tap to explore". Measure each card's own real content height
    // instead of guessing one shared number, so both cards hug their own
    // text tightly. useLayoutEffect (not useEffect) so this resolves
    // before the first paint — no visible height snap on load. Desktop is
    // untouched — it still uses the fixed 420px below.
    const [naturalContentHeight, setNaturalContentHeight] = useState(null);
    useLayoutEffect(() => {
        if (!isMobile) return;
        const measure = () => {
            if (contentRef.current) setNaturalContentHeight(contentRef.current.scrollHeight);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [isMobile]);

    const isThis = expandedId === id;
    const isOtherOpen = expandedId && expandedId !== id;

    const clearRafs = () => {
        rafRef.current.forEach((id) => cancelAnimationFrame(id));
        rafRef.current = [];
    };

    const handleOpen = () => {
        if (expandedId) return;
        const r = cardRef.current.getBoundingClientRect();
        setRect(r);
        setPhase("opening");
        onOpen(id);
        // Plain overflow:hidden — NOT the position:fixed+top scroll-lock
        // trick. That trick makes window.scrollY reset to 0 the instant
        // it's applied (the whole reason it needs a -scrollY offset to
        // compensate), and this page has a position:fixed hero overlay
        // elsewhere whose opacity is driven live off window.scrollY — a
        // reset to 0 snapped it back to fully visible, flashing the
        // homepage hero over the whole screen on every card click (looked
        // like being redirected to the homepage). overflow:hidden blocks
        // scrolling without ever touching scrollY, so that can't happen.
        document.body.style.overflow = "hidden";
    };

    useEffect(() => {
        if (phase === "opening") {
            clearRafs();
            const r1 = requestAnimationFrame(() => {
                const r2 = requestAnimationFrame(() => setPhase("open"));
                rafRef.current.push(r2);
            });
            rafRef.current.push(r1);
        }
        return clearRafs;
    }, [phase]);

    const handleClose = useCallback(() => {
        if (phase !== "open") return;
        setPhase("closing");
        window.setTimeout(() => {
            setPhase("rest");
            setRect(null);
            onClose();
            document.body.style.overflow = "";
        }, DURATION);
    }, [phase, onClose]);

    // Escape key closes whichever card is open
    useEffect(() => {
        if (!isThis || phase !== "open") return;
        const onKey = (e) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isThis, phase, handleClose]);

    const MOBILE_PADDING_V = 18;
    const restBoxStyle = {
        borderRadius: 24,
        // Mobile-only: the card had 36px of top/bottom padding plus a
        // fixed 420px minHeight regardless of content, leaving a large
        // visible gap above "01"/"02" and a much larger one below "Tap
        // to explore" (measured live: ~93-116px of dead space at the
        // bottom alone). Shrinking padding to 18px top/bottom (see the
        // padding line below) and sizing the min-height off each card's
        // own measured content (naturalContentHeight, set above) — rather
        // than one fixed number shared by both cards — removes that gap
        // for MedTech AND EdTech individually, since their summary text
        // runs to different lengths. 330 is only a same-frame fallback
        // for the instant before the measurement effect runs. Desktop is
        // untouched (420, 36px padding).
        minHeight: isMobile ? (naturalContentHeight ? naturalContentHeight + MOBILE_PADDING_V * 2 : 330) : 420,
    };

    let overlayStyle = null;
    if (isThis && rect) {
        if (phase === "opening") {
            overlayStyle = {
                position: "fixed",
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                margin: 0,
                borderRadius: 24,
                zIndex: 500,
            };
        } else if (phase === "open") {
            overlayStyle = {
                position: "fixed",
                top: "clamp(10px, 2.5vw, 28px)",
                left: "clamp(10px, 2.5vw, 28px)",
                right: "clamp(10px, 2.5vw, 28px)",
                bottom: "clamp(10px, 2.5vw, 28px)",
                width: "auto",
                height: "auto",
                margin: 0,
                borderRadius: 20,
                zIndex: 500,
                transition: `top ${DURATION}ms ${EASE}, left ${DURATION}ms ${EASE}, right ${DURATION}ms ${EASE}, bottom ${DURATION}ms ${EASE}, border-radius ${DURATION}ms ${EASE}`,
                overflow: "hidden",
            };
        } else if (phase === "closing") {
            overlayStyle = {
                position: "fixed",
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                margin: 0,
                borderRadius: 24,
                zIndex: 500,
                transition: `top ${DURATION}ms ${EASE}, left ${DURATION}ms ${EASE}, width ${DURATION}ms ${EASE}, height ${DURATION}ms ${EASE}, border-radius ${DURATION}ms ${EASE}`,
                overflow: "hidden",
            };
        }
    }

    const showPlaceholder = phase !== "rest";
    const isExpandedNow = isThis && (phase === "opening" || phase === "open" || phase === "closing");

    return (
        <>
            {showPlaceholder && <div style={{ ...restBoxStyle, visibility: "hidden" }} />}
            <div
                ref={cardRef}
                onClick={!isExpandedNow ? handleOpen : undefined}
                style={{
                    ...(!isExpandedNow ? restBoxStyle : {}),
                    ...(overlayStyle || {}),
                    display: showPlaceholder && !isExpandedNow ? "none" : "block",
                    position: isExpandedNow ? overlayStyle?.position : "relative",
                    background: "rgba(255,255,255,0.72)",
                    border: `1.5px solid ${border}`,
                    boxShadow: isExpandedNow ? "0 40px 90px rgba(0,30,80,0.28)" : "0 18px 44px rgba(0,40,100,0.14)",
                    cursor: isExpandedNow ? "default" : "pointer",
                    boxSizing: "border-box",
                    opacity: isOtherOpen ? 0 : 1,
                    transform: isOtherOpen ? "scale(0.97)" : "none",
                    transition: isOtherOpen
                        ? `opacity 400ms ${EASE}, transform 400ms ${EASE}`
                        : (overlayStyle ? overlayStyle.transition : "box-shadow 300ms ease, transform 300ms ease"),
                    padding: isExpandedNow ? 0 : (isMobile ? `${MOBILE_PADDING_V}px 34px` : "36px 34px"),
                }}
            >
                {/* ── Summary face (visible at rest, fades out once expanded) ── */}
                <div
                    ref={contentRef}
                    style={{
                        opacity: isExpandedNow ? 0 : 1,
                        transition: `opacity ${isExpandedNow ? 200 : 300}ms ease`,
                        pointerEvents: isExpandedNow ? "none" : "auto",
                        position: isExpandedNow ? "absolute" : "static",
                    }}
                >
                    <span
                        style={{
                            fontWeight: 900,
                            fontSize: 64,
                            lineHeight: 1,
                            color: accentDark,
                            fontFamily: "'Inter',sans-serif",
                        }}
                    >
                        {number}
                    </span>
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9 }}>
                        <span
                            style={{
                                fontSize: 10.5,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                color: accent,
                                fontWeight: 700,
                                fontFamily: "'Inter',sans-serif",
                            }}
                        >
                            {eyebrow}
                        </span>
                    </div>
                    <h3
                        style={{
                            fontWeight: 900,
                            fontSize: "clamp(30px, 4vw, 44px)",
                            letterSpacing: "-0.035em",
                            margin: "8px 0 14px 0",
                            lineHeight: 1,
                            background: headingGradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontFamily: "'Inter',sans-serif",
                        }}
                    >
                        {heading}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(15,45,90,0.62)", maxWidth: 420, fontFamily: "'Inter',sans-serif" }}>
                        {summary}
                    </p>
                    <span style={{ display: "inline-block", marginTop: isMobile ? 8 : 18, fontSize: 12.5, fontWeight: 700, color: accent, fontFamily: "'Inter',sans-serif" }}>
                        Tap to explore →
                    </span>
                </div>

                {/* ── Detail face (visible once expanded) ──
                     This is its own scrolling container now (not the outer
                     fixed box), specifically so the back button below can
                     be `position:sticky` within it — pinned to the top of
                     THIS scroll area no matter how far the visitor scrolls
                     into a long card, instead of scrolling away with the
                     rest of the content (which is what made it disappear
                     on mobile, especially once out of view above the
                     fold). */}
                {isExpandedNow && (
                    <div
                        style={{
                            opacity: phase === "open" ? 1 : 0,
                            transition: "opacity 320ms ease 150ms",
                            position: "absolute",
                            inset: 0,
                            overflowY: "auto",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        <div
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                                background: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                padding: "clamp(14px, 3.5vw, 22px) clamp(28px, 5vw, 56px)",
                                borderBottom: "1px solid rgba(0,40,100,0.07)",
                            }}
                        >
                            <button
                                onClick={handleClose}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    background: accentDark,
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    padding: "10px 18px",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#ffffff",
                                    fontFamily: "'Inter',sans-serif",
                                    boxShadow: `0 6px 16px ${border}`,
                                }}
                            >
                                <span style={{ fontSize: 15, lineHeight: 1 }}>←</span>
                                Back to Programs
                            </button>
                        </div>

                        <div style={{ padding: "8px clamp(28px, 5vw, 56px) clamp(28px, 5vw, 56px)" }}>
                            <span
                                style={{
                                    fontSize: 11,
                                    letterSpacing: "0.22em",
                                    textTransform: "uppercase",
                                    color: accent,
                                    fontWeight: 700,
                                    fontFamily: "'Inter',sans-serif",
                                }}
                            >
                                {eyebrow}
                            </span>
                            <h2
                                style={{
                                    fontWeight: 900,
                                    fontSize: "clamp(32px, 5vw, 56px)",
                                    letterSpacing: "-0.035em",
                                    margin: "8px 0 16px 0",
                                    lineHeight: 1,
                                    background: headingGradient,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    fontFamily: "'Inter',sans-serif",
                                }}
                            >
                                {heading}
                            </h2>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(15,45,90,0.65)", maxWidth: 640, marginBottom: 30, fontFamily: "'Inter',sans-serif" }}>
                                {summary}
                            </p>

                            <p style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: accentDark, fontWeight: 700, margin: "0 0 14px 0", fontFamily: "'Inter',sans-serif" }}>
                                Program Highlights
                            </p>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: 16,
                                    marginBottom: frontiers ? 30 : 32,
                                }}
                            >
                                {items.map((item) => (
                                    <InfoTile key={item.label} item={item} accent={accentDark} tint={tint} />
                                ))}
                            </div>

                            {frontiers && (
                                <>
                                    <p style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: accentDark, fontWeight: 700, margin: "0 0 14px 0", fontFamily: "'Inter',sans-serif" }}>
                                        Key Technical Frontiers
                                    </p>
                                    <div style={{ marginBottom: 32 }}>
                                        <FrontiersList frontiers={frontiers} tint={tint} />
                                    </div>
                                </>
                            )}

                            {ctaLabel && onCta && (
                                <button
                                    onClick={onCta}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 10,
                                        background: accentDark,
                                        border: "none",
                                        borderRadius: 12,
                                        padding: "14px 26px",
                                        color: "#ffffff",
                                        fontSize: 13.5,
                                        fontWeight: 700,
                                        fontFamily: "'Inter',sans-serif",
                                        cursor: "pointer",
                                    }}
                                >
                                    {ctaLabel}
                                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                                        <path d="M3,8 L13,8 M13,8 L8,3 M13,8 L8,13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────
// PROGRAMS SHOWCASE — new section, positioned right before
// "What We Focus On". Same theme/colors/fonts as the rest of the
// site; content is pulled from the real MEDTECH_CARDS / EDTECH_CARDS
// already used by the DNA-split hero, so nothing here duplicates
// with invented copy.
// ─────────────────────────────────────────────────────────────────
export default function ProgramsShowcase() {
    const [expandedId, setExpandedId] = useState(null);
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <section
            id="programs-showcase"
            style={{
                position: "relative",
                padding: "clamp(48px, 9vw, 90px) 6vw",
                background:
                    "radial-gradient(55% 60% at 80% 15%, rgba(150,200,255,0.4) 0%, rgba(0,0,0,0) 60%), radial-gradient(35% 45% at 15% 85%, rgba(180,215,255,0.3) 0%, rgba(0,0,0,0) 50%), linear-gradient(155deg, #ebf4ff 0%, #ddeaff 50%, #cce0fc 100%)",
                overflow: "hidden",
                // This section's own z-index (normally 1, so the sticky
                // header — .header-nav, z-index:100 — correctly stays above
                // it while scrolling past) creates a stacking context, per
                // CSS rules, for every descendant — including the expanded
                // card's own position:fixed, z-index:500 overlay. A
                // position:fixed element escapes its ancestor's LAYOUT box
                // but not its ancestor's STACKING CONTEXT, so that "500"
                // only ever wins comparisons against other things inside
                // this same section; against the header (outside it), the
                // whole section — card included — only ever counted as "1".
                // Verified live: a real click on the visible "Back to
                // Programs" button was landing on the sticky header sitting
                // on top of it for exactly this reason. Elevate the section
                // itself above the header, but ONLY while a card is open —
                // otherwise the header must stay on top as usual while
                // scrolling past this section normally.
                zIndex: expandedId ? 1000 : 1,
            }}
        >
            {/* Full-viewport backdrop while a card is open. The expanded
                card's own overlay sits inset by a small clamp() margin
                (see overlayStyle in ProgramCard), so without this, whatever
                is actually on screen behind that margin — on mobile,
                usually the very next section, "What We Focus On" — showed
                through around the card's edges. This sits just behind the
                card (zIndex 499 vs the card's 500) and reuses the section's
                own background gradient so it reads as a seamless extension
                of this section rather than a visible seam, on both mobile
                and desktop. It's always mounted (not conditionally
                rendered) so its opacity transition actually animates in
                step with the card's own open/close fade instead of popping. */}
            <div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 499,
                    background:
                        "radial-gradient(55% 60% at 80% 15%, rgba(150,200,255,0.4) 0%, rgba(0,0,0,0) 60%), radial-gradient(35% 45% at 15% 85%, rgba(180,215,255,0.3) 0%, rgba(0,0,0,0) 50%), linear-gradient(155deg, #ebf4ff 0%, #ddeaff 50%, #cce0fc 100%)",
                    opacity: expandedId ? 1 : 0,
                    pointerEvents: expandedId ? "auto" : "none",
                    transition: `opacity ${DURATION}ms ${EASE}`,
                }}
            />

            <div
                style={{
                    maxWidth: 1140,
                    margin: "0 auto 44px",
                    textAlign: "center",
                    opacity: expandedId ? 0 : 1,
                    transition: `opacity 300ms ${EASE}`,
                }}
            >
                <p
                    style={{
                        fontSize: 11.5,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--color-primary)",
                        fontWeight: 700,
                        margin: "0 0 12px 0",
                        fontFamily: "'Inter',sans-serif",
                    }}
                >
                    One Platform · In Depth
                </p>
                <h2
                    style={{
                        fontWeight: 800,
                        fontSize: "clamp(28px, 4.4vw, 46px)",
                        lineHeight: 1.1,
                        letterSpacing: "-0.025em",
                        color: "var(--color-text-primary)",
                        margin: "0 0 12px 0",
                        fontFamily: "'Inter',sans-serif",
                    }}
                >
                    Explore Our Programs
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, fontFamily: "'Inter',sans-serif" }}>
                    Tap either card to open the full breakdown.
                </p>
            </div>

            <div
                style={{
                    maxWidth: 1140,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 28,
                    position: "relative",
                }}
            >
                <ProgramCard
                    id="med"
                    number="01"
                    expandedId={expandedId}
                    onOpen={setExpandedId}
                    onClose={() => setExpandedId(null)}
                    eyebrow="Neanic MedTech"
                    heading="MedTech"
                    headingGradient="linear-gradient(135deg,#060e1c 0%,#003399 100%)"
                    accent="var(--color-primary)"
                    accentDark="#003399"
                    tint="rgba(0,119,182,0.08)"
                    border="rgba(0,119,182,0.28)"
                    summary="Advanced diagnostic technologies bridging molecular science and clinical practice — led by the SyncHer OvuWise point-of-care biosensor."
                    items={MEDTECH_CARDS}
                    frontiers={MEDTECH_FRONTIERS}
                    isMobile={isMobile}
                />
                <ProgramCard
                    id="ed"
                    number="02"
                    expandedId={expandedId}
                    onOpen={setExpandedId}
                    onClose={() => setExpandedId(null)}
                    eyebrow="Neanic EdTech"
                    heading="EdTech"
                    headingGradient="linear-gradient(135deg,#6622bb 0%,#060e1c 100%)"
                    accent="#7733cc"
                    accentDark="#6622bb"
                    tint="rgba(119,51,204,0.08)"
                    border="rgba(119,51,204,0.28)"
                    summary="Building the next generation of scientists, innovators, and healthcare entrepreneurs."
                    items={EDTECH_CARDS}
                    frontiers={EDTECH_FRONTIERS}
                    isMobile={isMobile}
                />
            </div>
        </section>
    );
}
