import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CurvedLoop from "../../components/CurvedLoop"
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Intro() {
  const sofas = [
    {
      id: 1,
      img: "/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg",
      name: "Sofa Name One",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.7 (71)",
    },
    {
      id: 2,
      img: "/images/best-selling-small-house-plan-77400-familyhomeplans.com_.jpg",
      name: "Sofa Name Two",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.8 (71)",
    },
    {
      id: 3,
      img: "/images/SL-toddwilson041-ed381b825b954c7b9ed4749ed4d7deb5.jpeg",
      name: "Sofa Name Three",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.6 (71)",
    },
    {
      id: 4,
      img: "/images/tricoasthouse-1070x713.jpg",
      name: "Sofa Name Four",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.5 (71)",
    },
    {
      id: 5,
      img: "/images/w800x533.jpg",
      name: "Sofa Name Five",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.9 (71)",
    },
    {
      id: 6,
      img: "/images/w991x660.jpg",
      name: "Sofa Name Six",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.7 (71)",
    },
  ];

  const topSofas = [
    {
      title: "Leather Sofas",
      desc: "Durable, stylish, and sophisticated, they bring a touch of luxury to any room.",
      img: "/images/2012-11.webp",
    },
    {
      title: "Fabric Sofas",
      desc: "Soft, versatile, and available in a wide range of colours and patterns, perfect for a cozy atmosphere.",
      img: "/images/SL-toddwilson041-ed381b825b954c7b9ed4749ed4d7deb5.jpeg",
    },
    {
      title: "Velvet Sofas",
      desc: "With their sumptuous texture and rich colours, they add a touch of glamour to your living space.",
      img: "/images/Vivaldi_125.webp",
    },
    {
      title: "All Materials",
      desc: "Explore our extensive collection of sofas, featuring a diverse range of materials to suit every style.",
      img: "/images/villa-cover-Ae-240522.jpg",
    },
  ];

  const rating = [
    {
      img: "/images/b79ecc579a16690901ae9628378cb27597f4950d.jpg",
      icon: "/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      homeName: "house1",
      cousName: "Rewa shalian",
      area: "200m²",
    },
    {
      img: "/images/6c2e183ba4f9c91ae0754f084fdbe7628107ad83.jpg",
      icon: "/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      area: "200m²",
      homeName: "house2",
      cousName: "Adnan alrashi",
    },
    {
      img: "/images/7b3eae7371557f6a343f5e43d1d8c5b86edcddb9.jpg",
      area: "200m²",
      icon: "/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      homeName: "house3",
      cousName: "Ghina mogahed",
    },
    {
      img: "/images/9ffbae04537cd88487d542f9ba4a5a80e469f87e.png",
      area: "200m²",
      icon: "/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      homeName: "house4",
      cousName: "Rama othman",
    },
  ];

  const rating2 = [
    {
      img: "/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg",
      area: "200m²",
    },
    {
      img: "/images/FONDS_GOUVART-_21.webp",
      area: "200m²",
    },
    {
      img: "/images/SL-toddwilson041-ed381b825b954c7b9ed4749ed4d7deb5.jpeg",
      area: "200m²",
    },
    {
      img: "/images/tricoasthouse-1070x713.jpg",
      area: "200m²",
    },
    {
      img: "/images/villa-cover-Ae-240522.jpg",
      area: "200m²",
    },
    {
      img: "/images/Vivaldi_125.webp",
      area: "200m²",
    },
    {
      img: "/images/FONDS_GOUVART-_21.webp",
      area: "200m²",
    },
    {
      img: "/images/2012-11.webp",
      area: "200m²",
    },
  ];

  const bottomSofas = [
    {
      title: "Unique Sofa One",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: "£943 • £39.29/mo (24 months)",
      img: "/images/141429.jpg",
    },
    {
      title: "Unique Sofa Two",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: "£943 • £39.29/mo (24 months)",
      img: "/images/FONDS_GOUVART-_21.webp",
    },
    {
      title: "Unique Sofa Three",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: "£943 • £39.29/mo (24 months)",
      img: "/images/2012-11.webp",
    },
  ];

  const brands = [
    { name: "Brand Name One", img: "/images/FONDS_GOUVART-_21.webp" },
    { name: "Brand Name Two", img: "/images/villa-cover-Ae-240522.jpg" },
    { name: "Brand Name Three", img: "/images/2012-11.webp" },
  ];

  const thumbs = [
    "/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg",
    "/images/Vivaldi_125.webp",
    "/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg",
    "/images/w800x533.jpg",
    "/images/Vivaldi_125.webp",
  ];

  return (
    <div className="container intro-container">
      <section className="intro-section ">
        <div className="intro-text ">
          <h2>Best Selling Houses</h2>
          <p>Get inspired by our most loved houses</p>
          <Link to="/houses" className="link">
            View all houses
          </Link>
          <br />
          <br />
          <br />
        </div>

        <div className="intro-swiper">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            effect="fade"
            speed={1500}
            loop={true}
            className="sofa-swiper"
          >
            {sofas.map((sofa) => (
              <SwiperSlide key={sofa.id}>
                <div className="sofa-card">
                  <img src={sofa.img} alt={sofa.name} className="img-fluid" />
                  <h3>{sofa.name}</h3>
                  <p className="desc">{sofa.desc}</p>
                  <p className="price">{sofa.price}</p>
                  <p className="rating">{sofa.rating}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <div className="par2 my-5">
        <h2>Shop houses by number of floors</h2>
        <p>
          Discover the perfect sofa material to match your style and lifestyle.
          From luxurious leather to sumptuous velvet, soft chenille, and
          textured jumbo cord, the options are endless. Whether you prefer the
          sleek look of leather, the opulent feel of velvet, the casual charm of
          chenille, or the rugged appeal of jumbo cord, there's a sofa material
          out there for you. Explore a wide range of textures, patterns, and
          colours to find the one that complements your home's unique aesthetic.
        </p>
      </div>
      <div className="sofa-section">
        <div className="top-section row g-4">
          {topSofas.map((sofa, i) => (
            <div className="col-lg-3 col-md-6 col-sm-12" key={i}>
              <div className="sofa-card2 h-100">
                <img
                  className="img2 img-fluid"
                  src={sofa.img}
                  alt={sofa.title}
                />
                <h3>{sofa.title}</h3>
                <p>{sofa.desc}</p>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* <CurvedLoop marqueeText="get inspaerd with SHARIKI ✦" /> */}

      <div className="area my-5">
        <h2 className="my-5">Shop houses by Area</h2>
        <p>
          Discover the perfect sofa material to match your style and lifestyle.
          From luxurious leather to sumptuous velvet, soft chenille, and
          textured jumbo cord, the options are endless. Whether you prefer the
          sleek look of leather, the opulent feel of velvet, the casual charm of
          chenille, or the rugged appeal of jumbo cord, there's a sofa material
          out there for you. Explore a wide range of textures, patterns, and
          colours to find the one that complements your home's unique aesthetic.
        </p>
        <div className="slide-card4 row g-4 mt-4">
          {rating2.map((home, i) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={i}>
              <div className="u h-100 rounded overflow-hidden">
                <img className="img5 img-fluid" src={home.img} alt="house" />
                <h4 className="position-absolute bottom-200 start-50 translate-middle-x bg-white p-2 rounded-pill shadow-sm">
                  {home.area}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="sofa-brands row align-items-center my-5 g-4 border-top pt-4">
        <div className="text-side col-lg-4 col-md-5">
          <h2>
            Home <br /> Brands
          </h2>
          <p>
            Get inspired by exploring our exclusive homes designed in
            partnership with some of Britain's most iconic brands.
          </p>
          <button className="btn btn-dark brands-btn">View all brands</button>
        </div>

        <div className="brands-side col-lg-8 col-md-7 row g-4">
          {brands.map((b, i) => (
            <div key={i} className="col-lg-4 col-md-6 col-sm-12">
              <div className="brand-card h-100 border rounded p-3 text-center">
                <img src={b.img} alt={b.name} className="img-fluid mb-2" />
                <p className="mb-0">{b.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="guides-section my-5 bg-light p-4 rounded-3">
        <div className="guides-inner row align-items-center g-4">
          <div className="guides-left col-md-6">
            <h3 className="guides-title">
              5 Ways to create a cosy living room
            </h3>
            <p className="guides-sub">
              Small changes, big comfort — ideas and styling tips to make your
              space warm and welcoming.
            </p>
          </div>

          <div
            className="guides-strip col-md-6 d-flex flex-column align-items-center"
            role="group"
            aria-label="Guides preview"
          >
            <div className="guides-thumbs d-flex justify-content-center gap-2">
              {thumbs.map((src, i) => (
                <div
                  className="thumb rounded overflow-hidden"
                  style={{ width: "60px", height: "60px" }}
                  key={i}
                >
                  <img
                    src={src}
                    alt={`Guide thumb ${i + 1}`}
                    className="img-fluid"
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary mt-3 rounded-pill"
              aria-label="Read Guide"
            >
              Read Guide
            </button>
          </div>
        </div>
      </section>

      <div className="section9 my-5">
        <div className="top-cards row g-4">
          <div className="col-md-6">
            <div className="card2">
              <img
                src="/images/villa-cover-Ae-240522.jpg"
                alt="Sofa 1"
                className="img-fluid custom-img-radius"
              />
              <div className="card-text-area">
                <p className="fw-bold fs-5 text-dark">
                  Discover how to care for your new sofa
                </p>
                <button className="btn custom-black-btn">
                  Explore care guides
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card2">
              <img
                src="/images/FONDS_GOUVART-_21.webp"
                alt="Sofa 2"
                className="img-fluid custom-img-radius"
              />
              <div className="card-text-area">
                <p className="fw-bold fs-5 text-dark">
                  Create the perfect look for your home
                </p>
                <button className="btn custom-black-btn">
                  Sign up to our design newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="inspired my-5 text-center">
        <h2>Be inspired</h2>
        <p>Be inspired by our customers</p>
        <div className="inspired-cards row g-3 mt-3">
          <div className="inspired-card col-lg-3 col-md-6 col-sm-6">
            <img
              src="/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg"
              alt="Inspiration 1"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="inspired-card col-lg-3 col-md-6 col-sm-6">
            <img
              src="/images/FONDS_GOUVART-_21.webp"
              alt="Inspiration 2"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="inspired-card col-lg-3 col-md-6 col-sm-6">
            <img
              src="/images/villa-cover-Ae-240522.jpg"
              alt="Inspiration 3"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="inspired-card col-lg-3 col-md-6 col-sm-6">
            <img
              src="/images/best-selling-small-house-plan-77400-familyhomeplans.com_.jpg"
              alt="Inspiration 4"
              className="img-fluid rounded shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
