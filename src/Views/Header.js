import './Header.css';

import logo from '../assets/images/logo512.png';
import HeroV from './HeroV';

function Header() {
    return (
        <header className="header">

            {/* Animated Background — the 3D V now lives here, full-bleed */}
            <div className="background">

                <div className="background-glow"></div>

                <HeroV className="hero-canvas" />

                <div className="grid-overlay"></div>

            </div>

            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <div className="brand">

                    <img
                        src={logo}
                        alt="FirstWeb Logo"
                        className="logo"
                    />

                    <div className="brand-text">

                        <h2>firstweb</h2>

                        <p>automate everything.</p>

                    </div>

                </div>

                <div className="nav-buttons">

                    <button className="talk-btn">
                        LET'S TALK
                    </button>

                    <button className="menu-btn">
                        MENU
                    </button>

                </div>

            </nav>

            {/* ================= HERO ================= */}
            {/* Text now sits directly on top of the full-page V background */}

            <section className="hero">

                <div className="hero-left">

                    <p className="hero-label">
                        WEBSITES POWERED BY AI
                    </p>

                    <h1>
                        Websites
                        <br />
                        powered by
                        <br />
                        AI.
                    </h1>

                    <p className="hero-subtext">

                        Beautiful websites powered by artificial intelligence,
                        automation, and modern design that help businesses
                        scale faster.

                    </p>

                    <button className="project-btn">

                        START A PROJECT →

                    </button>

                </div>

            </section>

        </header>
    );
}

export default Header;