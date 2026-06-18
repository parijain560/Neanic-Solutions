import React, { useState } from "react";

export default function Roadmap() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Year 2 (Index 1)

  const years = [
    {
      id: "year1",
      label: "Y1: Foundation",
      title: "Foundation & Proof",
      budget: "₹2.5 Cr",
      bullets: [
        "Finalize electrochemical strip product design pipelines.",
        "Establish dedicated R&D lab facilities and core team hiring.",
        "Complete alpha test prototypes and initiate clinical design freeze.",
        "Develop comprehensive global regulatory strategy and secure seed funding.",
        "Onboard academic research pilot partners in Northern India."
      ]
    },
    {
      id: "year2",
      label: "Y2: Validation",
      title: "Validation & Early Market",
      budget: "₹3.5 Cr",
      bullets: [
        "Produce beta prototypes and run extensive accuracy validations.",
        "Execute controlled multi-center clinical and field trials in primary health units.",
        "Develop small-batch manufacturing and pilot cleanrooms.",
        "Initiate sensor stability studies and local distributor outreach.",
        "Build digital marketing assets and launch early sales pipeline."
      ]
    },
    {
      id: "year3",
      label: "Y3: Launch",
      title: "Commercial Entry",
      budget: "₹5.0 Cr",
      bullets: [
        "Official market launch of flagship reproductive health device.",
        "Deploy consumables-based recurring strip sales models in urban centers.",
        "Transition to semi-automated, scalable assembly lines.",
        "Execute master distribution agreements in key tier-2 cities.",
        "Submit proposals for government health department procurement."
      ]
    },
    {
      id: "year4",
      label: "Y4: Expansion",
      title: "India Expansion",
      budget: "₹7.0–8.0 Cr",
      bullets: [
        "Deploy hardware revisions with built-in Bluetooth and analytics.",
        "Establish nationwide institutional distribution networks.",
        "Participate in large-scale state health procurement tenders.",
        "Obtain international CE-IVD and regulatory clearances.",
        "Roll out cloud diagnostics and clinical analytics platform."
      ]
    },
    {
      id: "year5",
      label: "Y5: Global Scale",
      title: "Global Scale",
      budget: "₹10.0+ Cr",
      bullets: [
        "Commercialize full product suite across healthcare, food safety, and environmental verticals.",
        "Initiate clinical and commercial market entry in Southeast Asia and Africa.",
        "Set up fully automated, high-throughput manufacturing plants.",
        "Deliver ₹20–25 Cr in annual revenue targets.",
        "Kickstart Series A investment round and form strategic partnerships with global diagnostics players."
      ]
    }
  ];

  return (
    <section id="roadmap" className="section roadmap-section js-enabled">
      <div className="container">
        <span className="section-label">Strategic Vision · 2026–2031</span>
        <h2>5-Year Plan to Market Leadership</h2>
        <p className="roadmap-intro">From validated prototype to global diagnostics platform — in five focused years.</p>

        {/* Timeline Navigation Bar */}
        <div className="roadmap-timeline-wrapper">
          <div className="roadmap-timeline">
            <div
              className="roadmap-progress-line"
              style={{ transform: `translateY(-50%) scaleX(${activeIndex / 4})` }}
            />
            {years.map((y, idx) => {
              let nodeClass = "";
              if (idx < activeIndex) {
                nodeClass = "done";
              } else if (idx === activeIndex) {
                nodeClass = "active";
              }

              return (
                <a
                  key={y.id}
                  href={`#${y.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(idx);
                  }}
                  className={`timeline-node ${nodeClass}`}
                >
                  <div className="node-circle">{idx + 1}</div>
                  <span className="node-label">{y.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Roadmap Grid */}
        <div className="roadmap-grid">
          {years.map((y, idx) => {
            const isWide = y.id === "year5";
            const isActive = idx === activeIndex;

            return (
              <div
                key={y.id}
                id={y.id}
                className={`year-card ${isWide ? "year-card-wide" : ""} ${isActive ? "active-card" : ""}`}
                style={{ display: isActive ? "block" : "none" }}
              >
                <div className="year-card-header">
                  <span className="year-badge">Year {idx + 1}</span>
                  <span className="budget-pill">{y.budget}</span>
                </div>
                <h3>{y.title}</h3>
                <ul>
                  {y.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Budget summary row with ascending bars */}
        <div className="budget-summary-strip">
          <div className="budget-chart-container">
            <div className="chart-col">
              <span className="chart-value">₹2.5 Cr</span>
              <div className="chart-bar bar-y1" onClick={() => setActiveIndex(0)} />
            </div>
            <div className="chart-col">
              <span className="chart-value">₹3.5 Cr</span>
              <div className="chart-bar bar-y2" onClick={() => setActiveIndex(1)} />
            </div>
            <div className="chart-col">
              <span className="chart-value">₹5.0 Cr</span>
              <div className="chart-bar bar-y3" onClick={() => setActiveIndex(2)} />
            </div>
            <div className="chart-col">
              <span className="chart-value">₹7–8 Cr</span>
              <div className="chart-bar bar-y4" onClick={() => setActiveIndex(3)} />
            </div>
            <div className="chart-col">
              <span className="chart-value">₹10+ Cr</span>
              <div className="chart-bar bar-y5" onClick={() => setActiveIndex(4)} />
            </div>
          </div>
          <div className="chart-labels">
            <div className="chart-label-item" style={{ cursor: "pointer" }} onClick={() => setActiveIndex(0)}>Year 1</div>
            <div className="chart-label-item" style={{ cursor: "pointer" }} onClick={() => setActiveIndex(1)}>Year 2</div>
            <div className="chart-label-item" style={{ cursor: "pointer" }} onClick={() => setActiveIndex(2)}>Year 3</div>
            <div className="chart-label-item" style={{ cursor: "pointer" }} onClick={() => setActiveIndex(3)}>Year 4</div>
            <div className="chart-label-item" style={{ cursor: "pointer" }} onClick={() => setActiveIndex(4)}>Year 5</div>
          </div>
          <p className="budget-footer-text">Total 5-Year Investment: ~₹27–29 Crore</p>
        </div>
      </div>
    </section>
  );
}
