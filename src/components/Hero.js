import { useRef, useState, useEffect } from "react";
import NeuralField from "./NeuralField";
import { skillCategories } from "./Skills";
import { scrollToId, Note, HandArrow } from "./ui";

const tech = [
  { label: "Python" },
  { label: "Java" },
  { label: "React" },
  { label: "AI/ML" },
];

// stable references so the canvas effect mounts once
const CENTER = [0.66, 0.35];
const CENTER_NARROW = [0.44, 0.71];
const ORIGIN_AT = [0.84, 0.3]; // top of the laptop screen in the illustration

const Hero = () => {
  const heroRef = useRef(null);
  const figRef = useRef(null);
  const [narrow, setNarrow] = useState(() => window.matchMedia("(max-width: 899px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const on = () => setNarrow(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, []);

  return (
    <section id="home" ref={heroRef} className="hero" data-surface="lilac" aria-label="Introduction">
      <NeuralField
        clusters={skillCategories}
        originRef={figRef}
        originAt={ORIGIN_AT}
        interactionRef={heroRef}
        center={narrow ? CENTER_NARROW : CENTER}
        scale={narrow ? 0.5 : 0.31}
        labelMinX={narrow ? 0 : 0.5}
        filler={narrow ? 24 : 46}
        className="hero__field"
      />

      <figure className="hero__fig" ref={figRef}>
        <img src="/profile.jpg" alt="Harish Vardhan" width="736" height="736" fetchPriority="high" />
      </figure>

      <div className="container hero__inner">
        <Note className="hero__welcome">Welcome to my portfolio</Note>

        <h1 className="hero__name">
          <span className="hero__hi note">Hi, I'm <HandArrow /></span>
          <span className="display hero__line hero__line--1">Harish</span>
          <span className="display hero__line hero__line--2">Vardhan</span>
        </h1>

        <div className="hero__copy">
          <h2 className="hero__role">Software Developer &amp; AI Specialist</h2>
          <p className="hero__lede">
            Passionate technology enthusiast specializing in software development, AI, and data-driven solutions. I thrive on solving real-world problems and building innovative solutions.
          </p>

          <div className="hero__ctas">
            <button type="button" className="btn btn--ink" onClick={() => scrollToId("projects")}>
              View my work
            </button>
            <button type="button" className="btn btn--outline" onClick={() => scrollToId("contact")}>
              Get in touch
            </button>
            <a href="/resume.pdf" download="Harish_Vardhan_Resume.pdf" className="btn btn--outline">
              Download resume
            </a>
          </div>

          <ul className="hero__stack" aria-label="Core stack">
            {tech.map((t) => <li key={t.label}>{t.label}</li>)}
          </ul>
        </div>
      </div>

      <p className="note hero__avail"><span className="live-dot" aria-hidden="true" />Available</p>
      <p className="hero__hint" aria-hidden="true">
        <span className="hint-fine">Move through the network. Click to fire a neuron.</span>
        <span className="hint-touch">Tap the network to fire a neuron.</span>
      </p>
    </section>
  );
};

export default Hero;
