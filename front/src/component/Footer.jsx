import "../style/Footer.css";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="estate-footer">
      <div className="container">
        <div className="row footer-top">
          {/* Brand */}
          <div className="col-md-4 ">
            <NavLink to="/" className="logo">
              <img src="/public/images/download.png" alt="Logo" />
            </NavLink>
            <p>
              Premium real estate solutions for buying, selling and investing in
              properties with confidence.
            </p>

            <div className="contact-info">
              <span>📍 King Of Prussia, PA</span>
              <span>📞 +1 234 567 890</span>
              <span>✉️ info@estatelux.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 footer-links">
            <h5>Company</h5>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Our Agents</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-md-3 footer-links">
            <h5>Services</h5>
            <ul>
              <li>
                <a href="#">Buy Property</a>
              </li>
              <li>
                <a href="#">Sell Property</a>
              </li>
              <li>
                <a href="#">Rent Homes</a>
              </li>
              <li>
                <a href="#">Property Valuation</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-3 footer-newsletter">
            <h5>Newsletter</h5>
            <p>Get exclusive listings & market insights</p>
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © 2026 EstateLux. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
