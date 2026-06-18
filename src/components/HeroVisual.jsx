import React, { useEffect, useRef } from "react";
import Aurora from "./Aurora";

export default function HeroVisual({ onVideoEnd, introFinished }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // If the introduction is completed, ensure the video starts looping and keeps playing
    if (introFinished && videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay loop restart blocked or failed:", err);
      });
    }
  }, [introFinished]);

  return (
    <div className="hero-visual">
      {/* Aurora WebGL Backdrop (fades in after first play) */}
      <div className={`hero-aurora-bg ${introFinished ? "aurora-show" : ""}`}>
        <Aurora
          colorStops={["#E0F2FE", "#90E0EF", "#CAF0F8"]}
          blend={0.75}
          amplitude={1.0}
          speed={0.4}
        />
      </div>

      {/* Background Video (blurs after first play) */}
      <video
        ref={videoRef}
        className={`hero-video-bg ${introFinished ? "video-blur" : ""}`}
        src="/generate_the_video_of_the_reso.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onVideoEnd}
      />
      
      {/* Light Radial Overlay for Text Contrast (fades in after first play) */}
      <div className={`hero-video-overlay ${introFinished ? "overlay-show" : ""}`} />

      {/* Floating Telemetry Badge in bottom corner, displayed after video plays once */}
      <div className={`hero-telemetry-floating-card ${introFinished ? "telemetry-show" : ""}`}>
        <div className="telemetry-badge-top">
          <span className="pulse-dot"></span> Live Sensor
        </div>
        <div className="telemetry-content">
          <div className="telemetry-title">SyncHer OvuWise</div>
          <div className="telemetry-row">
            <span>Status:</span>
            <span className="status-highlight">DPV Scanning</span>
          </div>
          <div className="telemetry-row">
            <span>Target Analyte:</span>
            <span>LH Biomarker</span>
          </div>
          <div className="telemetry-row">
            <span>LOD Sensitivity:</span>
            <span className="lod-highlight">0.03 mIU/mL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
