import React, { useEffect, useState, useRef } from "react";
import NeanicHero, { Footer } from "./components/hero";
import { NeanicSections } from "./NeanicSections";
import "./components/Modal.css";
// FormspreeProvider removed per instructions to use Fetch API
// ─────────────────────────────────────────────────────────────────
// STICKY NAVBAR COMPONENT
// ─────────────────────────────────────────────────────────────────
function Navbar({ showStickyNav, setActiveModal }) {
  return (
    <header
      className="header-nav"
      style={{
        opacity: showStickyNav ? 1 : 0,
        pointerEvents: showStickyNav ? "auto" : "none",
        transform: showStickyNav ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <div className="container nav-container">
        <a href="#about" className="logo">
          <img src="/LOGO.png" alt="Neanic Solutions logo" className="logo-img" />
          <span className="logo-sub">Neanic Solutions</span>
        </a>
        <ul className="nav-links">
          <li><a href="#why-neanic-matters">About</a></li>
          <li><a href="#pipeline">Research</a></li>
          <li><a href="#edtech" onClick={(e) => {
            e.preventDefault();
            const scrollH = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: scrollH * 0.385, behavior: "smooth" });
          }}>Education</a></li>
          <li><a href="#news">Milestones</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveModal('contact'); }}>Contact</a></li>
        </ul>
      </div>
    </header>
  );
}

