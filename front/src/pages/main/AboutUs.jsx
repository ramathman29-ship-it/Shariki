import "../../style/AboutUs.css";

export default function AboutUS() {
  return (
    <>
      <section className="container-fluid py-5 text-center about-top">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4 about-card">
            <img
              className="about-img"
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&auto=format&fit=crop&q=60"
              alt="Property Vision"
            />
            <h3>Share Your Property Vision</h3>
            <p>
              From cozy family homes to luxury apartments — tell us what you
              dream of, and we’ll make it a reality.
            </p>
          </div>

          <div className="col-md-4 about-card">
            <img
              className="about-img"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60"
              alt="We Handle Everything"
            />
            <h3>We Handle Everything For You</h3>
            <p>
              From property search and legal paperwork to interior design and
              handover — we handle every detail.
            </p>
          </div>

          <div className="col-md-4 about-card">
            <img
              className="about-img"
              src="https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?w=600&auto=format&fit=crop&q=60"
              alt="Your Property Everywhere"
            />
            <h3>Your Property, Everywhere</h3>
            <p>
              Whether you want to live, invest, or rent — your portfolio can
              grow across cities and countries.
            </p>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-5 text-center">
        <div className="container">
          <h2 className="portfolio-title mb-4">What do we offer</h2>
          <p className="portfolio-sub mb-5">
            If you do it right, it will last forever.
          </p>
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6 order-md-2">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Investment"
              />
            </div>

            <div className="col-md-6 order-md-1 text-start feature-text">
              <h4>Smart Real Estate Investment</h4>
              <p>We offer collective real estate investment.</p>
              <p>The investment ranges from 1% to 100%.</p>
              <p>Accessible to all segments of society.</p>
              <p>Ideal for foreign investors seeking opportunities.</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1757264119016-7e6b568b810d?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Platform Projects"
              />
            </div>

            <div className="col-md-6 text-start feature-text">
              <h4>Real Estate Project Platform</h4>
              <p>
                This platform allows companies to showcase their real estate
                projects.
              </p>
              <p>
                We offer a system that divides real estate into small shares.
              </p>
              <p>Multiple investors can purchase limited shares securely.</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6 order-md-2">
              <img
                src="https://plus.unsplash.com/premium_photo-1748729621135-57a3168c9fbd?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Real Estate Shares"
              />
            </div>

            <div className="col-md-6 order-md-1 text-start feature-text">
              <h4>Secure Property Ownership</h4>
              <p>
                Each investor owns a legally registered share in their name.
              </p>
              <p>
                Returns are provided proportionate to the investor’s share
                percentage.
              </p>
              <p>
                We offer sales, purchase, and rental services in the real estate
                market.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-5 text-center">
        <div className="container">
          <h2 className="portfolio-title mb-4">Our Features</h2>
          <p className="portfolio-sub mb-5">
            If you do it right, it will last forever.
          </p>

          {/* Row 4 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6 order-md-2">
              <img
                src="https://plus.unsplash.com/premium_photo-1748265769172-62e9e2bba756?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Investment Accessibility"
              />
            </div>

            <div className="col-md-6 order-md-1 text-start feature-text">
              <h4>Accessible Investment Opportunities</h4>
              <p>
                Making real estate investment accessible to a wider segment of
                the population.
              </p>
              <p>
                Providing additional income opportunities for families through
                profit sharing.
              </p>
            </div>
          </div>

          {/* Row 5 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6">
              <img
                src="https://plus.unsplash.com/premium_photo-1746387628298-af5695a3f935?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Financial Literacy"
              />
            </div>

            <div className="col-md-6 text-start feature-text">
              <h4>Financial Awareness & Growth</h4>
              <p>Raising financial literacy about collective investment.</p>
              <p>Encouraging broader participation of investors.</p>
            </div>
          </div>

          {/* Row 6 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6 order-md-2">
              <img
                src="https://images.unsplash.com/photo-1766848834880-59e1632d92a8?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Investor Participation"
              />
            </div>

            <div className="col-md-6 order-md-1 text-start feature-text">
              <h4>Inclusive Investment Community</h4>
              <p>Raising financial literacy about collective investment.</p>
              <p>Encouraging broader participation of investors.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-5 text-center">
        <div className="container">
          <h2 className="portfolio-title mb-4">Our Rules</h2>
          <p className="portfolio-sub mb-5">
            If you do it right, it will last forever.
          </p>

          {/* Row 7 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6 order-md-2">
              <img
                src="https://plus.unsplash.com/premium_photo-1661906314543-dd6b588f3556?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Legal Supervision"
              />
            </div>

            <div className="col-md-6 order-md-1 text-start feature-text">
              <h4>Legal Transparency & Trust</h4>
              <p>
                A legal agency monitors all contracts across multiple provinces.
              </p>
              <p>The platform applies a 2% commission on property sales.</p>
            </div>
          </div>

          {/* Row 8 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6">
              <img
                src="https://plus.unsplash.com/premium_photo-1733342586521-6d04831831bd?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Rental Fees Policy"
              />
            </div>

            <div className="col-md-6 text-start feature-text">
              <h4>Transparent Rental Fees</h4>
              <p>
                The platform charges a one-month fee for annual rentals and a
                10% fee for rental periods of one month or more.
              </p>
            </div>
          </div>

          {/* Row 9 */}
          <div className="row align-items-center mb-5 feature-row">
            <div className="col-md-6 order-md-2">
              <img
                src="https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=600&auto=format&fit=crop&q=60"
                className="img-fluid feature-img"
                alt="Official Licensing"
              />
            </div>

            <div className="col-md-6 order-md-1 text-start feature-text">
              <h4>Official Licensing & Registration</h4>
              <p>
                Licensed by the Ministry of Supply under Company Register No.
                2222.
              </p>
              <p>
                Registered with the Ministry of Finance under Tax Number 2222.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
