import { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const activeStyles = {
    fontWeight: "bold",
    color: "#161616",
    borderRadius: "50px",
    padding: "7px 7px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  };



  return (
    <>
      <header className="main-header">
        <div className="logo">
          <img src="/public/images/download.png" alt="Logo" />
        </div>

        <div
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`main-nav-links ${menuOpen ? "show-menu" : ""}`}>
          <NavLink to="/" style={({ isActive }) => (isActive ? activeStyles : null)}>
            Home
          </NavLink>
          <NavLink to="/host" style={({ isActive }) => (isActive ? activeStyles : null)}>
            My houses
          </NavLink>
          <NavLink to="/houses" style={({ isActive }) => (isActive ? activeStyles : null)}>
            Houses
          </NavLink>
          <NavLink to="/aboutus" style={({ isActive }) => (isActive ? activeStyles : null)}>
            AboutUS
          </NavLink>
          <NavLink to="/sellyourHouse" style={({ isActive }) => (isActive ? activeStyles : null)}>
            sell your house
          </NavLink>
          <NavLink to="/myRequests" style={({ isActive }) => (isActive ? activeStyles : null)}>
            My request
          </NavLink>
        </nav>

        <div className="nav-actions">
          <NavLink
            to="/Login"
            className="user-icon-link"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            <span className="user-icon">👤</span>
          </NavLink>
          <NavLink
            to="/logout"
            className="logout-icon-link"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            <span className="logout-icon">🔓</span>
          </NavLink>

        </div>
      </header>

      <div className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          src="https://www.pexels.com/download/video/3217431/"
        />
        <h1 className="display-1 fw-bold Shariki">Shariki Real Estate</h1>
        <div className="features-boxs">
          <div className="feature-item">
            🏡 <br />
            Free property visits <br />
            <small>Tour before you decide</small>
          </div>

          <div className="feature-item">
            ⭐ <br />
            5000+ homes sold & rented <br />
            <small>Trusted by families</small>
          </div>

          <div className="feature-item">
            💰 <br />
            Best market prices <br />
            <small>Invest smart, live better</small>
          </div>
        </div>
      </div>
    </>
  );
}
