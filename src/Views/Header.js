import './Header.css';

import logo from '../assets/images/logo512.png';
import letterV from '../assets/images/letterV.png';

function Header() {
    return (
        <header className="header">

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

            <div className="hero">

                <div className="hero-left">

                    <h1>
                        Websites
                        <br />
                        powered by
                        <br />
                        AI.
                    </h1>

                    <p className="hero-subtext">
                        Beautiful websites, intelligent automation,
                        and modern digital experiences.
                    </p>

                    <button className="project-btn">
                        START A PROJECT →
                    </button>

                </div>

                <div className="hero-center">

                    <img
                        src={letterV}
                        alt="3D Letter V"
                        className="hero-image"
                    />

                </div>

                <div className="hero-right">

                    <div className="info-card">

                        <h3>FIRSTWEB</h3>

                        <p>
                            AI websites
                            <br />
                            built for speed,
                            <br />
                            automation,
                            <br />
                            and growth.
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Header;