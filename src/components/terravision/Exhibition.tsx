import { useEffect, useRef } from "react";
import { ArrowUpRight, Asterisk, Globe2, Layers3 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/config/projects";
import { HeroScene } from "./HeroScene";
import { OrbitalGeometry } from "./OrbitalGeometry";
import { ProjectCta } from "./ProjectCta";
import { ProjectPanel } from "./ProjectPanel";
import { scrollToSection, SiteNav } from "./SiteNav";

function SectionLabel({ number, children }: { number: string; children: string }) {
  return <div className="tv-section-label"><span>{number}</span><span className="tv-label-line" />{children}</div>;
}

export function Exhibition() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro.from(".tv-hero-backdrop > span", { scaleX: 0, duration: 0.9, stagger: 0.08, ease: "expo.inOut" })
          .from(".tv-hero-frame", { opacity: 0, scale: 0.99, duration: 0.75 }, "-=0.35")
          .fromTo(".tv-orbit", { strokeDashoffset: 1200, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.5, duration: 1.35, stagger: 0.08 }, "-=0.3")
          .from(".tv-line", { yPercent: 110, duration: 0.85, stagger: 0.08 }, "-=0.65")
          .from(".tv-hero-subtitle, .tv-hero-index, .tv-hero-note, .tv-scroll-cue", { opacity: 0, y: 8, duration: 0.55, stagger: 0.05 }, "-=0.3");
        gsap.to(".tv-orbits", { rotate: 24, scale: 1.18, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.8 } });
        gsap.to(".tv-hero-title", { yPercent: -18, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.8 } });
        gsap.utils.toArray<HTMLElement>(".tv-story-title").forEach((el) => {
          gsap.from(el, { y: 38, duration: 1.25, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
        });
        gsap.to(".tv-connection-thread", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".tv-connection-intro", start: "top 85%", end: "center 45%", scrub: 0.6 } });
        gsap.to(".tv-vision-word", { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "#vision", start: "top 70%", end: "center center", scrub: 0.5 } });
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="tv-exhibition">
      <a className="tv-skip-link" href="#main">Skip to exhibition</a>
      <SiteNav />
      <div className="tv-hero-backdrop" aria-hidden><span /><span /><i><b /><b /></i></div>
      <HeroScene />
      <main id="main">
        <section id="top" className="tv-hero" data-scene-range="0,0.07" aria-labelledby="hero-title">
                    <div className="tv-hero-frame">
            <OrbitalGeometry />
            <div className="tv-scene-slot tv-hero-slot" data-visual="top" aria-hidden />
            <p className="tv-hero-index"><span>TV—OS / 001</span><span>A digital exhibition</span></p>
            <h1 id="hero-title" className="tv-hero-title">
              <span className="tv-mask tv-mask-a"><span className="tv-line tv-line-a">TerraVision</span></span>
              <span className="tv-mask tv-mask-b"><span className="tv-line tv-line-b">Two worlds</span></span>
              <span className="tv-mask tv-mask-c"><span className="tv-line tv-line-c">One vision<sup>OS</sup></span></span>
            </h1>
            <p className="tv-hero-subtitle">Imagination ×<br /><em>planetary understanding.</em></p>
            <div className="tv-territories">
              <ProjectPanel id="imagined" />
              <ProjectPanel id="earth" />
            </div>
            <button className="tv-scroll-cue" onClick={() => scrollToSection("the-connection")}><span className="tv-scroll-tick" aria-hidden />Scroll</button>
            <p className="tv-hero-note">A connected perspective</p>
          </div>
        </section>

        <section id="the-connection" className="tv-connection-intro tv-section" data-scene-range="0.07,0.24">
          <div className="tv-section-inner">
            <SectionLabel number="01">THE CONNECTION</SectionLabel>
            <h2 className="tv-story-title">Creation meets<br /><em>consciousness.</em></h2>
            <div className="tv-direction-rail"><span>IMAGINED</span><span className="tv-connection-thread" /><Asterisk aria-hidden /><span className="tv-connection-thread" /><span>EARTH//OS</span></div>
            <p className="tv-intro-copy">Two different directions. One shared vision.<br />One looks at what we can create.<br />The other asks what the world needs.</p>
          </div>
        </section>

        <section id="imagined" className="tv-story tv-story-imagined" data-scene-range="0.24,0.42">
          <span className="tv-world-word" aria-hidden>IMAGINED</span>
          <div className="tv-scene-slot" data-visual="imagined" aria-hidden />
          <div className="tv-story-inner">
            <div className="tv-story-copy">
              <SectionLabel number="02">IMAGINED</SectionLabel>
              <span className="tv-story-icon"><Layers3 aria-hidden /></span>
              <h2 className="tv-story-title">Everything begins<br />with <em>an idea.</em></h2>
              <p className="tv-story-kicker">FROM AN IDEA TO UNDERSTANDING.</p>
              <p className="tv-body-copy">{PROJECTS.imagined.description}</p>
              <div className="tv-feature-list"><span>Components</span><span>Materials</span><span>Mechanisms</span><span>Processes</span></div>
              <ProjectCta project={PROJECTS.imagined} />
            </div>
            <div className="tv-scene-caption"><span>FIG. 02</span><span>AN IDEA, UNFOLDED.</span><span className="tv-caption-line" /></div>
          </div>
          <div className="tv-story-bottom"><span>IMAGINATION IS THE STARTING POINT.</span><span>↓</span></div>
        </section>

        <section id="earth" className="tv-story tv-story-earth" data-scene-range="0.42,0.68">
          <span className="tv-world-word" aria-hidden>EARTH//OS</span>
          <div className="tv-scene-slot" data-visual="earth" aria-hidden />
          <div className="tv-story-inner">
            <div className="tv-scene-caption"><span>FIG. 03</span><span>NOTHING EXISTS IN ISOLATION.</span><span className="tv-caption-line" /></div>
            <div className="tv-story-copy">
              <SectionLabel number="03">EARTH//OS</SectionLabel>
              <span className="tv-story-icon"><Globe2 aria-hidden /></span>
              <h2 className="tv-story-title">Our planet.<br /><em>Our perspective.</em></h2>
              <p className="tv-story-kicker">UNDERSTAND THE PLANET. REIMAGINE ITS FUTURE.</p>
              <p className="tv-body-copy">{PROJECTS.earth.description}</p>
              <div className="tv-sdg-line"><span className="tv-sdg-spectrum" aria-hidden /><span>17 GOALS. ONE INTERCONNECTED WORLD.</span></div>
              <ProjectCta project={PROJECTS.earth} />
            </div>
          </div>
          <div className="tv-story-bottom"><span>UNDERSTANDING IS THE NEXT STEP.</span><span>↓</span></div>
        </section>

        <section id="connection" className="tv-purpose tv-section" data-scene-range="0.68,0.82">
          <div className="tv-section-inner">
            <SectionLabel number="04">WHY THEY CONNECT</SectionLabel>
            <h2 className="tv-story-title">Imagination gives us<br /><em>possibility.</em><br />Understanding gives it<br /><em>purpose.</em></h2>
            <div className="tv-purpose-pair"><span>IMAGINED <ArrowUpRight aria-hidden /></span><span className="tv-purpose-bridge" aria-hidden /><span><Globe2 aria-hidden /> EARTH//OS</span></div>
            <p className="tv-intro-copy">Ideas and planetary challenges are not separate stories.<br />Together, they represent creativity guided by awareness<br className="hidden md:block" /> and responsibility.</p>
          </div>
        </section>

        <section id="vision" className="tv-vision tv-section" data-scene-range="0.82,0.91">
          <div className="tv-section-inner">
            <SectionLabel number="05">THE FUTURE VISION</SectionLabel>
            <p className="tv-concept-label"><span /> A PROPOSED FUTURE PLATFORM</p>
            <h2 className="tv-story-title">A more <em>connected</em><br />way to think.</h2>
            <p className="tv-vision-statement">{"TerraVisionOS is a vision of bringing idea exploration and planetary understanding into one connected experience.".split(" ").map((word, i) => <span className="tv-vision-word" key={i}>{word} </span>)}</p>
            <p className="tv-vision-note">Two independent projects today. A possible shared platform tomorrow.<br />The unified TerraVisionOS platform is a future concept — not a completed product.</p>
          </div>
        </section>

        <section className="tv-final tv-section" id="explore" data-scene-range="0.91,1">
          <div className="tv-section-inner">
            <SectionLabel number="06">YOUR NEXT PERSPECTIVE</SectionLabel>
            <h2 className="tv-story-title">Two worlds.<br /><em>One vision.</em></h2>
            <div className="tv-scene-slot" data-visual="explore" aria-hidden />
            <div className="tv-final-actions"><ProjectCta project={PROJECTS.imagined} /><ProjectCta project={PROJECTS.earth} /></div>
          </div>
        </section>
      </main>
      <footer className="tv-footer">
        <div className="tv-footer-brand">TERRAVISION<span>-OS</span><p>Connecting imagination with planetary understanding.</p></div>
        <div className="tv-footer-nav"><Button variant="navigation" onClick={() => scrollToSection("imagined")}>IMAGINED <ArrowUpRight aria-hidden /></Button><Button variant="navigation" onClick={() => scrollToSection("earth")}>EARTH//OS <ArrowUpRight aria-hidden /></Button></div>
        <div className="tv-footer-meta"><span>AN INDEPENDENT DIGITAL EXHIBITION</span><span>IDEAS FOR A WORLD WORTH UNDERSTANDING.</span></div>
      </footer>
    </div>
  );
}