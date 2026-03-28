import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './About.css';

const About = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Page fade-in effect on load
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className={`editorial-dna-dashboard ${visible ? "hl-visible" : ""}`}>
            <Navbar />

            <main className="editorial-main-dna">
                {/* --- 1st Image: Hero Section with Titles & DNA Helix --- */}
                <section className="hl-hero-section-dna">
                    <div className="hero-typography-dna hl-anim hl-d1">
                        <h1 className="hero-main-title-dna">
                            <span className="metallic-text-dna">COMMIT</span>
                            <span className="green-metallic-outline-dna">DNA</span>
                        </h1>
                        <p className="hero-subtitle-dna">The Developer DNA Analytics Platform</p>
                    </div>

                    {/* Active Metallic DNA Helix Model (Right Side) */}
                    <div className="dna-helix-metallic-visual hl-anim hl-d3" aria-hidden="true">
                        {/* DNA emoji as placeholder for metallic visualization */}
                        🧬
                    </div>
                </section>

                {/* --- 2nd Image: Clean Editorial Grid (Removed Parts) --- */}
                <section className="editorial-content-grid-dna hl-anim hl-d5">
                    {/* Column 1: Vertical Philosophy & Vision (Image 3 Concept) */}
                    <div className="grid-col label-col-vertical-dna">
                        <h2 className="label-vertical-dna">PHILOSOPHY [2026]</h2>
                        <h3 className="section-title-brief-dna">ABOUT US</h3>
                    </div>

                    {/* Column 2: Mission Paragraph (Image 3 Context) */}
                    <div className="grid-col mission-text-brief-dna">
                        <p className="editorial-para-dna text-justify">
                            [D] Commit DNA is a contemporary developer analytics platform
                            founded on the principle of self-awareness. We fuse Git history
                            data with behavioral patterns, visualizing identities rather than
                            judging performance. Known for striking visuals and bold design,
                            we help developers carve a space for those who embrace intent,
                            wear focus, and defy ordinary coding burnout patterns.
                        </p>
                    </div>

                    {/* Column 3: The Metrics (Pure Editorial Typography) */}
                    <div className="grid-col metrics-text-brief-dna">
                        <p className="editorial-para-dna text-justify">
                            We merge the precision of traditional metrics with a fearless,
                            contemporary approach. We provide burnout preventative insights—fusing
                            classic techniques with modern aesthetics—enabling tastemakers and
                            teams worldwide to prioritize sustainable growth over sheer speed.
                            Our vision is to redefine how developers interact with their own patterns.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;