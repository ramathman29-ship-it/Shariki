import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

export default function Intro() {
  const sofas = [
    {
      id: 1,
      img: "/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg",
      name: "Sofa Name One",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.7 (71)"
    },
    {
      id: 2,
      img: "/images/best-selling-small-house-plan-77400-familyhomeplans.com_.jpg",
      name: "Sofa Name Two",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.8 (71)"
    },
    {
      id: 3,
      img: "/images/SL-toddwilson041-ed381b825b954c7b9ed4749ed4d7deb5.jpeg",
      name: "Sofa Name Three",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.6 (71)"
    },
    {
      id: 4,
      img: "/images/tricoasthouse-1070x713.jpg",
      name: "Sofa Name Four",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.5 (71)"
    },
    {
      id: 5,
      img: "/images/w800x533.jpg",
      name: "Sofa Name Five",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.9 (71)"
    },
    {
      id: 6,
      img: "/images/w991x660.jpg",
      name: "Sofa Name Six",
      desc: "Japanese style wooden underframe sofa with cotton upholstery",
      price: "£943 · £39.29/mo (24 months)",
      rating: "⭐ 4.7 (71)"
    }
  ];

     const topSofas = [
    {
      title: "Leather Sofas",
      desc: "Durable, stylish, and sophisticated, they bring a touch of luxury to any room.",
      img: "/images/sddefault.jpg",
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
    {
      title: "All Materials",
      desc: "Explore our extensive collection of sofas, featuring a diverse range of materials to suit every style.",
      img: "/images/SL-toddwilson041-ed381b825b954c7b9ed4749ed4d7deb5.jpeg",
    }
  ];

  const rating=[
    {
      img:"/images/b79ecc579a16690901ae9628378cb27597f4950d.jpg",
      icon:"/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      homeName:"house1",
      cousName:"Rewa shalian",
      area:"200m²"
    },
    {
      img:"/images/6c2e183ba4f9c91ae0754f084fdbe7628107ad83.jpg",
      icon:"/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      area:"200m²",
      homeName:"house2",
      cousName:"Adnan alrashi"
    },
    {
      img:"/images/7b3eae7371557f6a343f5e43d1d8c5b86edcddb9.jpg",
      area:"200m²",
      icon:"/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      homeName:"house3",
      cousName:"Ghina mogahed"
    },
    {
      img:"/images/9ffbae04537cd88487d542f9ba4a5a80e469f87e.png",
      area:"200m²",
      icon:"/images/admin-icon-avatar-icon-human-icon-login-icon-user-icon-brown-beige-table-rectangle-circle-png-clipart.jpg",
      homeName:"house4",
      cousName:"Rama othman"
    }
  ];

  const rating2=[
    {
      img:"/images/ae205a50-53b3-11ec-9aff-3d50541531a0-luxury-property.jpg",
      area:"200m²"
    },
    {
      img:"/images/FONDS_GOUVART-_21.webp",
      area:"200m²"
    },
    {
      img:"/images/SL-toddwilson041-ed381b825b954c7b9ed4749ed4d7deb5.jpeg",
      area:"200m²"
    },
    {
      img:"/images/tricoasthouse-1070x713.jpg",
      area:"200m²"
    },
    {
      img:"/images/villa-cover-Ae-240522.jpg",
      area:"200m²"
    },
    {
      img:"/images/6c2e183ba4f9c91ae0754f084fdbe7628107ad83.jpg",
      area:"200m²",
    },
    {
      img:"/images/7b3eae7371557f6a343f5e43d1d8c5b86edcddb9.jpg",
      area:"200m²",
    },
    {
      img:"/images/9ffbae04537cd88487d542f9ba4a5a80e469f87e.png",
      area:"200m²",
    }
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
    { name: "Brand Name One", img: "/images/6c2e183ba4f9c91ae0754f084fdbe7628107ad83.jpg" },
    { name: "Brand Name Two", img: "/images/7b3eae7371557f6a343f5e43d1d8c5b86edcddb9.jpg" },
    { name: "Brand Name Three", img: "/images/9ffbae04537cd88487d542f9ba4a5a80e469f87e.png" },
  ];

   const thumbs = [
    "/images/w800x533.jpg",
    "/images/w991x660.jpg",
    "/images/w800x533.jpg",
    "/images/w991x660.jpg",
    "/images/w800x533.jpg",
  ];
  

  return (
    <div className="intro-container">
      <div className="par1">
        <h2>Houses</h2>
        <p>
          Discover the perfect home for your budget with Shariki, Shariki leading
          specialist sofa retailer. Whether you’re searching for a spacious
          corner sofa for family gatherings, a compact two-seater recliner for
          cosy nights in, or a timeless three-piece leather suite, our extensive
          collection has something for every style and space. Explore thousands
          of stunning sofas in a wide range of styles, sizes, colours, leathers,
          and fabrics—all designed for comfort, quality, and lasting value. Find
          your ideal sofa today and enjoy exclusive offers, expert advice, and
          fast delivery with Shariki.
        </p>
      </div>

      <section className="intro-section">
        <div className="intro-text">
          <h2>Best Selling Houses</h2>
          <p>Get inspired by our most loved houses</p>
          <Link to="/houses" className="link">
            View all houses
          </Link>
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
                  <img src={sofa.img} alt={sofa.name}/>
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
      <div className="par2">
      <h2>Shop houses by number of floors</h2>
      <p>Discover the perfect sofa material to match your style and lifestyle. From luxurious leather to sumptuous velvet, soft chenille, and textured jumbo cord, the options are endless. Whether you prefer the sleek look of leather, the opulent feel of velvet, the casual charm of chenille, or the rugged appeal of jumbo cord, there's a sofa material out there for you. Explore a wide range of textures, patterns, and colours to find the one that complements your home's unique aesthetic.</p>
      </div>
       <div className="sofa-section">

      <div className="top-section">
        {topSofas.map((sofa, i) => (
          <div className="sofa-card2" key={i}>
            <img className="img2" src={sofa.img} alt={sofa.title} />
            <h3>{sofa.title}</h3>
            <p>{sofa.desc}</p>
          </div>
        ))}
      </div>

      <div className="bottom-section">
        <div className="text-block">
          <h2>
            Looking for
            <br />
            something unique?
          </h2>
          <p>
            From zebra striped 3D velvet to teddy bear boucle – and even the
            softest ribbed faux fur.
          </p>
          <Link to="/houses" className="link2">View our unique sofas</Link>
        </div>

        <Swiper
          modules={[Pagination, EffectFade, Autoplay]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="sofa-swiper2"
        >
          {bottomSofas.map((sofa, i) => (
            <SwiperSlide key={i}>
              <div  className="slide-card2">
                <img className="img3" src={sofa.img} alt={sofa.title} />
                <h4>{sofa.title}</h4>
                <p>{sofa.desc}</p>
                <span>{sofa.price}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div> 
    <div className="rating2">
            <div className="box rating-star">
              <span className="ll" >5.0 Rating</span>
              <img className="star" src="/images/download (2).png" alt="star"/>
              Trustpilot
            </div>

            <div className="box rating-card">
               {rating.map((sofa)=> (
                 <div  className="slide-card3">
                  <div className="o">
                <img className="img4" src={sofa.img} alt="house" />
                </div>
                <div className="oo">
                <h3>{sofa.homeName}</h3>
                <span className="ooo">{sofa.cousName}</span>
                </div>
              </div>
               ))}             
            </div>
            </div>
            <div className="area">
              <h2>Shop houses by Area</h2>
              <p>
                Discover the perfect sofa material to match your style and lifestyle.
                From luxurious leather to sumptuous velvet, soft chenille, and textured jumbo cord,
                the options are endless. Whether you prefer the sleek look of leather,
                the opulent feel of velvet, the casual charm of chenille, or the rugged appeal of jumbo cord, there's a sofa material out there for you.
                Explore a wide range of textures, patterns, and colours to find the one that complements your home's unique aesthetic.
              </p>
                <div className="slide-card4">
              {rating2.map((home)=>(
                <div className="u">
                  <img className="img5" src={home.img} alt="house" />
                  <h4>{home.area}</h4>
                </div>
            ))}
                </div>
            </div>

             <section className="sofa-brands">
      <div className="text-side">
        <h2>
          Home <br /> Brands
        </h2>
        <p>
          Get inspired by exploring our exclusive homes designed in partnership
          with some of Britain's most iconic brands.
        </p>
        <button className="brands-btn">View all brands</button>
      </div>

      <div className="brands-side">
        {brands.map((b, i) => (
          <div key={i} className="brand-card">
            <img src={b.img} alt={b.name} />
            <p>{b.name}</p>
          </div>
        ))}
      </div>
    </section>
     <section className="guides-section">
      <div className="guides-inner">
        {/* left text column */}
        <div className="guides-left">
          <h3 className="guides-title">5 Ways to create a cosy living room</h3>
          <p className="guides-sub">
            Small changes, big comfort — ideas and styling tips to make your space warm and welcoming.
          </p>
        </div>

        {/* right strip with thumbs and centered pill button */}
        <div className="guides-strip" role="group" aria-label="Guides preview">
          <div className="guides-thumbs">
            {thumbs.map((src, i) => (
              <div className="thumb" key={i}>
                <img src={src} alt={`Guide thumb ${i + 1}`} />
              </div>
            ))}
          </div>

          <button className="read-btn" aria-label="Read Guide">Read Guide</button>
        </div>
      </div>
    </section>
     <div className="section9">
      <div className="top-cards">
        <div className="card2">
          <img src="/images/7b3eae7371557f6a343f5e43d1d8c5b86edcddb9.jpg" alt="Sofa 1" />
          <p>Discover how to care for your new home</p>
          <button>Explore care guides</button>
        </div>
        <div className="card2">
          <img src="/images/a2e6dbf968c17214957f4e6022560958a3a66ac8.jpg" alt="Sofa 2" />
          <p>Create the perfect look for your home</p>
          <button>Sign up to our design newsletter</button>
        </div>
    </div>
    </div>
      <div className="inspired">
        <h2>Be inspired</h2>
        <p>Be inspired by our customers</p>
        <div className="inspired-cards">
          <div className="inspired-card"><img src="/images/a2e6dbf968c17214957f4e6022560958a3a66ac8.jpg" alt="Inspiration 1" /></div>
          <div className="inspired-card"><img src="/images/a2e6dbf968c17214957f4e6022560958a3a66ac8.jpg" alt="Inspiration 2" /></div>
          <div className="inspired-card"><img src="/images/a2e6dbf968c17214957f4e6022560958a3a66ac8.jpg" alt="Inspiration 3" /></div>
          <div className="inspired-card"><img src="/images/a2e6dbf968c17214957f4e6022560958a3a66ac8.jpg" alt="Inspiration 4" /></div>
        </div>
      </div>
    </div>
  );
}