export default function App() {
  const [activeModal, setActiveModal] = useState(null); // 'edtech' | 'medtech' | 'contact' | null
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [showStickyNav, setShowStickyNav] = useState(false);

  const INITIAL_PROGRESS = 0.18;
  const scrollProgress = useRef(0);
  const prevScrollY = useRef(0);

  // ── Scroll-lock refs (no re-render needed) ───────────────────────
  const selectedDomainRef = useRef(null);
  const lockedScrollY = useRef(null);       // window.scrollY at the moment of lock
  const virtualDelta = useRef(0);           // accumulated wheel delta while locked

  // Keep the ref in sync so the wheel handler (closure) always sees the latest value
  useEffect(() => { selectedDomainRef.current = selectedDomain; }, [selectedDomain]);

  // Lock / unlock scroll when domain selection changes
  useEffect(() => {
    if (selectedDomain) {
      // Snapshot the scroll position at the moment of entry
      lockedScrollY.current = window.scrollY;
      virtualDelta.current = 0;
    } else {
      lockedScrollY.current = null;
      // Reset scrollProgress to actual scroll when exiting the domain
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH > 0) {
        const rawProgress = window.scrollY / scrollH;
        scrollProgress.current = Math.min(
          INITIAL_PROGRESS + rawProgress * (1 - INITIAL_PROGRESS),
          1
        );
      }
    }
  }, [selectedDomain]);

  const activeModalRef = useRef(activeModal);
  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  // Wheel interceptor — active whenever a domain is selected
  useEffect(() => {
    const handleWheel = (e) => {
      if (activeModalRef.current) {
        e.preventDefault(); // prevent background scrolling while modal is open
        return;
      }

      if (!selectedDomainRef.current || lockedScrollY.current === null) return;
      e.preventDefault();

      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH <= 0) return;

      // Accumulate normalised delta (scale down raw pixels)
      virtualDelta.current += e.deltaY / (scrollH * 0.7);

      // Clamp: never let the virtual position go below the lock point
      if (virtualDelta.current < 0) {
        // Enough upward scroll → exit domain and release
        if (virtualDelta.current < -0.018) {
          setSelectedDomain(null);
          virtualDelta.current = 0;
          // Don't snap back — just let the page resume from locked position
          return;
        }
      }

      // Feed the accumulated delta into scrollProgress so 3-D animations advance
      const rawBase = lockedScrollY.current / scrollH;
      const baseProgress = INITIAL_PROGRESS + rawBase * (1 - INITIAL_PROGRESS);
      scrollProgress.current = Math.max(
        INITIAL_PROGRESS,
        Math.min(
          1,
          baseProgress + Math.max(0, virtualDelta.current)
        )
      );

      // Keep the page frozen at the entry position
      window.scrollTo({ top: lockedScrollY.current, behavior: "instant" });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []); // intentionally empty — uses refs inside
  // Touch equivalent of the wheel interceptor — makes domain selection work on mobile
  useEffect(() => {
    let touchStartY = null;

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (activeModalRef.current) {
        return;
      }

      if (!selectedDomainRef.current || lockedScrollY.current === null || touchStartY === null) return;
      e.preventDefault();

      const touchY = e.touches[0].clientY;
      const deltaY = (touchStartY - touchY) * 2.2; // scale to feel similar to wheel deltaY
      touchStartY = touchY;

      const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const scrollH = document.documentElement.scrollHeight - viewportHeight;
      if (scrollH <= 0) return;

      virtualDelta.current += deltaY / (scrollH * 0.7);

      if (virtualDelta.current < 0 && virtualDelta.current < -0.018) {
        setSelectedDomain(null);
        virtualDelta.current = 0;
        return;
      }

      const rawBase = lockedScrollY.current / scrollH;
      const baseProgress = INITIAL_PROGRESS + rawBase * (1 - INITIAL_PROGRESS);
      scrollProgress.current = Math.max(
        INITIAL_PROGRESS,
        Math.min(
          1,
          baseProgress + Math.max(0, virtualDelta.current)
        )
      );

      window.scrollTo({ top: lockedScrollY.current, behavior: "instant" });
    };

    const handleTouchEnd = () => {
      touchStartY = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      // While scroll-locked, the scroll handler must not override scrollProgress
      if (selectedDomainRef.current && lockedScrollY.current !== null) return;

      const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const scrollH = document.documentElement.scrollHeight - viewportHeight;
      if (scrollH > 0) {
        const rawProgress = window.scrollY / scrollH;
        scrollProgress.current = Math.min(
          INITIAL_PROGRESS + rawProgress * (1 - INITIAL_PROGRESS),
          1
        );
      }

      // Auto-exit domain focus when scrolling back up past the split threshold
      const isScrollingUp = window.scrollY < prevScrollY.current;
      if (isScrollingUp && scrollProgress.current < 0.42) {
        setSelectedDomain(null);
      }
      prevScrollY.current = window.scrollY;

      if (window.scrollY > window.innerHeight * 5.8) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // We intentionally removed document.body.style.overflow = "hidden" here
    // because it causes scrollbar jumping on Windows which breaks the
    // scrollProgress and DNASplitSection logic when closing modals.
  }, [activeModal]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleModalClose = () => {
    setActiveModal(null);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setIsError(false);
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessage("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    const formData = new FormData(e.target);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("https://formspree.io/f/xqevjbrv", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setIsError(true);
      }
      e.target.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    if (contactSubject === "EdTech Programs") {
      return "Tell us about your school/college, student batch size, preferred workshops (Robotics, VLSI, Nanotechnology), and your requirements...";
    }
    if (contactSubject === "MedTech Diagnostics") {
      return "Tell us about your clinical requirements, target diagnostic biomarkers, point-of-care solution needs, or research collaboration ideas...";
    }
    return "Tell us about your institution, your requirements, or any questions you have...";
  };

  return (
    <>
      {/* Fixed Radial Gradient Backdrop */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, background: `radial-gradient(ellipse 60% 65% at 78% 52%, rgba(150,200,255,0.55) 0%, transparent 60%), radial-gradient(ellipse 35% 45% at 18% 55%, rgba(180,215,255,0.4) 0%, transparent 50%), linear-gradient(155deg, #ebf4ff 0%, #ddeaff 50%, #cce0fc 100%)` }} />


      {/* ==================================================
           SECTION 1: NAVBAR
           ================================================== */}
      <Navbar showStickyNav={showStickyNav} setActiveModal={setActiveModal} />

      {/* ==================================================
           SECTION 2: HERO
           ================================================== */}
      <NeanicHero setActiveModal={setActiveModal} scrollProgress={scrollProgress} selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />

      {/* ==================================================
           CINEMATIC SECTIONS
           ================================================== */}
      <NeanicSections scrollProgress={scrollProgress} setActiveModal={setActiveModal} selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain} />

      {/* ==================================================
           SECTION 14: FOOTER (AND CONTACT AREA)
           ================================================== */}
      <Footer setActiveModal={setActiveModal} />

      {/* ==================================================
           MODAL PORTALS / DIALOGS
           ================================================== */}
      {activeModal === "edtech" && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleModalClose} aria-label="Close">&times;</button>
            <div className="modal-header">
              <h2>Educational Technologies</h2>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--color-text-primary)" }}>
                Workshops, seminars, and courses designed to bring high-school and undergraduate students to the forefront of modern technological trends like Robotics, VLSI, and Nanotechnology.
              </p>

              <h3 style={{ marginTop: "24px", fontSize: "16px", fontWeight: "700" }}>Our Key Offerings</h3>
              <ul className="modal-details-list">
                <li><strong>Hands-on Robotics Bootcamps:</strong> Practical microcontroller design, sensor calibration, motor drives, and real-time obstacle avoidance programming.</li>
                <li><strong>VLSI Design & Basics:</strong> Conceptual insights into silicon chip layouts, CMOS technology, logic gates routing, and EDA design software.</li>
                <li><strong>Nanotechnology & Thin Films:</strong> Exposure to synthesis methods, microfluidic diagnostics, and structural analysis of functional nanomaterials.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeModal === "medtech" && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleModalClose} aria-label="Close">&times;</button>
            <div className="modal-header">
              <h2>Healthcare Diagnostics</h2>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--color-text-primary)" }}>
                Nanotechnology enabled diagnostic devices offering point-of-care solutions for affordable healthcare, ranging from diabetes monitoring to advanced cancer detection and organ-on-chip technology.
              </p>

              <h3 style={{ marginTop: "24px", fontSize: "16px", fontWeight: "700" }}>Key Technical Frontiers</h3>
              <ul className="modal-details-list">
                <li><strong>Electrochemical Biosensing:</strong> Extremely low Limit of Detection (LOD) sensors (e.g., 0.03 mIU/mL LOD for LH) for quantitative point-of-care analysis.</li>
                <li><strong>Organ-on-Chip Platforms:</strong> Advanced microfluidic networks replicating in-vivo cellular environments for accelerated preclinical drug testing.</li>
                <li><strong>Oncological Screening:</strong> Portable diagnostic readers focusing on early-stage non-invasive detection of specific cancer protein biomarkers.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeModal === "contact" && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-container modal-container--wide" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleModalClose} aria-label="Close">&times;</button>

            <div className="modal-header">
              <h2>Get In Touch</h2>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary, rgba(15,45,90,0.65))", marginTop: "8px", lineHeight: "1.5", fontFamily: "'Inter', sans-serif" }}>
                Whether you're a student, institution, or healthcare partner — we'd love to connect. Drop us a message and we'll get back to you shortly.
              </p>
            </div>

            <div className="modal-body">
              {!isSubmitted ? (
                <div className="contact-modal-grid">
                  {/* Left Side: Contact Information */}
                  <div className="contact-info-panel">
                    <div className="info-item">
                      <span className="info-item-label">Location</span>
                      <span className="info-item-value">Innovation Hub, North Sector, India</span>
                    </div>

                    <div className="info-item">
                      <span className="info-item-label">Email</span>
                      <span className="info-item-value">
                        <a href="mailto:neanicsolution@gmail.com">neanicsolution@gmail.com</a>
                      </span>
                    </div>


                    <div className="info-item">
                      <span className="info-item-label">Collaboration</span>
                      <p className="collaboration-text">
                        <strong>Ready to Collaborate?</strong><br />
                        We partner with schools, colleges, universities, and healthcare organizations to bring cutting-edge programs and solutions to your institution.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Form */}
                  <form className="contact-form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label htmlFor="modal-name">Your Name</label>
                      <input
                        type="text"
                        id="modal-name"
                        className="form-input"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Dr. / Prof. / Mr. / Ms."
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-email">Email Address</label>
                      <input
                        type="email"
                        id="modal-email"
                        className="form-input"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="you@institution.edu"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-subject">Subject</label>
                      <select
                        id="modal-subject"
                        className="form-select"
                        name="subject"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        disabled={isSubmitting}
                      >
                        <option value="">Select a topic...</option>
                        <option value="EdTech Programs">EdTech - Educational Technologies</option>
                        <option value="MedTech Diagnostics">MedTech - Healthcare Diagnostics</option>
                        <option value="Investment Inquiry">Investment Opportunities</option>
                        <option value="General Inquiry">General Collaboration</option>
                      </select>
                    </div>



                    <div className="form-group">
                      <label htmlFor="modal-message">Message</label>
                      <textarea
                        id="modal-message"
                        className="form-textarea"
                        name="message"
                        required
                        placeholder={getPlaceholder()}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        disabled={isSubmitting}
                      ></textarea>
                    </div>

                    {isError && (
                      <div style={{ color: "#e74c3c", fontSize: "14px", marginTop: "8px" }}>
                        Unable to send your message. Please check your internet connection or try again in a few minutes.
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ marginTop: "8px" }} disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="form-success-state">
                  <div className="success-icon-wrapper">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for contacting Neanic Solutions, {contactName}.<br /><br />
                    We have received your enquiry regarding <strong>{contactSubject || "General Collaboration"}</strong>.<br /><br />
                    Our team will review your message and get back to you within 24–48 hours.
                  </p>
                  <button onClick={handleModalClose} className="btn btn-primary">
                    Close Modal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {activeModal?.type === "card" && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleModalClose} aria-label="Close">&times;</button>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: "32px" }}>{activeModal.cardData.icon}</span>
                {activeModal.cardData.label}
              </h2>
            </div>
            <div className="modal-body" style={{ minHeight: "120px" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--color-text-primary)", marginBottom: activeModal.cardData.content ? "20px" : "0" }}>
                {activeModal.cardData.detail}
              </p>

              {/* Optional Extended Data / Content added by user */}
              {activeModal.cardData.content && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  {activeModal.cardData.content}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </>
  );
}