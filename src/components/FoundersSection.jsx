import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./FoundersPopup.css"; // We keep the CSS name or we can rename it later if we want

const founders = [
    {
        name: "Dr. Ashish Mathur",
        designation: "Co-Founder",
        bio: [
            "Extensive experience in biosensor development",
            "150+ research articles (H-index: 31)",
            "29 patents filed",
            "Expert in paper-based microfluidics and point-of-care devices"
        ],
        photo: "/M1.jpeg"
    },
    {
        name: "Dr. Shikha Wadhwa",
        designation: "Co-Founder",
        bio: [
            "18 years in materials chemistry",
            "68 research papers published (H-index: 25)",
            "Author of several book chapters",
            "6 patents in photocatalysis, sensing and device design"
        ],
        photo: "/W1.jpeg"
    }
];

export default function FoundersSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-10%" });

    return (
        <section id="founders" ref={ref} style={{ padding: "clamp(64px,10vw,120px) 6vw", background: "var(--color-bg-white)", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-primary)", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Leadership</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em" }}>
                        Meet the Founders
                    </h2>
                </motion.div>

                <div className="founders-grid">
                    {founders.map((founder, index) => (
                        <motion.div
                            key={founder.name}
                            className="founder-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 + index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="founder-card-left">
                                <div className="founder-photo-wrapper">
                                    <img src={founder.photo} alt={founder.name} className="founder-photo" />
                                    <div className="founder-photo-glow" />
                                </div>
                                <h3 className="founder-name">{founder.name}</h3>
                                <p className="founder-designation">{founder.designation}</p>
                            </div>
                            <div className="founder-card-right">
                                <ul className="founder-bio">
                                    {founder.bio.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
