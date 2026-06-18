import React, { useState } from "react";

export default function AskDonut({ onGetInTouch }) {
  const [activeCat, setActiveCat] = useState(null);

  const defaultVal = "₹50L";
  const defaultSub = "Total Ask";

  const categories = [
    {
      cat: "engineering",
      val: "₹15 Lakhs",
      label: "Product Eng.",
      pct: "30%",
      color: "#0077B6",
      fillClass: "fill-engineering",
      desc: "Product Engineering & Design Finalization",
      strokeDasharray: "75.40 175.93",
      strokeDashoffset: "0"
    },
    {
      cat: "mfg",
      val: "₹12 Lakhs",
      label: "Pilot Mfg.",
      pct: "24%",
      color: "#00B4D8",
      fillClass: "fill-mfg",
      desc: "Pilot-Scale Manufacturing & Materials",
      strokeDasharray: "60.32 191.01",
      strokeDashoffset: "-75.40"
    },
    {
      cat: "clinical",
      val: "₹10 Lakhs",
      label: "Clinical Trials",
      pct: "20%",
      color: "#14B8A6",
      fillClass: "fill-clinical",
      desc: "Clinical Validation & Field Pilots",
      strokeDasharray: "50.27 201.06",
      strokeDashoffset: "-135.72"
    },
    {
      cat: "regulatory",
      val: "₹8 Lakhs",
      label: "Regulatory",
      pct: "16%",
      color: "#DFAC28",
      fillClass: "fill-regulatory",
      desc: "Regulatory & Quality Documentation",
      strokeDasharray: "40.21 211.12",
      strokeDashoffset: "-185.99"
    },
    {
      cat: "testing",
      val: "₹5 Lakhs",
      label: "User Testing",
      pct: "10%",
      color: "#8B8B8F",
      fillClass: "fill-testing",
      desc: "User Testing, Iteration & Deployment",
      strokeDasharray: "25.13 226.20",
      strokeDashoffset: "-226.20"
    }
  ];

  const activeData = activeCat ? categories.find((c) => c.cat === activeCat) : null;
  const displayVal = activeData ? activeData.val : defaultVal;
  const displaySub = activeData ? `${activeData.label} (${activeData.pct})` : defaultSub;

  return (
    <section id="ask" className="section ask-section">
      <div className="container">
        <span className="section-label" style={{ color: "var(--color-accent-amber)" }}>Capital Mobilization</span>
        <h2>Our Ask — <span className="ask-number-highlight">₹50 Lakhs</span></h2>
        <p className="ask-subtitle">Seed funding to bridge from validated lab prototype to market-ready PoC diagnostic device.</p>

        <div className="ask-grid">
          {/* Donut Chart Left */}
          <div className="ask-left">
            <div style={{ textAlign: "center" }}>
              <div className="donut-container">
                <svg className="donut-svg" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle className="donut-ring" cx="50" cy="50" r="40" />

                  {/* Segments */}
                  {categories.map((c) => {
                    const isHovered = activeCat === c.cat;
                    const hasSomeHover = activeCat !== null;
                    const strokeWidth = isHovered ? 18 : 14;
                    const isInactive = hasSomeHover && !isHovered;

                    return (
                      <circle
                        key={c.cat}
                        className={`donut-segment ${isInactive ? "inactive-segment" : ""}`}
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={c.color}
                        strokeDasharray={c.strokeDasharray}
                        strokeDashoffset={c.strokeDashoffset}
                        style={{ strokeWidth }}
                        onMouseEnter={() => setActiveCat(c.cat)}
                        onMouseLeave={() => setActiveCat(null)}
                      />
                    );
                  })}
                </svg>
                <div className="donut-center-label">
                  <div className="donut-center-val" style={{ color: "var(--color-accent-amber)" }}>
                    {displayVal}
                  </div>
                  <div className="donut-center-sub">{displaySub}</div>
                </div>
              </div>

              {/* Legend */}
              <div className="donut-legend">
                {categories.map((c) => (
                  <div
                    key={c.cat}
                    className="legend-item"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveCat(c.cat)}
                    onMouseLeave={() => setActiveCat(null)}
                  >
                    <span className="legend-color" style={{ backgroundColor: c.color }} />
                    <span>{c.label}: {c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bars Right */}
          <div className="ask-right">
            {categories.map((c) => {
              const isHighlight = activeCat === c.cat;

              return (
                <div
                  key={c.cat}
                  className={`progress-item ${isHighlight ? "active-highlight" : ""}`}
                  onMouseEnter={() => setActiveCat(c.cat)}
                  onMouseLeave={() => setActiveCat(null)}
                >
                  <div className="progress-labels">
                    <span>{c.desc}</span>
                    <span>{c.pct}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill ${c.fillClass}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ask-callout">
          Part of a <strong>₹27–29 Cr</strong> 5-year investment plan targeting <strong>₹20–25 Cr</strong> revenue by 2031. Series A preparation begins Year 5.
        </div>

        <div className="ask-cta-container">
          <button onClick={onGetInTouch} className="btn btn-amber" style={{ textDecoration: "none" }}>Get in Touch &rarr;</button>
        </div>
      </div>
    </section>
  );
}
