import { Link, NavLink } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./AboutUs.css";

export default function  AboutUS({
  logo,img1,img2,img3,port4,port5,port6,port7,port8,port9,port10,port11,port12,
}) {
  return (
    <>
      

      <section className="text-center py-5 bg-secondary text-white landing">
        <h1 className="landing1">Welcome To Shariki</h1>
      </section>
      <section className="container-fluid py-5 text-center">
        <div className="row g-4">
          <div className="col-md-4">
            <img src={img1} width="50" />
            <h3>Share Your Property Vision</h3>
            <p>
              From cozy family homes to luxury apartments — tell us what you
              dream of, and we’ll make it a reality..
            </p>
          </div>
          <div className="col-md-4">
            <img src={img2} width="50" />
            <h3>We Handle Everything For You</h3>
            <p>
              From property search and legal paperwork to interior design and
              handover — we take care of every detail so you don't have to
              worry..
            </p>
          </div>
          <div className="col-md-4">
            <img src={img3} width="50" />
            <h3>Your Property, Everywhere</h3>
            <p>
              Whether you want to live, invest, or rent — your real estate
              portfolio can grow across cities and countries with ease..
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

          {/* Row 1 */}
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img src={port4} className="img-fluid rounded" alt="Investment" />
            </div>
            <div className="col-md-6 order-md-1 text-start">
              <p>We offer collective real estate investment.</p>
              <p>The investment ranges from 1% to 100%.</p>
              <p>We provide this investment to all segments of society.</p>
              <p>
                It provides an opportunity for foreign investors looking for
                suitable opportunities.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img
                src={port5}
                className="img-fluid rounded"
                alt="Platform Projects"
              />
            </div>
            <div className="col-md-6 text-start">
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
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img
                src={port6}
                className="img-fluid rounded"
                alt="Real Estate Shares"
              />
            </div>
            <div className="col-md-6 order-md-1 text-start">
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
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img src={port7} className="img-fluid rounded" alt="Investment" />
            </div>
            <div className="col-md-6 order-md-1 text-start">
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
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img
                src={port8}
                className="img-fluid rounded"
                alt="Platform Projects"
              />
            </div>
            <div className="col-md-6 text-start">
              <p>Raising financial literacy about collective investment.</p>
              <p> Broader participation of investors</p>
            </div>
          </div>

          {/* Row 6 */}
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img
                src={port9}
                className="img-fluid rounded"
                alt="Real Estate Shares"
              />
            </div>
            <div className="col-md-6 order-md-1 text-start">
              <p>Raising financial literacy about collective investment.</p>
              <p> Broader participation of investors</p>
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
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img
                src={port10}
                className="img-fluid rounded"
                alt="Investment"
              />
            </div>
            <div className="col-md-6 order-md-1 text-start">
              <p>
                A legal agency to monitor the contract in more than one province
              </p>
              <p>The site takes a 2% commission on the sale</p>
            </div>
          </div>

          {/* Row 8 */}
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img
                src={port11}
                className="img-fluid rounded"
                alt="Platform Projects"
              />
            </div>
            <div className="col-md-6 text-start">
              <p>
                The site charges a one-month fee for the annual rental and 10%
                for a rental period of one month or more.
              </p>
            </div>
          </div>

          {/* Row 9 */}
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img
                src={port12}
                className="img-fluid rounded"
                alt="Real Estate Shares"
              />
            </div>
            <div className="col-md-6 order-md-1 text-start">
              <p>
                Holders of a license from the Ministry of Supply, Company
                Register 2222
              </p>
              <p> Holders of a tax number from the Ministry of Finance 2222</p>
            </div>
          </div>
        </div>
      </section>

     
      <footer className="bg-black text-white text-center py-3 ">
        <p className="end">
          @ 2025 <span>Shariki</span> All Right Reserved
        </p>
      </footer>
    </>
  );
}
